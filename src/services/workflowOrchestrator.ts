import { v4 as uuidv4 } from 'uuid';
import { AnthropicService } from './anthropicService.js';
import { OpenAIService } from './openaiService.js';
import { PerplexityService } from './perplexityService.js';
import { PromptProcessor } from './promptProcessor.js';
import { logger } from '../utils/logger.js';
import { 
  WorkflowStep, 
  StepExecutionRequest, 
  StepExecutionResponse,
  WorkflowExecutionRequest,
  WorkflowExecutionResponse
} from '../types/index.js';

export class WorkflowOrchestrator {
  private anthropicService: AnthropicService;
  private openaiService: OpenAIService;
  private perplexityService: PerplexityService;
  private activeExecutions: Map<string, WorkflowExecutionResponse> = new Map();

  constructor() {
    this.anthropicService = new AnthropicService();
    this.openaiService = new OpenAIService();
    this.perplexityService = new PerplexityService();
  }

  private readonly workflowSteps: WorkflowStep[] = [
    {
      id: 1,
      title: "Market & SEO Research",
      llm: "Perplexity",
      color: "bg-blue-500",
      prompt: `1. Research {INDUSTRY} companies in {GEOGRAPHIC_MARKET} specializing in {SERVICE_SPECIALIZATION}. Provide a list of company names, their positioning, and notable naming conventions as of 2025. Focus on companies targeting {TARGET_CLIENTS} and analyze how they position their {KEY_DIFFERENTIATORS}.

2. Analyze current search trends and keyword opportunities for {INDUSTRY} services in {GEOGRAPHIC_MARKET}. Focus on {SERVICE_SPECIALIZATION} terminology, including search volumes, competition levels, and emerging keyword trends in 2025. Consider {BUSINESS_TYPE} positioning and {CERTIFICATIONS} if applicable. Output a table of primary and secondary keywords, their search volumes, and competition scores.

Please present the results in two clearly labeled sections: (A) Competitor/Naming Research and (B) SEO Keyword Research.`
    },
    {
      id: 2,
      title: "Keyword Expansion",
      llm: "Claude Sonnet",
      color: "bg-orange-500",
      prompt: `Using the competitor/naming research and SEO keyword research below, generate 50 long-tail, low-competition keywords for {INDUSTRY} services in {GEOGRAPHIC_MARKET}. Focus on {SERVICE_SPECIALIZATION} terms, include geographic modifiers, professional designations ({CERTIFICATIONS}), and question-based search phrases. Target {TARGET_CLIENTS} search behavior and {BUSINESS_TYPE} positioning. Categorize by: Primary Service Keywords, Geographic Keywords, Professional Keywords, and Question-Based Keywords.

Competitor/Naming Research:
{STEP_1_A}

SEO Keyword Research:
{STEP_1_B}`
    },
    {
      id: 3,
      title: "Gap Analysis",
      llm: "Claude Sonnet",
      color: "bg-orange-500",
      prompt: `Using the following long-tail keywords, identify keyword gaps and search opportunities in the {GEOGRAPHIC_MARKET} {INDUSTRY} market that competitors are not effectively targeting. Focus on emerging trends in {SERVICE_SPECIALIZATION} sectors. Analyze which search terms have commercial intent but minimal competition from established firms. Consider opportunities for {BUSINESS_TYPE} with {KEY_DIFFERENTIATORS} targeting {TARGET_CLIENTS}.

Long-Tail Keyword List:
{STEP_2_OUTPUT}`
    },
    {
      id: 4,
      title: "Search Intent Mapping",
      llm: "Claude Sonnet",
      color: "bg-orange-500",
      prompt: `Using the following keyword gaps and opportunities, analyze the competitive landscape for {INDUSTRY} keywords in {GEOGRAPHIC_MARKET}. Map search intent categories (informational, commercial, transactional) and identify strategic opportunities where new market entrants can gain competitive advantage. Focus on {SERVICE_SPECIALIZATION} and {BUSINESS_TYPE} positioning with {KEY_DIFFERENTIATORS}. Provide detailed reasoning for each opportunity assessment.

Keyword Gaps and Opportunities:
{STEP_3_OUTPUT}`
    },
    {
      id: 5,
      title: "Name Generation",
      llm: "Claude Sonnet",
      color: "bg-orange-500",
      prompt: `Using the following competitor list, keyword gaps, and search intent analysis, generate 20 company names for a {GEOGRAPHIC_MARKET} {INDUSTRY} firm specializing in {SERVICE_SPECIALIZATION}. Each name must:
- Incorporate identified low-competition keywords naturally
- Signal professional authority and trustworthiness
- Include subtle geographic relevance without limiting expansion
- Optimize for local SEO while maintaining brandability
- Differentiate from identified competitors
- Appeal to {TARGET_CLIENTS} and reflect {BUSINESS_TYPE} positioning
- Leverage {KEY_DIFFERENTIATORS} and {CERTIFICATIONS} if applicable

Provide names in these categories:
- 7 Keyword-Rich Names (direct service integration)
- 7 Hybrid Names (branded + keyword elements)
- 6 Brandable Names (unique positioning with SEO potential)

For each name, include: primary keyword integration, SEO advantage, and differentiation factor.

Competitor List:
{STEP_1_A}

Keyword Gaps and Search Intent Analysis:
{STEP_4_OUTPUT}`
    },
    {
      id: 6,
      title: "Tagline Development",
      llm: "ChatGPT",
      color: "bg-green-500",
      prompt: `For each of the following proposed company names, develop SEO-optimized taglines and business descriptors. Create phrases that:
- Target identified low-competition keywords
- Enhance local search visibility for {GEOGRAPHIC_MARKET}
- Communicate {SERVICE_SPECIALIZATION} expertise
- Support the primary company name's SEO strategy
- Appeal to {TARGET_CLIENTS} and reflect {VALUE_PROP}
- Incorporate {CERTIFICATIONS} and {KEY_DIFFERENTIATORS} naturally
- Provide additional keyword coverage without keyword stuffing

Proposed Company Names and Rationales:
{STEP_5_OUTPUT}`
    },
    {
      id: 7,
      title: "Multi-Criteria Assessment",
      llm: "Claude Sonnet",
      color: "bg-orange-500",
      prompt: `Score each company name + tagline combination using this framework:

SEO PERFORMANCE (40%):
- Keyword integration effectiveness (1-10)
- Search competition level assessment (1-10)
- Local SEO potential for {GEOGRAPHIC_MARKET} (1-10)
- Long-tail keyword expansion opportunities (1-10)

MARKET POSITIONING (30%):
- Professional credibility signals for {BUSINESS_TYPE} (1-10)
- Industry authority perception in {INDUSTRY} (1-10)
- Differentiation from identified competitors (1-10)
- Appeal to {TARGET_CLIENTS} (1-10)

DIGITAL VIABILITY (30%):
- Domain availability likelihood (1-10)
- Social media handle availability potential (1-10)
- Trademark conflict risk assessment (1-10)

Provide detailed scoring rationale and rank top 5 combinations with strategic reasoning for each score.

Name + Tagline Combinations:
{STEP_6_OUTPUT}`
    },
    {
      id: 8,
      title: "Market Validation",
      llm: "Perplexity",
      color: "bg-blue-500",
      prompt: `For the following top 5 company name recommendations, research current market conditions including:
- Domain availability status for .ca and .com extensions (and relevant {GEOGRAPHIC_MARKET} domains)
- Existing business registration conflicts in {GEOGRAPHIC_MARKET}
- Current search result analysis for name uniqueness in {INDUSTRY}
- Social media handle availability across major platforms
- Recent trademark applications in {INDUSTRY} and related business categories
- Potential conflicts with existing {BUSINESS_TYPE} firms

Top 5 Name + Tagline Combinations:
{STEP_7_OUTPUT}`
    },
    {
      id: 9,
      title: "Final Strategic Report",
      llm: "Claude Sonnet",
      color: "bg-orange-500",
      prompt: `Using the following validation results, create a comprehensive naming recommendation report for the {GEOGRAPHIC_MARKET} {INDUSTRY} client specializing in {SERVICE_SPECIALIZATION}. Structure as:

EXECUTIVE SUMMARY:
- Top 3 recommended name + tagline combinations
- Primary SEO advantages and competitive positioning for each
- Implementation priority ranking with strategic rationale for {BUSINESS_TYPE}

SEO STRATEGY ANALYSIS:
- Detailed keyword opportunity assessment for each recommendation
- Search competition analysis with specific market gaps identified
- Local SEO optimization pathway for {GEOGRAPHIC_MARKET} markets
- Long-term keyword expansion strategy for business growth
- Integration with {KEY_DIFFERENTIATORS} and {CERTIFICATIONS}

COMPETITIVE INTELLIGENCE:
- Market differentiation analysis with competitor weakness exploitation
- Search visibility projection based on current market conditions
- Digital asset acquisition strategy with cost-benefit analysis
- Performance tracking metrics and success KPIs for {TARGET_CLIENTS}

IMPLEMENTATION ROADMAP:
- Phase-by-phase implementation strategy
- Legal protection priorities and trademark filing recommendations
- Digital marketing integration plan leveraging {VALUE_PROP}
- 6-month and 12-month milestone targets

Validation Results:
{STEP_8_OUTPUT}`
    }
  ];

