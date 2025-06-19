# 🚀 Complete Deployment Guide

## Step 1: Deploy Backend to Vercel

### Option A: CLI Deployment (Recommended)
```bash
# 1. Login to Vercel
vercel login

# 2. Run complete deployment script
./complete-deployment.sh
```

### Option B: Web Dashboard Deployment
1. Go to [vercel.com](https://vercel.com)
2. Click "Import Project"
3. Select GitHub repo: `ben-crowe/company-naming-workflow-backend`
4. Add environment variables:
   - `ANTHROPIC_API_KEY`: `your_anthropic_api_key_here`
   - `OPENAI_API_KEY`: `your_openai_api_key_here`
   - `PERPLEXITY_API_KEY`: `your_perplexity_api_key_here`
   - `NODE_ENV`: `production`
5. Click "Deploy"

## Step 2: Get Your Live API URL

After deployment, your API will be available at:
```
https://company-naming-workflow-backend.vercel.app
```

Test it:
```bash
curl https://company-naming-workflow-backend.vercel.app/api/workflow/health
```

## Step 3: Deploy Frontend

### For React App:
1. **Copy the production frontend component:**
   ```bash
   cp frontend-production.jsx src/components/PromptChainingDashboard.jsx
   ```

2. **Copy environment variables:**
   ```bash
   cp .env.frontend .env
   ```

3. **Update API URL if needed** (it's pre-configured for Vercel)

### For Next.js App:
1. Create new Next.js app:
   ```bash
   npx create-next-app@latest company-naming-frontend
   cd company-naming-frontend
   ```

2. Copy component and update imports
3. Add environment variables to `.env.local`

### Deploy Frontend to Vercel:
```bash
cd your-frontend-project
vercel
```

## Step 4: Test Complete Integration

### Health Check:
```bash
curl https://company-naming-workflow-backend.vercel.app/api/workflow/health
```

### Frontend Test:
1. Open your deployed frontend
2. Fill in business data
3. Click "Test API Connection"
4. Should see "✅ Connected to live API backend!"

### Full Workflow Test:
1. Complete business form
2. Click "Execute Current Step" (Step 1)
3. Should get real market research from Perplexity
4. Try "Run All Steps" for complete automation

## 🔄 Live Changes Workflow

### Backend Changes:
```bash
# Make changes to backend code
git add .
git commit -m "Update backend feature"
git push
# Vercel auto-deploys in ~30 seconds
```

### Frontend Changes:
```bash
# Make changes to frontend code
git add .
git commit -m "Update frontend feature"  
git push
# Vercel auto-deploys in ~30 seconds
```

## 📊 Monitoring & Debugging

### Vercel Dashboard:
- View deployment logs
- Monitor API performance
- Check function execution times
- View error rates

### API Endpoints:
- Health: `/api/workflow/health`
- Steps: `/api/workflow/steps`
- Execute: `/api/workflow/execute-step`
- Workflow: `/api/workflow/execute-workflow`

### Debug Checklist:
1. ✅ Environment variables set in Vercel
2. ✅ API health check returns 200
3. ✅ Frontend shows "API Status: Connected"
4. ✅ LLM services responding (check logs)
5. ✅ CORS configured for frontend domain

## 🎯 Production URLs

**Backend API**: https://company-naming-workflow-backend.vercel.app
**Frontend**: https://your-frontend-app.vercel.app

## 🚨 Troubleshooting

### Function Timeout:
- Increase timeout in `vercel.json`
- Break down complex operations
- Use async processing for long workflows

### API Key Issues:
- Verify all keys in Vercel environment variables
- Check key format and permissions
- Test individual LLM services

### CORS Errors:
- Add frontend domain to `ALLOWED_ORIGINS`
- Redeploy backend after environment changes

Your Company Naming Workflow is now live with real LLM integrations! 🎉