import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

const ADMIN_COOKIE = "portfolio_sticky_notes_admin";

function tokenFor(password: string) {
  return createHmac("sha256", password)
    .update("portfolio-sticky-notes-admin-v1")
    .digest("base64url");
}

export async function isStickyNoteAdmin() {
  const password = process.env.NOTES_ADMIN_PASSWORD;
  const cookie = (await cookies()).get(ADMIN_COOKIE)?.value;
  if (!password || !cookie) return false;

  const expected = tokenFor(password);
  return (
    cookie.length === expected.length &&
    timingSafeEqual(Buffer.from(cookie), Buffer.from(expected))
  );
}

export async function setStickyNoteAdminCookie() {
  const password = process.env.NOTES_ADMIN_PASSWORD;
  if (!password) return false;

  (await cookies()).set(ADMIN_COOKIE, tokenFor(password), {
    httpOnly: true,
    maxAge: 60 * 60 * 8,
    path: "/",
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
  });
  return true;
}

export async function clearStickyNoteAdminCookie() {
  (await cookies()).delete(ADMIN_COOKIE);
}

export function matchesStickyNoteAdminPassword(password: unknown) {
  return (
    typeof password === "string" &&
    Boolean(process.env.NOTES_ADMIN_PASSWORD) &&
    password === process.env.NOTES_ADMIN_PASSWORD
  );
}