  async executeStep(request: StepExecutionRequest): Promise<StepExecutionResponse> {
    const startTime = Date.now();
    
    try {
      logger.info('Starting step execution', { stepId: request.stepId });

      const step = this.workflowSteps.find(s => s.id === request.stepId);
      if (!step) {
        throw new Error(`Step ${request.stepId} not found`);
      }

      const prompt = request.customPrompt || step.prompt;
      const processedPrompt = PromptProcessor.processPrompt(
        prompt,
        request.businessData,
        request.stepOutputs
      );

      const output = await this.executeWithLLM(step.llm, processedPrompt);
      const executionTime = Date.now() - startTime;

      const response: StepExecutionResponse = {
        stepId: request.stepId,
        output,
        llm: step.llm,
        executionTime,
        success: true
      };

      logger.info('Step execution completed successfully', {
        stepId: request.stepId,
        llm: step.llm,
        executionTime
      });

      return response;
    } catch (error) {
      const executionTime = Date.now() - startTime;
      
      logger.error('Step execution failed', {
        stepId: request.stepId,
        error: error instanceof Error ? error.message : 'Unknown error',
        executionTime
      });

      return {
        stepId: request.stepId,
        output: '',
        llm: this.workflowSteps.find(s => s.id === request.stepId)?.llm ?? 'Unknown',
        executionTime,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  async executeWorkflow(request: WorkflowExecutionRequest): Promise<string> {
    const executionId = uuidv4();
    const startStep = request.startFromStep || 1;
    const endStep = request.endAtStep || this.workflowSteps.length;

    const execution: WorkflowExecutionResponse = {
      executionId,
      status: 'running',
      currentStep: startStep,
      totalSteps: endStep - startStep + 1,
      results: {}
    };

    this.activeExecutions.set(executionId, execution);

    try {
      logger.info('Starting workflow execution', {
        executionId,
        startStep,
        endStep,
        totalSteps: execution.totalSteps
      });

      let stepOutputs: Record<string, string> = {};

      for (let stepId = startStep; stepId <= endStep; stepId++) {
        execution.currentStep = stepId;
        this.activeExecutions.set(executionId, execution);

        const stepRequest: StepExecutionRequest = {
          stepId,
          businessData: request.businessData,
          stepOutputs
        };

        const stepResponse = await this.executeStep(stepRequest);
        execution.results[`step_${stepId}`] = stepResponse;

        if (stepResponse.success) {
          // Extract sections from the output
          const sections = PromptProcessor.extractSections(stepResponse.output, stepId);
          stepOutputs = { ...stepOutputs, ...sections };
        } else {
          execution.status = 'error';
          execution.error = stepResponse.error ?? 'Unknown error';
          this.activeExecutions.set(executionId, execution);
          throw new Error(`Step ${stepId} failed: ${stepResponse.error}`);
        }
      }

      execution.status = 'completed';
      this.activeExecutions.set(executionId, execution);

      logger.info('Workflow execution completed successfully', {
        executionId,
        totalSteps: execution.totalSteps
      });

      return executionId;
    } catch (error) {
      execution.status = 'error';
      execution.error = error instanceof Error ? error.message : 'Unknown error occurred';
      this.activeExecutions.set(executionId, execution);

      logger.error('Workflow execution failed', {
        executionId,
        error: execution.error
      });

      throw error;
    }
  }

  getExecutionStatus(executionId: string): WorkflowExecutionResponse | null {
    return this.activeExecutions.get(executionId) || null;
  }

  private async executeWithLLM(llm: string, prompt: string): Promise<string> {
    switch (llm) {
      case 'Perplexity':
        return await this.perplexityService.generateResponse(prompt);
      case 'Claude Sonnet':
        return await this.anthropicService.generateResponse(prompt);
      case 'ChatGPT':
        return await this.openaiService.generateResponse(prompt);
      default:
        throw new Error(`Unsupported LLM: ${llm}`);
    }
  }

  getWorkflowSteps(): WorkflowStep[] {
    return [...this.workflowSteps];
  }
}