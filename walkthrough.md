# 🧠 Prompt Generator System — Technical Walkthrough

This document outlines the complete refactor of the **Velprompt** platform from a single-pass generator into a multi-stage intelligence pipeline.

---

## 🛠️ Backend: The Intelligence Pipeline

The backend has been refactored from a monolithic `METAPROMPT` approach into a structured pipeline located in `backend/api/pipeline.py`.

### 1. Multi-Stage Orchestration
The pipeline now follows these distinct steps for every request:
1.  **🔍 Task Analysis**: Uses an LLM pass (`temperature=0.2`) to extract structured metadata: Goal, Audience, Tone, Format, and Constraints.
2.  **🏷️ Task Classification**: Categorizes the user's intent into `blog`, `coding`, `agent`, or `general` for strategy selection.
3.  **📝 Context Enhancement**: Rebuilds the user's prompt by combining raw input with the structured analysis to provide "deep context."
4.  **🎯 Strategy Selection**: Dynamically selects a specialized prompt template from `backend/api/strategies.py`. This ensures high performance for specific domains (e.g., Python code vs. SEO blogs).
5.  **⚡ Pass 1: Generation**: Generates the first draft of the refined prompt.
6.  **🔧 Pass 2: Improvement**: Automatically reviews the draft for clarity and robustness, performing a second "polishing" pass.
7.  **📊 Quality Scoring**: Evaluates the output against 5 criteria (Clarity, Completeness, Structure, Specificity, Robustness) on a 1-10 scale.
8.  **🔄 Auto-Improvement**: If the score is below 8/10, the system automatically triggers a re-generation loop (up to 2 attempts) to guarantee high quality.

### 2. Specialized Strategies
Replaced the old 900-line metaprompt with targeted templates:
- `DEV_PROMPT`: Optimized for code generation and technical architecture.
- `BLOG_PROMPT`: Optimized for SEO, reader engagement, and readability.
- `AGENT_PROMPT`: Optimized for LLM agent reasoning (Chain of Thought).
- `GENERAL_PROMPT`: Versatile template for miscellaneous tasks.

### 3. API & Infrastructure
- **Throttling**: Added DRF Throttling to prevent abuse (5/min burst, 30/hr sustained).
- **Caching**: Implemented SHA-256 based response caching (1-hour TTL) using Django's cache framework.
- **Feedback Loop**: Added a new `/api/v1/history/<id>/feedback/` endpoint and DB fields (`user_rating`, `user_feedback`) to allow continuous improvement based on user data.

---

## 🎨 Frontend: Pipeline Visualization

The frontend was updated to provide visibility into the backend's internal reasoning.

### 1. New UI Components
- **`PipelineProgress`**: An animated stage-tracker that shows the user exactly where the pipeline is (e.g., "Analyzing task...", "Scoring quality...").
- **`PipelineResult`**: A multi-tabbed results component:
    - **Final Tab**: The optimized, production-ready prompt.
    - **Improved Tab**: The version after the polishing pass.
    - **Draft Tab**: The initial internal generation.
    - **Score Badge**: Real-time display of the 1-10 quality score.
    - **Analysis Tray**: A collapsible section showing the Goal, Audience, and Constraints extracted by the LLM.
- **Feedback UI**: Integrated a star-rating system at the bottom of the result to track user satisfaction.

### 2. Architecture & Performance
- **TypeScript Strictness**: Updated `types/api.ts` to fully mirror the new backend response shape (zero `any` usage).
- **API Client**: Implemented a robust `lib/api.ts` with a 2-minute timeout (required for the multi-step LLM pipeline) and global error handling.
- **Utility Layer**: Added `lib/utils.ts` for clean Tailwind styling using `twMerge`.
- **Sidebar**: Enhanced with task-specific icons (Coding icon, Blog icon) and inline quality scores for recent history entries.

---

## ⚙️ Configuration & Running

### Environment Setup
A `.env` file was created in `backend/` with:
```env
GEMINI_API_KEY=AIzaSy...
GEMINI_MODEL=gemini-3.1-flash-lite-preview
```

### To Run
1. **Backend**: 
   ```bash
   cd backend
   python manage.py runserver
   ```
2. **Frontend**:
   ```bash
   cd frontend
   pnpm dev
   ```

The system now delivers significantly higher consistency and allows users to inspect *why* a prompt was generated in a specific way.
