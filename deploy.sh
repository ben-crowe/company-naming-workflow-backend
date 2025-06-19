#!/bin/bash

echo "🚀 Deploying Company Naming Workflow Backend to Vercel..."

# Build the project
echo "📦 Building project..."
npm run build

# Deploy to Vercel
echo "🌐 Deploying to Vercel..."
vercel --prod

echo "✅ Deployment complete!"
echo ""
echo "🔧 Don't forget to set environment variables in Vercel dashboard:"
echo "   - ANTHROPIC_API_KEY"
echo "   - OPENAI_API_KEY"
echo "   - PERPLEXITY_API_KEY"
echo ""
echo "📋 Test your deployment:"
echo "   curl https://your-deployment-url.vercel.app/api/workflow/health"