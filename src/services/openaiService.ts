import OpenAI from 'openai';
import { config } from '../utils/config.js';
import { logger } from '../utils/logger.js';
import { APIError } from '../types/index.js';

export class OpenAIService {
  private client: OpenAI;

  constructor() {
    this.client = new OpenAI({
      apiKey: config.OPENAI_API_KEY,
    });
  }

  async generateResponse(prompt: string, retries = 3): Promise<string> {
    try {
      logger.info('Sending request to OpenAI API', { 
        promptLength: prompt.length,
        retries: retries 
      });

      const response = await this.client.chat.completions.create({
        model: 'gpt-4-turbo-preview',
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 4000,
        temperature: 0.7,
      });

      const content = response.choices[0]?.message?.content;
      if (content) {
        logger.info('Received successful response from OpenAI API');
        return content;
      } else {
        throw new Error('No content received from OpenAI API');
      }
    } catch (error) {
      logger.error('Error calling OpenAI API', { 
        error: error instanceof Error ? error.message : 'Unknown error',
        retries 
      });

      if (retries > 0 && this.isRetryableError(error)) {
        logger.info('Retrying OpenAI API request', { remainingRetries: retries - 1 });
        await this.delay(1000 * (4 - retries)); // Exponential backoff
        return this.generateResponse(prompt, retries - 1);
      }

      throw this.createAPIError(error);
    }
  }

  private isRetryableError(error: unknown): boolean {
    if (error instanceof OpenAI.APIError) {
      return error.status === 429 || error.status === 503 || error.status >= 500;
    }
    return false;
  }

  private createAPIError(error: unknown): APIError {
    if (error instanceof OpenAI.APIError) {
      return {
        message: error.message,
        code: 'OPENAI_API_ERROR',
        statusCode: error.status || 500,
        retryable: this.isRetryableError(error)
      };
    }

    return {
      message: error instanceof Error ? error.message : 'Unknown OpenAI API error',
      code: 'OPENAI_UNKNOWN_ERROR',
      statusCode: 500,
      retryable: false
    };
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}