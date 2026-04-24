// CEFR placement test data: 5 sections, 60 questions total.
// Sections 1 (vocab) & 4 (listening) are generated from existing word data.
// Sections 2 (grammar), 3 (reading), 5 (writing) are hand-written.
import { WORDS, type Word } from "@/data/words";
import { shuffle, isValidText } from "@/lib/store";

export type CefrLevel = "A1" | "A2" | "B1" | "B2";
export type SectionId = "vocab" | "grammar" | "reading" | "listening" | "writing";

export interface CefrQuestion {
  id: string;
  section: SectionId;
  prompt: string;
  /** Optional Bulgarian audio text — plays via TTS when provided (listening section). */
  audio?: string;
  /** Optional reading passage shown above the question (reading section). */
  passage?: { bg: string; en?: string } | null;
  options: string[];
  correct: number;
}

export const SECTIONS: { id: SectionId; label: string; emoji: string; count: number; description: string }[] = [
  { id: "vocab",     label: "Vocabulary",      emoji: "📚", count: 15, description: "Recognize Bulgarian words and pick their English meaning." },
  { id: "grammar",   label: "Grammar",         emoji: "🧩", count: 15, description: "Fill the blank: tenses, articles, pronouns, modals." },
  { id: "reading",   label: "Reading",         emoji: "📖", count: 10, description: "Read a short text and answer comprehension questions." },
  { id: "listening", label: "Listening",       emoji: "🎧", count: 10, description: "Listen to a Bulgarian sentence and pick the meaning." },
  { id: "writing",   label: "Writing / Active",emoji: "✍️", count: 10, description: "Pick the correct Bulgarian phrase for a real-life situation." },
];

// ---------- Section 1: Vocabulary recognition (auto from WORDS) ----------
function buildVocab(count: number): CefrQuestion[] {
  const tierA = WORDS.filter((w) => ["daily", "numbers", "food", "market"].includes(w.category));
  const tierB = WORDS.filter((w) => ["work", "healthcare", "education", "transport", "hospitality"].includes(w.category));
  const tierC = WORDS.filter((w) => ["government", "it", "mechanical", "construction"].includes(w.category));
  const valid = (w: Word) => isValidText(w.bg) && isValidText(w.en);
  const a = shuffle(tierA.filter(valid));
  const b = shuffle(tierB.filter(valid));
  const c = shuffle(tierC.filter(valid));
  const allEN = WORDS.filter(valid).map((w) => w.en);

  const result: CefrQuestion[] = [];
  const perTier = Math.floor(count / 3);
  const remainder = count - perTier * 3;
  const groups = [
    a.slice(0, perTier + (remainder > 0 ? 1 : 0)),
    b.slice(0, perTier + (remainder > 1 ? 1 : 0)),
    c.slice(0, perTier),
  ];

  groups.flat().forEach((w, i) => {
    const distractors = shuffle(allEN.filter((x) => x !== w.en)).slice(0, 3);
    const opts = shuffle([w.en, ...distractors]);
    result.push({
      id: `vocab-${i}-${w.bg}`,
      section: "vocab",
      prompt: `What does «${w.bg}» mean in English?`,
      options: opts,
      correct: opts.indexOf(w.en),
    });
  });
  return result;
}

