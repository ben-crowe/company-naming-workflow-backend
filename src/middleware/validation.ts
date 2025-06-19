import { Request, Response, NextFunction } from 'express';
import { z, ZodSchema } from 'zod';
import { logger } from '../utils/logger';

export const validate = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        logger.warn('Validation failed', {
          errors: error.errors,
          body: req.body
        });

        res.status(400).json({
          error: {
            message: 'Validation failed',
            code: 'VALIDATION_ERROR',
            details: error.errors.map(err => ({
              field: err.path.join('.'),
              message: err.message
            }))
          }
        });
        return;
      }
      next(error);
    }
  };
};

export const businessDataSchema = z.object({
  industry: z.string().min(1, 'Industry is required'),
  serviceSpecialization: z.string().min(1, 'Service specialization is required'),
  geographicMarket: z.string().min(1, 'Geographic market is required'),
  businessType: z.string().min(1, 'Business type is required'),
  keyDifferentiators: z.string().optional().default(''),
  targetClients: z.string().optional().default(''),
  companySize: z.string().optional().default(''),
  valueProp: z.string().optional().default(''),
  certifications: z.string().optional().default('')
});

export const stepExecutionSchema = z.object({
  stepId: z.number().int().min(1).max(9),
  businessData: businessDataSchema,
  stepOutputs: z.record(z.string()).optional().default({}),
  customPrompt: z.string().optional()
});

export const workflowExecutionSchema = z.object({
  businessData: businessDataSchema,
  startFromStep: z.number().int().min(1).max(9).optional(),
  endAtStep: z.number().int().min(1).max(9).optional()
}).refine(data => {
  if (data.startFromStep && data.endAtStep) {
    return data.startFromStep <= data.endAtStep;
  }
  return true;
}, {
  message: 'startFromStep must be less than or equal to endAtStep'
});