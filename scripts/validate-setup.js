#!/usr/bin/env node

import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config();

console.log('\n🔍 Bin Saleem Jewellery - Setup Validator\n');

const checks = [
  {
    name: 'Node.js Version',
    check: () => {
      const version = process.version;
      const major = parseInt(version.split('.')[0].slice(1));
      if (major >= 18) {
        return { pass: true, message: `${version} ✅` };
      }
      return { pass: false, message: `${version} (need v18+)` };
    },
  },
  {
    name: 'node_modules Installed',
    check: () => {
      if (fs.existsSync('node_modules')) {
        return { pass: true, message: 'Found ✅' };
      }
      return { pass: false, message: 'Not found. Run: npm install' };
    },
  },
  {
    name: 'GOOGLE_CLIENT_ID',
    check: () => {
      const id = process.env.GOOGLE_CLIENT_ID;
      if (id && !id.includes('your-')) {
        return { pass: true, message: `${id.slice(0, 20)}... ✅` };
      }
      return {
        pass: false,
        message: 'Not configured. See SETUP.md → Step 2',
      };
    },
  },
  {
    name: 'GOOGLE_CLIENT_SECRET',
    check: () => {
      const secret = process.env.GOOGLE_CLIENT_SECRET;
      if (secret && !secret.includes('your-')) {
        return { pass: true, message: 'Configured ✅' };
      }
      return {
        pass: false,
        message: 'Not configured. See SETUP.md → Step 2',
      };
    },
  },
  {
    name: 'DATABASE_URL',
    check: () => {
      const url = process.env.DATABASE_URL;
      if (url && !url.includes('your-')) {
        return { pass: true, message: `${url.slice(0, 30)}... ✅` };
      }
      return { pass: false, message: 'Not configured' };
    },
  },
  {
    name: '.env File',
    check: () => {
      if (fs.existsSync('.env')) {
        return { pass: true, message: 'Found ✅' };
      }
      return { pass: false, message: 'Not found. Copy from .env.example' };
    },
  },
  {
    name: 'Prisma Schema',
    check: () => {
      if (fs.existsSync('prisma/schema.prisma')) {
        return { pass: true, message: 'Found ✅' };
      }
      return { pass: false, message: 'Not found' };
    },
  },
];

let allPass = true;
checks.forEach(({ name, check }) => {
  const result = check();
  const icon = result.pass ? '✅' : '❌';
  const color = result.pass ? '\x1b[32m' : '\x1b[31m';
  const reset = '\x1b[0m';

  console.log(`${color}${icon} ${name}: ${result.message}${reset}`);
  if (!result.pass) allPass = false;
});

console.log('\n' + '='.repeat(50));
if (allPass) {
  console.log('\n🎉 All checks passed! You\'re ready to go.\n');
  console.log('Start the app with:');
  console.log('  Terminal 1: npm run server');
  console.log('  Terminal 2: npm run dev\n');
} else {
  console.log('\n⚠️  Some checks failed. Follow the messages above.\n');
  console.log('📖 Full setup guide: SETUP.md\n');
}
