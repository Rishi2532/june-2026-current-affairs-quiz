import { QuizProgress, QuestionStatuses, QuizMonth } from '../types';

export const getStorageKey = (month: QuizMonth): string => `${month}2026_exam_progress`;

export const getDefaultProgress = (totalQuestions: number, month: QuizMonth = 'july'): QuizProgress => {
  const initialStatuses: QuestionStatuses = {};
  for (let i = 1; i <= totalQuestions; i++) {
    initialStatuses[i] = 'not-visited';
  }
  // Q1 is visited by default
  initialStatuses[1] = 'not-answered';

  const rollNumber = month === 'july' ? '202607594' : '202606595';

  return {
    month,
    currentQuestionId: 1,
    responses: {},
    statuses: initialStatuses,
    timeSpentSeconds: 0,
    timerMode: 'stopwatch',
    countdownSeconds: 180 * 60, // 3 hours default countdown if chosen
    isSubmitted: false,
    candidateName: `Candidate (Roll No: ${rollNumber})`,
    fontSize: 'large',
  };
};

export const loadProgress = (totalQuestions: number, month: QuizMonth = 'july'): QuizProgress => {
  try {
    const key = getStorageKey(month);
    const raw = localStorage.getItem(key);
    if (!raw) return getDefaultProgress(totalQuestions, month);
    const parsed = JSON.parse(raw);
    
    // Ensure all question statuses exist
    const statuses: QuestionStatuses = { ...parsed.statuses };
    for (let i = 1; i <= totalQuestions; i++) {
      if (!statuses[i]) {
        statuses[i] = 'not-visited';
      }
    }
    
    return {
      ...getDefaultProgress(totalQuestions, month),
      ...parsed,
      month,
      statuses,
    };
  } catch (e) {
    console.error(`Failed to load progress from localStorage for ${month}`, e);
    return getDefaultProgress(totalQuestions, month);
  }
};

export const saveProgress = (progress: QuizProgress): void => {
  try {
    const key = getStorageKey(progress.month || 'july');
    localStorage.setItem(key, JSON.stringify(progress));
  } catch (e) {
    console.error('Failed to save progress to localStorage', e);
  }
};

export const clearProgress = (totalQuestions: number, month: QuizMonth = 'july'): QuizProgress => {
  try {
    const key = getStorageKey(month);
    localStorage.removeItem(key);
  } catch (e) {
    console.error(`Failed to clear progress for ${month}`, e);
  }
  return getDefaultProgress(totalQuestions, month);
};
