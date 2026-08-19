import { NextResponse } from "next/server";
import { isStickyNoteAdmin } from "@/lib/sticky-note-admin";

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await isStickyNoteAdmin())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const { id } = await params;
  if (!UUID_PATTERN.test(id)) {
    return NextResponse.json({ error: "Invalid note ID." }, { status: 400 });
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.json(
      { error: "Board is not configured." },
      { status: 503 },
    );
  }

  const response = await fetch(
    `${supabaseUrl}/rest/v1/sticky_notes?id=eq.${id}`,
    {
      method: "DELETE",
      headers: {
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`,
      },
    },
  );
  if (!response.ok) {
    console.error("Unable to delete sticky note", await response.text());
    return NextResponse.json(
      { error: "Unable to remove note." },
      { status: 503 },
    );
  }

  return new NextResponse(null, { status: 204 });
}
