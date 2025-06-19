#!/usr/bin/env node

/**
 * Automated Deployment Helper
 * This script helps automate the deployment process
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Automated Deployment Helper');
console.log('================================\n');

// Check if we're in the right directory
if (!fs.existsSync('package.json')) {
  console.error('❌ Please run this script from the project root directory');
  process.exit(1);
}

// Check if required files exist
const requiredFiles = [
  'package.json',
  'vercel.json',
  '.env',
  'src/server.ts'
];

console.log('📋 Checking required files...');
for (const file of requiredFiles) {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file}`);
  } else {
    console.log(`❌ ${file} - Missing!`);
    if (file === '.env') {
      console.log('   Copy .env.example to .env and add your API keys');
    }
  }
}

console.log('\n📦 Building project...');
try {
  execSync('npm run build', { stdio: 'inherit' });
  console.log('✅ Build successful!');
} catch (error) {
  console.error('❌ Build failed!');
  process.exit(1);
}

console.log('\n🔐 Checking Vercel authentication...');
try {
  const vercelUser = execSync('vercel whoami', { encoding: 'utf8' }).trim();
  console.log(`✅ Logged in as: ${vercelUser}`);
  
  console.log('\n🌐 Deploying to Vercel...');
  execSync('vercel --prod', { stdio: 'inherit' });
  
  console.log('\n🎉 Deployment completed!');
  console.log('\n📋 Next steps:');
  console.log('1. Check your Vercel dashboard for the deployment URL');
  console.log('2. Test your API: curl https://your-url.vercel.app/api/workflow/health');
  console.log('3. Update frontend API_BASE_URL to your deployment URL');
  console.log('4. Deploy your frontend');
  
} catch (error) {
  console.log('❌ Not logged into Vercel');
  console.log('\n🔧 To complete deployment:');
  console.log('1. Run: vercel login');
  console.log('2. Choose "Continue with GitHub"');
  console.log('3. Run this script again');
  console.log('\nOr use the one-click deploy options in EASY_DEPLOY.md');
}

console.log('\n🌟 Your Company Naming Workflow is ready for production!');
console.log('   Real LLM integrations with Perplexity, ChatGPT, and Claude');
console.log('   Automated 9-step naming strategy generation');
console.log('   Professional hosting with auto-deployment');