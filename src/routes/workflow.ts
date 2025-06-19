import { Router, Request, Response, NextFunction } from 'express';
import { WorkflowOrchestrator } from '../services/workflowOrchestrator';
import { validate, stepExecutionSchema, workflowExecutionSchema } from '../middleware/validation';
import { logger } from '../utils/logger';
import { 
  StepExecutionRequest, 
  WorkflowExecutionRequest,
  BusinessData 
} from '../types/index';

const router = Router();
const orchestrator = new WorkflowOrchestrator();

// Get workflow steps
router.get('/steps', (_req: Request, res: Response, next: NextFunction) => {
  try {
    const steps = orchestrator.getWorkflowSteps();
    res.json({ steps });
  } catch (error) {
    next(error);
  }
});

// Execute single step
router.post('/execute-step', validate(stepExecutionSchema), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const request: StepExecutionRequest = req.body;
    
    logger.info('Executing single step', { stepId: request.stepId });
    
    const result = await orchestrator.executeStep(request);
    
    res.json(result);
  } catch (error) {
    next(error);
  }
});

// Execute full workflow
router.post('/execute-workflow', validate(workflowExecutionSchema), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const request: WorkflowExecutionRequest = req.body;
    
    logger.info('Starting workflow execution', {
      startFromStep: request.startFromStep,
      endAtStep: request.endAtStep
    });
    
    const executionId = await orchestrator.executeWorkflow(request);
    
    res.json({ 
      executionId,
      message: 'Workflow execution started successfully'
    });
  } catch (error) {
    next(error);
  }
});

// Get workflow execution status
router.get('/execution/:executionId', (req: Request, res: Response, next: NextFunction) => {
  try {
    const { executionId } = req.params;
    
    const execution = orchestrator.getExecutionStatus(executionId);
    
    if (!execution) {
      res.status(404).json({
        error: {
          message: 'Execution not found',
          code: 'EXECUTION_NOT_FOUND'
        }
      });
      return;
    }
    
    res.json(execution);
  } catch (error) {
    next(error);
  }
});

// Validate business data
router.post('/validate-business-data', (req: Request, res: Response, next: NextFunction) => {
  try {
    const businessData: BusinessData = req.body;
    
    const validation = require('../services/promptProcessor').PromptProcessor.validateBusinessData(businessData);
    
    res.json({
      isValid: validation.isValid,
      missingFields: validation.missingFields
    });
  } catch (error) {
    next(error);
  }
});

// Health check
router.get('/health', (_req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

export default router;