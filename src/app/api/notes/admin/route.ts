import { NextResponse } from "next/server";
import {
  clearStickyNoteAdminCookie,
  isStickyNoteAdmin,
  matchesStickyNoteAdminPassword,
  setStickyNoteAdminCookie,
} from "@/lib/sticky-note-admin";

export async function GET() {
  return NextResponse.json({ isAdmin: await isStickyNoteAdmin() });
}

export async function POST(request: Request) {
  const body = (await request.json()) as { password?: unknown };
  if (!matchesStickyNoteAdminPassword(body.password)) {
    return NextResponse.json({ error: "Invalid password." }, { status: 401 });
  }

  await setStickyNoteAdminCookie();
  return NextResponse.json({ isAdmin: true });
}

export async function DELETE() {
  await clearStickyNoteAdminCookie();
  return new NextResponse(null, { status: 204 });
}
