import { QuestionsByAge, QuizAgeGroup, QuizQuestion } from '@/types';

export const QUESTIONS: QuestionsByAge = {
  2: [
    { q: 'What color is the sun?', answers: ['Yellow', 'Blue', 'Green'], correct: 0, emoji: '☀️' },
    { q: 'How many legs does a dog have?', answers: ['2', '4', '6'], correct: 1, emoji: '🐕' },
  ],
  4: [
    { q: 'What do plants need to grow?', answers: ['Candy', 'Water and Sun', 'Toys'], correct: 1, emoji: '🌱' },
    { q: 'What is 2 plus 3?', answers: ['4', '5', '6'], correct: 1, emoji: '🔢' },
  ],
  6: [
    { q: 'Which planet is red?', answers: ['Venus', 'Mars', 'Jupiter'], correct: 1, emoji: '🔴' },
    { q: 'What is 8 times 7?', answers: ['54', '56', '58'], correct: 1, emoji: '✖️' },
  ],
};

export function getRandomQuestion(ageGroup: QuizAgeGroup): QuizQuestion {
  const questions = QUESTIONS[ageGroup];
  return questions[Math.floor(Math.random() * questions.length)];
}
