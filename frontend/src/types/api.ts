export interface PromptHistory {
  id: number;
  task: string;
  prompt: string;
  variables: string[];
  is_improved?: boolean;
}

export interface GenerateRequest {
  task: string;
  variables?: string[];
}

export interface GenerateResponse {
  id: number;
  task: string;
  prompt: string;
  variables: string[];
}

export interface TestRequest {
  prompt: string;
  variable_values: Record<string, string>;
}

export interface TestResponse {
  output: string;
}

export interface ImproveRequest {
  prompt: string;
  feedback?: string;
}
