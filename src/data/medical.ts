// Bulgarian medical language exam prep.
// For foreign medical students and doctors practicing in Bulgaria.
// Based on official exam syllabus: grammar, vocabulary, 12 diseases,
// medical history phrases, patient communication.

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
  | "emergency";

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

  // Symptoms
  { bg: "болка", en: "pain", category: "symptoms" },
  { bg: "остра болка", en: "sharp pain", category: "symptoms" },
  { bg: "тъпа болка", en: "dull pain", category: "symptoms" },
  { bg: "пареща болка", en: "burning pain", category: "symptoms" },
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

  // 12 diseases from the exam syllabus
  { bg: "ринит", en: "rhinitis", category: "diseases" },
  { bg: "синузит", en: "sinusitis", category: "diseases" },
  { bg: "астма", en: "asthma", category: "diseases" },
  { bg: "бронхит", en: "bronchitis", category: "diseases" },
  { bg: "тонзилит", en: "tonsillitis", category: "diseases" },
  { bg: "грип", en: "influenza / flu", category: "diseases" },
  { bg: "изгаряне", en: "burn", category: "diseases" },
  { bg: "навяхване", en: "sprain", category: "diseases" },
  { bg: "навяхване на глезена", en: "ankle sprain", category: "diseases" },
  { bg: "луксация", en: "dislocation", category: "diseases" },
  { bg: "счупване", en: "fracture", category: "diseases" },
  { bg: "фрактура", en: "fracture (clinical)", category: "diseases" },
  { bg: "нефролитиаза", en: "nephrolithiasis / kidney stones", category: "diseases" },
  { bg: "бъбречни камъни", en: "kidney stones", category: "diseases" },
  { bg: "хипертония", en: "hypertension / high blood pressure", category: "diseases" },
  { bg: "хронична болест", en: "chronic disease", category: "diseases" },
  { bg: "остро заболяване", en: "acute illness", category: "diseases" },
  { bg: "инфекция", en: "infection", category: "diseases" },
  { bg: "възпаление", en: "inflammation", category: "diseases" },
  { bg: "пневмония", en: "pneumonia", category: "diseases" },

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
];