// ---------- Section 4: Listening (hand-picked survival sentences) ----------
function buildListening(count: number): CefrQuestion[] {
  const PROMPTS: { bg: string; en: string; distractors: string[] }[] = [
    { bg: "Колко струва това?",                       en: "How much does this cost?",               distractors: ["Where is the shop?", "Do you have a bag?", "I want to pay."] },
    { bg: "Срещата е в десет часа.",                   en: "The meeting is at ten o'clock.",          distractors: ["The meeting is at two.", "The class starts in ten minutes.", "It costs ten lev."] },
    { bg: "Имам температура от два дни.",               en: "I have had a fever for two days.",        distractors: ["I have a headache today.", "I have an appointment in two days.", "My throat hurts a little."] },
    { bg: "Платете на гише номер три.",                 en: "Pay at counter number three.",            distractors: ["Wait at counter number three.", "The third floor is closed.", "Bring three copies."] },
    { bg: "Половин килограм сирене, моля.",             en: "Half a kilo of cheese, please.",          distractors: ["Half a kilo of butter, please.", "Two kilos of cheese, please.", "A bottle of water, please."] },
    { bg: "Утре ще отида на лекар.",                    en: "Tomorrow I will go to the doctor.",       distractors: ["Yesterday I went to the doctor.", "I am going to the pharmacy now.", "I have no doctor here."] },
    { bg: "Договорът е валиден до края на годината.",   en: "The contract is valid until the end of the year.", distractors: ["The contract starts next year.", "The deadline was last year.", "There is no contract."] },
    { bg: "Може ли касова бележка?",                    en: "Can I have a receipt?",                   distractors: ["Can I have a bag?", "Can I pay by card?", "Can you give me change?"] },
    { bg: "Завийте надясно след светофара.",             en: "Turn right after the traffic light.",     distractors: ["Turn left at the next street.", "Stop at the traffic light.", "Go straight to the square."] },
    { bg: "Депозитът е сто и петдесет лева.",            en: "The deposit is one hundred fifty levs.",  distractors: ["The rent is one hundred fifty levs.", "The deposit is fifty levs.", "The fee is five hundred levs."] },
    { bg: "Имате ли разрешение за пребиваване?",         en: "Do you have a residence permit?",         distractors: ["Do you have a Bulgarian passport?", "Do you have a translator?", "Do you have a contract?"] },
    { bg: "Ще се обадя след половин час.",               en: "I will call in half an hour.",            distractors: ["I called half an hour ago.", "I will arrive in half an hour.", "I'll wait for half an hour."] },
  ];
  const picked = shuffle(PROMPTS).slice(0, count);
  return picked.map((p, i) => {
    const opts = shuffle([p.en, ...p.distractors]);
    return {
      id: `listen-${i}`,
      section: "listening",
      prompt: "🎧 Listen and pick the meaning. (Tap ▶ to replay.)",
      audio: p.bg,
      options: opts,
      correct: opts.indexOf(p.en),
    };
  });
}

