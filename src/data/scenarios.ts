// Real-life scenario reading texts with one comprehension MCQ each.
// Inspired by survival-language textbook exercises for foreigners in Bulgaria.

export interface Scenario {
  id: string;
  title: string;
  emoji: string;
  context: string; // English context
  dialogue: { speaker: string; bg: string; en: string }[];
  question: string;
  options: string[];
  correct: number; // index into options
  explanation: string;
}

export const SCENARIOS: Scenario[] = [
  {
    id: "immigration",
    title: "At the Immigration Office",
    emoji: "🛂",
    context: "You are renewing your residence permit. The officer at the counter asks for documents.",
    dialogue: [
      { speaker: "Служител", bg: "Добър ден. Документ за самоличност, моля.", en: "Good day. ID document, please." },
      { speaker: "Вие", bg: "Заповядайте, ето паспорта ми.", en: "Here you are, here is my passport." },
      { speaker: "Служител", bg: "Имате ли заверен превод на договора за наем?", en: "Do you have a certified translation of the rental contract?" },
      { speaker: "Вие", bg: "Да, ето копието. Колко струва таксата?", en: "Yes, here is the copy. How much is the fee?" },
      { speaker: "Служител", bg: "Таксата е сто и петдесет лева. Платете на гише номер три.", en: "The fee is 150 levs. Pay at counter number three." },
    ],
    question: "What does the officer ask you to do at the end?",
    options: [
      "Sign a new contract",
      "Pay the fee at counter 3",
      "Come back tomorrow",
      "Bring a translator",
    ],
    correct: 1,
    explanation: "Платете на гише номер три = Pay at counter number three.",
  },
  {
    id: "neighbor",
    title: "Talking to a Neighbor",
    emoji: "🏘️",
    context: "You meet your neighbor in the building's hallway for the first time.",
    dialogue: [
      { speaker: "Съсед", bg: "Здравейте! Вие ли сте новият наемател на третия етаж?", en: "Hello! Are you the new tenant on the third floor?" },
      { speaker: "Вие", bg: "Да, казвам се Амин. Радвам се да се запознаем.", en: "Yes, my name is Amin. Pleased to meet you." },
      { speaker: "Съсед", bg: "Аз съм Иван. Ако имате въпроси за блока, питайте мен.", en: "I'm Ivan. If you have questions about the building, ask me." },
      { speaker: "Вие", bg: "Благодаря. Кога изхвърляме боклука?", en: "Thank you. When do we take out the trash?" },
      { speaker: "Съсед", bg: "Всяка вечер след осем. Контейнерите са отзад.", en: "Every evening after eight. The bins are behind." },
    ],
    question: "Which Bulgarian phrase is appropriate when meeting a neighbor for the first time?",
    options: [
      "Давайте ми рестото!",
      "Радвам се да се запознаем.",
      "Спешна помощ, моля!",
      "Колко струва наемът?",
    ],
    correct: 1,
    explanation: "Радвам се да се запознаем = Pleased to meet you — the standard polite first-meeting phrase.",
  },
  {
    id: "market",
    title: "Buying at the Market",
    emoji: "🛒",
    context: "You are at the open-air vegetable market and want to buy tomatoes and a watermelon.",
    dialogue: [
      { speaker: "Вие", bg: "Добър ден. Колко струват доматите?", en: "Good day. How much are the tomatoes?" },
      { speaker: "Продавач", bg: "Три лева и петдесет за килограм.", en: "Three lev fifty per kilogram." },
      { speaker: "Вие", bg: "Давайте ми един килограм и половин килограм краставици.", en: "Give me one kilo and half a kilo of cucumbers." },
      { speaker: "Продавач", bg: "Друго нещо?", en: "Anything else?" },
      { speaker: "Вие", bg: "Една диня. Колко е общо?", en: "One watermelon. How much in total?" },
      { speaker: "Продавач", bg: "Общо дванадесет лева. Касова бележка?", en: "Twelve levs total. A receipt?" },
    ],
    question: "How do you ask the price of an item in Bulgarian?",
    options: [
      "Имате ли торбичка?",
      "Колко струва това?",
      "Задръжте рестото.",
      "Плащам с карта.",
    ],
    correct: 1,
    explanation: "Колко струва това? = How much does this cost? — the universal price question.",
  },
  {
    id: "doctor",
    title: "At the Doctor / Pharmacy",
    emoji: "🩺",
    context: "You are not feeling well and visit your GP, then go to the pharmacy.",
    dialogue: [
      { speaker: "Лекар", bg: "Какво ви боли?", en: "What hurts you?" },
      { speaker: "Вие", bg: "Имам температура и боли ме гърлото от два дни.", en: "I have a fever and my throat has hurt for two days." },
      { speaker: "Лекар", bg: "Имате ли алергия към някое лекарство?", en: "Are you allergic to any medicine?" },
      { speaker: "Вие", bg: "Не, нямам алергии.", en: "No, I have no allergies." },
      { speaker: "Лекар", bg: "Ще ви напиша рецепта. Вземете лекарството три пъти на ден.", en: "I'll write you a prescription. Take the medicine three times a day." },
      { speaker: "Аптекар", bg: "Заповядайте, лекарството е готово. Дванадесет лева.", en: "Here you are, the medicine is ready. Twelve levs." },
    ],
    question: "How do you say you have a fever and sore throat?",
    options: [
      "Боли ме главата и стомахът.",
      "Имам температура и боли ме гърлото.",
      "Искам да си купя бутилка вода.",
      "Имате ли спешна помощ?",
    ],
    correct: 1,
    explanation: "Имам температура и боли ме гърлото = I have a fever and my throat hurts.",
  },
  {
    id: "university",
    title: "At the University Admin Office",
    emoji: "🎓",
    context: "You go to the student admin office to ask about your enrollment and request a document.",
    dialogue: [
      { speaker: "Вие", bg: "Добър ден. Искам да се зачисля за летния семестър.", en: "Good day. I'd like to enroll for the summer semester." },
      { speaker: "Служител", bg: "Имате ли студентската си книжка?", en: "Do you have your student ID booklet?" },
      { speaker: "Вие", bg: "Да, ето я. Трябва ми и уверение за стипендията.", en: "Yes, here it is. I also need a certificate for the scholarship." },
      { speaker: "Служител", bg: "Уверението е готово след три работни дни.", en: "The certificate is ready in three working days." },
      { speaker: "Вие", bg: "Колко струва академичната справка?", en: "How much does the academic transcript cost?" },
      { speaker: "Служител", bg: "Десет лева. Платете на касата и донесете квитанцията.", en: "Ten levs. Pay at the cashier and bring the receipt." },
    ],
    question: "What does the officer ask for first?",
    options: [
      "Your passport",
      "Your student ID booklet (студентска книжка)",
      "A medical certificate",
      "A signed contract",
    ],
    correct: 1,
    explanation: "Студентската книжка is the standard document students must show at the deканат / admin office.",
  },
];
