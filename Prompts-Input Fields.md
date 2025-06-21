Here are the nine pieces of business input you start with, along with their placeholder text and the example values the “Load Example Data” button fills in:

• Industry/Sector  
  – Placeholder: “e.g., Commercial Real Estate Appraisal”  
  – Example: Commercial Real Estate Appraisal

• Service Specialization  
  – Placeholder: “e.g., Multifamily and Self-Storage Properties”  
  – Example: Multifamily and Self-Storage Properties

• Geographic Market  
  – Placeholder: “e.g., Western Canada – Alberta, BC, Saskatchewan, Manitoba”  
  – Example: Western Canada – Alberta, BC, Saskatchewan, Manitoba

• Business Type  
  – Placeholder: “e.g., Professional Services Firm”  
  – Example: Professional Services Firm

• Target Clients  
  – Placeholder: “e.g., Property investors, developers, lenders”  
  – Example: Property investors, developers, lenders

• Professional Certifications  
  – Placeholder: “e.g., AACI, CRA, 15+ years experience”  
  – Example: AACI, CRA

• Key Differentiators  
  – Placeholder: “e.g., AACI Certified, 15+ years experience, specialized in complex valuations”  
  – Example: AACI Certified, 15+ years experience, specialized in complex valuations

• Value Proposition  
  – Placeholder: “e.g., Fast turnaround, accurate valuations, comprehensive market analysis”  
  – Example: Fast turnaround, accurate valuations, comprehensive market analysis

• Company Size  
  – Not a user‐filled field in the form (it’s hard-coded in the collector)  
  – Default: Small firm


  -------------------

### Input Fields for the APP UI - User Biz Info
Here are the eight inputs your initial workflow form presents (with their placeholder “filler” text), plus the example‐data loader and the collector that bundles them into your `BusinessData` object (including the hard-coded `companySize`):

**1. Form fields & placeholders**  
```37:48:standalone-app.html
<div>
  <label class="block text-sm font-medium text-gray-700 mb-2">Industry/Sector *</label>
  <input type="text"
         id="industry"
         placeholder="e.g., Commercial Real Estate Appraisal"
         class="…">
</div>
<div>
  <label class="block text-sm font-medium text-gray-700 mb-2">Service Specialization *</label>
  <input type="text"
         id="serviceSpecialization"
         placeholder="e.g., Multifamily and Self-Storage Properties"
         class="…">
</div>
<div>
  <label class="block text-sm font-medium text-gray-700 mb-2">Geographic Market *</label>
  <input type="text"
         id="geographicMarket"
         placeholder="e.g., Western Canada - Alberta, BC, Saskatchewan, Manitoba"
         class="…">
</div>
<div>
  <label class="block text-sm font-medium text-gray-700 mb-2">Business Type *</label>
  <input type="text"
         id="businessType"
         placeholder="e.g., Professional Services Firm"
         class="…">
</div>
```

```49:65:standalone-app.html
<div>
  <label class="block text-sm font-medium text-gray-700 mb-2">Target Clients</label>
  <input type="text"
         id="targetClients"
         placeholder="e.g., Property investors, developers, lenders"
         class="…">
</div>
<div>
  <label class="block text-sm font-medium text-gray-700 mb-2">Professional Certifications</label>
  <input type="text"
         id="certifications"
         placeholder="e.g., AACI, CRA, 15+ years experience"
         class="…">
</div>
<div class="md:col-span-2">
  <label class="block text-sm font-medium text-gray-700 mb-2">Key Differentiators</label>
  <textarea id="keyDifferentiators"
            placeholder="e.g., AACI Certified, 15+ years experience, specialized in complex valuations"
            class="…"></textarea>
</div>
<div class="md:col-span-2">
  <label class="block text-sm font-medium text-gray-700 mb-2">Value Proposition</label>
  <textarea id="valueProp"
            placeholder="e.g., Fast turnaround, accurate valuations, comprehensive market analysis"
            class="…"></textarea>
</div>
```

**2. The “Load Example Data” filler values**  
```364:372:standalone-app.html
// Load example data
function loadExampleData() {
    document.getElementById('industry').value = 'Commercial Real Estate Appraisal';
    document.getElementById('serviceSpecialization').value = 'Multifamily and Self-Storage Properties';
    document.getElementById('geographicMarket').value = 'Western Canada - Alberta, BC, Saskatchewan, Manitoba';
    document.getElementById('businessType').value = 'Professional Services Firm';
    document.getElementById('targetClients').value = 'Property investors, developers, lenders';
    document.getElementById('certifications').value = 'AACI, CRA';
    document.getElementById('keyDifferentiators').value = 'AACI Certified, 15+ years experience, specialized in complex valuations';
    document.getElementById('valueProp').value = 'Fast turnaround, accurate valuations, comprehensive market analysis';
    updateStatus('✅ Example business data loaded!', 'success');
}
```

**3. How those fields become your `BusinessData`**  
```389:397:standalone-app.html
// Collect business data
function collectBusinessData() {
    return {
        industry: document.getElementById('industry').value,
        serviceSpecialization: document.getElementById('serviceSpecialization').value,
        geographicMarket: document.getElementById('geographicMarket').value,
        businessType: document.getElementById('businessType').value,
        targetClients: document.getElementById('targetClients').value,
        certifications: document.getElementById('certifications').value,
        keyDifferentiators: document.getElementById('keyDifferentiators').value,
        valueProp: document.getElementById('valueProp').value,
        companySize: 'Small firm'
    };
}
```

That gives you the full list of inputs, their placeholder text, the mock/example values, and the final shape of `BusinessData` (including the hard-coded `companySize`). Let me know if you need anything else!