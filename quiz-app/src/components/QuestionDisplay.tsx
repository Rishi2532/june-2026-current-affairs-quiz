import React from 'react';
import { Question, QuestionStatus } from '../types';
import { Bookmark, RotateCcw, Check, Type, ChevronLeft, ChevronRight } from 'lucide-react';

interface QuestionDisplayProps {
  question: Question;
  totalQuestions: number;
  selectedOptionKey: string | undefined;
  onSelectOption: (key: string) => void;
  status: QuestionStatus;
  onClearResponse: () => void;
  onToggleMarkForReview: () => void;
  onSaveAndNext?: () => void;
  onPrevious?: () => void;
  onMarkForReviewAndNext?: () => void;
  fontSize?: 'normal' | 'large' | 'xlarge';
  onFontSizeChange?: (size: 'normal' | 'large' | 'xlarge') => void;
}

export const QuestionDisplay: React.FC<QuestionDisplayProps> = ({
  question,
  totalQuestions,
  selectedOptionKey,
  onSelectOption,
  status,
  onClearResponse,
  onToggleMarkForReview,
  onSaveAndNext,
  onPrevious,
  onMarkForReviewAndNext,
  fontSize = 'large',
  onFontSizeChange,
}) => {
  const isMarked = status === 'marked-review' || status === 'answered-marked-review';

  // Format paragraphs in question text
  const paragraphs = question.question.split('\n\n').filter(p => p.trim());

  const fontConfig = {
    normal: {
      question: 'text-base sm:text-lg font-bold',
      options: 'text-sm sm:text-base font-medium',
      badge: 'w-6 h-6 text-xs',
    },
    large: {
      question: 'text-base sm:text-xl lg:text-2xl font-bold leading-relaxed',
      options: 'text-sm sm:text-lg lg:text-xl font-medium',
      badge: 'w-6 h-6 sm:w-7 sm:h-7 text-xs sm:text-sm',
    },
    xlarge: {
      question: 'text-lg sm:text-2xl lg:text-3xl font-extrabold leading-relaxed',
      options: 'text-base sm:text-xl lg:text-2xl font-medium',
      badge: 'w-7 h-7 sm:w-8 sm:h-8 text-sm sm:text-base',
    },
  }[fontSize];

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col h-full min-h-0 overflow-hidden">
      
      {/* Subheader: Question Number, Marks & Quick Top Next/Prev */}
      <div className="bg-slate-50 border-b border-slate-200 px-3 sm:px-6 py-2 sm:py-2.5 flex items-center justify-between gap-2 sm:gap-3 flex-shrink-0">
        <div className="flex items-center gap-1.5 sm:gap-2.5 min-w-0">
          <span className="font-extrabold text-slate-900 text-sm sm:text-base lg:text-lg truncate">
            Q. {question.id}
          </span>
          <span className="text-xs sm:text-sm text-slate-500 font-semibold whitespace-nowrap">
            of {totalQuestions}
          </span>
          
          {/* Status Badge */}
          {status === 'answered' && (
            <span className="hidden sm:inline-block px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
              Answered
            </span>
          )}
          {status === 'not-answered' && (
            <span className="hidden sm:inline-block px-2 py-0.5 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-300">
              Not Answered
            </span>
          )}
          {status === 'marked-review' && (
            <span className="hidden sm:inline-block px-2 py-0.5 rounded-full text-xs font-bold bg-purple-100 text-purple-800 border border-purple-300">
              Marked
            </span>
          )}
          {status === 'answered-marked-review' && (
            <span className="hidden sm:inline-block px-2 py-0.5 rounded-full text-xs font-bold bg-purple-100 text-purple-800 border border-purple-300">
              Ans & Marked
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick Header Next/Prev Buttons - ALWAYS visible at the top! */}
          <div className="flex items-center gap-1.5 bg-white border border-slate-300 p-0.5 rounded-lg shadow-xs">
            {onPrevious && (
              <button
                type="button"
                onClick={onPrevious}
                disabled={question.id <= 1}
                title="Previous Question [P or Left Arrow]"
                className={`px-2 sm:px-2.5 py-1 rounded text-xs font-bold flex items-center gap-0.5 transition-colors cursor-pointer ${
                  question.id <= 1
                    ? 'text-slate-300 cursor-not-allowed'
                    : 'text-slate-700 hover:bg-slate-100 active:scale-95'
                }`}
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Prev</span>
              </button>
            )}

            {onSaveAndNext && (
              <button
                type="button"
                onClick={onSaveAndNext}
                title="Save & Next Question [N, Enter, or Right Arrow]"
                className="px-2.5 sm:px-3 py-1 rounded bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-xs font-bold flex items-center gap-1 shadow-xs transition-all cursor-pointer"
              >
                <span>{question.id === totalQuestions ? 'Review' : 'Next'}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Font Size Adjuster in Question Screen */}
          {onFontSizeChange && (
            <div className="hidden sm:flex items-center bg-white border border-slate-300 rounded-lg p-0.5" title="Adjust Text Size">
              <span className="px-1.5 text-xs text-slate-500 font-bold flex items-center">
                <Type className="w-3 h-3 mr-0.5" />
              </span>
              <button
                type="button"
                onClick={() => onFontSizeChange('normal')}
                className={`px-2 py-0.5 text-xs font-bold rounded ${fontSize === 'normal' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:text-slate-900 cursor-pointer'}`}
              >
                A
              </button>
              <button
                type="button"
                onClick={() => onFontSizeChange('large')}
                className={`px-2 py-0.5 text-xs font-bold rounded ${fontSize === 'large' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:text-slate-900 cursor-pointer'}`}
              >
                A+
              </button>
              <button
                type="button"
                onClick={() => onFontSizeChange('xlarge')}
                className={`px-2 py-0.5 text-xs font-bold rounded ${fontSize === 'xlarge' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:text-slate-900 cursor-pointer'}`}
              >
                A++
              </button>
            </div>
          )}

          <div className="hidden md:flex items-center gap-1.5 text-xs font-bold">
            <span className="bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded border border-emerald-300">
              +1.00
            </span>
            <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-300">
              0.00 Neg.
            </span>
          </div>
        </div>
      </div>

      {/* Main Question & Options Container */}
      <div className="p-3.5 sm:p-5 lg:p-6 overflow-y-auto flex-1 min-h-0 space-y-4">
        
        {/* Big Question Text */}
        <div className={`text-slate-950 ${fontConfig.question} space-y-2.5`}>
          {paragraphs.map((para, idx) => (
            <p key={idx} className="whitespace-pre-line">
              {para}
            </p>
          ))}
        </div>

        {/* Options List with Big Clickable Cards */}
        <div className="pt-2 space-y-2.5">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
            Select one option:
          </div>
          {question.options.map((opt) => {
            const isSelected = selectedOptionKey === opt.key;
            return (
              <label
                key={opt.key}
                onClick={() => onSelectOption(opt.key)}
                className={`flex items-start gap-3 p-3 sm:p-3.5 rounded-xl border-2 cursor-pointer transition-all duration-150 select-none ${
                  isSelected
                    ? 'bg-blue-50/90 border-blue-600 text-blue-950 shadow-sm ring-2 ring-blue-400/30'
                    : 'bg-white border-slate-200 hover:bg-slate-50 hover:border-slate-300 text-slate-900'
                }`}
              >
                {/* Custom Radio Circle */}
                <div className="mt-0.5 flex-shrink-0">
                  <div
                    className={`${fontConfig.badge} rounded-full border-2 flex items-center justify-center transition-colors ${
                      isSelected
                        ? 'border-blue-600 bg-blue-600 text-white'
                        : 'border-slate-400 bg-white'
                    }`}
                  >
                    {isSelected ? (
                      <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[3]" />
                    ) : (
                      <span className="font-extrabold text-slate-600">
                        {opt.key}
                      </span>
                    )}
                  </div>
                </div>

                {/* Option text */}
                <div className={`${fontConfig.options} leading-relaxed flex-1`}>
                  <span className="font-extrabold text-slate-800 mr-2">
                    {opt.key}.
                  </span>
                  <span>{opt.text}</span>
                </div>
              </label>
            );
          })}
        </div>

      </div>

      {/* Action Footer: Clear Response, Mark Review, Previous & Save & Next */}
      <div className="bg-slate-50 border-t border-slate-200 px-3 sm:px-6 py-2 sm:py-2.5 flex items-center justify-between gap-2 sm:gap-3 flex-shrink-0">
        <div className="flex items-center gap-1.5 sm:gap-2">
          <button
            type="button"
            onClick={onClearResponse}
            disabled={!selectedOptionKey}
            className={`px-2.5 sm:px-3 py-1.5 rounded-lg text-xs sm:text-sm font-bold flex items-center gap-1 border transition-colors ${
              selectedOptionKey
                ? 'bg-white border-slate-300 text-slate-700 hover:bg-slate-100 hover:text-red-600 shadow-xs cursor-pointer'
                : 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Clear Response</span>
            <span className="sm:hidden">Clear</span>
          </button>

          <button
            type="button"
            onClick={onToggleMarkForReview}
            className={`px-2.5 sm:px-3 py-1.5 rounded-lg text-xs sm:text-sm font-bold flex items-center gap-1 border transition-colors cursor-pointer ${
              isMarked
                ? 'bg-purple-600 text-white border-purple-700 shadow-xs'
                : 'bg-white border-purple-300 text-purple-700 hover:bg-purple-50 shadow-xs'
            }`}
          >
            <Bookmark className={`w-3.5 h-3.5 ${isMarked ? 'fill-current' : ''}`} />
            <span className="hidden sm:inline">{isMarked ? 'Unmark Review' : 'Mark for Review'}</span>
            <span className="sm:hidden">{isMarked ? 'Unmark' : 'Review'}</span>
          </button>

          {onMarkForReviewAndNext && (
            <button
              type="button"
              onClick={onMarkForReviewAndNext}
              className="hidden md:flex px-2.5 sm:px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold items-center gap-1 border border-purple-200 text-purple-700 bg-purple-50/70 hover:bg-purple-100 transition-colors cursor-pointer"
              title="Mark for Review & Move to Next"
            >
              <Bookmark className="w-3.5 h-3.5" />
              <span>Mark & Next</span>
            </button>
          )}
        </div>

        {/* Right side inside Question Card Footer: Previous & Save & Next */}
        <div className="flex items-center gap-2">
          {onPrevious && (
            <button
              type="button"
              onClick={onPrevious}
              disabled={question.id <= 1}
              className={`px-3 sm:px-4 py-1.5 rounded-lg text-xs sm:text-sm font-bold flex items-center gap-1 border transition-colors shadow-xs ${
                question.id <= 1
                  ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
                  : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100 cursor-pointer active:scale-95'
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>
          )}

          {onSaveAndNext && (
            <button
              type="button"
              onClick={onSaveAndNext}
              className="px-4 sm:px-6 py-1.5 sm:py-2 rounded-lg bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
            >
              <span>{question.id === totalQuestions ? 'Save & Review' : 'Save & Next'}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

    </div>
  );
};
