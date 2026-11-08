import React, { useState, useRef, useEffect, useMemo } from 'react';
import { QuestionStatuses, QuestionStatus } from '../types';
import { Search, RotateCcw } from 'lucide-react';

interface QuestionPaletteProps {
  totalQuestions: number;
  currentQuestionId: number;
  statuses: QuestionStatuses;
  onSelectQuestion: (questionId: number) => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

type PaletteFilter = 'all' | 'answered' | 'not-answered' | 'not-visited' | 'marked';

export const QuestionPalette: React.FC<QuestionPaletteProps> = ({
  totalQuestions,
  currentQuestionId,
  statuses,
  onSelectQuestion,
  isOpenMobile,
  onCloseMobile,
}) => {
  const [jumpInput, setJumpInput] = useState('');
  const [activeSection, setActiveSection] = useState<number>(0);
  const [paletteFilter, setPaletteFilter] = useState<PaletteFilter>('all');
  const activeBtnRef = useRef<HTMLButtonElement | null>(null);

  // Status counts
  const counts = useMemo(() => {
    const c = {
      answered: 0,
      notAnswered: 0,
      notVisited: 0,
      markedReview: 0,
      answeredMarkedReview: 0,
    };

    for (let i = 1; i <= totalQuestions; i++) {
      const s = statuses[i] || 'not-visited';
      if (s === 'answered') c.answered++;
      else if (s === 'not-answered') c.notAnswered++;
      else if (s === 'not-visited') c.notVisited++;
      else if (s === 'marked-review') c.markedReview++;
      else if (s === 'answered-marked-review') c.answeredMarkedReview++;
    }
    return c;
  }, [statuses, totalQuestions]);

  // Update active section when current question changes
  useEffect(() => {
    if (paletteFilter === 'all') {
      const sec = Math.floor((currentQuestionId - 1) / 100);
      setActiveSection(sec);
    }
  }, [currentQuestionId, paletteFilter]);

  // Scroll active button into view if needed
  useEffect(() => {
    if (activeBtnRef.current) {
      activeBtnRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'nearest',
      });
    }
  }, [currentQuestionId, paletteFilter]);

  const handleJump = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseInt(jumpInput, 10);
    if (!isNaN(val) && val >= 1 && val <= totalQuestions) {
      setPaletteFilter('all');
      onSelectQuestion(val);
      setJumpInput('');
    }
  };

  const getStatusStyles = (status: QuestionStatus, isCurrent: boolean) => {
    let base = 'relative text-xs font-semibold rounded flex items-center justify-center transition-all h-8 sm:h-9 cursor-pointer';
    
    if (status === 'answered') {
      base += ' bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs';
    } else if (status === 'not-answered') {
      base += ' bg-rose-600 hover:bg-rose-700 text-white shadow-xs';
    } else if (status === 'marked-review') {
      base += ' bg-purple-600 hover:bg-purple-700 text-white shadow-xs';
    } else if (status === 'answered-marked-review') {
      base += ' bg-purple-700 hover:bg-purple-800 text-white shadow-xs';
    } else {
      base += ' bg-slate-200 hover:bg-slate-300 text-slate-700';
    }

    if (isCurrent) {
      base += ' ring-2 ring-yellow-400 ring-offset-2 scale-105 z-10 font-bold';
    }

    return base;
  };

  const sections = [
    { label: '1 - 100', start: 1, end: 100 },
    { label: '101 - 200', start: 101, end: 200 },
    { label: '201 - 300', start: 201, end: 300 },
    { label: '301 - 400', start: 301, end: 400 },
    { label: '401 - 500', start: 401, end: 500 },
    { label: '501 - 595', start: 501, end: 595 },
  ];

  // Filtered question numbers
  const displayNumbers = useMemo(() => {
    if (paletteFilter === 'all') {
      const currentRange = sections[activeSection] || sections[0];
      const nums: number[] = [];
      for (let i = currentRange.start; i <= currentRange.end; i++) {
        nums.push(i);
      }
      return nums;
    }

    const filtered: number[] = [];
    for (let i = 1; i <= totalQuestions; i++) {
      const s = statuses[i] || 'not-visited';
      if (paletteFilter === 'answered' && s === 'answered') filtered.push(i);
      else if (paletteFilter === 'not-answered' && s === 'not-answered') filtered.push(i);
      else if (paletteFilter === 'not-visited' && s === 'not-visited') filtered.push(i);
      else if (paletteFilter === 'marked' && (s === 'marked-review' || s === 'answered-marked-review')) filtered.push(i);
    }
    return filtered;
  }, [paletteFilter, activeSection, statuses, totalQuestions]);

  return (
    <aside
      className={`fixed inset-y-0 right-0 z-30 w-80 bg-white border-l border-slate-200 shadow-xl lg:shadow-none lg:static lg:w-80 flex flex-col h-full transform transition-transform duration-300 ease-in-out ${
        isOpenMobile ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'
      }`}
    >
      {/* Header of Palette */}
      <div className="p-3 bg-slate-100 border-b border-slate-200 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <h2 className="font-bold text-sm text-slate-800">
            Question Palette (595)
          </h2>
          {paletteFilter !== 'all' && (
            <span className="text-[10px] bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded font-bold uppercase">
              Filtered ({displayNumbers.length})
            </span>
          )}
        </div>
        <button
          onClick={onCloseMobile}
          className="lg:hidden text-xs text-slate-500 hover:text-slate-800 px-2 py-1 rounded bg-white border border-slate-300"
        >
          Close
        </button>
      </div>

      {/* Interactive Legend Area with Clickable Filters */}
      <div className="p-2.5 bg-slate-50 border-b border-slate-200 text-[11px] space-y-1.5">
        <div className="flex items-center justify-between text-[10px] uppercase font-bold text-slate-600 px-0.5">
          <span>Click status to filter:</span>
          {paletteFilter !== 'all' && (
            <button
              onClick={() => setPaletteFilter('all')}
              className="text-blue-600 hover:underline flex items-center gap-0.5"
            >
              <RotateCcw className="w-2.5 h-2.5" />
              Reset Filter
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 gap-1.5">
          <button
            type="button"
            onClick={() => setPaletteFilter(paletteFilter === 'answered' ? 'all' : 'answered')}
            className={`flex items-center gap-2 p-1.5 rounded border text-left transition-all ${
              paletteFilter === 'answered' ? 'bg-emerald-100 border-emerald-500 font-bold' : 'bg-white border-slate-200 hover:bg-slate-100'
            }`}
          >
            <span className="w-5 h-5 rounded bg-emerald-600 text-white font-bold flex items-center justify-center text-[10px] flex-shrink-0">
              {counts.answered}
            </span>
            <span className="text-slate-700 truncate">Answered</span>
          </button>

          <button
            type="button"
            onClick={() => setPaletteFilter(paletteFilter === 'not-answered' ? 'all' : 'not-answered')}
            className={`flex items-center gap-2 p-1.5 rounded border text-left transition-all ${
              paletteFilter === 'not-answered' ? 'bg-rose-100 border-rose-500 font-bold' : 'bg-white border-slate-200 hover:bg-slate-100'
            }`}
          >
            <span className="w-5 h-5 rounded bg-rose-600 text-white font-bold flex items-center justify-center text-[10px] flex-shrink-0">
              {counts.notAnswered}
            </span>
            <span className="text-slate-700 truncate">Not Answered</span>
          </button>

          <button
            type="button"
            onClick={() => setPaletteFilter(paletteFilter === 'not-visited' ? 'all' : 'not-visited')}
            className={`flex items-center gap-2 p-1.5 rounded border text-left transition-all ${
              paletteFilter === 'not-visited' ? 'bg-slate-300 border-slate-500 font-bold' : 'bg-white border-slate-200 hover:bg-slate-100'
            }`}
          >
            <span className="w-5 h-5 rounded bg-slate-200 text-slate-700 font-bold flex items-center justify-center text-[10px] flex-shrink-0">
              {counts.notVisited}
            </span>
            <span className="text-slate-700 truncate">Not Visited</span>
          </button>

          <button
            type="button"
            onClick={() => setPaletteFilter(paletteFilter === 'marked' ? 'all' : 'marked')}
            className={`flex items-center gap-2 p-1.5 rounded border text-left transition-all ${
              paletteFilter === 'marked' ? 'bg-purple-100 border-purple-500 font-bold' : 'bg-white border-slate-200 hover:bg-slate-100'
            }`}
          >
            <span className="relative w-5 h-5 rounded bg-purple-600 text-white font-bold flex items-center justify-center text-[10px] flex-shrink-0">
              {counts.markedReview + counts.answeredMarkedReview}
              {counts.answeredMarkedReview > 0 && (
                <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-400 border border-white"></span>
              )}
            </span>
            <span className="text-slate-700 truncate">Review ({counts.markedReview + counts.answeredMarkedReview})</span>
          </button>
        </div>
      </div>

      {/* Quick Jump & Section Tabs */}
      <div className="p-2.5 border-b border-slate-200 bg-white space-y-2">
        {/* Jump Form */}
        <form onSubmit={handleJump} className="flex gap-1.5">
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="number"
              min={1}
              max={totalQuestions}
              placeholder="Jump Q# (1-595)"
              value={jumpInput}
              onChange={(e) => setJumpInput(e.target.value)}
              className="w-full pl-8 pr-2 py-1 text-xs border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            className="px-2.5 py-1 text-xs font-semibold bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Go
          </button>
        </form>

        {/* Section Tabs: 1-100, 101-200, etc. (active only when paletteFilter === 'all') */}
        {paletteFilter === 'all' ? (
          <div className="grid grid-cols-3 gap-1">
            {sections.map((sec, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setActiveSection(idx)}
                className={`py-1 text-[11px] font-medium rounded transition-colors ${
                  activeSection === idx
                    ? 'bg-blue-600 text-white font-semibold shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                {sec.label}
              </button>
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-between text-xs text-slate-600 px-1 py-0.5 bg-blue-50/70 rounded border border-blue-200">
            <span className="font-semibold text-blue-900 capitalize">
              {paletteFilter.replace('-', ' ')} Questions ({displayNumbers.length})
            </span>
            <button
              onClick={() => setPaletteFilter('all')}
              className="text-xs text-blue-600 hover:underline font-bold"
            >
              Show All
            </button>
          </div>
        )}
      </div>

      {/* Question Number Buttons Grid */}
      <div className="flex-1 p-3 overflow-y-auto">
        <div className="text-[11px] text-slate-500 mb-2 font-medium flex justify-between">
          <span>
            {paletteFilter === 'all'
              ? `Questions ${sections[activeSection]?.start || 1} – ${sections[activeSection]?.end || 100}`
              : `Showing ${displayNumbers.length} matching questions`}
          </span>
          <span className="font-bold text-blue-600">Active: Q{currentQuestionId}</span>
        </div>

        {displayNumbers.length === 0 ? (
          <div className="text-center py-8 text-xs text-slate-400">
            No questions with status "{paletteFilter}"
          </div>
        ) : (
          <div className="grid grid-cols-5 gap-1.5 sm:gap-2">
            {displayNumbers.map((num) => {
              const status = statuses[num] || 'not-visited';
              const isCurrent = num === currentQuestionId;
              return (
                <button
                  key={num}
                  type="button"
                  ref={isCurrent ? activeBtnRef : null}
                  onClick={() => {
                    onSelectQuestion(num);
                    if (window.innerWidth < 1024) onCloseMobile();
                  }}
                  className={getStatusStyles(status, isCurrent)}
                >
                  {num}
                  {status === 'answered-marked-review' && (
                    <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-400 border border-white"></span>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Bottom Summary Bar */}
      <div className="p-2.5 bg-slate-100 border-t border-slate-200 text-center text-xs text-slate-600 font-medium">
        Total Questions: <strong className="text-slate-800">{totalQuestions}</strong>
      </div>
    </aside>
  );
};
