# 🚀 One-Click Deployment Options

## Option 1: Deploy to Vercel (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fben-crowe%2Fcompany-naming-workflow-backend&env=ANTHROPIC_API_KEY,OPENAI_API_KEY,PERPLEXITY_API_KEY,NODE_ENV&envDescription=API%20keys%20for%20LLM%20integrations&envLink=https%3A%2F%2Fgithub.com%2Fben-crowe%2Fcompany-naming-workflow-backend%2Fblob%2Fmain%2FREADME.md)

**Steps:**
1. Click the "Deploy with Vercel" button above
2. Connect your GitHub account if prompted
3. The repository will be automatically imported
4. Add your API keys in the environment variables form:
   - `ANTHROPIC_API_KEY`: `your_anthropic_api_key_here`
   - `OPENAI_API_KEY`: `your_openai_api_key_here`
   - `PERPLEXITY_API_KEY`: `your_perplexity_api_key_here`
   - `NODE_ENV`: `production`
5. Click "Deploy"
6. Get your live URL!

## Option 2: Deploy to Railway

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/template/q6Vdqz?referralCode=claude-code)

**Steps:**
1. Click "Deploy on Railway" button above
2. Connect GitHub account
3. Add environment variables
4. Deploy!

## Option 3: Deploy to Render

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/ben-crowe/company-naming-workflow-backend)

## Manual Deployment

If one-click deployment doesn't work, follow these steps:

### Vercel Manual Setup
1. Go to [vercel.com](https://vercel.com)
2. Sign up with GitHub
3. Click "Import Project"
4. Enter repository URL: `https://github.com/ben-crowe/company-naming-workflow-backend`
5. Configure environment variables (see API keys above)
6. Deploy!

### Railway Manual Setup
1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub
3. Click "Deploy from GitHub repo"
4. Select your repository
5. Add environment variables
6. Deploy!

## Testing Your Deployment

Once deployed, test your API:

```bash
# Replace with your actual deployment URL
curl https://your-app-name.vercel.app/api/workflow/health

# Should return:
{
  "status": "healthy",
  "timestamp": "2025-06-19T20:30:16.030Z",
  "version": "1.0.0"
}
```

## Get Your Frontend Connected

1. Copy `frontend-production.jsx` to your React app
2. Update `API_BASE_URL` to your deployment URL
3. Deploy your frontend
4. You now have a complete live system!

## Expected Results

✅ **Backend API Live**: Your naming workflow API running on professional hosting
✅ **Real LLM Integration**: Perplexity, ChatGPT, and Claude Sonnet APIs working
✅ **Auto-deployment**: Push to GitHub = automatic deployment updates
✅ **Production Ready**: Error handling, logging, monitoring included

Your Company Naming Workflow will be live and processing real business naming requests! 🎉