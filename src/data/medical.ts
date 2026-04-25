// Bulgarian medical language exam prep.
// For foreign medical students and doctors practicing in Bulgaria.
// Based on official exam syllabus: grammar, vocabulary, 12 diseases,
// medical history phrases, patient communication.
//
// Supports two modes:
//   Study Mode  — all questions available freely, no time limit
//   Exam Mode   — timed written section (60 questions, 90 min),
//                 pass threshold 60% → unlocks oral section (case study cards + discussion topics)

// ── Types ────────────────────────────────────────────────────────────────

export interface MedicalWord {
  bg: string;
  en: string;
  category: MedicalCategory;
}

export type MedicalCategory =
  | "body"
  | "symptoms"
  | "diseases"
  | "procedures"
  | "history"
  | "pharmacy"
  | "emergency"
  | "nationality_occupation"
  | "family"
  | "daily_life"
  | "hobbies"
  | "shopping"
  | "healthy_lifestyle";

export interface MedicalQuestion {
  id: string;
  category: MedicalQuestionCategory;
  subcategory?: string;
  prompt: string;
  options: string[];
  correct: number;
  explanation?: string;
}

export type MedicalQuestionCategory =
  | "vocabulary"
  | "grammar"
  | "comprehension"
  | "history"
  | "grammar_nouns"
  | "grammar_adjectives"
  | "grammar_pronouns"
  | "grammar_verbs"
  | "grammar_numerals"
  | "grammar_participles"
  | "grammar_prepositions"
  | "grammar_word_formation"
  | "grammar_recommendations"
  | "grammar_medical_history";

export interface OralTopic {
  id: string;
  topic: string;
  topicEn: string;
  sampleAnswer: string;
  sampleAnswerEn: string;
  keyPhrases: { bg: string; en: string }[];
}

export interface CaseStudyCard {
  id: string;
  disease: string;
  diseaseEn: string;
  scenario: string;
  scenarioEn: string;
  expectedPoints: string[];
  expectedPointsEn: string[];
}

// ── Vocabulary ───────────────────────────────────────────────────────────

export const MEDICAL_VOCAB: MedicalWord[] = [
  // Body systems
  { bg: "дихателна система", en: "respiratory system", category: "body" },
  { bg: "сърдечно-съдова система", en: "cardiovascular system", category: "body" },
  { bg: "храносмилателна система", en: "digestive system", category: "body" },
  { bg: "отделителна система", en: "urinary system", category: "body" },
  { bg: "нервна система", en: "nervous system", category: "body" },
  { bg: "опорно-двигателна система", en: "musculoskeletal system", category: "body" },
  { bg: "бял дроб", en: "lung", category: "body" },
  { bg: "бели дробове", en: "lungs", category: "body" },
  { bg: "сърце", en: "heart", category: "body" },
  { bg: "черен дроб", en: "liver", category: "body" },
  { bg: "бъбрек", en: "kidney", category: "body" },
  { bg: "бъбреци", en: "kidneys", category: "body" },
  { bg: "стомах", en: "stomach", category: "body" },
  { bg: "черва", en: "intestines", category: "body" },
  { bg: "гърло", en: "throat", category: "body" },
  { bg: "трахея", en: "trachea / windpipe", category: "body" },
  { bg: "бронхи", en: "bronchi", category: "body" },
  { bg: "синуси", en: "sinuses", category: "body" },
  { bg: "сливици", en: "tonsils", category: "body" },
  { bg: "кожа", en: "skin", category: "body" },
  { bg: "кост", en: "bone", category: "body" },
  { bg: "стави", en: "joints", category: "body" },
  { bg: "мускул", en: "muscle", category: "body" },
  { bg: "вена", en: "vein", category: "body" },
  { bg: "артерия", en: "artery", category: "body" },
  { bg: "кръвно налягане", en: "blood pressure", category: "body" },
  { bg: "пулс", en: "pulse", category: "body" },
  { bg: "китка", en: "wrist", category: "body" },
  { bg: "глезен", en: "ankle", category: "body" },
  { bg: "рамо", en: "shoulder", category: "body" },
  { bg: "гръбначен стълб", en: "spine", category: "body" },
  { bg: "ребро", en: "rib", category: "body" },
  { bg: "череп", en: "skull", category: "body" },

  // Symptoms
  { bg: "болка", en: "pain", category: "symptoms" },
  { bg: "остра болка", en: "sharp pain", category: "symptoms" },
  { bg: "тъпа болка", en: "dull pain", category: "symptoms" },
  { bg: "пареща болка", en: "burning pain", category: "symptoms" },
  { bg: "коликообразна болка", en: "colicky pain", category: "symptoms" },
  { bg: "температура", en: "fever / temperature", category: "symptoms" },
  { bg: "висока температура", en: "high fever", category: "symptoms" },
  { bg: "втрисане", en: "chills", category: "symptoms" },
  { bg: "кашлица", en: "cough", category: "symptoms" },
  { bg: "суха кашлица", en: "dry cough", category: "symptoms" },
  { bg: "влажна кашлица", en: "wet cough", category: "symptoms" },
  { bg: "хрема", en: "runny nose / rhinitis", category: "symptoms" },
  { bg: "запушен нос", en: "blocked nose", category: "symptoms" },
  { bg: "задух", en: "shortness of breath", category: "symptoms" },
  { bg: "хрипове", en: "wheezing", category: "symptoms" },
  { bg: "болки в гърдите", en: "chest pain", category: "symptoms" },
  { bg: "главоболие", en: "headache", category: "symptoms" },
  { bg: "замайване", en: "dizziness", category: "symptoms" },
  { bg: "гадене", en: "nausea", category: "symptoms" },
  { bg: "повръщане", en: "vomiting", category: "symptoms" },
  { bg: "диария", en: "diarrhea", category: "symptoms" },
  { bg: "умора", en: "fatigue", category: "symptoms" },
  { bg: "слабост", en: "weakness", category: "symptoms" },
  { bg: "изпотяване", en: "sweating", category: "symptoms" },
  { bg: "оток", en: "swelling / edema", category: "symptoms" },
  { bg: "обрив", en: "rash", category: "symptoms" },
  { bg: "сърбеж", en: "itching", category: "symptoms" },
  { bg: "световъртеж", en: "vertigo / dizziness", category: "symptoms" },
  { bg: "болки в кръста", en: "lower back pain", category: "symptoms" },

  // 12 diseases from the exam syllabus
  { bg: "ринит", en: "rhinitis", category: "diseases" },
  { bg: "синузит", en: "sinusitis", category: "diseases" },
  { bg: "астма", en: "asthma", category: "diseases" },
  { bg: "бронхит", en: "bronchitis", category: "diseases" },
  { bg: "тонзилит", en: "tonsillitis", category: "diseases" },
  { bg: "грип", en: "influenza / flu", category: "diseases" },
  { bg: "изгаряне", en: "burn", category: "diseases" },
  { bg: "навяхване", en: "sprain", category: "diseases" },
  { bg: "луксация", en: "dislocation", category: "diseases" },
  { bg: "счупване / фрактура", en: "fracture", category: "diseases" },
  { bg: "нефролитиаза", en: "nephrolithiasis / kidney stones", category: "diseases" },
  { bg: "хипертония", en: "hypertension / high blood pressure", category: "diseases" },
  { bg: "хронична болест", en: "chronic disease", category: "diseases" },
  { bg: "остро заболяване", en: "acute illness", category: "diseases" },
  { bg: "инфекция", en: "infection", category: "diseases" },
  { bg: "възпаление", en: "inflammation", category: "diseases" },

  // Medical procedures
  { bg: "преглед", en: "examination / check-up", category: "procedures" },
  { bg: "кръвен тест", en: "blood test", category: "procedures" },
  { bg: "рентгенова снимка", en: "X-ray", category: "procedures" },
  { bg: "ехография", en: "ultrasound", category: "procedures" },
  { bg: "ЕКГ", en: "ECG / electrocardiogram", category: "procedures" },
  { bg: "измерване на кръвно налягане", en: "blood pressure measurement", category: "procedures" },
  { bg: "слушане на бели дробове", en: "auscultation of lungs", category: "procedures" },
  { bg: "инжекция", en: "injection", category: "procedures" },
  { bg: "капкова терапия", en: "IV drip therapy", category: "procedures" },
  { bg: "операция", en: "surgery / operation", category: "procedures" },
  { bg: "превръзка", en: "bandage / dressing", category: "procedures" },
  { bg: "имобилизация", en: "immobilization", category: "procedures" },
  { bg: "физиотерапия", en: "physiotherapy", category: "procedures" },
  { bg: "рехабилитация", en: "rehabilitation", category: "procedures" },
  { bg: "хоспитализация", en: "hospitalization", category: "procedures" },
  { bg: "изписване от болница", en: "discharge from hospital", category: "procedures" },
  { bg: "натривка от гърлото", en: "throat swab", category: "procedures" },
  { bg: "репозиция", en: "reduction / repositioning", category: "procedures" },

  // Medical history phrases
  { bg: "Откога имате тези оплаквания?", en: "How long have you had these complaints?", category: "history" },
  { bg: "Откога ви боли?", en: "How long have you had the pain?", category: "history" },
  { bg: "Как се появиха симптомите?", en: "How did the symptoms appear?", category: "history" },
  { bg: "Имате ли алергия?", en: "Do you have any allergies?", category: "history" },
  { bg: "Приемате ли лекарства?", en: "Are you taking any medications?", category: "history" },
  { bg: "Боледували ли сте от...?", en: "Have you ever had...?", category: "history" },
  { bg: "Има ли такива заболявания в семейството?", en: "Are there such diseases in the family?", category: "history" },
  { bg: "Пушите ли?", en: "Do you smoke?", category: "history" },
  { bg: "Пиете ли алкохол?", en: "Do you drink alcohol?", category: "history" },
  { bg: "Болката усилва ли се при...?", en: "Does the pain get worse with...?", category: "history" },
  { bg: "Болката намалява ли при...?", en: "Does the pain decrease with...?", category: "history" },
  { bg: "Имали ли сте такива оплаквания преди?", en: "Have you had such complaints before?", category: "history" },
  { bg: "Какво ви е правено досега?", en: "What treatment have you had so far?", category: "history" },
  { bg: "Покажете ми къде ви боли.", en: "Show me where it hurts.", category: "history" },
  { bg: "Опишете болката.", en: "Describe the pain.", category: "history" },
  { bg: "Имате ли кръв в урината?", en: "Do you have blood in your urine?", category: "history" },
  { bg: "Можете ли да стъпите на крака?", en: "Can you stand on your foot?", category: "history" },

  // Pharmacy
  { bg: "антибиотик", en: "antibiotic", category: "pharmacy" },
  { bg: "противовъзпалително", en: "anti-inflammatory", category: "pharmacy" },
  { bg: "болкоуспокояващо", en: "painkiller", category: "pharmacy" },
  { bg: "жаропонижаващо", en: "fever reducer / antipyretic", category: "pharmacy" },
  { bg: "сироп за кашлица", en: "cough syrup", category: "pharmacy" },
  { bg: "спрей за нос", en: "nasal spray", category: "pharmacy" },
  { bg: "инхалатор", en: "inhaler", category: "pharmacy" },
  { bg: "таблетка", en: "tablet", category: "pharmacy" },
  { bg: "капсула", en: "capsule", category: "pharmacy" },
  { bg: "ампула", en: "ampoule", category: "pharmacy" },
  { bg: "мехлем", en: "ointment", category: "pharmacy" },
  { bg: "три пъти дневно", en: "three times daily", category: "pharmacy" },
  { bg: "след хранене", en: "after meals", category: "pharmacy" },
  { bg: "на гладно", en: "on an empty stomach", category: "pharmacy" },
  { bg: "курс на лечение", en: "course of treatment", category: "pharmacy" },
  { bg: "муколитик", en: "mucolytic", category: "pharmacy" },
  { bg: "антихистамин", en: "antihistamine", category: "pharmacy" },
  { bg: "антихипертензивно", en: "antihypertensive", category: "pharmacy" },
  { bg: "спазмолитик", en: "antispasmodic", category: "pharmacy" },
  { bg: "бронходилататор", en: "bronchodilator", category: "pharmacy" },

  // Emergency
  { bg: "спешна помощ", en: "emergency / ER", category: "emergency" },
  { bg: "линейка", en: "ambulance", category: "emergency" },
  { bg: "реанимация", en: "resuscitation / ICU", category: "emergency" },
  { bg: "шок", en: "shock", category: "emergency" },
  { bg: "загуба на съзнание", en: "loss of consciousness", category: "emergency" },
  { bg: "инсулт", en: "stroke", category: "emergency" },
  { bg: "инфаркт", en: "heart attack / myocardial infarction", category: "emergency" },
  { bg: "кърви силно", en: "bleeding heavily", category: "emergency" },
  { bg: "изгаряне от първа степен", en: "first degree burn", category: "emergency" },
  { bg: "изгаряне от втора степен", en: "second degree burn", category: "emergency" },
  { bg: "счупена кост", en: "broken bone", category: "emergency" },
  { bg: "наложителна операция", en: "emergency surgery", category: "emergency" },

  // Syllabus vocab topics — Nationality & Occupation
  { bg: "лекар", en: "doctor", category: "nationality_occupation" },
  { bg: "медицинска сестра", en: "nurse", category: "nationality_occupation" },
  { bg: "хирург", en: "surgeon", category: "nationality_occupation" },
  { bg: "педиатър", en: "pediatrician", category: "nationality_occupation" },
  { bg: "кардиолог", en: "cardiologist", category: "nationality_occupation" },
  { bg: "студент по медицина", en: "medical student", category: "nationality_occupation" },
  { bg: "специализант", en: "resident / trainee doctor", category: "nationality_occupation" },
  { bg: "гражданство", en: "citizenship / nationality", category: "nationality_occupation" },
  { bg: "родина", en: "homeland / home country", category: "nationality_occupation" },

  // Family
  { bg: "съпруг", en: "husband", category: "family" },
  { bg: "съпруга", en: "wife", category: "family" },
  { bg: "родители", en: "parents", category: "family" },
  { bg: "баща", en: "father", category: "family" },
  { bg: "майка", en: "mother", category: "family" },
  { bg: "брат", en: "brother", category: "family" },
  { bg: "сестра", en: "sister", category: "family" },
  { bg: "деца", en: "children", category: "family" },
  { bg: "семейство", en: "family", category: "family" },

  // Daily life
  { bg: "работно място", en: "workplace", category: "daily_life" },
  { bg: "смяна", en: "shift", category: "daily_life" },
  { bg: "нощна смяна", en: "night shift", category: "daily_life" },
  { bg: "дежурство", en: "duty / on-call", category: "daily_life" },
  { bg: "почивен ден", en: "day off", category: "daily_life" },
  { bg: "транспорт", en: "transport", category: "daily_life" },

  // Healthy lifestyle
  { bg: "здравословно хранене", en: "healthy eating", category: "healthy_lifestyle" },
  { bg: "физическа активност", en: "physical activity", category: "healthy_lifestyle" },
  { bg: "стрес", en: "stress", category: "healthy_lifestyle" },
  { bg: "сън", en: "sleep", category: "healthy_lifestyle" },
  { bg: "редовен преглед", en: "regular check-up", category: "healthy_lifestyle" },
  { bg: "профилактика", en: "prevention", category: "healthy_lifestyle" },
  { bg: "имунитет", en: "immunity", category: "healthy_lifestyle" },
];

