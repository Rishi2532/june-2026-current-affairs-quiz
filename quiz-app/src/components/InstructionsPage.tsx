import React, { useState } from 'react';
import { ShieldCheck, Clock, BookOpen, CheckCircle, ArrowRight, Play, RotateCcw } from 'lucide-react';
import { QuizProgress } from '../types';

interface InstructionsPageProps {
  totalQuestions: number;
  onStartExam: (timerMode: 'stopwatch' | 'countdown') => void;
  onResumeExam: () => void;
  onResetExam: () => void;
  savedProgress: QuizProgress;
}

export const InstructionsPage: React.FC<InstructionsPageProps> = ({
  totalQuestions,
  onStartExam,
  onResumeExam,
  onResetExam,
  savedProgress,
}) => {
  const [agreed, setAgreed] = useState(false);
  const [selectedTimerMode, setSelectedTimerMode] = useState<'stopwatch' | 'countdown'>('stopwatch');

  const hasSavedProgress = Object.keys(savedProgress.responses).length > 0 || savedProgress.currentQuestionId > 1;

  return (
    <div className="min-h-screen bg-slate-100 py-6 sm:py-10 px-3 sm:px-6 flex flex-col justify-center items-center">
      <div className="max-w-4xl w-full bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
        
        {/* Header Banner */}
        <div className="bg-[#1e293b] text-white p-5 sm:p-7 border-b border-slate-700">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center font-bold text-white shadow-md flex-shrink-0">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <div>
                <span className="inline-block px-2.5 py-0.5 rounded text-xs font-semibold bg-blue-900/80 text-blue-200 border border-blue-700 mb-1">
                  Official Banking Mock Test Series
                </span>
                <h1 className="text-lg sm:text-2xl font-bold tracking-tight text-white">
                  June 2026 Current Affairs – Complete Mock Test
                </h1>
                <p className="text-xs sm:text-sm text-slate-300 mt-0.5">
                  Comprehensive 595 Questions Practice Exam (SBI Clerk / IBPS Pattern)
                </p>
              </div>
            </div>

            <div className="bg-slate-800/80 rounded-lg p-3 border border-slate-700 text-right flex-shrink-0">
              <div className="text-xs text-slate-400">Total Questions</div>
              <div className="text-xl sm:text-2xl font-extrabold text-yellow-400">{totalQuestions}</div>
              <div className="text-[11px] text-slate-400">Max Marks: {totalQuestions}</div>
            </div>
          </div>
        </div>

        {/* Resume Banner if user has ongoing progress */}
        {hasSavedProgress && !savedProgress.isSubmitted && (
          <div className="bg-emerald-50 border-b border-emerald-200 p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 flex-shrink-0">
                <CheckCircle className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-emerald-900">
                  Unfinished Test Session Detected
                </h2>
                <p className="text-xs text-emerald-700">
                  You have already attempted {Object.keys(savedProgress.responses).length} of {totalQuestions} questions. You can resume from Question #{savedProgress.currentQuestionId}.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={onResetExam}
                className="flex-1 sm:flex-initial px-3 py-1.5 rounded-md border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center justify-center gap-1"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset & Restart
              </button>
              <button
                type="button"
                onClick={onResumeExam}
                className="flex-1 sm:flex-initial px-4 py-1.5 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                Resume Test
              </button>
            </div>
          </div>
        )}

        {/* Instructions Body */}
        <div className="p-5 sm:p-7 space-y-6 text-slate-700 text-sm leading-relaxed max-h-[60vh] overflow-y-auto">
          
          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2 border-b border-slate-200 pb-1.5">
              <BookOpen className="w-4 h-4 text-blue-600" />
              General Instructions
            </h2>
            <ul className="list-disc list-inside space-y-1.5 text-xs sm:text-sm text-slate-600 pl-1">
              <li>This test contains a total of <strong>595 multiple-choice questions</strong> based on June 2026 Current Affairs.</li>
              <li>Each question carries <strong>1 mark</strong>. There is <strong>no negative marking</strong> in this test.</li>
              <li>All questions have five options (A, B, C, D, E). Only one option is correct.</li>
              <li>You can navigate between questions at any time using the <strong>Question Palette</strong> or the <strong>Previous / Save & Next</strong> buttons.</li>
              <li>Your progress and selected answers are <strong>automatically saved in your browser</strong>, so an accidental reload will not erase your attempt.</li>
              <li>After completing the test, click <strong>Submit Test</strong> to view your detailed score card and complete explanations for all 595 questions.</li>
            </ul>
          </section>

          {/* Palette Color Codes */}
          <section className="space-y-3">
            <h2 className="text-base font-bold text-slate-900 border-b border-slate-200 pb-1.5">
              Question Palette Color Scheme (IBPS Standard)
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
              <div className="flex items-center gap-3 p-2.5 rounded-lg border border-slate-200 bg-slate-50">
                <span className="w-7 h-7 rounded bg-slate-200 text-slate-700 font-bold flex items-center justify-center text-xs flex-shrink-0">
                  1
                </span>
                <div>
                  <span className="font-semibold text-slate-800">Grey: Not Visited</span>
                  <p className="text-[11px] text-slate-500">You have not visited the question yet.</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-2.5 rounded-lg border border-rose-200 bg-rose-50/60">
                <span className="w-7 h-7 rounded bg-rose-600 text-white font-bold flex items-center justify-center text-xs flex-shrink-0">
                  2
                </span>
                <div>
                  <span className="font-semibold text-rose-900">Red: Not Answered</span>
                  <p className="text-[11px] text-rose-700">You visited the question but have not answered it.</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-2.5 rounded-lg border border-emerald-200 bg-emerald-50/60">
                <span className="w-7 h-7 rounded bg-emerald-600 text-white font-bold flex items-center justify-center text-xs flex-shrink-0">
                  3
                </span>
                <div>
                  <span className="font-semibold text-emerald-900">Green: Answered</span>
                  <p className="text-[11px] text-emerald-700">You have selected an answer and saved it.</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-2.5 rounded-lg border border-purple-200 bg-purple-50/60">
                <span className="w-7 h-7 rounded bg-purple-600 text-white font-bold flex items-center justify-center text-xs flex-shrink-0">
                  4
                </span>
                <div>
                  <span className="font-semibold text-purple-900">Purple: Marked for Review</span>
                  <p className="text-[11px] text-purple-700">You marked this question without selecting an answer.</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-2.5 rounded-lg border border-purple-300 bg-purple-50 sm:col-span-2">
                <span className="relative w-7 h-7 rounded bg-purple-700 text-white font-bold flex items-center justify-center text-xs flex-shrink-0">
                  5
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 border border-white"></span>
                </span>
                <div>
                  <span className="font-semibold text-purple-950">Purple with Green Dot: Answered & Marked for Review</span>
                  <p className="text-[11px] text-purple-800">You answered the question and marked it for review. This answer <strong>WILL</strong> be evaluated in final scoring.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Test Timer Mode Selection */}
          <section className="space-y-3">
            <h2 className="text-base font-bold text-slate-900 border-b border-slate-200 pb-1.5 flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-600" />
              Select Timer Mode
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label
                onClick={() => setSelectedTimerMode('stopwatch')}
                className={`p-3.5 rounded-lg border cursor-pointer flex items-start gap-3 transition-all ${
                  selectedTimerMode === 'stopwatch'
                    ? 'border-blue-600 bg-blue-50/70 ring-1 ring-blue-500'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <input
                  type="radio"
                  name="timerMode"
                  checked={selectedTimerMode === 'stopwatch'}
                  onChange={() => setSelectedTimerMode('stopwatch')}
                  className="mt-1"
                />
                <div>
                  <span className="font-bold text-slate-800 text-sm">Practice Mode (Unlimited Time)</span>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Timer counts upward. Attempt all 595 questions at your own comfortable pace without time pressure.
                  </p>
                </div>
              </label>

              <label
                onClick={() => setSelectedTimerMode('countdown')}
                className={`p-3.5 rounded-lg border cursor-pointer flex items-start gap-3 transition-all ${
                  selectedTimerMode === 'countdown'
                    ? 'border-blue-600 bg-blue-50/70 ring-1 ring-blue-500'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <input
                  type="radio"
                  name="timerMode"
                  checked={selectedTimerMode === 'countdown'}
                  onChange={() => setSelectedTimerMode('countdown')}
                  className="mt-1"
                />
                <div>
                  <span className="font-bold text-slate-800 text-sm">Exam Simulation (180 Min Countdown)</span>
                  <p className="text-xs text-slate-500 mt-0.5">
                    3-hour countdown timer simulating competitive exam pressure and time management.
                  </p>
                </div>
              </label>
            </div>
          </section>

        </div>

        {/* Footer Declaration & Start Button */}
        <div className="bg-slate-50 border-t border-slate-200 p-5 sm:p-7 space-y-4">
          <label className="flex items-start gap-3 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="mt-1 w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
            />
            <span className="text-xs sm:text-sm text-slate-700">
              I have read and understood all instructions. I understand that the test contains 595 questions from June 2026 Current Affairs and that my full result with complete solutions will be revealed upon test submission.
            </span>
          </label>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
            <span className="text-xs text-slate-500">
              Candidate System: <strong>NODE-2026-CA595</strong>
            </span>

            <button
              type="button"
              disabled={!agreed}
              onClick={() => onStartExam(selectedTimerMode)}
              className={`w-full sm:w-auto px-8 py-3 rounded-lg text-sm sm:text-base font-bold flex items-center justify-center gap-2 shadow-md transition-all ${
                agreed
                  ? 'bg-blue-600 hover:bg-blue-700 text-white active:scale-95'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              <span>I am ready to begin</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
