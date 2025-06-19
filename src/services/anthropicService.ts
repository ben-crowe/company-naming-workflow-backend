import Anthropic from '@anthropic-ai/sdk';
import { config } from '../utils/config';
import { logger } from '../utils/logger';
import { APIError } from '../types/index';

export class AnthropicService {
  private client: Anthropic;

  constructor() {
    this.client = new Anthropic({
      apiKey: config.ANTHROPIC_API_KEY,
    });
  }

  async generateResponse(prompt: string, retries = 3): Promise<string> {
    try {
      logger.info('Sending request to Anthropic API', { 
        promptLength: prompt.length,
        retries: retries 
      });

      const response = await this.client.messages.create({
        model: 'claude-3-sonnet-20240229',
        max_tokens: 4000,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
      });

      if (response.content[0]?.type === 'text') {
        logger.info('Received successful response from Anthropic API');
        return response.content[0].text;
      } else {
        throw new Error('Unexpected response format from Anthropic API');
      }
    } catch (error) {
      logger.error('Error calling Anthropic API', { 
        error: error instanceof Error ? error.message : 'Unknown error',
        retries 
      });

      if (retries > 0 && this.isRetryableError(error)) {
        logger.info('Retrying Anthropic API request', { remainingRetries: retries - 1 });
        await this.delay(1000 * (4 - retries)); // Exponential backoff
        return this.generateResponse(prompt, retries - 1);
      }

      throw this.createAPIError(error);
    }
  }

  private isRetryableError(error: unknown): boolean {
    if (error instanceof Anthropic.APIError) {
      return error.status === 429 || (error.status !== undefined && error.status >= 500);
    }
    return false;
  }

  private createAPIError(error: unknown): APIError {
    if (error instanceof Anthropic.APIError) {
      return {
        message: error.message,
        code: 'ANTHROPIC_API_ERROR',
        statusCode: error.status ?? 500,
        retryable: this.isRetryableError(error)
      };
    }

    return {
      message: error instanceof Error ? error.message : 'Unknown Anthropic API error',
      code: 'ANTHROPIC_UNKNOWN_ERROR',
      statusCode: 500,
      retryable: false
    };
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}