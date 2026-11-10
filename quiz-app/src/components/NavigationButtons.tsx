import React from 'react';
import { ChevronLeft, ChevronRight, Bookmark, RotateCcw, Grid } from 'lucide-react';

interface NavigationButtonsProps {
  currentQuestionId: number;
  totalQuestions: number;
  onPrevious: () => void;
  onSaveAndNext: () => void;
  onMarkForReviewAndNext: () => void;
  onClearResponse: () => void;
  onToggleMobilePalette: () => void;
}

export const NavigationButtons: React.FC<NavigationButtonsProps> = ({
  currentQuestionId,
  totalQuestions,
  onPrevious,
  onSaveAndNext,
  onMarkForReviewAndNext,
  onClearResponse,
  onToggleMobilePalette,
}) => {
  return (
    <div className="flex-shrink-0 bg-white border-t border-slate-200 px-3 sm:px-6 py-2 sm:py-2.5 shadow-md z-30 select-none">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-4">
        
        {/* Left Side: Mark for Review & Clear */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onMarkForReviewAndNext}
            className="px-3 sm:px-4 py-2 rounded-md bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-300 text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <Bookmark className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Mark for Review &</span> Next
          </button>

          <button
            type="button"
            onClick={onClearResponse}
            className="px-3 sm:px-4 py-2 rounded-md bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-300 text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Clear Response</span>
          </button>
        </div>

        {/* Mobile Palette Toggle Button */}
        <button
          type="button"
          onClick={onToggleMobilePalette}
          className="lg:hidden px-3 py-2 rounded-md bg-blue-50 text-blue-700 border border-blue-200 text-xs font-semibold flex items-center gap-1.5"
        >
          <Grid className="w-3.5 h-3.5" />
          <span>Palette</span>
        </button>

        {/* Right Side: Previous & Save & Next */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onPrevious}
            disabled={currentQuestionId <= 1}
            className={`px-3 sm:px-4 py-2 rounded-md text-xs sm:text-sm font-semibold flex items-center gap-1 border transition-colors shadow-sm ${
              currentQuestionId <= 1
                ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
                : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          <button
            type="button"
            onClick={onSaveAndNext}
            className="px-4 sm:px-6 py-2 rounded-md bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all shadow-md"
          >
            <span>{currentQuestionId === totalQuestions ? 'Save & Review' : 'Save & Next'}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
