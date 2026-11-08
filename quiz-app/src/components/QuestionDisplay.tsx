import React from 'react';
import { Question, QuestionStatus } from '../types';
import { Bookmark, RotateCcw, Check, Info, Type } from 'lucide-react';

interface QuestionDisplayProps {
  question: Question;
  totalQuestions: number;
  selectedOptionKey: string | undefined;
  onSelectOption: (key: string) => void;
  status: QuestionStatus;
  onClearResponse: () => void;
  onToggleMarkForReview: () => void;
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
  fontSize = 'large',
  onFontSizeChange,
}) => {
  const isMarked = status === 'marked-review' || status === 'answered-marked-review';

  // Format paragraphs in question text
  const paragraphs = question.question.split('\n\n').filter(p => p.trim());

  const fontConfig = {
    normal: {
      question: 'text-base sm:text-lg font-bold',
      options: 'text-base',
      badge: 'w-6 h-6 text-xs',
    },
    large: {
      question: 'text-lg sm:text-xl lg:text-2xl font-bold leading-relaxed',
      options: 'text-base sm:text-lg lg:text-xl font-medium',
      badge: 'w-7 h-7 text-xs sm:text-sm',
    },
    xlarge: {
      question: 'text-xl sm:text-2xl lg:text-3xl font-extrabold leading-loose',
      options: 'text-lg sm:text-xl lg:text-2xl font-medium',
      badge: 'w-8 h-8 text-sm sm:text-base',
    },
  }[fontSize];

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col h-full overflow-hidden">
      
      {/* Subheader: Question Number & Marks */}
      <div className="bg-slate-50 border-b border-slate-200 px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="font-extrabold text-slate-900 text-base sm:text-lg">
            Question No. {question.id}
          </span>
          <span className="text-xs sm:text-sm text-slate-500 font-semibold">
            of {totalQuestions}
          </span>
          
          {/* Status Badge */}
          {status === 'answered' && (
            <span className="ml-2 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
              Answered
            </span>
          )}
          {status === 'not-answered' && (
            <span className="ml-2 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-300">
              Not Answered
            </span>
          )}
          {status === 'marked-review' && (
            <span className="ml-2 px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-100 text-purple-800 border border-purple-300">
              Marked for Review
            </span>
          )}
          {status === 'answered-marked-review' && (
            <span className="ml-2 px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-100 text-purple-800 border border-purple-300 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              Answered & Marked
            </span>
          )}
        </div>

        <div className="flex items-center gap-3">
          {/* Font Size Adjuster in Question Screen */}
          {onFontSizeChange && (
            <div className="flex items-center bg-white border border-slate-300 rounded-lg p-0.5" title="Adjust Text Size">
              <span className="px-1.5 text-xs text-slate-500 font-bold flex items-center">
                <Type className="w-3 h-3 mr-0.5" />
              </span>
              <button
                type="button"
                onClick={() => onFontSizeChange('normal')}
                className={`px-2 py-0.5 text-xs font-bold rounded ${fontSize === 'normal' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:text-slate-900'}`}
              >
                A
              </button>
              <button
                type="button"
                onClick={() => onFontSizeChange('large')}
                className={`px-2 py-0.5 text-xs font-bold rounded ${fontSize === 'large' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:text-slate-900'}`}
              >
                A+
              </button>
              <button
                type="button"
                onClick={() => onFontSizeChange('xlarge')}
                className={`px-2 py-0.5 text-xs font-bold rounded ${fontSize === 'xlarge' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:text-slate-900'}`}
              >
                A++
              </button>
            </div>
          )}

          <div className="flex items-center gap-2 text-xs font-bold">
            <span className="bg-emerald-50 text-emerald-800 px-2.5 py-1 rounded-md border border-emerald-300">
              +1.00 Marks
            </span>
            <span className="bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md border border-slate-300">
              0.00 Neg.
            </span>
          </div>
        </div>
      </div>

      {/* Main Question & Options Container */}
      <div className="p-5 sm:p-8 overflow-y-auto flex-1 space-y-6">
        
        {/* Big Question Text */}
        <div className={`text-slate-950 ${fontConfig.question} space-y-3`}>
          {paragraphs.map((para, idx) => (
            <p key={idx} className="whitespace-pre-line">
              {para}
            </p>
          ))}
        </div>

        {/* Options List with Big Clickable Cards */}
        <div className="pt-3 space-y-3">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
            Select one option:
          </div>
          {question.options.map((opt) => {
            const isSelected = selectedOptionKey === opt.key;
            return (
              <label
                key={opt.key}
                onClick={() => onSelectOption(opt.key)}
                className={`flex items-start gap-3.5 p-3.5 sm:p-4 rounded-xl border-2 cursor-pointer transition-all duration-150 select-none ${
                  isSelected
                    ? 'bg-blue-50/90 border-blue-600 text-blue-950 shadow-md ring-2 ring-blue-400/40'
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
                      <Check className="w-4 h-4 stroke-[3]" />
                    ) : (
                      <span className="font-extrabold text-slate-600">
                        {opt.key}
                      </span>
                    )}
                  </div>
                </div>

                {/* Option text */}
                <div className={`${fontConfig.options} leading-relaxed flex-1`}>
                  <span className="font-extrabold text-slate-800 mr-2.5">
                    {opt.key}.
                  </span>
                  <span>{opt.text}</span>
                </div>
              </label>
            );
          })}
        </div>

      </div>

      {/* Action Footer: Clear Response & Mark for Review Buttons */}
      <div className="bg-slate-50 border-t border-slate-200 px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={onClearResponse}
            disabled={!selectedOptionKey}
            className={`px-3.5 py-2 rounded-lg text-xs sm:text-sm font-bold flex items-center gap-1.5 border transition-colors ${
              selectedOptionKey
                ? 'bg-white border-slate-300 text-slate-700 hover:bg-slate-100 hover:text-red-600 shadow-sm cursor-pointer'
                : 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            <RotateCcw className="w-4 h-4" />
            <span>Clear Response</span>
          </button>

          <button
            type="button"
            onClick={onToggleMarkForReview}
            className={`px-3.5 py-2 rounded-lg text-xs sm:text-sm font-bold flex items-center gap-1.5 border transition-colors cursor-pointer ${
              isMarked
                ? 'bg-purple-600 text-white border-purple-700 shadow-sm'
                : 'bg-white border-purple-300 text-purple-700 hover:bg-purple-50 shadow-sm'
            }`}
          >
            <Bookmark className={`w-4 h-4 ${isMarked ? 'fill-current' : ''}`} />
            <span>{isMarked ? 'Unmark Review' : 'Mark for Review'}</span>
          </button>
        </div>

        <div className="hidden sm:flex items-center gap-1 text-xs text-slate-500 font-medium">
          <Info className="w-4 h-4 text-blue-600" />
          <span>Keyboard: Press [1-5] or [A-E] to select | [N] for Next | [P] for Prev</span>
        </div>
      </div>

    </div>
  );
};