// ── Disease dialogues ────────────────────────────────────────────────────

export interface DiseaseDialogue {
  disease: string;
  diseaseEn: string;
  dialogue: { speaker: "Лекар" | "Пациент"; bg: string; en: string }[];
  keyVocab: { bg: string; en: string }[];
  treatment: string;
  treatmentEn: string;
}

export const DISEASE_DIALOGUES: DiseaseDialogue[] = [
  {
    disease: "Ринит",
    diseaseEn: "Rhinitis",
    dialogue: [
      { speaker: "Лекар", bg: "Добър ден. Какви оплаквания имате?", en: "Good day. What complaints do you have?" },
      { speaker: "Пациент", bg: "Имам хрема и запушен нос от три дни.", en: "I have a runny nose and blocked nose for three days." },
      { speaker: "Лекар", bg: "Имате ли температура или болки в гърлото?", en: "Do you have a fever or sore throat?" },
      { speaker: "Пациент", bg: "Леко ме боли главата, но температура нямам.", en: "I have a slight headache but no fever." },
      { speaker: "Лекар", bg: "Имате ли алергия към нещо — прах, полен, животни?", en: "Are you allergic to anything — dust, pollen, animals?" },
      { speaker: "Пациент", bg: "Не знам. Никога не съм изследван за алергии.", en: "I don't know. I've never been tested for allergies." },
      { speaker: "Лекар", bg: "Ще ви предпиша назален спрей. Ако не се подобри след седмица, ще направим алергични тестове.", en: "I'll prescribe you nasal spray. If it doesn't improve after a week, we'll do allergy tests." },
    ],
    keyVocab: [
      { bg: "хрема", en: "runny nose" },
      { bg: "запушен нос", en: "blocked nose" },
      { bg: "назален спрей", en: "nasal spray" },
      { bg: "алергичен ринит", en: "allergic rhinitis" },
      { bg: "полен", en: "pollen" },
    ],
    treatment: "Назален спрей, антихистамини при алергичен ринит, физиологичен разтвор за промивка.",
    treatmentEn: "Nasal spray, antihistamines for allergic rhinitis, saline solution rinse.",
  },
  {
    disease: "Синузит",
    diseaseEn: "Sinusitis",
    dialogue: [
      { speaker: "Лекар", bg: "Откога имате тези оплаквания?", en: "How long have you had these complaints?" },
      { speaker: "Пациент", bg: "От пет дни имам болки в областта на носа и челото.", en: "For five days I have pain around the nose and forehead." },
      { speaker: "Лекар", bg: "Имате ли главоболие и гноен секрет от носа?", en: "Do you have a headache and purulent nasal discharge?" },
      { speaker: "Пациент", bg: "Да, и температура тридесет и осем градуса.", en: "Yes, and a fever of thirty-eight degrees." },
      { speaker: "Лекар", bg: "Болката усилва ли се, когато навеждате глава напред?", en: "Does the pain worsen when you lean your head forward?" },
      { speaker: "Пациент", bg: "Да, особено когато се навеждам.", en: "Yes, especially when I lean forward." },
      { speaker: "Лекар", bg: "Трябва рентгенова снимка на синусите. Ще предпишем антибиотик.", en: "You need an X-ray of the sinuses. We'll prescribe an antibiotic." },
    ],
    keyVocab: [
      { bg: "синус", en: "sinus" },
      { bg: "болка в областта на синусите", en: "sinus pain" },
      { bg: "гноен секрет", en: "purulent discharge" },
      { bg: "деконгестант", en: "decongestant" },
      { bg: "промивка на носа", en: "nasal rinse" },
    ],
    treatment: "Антибиотик (амоксицилин), деконгестанти, физиологичен разтвор за промивка.",
    treatmentEn: "Antibiotic (amoxicillin), decongestants, saline rinse.",
  },
  {
    disease: "Астма",
    diseaseEn: "Asthma",
    dialogue: [
      { speaker: "Лекар", bg: "Как се чувствате? Какво ви тревожи?", en: "How do you feel? What is bothering you?" },
      { speaker: "Пациент", bg: "Имам задух и хрипове, особено нощем и при усилие.", en: "I have shortness of breath and wheezing, especially at night and with exertion." },
      { speaker: "Лекар", bg: "Откога имате тези оплаквания?", en: "How long have you had these complaints?" },
      { speaker: "Пациент", bg: "От около две години. Напоследък се усилиха.", en: "For about two years. They've gotten worse lately." },
      { speaker: "Лекар", bg: "Имате ли алергия към прах, полен или животни?", en: "Are you allergic to dust, pollen or animals?" },
      { speaker: "Пациент", bg: "Да, към прах и котешки косми.", en: "Yes, to dust and cat hair." },
      { speaker: "Лекар", bg: "Ще направим спирометрия. Ще ви предпиша инхалатор за бронходилатация и кортикостероид за профилактика.", en: "We'll do a spirometry test. I'll prescribe a bronchodilator inhaler and a corticosteroid for prevention." },
    ],
    keyVocab: [
      { bg: "задух", en: "shortness of breath" },
      { bg: "хрипове", en: "wheezing" },
      { bg: "инхалатор", en: "inhaler" },
      { bg: "бронходилататор", en: "bronchodilator" },
      { bg: "алерген", en: "allergen" },
      { bg: "спирометрия", en: "spirometry" },
    ],
    treatment: "Бронходилататори (салбутамол), инхалаторни кортикостероиди, избягване на алергени.",
    treatmentEn: "Bronchodilators (salbutamol), inhaled corticosteroids, allergen avoidance.",
  },
  {
    disease: "Бронхит",
    diseaseEn: "Bronchitis",
    dialogue: [
      { speaker: "Лекар", bg: "Какво ви тревожи?", en: "What is bothering you?" },
      { speaker: "Пациент", bg: "Кашлям от седмица. Кашлицата е влажна, с жълта храчка.", en: "I've been coughing for a week. The cough is wet, with yellow phlegm." },
      { speaker: "Лекар", bg: "Имате ли температура?", en: "Do you have a fever?" },
      { speaker: "Пациент", bg: "Температура тридесет и седем и половина.", en: "Fever thirty-seven and a half." },
      { speaker: "Лекар", bg: "Имате ли задух или болки в гърдите?", en: "Do you have shortness of breath or chest pain?" },
      { speaker: "Пациент", bg: "Леко ме стяга в гърдите при кашляне.", en: "I feel slight tightness in my chest when coughing." },
      { speaker: "Лекар", bg: "Ще ви прослушам бронхите. Слушат се хрипове. Ще предпишем муколитик и при нужда антибиотик.", en: "I will auscultate your bronchi. There is wheezing. We'll prescribe a mucolytic and antibiotic if needed." },
    ],
    keyVocab: [
      { bg: "бронхи", en: "bronchi" },
      { bg: "влажна кашлица", en: "wet cough" },
      { bg: "храчка", en: "phlegm / sputum" },
      { bg: "муколитик", en: "mucolytic" },
      { bg: "аускултация", en: "auscultation" },
    ],
    treatment: "Муколитици, бронходилататори, при бактериален бронхит — антибиотик.",
    treatmentEn: "Mucolytics, bronchodilators, antibiotic if bacterial.",
  },
  {
    disease: "Тонзилит",
    diseaseEn: "Tonsillitis",
    dialogue: [
      { speaker: "Лекар", bg: "Какво ви тревожи?", en: "What is bothering you?" },
      { speaker: "Пациент", bg: "Болката в гърлото е много силна. Трудно ми е да преглъщам.", en: "The throat pain is very strong. It's hard for me to swallow." },
      { speaker: "Лекар", bg: "Откога ви боли гърлото?", en: "How long has your throat been hurting?" },
      { speaker: "Пациент", bg: "От два дни. Имам и температура тридесет и осем и половина.", en: "For two days. I also have a fever of thirty-eight and a half." },
      { speaker: "Лекар", bg: "Отворете устата, моля. Сливиците са зачервени и увеличени с бял налеп.", en: "Open your mouth, please. The tonsils are red, enlarged, with white coating." },
      { speaker: "Пациент", bg: "Много ме боли при преглъщане дори на вода.", en: "It hurts a lot when swallowing even water." },
      { speaker: "Лекар", bg: "Ще вземем натривка от гърлото. Предписвам антибиотик и болкоуспокояващо.", en: "We'll take a throat swab. I'm prescribing an antibiotic and painkiller." },
    ],
    keyVocab: [
      { bg: "сливици", en: "tonsils" },
      { bg: "болка при преглъщане", en: "pain when swallowing" },
      { bg: "бял налеп", en: "white coating / exudate" },
      { bg: "натривка от гърлото", en: "throat swab" },
      { bg: "пеницилин", en: "penicillin" },
    ],
    treatment: "Антибиотик (пеницилин/амоксицилин), болкоуспокояващи, почивка.",
    treatmentEn: "Antibiotic (penicillin/amoxicillin), painkillers, rest.",
  },
  {
    disease: "Грип",
    diseaseEn: "Influenza",
    dialogue: [
      { speaker: "Лекар", bg: "Как се разболяхте? Постепенно или изведнъж?", en: "How did you fall ill? Gradually or suddenly?" },
      { speaker: "Пациент", bg: "Изведнъж. Снощи ми стана лошо — температура тридесет и девет, болки в мускулите.", en: "Suddenly. Last night I felt bad — fever 39, muscle aches." },
      { speaker: "Лекар", bg: "Имате ли кашлица и хрема?", en: "Do you have a cough and runny nose?" },
      { speaker: "Пациент", bg: "Да, и силно главоболие и болки зад очите.", en: "Yes, and a bad headache and pain behind the eyes." },
      { speaker: "Лекар", bg: "Имате ли контакт с болни хора напоследък?", en: "Have you had contact with sick people recently?" },
      { speaker: "Пациент", bg: "Да, колегата ми беше болен миналата седмица.", en: "Yes, my colleague was sick last week." },
      { speaker: "Лекар", bg: "Това изглежда като грип. Трябва почивка, много течности, жаропонижаващо.", en: "This looks like influenza. You need rest, plenty of fluids, antipyretic." },
    ],
    keyVocab: [
      { bg: "внезапно начало", en: "sudden onset" },
      { bg: "болки в мускулите", en: "muscle aches" },
      { bg: "антивирусни", en: "antivirals" },
      { bg: "жаропонижаващо", en: "antipyretic / fever reducer" },
      { bg: "болки зад очите", en: "pain behind the eyes" },
    ],
    treatment: "Почивка, течности, жаропонижаващи, антивирусни (осертамивир при тежки случаи).",
    treatmentEn: "Rest, fluids, antipyretics, antivirals (oseltamivir in severe cases).",
  },
  {
    disease: "Изгаряне",
    diseaseEn: "Burns",
    dialogue: [
      { speaker: "Лекар", bg: "Как се изгорихте?", en: "How did you get burned?" },
      { speaker: "Пациент", bg: "Докоснах гореща тенджера с врящо масло.", en: "I touched a hot pot with boiling oil." },
      { speaker: "Лекар", bg: "Какво направихте веднага след изгарянето?", en: "What did you do immediately after the burn?" },
      { speaker: "Пациент", bg: "Охладих ръката с течаща хладка вода около десет минути.", en: "I cooled my hand under running cool water for about ten minutes." },
      { speaker: "Лекар", bg: "Правилно сте постъпили. Ще прегледам изгарянето.", en: "You did the right thing. I'll examine the burn." },
      { speaker: "Пациент", bg: "Много ме боли и има мехури.", en: "It hurts a lot and there are blisters." },
      { speaker: "Лекар", bg: "Това е изгаряне от втора степен. Ще поставим стерилна превръзка. Не пукайте мехурите.", en: "This is a second-degree burn. We'll apply a sterile dressing. Do not pop the blisters." },
    ],
    keyVocab: [
      { bg: "изгаряне от първа степен", en: "first degree burn" },
      { bg: "изгаряне от втора степен", en: "second degree burn" },
      { bg: "мехури", en: "blisters" },
      { bg: "охлаждане с вода", en: "cooling with water" },
      { bg: "стерилна превръзка", en: "sterile dressing" },
    ],
    treatment: "Охлаждане с вода, стерилна превръзка, при тежки изгаряния — хоспитализация.",
    treatmentEn: "Cooling with water, sterile dressing, hospitalization for severe burns.",
  },
  {
    disease: "Навяхване",
    diseaseEn: "Sprain",
    dialogue: [
      { speaker: "Лекар", bg: "Какво се е случило?", en: "What happened?" },
      { speaker: "Пациент", bg: "Усукал съм глезена при бягане. Стъпих накриво.", en: "I twisted my ankle while running. I stepped sideways." },
      { speaker: "Лекар", bg: "Можете ли да стъпите на крака?", en: "Can you stand on your foot?" },
      { speaker: "Пациент", bg: "С болка, но мога.", en: "With pain, but I can." },
      { speaker: "Лекар", bg: "Ще направим рентгенова снимка за изключване на счупване.", en: "We'll take an X-ray to rule out a fracture." },
      { speaker: "Пациент", bg: "Много е подуто.", en: "It's very swollen." },
      { speaker: "Лекар", bg: "Рентгенът не показва счупване. Навяхване е. Студен компрес, еластична превръзка, почивка.", en: "The X-ray shows no fracture. It's a sprain. Cold compress, elastic bandage, rest." },
    ],
    keyVocab: [
      { bg: "навяхване", en: "sprain" },
      { bg: "глезен", en: "ankle" },
      { bg: "оток", en: "swelling" },
      { bg: "студен компрес", en: "cold compress" },
      { bg: "еластична превръзка", en: "elastic bandage" },
    ],
    treatment: "Почивка, студен компрес, еластична превръзка, болкоуспокояващо.",
    treatmentEn: "Rest, cold compress, elastic bandage, painkiller.",
  },
  {
    disease: "Луксация",
    diseaseEn: "Dislocation",
    dialogue: [
      { speaker: "Лекар", bg: "Как се е получило?", en: "How did this happen?" },
      { speaker: "Пациент", bg: "Паднах на ръка и рамото ми изскочи.", en: "I fell on my arm and my shoulder popped out." },
      { speaker: "Лекар", bg: "Много силна болка ли имате?", en: "Are you in a lot of pain?" },
      { speaker: "Пациент", bg: "Да, не мога да помръдна ръката изобщо.", en: "Yes, I can't move my arm at all." },
      { speaker: "Лекар", bg: "Ще направим рентгенова снимка за потвърждение.", en: "We'll take an X-ray for confirmation." },
      { speaker: "Пациент", bg: "Трябва ли операция?", en: "Do I need surgery?" },
      { speaker: "Лекар", bg: "Не. Ще направим репозиция под локална анестезия, после имобилизация.", en: "No. We'll perform reduction under local anesthesia, then immobilization." },
    ],
    keyVocab: [
      { bg: "луксация", en: "dislocation" },
      { bg: "рамо", en: "shoulder" },
      { bg: "репозиция", en: "reduction / repositioning" },
      { bg: "имобилизация", en: "immobilization" },
      { bg: "локална анестезия", en: "local anesthesia" },
    ],
    treatment: "Репозиция, имобилизация, физиотерапия.",
    treatmentEn: "Reduction, immobilization, physiotherapy.",
  },
  {
    disease: "Счупване (Фрактура)",
    diseaseEn: "Fracture",
    dialogue: [
      { speaker: "Лекар", bg: "Покажете ми къде ви боли.", en: "Show me where it hurts." },
      { speaker: "Пациент", bg: "Тук, в китката. Паднах на ръка.", en: "Here, in the wrist. I fell on my hand." },
      { speaker: "Лекар", bg: "Кога точно се е случило?", en: "When exactly did it happen?" },
      { speaker: "Пациент", bg: "Преди около час. Много е подуто и боли силно.", en: "About an hour ago. It's very swollen and very painful." },
      { speaker: "Лекар", bg: "Ще направим рентгенова снимка.", en: "We'll take an X-ray." },
      { speaker: "Пациент", bg: "Необходима ли е операция?", en: "Is surgery necessary?" },
      { speaker: "Лекар", bg: "Рентгенът показва счупена лъчева кост — затворена фрактура. Гипс за шест седмици, без операция.", en: "The X-ray shows a broken radius — closed fracture. Plaster cast for six weeks, no surgery." },
    ],
    keyVocab: [
      { bg: "фрактура", en: "fracture" },
      { bg: "затворена фрактура", en: "closed fracture" },
      { bg: "открита фрактура", en: "open fracture" },
      { bg: "гипс", en: "plaster cast" },
      { bg: "лъчева кост", en: "radius" },
    ],
    treatment: "Гипс или оперативно лечение, имобилизация, рехабилитация.",
    treatmentEn: "Plaster cast or surgical treatment, immobilization, rehabilitation.",
  },
  {
    disease: "Бъбречни камъни (Нефролитиаза)",
    diseaseEn: "Kidney Stones (Nephrolithiasis)",
    dialogue: [
      { speaker: "Лекар", bg: "Опишете болката — къде е и каква е?", en: "Describe the pain — where is it and what is it like?" },
      { speaker: "Пациент", bg: "Много силна, коликообразна болка в кръста, излъчваща се надолу към слабините.", en: "Very strong, colicky pain in the lower back, radiating downward to the groin." },
      { speaker: "Лекар", bg: "Имате ли кръв в урината?", en: "Do you have blood in your urine?" },
      { speaker: "Пациент", bg: "Да, урината е леко кървава.", en: "Yes, the urine is slightly bloody." },
      { speaker: "Лекар", bg: "Имате ли гадене или повръщане?", en: "Do you have nausea or vomiting?" },
      { speaker: "Пациент", bg: "Да, от болката ми се гади.", en: "Yes, the pain is making me nauseous." },
      { speaker: "Лекар", bg: "Ще назначим ехография на бъбреците и изследване на урина.", en: "We'll order a kidney ultrasound and urine test." },
    ],
    keyVocab: [
      { bg: "бъбречен камък", en: "kidney stone" },
      { bg: "бъбречна колика", en: "renal colic" },
      { bg: "хематурия", en: "hematuria / blood in urine" },
      { bg: "ехография", en: "ultrasound" },
      { bg: "слабини", en: "groin" },
    ],
    treatment: "Болкоуспокояващи, спазмолитици, много течности, при необходимост — хирургия.",
    treatmentEn: "Painkillers, antispasmodics, plenty of fluids, surgery if needed.",
  },
  {
    disease: "Хипертония (Артериална)",
    diseaseEn: "Hypertension",
    dialogue: [
      { speaker: "Лекар", bg: "Ще измерим кръвното ви налягане. Имате ли оплаквания?", en: "We'll measure your blood pressure. Do you have any complaints?" },
      { speaker: "Пациент", bg: "Имам чести главоболия и световъртеж, особено сутрин.", en: "I have frequent headaches and dizziness, especially in the morning." },
      { speaker: "Лекар", bg: "Налягането е 165 на 105. Това е значително повишено.", en: "The pressure is 165 over 105. This is significantly elevated." },
      { speaker: "Пациент", bg: "Приемам хапчета от три месеца, но не редовно.", en: "I've been taking pills for three months, but not regularly." },
      { speaker: "Лекар", bg: "Трябва да ги вземате всеки ден без пропускане. Има ли такива заболявания в семейството?", en: "You must take them every day without skipping. Are there such diseases in the family?" },
      { speaker: "Пациент", bg: "Баща ми имаше хипертония и инфаркт.", en: "My father had hypertension and a heart attack." },
      { speaker: "Лекар", bg: "Ще сменим дозата и ще следим редовно. Диета с малко сол.", en: "We'll change the dose and monitor regularly. Low-salt diet." },
    ],
    keyVocab: [
      { bg: "артериална хипертония", en: "arterial hypertension" },
      { bg: "систолично налягане", en: "systolic pressure" },
      { bg: "диастолично налягане", en: "diastolic pressure" },
      { bg: "антихипертензивни", en: "antihypertensives" },
      { bg: "диета с малко сол", en: "low-salt diet" },
    ],
    treatment: "Антихипертензивни лекарства, диета с малко сол, физическа активност, редовен мониторинг.",
    treatmentEn: "Antihypertensive drugs, low-salt diet, physical activity, regular monitoring.",
  },
];

