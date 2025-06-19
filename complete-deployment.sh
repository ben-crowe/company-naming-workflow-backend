#!/bin/bash

echo "🚀 Complete Vercel Deployment Script"
echo "===================================="
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

# Deploy to Vercel (environment variables will be loaded from .env file)
echo "🌐 Deploying to Vercel..."
echo "⚠️  Make sure your API keys are set in Vercel dashboard or use deploy-secure.sh"
vercel --prod

if [ $? -eq 0 ]; then
    echo ""
    echo "🎉 Deployment completed successfully!"
    echo ""
    echo "🔗 Your API is now live!"
    echo "📋 Next: Test your deployment and get the URL"
else
    echo "❌ Deployment failed. Please check the error messages above."
    exit 1
fi