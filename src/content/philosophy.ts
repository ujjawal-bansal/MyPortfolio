import type { Citation } from "./types";

/**
 * Everything here traces to docs/SOURCES.md. Nothing goes in this file that is not
 * in that one — no exceptions, no "I'm fairly sure I've seen this".
 *
 * Section title: "Thoughts worth sitting with". The interaction is deliberate —
 * the verse appears, the translation arrives late, and the explanation only if asked.
 * Where readings differ, every reading is reachable. None is presented as the answer.
 */

export interface Word {
  devanagari: string;
  iast: string;
  gloss: string;
}

export interface Reading {
  /** School, scholar, or era — whoever holds this reading. */
  label: string;
  body: string;
}

export interface Verse {
  id: string;
  devanagari: string;
  iast: string;
  /** Diacritic-free, for running text and for anyone who does not read IAST. */
  plain: string;
  words: readonly Word[];
  /** The literal sense before anyone smooths it out. */
  literal: string;
  /** The translation most readers will have met. */
  translation: string;
  citation: Citation;
  /** Shown before the explanation. The visitor chooses to open it. */
  prompt: string;
  /** Two or three lines. What the verse is doing, not what it "really means". */
  context: string;
  /** Present when the sentence is genuinely contested. Rendered as alternatives, never ranked. */
  readings?: readonly Reading[];
  /** Fuller quotation, so the line is not stranded without its sentence. */
  inContext?: { devanagari: string; iast: string; translation: string };
}

