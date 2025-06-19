import { BusinessData } from '../types/index';
import { logger } from '../utils/logger';

export class PromptProcessor {
  
  static processPrompt(
    template: string, 
    businessData: BusinessData, 
    stepOutputs: Record<string, string> = {}
  ): string {
    let processedPrompt = template;

    try {
      // Replace business data placeholders
      processedPrompt = this.replaceBusinessDataPlaceholders(processedPrompt, businessData);
      
      // Replace step output placeholders
      processedPrompt = this.replaceStepOutputPlaceholders(processedPrompt, stepOutputs);
      
      logger.info('Prompt processed successfully', {
        originalLength: template.length,
        processedLength: processedPrompt.length,
        placeholdersReplaced: this.countReplacements(template, processedPrompt)
      });

      return processedPrompt;
    } catch (error) {
      logger.error('Error processing prompt', { error: error instanceof Error ? error.message : 'Unknown error' });
      throw new Error('Failed to process prompt template');
    }
  }

  private static replaceBusinessDataPlaceholders(prompt: string, businessData: BusinessData): string {
    const placeholderMap: Record<string, string> = {
      '{INDUSTRY}': businessData.industry || '[Industry not specified]',
      '{SERVICE_SPECIALIZATION}': businessData.serviceSpecialization || '[Service specialization not specified]',
      '{GEOGRAPHIC_MARKET}': businessData.geographicMarket || '[Geographic market not specified]',
      '{BUSINESS_TYPE}': businessData.businessType || '[Business type not specified]',
      '{KEY_DIFFERENTIATORS}': businessData.keyDifferentiators || '[Key differentiators not specified]',
      '{TARGET_CLIENTS}': businessData.targetClients || '[Target clients not specified]',
      '{COMPANY_SIZE}': businessData.companySize || '[Company size not specified]',
      '{VALUE_PROP}': businessData.valueProp || '[Value proposition not specified]',
      '{CERTIFICATIONS}': businessData.certifications || '[Certifications not specified]'
    };

    let processedPrompt = prompt;
    Object.entries(placeholderMap).forEach(([placeholder, value]) => {
      processedPrompt = processedPrompt.replace(new RegExp(placeholder.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), value);
    });

    return processedPrompt;
  }

  private static replaceStepOutputPlaceholders(prompt: string, stepOutputs: Record<string, string>): string {
    let processedPrompt = prompt;

    Object.entries(stepOutputs).forEach(([key, value]) => {
      const placeholder = `{${key}}`;
      processedPrompt = processedPrompt.replace(new RegExp(placeholder.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), value || '[Previous step output not available]');
    });

    return processedPrompt;
  }

  private static countReplacements(original: string, processed: string): number {
    const originalPlaceholders = (original.match(/{[^}]+}/g) || []).length;
    const processedPlaceholders = (processed.match(/{[^}]+}/g) || []).length;
    return originalPlaceholders - processedPlaceholders;
  }

  static extractSections(text: string, stepId: number): Record<string, string> {
    const sections: Record<string, string> = {};
    
    try {
      if (stepId === 1) {
        // Step 1 has specific section markers (A) and (B)
        const sectionAMatch = text.match(/\(A\)\s*([^(]*?)(?=\(B\)|$)/s);
        const sectionBMatch = text.match(/\(B\)\s*(.*)/s);
        
        if (sectionAMatch) {
          sections[`STEP_${stepId}_A`] = sectionAMatch[1].trim();
        }
        if (sectionBMatch) {
          sections[`STEP_${stepId}_B`] = sectionBMatch[1].trim();
        }
      }
      
      // Always store the full output
      sections[`STEP_${stepId}_OUTPUT`] = text;
      
      logger.info('Sections extracted successfully', {
        stepId,
        sectionsFound: Object.keys(sections).length
      });

    } catch (error) {
      logger.error('Error extracting sections', { 
        stepId, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      });
      
      // Fallback: just store the full output
      sections[`STEP_${stepId}_OUTPUT`] = text;
    }

    return sections;
  }

  static validateBusinessData(businessData: BusinessData): { isValid: boolean; missingFields: string[] } {
    const requiredFields: (keyof BusinessData)[] = [
      'industry',
      'serviceSpecialization', 
      'geographicMarket',
      'businessType'
    ];

    const missingFields = requiredFields.filter(field => !businessData[field]?.trim());

    return {
      isValid: missingFields.length === 0,
      missingFields
    };
  }
}