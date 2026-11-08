# June 2026 Current Affairs – Complete 595 Questions Examination Application

[![GitHub Repository](https://img.shields.io/badge/GitHub-Rishi2532%2Fjune--2026--current--affairs--quiz-blue?logo=github)](https://github.com/Rishi2532/june-2026-current-affairs-quiz)
[![Questions](https://img.shields.io/badge/Questions-595%2F595%20Verified-brightgreen)](#)
[![TypeScript](https://img.shields.io/badge/TypeScript-React%2018-blue?logo=typescript)](#)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-v3.4-38bdf8?logo=tailwindcss)](#)

A modern, responsive, high-performance web-based examination platform built strictly following SBI Clerk / IBPS banking online examination design standards, powered by all 595 questions, multiple-choice options, correct answers, and comprehensive explanations extracted directly from `june4quiz.pdf` (`junequiz.pdf`).

Repository: [https://github.com/Rishi2532/june-2026-current-affairs-quiz](https://github.com/Rishi2532/june-2026-current-affairs-quiz)

---

## 🌟 Highlights & Key Features

1. **Exact 595 Questions Extracted**:
   - 100% of questions (Questions 1 through 595) verified and preserved without omission, rewriting, or simplification.
   - All 5 options (A, B, C, D, E) preserved for every question.
   - All answer keys match the official PDF answer key.
   - Rich explanations (both Short and Detailed Explanations, Key Highlights, and Parent Body summaries) are preserved completely.

2. **SBI Clerk / IBPS Examination Interface**:
   - **Header Bar**: Live counters for Attempted, Remaining (Unattempted), and Marked for Review, real-time timer (with Practice Stopwatch mode or 180-minute countdown mode), and immediate Submit button.
   - **Question Screen**: Clean typography, statement-level formatting, custom radio option selectors, clear responses, and instant mark-for-review toggle.
   - **Keyboard Navigation Shortcuts**:
     - `1` - `5` or `A` - `E`: Select options
     - `N` or `Right Arrow`: Save & Next
     - `P` or `Left Arrow`: Previous Question
     - `M`: Toggle Mark for Review
     - `C`: Clear Response
   - **Full 595 Question Palette**:
     - Color-coded by IBPS standard:
       - **Grey**: Not Visited
       - **Red**: Visited but Not Answered
       - **Green**: Answered
       - **Purple**: Marked for Review
       - **Purple with Green Indicator**: Answered and Marked for Review (Evaluated)
     - Quick Jump directly to any question (1-595)
     - Fast Section Tabs (1-100, 101-200, 201-300, 301-400, 401-500, 501-595)

3. **Robust State Persistence & Auto-Save**:
   - Uses browser `localStorage` to continuously save selected answers, question statuses, active question, and elapsed time.
   - Accidental page refreshes or browser restarts seamlessly restore the exact in-progress test.

4. **Results Dashboard & Analytics**:
   - Overall Performance Cards (Total Questions: 595, Attempted, Correct, Incorrect, Unattempted, Accuracy %, Total Score, Percentage Score).
   - Interactive SVG Donut Chart showing Correct vs Incorrect vs Unattempted.
   - Optional Negative Marking toggle (Standard +1 / 0 vs Banking +1 / -0.25).
   - Performance evaluation badge.

5. **Mandatory Complete 595-Question Answer Review**:
   - Displays **all 595 questions** after submission.
   - For every question:
     - Question number & text
     - All 5 options with color-coded badges
     - User's selected option (or "Not Attempted")
     - Official correct answer
     - Outcome badge (Correct, Incorrect, Not Attempted)
     - Complete explanation from the PDF (never hidden for correct answers)
   - Real-time search by question keywords, topics, or question ID.
   - Filter tabs: All (595), Correct, Incorrect, Unattempted, Marked for Review.
   - Jump to any question with highlight animation.
   - Expand All / Collapse All explanations toggle.
   - **Enlarged High-Contrast Typography & Dynamic Font-Size Controls (`A`, `A+`, `A++`)**: Designed for maximum clarity and effortless reading of dense current affairs explanations.
   - **Styled Explanation Section Badges**: Visual separation for `Short Explanation:`, `Detailed Explanation:`, `Key Highlights:`, and `About [Body]:`.
   - **Download PDF Response Sheet**: 1-click clean export/print to PDF of the full response sheet with all questions, candidate selections, official answers, and explanations formatted without UI clutter.
   - **Offline HTML Export**: Save entire solutions review as an offline `.html` file.

---

## 🚀 Quick Start Guide

### 1. Run the Development Server
```bash
cd quiz-app
npm run dev
```
Open your browser at `http://localhost:5173/` (or the port displayed in your terminal).

### 2. Run the Production Preview
```bash
cd quiz-app
npm run preview
```
Open your browser at `http://localhost:4173/`.

### 3. Re-extract or Verify Dataset
If you ever want to re-run the extraction or verify dataset integrity:
```bash
# Re-extract all 595 questions from PDF to questions.json
python extract.py

# Run strict structural and semantic verification tests
python verify.py
```

---

## 📁 Project Architecture

```
guidel quiz/
├── junequiz.pdf                    # Original PDF source
├── june4quiz.pdf                   # PDF alias
├── extract.py                      # Python PDF extraction pipeline
├── verify.py                       # Automated verification test suite
├── questions.json                  # Clean JSON dataset of all 595 questions
├── README.md                       # Documentation
└── quiz-app/                       # React + TypeScript + Tailwind CSS application
    ├── src/
    │   ├── data/
    │   │   └── questions.json      # Embedded 595-question dataset
    │   ├── types/
    │   │   └── index.ts            # TypeScript interfaces & types
    │   ├── utils/
    │   │   └── storage.ts          # LocalStorage persistence manager
    │   ├── components/
    │   │   ├── Header.tsx          # Examination header with timer & counters
    │   │   ├── QuestionDisplay.tsx # Single question view with statement formatting
    │   │   ├── QuestionPalette.tsx # 595-button question navigation palette
    │   │   ├── NavigationButtons.tsx # Prev, Save & Next, Clear, Review buttons
    │   │   ├── SubmitModal.tsx     # Confirmation dialog before final lock
    │   │   ├── InstructionsPage.tsx # Pre-exam instructions & timer selection
    │   │   ├── ResultsDashboard.tsx # Analytics cards & SVG Donut Chart
    │   │   └── QuestionReviewList.tsx # Complete 595-question solution review
    │   ├── App.tsx                 # Main application coordinator
    │   ├── main.tsx                # Entry point
    │   └── index.css               # Tailwind CSS & custom scrollbar styles
    ├── package.json
    ├── tailwind.config.js
    └── vite.config.ts
```

