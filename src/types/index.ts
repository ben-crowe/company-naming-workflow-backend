export interface BusinessData {
  industry: string;
  serviceSpecialization: string;
  geographicMarket: string;
  businessType: string;
  keyDifferentiators: string;
  targetClients: string;
  companySize: string;
  valueProp: string;
  certifications: string;
}

export interface WorkflowStep {
  id: number;
  title: string;
  llm: 'Perplexity' | 'Claude Sonnet' | 'ChatGPT';
  color: string;
  prompt: string;
}

export interface StepExecutionRequest {
  stepId: number;
  businessData: BusinessData;
  stepOutputs: Record<string, string>;
  customPrompt?: string;
}

export interface StepExecutionResponse {
  stepId: number;
  output: string;
  llm: string;
  executionTime: number;
  success: boolean;
  error?: string;
}

export interface WorkflowExecutionRequest {
  businessData: BusinessData;
  startFromStep?: number;
  endAtStep?: number;
}

export interface WorkflowExecutionResponse {
  executionId: string;
  status: 'running' | 'completed' | 'error';
  currentStep: number;
  totalSteps: number;
  results: Record<string, StepExecutionResponse>;
  error?: string;
}

export interface LLMConfig {
  apiKey: string;
  baseURL?: string;
  timeout: number;
  maxRetries: number;
}

export interface APIError {
  message: string;
  code: string;
  statusCode: number;
  retryable: boolean;
}