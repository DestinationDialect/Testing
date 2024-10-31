export type Question = {
  question: string;
  answerChoices: string[];
  correctAnswer: string;
};

export const airportQuestions: Question[] = [
  {
    question: "Hola, bienvenida! adonde vas?",
    answerChoices: ["tu madre", "mi casa", "un nuevo pais"],
    correctAnswer: "un nuevo pais",
  },
];
