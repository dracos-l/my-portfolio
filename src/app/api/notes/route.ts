import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const MAX_MESSAGE_LENGTH = 180;
const MAX_NAME_LENGTH = 40;
const MAX_NOTES = 12;
const POST_LIMIT_PER_HOUR = 3;
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000;
const attemptsByIp = new Map<string, number[]>();

type DatabaseNote = {
  id: string;
  message: string;
  author_name: string | null;
  position_x: number;
  position_y: number;
};

type Note = {
  id: string;
  message: string;
  authorName: string | null;
  positionX: number;
  positionY: number;
};

const requiredEnvironment = [
  "SUPABASE_URL",
  "SUPABASE_SERVICE_ROLE_KEY",
  "OPENAI_API_KEY",
  "RESEND_API_KEY",
  "NOTES_EMAIL_TO",
  "NOTES_EMAIL_FROM",
] as const;

function isConfigured() {
  return requiredEnvironment.every((key) => Boolean(process.env[key]));
}

function mapNote(note: DatabaseNote): Note {
  return {
    id: note.id,
    message: note.message,
    authorName: note.author_name,
    positionX: note.position_x,
    positionY: note.position_y,
  };
}

function escapeHtml(value: string) {
  return value.replace(/[&<>'"]/g, (character) => {
    const entities: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      "'": "&#39;",
      '"': "&quot;",
    };
    return entities[character];
  });
}

function isRateLimited(ip: string) {
  const now = Date.now();
  const recentAttempts = (attemptsByIp.get(ip) ?? []).filter(
    (timestamp) => now - timestamp < RATE_LIMIT_WINDOW_MS,
  );

  if (recentAttempts.length >= POST_LIMIT_PER_HOUR) return true;

  recentAttempts.push(now);
  attemptsByIp.set(ip, recentAttempts);
  return false;
}

async function moderate(message: string) {
  const response = await fetch("https://api.openai.com/v1/moderations", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      input: message,
      model: "omni-moderation-latest",
    }),
  });

  if (!response.ok) throw new Error("Moderation service unavailable");

  const result = (await response.json()) as {
    results?: Array<{ flagged?: boolean }>;
  };
  return result.results?.[0]?.flagged === false;
}

async function sendEmail(note: Note) {
  const author = note.authorName
    ? `From: ${escapeHtml(note.authorName)}`
    : "From: A visitor";
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: process.env.NOTES_EMAIL_FROM,
      to: [process.env.NOTES_EMAIL_TO],
      subject: "New portfolio sticky note",
      html: `<p><strong>${author}</strong></p><p>${escapeHtml(note.message).replace(/\n/g, "<br />")}</p>`,
    }),
  });

  if (!response.ok) throw new Error("Email delivery failed");
}

function configurationError() {
  return NextResponse.json(
    { error: "The sticky-note board has not been configured yet." },
    { status: 503 },
  );
}

export async function GET() {
  if (!isConfigured()) return configurationError();
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !supabaseKey) return configurationError();

  try {
    const response = await fetch(
      `${supabaseUrl}/rest/v1/sticky_notes?select=id,message,author_name,position_x,position_y&status=eq.published&order=created_at.desc&limit=${MAX_NOTES}`,
      {
        headers: {
          apikey: supabaseKey,
          Authorization: `Bearer ${supabaseKey}`,
        },
        cache: "no-store",
      },
    );
    if (!response.ok) throw new Error("Database read failed");

    const notes = ((await response.json()) as DatabaseNote[]).map(mapNote);
    return NextResponse.json({ notes });
  } catch (error) {
    console.error("Unable to load sticky notes", error);
    return NextResponse.json(
      { error: "The sticky-note board is temporarily unavailable." },
      { status: 503 },
    );
  }
}

export async function POST(request: Request) {
  if (!isConfigured()) return configurationError();
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !supabaseKey) return configurationError();

  const forwardedFor = request.headers.get("x-forwarded-for");
  const ip = forwardedFor?.split(",")[0]?.trim() || "unknown";
  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: "Please wait before posting another note." },
      { status: 429 },
    );
  }

  try {
    const body = (await request.json()) as {
      authorName?: unknown;
      message?: unknown;
      website?: unknown;
      positionX?: unknown;
      positionY?: unknown;
    };
    if (body.website) return NextResponse.json({ note: null }, { status: 201 });

    const message = typeof body.message === "string" ? body.message.trim() : "";
    const authorName =
      typeof body.authorName === "string" ? body.authorName.trim() : "";
    const positionX =
      typeof body.positionX === "number" &&
      Number.isFinite(body.positionX) &&
      body.positionX >= 0 &&
      body.positionX <= 1
        ? body.positionX
        : 0.5;
    const positionY =
      typeof body.positionY === "number" &&
      Number.isFinite(body.positionY) &&
      body.positionY >= 0 &&
      body.positionY <= 1
        ? body.positionY
        : 0.28;

    if (!message || message.length > MAX_MESSAGE_LENGTH) {
      return NextResponse.json(
        {
          error: `Notes must be between 1 and ${MAX_MESSAGE_LENGTH} characters. Please reach out by email if you have more to say.`,
        },
        { status: 400 },
      );
    }
    if (authorName.length > MAX_NAME_LENGTH) {
      return NextResponse.json(
        { error: `Names cannot exceed ${MAX_NAME_LENGTH} characters.` },
        { status: 400 },
      );
    }

    if (!(await moderate(message))) {
      return NextResponse.json(
        { error: "This note could not be posted." },
        { status: 400 },
      );
    }

    const response = await fetch(`${supabaseUrl}/rest/v1/sticky_notes`, {
      method: "POST",
      headers: {
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`,
        "Content-Type": "application/json",
        Prefer: "return=representation",
      },
      body: JSON.stringify({
        message,
        author_name: authorName || null,
        position_x: positionX,
        position_y: positionY,
        status: "published",
      }),
    });
    if (!response.ok) throw new Error("Database write failed");

    const [createdNote] = (await response.json()) as DatabaseNote[];
    const note = mapNote(createdNote);

    try {
      await sendEmail(note);
    } catch (error) {
      // Keep the note public after a successful save; investigate the logged delivery failure.
      console.error("Sticky-note email failed", error);
    }

    return NextResponse.json({ note }, { status: 201 });
  } catch (error) {
    console.error("Unable to create sticky note", error);
    return NextResponse.json(
      { error: "Your note could not be posted. Please try again later." },
      { status: 503 },
    );
  }
}
