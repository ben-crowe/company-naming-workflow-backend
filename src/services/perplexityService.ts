import axios, { AxiosError } from 'axios';
import { config } from '../utils/config.js';
import { logger } from '../utils/logger.js';
import { APIError } from '../types/index.js';

export class PerplexityService {
  private baseURL = 'https://api.perplexity.ai';

  async generateResponse(prompt: string, retries = 3): Promise<string> {
    try {
      logger.info('Sending request to Perplexity API', { 
        promptLength: prompt.length,
        retries: retries 
      });

      const response = await axios.post(
        `${this.baseURL}/chat/completions`,
        {
          model: 'llama-3.1-sonar-small-128k-online',
          messages: [
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: 4000,
          temperature: 0.7,
          top_p: 0.9,
          return_citations: true,
          search_domain_filter: ["perplexity.ai"],
          return_images: false,
          return_related_questions: false,
          search_recency_filter: "month",
          top_k: 0,
          stream: false,
          presence_penalty: 0,
          frequency_penalty: 1
        },
        {
          headers: {
            'Authorization': `Bearer ${config.PERPLEXITY_API_KEY}`,
            'Content-Type': 'application/json',
          },
          timeout: config.LLM_REQUEST_TIMEOUT_MS,
        }
      );

      const content = response.data.choices[0]?.message?.content;
      if (content) {
        logger.info('Received successful response from Perplexity API');
        return content;
      } else {
        throw new Error('No content received from Perplexity API');
      }
    } catch (error) {
      logger.error('Error calling Perplexity API', { 
        error: error instanceof Error ? error.message : 'Unknown error',
        retries 
      });

      if (retries > 0 && this.isRetryableError(error)) {
        logger.info('Retrying Perplexity API request', { remainingRetries: retries - 1 });
        await this.delay(1000 * (4 - retries)); // Exponential backoff
        return this.generateResponse(prompt, retries - 1);
      }

      throw this.createAPIError(error);
    }
  }

  private isRetryableError(error: unknown): boolean {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      return status === 429 || status === 503 || (status !== undefined && status >= 500);
    }
    return false;
  }

  private createAPIError(error: unknown): APIError {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      return {
        message: axiosError.message,
        code: 'PERPLEXITY_API_ERROR',
        statusCode: axiosError.response?.status || 500,
        retryable: this.isRetryableError(error)
      };
    }

    return {
      message: error instanceof Error ? error.message : 'Unknown Perplexity API error',
      code: 'PERPLEXITY_UNKNOWN_ERROR',
      statusCode: 500,
      retryable: false
    };
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}