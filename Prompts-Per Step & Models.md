Below are the nine prompts exactly as defined in your `WorkflowOrchestrator` (in `src/services/workflowOrchestrator.ts`), one per step. You can reference or ask me to tweak any of them by step number or title.

---

**Step 1 – Market & SEO Research**  
Prompt:
```
1. Research {INDUSTRY} companies in {GEOGRAPHIC_MARKET} specializing in {SERVICE_SPECIALIZATION}. Provide a list of company names, their positioning, and notable naming conventions as of 2025. Focus on companies targeting {TARGET_CLIENTS} and analyze how they position their {KEY_DIFFERENTIATORS}.

2. Analyze current search trends and keyword opportunities for {INDUSTRY} services in {GEOGRAPHIC_MARKET}. Focus on {SERVICE_SPECIALIZATION} terminology, including search volumes, competition levels, and emerging keyword trends in 2025. Consider {BUSINESS_TYPE} positioning and {CERTIFICATIONS} if applicable. Output a table of primary and secondary keywords, their search volumes, and competition scores.

Please present the results in two clearly labeled sections: (A) Competitor/Naming Research and (B) SEO Keyword Research.
```

---

**Step 2 – Keyword Expansion**  
Prompt:
```
Using the competitor/naming research and SEO keyword research below, generate 50 long-tail, low-competition keywords for {INDUSTRY} services in {GEOGRAPHIC_MARKET}. Focus on {SERVICE_SPECIALIZATION} terms, include geographic modifiers, professional designations ({CERTIFICATIONS}), and question-based search phrases. Target {TARGET_CLIENTS} search behavior and {BUSINESS_TYPE} positioning. Categorize by: Primary Service Keywords, Geographic Keywords, Professional Keywords, and Question-Based Keywords.

Competitor/Naming Research:
{STEP_1_A}

SEO Keyword Research:
{STEP_1_B}
```

---

**Step 3 – Gap Analysis**  
Prompt:
```
Using the following long-tail keywords, identify keyword gaps and search opportunities in the {GEOGRAPHIC_MARKET} {INDUSTRY} market that competitors are not effectively targeting. Focus on emerging trends in {SERVICE_SPECIALIZATION} sectors. Analyze which search terms have commercial intent but minimal competition from established firms. Consider opportunities for {BUSINESS_TYPE} with {KEY_DIFFERENTIATORS} targeting {TARGET_CLIENTS}.

Long-Tail Keyword List:
{STEP_2_OUTPUT}
```

---

**Step 4 – Search Intent Mapping**  
Prompt:
```
Using the following keyword gaps and opportunities, analyze the competitive landscape for {INDUSTRY} keywords in {GEOGRAPHIC_MARKET}. Map search intent categories (informational, commercial, transactional) and identify strategic opportunities where new market entrants can gain competitive advantage. Focus on {SERVICE_SPECIALIZATION} and {BUSINESS_TYPE} positioning with {KEY_DIFFERENTIATORS}. Provide detailed reasoning for each opportunity assessment.

Keyword Gaps and Opportunities:
{STEP_3_OUTPUT}
```

---

**Step 5 – Name Generation**  
Prompt:
```
Using the following competitor list, keyword gaps, and search intent analysis, generate 20 company names for a {GEOGRAPHIC_MARKET} {INDUSTRY} firm specializing in {SERVICE_SPECIALIZATION}. Each name must:
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
{STEP_4_OUTPUT}
```

---

**Step 6 – Tagline Development**  
Prompt:
```
For each of the following proposed company names, develop SEO-optimized taglines and business descriptors. Create phrases that:
- Target identified low-competition keywords
- Enhance local search visibility for {GEOGRAPHIC_MARKET}
- Communicate {SERVICE_SPECIALIZATION} expertise
- Support the primary company name's SEO strategy
- Appeal to {TARGET_CLIENTS} and reflect {VALUE_PROP}
- Incorporate {CERTIFICATIONS} and {KEY_DIFFERENTIATORS} naturally
- Provide additional keyword coverage without keyword stuffing

Proposed Company Names and Rationales:
{STEP_5_OUTPUT}
```

---

**Step 7 – Multi-Criteria Assessment**  
Prompt:
```
Score each company name + tagline combination using this framework:

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
{STEP_6_OUTPUT}
```

---

**Step 8 – Market Validation**  
Prompt:
```
For the following top 5 company name recommendations, research current market conditions including:
- Domain availability status for .ca and .com extensions (and relevant {GEOGRAPHIC_MARKET} domains)
- Existing business registration conflicts in {GEOGRAPHIC_MARKET}
- Current search result analysis for name uniqueness in {INDUSTRY}
- Social media handle availability across major platforms
- Recent trademark applications in {INDUSTRY} and related business categories
- Potential conflicts with existing {BUSINESS_TYPE} firms

Top 5 Name + Tagline Combinations:
{STEP_7_OUTPUT}
```

---

**Step 9 – Final Strategic Report**  
Prompt:
```
Using the following validation results, create a comprehensive naming recommendation report for the {GEOGRAPHIC_MARKET} {INDUSTRY} client specializing in {SERVICE_SPECIALIZATION}. Structure as:

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
{STEP_8_OUTPUT}
```

---

### LLM Models Used
Here’s the breakdown of exactly which model each of your nine steps invokes under the hood:

1. **Perplexity steps** (Steps 1 & 8)  
   – In `workflowOrchestrator.ts` you see `llm: "Perplexity"`.  
   – That maps to `PerplexityService.generateResponse(...)`, which hard-codes:  
     ```18:18:src/services/perplexityService.ts
     model: 'llama-3.1-sonar-small-128k-online',
     ```

2. **Claude Sonnet steps** (Steps 2, 3, 4, 5, 7 & 9)  
   – In `workflowOrchestrator.ts` you see `llm: "Claude Sonnet"`.  
   – That maps to `AnthropicService.generateResponse(...)`, which hard-codes:  
     ```22:22:src/services/anthropicService.ts
     model: 'claude-3-sonnet-20240229',
     ```

3. **ChatGPT step** (Step 6)  
   – In `workflowOrchestrator.ts` you see `llm: "ChatGPT"`.  
   – That maps to `OpenAIService.generateResponse(...)`, which hard-codes:  
     ```22:22:src/services/openaiService.ts
     model: 'gpt-4-turbo-preview',
     ```

So “Claude Sonnet” is in fact Claude 3 (the Sonnet build dated 2024-02-29), and “ChatGPT” is using OpenAI’s GPT-4 via the `gpt-4-turbo-preview` endpoint. If you ever want to switch to another Anthropic or OpenAI variant (e.g. Sonnet 4 or GPT-3.5), you’d update the `model` string in the respective service file.