// ── Oral exam — discussion topic flashcards ──────────────────────────────

export const ORAL_TOPICS: OralTopic[] = [
  {
    id: "ot1",
    topic: "Защо избрахте да станете лекар?",
    topicEn: "Why did you choose to become a doctor?",
    sampleAnswer:
      "Исках да стана лекар от малък, защото ме интересува човешкото тяло и искам да помагам на хората. Медицината е призвание за мен — не просто работа. Вдъхновен съм от баща си, който е хирург. Завърших медицина, защото вярвам, че здравето е най-важното нещо в живота.",
    sampleAnswerEn:
      "I wanted to become a doctor from a young age because I'm interested in the human body and want to help people. Medicine is a calling for me — not just a job. I'm inspired by my father, who is a surgeon. I graduated from medicine because I believe that health is the most important thing in life.",
    keyPhrases: [
      { bg: "от малък / от малка", en: "from a young age (m/f)" },
      { bg: "призвание", en: "calling / vocation" },
      { bg: "вдъхновен съм от", en: "I am inspired by" },
      { bg: "вярвам, че", en: "I believe that" },
    ],
  },
  {
    id: "ot2",
    topic: "Представете се. Разкажете за семейството си.",
    topicEn: "Introduce yourself. Tell us about your family.",
    sampleAnswer:
      "Казвам се [Иван Петров]. На [двадесет и шест] години съм. Роден съм в [Египет], но сега живея и уча в Пловдив. Семейството ми се състои от майка, баща и по-малка сестра. Баща ми е инженер, а майка ми е учителка. Те ме подкрепиха много в избора ми да стана лекар.",
    sampleAnswerEn:
      "My name is [Ivan Petrov]. I am [26] years old. I was born in [Egypt], but now I live and study in Plovdiv. My family consists of my mother, father and younger sister. My father is an engineer and my mother is a teacher. They supported me greatly in my choice to become a doctor.",
    keyPhrases: [
      { bg: "семейството ми се състои от", en: "my family consists of" },
      { bg: "роден съм в", en: "I was born in" },
      { bg: "те ме подкрепиха", en: "they supported me" },
      { bg: "по-малка сестра / по-голям брат", en: "younger sister / older brother" },
    ],
  },
  {
    id: "ot3",
    topic: "Опишете типичен ден за вас.",
    topicEn: "Describe a typical day for you.",
    sampleAnswer:
      "Ставам в седем часа сутринта. Закусвам и отивам на лекции в медицинския университет. Имам лекции от осем до единадесет часа, после практически упражнения в болницата. Обядвам в студентски стол. Следобед уча или ходя в библиотека. Вечерям в осем часа и лягам около единадесет.",
    sampleAnswerEn:
      "I get up at seven in the morning. I have breakfast and go to lectures at the medical university. I have lectures from eight to eleven, then practical exercises at the hospital. I have lunch in the student canteen. In the afternoon I study or go to the library. I have dinner at eight and go to bed around eleven.",
    keyPhrases: [
      { bg: "ставам", en: "I get up" },
      { bg: "практически упражнения", en: "practical exercises" },
      { bg: "студентски стол", en: "student canteen" },
      { bg: "лягам", en: "I go to bed" },
    ],
  },
  {
    id: "ot4",
    topic: "Как прекарвате свободното си време? Имате ли хобита?",
    topicEn: "How do you spend your free time? Do you have any hobbies?",
    sampleAnswer:
      "В свободното си време обичам да чета медицинска литература и да гледам документални филми. Спортувам три пъти седмично — ходя на фитнес или плувам. Обичам също да готвя и да слушам музика. Понякога излизам с приятели на кафе или разходка в парка.",
    sampleAnswerEn:
      "In my free time I like to read medical literature and watch documentaries. I do sport three times a week — I go to the gym or swim. I also like to cook and listen to music. Sometimes I go out with friends for coffee or a walk in the park.",
    keyPhrases: [
      { bg: "в свободното си време", en: "in my free time" },
      { bg: "обичам да", en: "I like to" },
      { bg: "спортувам", en: "I do sport / exercise" },
      { bg: "понякога излизам с приятели", en: "sometimes I go out with friends" },
    ],
  },
  {
    id: "ot5",
    topic: "Пловдив през вашите очи.",
    topicEn: "Plovdiv through your eyes.",
    sampleAnswer:
      "Пловдив е красив и интересен град. Харесва ми Старият град с античните руини и цветните къщи. Главната пешеходна улица е оживена и приятна за разходка. Пловдив е с богата история и много музеи. Хората са приятелски настроени. Горд съм, че уча медицина точно тук.",
    sampleAnswerEn:
      "Plovdiv is a beautiful and interesting city. I like the Old Town with the ancient ruins and colorful houses. The main pedestrian street is lively and pleasant for walking. Plovdiv has a rich history and many museums. The people are friendly. I'm proud to study medicine here.",
    keyPhrases: [
      { bg: "харесва ми", en: "I like (it)" },
      { bg: "Старият град", en: "the Old Town" },
      { bg: "богата история", en: "rich history" },
      { bg: "горд/а съм, че", en: "I'm proud that (m/f)" },
    ],
  },
  {
    id: "ot6",
    topic: "Здравословен начин на живот.",
    topicEn: "Healthy lifestyle.",
    sampleAnswer:
      "Здравословният начин на живот включва правилно хранене, редовна физическа активност и достатъчно сън. Като бъдещ лекар знам колко е важна профилактиката. Стараям се да ям повече плодове и зеленчуци и да избягвам бързото хранене. Спортувам редовно и се стремя да не пуша и да не пия алкохол.",
    sampleAnswerEn:
      "A healthy lifestyle includes proper nutrition, regular physical activity, and sufficient sleep. As a future doctor I know how important prevention is. I try to eat more fruits and vegetables and avoid fast food. I exercise regularly and strive not to smoke or drink alcohol.",
    keyPhrases: [
      { bg: "здравословен начин на живот", en: "healthy lifestyle" },
      { bg: "профилактика", en: "prevention" },
      { bg: "стараям се да", en: "I try to" },
      { bg: "стремя се да не", en: "I strive not to" },
    ],
  },
  {
    id: "ot7",
    topic: "Разкажете как празнувате.",
    topicEn: "Tell us how you celebrate.",
    sampleAnswer:
      "В страната ми коледните празници са много важни. Събираме се с цялото семейство и приготвяме традиционни ястия. В България ми харесват имените дни — интересна традиция. На Нова година излизаме с приятели. Обичам да празнувам с близки хора.",
    sampleAnswerEn:
      "In my country the Christmas holidays are very important. We gather with the whole family and prepare traditional dishes. In Bulgaria I like name days — an interesting tradition. On New Year's Eve we go out with friends. I like to celebrate with close people.",
    keyPhrases: [
      { bg: "събираме се", en: "we gather" },
      { bg: "традиционни ястия", en: "traditional dishes" },
      { bg: "имен ден", en: "name day" },
      { bg: "обичам да празнувам с", en: "I like to celebrate with" },
    ],
  },
  {
    id: "ot8",
    topic: "Как пазарувате?",
    topicEn: "How do you shop?",
    sampleAnswer:
      "Обикновено пазарувам веднъж или два пъти седмично в супермаркета. Купувам основно хранителни стоки — хляб, мляко, плодове, зеленчуци. Понякога купувам дрехи в магазин или онлайн. Внимавам колко харча, защото съм студент. Преди да купя нещо скъпо, сравнявам цените.",
    sampleAnswerEn:
      "I usually shop once or twice a week at the supermarket. I mainly buy food — bread, milk, fruits, vegetables. Sometimes I buy clothes in a store or online. I'm careful how much I spend because I'm a student. Before buying something expensive, I compare prices.",
    keyPhrases: [
      { bg: "пазарувам", en: "I shop" },
      { bg: "хранителни стоки", en: "food / groceries" },
      { bg: "сравнявам цените", en: "I compare prices" },
      { bg: "внимавам колко харча", en: "I'm careful how much I spend" },
    ],
  },
  {
    id: "ot9",
    topic: "Разкажете за любимата си храна и напитки.",
    topicEn: "Tell us about your favorite foods and drinks.",
    sampleAnswer:
      "Обичам разнообразна храна. От българската кухня харесвам баница и шопска салата. Любимото ми ястие от родината ми е [кушарѝ — ориз с леща]. Пия предимно вода и чай. Избягвам газираните напитки. Готвя си сам и се стремя да ям здравословно.",
    sampleAnswerEn:
      "I like varied food. From Bulgarian cuisine I like banitsa and shopska salad. My favorite dish from my homeland is [koshari — rice with lentils]. I mainly drink water and tea. I avoid carbonated drinks. I cook for myself and try to eat healthily.",
    keyPhrases: [
      { bg: "любимото ми ястие е", en: "my favorite dish is" },
      { bg: "от българската кухня", en: "from Bulgarian cuisine" },
      { bg: "пия предимно", en: "I mainly drink" },
      { bg: "избягвам", en: "I avoid" },
    ],
  },
  {
    id: "ot10",
    topic: "Какво правите, когато имате нужда от спешна помощ?",
    topicEn: "What do you do when you need emergency assistance?",
    sampleAnswer:
      "При спешен случай веднага се обаждам на телефон 112 — това е единният европейски номер за спешни случаи. Описвам ясно местонахождението и проблема. Ако е нужно, оказвам първа помощ докато чакам линейката. Като медицински студент знам как да реагирам — да не местя пострадалия при счупване, да поставя в стабилно странично положение при загуба на съзнание.",
    sampleAnswerEn:
      "In an emergency I immediately call 112 — the single European emergency number. I clearly describe the location and the problem. If necessary, I provide first aid while waiting for the ambulance. As a medical student I know how to respond — not to move the injured person in case of fracture, to place in stable side position in case of loss of consciousness.",
    keyPhrases: [
      { bg: "при спешен случай", en: "in an emergency" },
      { bg: "единният европейски номер", en: "the single European number" },
      { bg: "оказвам първа помощ", en: "I provide first aid" },
      { bg: "стабилно странично положение", en: "stable side position (recovery position)" },
    ],
  },
];