export const verses: readonly Verse[] = [
  {
    id: "prajnanam-brahma",
    devanagari: "प्रज्ञानं ब्रह्म",
    iast: "prajñānaṃ brahma",
    plain: "Prajnanam Brahma",
    words: [
      {
        devanagari: "प्रज्ञानम्",
        iast: "prajñānam",
        gloss: "consciousness, cognition, awareness — from pra- + √jñā, to know",
      },
      { devanagari: "ब्रह्म", iast: "brahma", gloss: "Brahman, the ground of everything" },
    ],
    literal: "Consciousness — Brahman. Sanskrit supplies no 'is'; the two words are simply set side by side.",
    translation: "Consciousness is Brahman.",
    citation: {
      text: "Aitareya Upaniṣad",
      location: "3.3",
      tradition: "Ṛgveda",
      note: "Also cited as 3.1.3 in editions that number a section inside the third chapter. Same sentence.",
    },
    prompt: "What do you think this means?",
    context:
      "It is the last clause of a long sentence, not a slogan. The passage has just run through everything there is — gods, elements, creatures, whatever moves and whatever stands still — and says all of it is guided by consciousness and founded on consciousness. Then this.",
    readings: [
      {
        label: "On the word itself",
        body: "The whole claim rests on prajñāna. Read it as 'consciousness' and the verse says awareness is fundamental. Read it as 'knowledge' or 'wisdom' and it says something different about what knowing finally is. The English translation has already decided.",
      },
      {
        label: "One Advaita reading",
        body: "That knowledge of Brahman is not an intuition of Brahman — there is no gap across which to intuit. The knowing is the thing known. This is a reading, not a summary.",
      },
    ],
    inContext: {
      devanagari: "प्रज्ञानेत्रो लोकः प्रज्ञा प्रतिष्ठा प्रज्ञानं ब्रह्म",
      iast: "prajñānetro lokaḥ prajñā pratiṣṭhā prajñānaṃ brahma",
      translation:
        "The world is guided by consciousness. Consciousness is the foundation. Consciousness is Brahman.",
    },
  },

  {
    id: "aham-brahmasmi",
    devanagari: "अहं ब्रह्मास्मि",
    iast: "ahaṃ brahmāsmi",
    plain: "Aham Brahmasmi",
    words: [
      { devanagari: "अहम्", iast: "aham", gloss: "I" },
      { devanagari: "ब्रह्म", iast: "brahma", gloss: "Brahman — here the predicate" },
      { devanagari: "अस्मि", iast: "asmi", gloss: "I am" },
    ],
    literal: "I — Brahman — am.",
    translation: "I am Brahman.",
    citation: {
      text: "Bṛhadāraṇyaka Upaniṣad",
      location: "1.4.10",
      tradition: "Śukla Yajurveda",
    },
    prompt: "What do you think this means?",
    context:
      "Quoted alone it sounds like the largest possible claim a person could make about themselves. In the passage it is not a person speaking at all: it is what Brahman knows about itself at the beginning, and the text then extends it to whoever realises the same thing.",
    readings: [
      {
        label: "Śaṅkara",
        body: "The brahman here is nirguṇa — without attributes, unconditioned. Not a deity being claimed kinship with.",
      },
      {
        label: "Viśiṣṭādvaita and others",
        body: "The sentence is accepted, the identity read as inseparability rather than strict sameness. The self is not other than Brahman; it is also not simply Brahman.",
      },
      {
        label: "What it is not",
        body: "On no traditional reading is this a sentence about the ego. If anything it is the opposite claim — the 'I' doing the asserting is precisely what is in question.",
      },
    ],
    inContext: {
      devanagari: "ब्रह्म वा इदमग्र आसीत्, तदात्मानमेवावेत्, अहं ब्रह्मास्मीति",
      iast: "brahma vā idam agra āsīt, tad ātmānam evāvet, ahaṃ brahmāsmīti",
      translation: "Brahman was this in the beginning. It knew only itself: 'I am Brahman.'",
    },
  },

  {
    id: "tat-tvam-asi",
    devanagari: "तत्त्वमसि",
    iast: "tat tvam asi",
    plain: "Tat Tvam Asi",
    words: [
      { devanagari: "तत्", iast: "tat", gloss: "that — neuter" },
      { devanagari: "त्वम्", iast: "tvam", gloss: "you" },
      { devanagari: "असि", iast: "asi", gloss: "you are" },
    ],
    literal: "That you are.",
    translation: "That thou art.",
    citation: {
      text: "Chāndogya Upaniṣad",
      location: "6.8.7",
      tradition: "Sāmaveda",
      note: "Repeated nine times, closing each of the nine teachings from 6.8 to 6.16.",
    },
    prompt: "Three people have read this sentence three ways. Want to see how?",
    context:
      "A father, Uddālaka Āruṇi, teaching his son Śvetaketu, and saying it nine times — once at the end of each of nine attempts to get at the same point. It is also the most contested sentence in this collection, and the disagreement is grammatical before it is theological.",
    readings: [
      {
        label: "Advaita — Śaṅkara",
        body: "'You are That.' The self and Brahman are the same. This is the mainstream reading and the one most English speakers have met.",
      },
      {
        label: "Dvaita — Madhva",
        body: "Splits the sandhi differently: sa ātmā atat tvam asi — 'that is the self; you are not that.' The written syllables permit both splits. Identical text, opposite conclusion.",
      },
      {
        label: "Brereton, 1986",
        body: "'That's how you are, Śvetaketu' — taking tat adverbially, since neuter tat does not straightforwardly agree with masculine tvam. Olivelle and Doniger follow him. On this reading Śvetaketu exists in the same manner as everything else, which is a quieter claim than identity.",
      },
    ],
    inContext: {
      devanagari: "स य एषोऽणिमैतदात्म्यमिदं सर्वं तत्सत्यं स आत्मा तत्त्वमसि श्वेतकेतो इति",
      iast: "sa ya eṣo'ṇimaitadātmyam idaṃ sarvaṃ tat satyaṃ sa ātmā tat tvam asi śvetaketo iti",
      translation:
        "That which is the finest essence — this whole world has that as its self. That is the truth. That is the self. That you are, Śvetaketu.",
    },
  },

  {
    id: "ayam-atma-brahma",
    devanagari: "अयमात्मा ब्रह्म",
    iast: "ayam ātmā brahma",
    plain: "Ayam Atma Brahma",
    words: [
      { devanagari: "अयम्", iast: "ayam", gloss: "this" },
      { devanagari: "आत्मा", iast: "ātmā", gloss: "the self" },
      { devanagari: "ब्रह्म", iast: "brahma", gloss: "Brahman" },
    ],
    literal: "This self — Brahman.",
    translation: "This self is Brahman.",
    citation: {
      text: "Māṇḍūkya Upaniṣad",
      location: "2",
      tradition: "Atharvaveda",
      note: "Twelve mantras in a single section, so it is cited as both '2' and '1.2'. The same statement also occurs at Bṛhadāraṇyaka Upaniṣad 4.4.5.",
    },
    prompt: "What do you think this means?",
    context:
      "This is a heading, not a conclusion. The sentence it belongs to ends '…and this self has four quarters', and the rest of the Upaniṣad is that analysis: waking, dream, deep sleep, and a fourth. Quoting the first half alone removes the structure it was announcing.",
    readings: [
      {
        label: "On the fourth",
        body: "Turīya, 'the fourth', is not a fourth state alongside the other three so much as what the other three are states of. Which is either profound or a dodge, depending on the morning.",
      },
      {
        label: "On its history",
        body: "The Māṇḍūkya is not attested independently of Gauḍapāda's commentary, around the 6th century CE, which has shaped every subsequent reading. Its own date is genuinely unsettled — proposals run from the late 5th century BCE to the early centuries CE.",
      },
    ],
    inContext: {
      devanagari: "सर्वं ह्येतद् ब्रह्मायमात्मा ब्रह्म सोऽयमात्मा चतुष्पात्",
      iast: "sarvaṃ hyetad brahma ayam ātmā brahma so'yam ātmā catuṣpāt",
      translation: "All this is indeed Brahman. This self is Brahman. This self has four quarters.",
    },
  },

  {
    id: "neti-neti",
    devanagari: "नेति नेति",
    iast: "neti neti",
    plain: "Neti Neti",
    words: [
      { devanagari: "न", iast: "na", gloss: "not" },
      {
        devanagari: "इति",
        iast: "iti",
        gloss: "the quotative particle — closes a quoted item, roughly '…thus', '…so it is said'",
      },
    ],
    literal:
      "'Not' — thus. Twice. Closer to \"'no' — that's the word\" than to a flat negation: a verdict passed on whatever was just offered.",
    translation: "Not this, not this.",
    citation: {
      text: "Bṛhadāraṇyaka Upaniṣad",
      location: "2.3.6",
      tradition: "Śukla Yajurveda",
      note: "Recurs in the same Upaniṣad, notably at 3.9.26.",
    },
    prompt: "What do you think is left?",
    context:
      "A method rather than a despair, and the passage proves it: immediately after the double negation the text turns round and hands over a name — 'the truth of truth'. The negation was clearing ground, not salting it.",
    readings: [
      {
        label: "Śaṅkara",
        body: "What is negated is the limiting adjunct, the upādhi — every description that would fence the thing in. Not the self. You cannot negate the one doing the negating.",
      },
      {
        label: "A narrower reading",
        body: "The verses just before this describe Brahman's two forms, the formed and the formless. On that reading 'not this, not this' dismisses those two descriptions specifically, rather than every description whatsoever.",
      },
      {
        label: "Why an engineer might care",
        body: "It is bisection. You do not find the fault by staring harder at the program; you find it by halving the space of things it could be until what remains has nowhere left to hide.",
      },
    ],
    inContext: {
      devanagari: "अथात आदेशो नेति नेति, न ह्येतस्मादिति नेत्यन्यत्परमस्ति",
      iast: "athāta ādeśo neti neti, na hyetasmād iti nety anyat param asti",
      translation:
        "Now therefore the teaching: not this, not this. For there is nothing higher than this — that it is 'not this'.",
    },
  },
];