// ── Disease dialogues — doctor/patient for all 12 exam diseases ──────────

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
      { speaker: "Лекар", bg: "Какви оплаквания имате?", en: "What complaints do you have?" },
      { speaker: "Пациент", bg: "Имам хрема и запушен нос от три дни.", en: "I have a runny nose and blocked nose for three days." },
      { speaker: "Лекар", bg: "Имате ли температура или болки в гърлото?", en: "Do you have a fever or sore throat?" },
      { speaker: "Пациент", bg: "Леко ме боли главата, но температура нямам.", en: "I have a slight headache but no fever." },
      { speaker: "Лекар", bg: "Ще ви предпиша спрей за нос и капки.", en: "I will prescribe you nasal spray and drops." },
    ],
    keyVocab: [
      { bg: "хрема", en: "runny nose" },
      { bg: "запушен нос", en: "blocked nose" },
      { bg: "назален спрей", en: "nasal spray" },
      { bg: "алергичен ринит", en: "allergic rhinitis" },
    ],
    treatment: "Назален спрей, антихистамини при алергичен ринит, физиологичен разтвор.",
    treatmentEn: "Nasal spray, antihistamines for allergic rhinitis, saline solution.",
  },
  {
    disease: "Синузит",
    diseaseEn: "Sinusitis",
    dialogue: [
      { speaker: "Лекар", bg: "Откога имате болки?", en: "How long have you had the pain?" },
      { speaker: "Пациент", bg: "От пет дни имам болки в областта на носа и челото.", en: "For five days I have pain around the nose and forehead." },
      { speaker: "Лекар", bg: "Имате ли главоболие и хрема?", en: "Do you have a headache and runny nose?" },
      { speaker: "Пациент", bg: "Да, и температура тридесет и осем.", en: "Yes, and a fever of thirty-eight." },
      { speaker: "Лекар", bg: "Трябва рентгенова снимка на синусите и антибиотик.", en: "You need an X-ray of the sinuses and an antibiotic." },
    ],
    keyVocab: [
      { bg: "синус", en: "sinus" },
      { bg: "болка в областта на синусите", en: "sinus pain" },
      { bg: "гноен секрет", en: "purulent discharge" },
      { bg: "лечение с антибиотик", en: "antibiotic treatment" },
    ],
    treatment: "Антибиотик (амоксицилин), деконгестанти, физиологичен разтвор за промивка.",
    treatmentEn: "Antibiotic (amoxicillin), decongestants, saline rinse.",
  },
  {
    disease: "Астма",
    diseaseEn: "Asthma",
    dialogue: [
      { speaker: "Лекар", bg: "Как се чувствате?", en: "How do you feel?" },
      { speaker: "Пациент", bg: "Имам задух и хрипове, особено нощем.", en: "I have shortness of breath and wheezing, especially at night." },
      { speaker: "Лекар", bg: "Имате ли алергия към нещо?", en: "Are you allergic to anything?" },
      { speaker: "Пациент", bg: "Да, към прах и котешки косми.", en: "Yes, to dust and cat hair." },
      { speaker: "Лекар", bg: "Ще ви предпиша инхалатор за бронходилатация.", en: "I'll prescribe you a bronchodilator inhaler." },
    ],
    keyVocab: [
      { bg: "задух", en: "shortness of breath" },
      { bg: "хрипове", en: "wheezing" },
      { bg: "инхалатор", en: "inhaler" },
      { bg: "бронходилататор", en: "bronchodilator" },
      { bg: "алерген", en: "allergen" },
    ],
    treatment: "Бронходилататори (салбутамол), инхалаторни кортикостероиди, избягване на алергени.",
    treatmentEn: "Bronchodilators (salbutamol), inhaled corticosteroids, allergen avoidance.",
  },
  {
    disease: "Бронхит",
    diseaseEn: "Bronchitis",
    dialogue: [
      { speaker: "Лекар", bg: "Какво ви тревожи?", en: "What is bothering you?" },
      { speaker: "Пациент", bg: "Кашлям от седмица, кашлицата е влажна.", en: "I've been coughing for a week, the cough is wet." },
      { speaker: "Лекар", bg: "Имате ли температура и задух?", en: "Do you have a fever and shortness of breath?" },
      { speaker: "Пациент", bg: "Температура тридесет и седем и половина.", en: "Fever thirty-seven and a half." },
      { speaker: "Лекар", bg: "Ще ви прослушам бронхите.", en: "I will auscultate your bronchi." },
    ],
    keyVocab: [
      { bg: "бронхи", en: "bronchi" },
      { bg: "влажна кашлица", en: "wet cough" },
      { bg: "муколитик", en: "mucolytic" },
      { bg: "прослушване", en: "auscultation" },
    ],
    treatment: "Муколитици, бронходилататори, при бактериален бронхит — антибиотик.",
    treatmentEn: "Mucolytics, bronchodilators, antibiotic if bacterial.",
  },
  {
    disease: "Тонзилит",
    diseaseEn: "Tonsillitis",
    dialogue: [
      { speaker: "Лекар", bg: "Отворете устата, моля.", en: "Open your mouth, please." },
      { speaker: "Пациент", bg: "Болката в гърлото е много силна.", en: "The throat pain is very strong." },
      { speaker: "Лекар", bg: "Сливиците са зачервени и увеличени.", en: "The tonsils are red and enlarged." },
      { speaker: "Пациент", bg: "Трудно ми е да преглъщам.", en: "It's hard for me to swallow." },
      { speaker: "Лекар", bg: "Ще вземем натривка от гърлото и ще предпишем лечение.", en: "We'll take a throat swab and prescribe treatment." },
    ],
    keyVocab: [
      { bg: "сливици", en: "tonsils" },
      { bg: "болка при преглъщане", en: "pain when swallowing" },
      { bg: "зачервено гърло", en: "red throat" },
      { bg: "натривка", en: "swab" },
    ],
    treatment: "Антибиотик (пеницилин/амоксицилин), болкоуспокояващи, почивка.",
    treatmentEn: "Antibiotic (penicillin/amoxicillin), painkillers, rest.",
  },
  {
    disease: "Грип",
    diseaseEn: "Influenza",
    dialogue: [
      { speaker: "Лекар", bg: "Как сте се разболели?", en: "How did you fall ill?" },
      { speaker: "Пациент", bg: "Изведнъж ми стана лошо — температура тридесет и деветградуса, болки в мускулите.", en: "I suddenly felt bad — fever 39 degrees, muscle aches." },
      { speaker: "Лекар", bg: "Имате ли кашлица и хрема?", en: "Do you have a cough and runny nose?" },
      { speaker: "Пациент", bg: "Да, и силно главоболие.", en: "Yes, and a bad headache." },
      { speaker: "Лекар", bg: "Трябва почивка, много течности и антивирусни.", en: "You need rest, plenty of fluids and antivirals." },
    ],
    keyVocab: [
      { bg: "грип", en: "influenza" },
      { bg: "болки в мускулите", en: "muscle aches" },
      { bg: "антивирусни", en: "antivirals" },
      { bg: "внезапно начало", en: "sudden onset" },
    ],
    treatment: "Почивка, течности, жаропонижаващи, антивирусни (осертамивир при тежки случаи).",
    treatmentEn: "Rest, fluids, antipyretics, antivirals (oseltamivir in severe cases).",
  },
  {
    disease: "Изгаряне",
    diseaseEn: "Burns",
    dialogue: [
      { speaker: "Лекар", bg: "Как се изгорихте?", en: "How did you get burned?" },
      { speaker: "Пациент", bg: "Докоснах гореща тенджера.", en: "I touched a hot pot." },
      { speaker: "Лекар", bg: "Какво направихте веднага след изгарянето?", en: "What did you do immediately after the burn?" },
      { speaker: "Пациент", bg: "Охладих ръката с вода.", en: "I cooled my hand with water." },
      { speaker: "Лекар", bg: "Правилно. Ще поставим стерилна превръзка.", en: "Correct. We will apply a sterile dressing." },
    ],
    keyVocab: [
      { bg: "изгаряне", en: "burn" },
      { bg: "първа степен", en: "first degree" },
      { bg: "втора степен", en: "second degree" },
      { bg: "охлаждане с вода", en: "cooling with water" },
      { bg: "стерилна превръзка", en: "sterile dressing" },
    ],
    treatment: "Охлаждане, стерилна превръзка, при тежки изгаряния — хоспитализация.",
    treatmentEn: "Cooling, sterile dressing, hospitalization for severe burns.",
  },
  {
    disease: "Навяхване",
    diseaseEn: "Sprain",
    dialogue: [
      { speaker: "Лекар", bg: "Какво се е случило?", en: "What happened?" },
      { speaker: "Пациент", bg: "Усукал съм глезена при бягане.", en: "I twisted my ankle while running." },
      { speaker: "Лекар", bg: "Можете ли да стъпите на крака?", en: "Can you stand on your foot?" },
      { speaker: "Пациент", bg: "С болка, но мога.", en: "With pain, but I can." },
      { speaker: "Лекар", bg: "Ще направим рентгенова снимка за изключване на счупване.", en: "We'll take an X-ray to rule out a fracture." },
    ],
    keyVocab: [
      { bg: "навяхване", en: "sprain" },
      { bg: "глезен", en: "ankle" },
      { bg: "оток", en: "swelling" },
      { bg: "студен компрес", en: "cold compress" },
      { bg: "еластична превръзка", en: "elastic bandage" },
    ],
    treatment: "Почивка, студен компрес, еластична превръзка, обезболяващо.",
    treatmentEn: "Rest, cold compress, elastic bandage, painkiller.",
  },
  {
    disease: "Луксация",
    diseaseEn: "Dislocation",
    dialogue: [
      { speaker: "Лекар", bg: "Как се е получило?", en: "How did this happen?" },
      { speaker: "Пациент", bg: "Паднах и рамото ми изскочи.", en: "I fell and my shoulder popped out." },
      { speaker: "Лекар", bg: "Много силна болка ли имате?", en: "Are you in a lot of pain?" },
      { speaker: "Пациент", bg: "Да, не мога да помръдна ръката.", en: "Yes, I can't move my arm." },
      { speaker: "Лекар", bg: "Ще направим репозиция под локална анестезия.", en: "We'll perform reduction under local anesthesia." },
    ],
    keyVocab: [
      { bg: "луксация", en: "dislocation" },
      { bg: "рамо", en: "shoulder" },
      { bg: "репозиция", en: "reduction / repositioning" },
      { bg: "имобилизация", en: "immobilization" },
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
      { speaker: "Лекар", bg: "Ще направим рентгенова снимка.", en: "We'll take an X-ray." },
      { speaker: "Пациент", bg: "Много е подуто и боли силно.", en: "It's very swollen and very painful." },
      { speaker: "Лекар", bg: "Рентгенът показва счупена лъчева кост. Гипс за шест седмици.", en: "The X-ray shows a broken radius. Plaster cast for six weeks." },
    ],
    keyVocab: [
      { bg: "счупване", en: "fracture" },
      { bg: "китка", en: "wrist" },
      { bg: "гипс", en: "plaster cast" },
      { bg: "затворена фрактура", en: "closed fracture" },
      { bg: "открита фрактура", en: "open fracture" },
    ],
    treatment: "Гипс или оперативно лечение, имобилизация, рехабилитация.",
    treatmentEn: "Plaster cast or surgical treatment, immobilization, rehabilitation.",
  },
  {
    disease: "Бъбречни камъни (Нефролитиаза)",
    diseaseEn: "Kidney Stones (Nephrolithiasis)",
    dialogue: [
      { speaker: "Лекар", bg: "Опишете болката.", en: "Describe the pain." },
      { speaker: "Пациент", bg: "Много силна, коликообразна болка в кръста, излъчваща се надолу.", en: "Very strong, colicky pain in the lower back, radiating downward." },
      { speaker: "Лекар", bg: "Имате ли кръв в урината?", en: "Do you have blood in your urine?" },
      { speaker: "Пациент", bg: "Да, урината е леко кървава.", en: "Yes, the urine is slightly bloody." },
      { speaker: "Лекар", bg: "Ще назначим ехография на бъбреците.", en: "We'll order a kidney ultrasound." },
    ],
    keyVocab: [
      { bg: "бъбречен камък", en: "kidney stone" },
      { bg: "бъбречна колика", en: "renal colic" },
      { bg: "хематурия", en: "hematuria / blood in urine" },
      { bg: "ехография", en: "ultrasound" },
    ],
    treatment: "Болкоуспокояващи, спазмолитици, много течности, при необходимост — хирургия.",
    treatmentEn: "Painkillers, antispasmodics, plenty of fluids, surgery if needed.",
  },
  {
    disease: "Хипертония (Артериална)",
    diseaseEn: "Hypertension",
    dialogue: [
      { speaker: "Лекар", bg: "Ще измерим кръвното ви налягане.", en: "We'll measure your blood pressure." },
      { speaker: "Пациент", bg: "Имам чести главоболия и световъртеж.", en: "I have frequent headaches and dizziness." },
      { speaker: "Лекар", bg: "Налягането е 160 на 100. Това е високо.", en: "The pressure is 160 over 100. That is high." },
      { speaker: "Пациент", bg: "Приемам хапчета от три месеца.", en: "I've been taking pills for three months." },
      { speaker: "Лекар", bg: "Трябва да сменим дозата и да следим редовно.", en: "We need to change the dose and monitor regularly." },
    ],
    keyVocab: [
      { bg: "артериална хипертония", en: "arterial hypertension" },
      { bg: "систолично налягане", en: "systolic pressure" },
      { bg: "диастолично налягане", en: "diastolic pressure" },
      { bg: "антихипертензивни", en: "antihypertensives" },
    ],
    treatment: "Антихипертензивни лекарства, диета с малко сол, физическа активност, редовен мониторинг.",
    treatmentEn: "Antihypertensive drugs, low-salt diet, physical activity, regular monitoring.",
  },
];

