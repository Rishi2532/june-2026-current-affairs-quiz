import React, { useState } from 'react';
import { Clock, User, CheckCircle2, AlertCircle, Bookmark, ShieldCheck, Maximize2, Minimize2, Type } from 'lucide-react';
import { QuestionStatuses, UserResponses } from '../types';

interface HeaderProps {
  totalQuestions: number;
  responses: UserResponses;
  statuses: QuestionStatuses;
  timeSpentSeconds: number;
  timerMode: 'stopwatch' | 'countdown';
  countdownSeconds: number;
  onOpenSubmitModal: () => void;
  candidateName: string;
  fontSize?: 'normal' | 'large' | 'xlarge';
  onFontSizeChange?: (size: 'normal' | 'large' | 'xlarge') => void;
}

export const Header: React.FC<HeaderProps> = ({
  totalQuestions,
  responses,
  statuses,
  timeSpentSeconds,
  timerMode,
  countdownSeconds,
  onOpenSubmitModal,
  candidateName,
  fontSize = 'large',
  onFontSizeChange,
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const attemptedCount = Object.keys(responses).length;
  const unattemptedCount = totalQuestions - attemptedCount;

  // Format time
  const displaySeconds = timerMode === 'countdown' ? Math.max(0, countdownSeconds - timeSpentSeconds) : timeSpentSeconds;
  const hours = Math.floor(displaySeconds / 3600);
  const minutes = Math.floor((displaySeconds % 3600) / 60);
  const seconds = displaySeconds % 60;
  const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  const markedCount = Object.values(statuses).filter(
    (s) => s === 'marked-review' || s === 'answered-marked-review'
  ).length;

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
        setIsFullscreen(false);
      }
    }
  };

  return (
    <header className="bg-[#1e293b] text-white border-b border-slate-700 shadow-md sticky top-0 z-40 no-print">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2.5">
          
          {/* Left: Test Title & Candidate info */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-white shadow-inner flex-shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-extrabold text-sm sm:text-base tracking-wide text-white">
                  June 2026 Current Affairs – Full Mock Test
                </h1>
                <span className="hidden sm:inline-block px-2 py-0.5 text-xs font-semibold rounded bg-blue-900/60 text-blue-200 border border-blue-700">
                  IBPS / SBI Pattern
                </span>
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-300 mt-0.5">
                <span className="flex items-center gap-1 font-medium">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  {candidateName}
                </span>
                <span>•</span>
                <span>Max Marks: <strong>{totalQuestions}</strong></span>
              </div>
            </div>
          </div>

          {/* Right: Live stats, Font Size, Timer & Submit */}
          <div className="flex flex-wrap items-center justify-between md:justify-end gap-2 sm:gap-3">
            
            {/* Live Count Badges */}
            <div className="flex items-center gap-1.5 sm:gap-2 text-xs font-semibold">
              <div className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-emerald-950/80 text-emerald-300 border border-emerald-700/60" title="Attempted Questions">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>{attemptedCount}</span>
                <span className="hidden lg:inline text-emerald-400/80">Attempted</span>
              </div>

              <div className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-rose-950/80 text-rose-300 border border-rose-700/60" title="Unattempted Questions">
                <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
                <span>{unattemptedCount}</span>
                <span className="hidden lg:inline text-rose-400/80">Remaining</span>
              </div>

              <div className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-purple-950/80 text-purple-300 border border-purple-700/60" title="Marked for Review">
                <Bookmark className="w-3.5 h-3.5 text-purple-400" />
                <span>{markedCount}</span>
                <span className="hidden lg:inline text-purple-400/80">Review</span>
              </div>
            </div>

            {/* Font Size Selector in Header */}
            {onFontSizeChange && (
              <div className="hidden sm:flex items-center bg-slate-800 border border-slate-700 rounded-lg p-0.5" title="Text Size">
                <span className="px-1.5 text-[11px] text-slate-400 font-bold flex items-center">
                  <Type className="w-3 h-3" />
                </span>
                <button
                  type="button"
                  onClick={() => onFontSizeChange('normal')}
                  className={`px-2 py-0.5 text-xs font-bold rounded cursor-pointer ${fontSize === 'normal' ? 'bg-blue-600 text-white' : 'text-slate-300 hover:text-white'}`}
                >
                  A
                </button>
                <button
                  type="button"
                  onClick={() => onFontSizeChange('large')}
                  className={`px-2 py-0.5 text-xs font-bold rounded cursor-pointer ${fontSize === 'large' ? 'bg-blue-600 text-white' : 'text-slate-300 hover:text-white'}`}
                >
                  A+
                </button>
                <button
                  type="button"
                  onClick={() => onFontSizeChange('xlarge')}
                  className={`px-2 py-0.5 text-xs font-bold rounded cursor-pointer ${fontSize === 'xlarge' ? 'bg-blue-600 text-white' : 'text-slate-300 hover:text-white'}`}
                >
                  A++
                </button>
              </div>
            )}

            {/* Fullscreen Toggle */}
            <button
              type="button"
              onClick={toggleFullscreen}
              className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-md bg-slate-800 hover:bg-slate-700 border border-slate-600 text-slate-200 text-xs font-semibold cursor-pointer"
              title="Toggle Fullscreen Examination View"
            >
              {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            </button>

            {/* Timer Display */}
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-md font-mono text-xs sm:text-sm font-bold tracking-wider border shadow-sm ${
              timerMode === 'countdown' && displaySeconds < 300 
                ? 'bg-red-950 text-red-300 border-red-600 animate-pulse'
                : 'bg-slate-800 text-yellow-300 border-slate-600'
            }`}>
              <Clock className="w-4 h-4 text-yellow-400" />
              <span>{formattedTime}</span>
            </div>

            {/* Submit Test Button */}
            <button
              onClick={onOpenSubmitModal}
              className="px-3.5 sm:px-4 py-1.5 bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 active:scale-95 text-white text-xs sm:text-sm font-bold rounded-md shadow-sm transition-all duration-150 flex items-center gap-1.5 cursor-pointer"
            >
              <span>Submit Test</span>
            </button>

          </div>

        </div>
      </div>
    </header>
  );
};
