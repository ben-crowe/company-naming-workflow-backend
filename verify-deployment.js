#!/usr/bin/env node

/**
 * Quick Deployment Verification
 * Tests if the Vercel deployment is working
 */

const https = require('https');

async function verifyDeployment(url) {
    console.log('🔍 Verifying Vercel Deployment...');
    console.log(`📡 Testing: ${url}\n`);
    
    try {
        const response = await new Promise((resolve, reject) => {
            https.get(`${url}/api/workflow/health`, (res) => {
                let data = '';
                res.on('data', chunk => data += chunk);
                res.on('end', () => {
                    try {
                        resolve({ 
                            status: res.statusCode, 
                            data: JSON.parse(data) 
                        });
                    } catch (e) {
                        resolve({ 
                            status: res.statusCode, 
                            data: data 
                        });
                    }
                });
            }).on('error', reject);
        });
        
        if (response.status === 200 && response.data.status === 'healthy') {
            console.log('🎉 DEPLOYMENT SUCCESSFUL!');
            console.log('✅ API is live and responding');
            console.log(`✅ Health check: ${response.data.status}`);
            console.log(`✅ Timestamp: ${response.data.timestamp}`);
            
            console.log('\n🚀 Your API Endpoints:');
            console.log(`   Health: ${url}/api/workflow/health`);
            console.log(`   Steps: ${url}/api/workflow/steps`);
            console.log(`   Execute: ${url}/api/workflow/execute-step`);
            
            console.log('\n📋 Next Steps:');
            console.log('1. Update frontend API_BASE_URL to:', `${url}/api/workflow`);
            console.log('2. Deploy your frontend');
            console.log('3. Start generating company names! 🎯');
            
            return true;
        } else {
            console.log('❌ Deployment issue detected');
            console.log(`   Status: ${response.status}`);
            console.log(`   Response: ${JSON.stringify(response.data, null, 2)}`);
            return false;
        }
        
    } catch (error) {
        console.log('❌ Deployment verification failed');
        console.log(`   Error: ${error.message}`);
        console.log('\n🔧 Possible issues:');
        console.log('   - Deployment still in progress');
        console.log('   - Environment variables not set');
        console.log('   - Build errors in Vercel logs');
        return false;
    }
}

// Usage
const deploymentURL = process.argv[2];

if (!deploymentURL) {
    console.log('📝 Usage: node verify-deployment.js <your-vercel-url>');
    console.log('📝 Example: node verify-deployment.js https://your-app.vercel.app');
    process.exit(1);
}

verifyDeployment(deploymentURL);