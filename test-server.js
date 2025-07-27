const { exec } = require('child_process');
const http = require('http');

console.log('Starting development server...');

const devProcess = exec('npm run dev', { 
  cwd: '/home/sali/ai/projects/projecthubv3/ultimate-ai-dashboard',
  env: { ...process.env, NODE_ENV: 'development' }
});

devProcess.stdout.on('data', (data) => {
  console.log(data.toString());
  if (data.includes('Ready in')) {
    console.log('✅ Server is ready!');
    checkServer();
  }
});

devProcess.stderr.on('data', (data) => {
  console.error('Error:', data.toString());
});

function checkServer() {
  console.log('Checking server response...');
  
  http.get('http://localhost:3000/visual-intelligence', (res) => {
    console.log('Status Code:', res.statusCode);
    
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      if (res.statusCode === 500) {
        console.error('❌ Server returned 500 error');
        console.log('Response preview:', data.substring(0, 500));
      } else if (res.statusCode === 200) {
        console.log('✅ Page loaded successfully');
      }
    });
  }).on('error', (err) => {
    console.error('Request error:', err);
  });
}

// Keep process alive
process.on('SIGINT', () => {
  console.log('Shutting down...');
  devProcess.kill();
  process.exit();
});