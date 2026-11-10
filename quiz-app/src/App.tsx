import React, { useState, useEffect, useCallback, useMemo } from 'react';
import rawQuestions from './data/questions.json';
import { Question, ExamView, QuizProgress, ExamStats, QuestionStatus } from './types';
import { loadProgress, saveProgress, clearProgress } from './utils/storage';
import { Header } from './components/Header';
import { QuestionDisplay } from './components/QuestionDisplay';
import { QuestionPalette } from './components/QuestionPalette';
import { NavigationButtons } from './components/NavigationButtons';
import { SubmitModal } from './components/SubmitModal';
import { InstructionsPage } from './components/InstructionsPage';
import { ResultsDashboard } from './components/ResultsDashboard';
import { QuestionReviewList } from './components/QuestionReviewList';
import confetti from 'canvas-confetti';

const questions: Question[] = rawQuestions as Question[];
const TOTAL_QUESTIONS = questions.length; // 595

export const App: React.FC = () => {
  // Load saved progress
  const [progress, setProgress] = useState<QuizProgress>(() => loadProgress(TOTAL_QUESTIONS));
  
  // View state: 'instructions' | 'exam' | 'results'
  const [examView, setExamView] = useState<ExamView>(() => {
    const saved = loadProgress(TOTAL_QUESTIONS);
    if (saved.isSubmitted) return 'results';
    return 'instructions';
  });

  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [isMobilePaletteOpen, setIsMobilePaletteOpen] = useState(false);
  const [negativeMarkingEnabled, setNegativeMarkingEnabled] = useState(false);

  // Sync to LocalStorage whenever progress changes
  useEffect(() => {
    saveProgress(progress);
  }, [progress]);

  // Timer tick
  useEffect(() => {
    if (examView !== 'exam' || progress.isSubmitted) return;

    const timer = setInterval(() => {
      setProgress((prev) => {
        const nextTime = prev.timeSpentSeconds + 1;
        // Check if countdown ended
        if (prev.timerMode === 'countdown' && nextTime >= prev.countdownSeconds) {
          clearInterval(timer);
          setIsSubmitModalOpen(false);
          return {
            ...prev,
            timeSpentSeconds: nextTime,
            isSubmitted: true,
            submissionTime: new Date().toISOString(),
          };
        }
        return {
          ...prev,
          timeSpentSeconds: nextTime,
        };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [examView, progress.isSubmitted]);

  // If countdown triggered submit, change view to results
  useEffect(() => {
    if (progress.isSubmitted && examView === 'exam') {
      setExamView('results');
      try {
        confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      } catch (e) {}
    }
  }, [progress.isSubmitted, examView]);

  // Current Question
  const currentQuestion = useMemo(() => {
    return questions.find((q) => q.id === progress.currentQuestionId) || questions[0];
  }, [progress.currentQuestionId]);

  // Current question selected answer
  const currentSelection = progress.responses[currentQuestion.id];
  const currentStatus = progress.statuses[currentQuestion.id] || 'not-visited';

  // Handler: Change Font Size
  const handleFontSizeChange = useCallback((size: 'normal' | 'large' | 'xlarge') => {
    setProgress((prev) => ({
      ...prev,
      fontSize: size,
    }));
  }, []);

  // Handler: Select Option
  const handleSelectOption = useCallback((key: string) => {
    setProgress((prev) => {
      const isMarked = prev.statuses[prev.currentQuestionId] === 'marked-review' || 
                       prev.statuses[prev.currentQuestionId] === 'answered-marked-review';
      const newStatus: QuestionStatus = isMarked ? 'answered-marked-review' : 'answered';

      return {
        ...prev,
        responses: {
          ...prev.responses,
          [prev.currentQuestionId]: key,
        },
        statuses: {
          ...prev.statuses,
          [prev.currentQuestionId]: newStatus,
        },
      };
    });
  }, []);

  // Handler: Clear Response
  const handleClearResponse = useCallback(() => {
    setProgress((prev) => {
      const qid = prev.currentQuestionId;
      const newResponses = { ...prev.responses };
      delete newResponses[qid];

      const isMarked = prev.statuses[qid] === 'marked-review' || prev.statuses[qid] === 'answered-marked-review';
      const newStatus: QuestionStatus = isMarked ? 'marked-review' : 'not-answered';

      return {
        ...prev,
        responses: newResponses,
        statuses: {
          ...prev.statuses,
          [qid]: newStatus,
        },
      };
    });
  }, []);

  // Handler: Toggle Mark for Review
  const handleToggleMarkForReview = useCallback(() => {
    setProgress((prev) => {
      const qid = prev.currentQuestionId;
      const hasAnswer = prev.responses[qid] !== undefined;
      const current = prev.statuses[qid];

      let newStatus: QuestionStatus;
      if (current === 'marked-review' || current === 'answered-marked-review') {
        newStatus = hasAnswer ? 'answered' : 'not-answered';
      } else {
        newStatus = hasAnswer ? 'answered-marked-review' : 'marked-review';
      }

      return {
        ...prev,
        statuses: {
          ...prev.statuses,
          [qid]: newStatus,
        },
      };
    });
  }, []);

  // Handler: Save & Next
  const handleSaveAndNext = useCallback(() => {
    setProgress((prev) => {
      const qid = prev.currentQuestionId;
      const hasAnswer = prev.responses[qid] !== undefined;
      const isMarked = prev.statuses[qid] === 'marked-review' || prev.statuses[qid] === 'answered-marked-review';
      
      let nextStatus: QuestionStatus;
      if (isMarked) {
        nextStatus = hasAnswer ? 'answered-marked-review' : 'marked-review';
      } else {
        nextStatus = hasAnswer ? 'answered' : 'not-answered';
      }

      const nextStatuses = {
        ...prev.statuses,
        [qid]: nextStatus,
      };

      if (qid >= TOTAL_QUESTIONS) {
        setIsSubmitModalOpen(true);
        return {
          ...prev,
          statuses: nextStatuses,
        };
      }

      const nextId = qid + 1;
      if (nextStatuses[nextId] === 'not-visited') {
        nextStatuses[nextId] = 'not-answered';
      }

      return {
        ...prev,
        currentQuestionId: nextId,
        statuses: nextStatuses,
      };
    });
  }, []);

  // Handler: Mark for Review & Next
  const handleMarkForReviewAndNext = useCallback(() => {
    setProgress((prev) => {
      const qid = prev.currentQuestionId;
      const hasAnswer = prev.responses[qid] !== undefined;
      const newStatus: QuestionStatus = hasAnswer ? 'answered-marked-review' : 'marked-review';

      const nextStatuses = {
        ...prev.statuses,
        [qid]: newStatus,
      };

      if (qid >= TOTAL_QUESTIONS) {
        setIsSubmitModalOpen(true);
        return {
          ...prev,
          statuses: nextStatuses,
        };
      }

      const nextId = qid + 1;
      if (nextStatuses[nextId] === 'not-visited') {
        nextStatuses[nextId] = 'not-answered';
      }

      return {
        ...prev,
        currentQuestionId: nextId,
        statuses: nextStatuses,
      };
    });
  }, []);

  // Handler: Previous Question
  const handlePrevious = useCallback(() => {
    setProgress((prev) => {
      if (prev.currentQuestionId <= 1) return prev;
      const qid = prev.currentQuestionId;
      const hasAnswer = prev.responses[qid] !== undefined;
      const isMarked = prev.statuses[qid] === 'marked-review' || prev.statuses[qid] === 'answered-marked-review';
      
      let curStatus: QuestionStatus;
      if (isMarked) {
        curStatus = hasAnswer ? 'answered-marked-review' : 'marked-review';
      } else {
        curStatus = hasAnswer ? 'answered' : 'not-answered';
      }

      const prevId = qid - 1;
      const nextStatuses = {
        ...prev.statuses,
        [qid]: curStatus,
      };
      if (nextStatuses[prevId] === 'not-visited') {
        nextStatuses[prevId] = 'not-answered';
      }

      return {
        ...prev,
        currentQuestionId: prevId,
        statuses: nextStatuses,
      };
    });
  }, []);

  // Handler: Select Question directly from Palette
  const handleSelectQuestion = useCallback((targetId: number) => {
    if (targetId < 1 || targetId > TOTAL_QUESTIONS) return;

    setProgress((prev) => {
      const qid = prev.currentQuestionId;
      const hasAnswer = prev.responses[qid] !== undefined;
      const isMarked = prev.statuses[qid] === 'marked-review' || prev.statuses[qid] === 'answered-marked-review';
      
      let curStatus: QuestionStatus;
      if (isMarked) {
        curStatus = hasAnswer ? 'answered-marked-review' : 'marked-review';
      } else {
        curStatus = hasAnswer ? 'answered' : 'not-answered';
      }

      const nextStatuses = {
        ...prev.statuses,
        [qid]: curStatus,
      };
      if (nextStatuses[targetId] === 'not-visited') {
        nextStatuses[targetId] = 'not-answered';
      }

      return {
        ...prev,
        currentQuestionId: targetId,
        statuses: nextStatuses,
      };
    });
  }, []);

  // Keyboard navigation support
  useEffect(() => {
    if (examView !== 'exam' || isSubmitModalOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) {
        return;
      }

      const key = e.key.toUpperCase();
      if (['1', '2', '3', '4', '5'].includes(key)) {
        const optionKeys = ['A', 'B', 'C', 'D', 'E'];
        const chosen = optionKeys[parseInt(key, 10) - 1];
        handleSelectOption(chosen);
      } else if (['A', 'B', 'C', 'D', 'E'].includes(key)) {
        handleSelectOption(key);
      } else if (e.key === 'ArrowRight' || key === 'N' || e.key === 'Enter') {
        handleSaveAndNext();
      } else if (e.key === 'ArrowLeft' || key === 'P') {
        handlePrevious();
      } else if (key === 'M') {
        handleToggleMarkForReview();
      } else if (key === 'C') {
        handleClearResponse();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [examView, isSubmitModalOpen, handleSelectOption, handleSaveAndNext, handlePrevious, handleToggleMarkForReview, handleClearResponse]);

  // Final Submit Handler
  const handleConfirmSubmit = () => {
    setIsSubmitModalOpen(false);
    setProgress((prev) => ({
      ...prev,
      isSubmitted: true,
      submissionTime: new Date().toISOString(),
    }));
    setExamView('results');

    try {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.5 },
      });
    } catch (e) {}
  };

  // Start Exam Handler
  const handleStartExam = (timerMode: 'stopwatch' | 'countdown') => {
    setProgress((prev) => ({
      ...prev,
      timerMode,
      timeSpentSeconds: 0,
      isSubmitted: false,
    }));
    setExamView('exam');
  };

  // Resume Exam Handler
  const handleResumeExam = () => {
    setExamView('exam');
  };

  // Reset / Retake Exam Handler
  const handleResetExam = () => {
    const fresh = clearProgress(TOTAL_QUESTIONS);
    setProgress(fresh);
    setExamView('instructions');
  };

  // Calculate Stats
  const examStats: ExamStats = useMemo(() => {
    let correct = 0;
    let incorrect = 0;
    let markedCount = 0;
    let answeredMarkedCount = 0;

    questions.forEach((q) => {
      const userAns = progress.responses[q.id];
      const s = progress.statuses[q.id];
      if (s === 'marked-review') markedCount++;
      if (s === 'answered-marked-review') answeredMarkedCount++;

      if (userAns !== undefined) {
        if (userAns === q.correctAnswer) {
          correct++;
        } else {
          incorrect++;
        }
      }
    });

    const attempted = Object.keys(progress.responses).length;
    const unattempted = TOTAL_QUESTIONS - attempted;
    const accuracy = attempted > 0 ? Number(((correct / attempted) * 100).toFixed(1)) : 0;
    const score = correct;
    const percentageScore = Number(((score / TOTAL_QUESTIONS) * 100).toFixed(1));

    return {
      totalQuestions: TOTAL_QUESTIONS,
      attempted,
      correct,
      incorrect,
      unattempted,
      accuracy,
      score,
      percentageScore,
      markedForReview: markedCount,
      answeredMarked: answeredMarkedCount,
      timeSpentSeconds: progress.timeSpentSeconds,
    };
  }, [progress.responses, progress.statuses, progress.timeSpentSeconds]);

  // Scroll to review section
  const handleScrollToReview = () => {
    const el = document.getElementById('review-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Trigger PDF print of the entire response sheet
  const handleTriggerPrint = () => {
    handleScrollToReview();
    setTimeout(() => {
      window.print();
    }, 300);
  };

  return (
    <div className={`flex flex-col bg-slate-100 text-slate-800 ${examView === 'exam' ? 'h-screen h-[100dvh] max-h-[100dvh] overflow-hidden' : 'min-h-screen'}`}>
      
      {/* View 1: Instructions Page */}
      {examView === 'instructions' && (
        <InstructionsPage
          totalQuestions={TOTAL_QUESTIONS}
          onStartExam={handleStartExam}
          onResumeExam={handleResumeExam}
          onResetExam={handleResetExam}
          savedProgress={progress}
        />
      )}

      {/* View 2: Live Examination Mode */}
      {examView === 'exam' && (
        <div className="flex-1 min-h-0 flex flex-col h-full overflow-hidden">
          {/* Header */}
          <div className="flex-shrink-0">
            <Header
              totalQuestions={TOTAL_QUESTIONS}
              responses={progress.responses}
              statuses={progress.statuses}
              timeSpentSeconds={progress.timeSpentSeconds}
              timerMode={progress.timerMode}
              countdownSeconds={progress.countdownSeconds}
              onOpenSubmitModal={() => setIsSubmitModalOpen(true)}
              candidateName={progress.candidateName || 'Candidate'}
              fontSize={progress.fontSize || 'large'}
              onFontSizeChange={handleFontSizeChange}
            />
          </div>

          {/* Main Content Area: Question Display + Sidebar Palette */}
          <main className="flex-1 min-h-0 flex overflow-hidden p-2 sm:p-3 lg:p-4 gap-3 lg:gap-4 max-w-7xl mx-auto w-full">
            
            {/* Center: Question Area */}
            <div className="flex-1 min-h-0 flex flex-col h-full min-w-0">
              <QuestionDisplay
                question={currentQuestion}
                totalQuestions={TOTAL_QUESTIONS}
                selectedOptionKey={currentSelection}
                onSelectOption={handleSelectOption}
                status={currentStatus}
                onClearResponse={handleClearResponse}
                onToggleMarkForReview={handleToggleMarkForReview}
                onSaveAndNext={handleSaveAndNext}
                onPrevious={handlePrevious}
                onMarkForReviewAndNext={handleMarkForReviewAndNext}
                fontSize={progress.fontSize || 'large'}
                onFontSizeChange={handleFontSizeChange}
              />
            </div>

            {/* Right: Question Navigation Palette */}
            <div className="h-full min-h-0 flex">
              <QuestionPalette
                totalQuestions={TOTAL_QUESTIONS}
                currentQuestionId={progress.currentQuestionId}
                statuses={progress.statuses}
                onSelectQuestion={handleSelectQuestion}
                isOpenMobile={isMobilePaletteOpen}
                onCloseMobile={() => setIsMobilePaletteOpen(false)}
              />
            </div>

          </main>

          {/* Bottom Action Bar */}
          <div className="flex-shrink-0">
            <NavigationButtons
              currentQuestionId={progress.currentQuestionId}
              totalQuestions={TOTAL_QUESTIONS}
              onPrevious={handlePrevious}
              onSaveAndNext={handleSaveAndNext}
              onMarkForReviewAndNext={handleMarkForReviewAndNext}
              onClearResponse={handleClearResponse}
              onToggleMobilePalette={() => setIsMobilePaletteOpen(!isMobilePaletteOpen)}
            />
          </div>

          {/* Submission Modal Dialog */}
          <SubmitModal
            isOpen={isSubmitModalOpen}
            onClose={() => setIsSubmitModalOpen(false)}
            onConfirmSubmit={handleConfirmSubmit}
            totalQuestions={TOTAL_QUESTIONS}
            responses={progress.responses}
            statuses={progress.statuses}
          />
        </div>
      )}

      {/* View 3: Submitted Results & Complete 595 Review Page */}
      {examView === 'results' && (
        <div className="flex-1 flex flex-col">
          {/* Top Bar for Results View */}
          <header className="bg-[#1e293b] text-white py-3.5 px-4 sm:px-6 border-b border-slate-700 shadow-sm sticky top-0 z-40 no-print">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="w-3.5 h-3.5 rounded-full bg-emerald-400"></span>
                <span className="font-extrabold text-sm sm:text-base">
                  June 2026 Current Affairs – Exam Solutions & Review Portal
                </span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={handleTriggerPrint}
                  className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-bold shadow-xs cursor-pointer flex items-center gap-1.5"
                >
                  <span>Download PDF</span>
                </button>

                <button
                  onClick={handleResetExam}
                  className="px-3.5 py-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-xs sm:text-sm font-semibold border border-slate-600 cursor-pointer"
                >
                  Restart / Retake
                </button>
              </div>
            </div>
          </header>

          <main className="max-w-7xl mx-auto w-full p-4 sm:p-6 flex-1 space-y-8">
            {/* Results Analytics Dashboard */}
            <div className="no-print">
              <ResultsDashboard
                stats={examStats}
                onRetakeExam={handleResetExam}
                onScrollToReview={handleScrollToReview}
                negativeMarkingEnabled={negativeMarkingEnabled}
                onToggleNegativeMarking={() => setNegativeMarkingEnabled(!negativeMarkingEnabled)}
                onDownloadPDF={handleTriggerPrint}
              />
            </div>

            {/* Mandatory Feature: All 595 Questions Review List */}
            <QuestionReviewList
              questions={questions}
              responses={progress.responses}
              statuses={progress.statuses}
              fontSize={progress.fontSize || 'large'}
              onFontSizeChange={handleFontSizeChange}
            />
          </main>
        </div>
      )}

    </div>
  );
};

export default App;