// ── Medical exam practice questions ─────────────────────────────────────

export interface MedicalQuestion {
  id: string;
  category: "vocabulary" | "grammar" | "comprehension" | "history";
  prompt: string;
  options: string[];
  correct: number;
  explanation?: string;
}

export const MEDICAL_QUESTIONS: MedicalQuestion[] = [
  // Vocabulary
  { id: "mq1", category: "vocabulary", prompt: "Какво означава 'задух'?", options: ["Сърбеж", "Затруднено дишане", "Болка в гърба", "Гадене"], correct: 1 },
  { id: "mq2", category: "vocabulary", prompt: "Какво означава 'хрипове'?", options: ["Кашлица", "Звукове при дишане поради стеснени дихателни пътища", "Болка при кашляне", "Висока температура"], correct: 1 },
  { id: "mq3", category: "vocabulary", prompt: "Как се казва на медицински език 'камъни в бъбреците'?", options: ["Хипертония", "Нефролитиаза", "Тонзилит", "Синузит"], correct: 1 },
  { id: "mq4", category: "vocabulary", prompt: "Какво е 'хематурия'?", options: ["Кръв в кръвта", "Кръв в урината", "Кръв в слюнката", "Кръв в изпражненията"], correct: 1 },
  { id: "mq5", category: "vocabulary", prompt: "Какво означава 'репозиция' при луксация?", options: ["Операция", "Върнване на кост/става на нормалното й място", "Поставяне на гипс", "Физиотерапия"], correct: 1 },
  { id: "mq6", category: "vocabulary", prompt: "'Втрисане' означава:", options: ["Усещане за студ и треперене при температура", "Силно кървене", "Болки в корема", "Загуба на съзнание"], correct: 0 },
  { id: "mq7", category: "vocabulary", prompt: "Какво е 'муколитик'?", options: ["Лекарство за болка", "Лекарство за разреждане на слузта", "Лекарство за температура", "Лекарство за алергия"], correct: 1 },
  { id: "mq8", category: "vocabulary", prompt: "Как се казва 'дислокация' на български?", options: ["Навяхване", "Счупване", "Луксация", "Контузия"], correct: 2 },
  // Grammar in medical context
  { id: "mq9", category: "grammar", prompt: "Пациентът _______ силна болка в гърдите.", options: ["имате", "имам", "има", "имаме"], correct: 2 },
  { id: "mq10", category: "grammar", prompt: "Ще _______ рентгенова снимка.", options: ["направиш", "направим", "направи", "направите"], correct: 1 },
  { id: "mq11", category: "grammar", prompt: "Болката _______ при движение.", options: ["усилвате се", "усилва се", "усилвам се", "усилват се"], correct: 1 },
  { id: "mq12", category: "grammar", prompt: "Вземайте лекарството три пъти _______ след хранене.", options: ["дневно", "дневен", "дневна", "дневни"], correct: 0 },
  // Medical history
  { id: "mq13", category: "history", prompt: "Как питате пациента откога има оплаквания?", options: ["Колко ви боли?", "Откога имате тези оплаквания?", "Имате ли алергия?", "Приемате ли лекарства?"], correct: 1 },
  { id: "mq14", category: "history", prompt: "Как питате дали пациентът е алергичен?", options: ["Болни ли сте?", "Имате ли алергия към лекарства?", "Какво ви боли?", "Имате ли температура?"], correct: 1 },
  { id: "mq15", category: "history", prompt: "Как казвате на пациента да опише болката?", options: ["Покажете карта.", "Опишете болката.", "Излезте навън.", "Легнете на кушетката."], correct: 1 },
  { id: "mq16", category: "history", prompt: "Как питате дали пациентът пуши?", options: ["Пиете ли вода?", "Пушите ли?", "Ядете ли редовно?", "Спите ли добре?"], correct: 1 },
  // Comprehension — disease matching
  { id: "mq17", category: "comprehension", prompt: "Пациентът има хрипове, задух и алергия към котешки косми. Каква е вероятната диагноза?", options: ["Ринит", "Астма", "Бронхит", "Грип"], correct: 1 },
  { id: "mq18", category: "comprehension", prompt: "Пациентът има внезапна температура 39°C, болки в мускулите и силно главоболие. Каква е вероятната диагноза?", options: ["Синузит", "Тонзилит", "Грип", "Хипертония"], correct: 2 },
  { id: "mq19", category: "comprehension", prompt: "Пациентът има болка в кръста, излъчваща се надолу, и кръв в урината. Каква е вероятната диагноза?", options: ["Бъбречни камъни", "Фрактура", "Навяхване", "Ринит"], correct: 0 },
  { id: "mq20", category: "comprehension", prompt: "Пациентът има налягане 165/105. Каква е диагнозата?", options: ["Хипотония", "Хипертония", "Тахикардия", "Аритмия"], correct: 1 },
];
