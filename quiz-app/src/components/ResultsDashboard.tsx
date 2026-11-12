import React from 'react';
import { 
  Trophy, CheckCircle2, XCircle, HelpCircle, Target, Award, 
  RotateCcw, BookOpen, Clock, ArrowDown, Sparkles, Printer 
} from 'lucide-react';
import { ExamStats } from '../types';

interface ResultsDashboardProps {
  stats: ExamStats;
  onRetakeExam: () => void;
  onScrollToReview: () => void;
  negativeMarkingEnabled: boolean;
  onToggleNegativeMarking: () => void;
  onDownloadPDF?: () => void;
  monthTitle?: string;
  onSwitchToOtherQuiz?: () => void;
  otherMonthName?: string;
}

export const ResultsDashboard: React.FC<ResultsDashboardProps> = ({
  stats,
  onRetakeExam,
  onScrollToReview,
  negativeMarkingEnabled,
  onToggleNegativeMarking,
  onDownloadPDF,
  monthTitle = 'July 2026',
  onSwitchToOtherQuiz,
  otherMonthName,
}) => {
  // Score calculations
  const standardScore = stats.correct;
  const negativeMarkingScore = Math.max(0, stats.correct - stats.incorrect * 0.25);
  const activeScore = negativeMarkingEnabled ? negativeMarkingScore : standardScore;
  const percentageScore = ((activeScore / stats.totalQuestions) * 100).toFixed(1);

  // Time format
  const hours = Math.floor(stats.timeSpentSeconds / 3600);
  const minutes = Math.floor((stats.timeSpentSeconds % 3600) / 60);
  const seconds = stats.timeSpentSeconds % 60;
  const formattedTime = `${hours > 0 ? `${hours}h ` : ''}${minutes}m ${seconds}s`;

  // SVG Arc calculation
  const total = stats.totalQuestions;
  const radius = 64;
  const circumference = 2 * Math.PI * radius; // ~402.12
  const correctStroke = (stats.correct / total) * circumference;
  const incorrectStroke = (stats.incorrect / total) * circumference;
  const unattemptedStroke = (stats.unattempted / total) * circumference;

  // Grade/Badge
  let gradeBadge = { label: 'Needs Improvement', color: 'bg-rose-100 text-rose-800 border-rose-300' };
  if (stats.accuracy >= 85) {
    gradeBadge = { label: 'Excellent Accuracy! Outstanding Performer', color: 'bg-emerald-100 text-emerald-800 border-emerald-300' };
  } else if (stats.accuracy >= 70) {
    gradeBadge = { label: 'Good Effort! Strong Grasp of Current Affairs', color: 'bg-blue-100 text-blue-800 border-blue-300' };
  } else if (stats.accuracy >= 50) {
    gradeBadge = { label: 'Average Performance - Keep Practicing', color: 'bg-amber-100 text-amber-800 border-amber-300' };
  }

  return (
    <div className="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden mb-8">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-[#1e293b] via-[#0f172a] to-[#1e293b] text-white p-6 sm:p-8 border-b border-slate-700">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4 text-center md:text-left">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-yellow-600 flex items-center justify-center text-white shadow-lg flex-shrink-0">
              <Trophy className="w-9 h-9" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                Examination Submitted Successfully
              </div>
              <h2 className="text-xl sm:text-3xl font-extrabold tracking-tight">
                Mock Test Performance Report
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 mt-1">
                {monthTitle} Current Affairs – Full {stats.totalQuestions} Questions Test
              </p>
            </div>
          </div>

          {/* Quick Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            {onSwitchToOtherQuiz && (
              <button
                onClick={onSwitchToOtherQuiz}
                className="px-5 py-2.5 rounded-lg bg-amber-600 hover:bg-amber-500 active:scale-95 text-white text-xs sm:text-sm font-bold shadow-md transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>Take {otherMonthName || 'Other Month'} Quiz</span>
              </button>
            )}

            {onDownloadPDF && (
              <button
                onClick={onDownloadPDF}
                className="px-5 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white text-xs sm:text-sm font-bold shadow-md transition-all flex items-center gap-2 cursor-pointer"
                title={`Print or Save complete response sheet with all ${stats.totalQuestions} questions, answers, and explanations as PDF`}
              >
                <Printer className="w-4 h-4" />
                <span>Download PDF Response Sheet</span>
              </button>
            )}

            <button
              onClick={onScrollToReview}
              className="px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 active:scale-95 text-white text-xs sm:text-sm font-bold shadow-md transition-all flex items-center gap-2 cursor-pointer"
            >
              <BookOpen className="w-4 h-4" />
              <span>Review All {stats.totalQuestions} Answers</span>
              <ArrowDown className="w-4 h-4" />
            </button>

            <button
              onClick={onRetakeExam}
              className="px-4 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-600 text-slate-200 text-xs sm:text-sm font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Retake Test</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="p-6 sm:p-8 max-w-6xl mx-auto space-y-8">
        
        {/* Performance Cards Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Card 1: Total Score */}
          <div className="bg-slate-50 rounded-xl p-4 sm:p-5 border border-slate-200 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase tracking-wider">
              <span>Total Score</span>
              <Award className="w-4 h-4 text-blue-600" />
            </div>
            <div className="mt-3">
              <div className="text-2xl sm:text-4xl font-black text-slate-900">
                {activeScore}
                <span className="text-sm sm:text-base font-normal text-slate-500"> / {stats.totalQuestions}</span>
              </div>
              <div className="text-xs text-slate-500 mt-1">
                Score Percentage: <strong>{percentageScore}%</strong>
              </div>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-200 flex items-center justify-between text-[11px]">
              <span className="text-slate-500">Negative Marking:</span>
              <button
                onClick={onToggleNegativeMarking}
                className="text-blue-600 font-medium hover:underline text-[11px]"
              >
                {negativeMarkingEnabled ? 'Active (-0.25)' : 'Off (Standard)'}
              </button>
            </div>
          </div>

          {/* Card 2: Accuracy */}
          <div className="bg-emerald-50/50 rounded-xl p-4 sm:p-5 border border-emerald-200 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between text-emerald-800 text-xs font-semibold uppercase tracking-wider">
              <span>Accuracy</span>
              <Target className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="mt-3">
              <div className="text-2xl sm:text-4xl font-black text-emerald-700">
                {stats.accuracy}%
              </div>
              <div className="text-xs text-emerald-600 mt-1">
                Based on {stats.attempted} attempted questions
              </div>
            </div>
            <div className="mt-3 pt-2 border-t border-emerald-200">
              <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold border ${gradeBadge.color}`}>
                {stats.accuracy >= 70 ? 'High Accuracy' : 'Practice More'}
              </span>
            </div>
          </div>

          {/* Card 3: Correct vs Incorrect */}
          <div className="bg-slate-50 rounded-xl p-4 sm:p-5 border border-slate-200 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase tracking-wider">
              <span>Answer Breakdown</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="mt-2 space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1 text-emerald-700 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Correct:
                </span>
                <span className="font-bold text-emerald-700 text-sm">{stats.correct}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1 text-rose-700 font-medium">
                  <XCircle className="w-3.5 h-3.5" /> Incorrect:
                </span>
                <span className="font-bold text-rose-700 text-sm">{stats.incorrect}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1 text-slate-600 font-medium">
                  <HelpCircle className="w-3.5 h-3.5" /> Unattempted:
                </span>
                <span className="font-bold text-slate-700 text-sm">{stats.unattempted}</span>
              </div>
            </div>
            <div className="mt-2 pt-2 border-t border-slate-200 text-[11px] text-slate-500">
              Total Attempted: <strong>{stats.attempted} / {stats.totalQuestions}</strong>
            </div>
          </div>

          {/* Card 4: Time Spent */}
          <div className="bg-slate-50 rounded-xl p-4 sm:p-5 border border-slate-200 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase tracking-wider">
              <span>Time Consumed</span>
              <Clock className="w-4 h-4 text-blue-600" />
            </div>
            <div className="mt-3">
              <div className="text-xl sm:text-3xl font-black text-slate-800">
                {formattedTime}
              </div>
              <div className="text-xs text-slate-500 mt-1">
                Avg: {stats.attempted > 0 ? (stats.timeSpentSeconds / stats.attempted).toFixed(1) : 0}s per attempt
              </div>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-200 text-[11px] text-slate-500">
              Pacing: Good examination stamina
            </div>
          </div>

        </div>

        {/* Visual Charts & Summary Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center bg-slate-50/80 rounded-xl p-6 border border-slate-200">
          
          {/* Donut Chart */}
          <div className="flex flex-col items-center justify-center">
            <div className="relative w-44 h-44 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 160 160">
                {/* Background Ring */}
                <circle
                  cx="80"
                  cy="80"
                  r={radius}
                  stroke="#e2e8f0"
                  strokeWidth="18"
                  fill="transparent"
                />
                
                {/* Unattempted Segment (Grey) */}
                <circle
                  cx="80"
                  cy="80"
                  r={radius}
                  stroke="#cbd5e1"
                  strokeWidth="18"
                  strokeDasharray={`${unattemptedStroke} ${circumference}`}
                  strokeDashoffset="0"
                  fill="transparent"
                />

                {/* Incorrect Segment (Red) */}
                <circle
                  cx="80"
                  cy="80"
                  r={radius}
                  stroke="#ef4444"
                  strokeWidth="18"
                  strokeDasharray={`${incorrectStroke} ${circumference}`}
                  strokeDashoffset={-unattemptedStroke}
                  fill="transparent"
                />

                {/* Correct Segment (Green) */}
                <circle
                  cx="80"
                  cy="80"
                  r={radius}
                  stroke="#10b981"
                  strokeWidth="18"
                  strokeDasharray={`${correctStroke} ${circumference}`}
                  strokeDashoffset={-(unattemptedStroke + incorrectStroke)}
                  fill="transparent"
                />
              </svg>

              {/* Center Info */}
              <div className="absolute text-center">
                <div className="text-2xl font-black text-slate-900">{stats.accuracy}%</div>
                <div className="text-[10px] uppercase font-bold text-slate-400">Accuracy</div>
              </div>
            </div>

            {/* Legend */}
            <div className="flex items-center gap-4 text-xs mt-3">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
                <span>Correct ({stats.correct})</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-rose-500"></span>
                <span>Incorrect ({stats.incorrect})</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-slate-300"></span>
                <span>Unattempted ({stats.unattempted})</span>
              </div>
            </div>
          </div>

          {/* Performance Analysis Box */}
          <div className="md:col-span-2 space-y-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Examination Assessment
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                You attempted <strong>{stats.attempted}</strong> out of <strong>{stats.totalQuestions}</strong> questions with <strong>{stats.accuracy}% accuracy</strong>.
                {stats.incorrect > 0 && ` Reviewing the ${stats.incorrect} incorrect questions and their detailed explanations below will help plug critical knowledge gaps.`}
              </p>
            </div>

            {/* Progress Bars */}
            <div className="space-y-2.5">
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-emerald-700">Correct Answers ({stats.correct})</span>
                  <span className="text-slate-600">{((stats.correct / stats.totalQuestions) * 100).toFixed(1)}%</span>
                </div>
                <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                  <div
                    className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${(stats.correct / stats.totalQuestions) * 100}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-rose-700">Incorrect Answers ({stats.incorrect})</span>
                  <span className="text-slate-600">{((stats.incorrect / stats.totalQuestions) * 100).toFixed(1)}%</span>
                </div>
                <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                  <div
                    className="bg-rose-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${(stats.incorrect / stats.totalQuestions) * 100}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-slate-600">Unattempted ({stats.unattempted})</span>
                  <span className="text-slate-600">{((stats.unattempted / stats.totalQuestions) * 100).toFixed(1)}%</span>
                </div>
                <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                  <div
                    className="bg-slate-300 h-full rounded-full transition-all duration-500"
                    style={{ width: `${(stats.unattempted / stats.totalQuestions) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <span className={`px-3 py-1 rounded-full text-xs font-bold border ${gradeBadge.color}`}>
                {gradeBadge.label}
              </span>
              <span className="text-xs text-slate-500">
                Scroll below to inspect all 595 questions with complete solutions.
              </span>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