// ---------- Section 2: Grammar (hand-written, 30 questions — 15 picked per test) ----------
const GRAMMAR: Omit<CefrQuestion, "section">[] = [
  // A1/A2 — verb conjugation
  { id: "g1",  prompt: "Аз ___ студент от Германия.",                                  options: ["съм","си","е","сме"],                                          correct: 0 },
  { id: "g2",  prompt: "Тя не ___ добре български.",                                    options: ["говоря","говориш","говори","говорят"],                         correct: 2 },
  { id: "g3",  prompt: "Децата ___ в двора всеки ден.",                                 options: ["играе","играя","играят","играш"],                               correct: 2 },
  { id: "g4",  prompt: "— Госпожо, къде ___?",                                          options: ["отивам","отива","отиваш","отивате"],                            correct: 3 },
  // Pronouns — accusative / dative
  { id: "g5",  prompt: "Купих си нова книга и бързо ___ прочетох.",                     options: ["ме","те","го","я"],                                             correct: 3 },
  { id: "g6",  prompt: "Обадих се на Георги и ___ помолих за услуга.",                  options: ["му","ти","го","я"],                                             correct: 2 },
  { id: "g7",  prompt: "Виждам ___ всеки ден на пазара.",                               options: ["го","му","си","ти"],                                            correct: 0 },
  { id: "g8",  prompt: "— Ще ми дадеш ли шапката? — Да, ___ ти я дам.",                options: ["ще","ще дам","ще дам ти я","ще я ти дам"],                      correct: 0 },
  { id: "g9",  prompt: "— Ще донесеш ли играчката на детето? — Да, ___ донеса.",        options: ["ще му я","ще я му","ще донеса му я","ще донеса я му"],          correct: 0 },
  { id: "g10", prompt: "— Познаваш ли новия колега от Варна? — Не, ___ го познавам.",   options: ["него","не","го не","го"],                                       correct: 1 },
  // Definite articles
  { id: "g11", prompt: "Книга___ е на масата.",                                         options: ["а","ят","та","то"],                                             correct: 2 },
  { id: "g12", prompt: "Стол___ е счупен.",                                             options: ["а","ът","та","то"],                                             correct: 1 },
  { id: "g13", prompt: "Дете___ спи в стаята.",                                         options: ["а","ът","та","то"],                                             correct: 3 },
  { id: "g14", prompt: "— Ще купите ли този часовник? — Да, ще купя ___.",              options: ["часовниката","часовника","часовникът","часовниците"],           correct: 1 },
  { id: "g15", prompt: "— Кой сандвич искате? — ___.",                                  options: ["Топлия","Топълия","Топлиа","Топлият"],                          correct: 3 },
  // Numerals and agreement
  { id: "g16", prompt: "На покрива на училището ___ щъркела са свили гнездо.",          options: ["двама","две","два","двете"],                                    correct: 2 },
  { id: "g17", prompt: "Кажи ми ___ са приятелите ти.",                                 options: ["кой","коя","кое","кои"],                                        correct: 3 },
  { id: "g18", prompt: "— Колко души има в кабинета? — ___.",                           options: ["Двамата","Две","Два","Двама"],                                  correct: 3 },
  // Past tense
  { id: "g19", prompt: "Вчера аз ___ хляб от магазина.",                                options: ["купувам","купих","ще купя","купи"],                             correct: 1 },
  { id: "g20", prompt: "Миналата година ние ___ в Пловдив.",                             options: ["живеем","живяхме","ще живеем","живеят"],                        correct: 1 },
  { id: "g21", prompt: "— Защо снощи не дойде? — Много ___ ми се.",                     options: ["спеше","спи","ще спи","спях"],                                  correct: 0 },
  { id: "g22", prompt: "— Огняне, ходи ли на концерт вчера? — Не, ___ билети.",         options: ["нямаше","няма","нямах","няма да има"],                          correct: 0 },
  { id: "g23", prompt: "Тя каза ли нещо? — Не, само ___.",                              options: ["смееше","се засмя","засмя се","засмееше се"],                   correct: 2 },
  // Future and modals
  { id: "g24", prompt: "Утре ние ___ на лекар.",                                        options: ["отидохме","ще отидем","отиваме","отидете"],                     correct: 1 },
  { id: "g25", prompt: "Трябва ___ попълня формуляра преди края на деня.",              options: ["да","че","и","за"],                                             correct: 0 },
  // B1 — perfect and complex sentences
  { id: "g26", prompt: "Вече цяла седмица съм в София, а още ___ на Витоша.",           options: ["ходила съм е","не ходих","няма да съм ходил","не съм ходила"],  correct: 3 },
  { id: "g27", prompt: "— Госпожице, вчера бяхте ли на театър? — Да, ___.",             options: ["бяхме","беше","бяха","бях"],                                    correct: 3 },
  { id: "g28", prompt: "— Деца, ще бъдете ли свободни в неделя? — Не, ___ да бъдем.",  options: ["не ще","няма","няма да","нямаме"],                              correct: 2 },
  // B1 — passive voice
  { id: "g29", prompt: "Пушенето в сградата ___.",                                      options: ["не разрешено","разрешено е","не е разрешено","е не разрешено"], correct: 2 },
  { id: "g30", prompt: "Град Велико Търново ___ от много чужденци.",                    options: ["посещават","посетен","посещаван","се посещава"],                 correct: 3 },
];

function buildGrammar(count: number): CefrQuestion[] {
  return shuffle(GRAMMAR).slice(0, count).map((q) => ({ ...q, section: "grammar" as const }));
}