export interface Concept {
  id: string;
  devanagari: string;
  iast: string;
  plain: string;
  /** One line. What it is. */
  short: string;
  /** Three or four lines. What it is, carefully. */
  body: string;
  /** The word English reaches for, and why it misleads. Often the most useful field here. */
  mistranslation?: { word: string; why: string };
}

export const concepts: readonly Concept[] = [
  {
    id: "atman",
    devanagari: "आत्मन्",
    iast: "ātman",
    plain: "Atman",
    short: "The self that is left when everything you can point at has been subtracted.",
    body: "Not personality, not memory, not body, not the story you tell about yourself — those are all things you can hold at arm's length and describe, which is precisely the disqualification. Advaita holds ātman to be identical with Brahman. Other Vedānta schools hold the individual self to be real but distinct, and Sāṃkhya holds that selves are genuinely plural. The disagreement is old and unresolved.",
    mistranslation: {
      word: "soul",
      why: "It imports a frame — created, individual, in need of saving — that ātman does not carry.",
    },
  },
  {
    id: "brahman",
    devanagari: "ब्रह्मन्",
    iast: "brahman",
    plain: "Brahman",
    short: "The ground of everything: what things arise from, persist in, and return to.",
    body: "Neuter — and worth separating from two words English tends to blur it with: Brahmā, the masculine creator deity, and brāhmaṇa, the priestly class. Three different words. Later Vedānta describes Brahman positively as sat-cit-ānanda, being-consciousness-fullness, and negatively by neti neti. Both descriptions are admitted to be inadequate; the second is just honest about it.",
    mistranslation: {
      word: "God",
      why: "On most readings Brahman is not a person, does not act, and does not want anything.",
    },
  },
  {
    id: "maya",
    devanagari: "माया",
    iast: "māyā",
    plain: "Maya",
    short: "Not that the world is unreal — that its reality is borrowed.",
    body: "Śaṅkara's stock image is a rope mistaken for a snake in dim light. The rope is genuinely there. The snake is a misreading, not a hallucination of nothing, and the fear it produces is real fear. The world is empirically real, vyāvahārika, and 'unreal' only relative to Brahman, pāramārthika. Worth knowing: the heavily systematised version most people meet is largely post-Śaṅkara — Prakāśātman in the 13th century is credited with formalising it, and scholars including Hacker and Nakamura note that this gets read back onto Śaṅkara, who leans more on avidyā, ignorance.",
    mistranslation: {
      word: "illusion",
      why: "It overstates the claim and makes the tradition sound sillier than it is. The rope is still there.",
    },
  },
  {
    id: "sakshi",
    devanagari: "साक्षिन्",
    iast: "sākṣin",
    plain: "Sakshi",
    short: "The witness: the awareness states appear in, which is never itself one of them.",
    body: "Not the experiencer, not the experienced, not the act of experiencing. The standard image is light — it reveals objects without becoming them, and without being altered by what it lands on. It works as a teaching device more than a metaphysical entity, and the device is this: you cannot get behind it. Whatever you manage to observe is, by that very fact, not the observer.",
  },
];

