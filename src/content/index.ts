export * from "./types";
export { site, type Site } from "./site";
export { projects, projectBySlug, type CaseStudy, type CaseStudyStory } from "./projects";
export {
  verses,
  concepts,
  shankara,
  stoic,
  verseById,
  type Verse,
  type Concept,
  type Reading,
  type Word,
  type AttributedVerse,
} from "./philosophy";
export { howIThink, type Habit } from "./howIThink";
export {
  pairings,
  question as philosophyEngineeringQuestion,
  answer as philosophyEngineeringAnswer,
  type Pairing,
} from "./philosophyEngineering";
export { journey, journeyNote, type Milestone } from "./journey";
export { stack, type StackGroup, type StackItem } from "./stack";
export {
  books,
  categories,
  booksByCategory,
  shelfIsEmpty,
  shelfNote,
  type Book,
  type Category,
} from "./library";
export {
  commands,
  resolveCommand,
  prompt as terminalPrompt,
  banner as terminalBanner,
  notFound as terminalNotFound,
  type Command,
} from "./terminal";