// ---------- Section 3: Reading (survival-only passages) ----------
interface RPassage { bg: string; en: string; questions: { q: string; options: string[]; correct: number }[]; }
const READING_PASSAGES: RPassage[] = [
  // Passage 1 — Renting an apartment
  {
    bg: "— Добър ден. Исках да попитам за наема.\n— Апартаментът е двустаен, на трети етаж, с обзавеждане. Наемът е шестстотин лева на месец, без тока и водата.\n— Има ли паркинг?\n— За съжаление няма. Но наблизо има паркинг срещу десет лева на ден.\n— Кога мога да го видя?\n— Утре следобед, ако ви е удобно.",
    en: "— Good day. I wanted to ask about the rent.\n— The apartment is two rooms, third floor, furnished. Rent is 600 lev per month, without electricity and water.\n— Is there parking?\n— Unfortunately not. But there is nearby parking for 10 lev per day.\n— When can I see it?\n— Tomorrow afternoon if that suits you.",
    questions: [
      { q: "How much is the monthly rent?",        options: ["500 lev", "600 lev", "700 lev", "610 lev"],                      correct: 1 },
      { q: "What is NOT included in the rent?",    options: ["Furniture", "Electricity and water", "The apartment", "The floor"], correct: 1 },
      { q: "Is there parking available?",          options: ["Yes, free", "Yes, 10 lev/day nearby", "No parking at all", "Yes, included"], correct: 1 },
    ],
  },
  // Passage 2 — Doctor visit
  {
    bg: "— Добър ден. Имам час при доктор Иванова.\n— Как се казвате?\n— Казвам се Адам Смит.\n— Заповядайте, седнете. Какво ви тревожи?\n— От три дни ме боли гърлото и имам температура.\n— Отворете устата. Сливиците са зачервени. Ще ви предпиша антибиотик. Вземайте три пъти дневно след хранене.",
    en: "— Good day. I have an appointment with Dr. Ivanova.\n— What is your name?\n— My name is Adam Smith.\n— Please come in, sit down. What is bothering you?\n— For three days my throat has been hurting and I have a fever.\n— Open your mouth. The tonsils are red. I will prescribe an antibiotic. Take it three times daily after meals.",
    questions: [
      { q: "How long has the patient had symptoms?", options: ["One day", "Two days", "Three days", "A week"],               correct: 2 },
      { q: "What does the doctor prescribe?",        options: ["Painkiller", "Antibiotic", "Nasal spray", "Cough syrup"],    correct: 1 },
      { q: "When should the medicine be taken?",     options: ["Once daily", "Twice daily on empty stomach", "Three times daily after meals", "Before sleep only"], correct: 2 },
    ],
  },
  // Passage 3 — Immigration office
  {
    bg: "— Добър ден. Искам да подам документи за разрешение за пребиваване.\n— Имате ли всички документи?\n— Да. Имам паспорт, договор за наем и здравна осигуровка.\n— Трябва ви и заверен превод на договора. Имате ли?\n— Не, не знаех това.\n— Направете го при нотариус. После елате пак на гише номер три.\n— Колко дни отнема разрешението?\n— Около тридесет работни дни.",
    en: "— Good day. I want to submit documents for a residence permit.\n— Do you have all the documents?\n— Yes. I have a passport, rental contract and health insurance.\n— You also need a certified translation of the contract. Do you have it?\n— No, I did not know that.\n— Get it done at a notary. Then come back to counter number three.\n— How many days does the permit take?\n— About thirty working days.",
    questions: [
      { q: "What is the person applying for?",            options: ["Passport", "Residence permit", "Work permit", "Health insurance"],       correct: 1 },
      { q: "What document is the person missing?",        options: ["Passport", "Health insurance", "Certified translation", "Bank statement"], correct: 2 },
      { q: "Where should they get the missing document?", options: ["The embassy", "The hospital", "Counter three", "A notary"],               correct: 3 },
      { q: "How long does the residence permit take?",    options: ["10 working days", "30 working days", "30 calendar days", "60 days"],      correct: 1 },
    ],
  },
  // Passage 4 — Paying a bill / utility office
  {
    bg: "— Добър ден. Искам да платя сметката за тока.\n— Имате ли клиентския си номер?\n— Да, ето го. Колко е сумата?\n— Осемдесет и шест лева. Можете да платите в брой или с карта.\n— Ще платя с карта, моля. Може ли касова бележка?\n— Разбира се. Заповядайте.",
    en: "— Good day. I want to pay the electricity bill.\n— Do you have your customer number?\n— Yes, here it is. How much is the amount?\n— 86 levs. You can pay in cash or by card.\n— I will pay by card, please. May I have a receipt?\n— Of course. Here you go.",
    questions: [
      { q: "What is the customer paying?",   options: ["Rent", "Electricity bill", "Water bill", "Internet bill"], correct: 1 },
      { q: "How much is the bill?",          options: ["68 lev", "86 lev", "16 lev", "186 lev"],                  correct: 1 },
      { q: "How does the customer pay?",     options: ["Cash", "Card", "Bank transfer", "Cheque"],                correct: 1 },
    ],
  },
];

