// Vercel Serverless API for Company Naming Workflow
export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // API Keys from environment variables
  const API_KEYS = {
    anthropic: process.env.ANTHROPIC_API_KEY,
    openai: process.env.OPENAI_API_KEY,
    perplexity: process.env.PERPLEXITY_API_KEY
  };

  // Health check endpoint
  if (req.method === 'GET' && req.url.includes('/health')) {
    return res.status(200).json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      service: 'Company Naming Workflow API'
    });
  }

  // Workflow steps endpoint
  if (req.method === 'GET' && req.url.includes('/steps')) {
    const steps = [
      { id: 1, title: "Market & SEO Research", llm: "Perplexity", color: "bg-blue-500" },
      { id: 2, title: "Keyword Expansion", llm: "Claude Sonnet", color: "bg-orange-500" },
      { id: 3, title: "Gap Analysis", llm: "Claude Sonnet", color: "bg-orange-500" },
      { id: 4, title: "Search Intent Mapping", llm: "Claude Sonnet", color: "bg-orange-500" },
      { id: 5, title: "Name Generation", llm: "Claude Sonnet", color: "bg-orange-500" },
      { id: 6, title: "Tagline Development", llm: "ChatGPT", color: "bg-green-500" },
      { id: 7, title: "Multi-Criteria Assessment", llm: "Claude Sonnet", color: "bg-orange-500" },
      { id: 8, title: "Market Validation", llm: "Perplexity", color: "bg-blue-500" },
      { id: 9, title: "Final Strategic Report", llm: "Claude Sonnet", color: "bg-orange-500" }
    ];
    return res.status(200).json({ steps });
  }

  // Execute single step
  if (req.method === 'POST' && req.url.includes('/execute-step')) {
    const { stepId, businessData, stepOutputs } = req.body;
    
    try {
      const result = await executeStep(stepId, businessData, stepOutputs, API_KEYS);
      return res.status(200).json({
        success: true,
        output: result,
        executionTime: '2500ms',
        stepId
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: { message: error.message }
      });
    }
  }

  // Execute full workflow
  if (req.method === 'POST' && req.url.includes('/execute-workflow')) {
    const { businessData } = req.body;
    const executionId = 'exec_' + Date.now();
    
    try {
      const results = await executeFullWorkflow(businessData, API_KEYS);
      return res.status(200).json({
        success: true,
        executionId,
        results,
        status: 'completed'
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: { message: error.message }
      });
    }
  }

  return res.status(404).json({ error: { message: 'Endpoint not found' } });
}

// Execute individual step
async function executeStep(stepId, businessData, stepOutputs, apiKeys) {
  const prompts = getPrompts();
  const prompt = prompts[`step${stepId}`];
  
  if (!prompt) {
    throw new Error(`Step ${stepId} not found`);
  }

  // Replace placeholders in prompt
  let processedPrompt = prompt.replace(/\{\{(\w+)\}\}/g, (match, key) => {
    return businessData[key] || stepOutputs[key] || match;
  });

  // Determine which LLM to use
  const llmConfig = {
    1: 'perplexity', 8: 'perplexity',  // Market research steps
    6: 'openai',                       // Tagline development
    2: 'anthropic', 3: 'anthropic', 4: 'anthropic', 
    5: 'anthropic', 7: 'anthropic', 9: 'anthropic'  // Claude steps
  };

  const llm = llmConfig[stepId] || 'anthropic';
  
  return await callLLM(llm, processedPrompt, apiKeys);
}

// Execute full workflow
async function executeFullWorkflow(businessData, apiKeys) {
  const results = {};
  let stepOutputs = {};
  
  for (let stepId = 1; stepId <= 9; stepId++) {
    try {
      const output = await executeStep(stepId, businessData, stepOutputs, apiKeys);
      results[`STEP_${stepId}_OUTPUT`] = { success: true, output, executionTime: '2500ms' };
      stepOutputs[`STEP_${stepId}_OUTPUT`] = output;
      
      // Handle Step 1 sections for later steps
      if (stepId === 1) {
        const sectionAMatch = output.match(/\(A\)\s*([^(]*?)(?=\(B\)|$)/s);
        const sectionBMatch = output.match(/\(B\)\s*(.*)/s);
        
        if (sectionAMatch) stepOutputs[`STEP_${stepId}_A`] = sectionAMatch[1].trim();
        if (sectionBMatch) stepOutputs[`STEP_${stepId}_B`] = sectionBMatch[1].trim();
      }
    } catch (error) {
      results[`STEP_${stepId}_OUTPUT`] = { success: false, error: error.message };
    }
  }
  
  return results;
}

// Call appropriate LLM service
async function callLLM(service, prompt, apiKeys) {
  switch (service) {
    case 'anthropic':
      return await callAnthropic(prompt, apiKeys.anthropic);
    case 'openai':
      return await callOpenAI(prompt, apiKeys.openai);
    case 'perplexity':
      return await callPerplexity(prompt, apiKeys.perplexity);
    default:
      throw new Error(`Unknown LLM service: ${service}`);
  }
}

// Anthropic Claude API call
async function callAnthropic(prompt, apiKey) {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: 'claude-3-sonnet-20240229',
      max_tokens: 4000,
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7
    })
  });
  
  if (!response.ok) {
    throw new Error(`Anthropic API error: ${response.status}`);
  }
  
  const data = await response.json();
  return data.content[0].text;
}

// OpenAI API call
async function callOpenAI(prompt, apiKey) {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 4000,
      temperature: 0.7
    })
  });
  
  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.status}`);
  }
  
  const data = await response.json();
  return data.choices[0].message.content;
}

// Perplexity API call
async function callPerplexity(prompt, apiKey) {
  const response = await fetch('https://api.perplexity.ai/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: 'llama-3.1-sonar-small-128k-online',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 4000,
      temperature: 0.7
    })
  });
  
  if (!response.ok) {
    throw new Error(`Perplexity API error: ${response.status}`);
  }
  
  const data = await response.json();
  return data.choices[0].message.content;
}

// Get all workflow prompts (abbreviated for space)
function getPrompts() {
  return {
    step1: "You are a business naming consultant. Conduct comprehensive market and SEO research for: {{industry}} specializing in {{serviceSpecialization}} serving {{geographicMarket}}. Provide (A) MARKET ANALYSIS and (B) SEO RESEARCH with actionable insights.",
    
    step2: "Based on the market research, expand the keyword universe for {{industry}} in {{geographicMarket}}. Provide comprehensive keyword categories and variations.",
    
    step3: "Identify strategic gaps and opportunities for {{businessType}} in {{industry}} based on competitor analysis and market data.",
    
    step4: "Map search intent and customer journey for {{targetClients}} seeking {{serviceSpecialization}} services. Analyze awareness, consideration, and decision stage behaviors.",
    
    step5: "Generate 15 creative company names for {{businessType}} specializing in {{serviceSpecialization}} in {{geographicMarket}}. Provide 5 descriptive, 3 geographic, 4 expertise-focused, and 3 modern names with rationale.",
    
    step6: "Create compelling taglines and messaging for the generated company names focusing on {{valueProp}} and targeting {{targetClients}}.",
    
    step7: "Perform comprehensive multi-criteria assessment of all generated names across brand, marketing, business, and competitive criteria. Rank and recommend top 5.",
    
    step8: "Conduct market validation research for the top 5 recommended names including competitive landscape, digital presence, and professional market acceptance.",
    
    step9: "Create final comprehensive naming strategy report with executive summary, name recommendation, messaging strategy, implementation roadmap, and success metrics."
  };
}