import { CategoriesByAge, QuizAgeGroup } from '@/types';

export const CATEGORIES: CategoriesByAge = {
  2: { songs: '🎵 Songs', movement: '💃 Dance', social: '🤝 Feelings', reading: '📖 Words', math: '🔢 Numbers' },
  3: { math: '🔢 Numbers', reading: '📖 Letters', songs: '🎵 Songs', social: '🤝 Social', science: '🔬 Science', movement: '🧘 Yoga' },
  4: { math: '🔢 Math', reading: '📖 Reading', science: '🔬 Science', social: '🤝 Social', stories: '📚 Stories', movement: '🧘 Yoga', nature: '🌿 Nature' },
  5: { math: '🔢 Math', reading: '📖 Reading', science: '🔬 Science', nature: '🌿 Nature', stories: '📚 Stories', movement: '🧘 Yoga', social: '🤝 Social' },
  6: { math: '🔢 Math', reading: '📖 Language', science: '🔬 Science', geography: '🌍 Geography', coding: '💻 Coding', space: '🚀 Space', nature: '🌿 Nature' },
  7: { math: '🔢 Math', science: '🔬 Science', nature: '🌿 Nature', coding: '💻 Coding', history: '📜 History' },
  8: { science: '🔬 Science', coding: '💻 Coding', math: '🔢 Math', history: '📜 History' },
};

export function getCategoriesForAge(age: number): Record<string, string> {
  return CATEGORIES[age] || CATEGORIES[4];
}

export function getAgeGroup(age: number): QuizAgeGroup {
  return age <= 3 ? 2 : age <= 5 ? 4 : 6;
}