function buildReading(count: number): CefrQuestion[] {
  // Shuffle the passages each test so questions come from different ones
  const shuffledPassages = shuffle(READING_PASSAGES);
  const out: CefrQuestion[] = [];
  let i = 0;
  for (const p of shuffledPassages) {
    for (const q of p.questions) {
      if (out.length >= count) break;
      out.push({
        id: `read-${i++}`,
        section: "reading",
        prompt: q.q,
        passage: { bg: p.bg, en: p.en },
        options: q.options,
        correct: q.correct,
      });
    }
    if (out.length >= count) break;
  }
  return out;
}

// ---------- Section 5: Writing / Active production ----------
const WRITING: Omit<CefrQuestion, "section">[] = [
  { id: "w1",  prompt: "You want to ask how much something costs at the market.",                        options: ["Колко е часът?","Колко струва това?","Къде е касата?","Какво е това?"],                                correct: 1 },
  { id: "w2",  prompt: "You greet your landlord politely in the morning.",                               options: ["Здрасти, как е?","Чао, до утре!","Добро утро, господине.","Хайде, лека нощ!"],                          correct: 2 },
  { id: "w3",  prompt: "You want to tell the doctor you have a sore throat.",                            options: ["Боли ме гърлото.","Гладен съм.","Имам нужда от пари.","Студено ми е."],                                correct: 0 },
  { id: "w4",  prompt: "At the immigration office, you ask which counter to go to.",                     options: ["Колко е таксата?","На кое гише да отида?","Имате ли касова бележка?","Кога затваряте?"],                correct: 1 },
  { id: "w5",  prompt: "You want to ask the pharmacist if they have a specific medicine.",               options: ["Колко струва аспиринът?","Имате ли това лекарство?","Къде е аптеката?","Аз съм болен."],                correct: 1 },
  { id: "w6",  prompt: "You ask for a receipt at the shop.",                                             options: ["Може ли торбичка?","Може ли касова бележка?","Колко струва?","Имате ли отстъпка?"],                     correct: 1 },
  { id: "w7",  prompt: "Tell the landlord you'd like to sign the rental contract today.",               options: ["Искам да платя депозита утре.","Искам да подпиша договора днес.","Искам да напусна апартамента.","Искам нов апартамент."], correct: 1 },
  { id: "w8",  prompt: "Apologize politely for being late.",                                             options: ["Извинете за закъснението.","Здравейте, как сте?","Благодаря много!","Довиждане!"],                       correct: 0 },
  { id: "w9",  prompt: "Ask the university clerk how long the certificate (уверение) takes to be ready.", options: ["Колко струва уверението?","Кога е готово уверението?","Какво е уверение?","Защо ми трябва уверение?"], correct: 1 },
  { id: "w10", prompt: "You're at the market and want half a kilo of tomatoes.",                        options: ["Един килограм краставици.","Половин килограм домати.","Една бутилка вода.","Дайте ми сирене."],          correct: 1 },
  { id: "w11", prompt: "You want to tell the officer you do not speak Bulgarian.",                       options: ["Не говоря български.","Говоря малко.","Разбирам всичко.","Имам преводач."],                             correct: 0 },
  { id: "w12", prompt: "You ask the landlord when the heating comes on.",                               options: ["Кой плаща тока?","Кога се включва парното?","Имате ли интернет?","Кога е депозитът?"],                  correct: 1 },
];

