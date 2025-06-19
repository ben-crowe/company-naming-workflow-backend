# Deployment Guide

## 🚀 Deploy to Vercel (Recommended)

### Prerequisites
1. Vercel account (free at vercel.com)
2. API keys for Anthropic, OpenAI, and Perplexity

### Step 1: Login to Vercel
```bash
vercel login
```
Choose your preferred login method (GitHub recommended).

### Step 2: Deploy
```bash
npm run build
vercel --prod
```

Or use the deploy script:
```bash
./deploy.sh
```

### Step 3: Configure Environment Variables
In your Vercel dashboard (vercel.com/dashboard):

1. Go to your project → Settings → Environment Variables
2. Add these variables:
   - `ANTHROPIC_API_KEY`: `your_anthropic_api_key_here`
   - `OPENAI_API_KEY`: `your_openai_api_key_here`
   - `PERPLEXITY_API_KEY`: `your_perplexity_api_key_here`

### Step 4: Test Deployment
```bash
curl https://your-deployment-url.vercel.app/api/workflow/health
```

## 🔄 Update Frontend
Update your React frontend's API_BASE_URL:
```javascript
const API_BASE_URL = 'https://your-deployment-url.vercel.app/api/workflow';
```

## 📊 Monitoring
- View logs in Vercel dashboard
- Monitor function execution times
- Check error rates and performance

## 🔧 Troubleshooting

### Function Timeout
If functions timeout (30s limit), consider:
- Breaking down complex workflows
- Using async processing with status polling
- Optimizing LLM prompts

### Environment Variables
- Ensure all API keys are set correctly
- Variables are case-sensitive
- Redeploy after changing environment variables

### CORS Issues
Update ALLOWED_ORIGINS in environment variables:
```
ALLOWED_ORIGINS=https://your-frontend-domain.com,http://localhost:3000
```