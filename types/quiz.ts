export type QuizCategory = {
  _id: string;
  titles: Choice;
};

export type Question = {
  _id: string,
  question: Choice,
  choices: Choices,
  explanation: Choice,
  explanationImage: string,
  answer: string,
  relatedCategory: string,
  createdAt: string,
  updatedAt: string,
  __v: number,
}

export type Choices = {
  [key: string]: { English: string; Amharic: string } | undefined;
  choiceA: Choice
  choiceB: Choice
  choiceC?: Choice
  choiceD?: Choice
}


export type Choice = {
English: string
Amharic: string
}