import React from 'react';
import { AlertTriangle, CheckCircle2, XCircle, Bookmark, HelpCircle } from 'lucide-react';
import { QuestionStatuses, UserResponses } from '../types';

interface SubmitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmSubmit: () => void;
  totalQuestions: number;
  responses: UserResponses;
  statuses: QuestionStatuses;
}

export const SubmitModal: React.FC<SubmitModalProps> = ({
  isOpen,
  onClose,
  onConfirmSubmit,
  totalQuestions,
  responses,
  statuses,
}) => {
  if (!isOpen) return null;

  const attemptedCount = Object.keys(responses).length;
  const unansweredCount = totalQuestions - attemptedCount;

  let markedReviewCount = 0;
  let answeredMarkedCount = 0;
  let notVisitedCount = 0;

  for (let i = 1; i <= totalQuestions; i++) {
    const s = statuses[i] || 'not-visited';
    if (s === 'marked-review') markedReviewCount++;
    else if (s === 'answered-marked-review') answeredMarkedCount++;
    else if (s === 'not-visited') notVisitedCount++;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-lg w-full overflow-hidden">
        
        {/* Header */}
        <div className="bg-slate-900 text-white px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-yellow-400" />
            <h3 className="font-bold text-base">Submit Examination Confirmation</h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white text-lg font-bold p-1 leading-none"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 space-y-4">
          <p className="text-sm text-slate-700">
            Please review your exam summary before final submission. Once submitted, your answers will be locked and your final score with question-wise solutions will be generated.
          </p>

          {/* Statistics Table */}
          <div className="bg-slate-50 rounded-lg border border-slate-200 p-4 space-y-2.5">
            <div className="flex items-center justify-between text-xs sm:text-sm py-1 border-b border-slate-200">
              <span className="text-slate-600 font-medium">Total Questions:</span>
              <span className="font-bold text-slate-900">{totalQuestions}</span>
            </div>

            <div className="flex items-center justify-between text-xs sm:text-sm py-1 border-b border-slate-200">
              <span className="flex items-center gap-1.5 text-emerald-700 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Attempted / Answered:
              </span>
              <span className="font-bold text-emerald-700">{attemptedCount}</span>
            </div>

            <div className="flex items-center justify-between text-xs sm:text-sm py-1 border-b border-slate-200">
              <span className="flex items-center gap-1.5 text-rose-700 font-medium">
                <XCircle className="w-4 h-4 text-rose-600" />
                Unanswered / Remaining:
              </span>
              <span className="font-bold text-rose-700">{unansweredCount}</span>
            </div>

            <div className="flex items-center justify-between text-xs sm:text-sm py-1 border-b border-slate-200">
              <span className="flex items-center gap-1.5 text-purple-700 font-medium">
                <Bookmark className="w-4 h-4 text-purple-600" />
                Marked for Review:
              </span>
              <span className="font-bold text-purple-700">
                {markedReviewCount} unans. / {answeredMarkedCount} ans.
              </span>
            </div>

            <div className="flex items-center justify-between text-xs sm:text-sm py-1">
              <span className="flex items-center gap-1.5 text-slate-500 font-medium">
                <HelpCircle className="w-4 h-4 text-slate-400" />
                Not Visited:
              </span>
              <span className="font-bold text-slate-600">{notVisitedCount}</span>
            </div>
          </div>

          {unansweredCount > 0 && (
            <div className="bg-amber-50 border border-amber-300 rounded-md p-3 text-xs text-amber-900 flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
              <span>
                You still have <strong>{unansweredCount} unanswered questions</strong>. Are you sure you want to proceed with submission?
              </span>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="bg-slate-100 border-t border-slate-200 px-5 py-3.5 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-md bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs sm:text-sm font-semibold transition-colors"
          >
            Return to Test
          </button>

          <button
            type="button"
            onClick={onConfirmSubmit}
            className="px-5 py-2 rounded-md bg-red-600 hover:bg-red-700 active:scale-95 text-white text-xs sm:text-sm font-bold shadow-md transition-all"
          >
            Yes, Submit Test
          </button>
        </div>

      </div>
    </div>
  );
};

