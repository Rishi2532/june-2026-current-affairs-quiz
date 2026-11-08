export interface Option {
  key: string;
  text: string;
}

export interface Question {
  id: number;
  question: string;
  options: Option[];
  correctAnswer: string;
  explanation: string;
}

export type QuestionStatus = 
  | 'not-visited'
  | 'not-answered'
  | 'answered'
  | 'marked-review'
  | 'answered-marked-review';

export interface UserResponses {
  [questionId: number]: string;
}

export interface QuestionStatuses {
  [questionId: number]: QuestionStatus;
}

export type ExamView = 'instructions' | 'exam' | 'results';

export interface QuizProgress {
  currentQuestionId: number;
  responses: UserResponses;
  statuses: QuestionStatuses;
  timeSpentSeconds: number;
  timerMode: 'stopwatch' | 'countdown';
  countdownSeconds: number;
  isSubmitted: boolean;
  submissionTime?: string;
  candidateName?: string;
  fontSize?: 'normal' | 'large' | 'xlarge';
}

export interface ExamStats {
  totalQuestions: number;
  attempted: number;
  correct: number;
  incorrect: number;
  unattempted: number;
  accuracy: number;
  score: number;
  percentageScore: number;
  markedForReview: number;
  answeredMarked: number;
  timeSpentSeconds: number;
}

