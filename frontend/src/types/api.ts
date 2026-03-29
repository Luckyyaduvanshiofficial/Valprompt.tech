/**
 * API Types for the Prompt Generator.
 *
 * Aligned with the backend pipeline response shape.
 */

/** Structured task analysis returned by the pipeline. */
export interface TaskAnalysis {
  goal: string;
  audience: string;
  tone: string;
  format: string;
  constraints: string[];
}

/** Detailed scoring breakdown from the evaluation system. */
export interface ScoreDetails {
  score: number;
  criteria?: {
    clarity?: number;
    completeness?: number;
    structure?: number;
    specificity?: number;
    robustness?: number;
  };
  feedback: string;
}

/** Full pipeline response from POST /api/v1/generate/ */
export interface PipelineResponse {
  id: number;
  task: string;
  task_type: string[];
  analysis: TaskAnalysis;
  draft: string;
  improved: string;
  final_prompt: string;
  variables: string[];
  score: number;
  score_details: ScoreDetails;
  version: number;
  tokens?: number;
  latency_ms?: number;
}

/** History entry from GET /api/v1/history/ (paginated) */
export interface PromptHistory {
  id: number;
  task: string;
  prompt: string;
  variables: string[];
  task_type: string[];
  analysis: TaskAnalysis;
  draft_prompt: string;
  score: number | null;
  score_details: ScoreDetails | Record<string, never>;
  version: number;
  is_improved: boolean;
  user_rating: number | null;
  user_feedback: string;
  tokens_used?: number | null;
  latency_ms?: number | null;
  created_at: string;
  updated_at: string;
}

/** Request body for POST /api/v1/generate/ */
export interface GenerateRequest {
  task: string;
  variables?: string[];
}

/** Legacy response shape (backward compat) */
export interface GenerateResponse {
  id: number;
  task: string;
  prompt: string;
  variables: string[];
}

/** Request body for POST /api/v1/test/ */
export interface TestRequest {
  prompt: string;
  variable_values: Record<string, string>;
}

/** Response from POST /api/v1/test/ */
export interface TestResponse {
  output: string;
}

/** Request body for POST /api/v1/improve/ */
export interface ImproveRequest {
  prompt: string;
  feedback?: string;
}

/** Request body for POST /api/v1/history/<id>/feedback/ */
export interface FeedbackRequest {
  rating: number;
  feedback?: string;
}

/** Response from POST /api/v1/history/<id>/feedback/ */
export interface FeedbackResponse {
  id: number;
  user_rating: number;
  user_feedback: string;
  message: string;
}
