import React, { useState, useMemo } from 'react';
import { 
  Question, UserResponses, QuestionStatuses 
} from '../types';
import { 
  Search, CheckCircle2, XCircle, HelpCircle, Bookmark, 
  ChevronDown, ChevronUp, ChevronsUpDown, ArrowUp, Check, X,
  Printer, Download, Type
} from 'lucide-react';

interface QuestionReviewListProps {
  questions: Question[];
  responses: UserResponses;
  statuses: QuestionStatuses;
  fontSize?: 'normal' | 'large' | 'xlarge';
  onFontSizeChange?: (size: 'normal' | 'large' | 'xlarge') => void;
}

type FilterType = 'all' | 'correct' | 'incorrect' | 'unattempted' | 'marked';

export const QuestionReviewList: React.FC<QuestionReviewListProps> = ({
  questions,
  responses,
  statuses,
  fontSize = 'large',
  onFontSizeChange,
}) => {
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [jumpInput, setJumpInput] = useState('');
  const [collapsedExplanations, setCollapsedExplanations] = useState<{ [id: number]: boolean }>({});
  const [allCollapsed, setAllCollapsed] = useState(false);
  const [pageSize, setPageSize] = useState<number>(50);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [localFontSize, setLocalFontSize] = useState<'normal' | 'large' | 'xlarge'>(fontSize);

  const activeFontSize = onFontSizeChange ? fontSize : localFontSize;
  const setSize = onFontSizeChange || setLocalFontSize;

  // Filter counts
  const counts = useMemo(() => {
    let correct = 0;
    let incorrect = 0;
    let unattempted = 0;
    let marked = 0;

    questions.forEach((q) => {
      const userAns = responses[q.id];
      const s = statuses[q.id];
      if (s === 'marked-review' || s === 'answered-marked-review') {
        marked++;
      }
      if (!userAns) {
        unattempted++;
      } else if (userAns === q.correctAnswer) {
        correct++;
      } else {
        incorrect++;
      }
    });

    return { all: questions.length, correct, incorrect, unattempted, marked };
  }, [questions, responses, statuses]);

  // Filtered Questions
  const filteredQuestions = useMemo(() => {
    return questions.filter((q) => {
      const userAns = responses[q.id];
      const s = statuses[q.id];

      // Tab filter
      if (activeFilter === 'correct' && userAns !== q.correctAnswer) return false;
      if (activeFilter === 'incorrect' && (!userAns || userAns === q.correctAnswer)) return false;
      if (activeFilter === 'unattempted' && userAns !== undefined) return false;
      if (activeFilter === 'marked' && s !== 'marked-review' && s !== 'answered-marked-review') return false;

      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesId = q.id.toString() === query || `q${q.id}` === query;
        const matchesText = q.question.toLowerCase().includes(query);
        const matchesExplanation = q.explanation.toLowerCase().includes(query);
        const matchesOptions = q.options.some((o) => o.text.toLowerCase().includes(query));

        if (!matchesId && !matchesText && !matchesExplanation && !matchesOptions) {
          return false;
        }
      }

      return true;
    });
  }, [questions, responses, statuses, activeFilter, searchQuery]);

  // Pagination
  const totalPages = pageSize === -1 ? 1 : Math.ceil(filteredQuestions.length / pageSize);
  const paginatedQuestions = useMemo(() => {
    if (pageSize === -1) return filteredQuestions;
    const start = (currentPage - 1) * pageSize;
    return filteredQuestions.slice(start, start + pageSize);
  }, [filteredQuestions, currentPage, pageSize]);

  // Handle jump
  const handleJump = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseInt(jumpInput, 10);
    if (!isNaN(val) && val >= 1 && val <= questions.length) {
      setActiveFilter('all');
      setSearchQuery('');
      
      if (pageSize !== -1) {
        const page = Math.ceil(val / pageSize);
        setCurrentPage(page);
      }
      
      setTimeout(() => {
        const el = document.getElementById(`review-question-${val}`);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          el.classList.add('ring-4', 'ring-blue-500');
          setTimeout(() => el.classList.remove('ring-4', 'ring-blue-500'), 2500);
        }
      }, 100);
      setJumpInput('');
    }
  };

  const toggleExplanation = (id: number) => {
    setCollapsedExplanations((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const toggleAllExplanations = () => {
    const newState = !allCollapsed;
    setAllCollapsed(newState);
    const updated: { [id: number]: boolean } = {};
    questions.forEach((q) => {
      updated[q.id] = newState;
    });
    setCollapsedExplanations(updated);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // PDF Print / Download Handler
  const handlePrintPDF = () => {
    // 1. Expand all explanations
    setAllCollapsed(false);
    setCollapsedExplanations({});
    // 2. Set to show all questions
    setPageSize(-1);
    
    // 3. Trigger native print dialog which lets the user "Save as PDF"
    setTimeout(() => {
      window.print();
    }, 400);
  };

  // Export Offline HTML File
  const handleDownloadHTML = () => {
    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>June 2026 Current Affairs – Complete Response Sheet (595 Questions)</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif; padding: 25px; color: #0f172a; line-height: 1.6; max-width: 900px; margin: 0 auto; background: #f8fafc; }
    .header { background: #1e293b; color: white; padding: 24px; border-radius: 12px; margin-bottom: 24px; }
    .stats { display: flex; gap: 20px; font-weight: bold; margin-top: 10px; font-size: 15px; }
    .card { background: white; border: 1.5px solid #cbd5e1; border-radius: 12px; padding: 20px; margin-bottom: 24px; page-break-inside: avoid; }
    .q-title { font-size: 19px; font-weight: 700; color: #0f172a; margin-bottom: 14px; }
    .option { padding: 10px 14px; margin: 6px 0; border-radius: 8px; border: 1px solid #e2e8f0; font-size: 16px; }
    .correct-opt { background: #dcfce7; border-color: #22c55e; font-weight: 600; color: #14532d; }
    .user-incorrect { background: #fee2e2; border-color: #ef4444; font-weight: 600; color: #7f1d1d; }
    .summary-badge { padding: 8px 12px; border-radius: 6px; font-size: 14px; font-weight: bold; margin: 12px 0; display: inline-block; }
    .exp-box { background: #f0fdf4; border: 1.5px solid #bbf7d0; border-radius: 10px; padding: 18px; margin-top: 16px; }
    .exp-title { font-size: 16px; font-weight: 800; color: #166534; margin-bottom: 10px; text-transform: uppercase; }
    .exp-text { font-size: 16px; color: #1e293b; line-height: 1.7; white-space: pre-line; }
  </style>
</head>
<body>
  <div class="header">
    <h1>June 2026 Current Affairs – Complete Response Sheet & Answer Key</h1>
    <p>Comprehensive 595 Questions Examination Review</p>
    <div class="stats">
      <span>Total Questions: ${questions.length}</span> |
      <span>Attempted: ${counts.correct + counts.incorrect}</span> |
      <span>Correct: ${counts.correct}</span> |
      <span>Incorrect: ${counts.incorrect}</span> |
      <span>Accuracy: ${((counts.correct / Math.max(1, counts.correct + counts.incorrect)) * 100).toFixed(1)}%</span>
    </div>
  </div>
  ${questions.map((q) => {
    const userAns = responses[q.id];
    const isCorrect = userAns === q.correctAnswer;
    return `
    <div class="card">
      <div class="q-title">Q${q.id}. ${q.question.replace(/\n/g, '<br/>')}</div>
      <div class="options">
        ${q.options.map((opt) => {
          let cls = 'option';
          if (opt.key === q.correctAnswer) cls += ' correct-opt';
          else if (opt.key === userAns && !isCorrect) cls += ' user-incorrect';
          return `<div class="${cls}"><strong>${opt.key}.</strong> ${opt.text} ${opt.key === q.correctAnswer ? '✓ (Correct Answer)' : ''} ${opt.key === userAns ? '← (Your Selection)' : ''}</div>`;
        }).join('')}
      </div>
      <div class="summary-badge" style="background: ${isCorrect ? '#dcfce7; color: #15803d;' : userAns ? '#fee2e2; color: #b91c1c;' : '#f1f5f9; color: #475569;'}">
        Status: ${isCorrect ? 'Correct (+1)' : userAns ? 'Incorrect (0)' : 'Not Attempted'} | Correct: Option ${q.correctAnswer} | Your Answer: Option ${userAns || 'None'}
      </div>
      <div class="exp-box">
        <div class="exp-title">Explanation & Source Facts:</div>
        <div class="exp-text">${q.explanation.replace(/\n/g, '<br/>')}</div>
      </div>
    </div>
    `;
  }).join('')}
</body>
</html>
    `;

    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `June_2026_Current_Affairs_595_Response_Sheet.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Typography scale classes based on activeFontSize
  const fontConfig = {
    normal: {
      question: 'text-base sm:text-lg font-bold',
      options: 'text-sm sm:text-base',
      explanationHeading: 'text-sm sm:text-base font-bold',
      explanationBody: 'text-sm sm:text-base leading-relaxed',
      summary: 'text-xs sm:text-sm',
    },
    large: { // default large
      question: 'text-lg sm:text-xl lg:text-2xl font-bold leading-relaxed',
      options: 'text-base sm:text-lg lg:text-xl',
      explanationHeading: 'text-base sm:text-lg font-extrabold',
      explanationBody: 'text-base sm:text-lg lg:text-xl leading-relaxed text-slate-900',
      summary: 'text-sm sm:text-base',
    },
    xlarge: { // extra large for maximum readability
      question: 'text-xl sm:text-2xl lg:text-3xl font-extrabold leading-loose text-slate-950',
      options: 'text-lg sm:text-xl lg:text-2xl',
      explanationHeading: 'text-lg sm:text-xl font-black',
      explanationBody: 'text-lg sm:text-xl lg:text-2xl leading-loose font-normal text-slate-950',
      summary: 'text-base sm:text-lg',
    },
  }[activeFontSize];

  return (
    <div id="review-section" className="space-y-6">
      
      {/* Printable Header (Visible only when generating PDF via window.print) */}
      <div className="print-only-header hidden">
        <h1 className="text-2xl font-bold text-slate-900">
          June 2026 Current Affairs – Complete Examination Response Sheet
        </h1>
        <p className="text-sm text-slate-600 mt-1">
          Full 595 Questions Practice Exam | Official Solutions and Detailed Explanations
        </p>
        <div className="mt-3 text-xs text-slate-700 flex flex-wrap gap-4 border-t border-slate-300 pt-2 font-semibold">
          <span>Total Questions: <strong>{questions.length}</strong></span>
          <span>Attempted: <strong>{counts.correct + counts.incorrect}</strong></span>
          <span>Correct: <strong className="text-emerald-700">{counts.correct}</strong></span>
          <span>Incorrect: <strong className="text-rose-700">{counts.incorrect}</strong></span>
          <span>Score: <strong>{counts.correct} / {questions.length}</strong></span>
          <span>Accuracy: <strong>{((counts.correct / Math.max(1, counts.correct + counts.incorrect)) * 100).toFixed(1)}%</strong></span>
        </div>
      </div>

      {/* Review Control & Filter Bar (Web-only) */}
      <div className="bg-white rounded-2xl shadow-md border border-slate-200 p-4 sm:p-6 sticky top-14 z-30 space-y-4 no-print">
        
        {/* Title, Font Size Adjuster & PDF Download Row */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 flex items-center gap-2.5">
              <span>Detailed Question-Wise Solution Review</span>
              <span className="text-xs px-2.5 py-1 rounded-full bg-blue-100 text-blue-900 font-bold border border-blue-200">
                {filteredQuestions.length} Questions
              </span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 font-medium">
              High-readability answer sheet with bold typography and complete source explanations.
            </p>
          </div>

          {/* Action Tools: Font Size Toggle + PDF Download */}
          <div className="flex flex-wrap items-center gap-2.5 self-start lg:self-auto">
            
            {/* Font Size Selector */}
            <div className="flex items-center bg-slate-100 border border-slate-300 rounded-lg p-0.5" title="Adjust Text Size for Easier Reading">
              <span className="px-2 text-xs font-semibold text-slate-600 flex items-center gap-1">
                <Type className="w-3.5 h-3.5" />
                <span>Text:</span>
              </span>
              <button
                type="button"
                onClick={() => setSize('normal')}
                className={`px-2.5 py-1 rounded text-xs font-bold transition-colors ${
                  activeFontSize === 'normal' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                A
              </button>
              <button
                type="button"
                onClick={() => setSize('large')}
                className={`px-2.5 py-1 rounded text-sm font-bold transition-colors ${
                  activeFontSize === 'large' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                A+
              </button>
              <button
                type="button"
                onClick={() => setSize('xlarge')}
                className={`px-2.5 py-1 rounded text-base font-extrabold transition-colors ${
                  activeFontSize === 'xlarge' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                A++
              </button>
            </div>

            {/* Download PDF / Print Button */}
            <button
              type="button"
              onClick={handlePrintPDF}
              className="px-3.5 py-2 rounded-lg bg-gradient-to-r from-blue-700 to-indigo-700 hover:from-blue-600 hover:to-indigo-600 text-white text-xs sm:text-sm font-bold flex items-center gap-2 shadow-sm transition-all cursor-pointer active:scale-95"
              title="Print or Save Response Sheet with Explanations as a PDF"
            >
              <Printer className="w-4 h-4" />
              <span>Download PDF Response Sheet</span>
            </button>

            {/* Offline HTML Backup */}
            <button
              type="button"
              onClick={handleDownloadHTML}
              className="px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-700 text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Save a standalone HTML file of all 595 questions and explanations"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Export HTML</span>
            </button>

            {/* Collapse/Expand Toggle */}
            <button
              type="button"
              onClick={toggleAllExplanations}
              className="px-3 py-2 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-xs sm:text-sm font-semibold text-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <ChevronsUpDown className="w-4 h-4" />
              <span>{allCollapsed ? 'Expand All' : 'Collapse All'}</span>
            </button>

          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => { setActiveFilter('all'); setCurrentPage(1); }}
            className={`px-3.5 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeFilter === 'all'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
            }`}
          >
            <span>All Questions</span>
            <span className="px-2 py-0.5 rounded-full bg-black/20 text-xs">{counts.all}</span>
          </button>

          <button
            onClick={() => { setActiveFilter('correct'); setCurrentPage(1); }}
            className={`px-3.5 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeFilter === 'correct'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Correct</span>
            <span className="px-2 py-0.5 rounded-full bg-black/20 text-xs">{counts.correct}</span>
          </button>

          <button
            onClick={() => { setActiveFilter('incorrect'); setCurrentPage(1); }}
            className={`px-3.5 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeFilter === 'incorrect'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'bg-rose-50 text-rose-800 hover:bg-rose-100 border border-rose-200'
            }`}
          >
            <XCircle className="w-4 h-4" />
            <span>Incorrect</span>
            <span className="px-2 py-0.5 rounded-full bg-black/20 text-xs">{counts.incorrect}</span>
          </button>

          <button
            onClick={() => { setActiveFilter('unattempted'); setCurrentPage(1); }}
            className={`px-3.5 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeFilter === 'unattempted'
                ? 'bg-slate-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            <span>Unattempted</span>
            <span className="px-2 py-0.5 rounded-full bg-black/20 text-xs">{counts.unattempted}</span>
          </button>

          <button
            onClick={() => { setActiveFilter('marked'); setCurrentPage(1); }}
            className={`px-3.5 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeFilter === 'marked'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'bg-purple-50 text-purple-800 hover:bg-purple-100 border border-purple-200'
            }`}
          >
            <Bookmark className="w-4 h-4" />
            <span>Marked for Review</span>
            <span className="px-2 py-0.5 rounded-full bg-black/20 text-xs">{counts.marked}</span>
          </button>
        </div>

        {/* Search, Jump and Page size controls */}
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-1">
          {/* Search Input */}
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by keywords, topic, central bank, scheme, or Q#..."
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              className="w-full pl-10 pr-4 py-2.5 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50/70"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            )}
          </div>

          {/* Jump To Question */}
          <form onSubmit={handleJump} className="flex items-center gap-1.5 w-full sm:w-auto">
            <input
              type="number"
              min={1}
              max={questions.length}
              placeholder="Jump Q# (1-595)"
              value={jumpInput}
              onChange={(e) => setJumpInput(e.target.value)}
              className="w-36 px-3 py-2.5 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="px-4 py-2.5 text-sm font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors whitespace-nowrap cursor-pointer"
            >
              Jump
            </button>
          </form>

          {/* Page size selector */}
          <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-600 self-end sm:self-auto">
            <span className="font-medium">Show:</span>
            <select
              value={pageSize}
              onChange={(e) => { setPageSize(Number(e.target.value)); setCurrentPage(1); }}
              className="border border-slate-300 rounded-xl px-3 py-2 text-xs sm:text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
            >
              <option value={25}>25 questions</option>
              <option value={50}>50 questions</option>
              <option value={100}>100 questions</option>
              <option value={-1}>All 595 Questions</option>
            </select>
          </div>
        </div>

      </div>

      {/* Pagination Bar (Top) */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between text-sm bg-white p-3.5 rounded-xl border border-slate-200 no-print">
          <span className="text-slate-600 font-medium">
            Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong> ({filteredQuestions.length} questions)
          </span>
          <div className="flex items-center gap-2">
            <button
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="px-3.5 py-1.5 rounded-lg border border-slate-300 disabled:opacity-40 hover:bg-slate-50 font-semibold text-xs sm:text-sm cursor-pointer"
            >
              Prev
            </button>
            <button
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="px-3.5 py-1.5 rounded-lg bg-blue-600 text-white disabled:opacity-40 hover:bg-blue-700 font-semibold text-xs sm:text-sm cursor-pointer"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Question Cards List */}
      <div className="space-y-8">
        {paginatedQuestions.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-500 space-y-3 no-print">
            <HelpCircle className="w-12 h-12 text-slate-400 mx-auto" />
            <h4 className="text-lg font-bold text-slate-800">No questions found matching your filter</h4>
            <p className="text-sm text-slate-500 max-w-sm mx-auto">
              Try selecting a different filter tab or clearing your search term.
            </p>
            <button
              onClick={() => { setActiveFilter('all'); setSearchQuery(''); }}
              className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          paginatedQuestions.map((q) => {
            const userAns = responses[q.id];
            const isAnswered = userAns !== undefined;
            const isCorrect = userAns === q.correctAnswer;
            const s = statuses[q.id];
            const isMarked = s === 'marked-review' || s === 'answered-marked-review';
            const isExplanationCollapsed = collapsedExplanations[q.id] || false;

            // Border color depending on outcome
            let cardBorder = 'border-slate-300';
            let statusBadge = (
              <span className="px-3 py-1 rounded-full text-xs sm:text-sm font-bold bg-slate-100 text-slate-700 border border-slate-300 flex items-center gap-1.5">
                <HelpCircle className="w-4 h-4 text-slate-500" />
                Not Attempted
              </span>
            );

            if (isAnswered) {
              if (isCorrect) {
                cardBorder = 'border-emerald-400 ring-2 ring-emerald-100';
                statusBadge = (
                  <span className="px-3 py-1 rounded-full text-xs sm:text-sm font-bold bg-emerald-100 text-emerald-900 border border-emerald-300 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Correct (+1)
                  </span>
                );
              } else {
                cardBorder = 'border-rose-400 ring-2 ring-rose-100';
                statusBadge = (
                  <span className="px-3 py-1 rounded-full text-xs sm:text-sm font-bold bg-rose-100 text-rose-900 border border-rose-300 flex items-center gap-1.5">
                    <XCircle className="w-4 h-4 text-rose-600" />
                    Incorrect (0)
                  </span>
                );
              }
            }

            const paragraphs = q.question.split('\n\n').filter((p) => p.trim());
            const expParagraphs = q.explanation.split('\n\n').filter((p) => p.trim());

            return (
              <div
                key={q.id}
                id={`review-question-${q.id}`}
                className={`review-card bg-white rounded-2xl border ${cardBorder} shadow-sm overflow-hidden transition-all duration-200`}
              >
                {/* Question Header Bar */}
                <div className="bg-slate-50 border-b border-slate-200 px-5 sm:px-7 py-3.5 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="font-black text-slate-950 text-base sm:text-lg">
                      Question {q.id}
                    </span>
                    <span className="text-xs sm:text-sm text-slate-500 font-semibold">
                      of {questions.length}
                    </span>
                    {statusBadge}
                    {isMarked && (
                      <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-900 border border-purple-300 flex items-center gap-1">
                        <Bookmark className="w-3.5 h-3.5 fill-current text-purple-600" />
                        Marked for Review
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-3 text-xs sm:text-sm font-medium">
                    <span className="text-slate-700">
                      Correct Answer: <strong className="text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-md border border-emerald-300 font-extrabold text-sm sm:text-base">Option {q.correctAnswer}</strong>
                    </span>
                    {isAnswered && (
                      <span className="text-slate-700">
                        Your Answer: <strong className={`px-2.5 py-1 rounded-md border font-extrabold text-sm sm:text-base ${
                          isCorrect ? 'text-emerald-800 bg-emerald-100 border-emerald-300' : 'text-rose-800 bg-rose-100 border-rose-300'
                        }`}>Option {userAns}</strong>
                      </span>
                    )}
                  </div>
                </div>

                {/* Question Body */}
                <div className="p-5 sm:p-8 space-y-6">
                  
                  {/* Big Readable Question Text */}
                  <div className={`${fontConfig.question} text-slate-950 space-y-3`}>
                    {paragraphs.map((para, idx) => (
                      <p key={idx} className="whitespace-pre-line">
                        {para}
                      </p>
                    ))}
                  </div>

                  {/* Options List with Big Readable Text & High-Contrast Badges */}
                  <div className="space-y-3 pt-2">
                    <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                      Options & Evaluation:
                    </div>
                    {q.options.map((opt) => {
                      const isUserChoice = userAns === opt.key;
                      const isCorrectChoice = q.correctAnswer === opt.key;

                      let optStyles = 'border-slate-200 bg-white text-slate-800 hover:border-slate-300';
                      let badge = null;

                      if (isCorrectChoice && isUserChoice) {
                        optStyles = 'border-emerald-500 bg-emerald-50/90 text-emerald-950 font-bold ring-2 ring-emerald-400 shadow-xs';
                        badge = (
                          <span className="px-3 py-1 rounded-lg bg-emerald-600 text-white text-xs font-extrabold flex items-center gap-1.5 shadow-xs flex-shrink-0">
                            <Check className="w-4 h-4 stroke-[3]" /> Your Selection (Correct)
                          </span>
                        );
                      } else if (isCorrectChoice && !isUserChoice) {
                        optStyles = 'border-emerald-500 bg-emerald-50/80 text-emerald-950 font-bold ring-2 ring-emerald-400 shadow-xs';
                        badge = (
                          <span className="px-3 py-1 rounded-lg bg-emerald-600 text-white text-xs font-extrabold flex items-center gap-1.5 shadow-xs flex-shrink-0">
                            <Check className="w-4 h-4 stroke-[3]" /> Official Correct Option
                          </span>
                        );
                      } else if (isUserChoice && !isCorrectChoice) {
                        optStyles = 'border-rose-400 bg-rose-50/90 text-rose-950 font-bold ring-2 ring-rose-400 shadow-xs';
                        badge = (
                          <span className="px-3 py-1 rounded-lg bg-rose-600 text-white text-xs font-extrabold flex items-center gap-1.5 shadow-xs flex-shrink-0">
                            <X className="w-4 h-4 stroke-[3]" /> Your Selection (Incorrect)
                          </span>
                        );
                      }

                      return (
                        <div
                          key={opt.key}
                          className={`flex items-start justify-between gap-4 p-3.5 sm:p-4 rounded-xl border ${fontConfig.options} leading-relaxed transition-colors ${optStyles}`}
                        >
                          <div className="flex items-start gap-3">
                            <span className="font-extrabold w-7 sm:w-8 text-slate-800 flex-shrink-0">
                              {opt.key}.
                            </span>
                            <span className="text-slate-900">{opt.text}</span>
                          </div>
                          {badge && <div className="flex-shrink-0 mt-0.5">{badge}</div>}
                        </div>
                      );
                    })}
                  </div>

                  {/* Summary Status Strip */}
                  <div className={`p-4 rounded-xl border ${fontConfig.summary} flex flex-wrap items-center justify-between gap-3 ${
                    isCorrect
                      ? 'bg-emerald-50/80 border-emerald-300 text-emerald-950 font-semibold'
                      : isAnswered
                      ? 'bg-rose-50/80 border-rose-300 text-rose-950 font-semibold'
                      : 'bg-slate-100 border-slate-300 text-slate-800 font-semibold'
                  }`}>
                    <div className="flex flex-wrap items-center gap-3">
                      <span><strong>Result Status:</strong> {isCorrect ? 'Correct (+1.00)' : isAnswered ? 'Incorrect (0.00)' : 'Not Attempted'}</span>
                      <span>•</span>
                      <span><strong>Candidate Selected:</strong> Option {userAns || 'None'}</span>
                      <span>•</span>
                      <span><strong>Answer Key:</strong> Option {q.correctAnswer}</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => toggleExplanation(q.id)}
                      className="text-xs sm:text-sm font-bold text-blue-700 hover:text-blue-900 flex items-center gap-1.5 cursor-pointer no-print"
                    >
                      <span>{isExplanationCollapsed ? 'Expand Explanation' : 'Collapse Explanation'}</span>
                      {isExplanationCollapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
                    </button>
                  </div>

                  {/* Complete Solution & Detailed Explanation - Redesigned for Maximum Readability */}
                  {(!isExplanationCollapsed || typeof window !== 'undefined') && (
                    <div className={`print-explanation-box bg-gradient-to-b from-blue-50/40 via-white to-slate-50 rounded-2xl border-2 border-blue-200 p-5 sm:p-8 space-y-4 shadow-xs ${
                      isExplanationCollapsed ? 'hidden print:block' : 'block'
                    }`}>
                      <div className="flex items-center justify-between border-b-2 border-blue-200 pb-3">
                        <div className="font-black text-sm sm:text-base uppercase tracking-wide text-blue-900 flex items-center gap-2.5">
                          <span className="w-3 h-3 rounded-full bg-blue-600 ring-4 ring-blue-100"></span>
                          <span>Complete Solution & Source Explanation</span>
                        </div>
                        <span className="text-xs font-semibold text-blue-700 bg-blue-100/70 px-2.5 py-1 rounded-md border border-blue-200">
                          June 2026 Current Affairs
                        </span>
                      </div>

                      {/* Explanation Content with Big High-Contrast Text */}
                      <div className="space-y-4 pt-1">
                        {expParagraphs.map((para, pIdx) => {
                          const isHeading = anyHeading(para);
                          if (isHeading) {
                            return (
                              <div key={pIdx} className="pt-2">
                                <span className="inline-block px-3.5 py-1.5 rounded-lg bg-blue-700 text-white font-extrabold text-sm sm:text-base tracking-wide shadow-xs">
                                  {para}
                                </span>
                              </div>
                            );
                          }
                          return (
                            <p
                              key={pIdx}
                              className={`${fontConfig.explanationBody} whitespace-pre-line text-slate-900 leading-relaxed font-normal`}
                            >
                              {para}
                            </p>
                          );
                        })}
                      </div>
                    </div>
                  )}

                </div>

              </div>
            );
          })
        )}
      </div>

      {/* Pagination Bar (Bottom) */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between text-sm bg-white p-4 rounded-xl border border-slate-200 shadow-sm no-print">
          <span className="text-slate-600 font-medium">
            Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong> ({filteredQuestions.length} questions)
          </span>
          <div className="flex items-center gap-2">
            <button
              disabled={currentPage <= 1}
              onClick={() => { setCurrentPage((p) => Math.max(1, p - 1)); scrollToTop(); }}
              className="px-4 py-2 rounded-lg border border-slate-300 disabled:opacity-40 hover:bg-slate-50 font-bold text-xs sm:text-sm cursor-pointer"
            >
              Previous Page
            </button>
            <button
              disabled={currentPage >= totalPages}
              onClick={() => { setCurrentPage((p) => Math.min(totalPages, p + 1)); scrollToTop(); }}
              className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-40 font-bold text-xs sm:text-sm cursor-pointer"
            >
              Next Page
            </button>
          </div>
        </div>
      )}

      {/* Floating Scroll to Top button */}
      <div className="fixed bottom-6 right-6 z-40 no-print">
        <button
          onClick={scrollToTop}
          className="w-12 h-12 rounded-full bg-slate-900/90 hover:bg-slate-900 text-white shadow-xl flex items-center justify-center transition-all hover:scale-110 backdrop-blur-xs cursor-pointer"
          title="Scroll to Top"
        >
          <ArrowUp className="w-6 h-6" />
        </button>
      </div>

    </div>
  );
};

// Helper for bolding headings in explanation
function anyHeading(text: string): boolean {
  const headings = ['Short Explanation:', 'Detailed Explanation:', 'Key Points:', 'Key Highlights:', 'About ', 'Note:'];
  return headings.some((h) => text.startsWith(h)) || (text.endsWith(':') && text.length < 50);
}
