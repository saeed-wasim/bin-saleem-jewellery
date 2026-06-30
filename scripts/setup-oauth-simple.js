#!/usr/bin/env node

import fs from 'fs';
import readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const question = (prompt) =>
  new Promise((resolve) => {
    rl.question(prompt, (answer) => {
      resolve(answer);
    });
  });

console.log('\n╔════════════════════════════════════════╗');
console.log('║  Google OAuth Client ID Setup        ║');
console.log('╚════════════════════════════════════════╝\n');

(async () => {
  console.log('📖 Instructions:\n');
  console.log('1. Go to: https://console.cloud.google.com/');
  console.log('2. Create a NEW PROJECT: "bin-saleem-jewellery"');
  console.log('3. Go to: APIs & Services → Credentials');
  console.log('4. Click "+ CREATE CREDENTIALS" → OAuth client ID');
  console.log('5. Choose "Web application"');
  console.log('6. Add Authorized redirect URI: http://localhost:3000/');
  console.log('7. Click CREATE and copy the Client ID\n');

  console.log('⏳ Have you completed these steps? (yes/no): ');
  const ready = await question('> ');

  if (ready.toLowerCase() !== 'yes') {
    console.log('\nSetup cancelled.\n');
    rl.close();
    process.exit(0);
  }

  const clientId = await question('\n📋 Paste your Google Client ID: ');

  if (!clientId || clientId.includes('REPLACE') || clientId.length < 20) {
    console.log('\n❌ Invalid Client ID format. Please check and try again.\n');
    rl.close();
    process.exit(1);
  }

  // Update .env
  let envContent = fs.readFileSync('.env', 'utf-8');
  envContent = envContent.replace(/GOOGLE_CLIENT_ID="[^"]*"/, `GOOGLE_CLIENT_ID="${clientId}"`);
  fs.writeFileSync('.env', envContent);

  console.log('\n✅ Google Client ID saved!\n');
  console.log('════════════════════════════════════════\n');
  console.log('🚀 Ready to run! Open 2 terminals:\n');
  console.log('Terminal 1:');
  console.log('  npm run server\n');
  console.log('Terminal 2:');
  console.log('  npm run dev\n');
  console.log('Then visit: http://localhost:3000\n');

  rl.close();
  process.exit(0);
})();
