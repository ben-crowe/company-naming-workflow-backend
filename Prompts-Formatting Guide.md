Here are the two key pieces in your V0 app where you:

1. **Instruct the model to avoid Markdown**  
2. **Post‐process its output to strip any formatting**  

---  

**1. “System” instructions in the prompt**  
  
In your Next.js API route (`generateStepPrompt`), you prepend every step with a block that tells the model to return plain text only—no Markdown, bullets, headers, etc.:

```120:139:v0-app/app/api/workflow/execute-step/route.ts
  const baseContext = `
  Business Context:
  - Industry: ${industry}
  - Specialization: ${serviceSpecialization}
  - Geographic Market: ${geographicMarket}
  - Business Type: ${businessType}
  - Target Clients: ${targetClients}
  - Certifications: ${certifications}
  - Key Differentiators: ${keyDifferentiators}
  - Value Proposition: ${valueProp}

  IMPORTANT: Return your response in plain text format only. Do not use ANY markdown formatting including:
  - Do NOT use ** for bold text (just write the text normally)
  - Do NOT use #### for headers (just write the text normally)
  - Do NOT use - or • for bullet points (just write as numbered lists or paragraphs)
  - Do NOT use any special characters for formatting
  Use simple line breaks, numbered lists (1. 2. 3.), and clear paragraphs only. Write everything in plain text that can be read easily without any formatting symbols.
  `
```

**2. Stripping out any residual Markdown**  

Immediately after you get the raw LLM output, you run it through this helper:

```84:108:v0-app/app/api/workflow/execute-step/route.ts
// Strip markdown formatting and apply clean professional formatting
function stripMarkdownFormatting(text: string): string {
  const cleaned = text
    // Remove headers (###, ####, etc.)
    .replace(/^#{1,6}\s+/gm, '')
    // Remove bold (**text** and __text__)
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/__(.*?)__/g, '$1')
    // Remove italic (*text* and _text_)
    .replace(/\*(.*?)\*/g, '$1')
    .replace(/_(.*?)_/g, '$1')
    // Remove bullet points (- and •)
    .replace(/^[\s]*[-•]\s+/gm, '')
    // Remove numbered lists formatting (keep the numbers but clean spacing)
    .replace(/^(\d+\.)\s+/gm, '$1 ')
    // Clean up extra whitespace
    .replace(/\n\s*\n\s*\n/g, '\n\n')
    .trim()

  // Apply selective formatting (re‐bold critical headers only)
  return cleaned
    .replace(/^(\d+\.\s)/gm, '**$1**')
    .replace(/^(\([A-Z]\)[^:]*:)/gm, '**$1**')
    .replace(/^([A-Za-z][A-Za-z\s&\-(),']*:)\s*$/gm, '**$1**')
}
```

And then, right after you call your LLM:

```350:350:v0-app/app/api/workflow/execute-step/route.ts
    // Strip all markdown formatting from AI output
    output = stripMarkdownFormatting(output)
```

Together, that “IMPORTANT: …” block and the `stripMarkdownFormatting` step ensure you get back clean, plain-text responses in a simple numbered/list format. Let me know if you’d like to tweak any of those rules!