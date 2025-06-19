import React, { useState, useEffect } from 'react';
import { Play, Pause, SkipForward, Edit3, Download, RefreshCw, AlertCircle } from 'lucide-react';

const API_BASE_URL = 'http://localhost:3001/api/workflow';

const PromptChainingDashboard = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isAutoRunning, setIsAutoRunning] = useState(false);
  const [stepOutputs, setStepOutputs] = useState({});
  const [editingPrompt, setEditingPrompt] = useState(null);
  const [error, setError] = useState(null);
  const [executionId, setExecutionId] = useState(null);
  const [businessData, setBusinessData] = useState({
    industry: '',
    serviceSpecialization: '',
    geographicMarket: '',
    businessType: '',
    keyDifferentiators: '',
    targetClients: '',
    companySize: '',
    valueProp: '',
    certifications: ''
  });
  const [showBusinessForm, setShowBusinessForm] = useState(true);
  const [prompts, setPrompts] = useState([]);

  // Load workflow steps from backend
  useEffect(() => {
    const loadWorkflowSteps = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/steps`);
        if (!response.ok) {
          throw new Error('Failed to load workflow steps');
        }
        const data = await response.json();
        setPrompts(data.steps);
      } catch (error) {
        console.error('Error loading workflow steps:', error);
        setError('Failed to load workflow steps');
        // Fallback to default steps if backend is not available
        setPrompts(defaultWorkflowSteps);
      }
    };

    loadWorkflowSteps();
  }, []);

  const defaultWorkflowSteps = [
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
    // ... other steps (truncated for brevity)
  ];

  const executeStep = async (stepIndex) => {
    setIsRunning(true);
    setError(null);
    
    try {
      const step = prompts[stepIndex];
      
      const requestBody = {
        stepId: step.id,
        businessData,
        stepOutputs,
        customPrompt: editingPrompt === stepIndex ? step.prompt : undefined
      };

      const response = await fetch(`${API_BASE_URL}/execute-step`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to execute step');
      }

      const result = await response.json();
      
      if (result.success) {
        // Extract sections for step 1
        const newOutputs = { [`STEP_${step.id}_OUTPUT`]: result.output };
        
        if (step.id === 1) {
          const sectionAMatch = result.output.match(/\(A\)\s*([^(]*?)(?=\(B\)|$)/s);
          const sectionBMatch = result.output.match(/\(B\)\s*(.*)/s);
          
          if (sectionAMatch) {
            newOutputs[`STEP_${step.id}_A`] = sectionAMatch[1].trim();
          }
          if (sectionBMatch) {
            newOutputs[`STEP_${step.id}_B`] = sectionBMatch[1].trim();
          }
        }
        
        setStepOutputs(prev => ({ ...prev, ...newOutputs }));
      } else {
        throw new Error(result.error || 'Step execution failed');
      }
    } catch (error) {
      console.error('Error executing step:', error);
      setError(error.message || 'Failed to execute step');
    } finally {
      setIsRunning(false);
    }
  };

  const runAllSteps = async () => {
    setIsAutoRunning(true);
    setError(null);
    
    try {
      const requestBody = {
        businessData,
        startFromStep: 1,
        endAtStep: prompts.length
      };

      const response = await fetch(`${API_BASE_URL}/execute-workflow`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to start workflow');
      }

      const result = await response.json();
      setExecutionId(result.executionId);
      
      // Poll for results
      pollWorkflowStatus(result.executionId);
    } catch (error) {
      console.error('Error running workflow:', error);
      setError(error.message || 'Failed to run workflow');
      setIsAutoRunning(false);
    }
  };

  const pollWorkflowStatus = async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/execution/${id}`);
      
      if (!response.ok) {
        throw new Error('Failed to get workflow status');
      }

      const execution = await response.json();
      
      // Update current step based on execution status
      setCurrentStep(execution.currentStep - 1);
      
      // Update outputs with completed steps
      const newOutputs = {};
      Object.entries(execution.results).forEach(([key, stepResult]) => {
        if (stepResult.success) {
          const stepId = parseInt(key.split('_')[1]);
          newOutputs[`STEP_${stepId}_OUTPUT`] = stepResult.output;
          
          // Handle step 1 sections
          if (stepId === 1) {
            const sectionAMatch = stepResult.output.match(/\(A\)\s*([^(]*?)(?=\(B\)|$)/s);
            const sectionBMatch = stepResult.output.match(/\(B\)\s*(.*)/s);
            
            if (sectionAMatch) {
              newOutputs[`STEP_${stepId}_A`] = sectionAMatch[1].trim();
            }
            if (sectionBMatch) {
              newOutputs[`STEP_${stepId}_B`] = sectionBMatch[1].trim();
            }
          }
        }
      });
      
      setStepOutputs(prev => ({ ...prev, ...newOutputs }));
      
      if (execution.status === 'completed') {
        setIsAutoRunning(false);
      } else if (execution.status === 'error') {
        setError(execution.error || 'Workflow execution failed');
        setIsAutoRunning(false);
      } else {
        // Continue polling
        setTimeout(() => pollWorkflowStatus(id), 2000);
      }
    } catch (error) {
      console.error('Error polling workflow status:', error);
      setError('Failed to get workflow status');
      setIsAutoRunning(false);
    }
  };

  const updatePrompt = (stepIndex, newPrompt) => {
    setPrompts(prev => prev.map((step, index) => 
      index === stepIndex ? { ...step, prompt: newPrompt } : step
    ));
    setEditingPrompt(null);
  };

  const getLLMBadgeColor = (llm) => {
    switch (llm) {
      case 'Perplexity': return 'bg-blue-100 text-blue-800';
      case 'Claude Sonnet': return 'bg-orange-100 text-orange-800';
      case 'ChatGPT': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const validateBusinessData = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/validate-business-data`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(businessData)
      });

      if (!response.ok) {
        throw new Error('Validation failed');
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error validating business data:', error);
      return { isValid: false, missingFields: [] };
    }
  };

  const BusinessDataForm = () => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-bold text-gray-900 mb-2">Business Information</h2>
        <p className="text-gray-600">Provide your business details to customize the naming workflow</p>
      </div>
      
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Industry/Sector *</label>
            <input
              type="text"
              value={businessData.industry}
              onChange={(e) => setBusinessData(prev => ({ ...prev, industry: e.target.value }))}
              placeholder="e.g., Commercial Real Estate Appraisal"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Service Specialization *</label>
            <input
              type="text"
              value={businessData.serviceSpecialization}
              onChange={(e) => setBusinessData(prev => ({ ...prev, serviceSpecialization: e.target.value }))}
              placeholder="e.g., Multifamily and Self-Storage Properties"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Geographic Market *</label>
            <input
              type="text"
              value={businessData.geographicMarket}
              onChange={(e) => setBusinessData(prev => ({ ...prev, geographicMarket: e.target.value }))}
              placeholder="e.g., Western Canada - Alberta, BC, Saskatchewan, Manitoba"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Business Type *</label>
            <input
              type="text"
              value={businessData.businessType}
              onChange={(e) => setBusinessData(prev => ({ ...prev, businessType: e.target.value }))}
              placeholder="e.g., Professional Services Firm"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Target Clients</label>
            <input
              type="text"
              value={businessData.targetClients}
              onChange={(e) => setBusinessData(prev => ({ ...prev, targetClients: e.target.value }))}
              placeholder="e.g., Property investors, developers, lenders"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Professional Certifications</label>
            <input
              type="text"
              value={businessData.certifications}
              onChange={(e) => setBusinessData(prev => ({ ...prev, certifications: e.target.value }))}
              placeholder="e.g., AACI, CRA, 15+ years experience"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Key Differentiators</label>
            <textarea
              value={businessData.keyDifferentiators}
              onChange={(e) => setBusinessData(prev => ({ ...prev, keyDifferentiators: e.target.value }))}
              placeholder="e.g., AACI Certified, 15+ years experience, specialized in complex valuations"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              rows="3"
            />
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Value Proposition</label>
            <textarea
              value={businessData.valueProp}
              onChange={(e) => setBusinessData(prev => ({ ...prev, valueProp: e.target.value }))}
              placeholder="e.g., Fast turnaround, accurate valuations, comprehensive market analysis"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              rows="3"
            />
          </div>
        </div>
        
        <div className="mt-6 flex gap-4">
          <button
            onClick={async () => {
              const validation = await validateBusinessData();
              
              if (!validation.isValid) {
                alert(`Please fill in required fields: ${validation.missingFields.join(', ')}`);
                return;
              }
              
              setShowBusinessForm(false);
            }}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
          >
            Start Naming Workflow
          </button>
          <button
            onClick={() => {
              setBusinessData({
                industry: 'Commercial Real Estate Appraisal',
                serviceSpecialization: 'Multifamily and Self-Storage Properties',
                geographicMarket: 'Western Canada - Alberta, BC, Saskatchewan, Manitoba',
                businessType: 'Professional Services Firm',
                keyDifferentiators: 'AACI Certified, 15+ years experience, specialized in complex valuations',
                targetClients: 'Property investors, developers, lenders',
                companySize: 'Small firm (2-5 appraisers)',
                valueProp: 'Fast turnaround, accurate valuations, comprehensive market analysis',
                certifications: 'AACI, CRA'
              });
            }}
            className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 font-medium"
          >
            Load Example Data
          </button>
        </div>
      </div>
    </div>
  );

  if (showBusinessForm) {
    return (
      <div className="max-w-4xl mx-auto p-6 bg-gray-50 min-h-screen">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Company Naming Workflow</h1>
          <p className="text-gray-600">Multi-stage prompt chaining for optimized naming strategy</p>
        </div>
        <BusinessDataForm />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 bg-gray-50 min-h-screen">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <span className="text-red-600 font-medium">Error: {error}</span>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Company Naming Workflow Dashboard</h1>
          <p className="text-gray-600">Multi-stage prompt chaining for optimized naming strategy</p>
          
          <div className="flex gap-4 mt-4">
            <button
              onClick={() => executeStep(currentStep)}
              disabled={isRunning || isAutoRunning}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {isRunning ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
              Execute Current Step
            </button>
            
            <button
              onClick={runAllSteps}
              disabled={isRunning || isAutoRunning}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
            >
              {isAutoRunning ? <RefreshCw className="w-4 h-4 animate-spin" /> : <SkipForward className="w-4 h-4" />}
              Run All Steps
            </button>
            
            <button
              onClick={() => setShowBusinessForm(true)}
              className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
            >
              <Edit3 className="w-4 h-4" />
              Edit Business Data
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h2 className="text-lg font-semibold mb-4">Workflow Steps</h2>
            <div className="space-y-2">
              {prompts.map((step, index) => (
                <div
                  key={step.id}
                  onClick={() => setCurrentStep(index)}
                  className={`p-3 rounded-lg cursor-pointer border-2 transition-all ${
                    currentStep === index 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Step {step.id}</span>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getLLMBadgeColor(step.llm)}`}>
                        {step.llm}
                      </span>
                      {stepOutputs[`STEP_${step.id}_OUTPUT`] && (
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 font-medium">{step.title}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold">Step {prompts[currentStep]?.id}: {prompts[currentStep]?.title}</h3>
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium mt-2 ${getLLMBadgeColor(prompts[currentStep]?.llm)}`}>
                    {prompts[currentStep]?.llm}
                  </span>
                </div>
                <button
                  onClick={() => setEditingPrompt(currentStep)}
                  className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-800"
                >
                  <Edit3 className="w-4 h-4" />
                  Edit Prompt
                </button>
              </div>
            </div>

            <div className="p-4">
              {editingPrompt === currentStep ? (
                <div className="space-y-4">
                  <textarea
                    value={prompts[currentStep]?.prompt || ''}
                    onChange={(e) => updatePrompt(currentStep, e.target.value)}
                    className="w-full h-64 p-3 border border-gray-300 rounded-lg resize-none font-mono text-sm"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => setEditingPrompt(null)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      Save Changes
                    </button>
                    <button
                      onClick={() => setEditingPrompt(null)}
                      className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Prompt:</h4>
                    <div className="bg-gray-50 p-3 rounded-lg border">
                      <pre className="text-sm text-gray-700 whitespace-pre-wrap font-mono">
                        {prompts[currentStep]?.prompt || ''}
                      </pre>
                    </div>
                  </div>

                  {stepOutputs[`STEP_${prompts[currentStep]?.id}_OUTPUT`] && (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Output:</h4>
                      <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                        <pre className="text-sm text-gray-700 whitespace-pre-wrap">
                          {stepOutputs[`STEP_${prompts[currentStep]?.id}_OUTPUT`]}
                        </pre>
                      </div>
                    </div>
                  )}

                  {(isRunning || isAutoRunning) && (
                    <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                      <div className="flex items-center gap-2">
                        <RefreshCw className="w-4 h-4 animate-spin text-blue-600" />
                        <span className="text-blue-600 font-medium">
                          Processing with {prompts[currentStep]?.llm}...
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromptChainingDashboard;