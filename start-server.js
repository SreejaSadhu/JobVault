import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('Starting JobVault server...');
console.log('Make sure you have set up your .env file with:');
console.log('- MONGO_URI');
console.log('- KEY (JWT secret)');
console.log('- FRONTEND_URL');

const serverProcess = spawn('node', ['src/server-side/index.js'], {
  cwd: __dirname,
  stdio: 'inherit',
  env: { ...process.env, NODE_ENV: 'development' }
});

serverProcess.on('error', (error) => {
  console.error('Failed to start server:', error);
});

serverProcess.on('close', (code) => {
  console.log(`Server process exited with code ${code}`);
}); 