const fs = require('fs');
const path = require('path');
require('dotenv').config();

const configPath = path.join(__dirname, '..', 'build', 'firebase-config.js');
let configContent = fs.readFileSync(configPath, 'utf8');

// Replace placeholders with actual environment variables
configContent = configContent
  .replace('__FIREBASE_API_KEY__', process.env.REACT_APP_FIREBASE_API_KEY || '')
  .replace('__FIREBASE_AUTH_DOMAIN__', process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || '')
  .replace('__FIREBASE_PROJECT_ID__', process.env.REACT_APP_FIREBASE_PROJECT_ID || '')
  .replace('__FIREBASE_STORAGE_BUCKET__', process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || '')
  .replace('__FIREBASE_MESSAGING_SENDER_ID__', process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || '')
  .replace('__FIREBASE_APP_ID__', process.env.REACT_APP_FIREBASE_APP_ID || '');

fs.writeFileSync(configPath, configContent);
console.log('Firebase config updated with environment variables');