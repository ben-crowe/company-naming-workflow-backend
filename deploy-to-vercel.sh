#!/bin/bash

echo "🚀 Deploying Company Naming Workflow Backend to Vercel..."
echo ""

# Check if logged into Vercel
if ! vercel whoami > /dev/null 2>&1; then
    echo "❌ Not logged into Vercel. Please run:"
    echo "   vercel login"
    exit 1
fi

echo "✅ Logged into Vercel as: $(vercel whoami)"
echo ""

# Build the project
echo "📦 Building project..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed!"
    exit 1
fi

echo "✅ Build successful!"
echo ""

# Deploy to Vercel
echo "🌐 Deploying to Vercel..."
vercel --prod

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Deployment successful!"
    echo ""
    echo "🔧 Next steps:"
    echo "1. Set environment variables in Vercel dashboard:"
    echo "   - ANTHROPIC_API_KEY"
    echo "   - OPENAI_API_KEY" 
    echo "   - PERPLEXITY_API_KEY"
    echo ""
    echo "2. Test your API:"
    echo "   curl https://your-deployment-url.vercel.app/api/workflow/health"
    echo ""
    echo "3. Update frontend API_BASE_URL to your Vercel URL"
else
    echo "❌ Deployment failed!"
    exit 1
fi