/**
 * "How I think" — seven verbs. The section's job is to show that the philosophical
 * habits and the engineering habits are the same habits, without ever saying so.
 * Each entry pairs the thought with something concrete from the work.
 */

export interface Habit {
  id: string;
  /** One word, imperative. */
  verb: string;
  /** One line, shown with the verb. */
  line: string;
  /** Two or three sentences. Restrained. No lesson at the end. */
  body: string;
  /** Where this actually shows up — keeps the section from floating off. */
  inPractice?: string;
}

export const howIThink: readonly Habit[] = [
  {
    id: "build",
    verb: "Build",
    line: "An idea that stays an idea is indistinguishable from one that was wrong.",
    body: "I like the moment an idea stops being a conversation and becomes a thing with a URL. Mostly because that is when it starts telling you what you got wrong — an argument can be won, a deployment cannot.",
    inPractice:
      "QueueLite was interesting in the abstract for about a week. It became interesting in earnest the day a clinic started running on it.",
  },
  {
    id: "question",
    verb: "Question",
    line: "Convention is a cached answer. Sometimes the cache is stale.",
    body: "Most defaults are someone's old decision, made under constraints that may no longer exist. I am not against conventions — they are how anything gets done at speed — I just want to know which ones I am holding because they are right and which because they came with the template.",
    inPractice:
      "Everyone reaches for WebSockets when they hear 'live updates'. A clinic waiting room turned out to want polling, and saying so out loud took longer than implementing it.",
  },
  {
    id: "observe",
    verb: "Observe",
    line: "Debugging is mostly looking. So is the other thing.",
    body: "The hard part of a bug is rarely the fix; it is noticing what is actually happening rather than what you assumed was happening. The discipline of watching something without immediately explaining it turns out to be the same discipline in both halves of my life, which I did not expect.",
    inPractice:
      "The duplicate token numbers looked like a race condition for a while. They were a date boundary. The evidence had been there the whole time, filed under the wrong theory.",
  },
  {
    id: "learn",
    verb: "Learn",
    line: "Every project changes what the problem was.",
    body: "I have never finished something understanding it the way I did at the start. The useful output of a project is often not the project — it is the better version of the question, which you only get by having answered the worse one.",
  },
  {
    id: "simplify",
    verb: "Simplify",
    line: "What can be removed?",
    body: "Philosophy asks what is essential; engineering asks what can be deleted. They are the same question asked by people with different deadlines. Most of my better decisions have been subtractions, and none of them felt clever at the time.",
    inPractice:
      "Four Groq call sites in Lexora, deliberately countable. Every piece of reasoning I moved out of the model made the system easier to trust.",
  },
  {
    id: "accept",
    verb: "Accept",
    line: "Some of it is not up to you.",
    body: "The network, the vendor, the free tier that sleeps after fifteen minutes, the reviewer who will never reply. What is up to me is the design, the debugging, and what I do at 2am when the thing is down. The Stoics were writing about exile and illness, but the shape of the idea survives the translation to software.",
    inPractice: "Render's cold starts are not up to me. A cron job that keeps the service warm is.",
  },
  {
    id: "create",
    verb: "Create",
    line: "Eventually thought has to become something.",
    body: "Reading, thinking and arguing are all enjoyable enough to become a substitute for the work. At some point the loop has to close — you write the thing, sing the thing, ship the thing — or you have merely been entertained.",
  },
];