// ── Oral exam — case study cards (drawn by slip in the real exam) ────────

export const CASE_STUDY_CARDS: CaseStudyCard[] = [
  {
    id: "cs1",
    disease: "Ринит",
    diseaseEn: "Rhinitis",
    scenario: "Пациент на 30 години се оплаква от хрема, запушен нос и леко главоболие от 4 дни. Температура няма. Има алергия към полен.",
    scenarioEn: "A 30-year-old patient complains of runny nose, blocked nose and slight headache for 4 days. No fever. Has a pollen allergy.",
    expectedPoints: [
      "Вземете анамнеза — откога, провокиращи фактори, алергии",
      "Попитайте за температура и болки в гърлото за изключване на тонзилит",
      "Диагноза: алергичен ринит",
      "Лечение: антихистамини, назален спрей, избягване на алергена",
    ],
    expectedPointsEn: [
      "Take history — since when, triggering factors, allergies",
      "Ask about fever and sore throat to rule out tonsillitis",
      "Diagnosis: allergic rhinitis",
      "Treatment: antihistamines, nasal spray, avoid allergen",
    ],
  },
  {
    id: "cs2",
    disease: "Астма",
    diseaseEn: "Asthma",
    scenario: "Пациент на 22 години има задух и хрипове при физическо усилие и нощем. Алергичен е към акари и котешки косми. Имал е подобни епизоди преди.",
    scenarioEn: "A 22-year-old patient has shortness of breath and wheezing during physical exertion and at night. Allergic to dust mites and cat hair. Has had similar episodes before.",
    expectedPoints: [
      "Анамнеза — честота на епизодите, алергии, фамилна история",
      "Физикален преглед — аускултация на бели дробове",
      "Назначете спирометрия",
      "Лечение: бронходилататор (салбутамол), инхалаторен кортикостероид, избягване на алергени",
    ],
    expectedPointsEn: [
      "History — frequency of episodes, allergies, family history",
      "Physical examination — auscultation of lungs",
      "Order spirometry",
      "Treatment: bronchodilator (salbutamol), inhaled corticosteroid, avoid allergens",
    ],
  },
  {
    id: "cs3",
    disease: "Тонзилит",
    diseaseEn: "Tonsillitis",
    scenario: "Пациент на 19 години има силна болка в гърлото, затруднено преглъщане и температура 38.5°C от 2 дни. Сливиците са увеличени с бял налеп.",
    scenarioEn: "A 19-year-old patient has severe throat pain, difficulty swallowing and fever 38.5°C for 2 days. Tonsils are enlarged with white coating.",
    expectedPoints: [
      "Прегледайте гърлото — оценете сливиците",
      "Вземете натривка за бактериална култура",
      "Диагноза: бактериален тонзилит",
      "Лечение: пеницилин или амоксицилин 7-10 дни, болкоуспокояващо, почивка",
    ],
    expectedPointsEn: [
      "Examine the throat — assess the tonsils",
      "Take a swab for bacterial culture",
      "Diagnosis: bacterial tonsillitis",
      "Treatment: penicillin or amoxicillin 7-10 days, painkiller, rest",
    ],
  },
  {
    id: "cs4",
    disease: "Грип",
    diseaseEn: "Influenza",
    scenario: "Пациент на 45 години с внезапна температура 39°C, силни болки в мускулите, главоболие и суха кашлица от 1 ден. Контакт с болен колега преди 3 дни.",
    scenarioEn: "A 45-year-old patient with sudden fever 39°C, severe muscle aches, headache and dry cough for 1 day. Contact with a sick colleague 3 days ago.",
    expectedPoints: [
      "Анамнеза — внезапно начало, контакт с болни",
      "Разграничете от настинка — при грипа началото е внезапно, симптомите са по-тежки",
      "Лечение: почивка, течности, парацетамол, при тежки случаи — осертамивир",
      "Препоръчайте ваксинация за следващата година",
    ],
    expectedPointsEn: [
      "History — sudden onset, contact with sick people",
      "Differentiate from common cold — flu onset is sudden, symptoms are more severe",
      "Treatment: rest, fluids, paracetamol, oseltamivir in severe cases",
      "Recommend vaccination for next year",
    ],
  },
  {
    id: "cs5",
    disease: "Фрактура",
    diseaseEn: "Fracture",
    scenario: "Пациент на 35 години е паднал на ръка при спорт. Китката е силно подута и болезнена. Не може да движи ръката нормално.",
    scenarioEn: "A 35-year-old patient fell on their hand during sport. The wrist is severely swollen and painful. Cannot move the arm normally.",
    expectedPoints: [
      "Оценете оток, деформация, болка при натиск",
      "Назначете рентгенова снимка",
      "Диагноза: затворена фрактура на лъчева кост",
      "Лечение: имобилизация с гипс за 6 седмици, рехабилитация след свалянето",
    ],
    expectedPointsEn: [
      "Assess swelling, deformity, pain on pressure",
      "Order X-ray",
      "Diagnosis: closed fracture of the radius",
      "Treatment: immobilization with plaster cast for 6 weeks, rehabilitation after removal",
    ],
  },
  {
    id: "cs6",
    disease: "Хипертония",
    diseaseEn: "Hypertension",
    scenario: "Пациент на 58 години с главоболие и световъртеж. Кръвно налягане 170/110. Пуши, не спортува. Баща му е починал от инфаркт.",
    scenarioEn: "A 58-year-old patient with headache and dizziness. Blood pressure 170/110. Smokes, does not exercise. Father died of a heart attack.",
    expectedPoints: [
      "Вземете подробна анамнеза — лекарства, фамилна история, начин на живот",
      "Оценете рискови фактори: тютюнопушене, наследственост, липса на движение",
      "Назначете ЕКГ и кръвни изследвания",
      "Лечение: антихипертензивни, диета с малко сол, спорт, спиране на тютюнопушенето",
    ],
    expectedPointsEn: [
      "Take detailed history — medications, family history, lifestyle",
      "Assess risk factors: smoking, heredity, lack of exercise",
      "Order ECG and blood tests",
      "Treatment: antihypertensives, low-salt diet, exercise, smoking cessation",
    ],
  },
  {
    id: "cs7",
    disease: "Бъбречни камъни",
    diseaseEn: "Kidney Stones",
    scenario: "Пациент на 40 години с внезапна много силна болка в кръста, излъчваща се към слабините. Гадене и леко кърваво оцветяване на урината.",
    scenarioEn: "A 40-year-old patient with sudden severe pain in the lower back, radiating to the groin. Nausea and slight blood-tinged urine.",
    expectedPoints: [
      "Разпознайте бъбречна колика по характерната болка",
      "Назначете ехография на бъбреците и изследване на урина",
      "Лечение: спазмолитик, болкоуспокояващо, обилен прием на течности",
      "При голям камък — урологична консултация",
    ],
    expectedPointsEn: [
      "Recognize renal colic by the characteristic pain",
      "Order kidney ultrasound and urine test",
      "Treatment: antispasmodic, painkiller, abundant fluid intake",
      "For large stone — urological consultation",
    ],
  },
  {
    id: "cs8",
    disease: "Изгаряне",
    diseaseEn: "Burns",
    scenario: "Пациент на 25 години с изгаряне на предмишницата от гореща вода. Има зачервяване и мехури. Болката е силна.",
    scenarioEn: "A 25-year-old patient with a burn on the forearm from hot water. There is redness and blisters. The pain is severe.",
    expectedPoints: [
      "Определете степента — наличие на мехури = втора степен",
      "Охлаждане с хладка (не ледена) вода 10-20 минути",
      "Не пукайте мехурите",
      "Стерилна превръзка, болкоуспокояващо, следете за инфекция",
    ],
    expectedPointsEn: [
      "Determine degree — presence of blisters = second degree",
      "Cooling with cool (not ice cold) water for 10-20 minutes",
      "Do not pop the blisters",
      "Sterile dressing, painkiller, monitor for infection",
    ],
  },
];

