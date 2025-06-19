# Company Naming Workflow Backend

A comprehensive backend API for the Company Naming Workflow Dashboard that automates the 9-step company naming process using real LLM integrations.

## Features

- **Real API Integrations**: Perplexity, OpenAI (ChatGPT), and Anthropic (Claude)
- **Dynamic Prompt Processing**: Automatic placeholder replacement with business data
- **Workflow Orchestration**: Step-by-step and full automation execution
- **Error Handling**: Comprehensive retry mechanisms and error reporting
- **Output Parsing**: Automatic section extraction and data flow between steps
- **REST API**: Clean endpoints for frontend integration

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Configuration

Copy the example environment file and fill in your API keys:

```bash
cp .env.example .env
```

Edit `.env` with your API keys:

```env
ANTHROPIC_API_KEY=your_anthropic_api_key_here
OPENAI_API_KEY=your_openai_api_key_here
PERPLEXITY_API_KEY=your_perplexity_api_key_here
```

### 3. Start the Server

Development mode:
```bash
npm run dev
```

Production mode:
```bash
npm run build
npm start
```

The server will start on http://localhost:3001

## API Endpoints

### GET /api/workflow/steps
Get all workflow steps configuration

### POST /api/workflow/execute-step
Execute a single workflow step
```json
{
  "stepId": 1,
  "businessData": {
    "industry": "Commercial Real Estate Appraisal",
    "serviceSpecialization": "Multifamily and Self-Storage Properties",
    "geographicMarket": "Western Canada",
    "businessType": "Professional Services Firm",
    "keyDifferentiators": "AACI Certified, 15+ years experience",
    "targetClients": "Property investors, developers, lenders",
    "companySize": "Small firm (2-5 appraisers)",
    "valueProp": "Fast turnaround, accurate valuations",
    "certifications": "AACI, CRA"
  },
  "stepOutputs": {},
  "customPrompt": "optional custom prompt"
}
```

### POST /api/workflow/execute-workflow
Execute the full workflow
```json
{
  "businessData": { /* same as above */ },
  "startFromStep": 1,
  "endAtStep": 9
}
```

### GET /api/workflow/execution/:executionId
Get workflow execution status and results

### POST /api/workflow/validate-business-data
Validate business data before execution

### GET /api/workflow/health
Health check endpoint

## LLM Distribution

- **Perplexity**: Steps 1, 8 (market research, validation)
- **ChatGPT**: Step 6 (tagline creation)
- **Claude Sonnet**: Steps 2, 3, 4, 5, 7, 9 (analysis, strategy, reports)

## Workflow Steps

1. **Market & SEO Research** (Perplexity)
2. **Keyword Expansion** (Claude Sonnet)
3. **Gap Analysis** (Claude Sonnet)
4. **Search Intent Mapping** (Claude Sonnet)
5. **Name Generation** (Claude Sonnet)
6. **Tagline Development** (ChatGPT)
7. **Multi-Criteria Assessment** (Claude Sonnet)
8. **Market Validation** (Perplexity)
9. **Final Strategic Report** (Claude Sonnet)

## Error Handling

The system includes comprehensive error handling with:
- Automatic retries with exponential backoff
- Detailed error logging
- Graceful degradation
- Clear error messages for frontend

## Security

- CORS protection
- Helmet security headers
- Input validation with Zod
- Rate limiting ready
- Environment variable validation

## Frontend Integration

The updated React frontend (`frontend-updated.jsx`) replaces the mock `simulateAPICall` function with real API calls to this backend.

Key changes:
- Real API integration with error handling
- Loading states and progress tracking
- Business data validation
- Workflow execution polling
- Comprehensive error display

## Getting API Keys

1. **Anthropic**: https://console.anthropic.com/
2. **OpenAI**: https://platform.openai.com/api-keys
3. **Perplexity**: https://www.perplexity.ai/settings/api

## Monitoring and Logs

Logs are written to:
- `logs/error.log` - Error logs only
- `logs/combined.log` - All logs
- Console output in development mode

## Development Commands

```bash
npm run dev      # Start development server with hot reload
npm run build    # Build TypeScript to JavaScript
npm start        # Start production server
npm run lint     # Run ESLint
npm run format   # Format code with Prettier
npm test         # Run tests
```