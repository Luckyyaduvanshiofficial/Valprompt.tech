# Velprompt - Prompt Engineering Ecosystem

Velprompt is a premium, full-stack application designed to help you engineer, manage, and test precision AI prompts. Built with an enterprise-grade technical stack and a meticulously crafted "Big Tech" aesthetic, it bridges the gap between raw LLM outputs and structured, reliable automation.

## Project Architecture

Currently, Velprompt operates as a monorepo containing:

1.  **Frontend (`/frontend`)**: A Next.js 14 App Router application powered by React 18, Tailwind CSS v4, styling components by shadcn/ui, and Lucide React icons.
2.  **Backend (`/backend`)**: A rigid Django 5.x REST Framework ecosystem interacting flawlessly with Supabase Postgres and the official Google GenAI SDK.

## Key Features

-   **Deep Integration with Gemini**: Leverages `gemini-2.5-flash` natively to optimize logic and construct pristine, template-ready prompt chains.
-   **Variables Management**: Input dynamically injected context logic directly through isolated UI elements.
-   **Prompt History**: View recent generations managed directly on the client side with `swr` for optimistic UI updates.
-   **Test EnvironmentModal**: Instantly test run prompt structures against the exact Google models before saving.

## Global Design System

Velprompt adheres strictly to a custom "Deep Navy / True Blue" enterprise aesthetic designed for minimal distraction and intense visual clarity. 

For future development (Dashboards, Route Additions, Auth integrations), you _must_ adhere to the design decisions explicitly documented in `THEME_GUIDELINES.md`. This theme overrides the default Tailwind scheme.

*Note: In future roadmaps, User Auth, persistent DB integrations, and a Dashboard interface will be added, keeping the exact same premium theme.*

## Prerequisites
- Node.js 18.x or greater
- Python 3.10.x or greater
- Supabase Postgres connection

## Setup

First, configure your secrets. Place a `.env` in the root of the `/backend` folder:
```
SECRET_KEY=...
DEBUG=True
DATABASE_URL=postgresql://...
GEMINI_API_KEY=...
```

**Running the Backend**
```bash
cd backend
python -m venv venv
# On Windows
venv\Scripts\activate
# On Mac/Linux
source venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver 8000
```

**Running the Frontend**
```bash
cd frontend
npm install
npm run dev # Starts on http://localhost:3000
```

> Built continuously by Antigravity in 2026.