// ── Practice exam questions (60 total — written section) ─────────────────
// Distribution matches the syllabus:
//   Grammar topics 1-10: ~30 questions
//   Vocabulary topics 1-12: ~20 questions
//   Comprehension (disease matching, medical history): ~10 questions

export const MEDICAL_QUESTIONS: MedicalQuestion[] = [

  // ── GRAMMAR 1: Nouns — gender, number, articles, plural ─────────────

  {
    id: "mq_g1_1",
    category: "grammar_nouns",
    prompt: "Книга___ е на масата. (определителен член)",
    options: ["Книгата", "Книгаят", "Книгата", "Книгата"],
    correct: 0,
    explanation: "Feminine nouns take -та as definite article.",
  },
  {
    id: "mq_g1_2",
    category: "grammar_nouns",
    prompt: "Лекар___ дойде в шест часа. (определителен член)",
    options: ["Лекарят", "Лекаря", "Лекарта", "Лекарто"],
    correct: 0,
    explanation: "Masculine nouns take -ят (subject) or -я (object) as definite article.",
  },
  {
    id: "mq_g1_3",
    category: "grammar_nouns",
    prompt: "Какво е множественото число на 'лекар'?",
    options: ["лекарите", "лекари", "лекарове", "лекаре"],
    correct: 1,
    explanation: "'Лекари' is the correct plural of лекар.",
  },
  {
    id: "mq_g1_4",
    category: "grammar_nouns",
    prompt: "Какво е множественото число на 'бъбрек'?",
    options: ["бъбреки", "бъбреците", "бъбрекове", "бъбреци"],
    correct: 3,
    explanation: "'Бъбреци' — k→ts mutation in plural is standard for this noun.",
  },
  {
    id: "mq_g1_5",
    category: "grammar_nouns",
    prompt: "Стол___ е счупен. (определителен член)",
    options: ["Столят", "Столът", "Столта", "Столто"],
    correct: 1,
    explanation: "Masculine inanimate nouns take -ът in subject position.",
  },

  // ── GRAMMAR 2: Adjectives — gender, number, articles, agreement ──────

  {
    id: "mq_g2_1",
    category: "grammar_adjectives",
    prompt: "Пациентът има ___ болка в гърдите.",
    options: ["силен", "силна", "силно", "силни"],
    correct: 1,
    explanation: "Болка is feminine, so adjective must be feminine: силна.",
  },
  {
    id: "mq_g2_2",
    category: "grammar_adjectives",
    prompt: "Изберете правилното изречение:",
    options: [
      "Пациентката е млада и здрав.",
      "Пациентката е млада и здрава.",
      "Пациентката е млади и здрава.",
      "Пациентката е младо и здрава.",
    ],
    correct: 1,
    explanation: "Both adjectives must agree with feminine subject: млада, здрава.",
  },
  {
    id: "mq_g2_3",
    category: "grammar_adjectives",
    prompt: "Синоним на 'силна болка' е:",
    options: ["лека болка", "остра болка", "тъпа болка", "стара болка"],
    correct: 1,
    explanation: "Остра болка (sharp/intense pain) is a synonym for strong pain in medical context.",
  },
  {
    id: "mq_g2_4",
    category: "grammar_adjectives",
    prompt: "Антоним на 'остра болка' е:",
    options: ["силна болка", "хронична болка", "тъпа болка", "пареща болка"],
    correct: 2,
    explanation: "Тъпа болка (dull pain) is the antonym of остра болка (sharp pain).",
  },

  // ── GRAMMAR 3: Pronouns ───────────────────────────────────────────────

  {
    id: "mq_g3_1",
    category: "grammar_pronouns",
    prompt: "Купих нова книга и бързо ___ прочетох.",
    options: ["го", "я", "му", "им"],
    correct: 1,
    explanation: "Книга is feminine, direct object pronoun is 'я'.",
  },
  {
    id: "mq_g3_2",
    category: "grammar_pronouns",
    prompt: "Обадих се на пациента и ___ обясних лечението.",
    options: ["го", "му", "я", "им"],
    correct: 1,
    explanation: "Indirect object (на пациента) uses dative clitic 'му'.",
  },
  {
    id: "mq_g3_3",
    category: "grammar_pronouns",
    prompt: "— Видяхте ли новия лекар? — Да, видях ___.",
    options: ["него", "го", "му", "него го"],
    correct: 1,
    explanation: "Short direct object pronoun: го.",
  },
  {
    id: "mq_g3_4",
    category: "grammar_pronouns",
    prompt: "___ боли гърлото от три дни. (impersonal construction, 1st person sg.)",
    options: ["Мен", "Ме", "Ми", "Аз"],
    correct: 1,
    explanation: "Impersonal construction: Ме боли (accusative clitic).",
  },
  {
    id: "mq_g3_5",
    category: "grammar_pronouns",
    prompt: "— Ще донесеш ли резултатите на пациента? — Да, ___ донеса.",
    options: ["ще му ги", "ще ги му", "ще донеса му ги", "ще ги донеса му"],
    correct: 0,
    explanation: "Correct clitic order: дативен (му) + акузативен (ги): ще му ги донеса.",
  },

  // ── GRAMMAR 4: Verbs — tenses, imperative, passive ───────────────────

  {
    id: "mq_g4_1",
    category: "grammar_verbs",
    prompt: "Пациентът ___ силна болка в гърдите. (сегашно време)",
    options: ["имате", "имам", "има", "имаме"],
    correct: 2,
    explanation: "3rd person singular present: има.",
  },
  {
    id: "mq_g4_2",
    category: "grammar_verbs",
    prompt: "Ще ___ рентгенова снимка утре. (1st person plural)",
    options: ["направиш", "направим", "направи", "направите"],
    correct: 1,
    explanation: "Future 1st person plural: ще направим.",
  },
  {
    id: "mq_g4_3",
    category: "grammar_verbs",
    prompt: "Вчера лекарят ___ пациента внимателно.",
    options: ["прегледва", "ще прегледа", "прегледа", "преглеждат"],
    correct: 2,
    explanation: "Past simple (aorist) 3rd person singular: прегледа.",
  },
  {
    id: "mq_g4_4",
    category: "grammar_verbs",
    prompt: "___ устата, моля! (императив)",
    options: ["Отвори", "Отворете", "Отваряйте", "Отваря"],
    correct: 1,
    explanation: "Formal imperative (Вие-form): Отворете.",
  },
  {
    id: "mq_g4_5",
    category: "grammar_verbs",
    prompt: "Пушенето в болницата ___.",
    options: ["не разрешено", "разрешено е", "не е разрешено", "е не разрешено"],
    correct: 2,
    explanation: "Passive construction: не е разрешено (is not permitted).",
  },
  {
    id: "mq_g4_6",
    category: "grammar_verbs",
    prompt: "Пациентът ___ в болницата от вчера.",
    options: ["хоспитализира се", "е хоспитализиран", "хоспитализира", "се хоспитализира"],
    correct: 1,
    explanation: "Past passive: е хоспитализиран.",
  },

  // ── GRAMMAR 5: Numerals ───────────────────────────────────────────────

  {
    id: "mq_g5_1",
    category: "grammar_numerals",
    prompt: "Вземайте лекарството ___ пъти дневно.",
    options: ["трима", "три", "трето", "третото"],
    correct: 1,
    explanation: "Cardinal number for counting times: три пъти.",
  },
  {
    id: "mq_g5_2",
    category: "grammar_numerals",
    prompt: "Пациентът е в ___ стая. (ordinal number, feminine)",
    options: ["три", "третата", "третото", "трима"],
    correct: 1,
    explanation: "Ordinal, feminine definite: третата стая.",
  },
  {
    id: "mq_g5_3",
    category: "grammar_numerals",
    prompt: "На покрива ___ щъркела са свили гнездо.",
    options: ["двама", "две", "два", "двете"],
    correct: 2,
    explanation: "Два is used with masculine inanimate nouns (два щъркела).",
  },

  // ── GRAMMAR 6: Participles ────────────────────────────────────────────

  {
    id: "mq_g6_1",
    category: "grammar_participles",
    prompt: "Лекарят, ___ пациента, откри фрактура. (сегашно деятелно причастие от 'преглежда')",
    options: ["прегледал", "преглеждащ", "преглеждан", "прегледан"],
    correct: 1,
    explanation: "Present active participle: преглеждащ (the doctor who is examining).",
  },
  {
    id: "mq_g6_2",
    category: "grammar_participles",
    prompt: "Пациентът, ___ вчера, вече е вкъщи. (минало страдателно причастие от 'изписвам')",
    options: ["изписващ", "изписал", "изписан", "изписване"],
    correct: 2,
    explanation: "Past passive participle: изписан (discharged).",
  },
  {
    id: "mq_g6_3",
    category: "grammar_participles",
    prompt: "Лекарят, ___ пациента преди месец, не го познава вече. (минало деятелно причастие)",
    options: ["прегледащ", "преглеждан", "прегледал", "преглеждащ"],
    correct: 2,
    explanation: "Past active participle: прегледал (who examined).",
  },

  // ── GRAMMAR 7: Prepositions of place and motion ───────────────────────

  {
    id: "mq_g7_1",
    category: "grammar_prepositions",
    prompt: "Пациентът отиде ___ болницата.",
    options: ["в", "на", "от", "до"],
    correct: 0,
    explanation: "Motion towards enclosed space: в (into the hospital).",
  },
  {
    id: "mq_g7_2",
    category: "grammar_prepositions",
    prompt: "Болката се излъчва ___ кръста ___ слабините.",
    options: ["от / към", "в / при", "на / за", "до / от"],
    correct: 0,
    explanation: "Radiation of pain: от (from) кръста към (towards) слабините.",
  },
  {
    id: "mq_g7_3",
    category: "grammar_prepositions",
    prompt: "Вземайте лекарството ___ хранене.",
    options: ["след", "при", "без", "върху"],
    correct: 0,
    explanation: "After meals: след хранене.",
  },

  // ── GRAMMAR 8: Word formation ─────────────────────────────────────────

  {
    id: "mq_g8_1",
    category: "grammar_word_formation",
    prompt: "Образувайте съществително от глагола 'лекувам':",
    options: ["лекуване", "лекуващ", "лекуван", "лекувателен"],
    correct: 0,
    explanation: "Noun from verb via -ане suffix: лекуване (treatment/healing).",
  },
  {
    id: "mq_g8_2",
    category: "grammar_word_formation",
    prompt: "Образувайте прилагателно от съществителното 'сърце':",
    options: ["сърцев", "сърцен", "сърчен", "сърдечен"],
    correct: 3,
    explanation: "Adjective from сърце: сърдечен (cardiac).",
  },
  {
    id: "mq_g8_3",
    category: "grammar_word_formation",
    prompt: "Коя е правилната сложна дума за 'свързана с сърцето и съдовете'?",
    options: ["сърце-съдова", "сърдечна-съдова", "сърдечно-съдова", "сърдечносъдов"],
    correct: 2,
    explanation: "Compound adjective: сърдечно-съдова (cardiovascular).",
  },

  // ── GRAMMAR 9: Instructions and recommendations ───────────────────────

  {
    id: "mq_g9_1",
    category: "grammar_recommendations",
    prompt: "Трябва ___ вземате лекарството редовно.",
    options: ["да", "че", "за", "и"],
    correct: 0,
    explanation: "Трябва да + verb: standard structure for obligation.",
  },
  {
    id: "mq_g9_2",
    category: "grammar_recommendations",
    prompt: "Препоръчвам ви ___ пиете повече вода.",
    options: ["да", "за", "при", "ако"],
    correct: 0,
    explanation: "Препоръчвам ви да + verb: I recommend that you...",
  },
  {
    id: "mq_g9_3",
    category: "grammar_recommendations",
    prompt: "Не ___ пушите в болницата. (formal prohibition)",
    options: ["можете да", "трябва да", "бива да", "искате да"],
    correct: 2,
    explanation: "Не бива да = you must not / it is not allowed to.",
  },

  // ── GRAMMAR 10: Taking medical history ───────────────────────────────

  {
    id: "mq_g10_1",
    category: "grammar_medical_history",
    prompt: "Как питате пациента откога има оплаквания?",
    options: [
      "Колко ви боли?",
      "Откога имате тези оплаквания?",
      "Имате ли алергия?",
      "Приемате ли лекарства?",
    ],
    correct: 1,
    explanation: "Откога имате тези оплаквания? = How long have you had these complaints?",
  },
  {
    id: "mq_g10_2",
    category: "grammar_medical_history",
    prompt: "Как казвате на пациента да опише болката?",
    options: ["Покажете карта.", "Опишете болката.", "Излезте навън.", "Легнете."],
    correct: 1,
    explanation: "Опишете болката = Describe the pain (formal imperative).",
  },
  {
    id: "mq_g10_3",
    category: "grammar_medical_history",
    prompt: "Как питате дали пациентът пуши?",
    options: ["Пиете ли вода?", "Пушите ли?", "Ядете ли редовно?", "Спите ли добре?"],
    correct: 1,
    explanation: "Пушите ли? = Do you smoke? (formal Вие-form).",
  },

  // ── VOCABULARY: Body & Symptoms ───────────────────────────────────────

  {
    id: "mq_v1",
    category: "vocabulary",
    prompt: "Какво означава 'задух'?",
    options: ["Сърбеж", "Затруднено дишане", "Болка в гърба", "Гадене"],
    correct: 1,
  },
  {
    id: "mq_v2",
    category: "vocabulary",
    prompt: "Какво означава 'хрипове'?",
    options: [
      "Кашлица",
      "Звукове при дишане поради стеснени дихателни пътища",
      "Болка при кашляне",
      "Висока температура",
    ],
    correct: 1,
  },
  {
    id: "mq_v3",
    category: "vocabulary",
    prompt: "Как се казва на медицински 'камъни в бъбреците'?",
    options: ["Хипертония", "Нефролитиаза", "Тонзилит", "Синузит"],
    correct: 1,
  },
  {
    id: "mq_v4",
    category: "vocabulary",
    prompt: "Какво е 'хематурия'?",
    options: ["Кръв в кръвта", "Кръв в урината", "Кръв в слюнката", "Кръв в изпражненията"],
    correct: 1,
  },
  {
    id: "mq_v5",
    category: "vocabulary",
    prompt: "Какво означава 'репозиция' при луксация?",
    options: [
      "Операция",
      "Връщане на кост/става на нормалното й място",
      "Поставяне на гипс",
      "Физиотерапия",
    ],
    correct: 1,
  },
  {
    id: "mq_v6",
    category: "vocabulary",
    prompt: "'Втрисане' означава:",
    options: [
      "Усещане за студ и треперене при температура",
      "Силно кървене",
      "Болки в корема",
      "Загуба на съзнание",
    ],
    correct: 0,
  },
  {
    id: "mq_v7",
    category: "vocabulary",
    prompt: "Какво е 'муколитик'?",
    options: [
      "Лекарство за болка",
      "Лекарство за разреждане на слузта",
      "Лекарство за температура",
      "Лекарство за алергия",
    ],
    correct: 1,
  },
  {
    id: "mq_v8",
    category: "vocabulary",
    prompt: "Как се казва 'дислокация' на български?",
    options: ["Навяхване", "Счупване", "Луксация", "Контузия"],
    correct: 2,
  },
  {
    id: "mq_v9",
    category: "vocabulary",
    prompt: "Какво е 'аускултация'?",
    options: [
      "Измерване на кръвното налягане",
      "Слушане на звуци в тялото с фонендоскоп",
      "Кръвен тест",
      "Рентгенова снимка",
    ],
    correct: 1,
  },
  {
    id: "mq_v10",
    category: "vocabulary",
    prompt: "Какво означава 'спирометрия'?",
    options: [
      "Изследване на кръвното налягане",
      "Изследване на белодробния капацитет",
      "Ехография на бъбреците",
      "Изследване на сърдечния ритъм",
    ],
    correct: 1,
  },
  {
    id: "mq_v11",
    category: "vocabulary",
    prompt: "Какво е 'бронходилататор'?",
    options: [
      "Лекарство за разширяване на бронхите",
      "Лекарство за стесняване на бронхите",
      "Витамин за имунитет",
      "Антибиотик",
    ],
    correct: 0,
  },
  {
    id: "mq_v12",
    category: "vocabulary",
    prompt: "Какво е 'хоспитализация'?",
    options: [
      "Изписване от болницата",
      "Постъпване и лечение в болница",
      "Амбулаторен преглед",
      "Домашно лечение",
    ],
    correct: 1,
  },

  // ── COMPREHENSION: Disease matching ──────────────────────────────────

  {
    id: "mq_c1",
    category: "comprehension",
    prompt:
      "Пациент има хрипове, задух при усилие и нощем, алергия към прах. Вероятна диагноза?",
    options: ["Ринит", "Астма", "Бронхит", "Грип"],
    correct: 1,
  },
  {
    id: "mq_c2",
    category: "comprehension",
    prompt:
      "Внезапна температура 39°C, болки в мускулите, главоболие, суха кашлица. Вероятна диагноза?",
    options: ["Синузит", "Тонзилит", "Грип", "Хипертония"],
    correct: 2,
  },
  {
    id: "mq_c3",
    category: "comprehension",
    prompt:
      "Болка в кръста, излъчваща се към слабините, кръв в урината, гадене. Вероятна диагноза?",
    options: ["Бъбречни камъни", "Фрактура", "Навяхване", "Ринит"],
    correct: 0,
  },
  {
    id: "mq_c4",
    category: "comprehension",
    prompt: "Налягане 165/105, главоболие, световъртеж. Диагноза?",
    options: ["Хипотония", "Хипертония", "Тахикардия", "Аритмия"],
    correct: 1,
  },
  {
    id: "mq_c5",
    category: "comprehension",
    prompt:
      "Болки в синусите, гноен секрет, главоболие, болката се усилва при навеждане. Диагноза?",
    options: ["Ринит", "Синузит", "Тонзилит", "Бронхит"],
    correct: 1,
  },
  {
    id: "mq_c6",
    category: "comprehension",
    prompt:
      "Силна болка в гърлото, затруднено преглъщане, температура 38.5°C, бял налеп по сливиците. Диагноза?",
    options: ["Ринит", "Синузит", "Тонзилит", "Бронхит"],
    correct: 2,
  },
  {
    id: "mq_c7",
    category: "comprehension",
    prompt: "Пациент пада на ръка, китката е подута и болезнена. Не може да движи ръката. Следваща стъпка?",
    options: [
      "Дайте антибиотик",
      "Назначете рентгенова снимка",
      "Поставете инхалатор",
      "Измерете кръвното",
    ],
    correct: 1,
  },
  {
    id: "mq_c8",
    category: "comprehension",
    prompt: "Пациент с изгаряне от гореща вода, мехури на ръката. Каква степен?",
    options: ["Първа степен", "Втора степен", "Трета степен", "Четвърта степен"],
    correct: 1,
    explanation: "Blisters = second degree burn.",
  },
  {
    id: "mq_c9",
    category: "comprehension",
    prompt:
      "Пациент усуква глезена, има оток, но може да стъпи. Рентгенът не показва счупване. Диагноза?",
    options: ["Фрактура", "Луксация", "Навяхване", "Хипертония"],
    correct: 2,
  },
  {
    id: "mq_c10",
    category: "comprehension",
    prompt: "Пациент с рамо, изскочило при падане, не може да движи ръката. Лечение?",
    options: ["Гипс за 6 седмици", "Репозиция и имобилизация", "Само почивка", "Антибиотик"],
    correct: 1,
  },
];

// ── Exam mode config ─────────────────────────────────────────────────────

export const EXAM_CONFIG = {
  writtenDurationMinutes: 90,
  writtenPassThreshold: 0.6,   // 60% to pass written and unlock oral
  writtenQuestionCount: 60,    // all questions used in exam mode
  studyQuestionCount: 20,      // random 20 in study/practice mode
  oralCaseStudyCount: 8,       // number of case study cards in oral section
};
