#!/usr/bin/env node

import fs from 'fs';
import readline from 'readline';
import open from 'open';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const question = (prompt) => {
  return new Promise((resolve) => {
    rl.question(prompt, (answer) => {
      resolve(answer);
    });
  });
};

console.log('\n🚀 Google OAuth Setup Helper\n');
console.log('====================================\n');

console.log('This will help you get your Google Client ID.\n');

console.log('📋 Steps:\n');
console.log('1. We\'ll open Google Cloud Console');
console.log('2. You\'ll create OAuth credentials');
console.log('3. Paste the Client ID here');
console.log('4. We\'ll save it to .env\n');

(async () => {
  const proceed = await question('Ready? (yes/no): ');

  if (proceed.toLowerCase() !== 'yes') {
    console.log('\nCancelled.\n');
    rl.close();
    process.exit(0);
  }

  console.log('\n🔗 Opening Google Cloud Console...\n');

  // Step 1: Open Google Cloud Console
  await open('https://console.cloud.google.com/');

  console.log('Next steps in Google Cloud Console:\n');
  console.log('1. Create a NEW PROJECT named "bin-saleem-jewellery"');
  console.log('2. Go to APIs & Services → Credentials');
  console.log('3. Click "+ CREATE CREDENTIALS" → OAuth client ID');
  console.log('4. Select "Web application"');
  console.log('5. Add these Authorized redirect URIs:');
  console.log('   - http://localhost:3000/');
  console.log('   - http://localhost:3001/');
  console.log('6. Click CREATE');
  console.log('7. Copy the Client ID from the popup\n');

  const clientId = await question('📋 Paste your Google Client ID here: ');

  if (!clientId || clientId.includes('REPLACE')) {
    console.log('\n❌ Invalid Client ID. Aborting.\n');
    rl.close();
    process.exit(1);
  }

  // Update .env file
  let envContent = fs.readFileSync('.env', 'utf-8');
  envContent = envContent.replace(
    /GOOGLE_CLIENT_ID="[^"]*"/,
    `GOOGLE_CLIENT_ID="${clientId}"`
  );
  fs.writeFileSync('.env', envContent);

  console.log('\n✅ Saved to .env\n');
  console.log('====================================\n');
  console.log('🎉 Setup complete!\n');
  console.log('Now run:\n');
  console.log('  npm run server    (Terminal 1)');
  console.log('  npm run dev       (Terminal 2)\n');
  console.log('Then go to http://localhost:3000\n');

  rl.close();
})();
