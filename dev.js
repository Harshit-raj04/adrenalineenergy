const { spawn } = require('node:child_process');
const path = require('node:path');

console.log('🏎️  Starting Adrenaline Energy Full-Stack Suite (Vite FE + Express BE)...');

// 1. Launch Backend API (Express on Port 5001)
const backend = spawn('node', ['server.js'], {
  cwd: path.join(__dirname, 'backend'),
  stdio: 'inherit',
  env: {
    ...process.env,
    PORT: process.env.PORT || '5001',
    NODE_ENV: 'development'
  }
});

backend.on('error', (err) => {
  console.error('❌ Backend failed to start:', err.message);
});

backend.on('exit', (code, signal) => {
  console.log(`⚠️  Backend process exited with code ${code} (${signal})`);
});

// 2. Launch Frontend (Vite on Port 5173)
const viteBin = path.join(__dirname, 'adrenaline-app', 'node_modules', '.bin', 'vite');
const frontend = spawn(viteBin, ['--clearScreen', 'false', '--host'], {
  cwd: path.join(__dirname, 'adrenaline-app'),
  stdio: 'inherit',
  env: process.env
});

frontend.on('error', (err) => {
  console.error('❌ Frontend (Vite) failed to start:', err.message);
});

// Handle termination signals cleanly
const shutdown = () => {
  console.log('\n🛑 Shutting down Adrenaline services...');
  try { backend.kill('SIGTERM'); } catch {}
  try { frontend.kill('SIGTERM'); } catch {}
  process.exit(0);
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
