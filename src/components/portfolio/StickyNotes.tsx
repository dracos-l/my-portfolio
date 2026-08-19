"use client";

import {
  type DragEvent,
  type FormEvent,
  type PointerEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import { portfolio } from "@/data/portfolio";

const STICKY_NOTE_MAX_LENGTH = 180;

type StickyNote = {
  id: string;
  message: string;
  authorName: string | null;
  positionX: number;
  positionY: number;
};

type NotePosition = Pick<StickyNote, "positionX" | "positionY">;

export function StickyNotes() {
  const [notes, setNotes] = useState<StickyNote[]>([]);
  const [authorName, setAuthorName] = useState("");
  const [message, setMessage] = useState("");
  const [website, setWebsite] = useState("");
  const [status, setStatus] = useState<
    "idle" | "sending" | "success" | "error"
  >("idle");
  const [statusMessage, setStatusMessage] = useState("");
  const [isDraggingNote, setIsDraggingNote] = useState(false);
  const [isBoardDropTarget, setIsBoardDropTarget] = useState(false);
  const [dropPreview, setDropPreview] = useState<NotePosition | null>(null);
  const [foregroundNoteId, setForegroundNoteId] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminPassword, setAdminPassword] = useState("");
  const [adminError, setAdminError] = useState("");
  const boardRef = useRef<HTMLElement>(null);

  useEffect(() => {
    let isMounted = true;

    const loadNotes = async () => {
      try {
        const response = await fetch("/api/notes", { cache: "no-store" });
        if (!response.ok) return;

        const data = (await response.json()) as { notes: StickyNote[] };
        if (isMounted) setNotes(data.notes);
      } catch {
        // A note board should never prevent the rest of the portfolio from loading.
      }
    };

    const loadAdminState = async () => {
      try {
        const response = await fetch("/api/notes/admin", { cache: "no-store" });
        if (!response.ok) return;

        const data = (await response.json()) as { isAdmin: boolean };
        if (isMounted) setIsAdmin(data.isAdmin);
      } catch {
        // Owner controls are optional and should not affect the public board.
      }
    };

    void loadNotes();
    void loadAdminState();
    const interval = window.setInterval(() => void loadNotes(), 20_000);

    return () => {
      isMounted = false;
      window.clearInterval(interval);
    };
  }, []);

  const postNote = async (position: NotePosition) => {
    if (!message.trim()) return;

    setStatus("sending");
    setStatusMessage("");

    try {
      const response = await fetch("/api/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ authorName, message, website, ...position }),
      });
      const data = (await response.json()) as {
        note?: StickyNote;
        error?: string;
      };
      const note = data.note;

      if (!response.ok || !note) {
        throw new Error(data.error ?? "Your note could not be posted.");
      }

      setNotes((current) => [note, ...current].slice(0, 12));
      setAuthorName("");
      setMessage("");
      setStatus("success");
      setStatusMessage("Posted — thank you for reaching out.");
    } catch (error) {
      setStatus("error");
      setStatusMessage(
        error instanceof Error
          ? error.message
          : "Your note could not be posted.",
      );
    }
  };

  const positionForBoardPoint = (
    clientX: number,
    clientY: number,
  ): NotePosition => {
    const board = boardRef.current?.getBoundingClientRect();
    if (!board) return { positionX: 0.5, positionY: 0.28 };

    const clamp = (value: number, minimum: number, maximum: number) =>
      Math.min(Math.max(value, minimum), maximum);

    return {
      positionX: clamp((clientX - board.left) / board.width, 0.16, 0.84),
      positionY: clamp((clientY - board.top) / board.height, 0.06, 0.72),
    };
  };

  const isPointOverBoard = (clientX: number, clientY: number) => {
    const board = boardRef.current?.getBoundingClientRect();
    return Boolean(
      board &&
        clientX >= board.left &&
        clientX <= board.right &&
        clientY >= board.top &&
        clientY <= board.bottom,
    );
  };

  const startDrag = (event: DragEvent<HTMLButtonElement>) => {
    if (!message.trim()) {
      event.preventDefault();
      setStatus("error");
      setStatusMessage("Write your note before dragging it to the board.");
      return;
    }

    event.dataTransfer.effectAllowed = "copy";
    event.dataTransfer.setData("text/plain", "portfolio-sticky-note");
    setIsDraggingNote(true);
    setStatusMessage("");
  };

  const startTouchDrag = (event: PointerEvent<HTMLButtonElement>) => {
    if (event.pointerType === "mouse" || !event.isPrimary) return;
    if (!message.trim()) {
      setStatus("error");
      setStatusMessage("Write your note before dragging it to the board.");
      return;
    }

    event.currentTarget.setPointerCapture(event.pointerId);
    setIsDraggingNote(true);
    setStatusMessage("");
  };

  const moveTouchDrag = (event: PointerEvent<HTMLButtonElement>) => {
    if (event.pointerType === "mouse" || !isDraggingNote) return;

    if (isPointOverBoard(event.clientX, event.clientY)) {
      setIsBoardDropTarget(true);
      setDropPreview(positionForBoardPoint(event.clientX, event.clientY));
    } else {
      setIsBoardDropTarget(false);
      setDropPreview(null);
    }
  };

  const endTouchDrag = (event: PointerEvent<HTMLButtonElement>) => {
    if (event.pointerType === "mouse" || !isDraggingNote) return;

    const isOverBoard = isPointOverBoard(event.clientX, event.clientY);
    setIsDraggingNote(false);
    setIsBoardDropTarget(false);
    setDropPreview(null);

    if (isOverBoard) {
      void postNote(positionForBoardPoint(event.clientX, event.clientY));
    }
  };

  const signInAsOwner = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setAdminError("");

    try {
      const response = await fetch("/api/notes/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: adminPassword }),
      });
      if (!response.ok) throw new Error("That password did not work.");

      setIsAdmin(true);
      setAdminPassword("");
    } catch (error) {
      setAdminError(
        error instanceof Error ? error.message : "Unable to sign in.",
      );
    }
  };

  const signOutOwner = async () => {
    await fetch("/api/notes/admin", { method: "DELETE" });
    setIsAdmin(false);
  };

  const removeNote = async (id: string) => {
    if (!window.confirm("Remove this sticky note from the public board?")) {
      return;
    }

    try {
      const response = await fetch(`/api/notes/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Unable to remove this note.");
      setNotes((current) => current.filter((note) => note.id !== id));
    } catch (error) {
      setStatus("error");
      setStatusMessage(
        error instanceof Error ? error.message : "Unable to remove this note.",
      );
    }
  };

  const updateStickyPattern = (
    element: HTMLElement,
    clientX: number,
    clientY: number,
  ) => {
    const bounds = element.getBoundingClientRect();
    element.style.setProperty(
      "--pattern-x",
      `${(clientX - bounds.left) * -0.35}px`,
    );
    element.style.setProperty(
      "--pattern-y",
      `${(clientY - bounds.top) * -0.35}px`,
    );
  };

  return (
    <section
      aria-labelledby="sticky-notes-heading"
      className="section sticky-notes-section"
      id="stickies"
      onPointerMove={(event) =>
        updateStickyPattern(event.currentTarget, event.clientX, event.clientY)
      }
      onTouchMove={(event) => {
        const touch = event.touches[0];
        if (touch) {
          updateStickyPattern(
            event.currentTarget,
            touch.clientX,
            touch.clientY,
          );
        }
      }}
    >
      <p className="section-label">05 / Sticky board</p>
      <div className="section-content">
        <div className="sticky-notes-intro">
          <h2 id="sticky-notes-heading">Post a note!</h2>
          <p>
            Have a project, question, or just want to say hi? Add a sticky note
            to the board and it will land in my inbox.
          </p>
        </div>
        <div className="sticky-note-owner-access">
          {isAdmin ? (
            <button
              className="sticky-note-owner-signout"
              onClick={signOutOwner}
              type="button"
            >
              Owner mode · Sign out
            </button>
          ) : (
            <details>
              <summary>Owner access</summary>
              <form onSubmit={signInAsOwner}>
                <label htmlFor="sticky-note-owner-password">Password</label>
                <input
                  autoComplete="current-password"
                  id="sticky-note-owner-password"
                  onChange={(event) => setAdminPassword(event.target.value)}
                  type="password"
                  value={adminPassword}
                />
                <button type="submit">Enter</button>
                {adminError && <p>{adminError}</p>}
              </form>
            </details>
          )}
        </div>
        <div className="sticky-notes-content">
          <div
            className={`sticky-note-composer${isDraggingNote ? " is-dragging" : ""}`}
          >
            <label
              className="sticky-note-honeypot"
              htmlFor="sticky-note-website"
            >
              Website
              <input
                autoComplete="off"
                id="sticky-note-website"
                onChange={(event) => setWebsite(event.target.value)}
                tabIndex={-1}
                type="text"
                value={website}
              />
            </label>
            <label htmlFor="sticky-note-message">Your note</label>
            <textarea
              id="sticky-note-message"
              maxLength={STICKY_NOTE_MAX_LENGTH}
              onChange={(event) => setMessage(event.target.value)}
              placeholder="Write something worth pinning…"
              required
              rows={5}
              value={message}
            />
            <p
              aria-live="polite"
              className={`sticky-note-character-count${message.length === STICKY_NOTE_MAX_LENGTH ? " is-limit" : ""}`}
            >
              <span>
                {message.length}/{STICKY_NOTE_MAX_LENGTH}
              </span>
              {message.length === STICKY_NOTE_MAX_LENGTH && (
                <>
                  This sticky is full.{" "}
                  <a href={`mailto:${portfolio.email}`}>Reach out by email!</a>
                </>
              )}
            </p>
            <div className="sticky-note-composer-bottom">
              <label className="sticky-note-name" htmlFor="sticky-note-name">
                <span>
                  Name <em>(optional)</em>
                </span>
                <input
                  id="sticky-note-name"
                  maxLength={40}
                  onChange={(event) => setAuthorName(event.target.value)}
                  placeholder="Your name"
                  value={authorName}
                />
              </label>
            </div>
            <button
              className="sticky-note-drag-handle"
              draggable={status !== "sending"}
              onDragEnd={() => {
                setIsDraggingNote(false);
                setIsBoardDropTarget(false);
                setDropPreview(null);
              }}
              onDragStart={startDrag}
              onPointerCancel={endTouchDrag}
              onPointerDown={startTouchDrag}
              onPointerMove={moveTouchDrag}
              onPointerUp={endTouchDrag}
              type="button"
            >
              Drag this sticky onto the board ↘
            </button>
            {statusMessage && (
              <p
                aria-live="polite"
                className={`sticky-note-status is-${status}`}
              >
                {statusMessage}
              </p>
            )}
          </div>
          <section
            aria-label="Community whiteboard. Drag your completed sticky note here to post it."
            aria-live="polite"
            className={`sticky-note-board${isBoardDropTarget ? " is-drop-target" : ""}`}
            onDragLeave={() => {
              setIsBoardDropTarget(false);
              setDropPreview(null);
            }}
            onDragOver={(event) => {
              event.preventDefault();
              if (isDraggingNote) {
                setIsBoardDropTarget(true);
                setDropPreview(
                  positionForBoardPoint(event.clientX, event.clientY),
                );
              }
            }}
            onDrop={(event) => {
              event.preventDefault();
              setIsBoardDropTarget(false);
              setIsDraggingNote(false);
              setDropPreview(null);
              void postNote(
                positionForBoardPoint(event.clientX, event.clientY),
              );
            }}
            ref={boardRef}
          >
            <p className="sticky-note-board-label">Community whiteboard</p>
            {isDraggingNote && dropPreview && (
              <div
                aria-hidden="true"
                className="sticky-note-drop-preview"
                style={{
                  left: `${dropPreview.positionX * 100}%`,
                  top: `${dropPreview.positionY * 100}%`,
                }}
              />
            )}
            {notes.length ? (
              notes.map((note, index) => (
                <article
                  className="sticky-note"
                  key={note.id}
                  onBlur={() => setForegroundNoteId(null)}
                  onFocus={() => setForegroundNoteId(note.id)}
                  onMouseEnter={() => setForegroundNoteId(note.id)}
                  onMouseLeave={() => setForegroundNoteId(null)}
                  style={{
                    left: `${note.positionX * 100}%`,
                    top: `${note.positionY * 100}%`,
                    zIndex:
                      foregroundNoteId === note.id ? 100 : notes.length - index,
                  }}
                >
                  {isAdmin && (
                    <button
                      aria-label="Remove sticky note"
                      className="sticky-note-remove"
                      onClick={() => void removeNote(note.id)}
                      type="button"
                    >
                      ×
                    </button>
                  )}
                  <p>{note.message}</p>
                  <span>{note.authorName || "A visitor"}</span>
                </article>
              ))
            ) : (
              <p className="sticky-note-empty">
                The board is waiting for its first note.
              </p>
            )}
          </section>
        </div>
        <p className="sticky-notes-copyright">
          © {new Date().getFullYear()} {portfolio.name}
        </p>
      </div>
    </section>
  );
}
