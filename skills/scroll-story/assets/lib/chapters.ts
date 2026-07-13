/**
 * The single source of truth for the story's chapters, in scroll order.
 * Drives the navigation, the progress rail, and the ambient per-chapter
 * background. Adding a chapter = one entry here + one section component.
 *
 * TEMPLATE — replace the ids, labels, questions and tones with the project's.
 * Six to eight chapters is the working range.
 */

export type ChapterId =
  | "hero"
  | "about"
  | "vision"
  | "mission"
  | "values"
  | "work"
  | "coming-soon"
  | "contact";

export interface Chapter {
  id: ChapterId;
  /** Two-digit index shown as a mono label, e.g. "01". */
  index: string;
  /** Short nav / rail label. */
  label: string;
  /** The single question this chapter answers — write it before you design it. */
  question: string;
  /** Ambient tone. Alternate light/dark to give the journey a pulse. */
  tone: "light" | "dark";
}

export const CHAPTERS: Chapter[] = [
  { id: "hero", index: "00", label: "Enter", question: "Welcome.", tone: "light" },
  { id: "about", index: "01", label: "About", question: "Who are we?", tone: "dark" },
  { id: "vision", index: "02", label: "Vision", question: "Where are we going?", tone: "light" },
  { id: "mission", index: "03", label: "Mission", question: "Why were we created?", tone: "light" },
  { id: "values", index: "04", label: "Values", question: "What do we believe?", tone: "light" },
  { id: "work", index: "05", label: "Work", question: "What do we create?", tone: "light" },
  { id: "coming-soon", index: "06", label: "Coming Soon", question: "What comes next?", tone: "dark" },
  { id: "contact", index: "07", label: "Contact", question: "Why should you care?", tone: "dark" },
];

/** Chapters shown in the nav (the hero is reachable via the logo). */
export const NAV_CHAPTERS = CHAPTERS.filter((c) => c.id !== "hero");