function buildWriting(count: number): CefrQuestion[] {
  return shuffle(WRITING).slice(0, count).map((q) => ({ ...q, section: "writing" as const }));
}

// ---------- Build full test ----------
export function buildCefrTest(): CefrQuestion[] {
  return [
    ...buildVocab(15),
    ...buildGrammar(15),
    ...buildReading(10),
    ...buildListening(10),
    ...buildWriting(10),
  ];
}

// ---------- Scoring ----------
export interface CefrResult {
  total: number;
  correct: number;
  pct: number;
  level: CefrLevel;
  perSection: Record<SectionId, { correct: number; total: number; pct: number }>;
  summary: string;
  recommendation: string;
}

export function levelFromPct(pct: number): CefrLevel {
  if (pct >= 85) return "B2";
  if (pct >= 65) return "B1";
  if (pct >= 40) return "A2";
  return "A1";
}

const LEVEL_SUMMARY: Record<CefrLevel, { can: string; cant: string; focus: string }> = {
  A1: {
    can: "You can recognize a small core of everyday Bulgarian words and a few simple phrases.",
    cant: "You can't yet hold a real conversation, read full texts, or use past/future tenses confidently.",
    focus: "Daily-life vocabulary, present tense conjugations, numbers, and the most common greetings and shop phrases.",
  },
  A2: {
    can: "You handle basic everyday situations: greetings, shopping, simple questions, present-tense verbs.",
    cant: "Complex sentences, longer reading passages, and grammar nuance (definite articles, past/future) are still hard.",
    focus: "Past tense (минало свършено), definite article forms (-ът, -та, -то), and survival scenarios (immigration, doctor, market).",
  },
  B1: {
    can: "You manage real-life interactions in Bulgaria: rent an apartment, see a doctor, deal with admin offices, and read short texts.",
    cant: "Subtle grammar, idiomatic expressions, and faster native speech still cause issues.",
    focus: "Reading longer texts, listening to natural-speed dialogues, and active writing/speaking practice on professional topics.",
  },
  B2: {
    can: "You communicate fluently in most everyday and professional contexts. You understand main ideas in complex texts.",
    cant: "Native-level idioms, regional accents, and very specialized vocabulary may still trip you up.",
    focus: "Idiomatic expressions, advanced reading (news, articles), and sustained spoken practice with native speakers.",
  },
};

export function scoreCefrTest(questions: CefrQuestion[], answers: (number | null)[]): CefrResult {
  const perSection: Record<SectionId, { correct: number; total: number; pct: number }> = {
    vocab:     { correct: 0, total: 0, pct: 0 },
    grammar:   { correct: 0, total: 0, pct: 0 },
    reading:   { correct: 0, total: 0, pct: 0 },
    listening: { correct: 0, total: 0, pct: 0 },
    writing:   { correct: 0, total: 0, pct: 0 },
  };
  let correct = 0;
  questions.forEach((q, i) => {
    perSection[q.section].total++;
    if (answers[i] === q.correct) {
      correct++;
      perSection[q.section].correct++;
    }
  });
  for (const k of Object.keys(perSection) as SectionId[]) {
    const s = perSection[k];
    s.pct = s.total > 0 ? Math.round((s.correct / s.total) * 100) : 0;
  }
  const pct = Math.round((correct / questions.length) * 100);
  const level = levelFromPct(pct);
  const meta = LEVEL_SUMMARY[level];
  return {
    total: questions.length,
    correct,
    pct,
    level,
    perSection,
    summary: `You can: ${meta.can} You can't yet: ${meta.cant}`,
    recommendation: meta.focus,
  };
}