/**
 * One verse attributed to Śaṅkara. The attribution note is not optional decoration —
 * it ships wherever the verse ships. See docs/SOURCES.md.
 */
export interface AttributedVerse extends Omit<Verse, "readings" | "inContext"> {
  attribution: string;
}

export const shankara: AttributedVerse = {
  id: "nirvana-shatkam-1",
  devanagari:
    "मनोबुद्ध्यहङ्कारचित्तानि नाहं\nन च श्रोत्रजिह्वे न च घ्राणनेत्रे ।\nन च व्योमभूमिर्न तेजो न वायुः\nचिदानन्दरूपः शिवोऽहं शिवोऽहम् ॥",
  iast: "manobuddhyahaṅkāracittāni nāhaṃ\nna ca śrotrajihve na ca ghrāṇanetre\nna ca vyomabhūmir na tejo na vāyuḥ\ncidānandarūpaḥ śivo'haṃ śivo'ham",
  plain: "Nirvana Shatkam, verse 1",
  words: [],
  literal: "A list of things the speaker is not, ending in what is left.",
  translation:
    "I am not mind, intellect, ego or memory; not hearing or taste, not smell or sight; not space, earth, fire or air. I am awareness and fullness — Śiva I am, Śiva I am.",
  citation: {
    text: "Nirvāṇaṣaṭkam (Ātmaṣaṭkam)",
    location: "verse 1",
    note: "Traditionally attributed to Ādi Śaṅkara.",
  },
  attribution:
    "Traditionally attributed to Ādi Śaṅkara, though the attribution comes from hagiographies of the 15th–17th centuries rather than from text-critical evidence. Modern scholarship accepts as securely his the Brahmasūtrabhāṣya, the principal Upaniṣad commentaries, and the Upadeśasāhasrī. This is not in that group — which is worth saying, because 'Shankaracharya said' is said far too easily.",
  prompt: "What do you think is left at the end of that list?",
  context:
    "Neti neti set to metre. It subtracts the mind, then the senses, then the elements — and unlike most subtractions of this kind it arrives somewhere rather than nowhere.",
};

/** One Stoic line, with an exact citation. Used in the engineering writing, not as a quote wall. */
export const stoic = {
  greek: "Τῶν ὄντων τὰ μέν ἐστιν ἐφ' ἡμῖν, τὰ δὲ οὐκ ἐφ' ἡμῖν.",
  translation:
    "There are things which are within our power, and there are things which are beyond our power.",
  citation: {
    text: "Epictetus, Enchiridion",
    location: "ch. 1, opening",
    note: "Translated by Thomas Wentworth Higginson, 1890. Recent translators prefer 'up to us' for eph' hēmin — less grand, closer to the sense. The Enchiridion is Arrian's compilation from the Discourses, so this is Epictetus at one remove.",
  } satisfies Citation,
} as const;

/**
 * The four mahāvākyas, in canonical order — one from each Veda. `neti neti` is not one
 * of them (it is a method, not a "great saying"), so it stays out and keeps its own
 * moment elsewhere.
 */
export const mahavakyaIds = [
  "prajnanam-brahma",
  "aham-brahmasmi",
  "tat-tvam-asi",
  "ayam-atma-brahma",
] as const;

export const mahavakyas: readonly Verse[] = mahavakyaIds
  .map((id) => verses.find((verse) => verse.id === id))
  .filter((verse): verse is Verse => verse !== undefined);

export function verseById(id: string): Verse | undefined {
  return verses.find((v) => v.id === id);
}
