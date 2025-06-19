# 🚀 Vercel Deployment with GitHub Integration

## Automatic Deployments Setup

### Step 1: Connect GitHub to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Click "Import Project"
3. Select your GitHub repository: `ben-crowe/company-naming-workflow-backend`
4. Configure project settings:
   - **Framework Preset**: Other
   - **Root Directory**: ./
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

### Step 2: Add Environment Variables
In Vercel dashboard → Settings → Environment Variables:

```
ANTHROPIC_API_KEY=your_anthropic_api_key_here
OPENAI_API_KEY=your_openai_api_key_here
PERPLEXITY_API_KEY=your_perplexity_api_key_here
NODE_ENV=production
```

### Step 3: Deploy
1. Click "Deploy" in Vercel
2. Wait for build to complete
3. Test your API at: `https://your-project-name.vercel.app/api/workflow/health`

## ✅ Live Changes Workflow

Once connected to GitHub:

1. **Make changes** to your code locally
2. **Commit & push** to GitHub:
   ```bash
   git add .
   git commit -m "Your update message"
   git push
   ```
3. **Vercel automatically deploys** your changes
4. **Live in ~30 seconds** 🚀

## 🔗 Your Deployment URL
After deployment, your API will be available at:
`https://company-naming-workflow-backend.vercel.app`

Update your frontend to use this URL:
```javascript
const API_BASE_URL = 'https://company-naming-workflow-backend.vercel.app/api/workflow';
```

## 📊 Monitor Your API
- **Vercel Dashboard**: View logs, performance, usage
- **GitHub Actions**: See deployment status
- **Real-time**: Every push triggers automatic deployment