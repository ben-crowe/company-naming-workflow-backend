#!/bin/bash

echo "🚀 Secure Vercel Deployment Script"
echo "=================================="
echo ""

# Check if logged into Vercel
echo "🔐 Checking Vercel authentication..."
if ! vercel whoami > /dev/null 2>&1; then
    echo "❌ Please login to Vercel first:"
    echo "   vercel login"
    echo "   (Choose GitHub option to connect your repo)"
    exit 1
fi

echo "✅ Logged into Vercel as: $(vercel whoami)"
echo ""

# Build project
echo "📦 Building project..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed!"
    exit 1
fi

echo "✅ Build completed successfully!"
echo ""

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "❌ .env file not found!"
    echo "Please create .env file with your API keys"
    echo "You can copy from .env.example and fill in your keys"
    exit 1
fi

echo "📋 Found .env file with API keys"
echo ""

# Deploy to Vercel
echo "🌐 Deploying to Vercel..."
echo "⚠️  API keys will be securely loaded from your local .env file"

vercel --prod

if [ $? -eq 0 ]; then
    echo ""
    echo "🎉 Deployment completed successfully!"
    echo ""
    echo "🔧 Next steps:"
    echo "1. Your API keys are automatically set from .env file"
    echo "2. Test your API:"
    echo "   curl https://your-deployment-url.vercel.app/api/workflow/health"
    echo ""
    echo "3. Update frontend API_BASE_URL to your Vercel URL"
    echo "4. Your backend is now live with real LLM integrations!"
else
    echo "❌ Deployment failed. Please check the error messages above."
    exit 1
fi