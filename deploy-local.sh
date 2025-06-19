#!/bin/bash

echo "🚀 Starting Company Naming Workflow..."
echo "📋 This will start both the backend API and open the frontend"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Build the backend
echo "🔨 Building backend..."
npm run build

# Start the backend server in background
echo "🚀 Starting backend server on http://localhost:3001..."
npm start &
SERVER_PID=$!

# Wait a moment for server to start
sleep 3

# Check if server is running
if curl -s http://localhost:3001/health > /dev/null; then
    echo "✅ Backend server is running!"
    echo "📊 Health check: http://localhost:3001/health"
    echo "🔗 API endpoint: http://localhost:3001/api/workflow"
    echo ""
    
    # Open the standalone app in default browser
    echo "🌐 Opening frontend application..."
    if command -v open &> /dev/null; then
        # macOS
        open standalone-app.html
    elif command -v xdg-open &> /dev/null; then
        # Linux
        xdg-open standalone-app.html
    elif command -v start &> /dev/null; then
        # Windows
        start standalone-app.html
    else
        echo "Please open standalone-app.html in your browser"
    fi
    
    echo ""
    echo "🎯 Company Naming Workflow is now running!"
    echo "   - Backend API: http://localhost:3001"
    echo "   - Frontend: Opens in your default browser"
    echo ""
    echo "Press Ctrl+C to stop the server"
    
    # Wait for user to stop
    wait $SERVER_PID
else
    echo "❌ Failed to start backend server"
    kill $SERVER_PID 2>/dev/null
    exit 1
fi