import { QuizProgress, QuestionStatuses } from '../types';

const STORAGE_KEY = 'june2026_exam_progress';

export const getDefaultProgress = (totalQuestions: number): QuizProgress => {
  const initialStatuses: QuestionStatuses = {};
  for (let i = 1; i <= totalQuestions; i++) {
    initialStatuses[i] = 'not-visited';
  }
  // Q1 is visited by default
  initialStatuses[1] = 'not-answered';

  return {
    currentQuestionId: 1,
    responses: {},
    statuses: initialStatuses,
    timeSpentSeconds: 0,
    timerMode: 'stopwatch',
    countdownSeconds: 180 * 60, // 3 hours default countdown if chosen
    isSubmitted: false,
    candidateName: 'Candidate (Roll No: 202606595)',
    fontSize: 'large',
  };
};

export const loadProgress = (totalQuestions: number): QuizProgress => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return getDefaultProgress(totalQuestions);
    const parsed = JSON.parse(raw);
    
    // Ensure all question statuses exist
    const statuses: QuestionStatuses = { ...parsed.statuses };
    for (let i = 1; i <= totalQuestions; i++) {
      if (!statuses[i]) {
        statuses[i] = 'not-visited';
      }
    }
    
    return {
      ...getDefaultProgress(totalQuestions),
      ...parsed,
      statuses,
    };
  } catch (e) {
    console.error('Failed to load progress from localStorage', e);
    return getDefaultProgress(totalQuestions);
  }
};

export const saveProgress = (progress: QuizProgress): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch (e) {
    console.error('Failed to save progress to localStorage', e);
  }
};

export const clearProgress = (totalQuestions: number): QuizProgress => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.error('Failed to clear progress', e);
  }
  return getDefaultProgress(totalQuestions);
};
