# CLAUDE.md
Guidance for Claude Code when working with this repository.

## Development Workflow
**ALWAYS RUN AFTER CODE CHANGES:**
1. Format code: `npm run format`
2. Run checks: `npm run lint`
3. Test functionality: `npm test`
4. Validate business logic and data integrity

### Commands
- Development server: `npm run dev`
- Build: `npm run build`
- Format: `npm run format`
- Check/Lint: `npm run lint`
- Test: `npm test`

## Architecture
Node.js/TypeScript backend with Express.js serving REST API for Company Naming Workflow Dashboard.

### Key Directories
- src/ - Primary TypeScript source code
- src/services/ - LLM API clients and business logic
- src/routes/ - REST API endpoints
- src/middleware/ - Express middleware (validation, errors)
- src/utils/ - Configuration and logging utilities

### Patterns
- Service layer architecture with dependency injection
- Zod schema validation for all inputs
- Winston logging with file output
- Retry mechanisms with exponential backoff
- Environment-based configuration

## Environment Setup
Required environment variables in .env file:
- ANTHROPIC_API_KEY - Claude API access
- OPENAI_API_KEY - ChatGPT API access  
- PERPLEXITY_API_KEY - Perplexity search API access
- PORT - Server port (default: 3001)
- NODE_ENV - Environment mode

## Code Standards
- TypeScript 5.3+ with strict mode
- ESLint for code quality
- Prettier for formatting
- Explicit error handling and logging

## Testing & Validation
**After Code Changes:**
- Run `npm run build` to check TypeScript compilation
- Run `npm run lint` for code quality checks
- Test API endpoints with test-api.js script
- Verify LLM integrations are working properly

**Testing Categories:**
- API endpoint testing (health, steps, execution)
- LLM service integration tests
- Business data validation tests
- Workflow orchestration tests