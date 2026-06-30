import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import { OAuth2Client } from 'google-auth-library';

dotenv.config();

// Validate required environment variables
const requiredEnvVars = [
  'GOOGLE_CLIENT_ID',
  'GOOGLE_CLIENT_SECRET',
  'GOOGLE_REDIRECT_URI',
  'DATABASE_URL',
];

const missingVars = requiredEnvVars.filter(v => !process.env[v]);
if (missingVars.length > 0) {
  console.warn(`\n⚠️  Missing environment variables: ${missingVars.join(', ')}`);
  console.warn('Please update your .env file. See SETUP.md for instructions.\n');
}

const app = express();
const prisma = new PrismaClient();
const port = Number(process.env.BACKEND_PORT || process.env.PORT || 3001);

const oAuth2Client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

try {
  await prisma.$connect();
  console.log('✅ Database connected successfully');
} catch (error) {
  console.error('\n❌ Database connection failed:', error);
  process.exit(1);
}

app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:3000', credentials: true }));
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, message: 'Server is running' });
});

app.post('/api/auth/google', async (req, res) => {
  const { idToken } = req.body;

  if (!idToken) {
    return res.status(400).json({ message: 'ID token is required' });
  }

  try {
    // Verify the ID token from Google
    const ticket = await oAuth2Client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    if (!payload?.email || !payload?.sub) {
      return res.status(401).json({ message: 'Invalid token payload' });
    }

    // Create or update user in database without MongoDB transactions
    let user = await prisma.user.findUnique({
      where: { googleId: payload.sub },
    });

    if (user) {
      user = await prisma.user.update({
        where: { googleId: payload.sub },
        data: {
          email: payload.email,
          name: payload.name || payload.email,
          picture: payload.picture,
        },
      });
    } else {
      user = await prisma.user.create({
        data: {
          googleId: payload.sub,
          email: payload.email,
          name: payload.name || payload.email,
          picture: payload.picture,
        },
      });
    }

    console.log(`✅ User logged in: ${user.email}`);

    return res.json({
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        picture: user.picture,
        googleId: user.googleId,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('Google verification error:', message);

    if (message.includes('Server selection timeout') || message.includes('No available servers') || message.includes('failed to connect')) {
      return res.status(500).json({ message: 'Database connection failed', error: message });
    }

    if (message.includes('Invalid token') || message.includes('invalid_token') || message.includes('Token used too late')) {
      return res.status(401).json({ message: 'Invalid token', error: message });
    }

    return res.status(500).json({ message: 'Google authentication failed', error: message });
  }
});


app.listen(port, () => {
  console.log(`\n✅ Server running on http://localhost:${port}`);
  if (missingVars.length > 0) {
    console.warn(`\n⚠️  Google OAuth is not fully configured.`);
    console.warn(`Missing: ${missingVars.join(', ')}`);
    console.warn('See SETUP.md for configuration instructions.\n');
  } else {
    console.log('✅ Google OAuth is configured');
    console.log(`✅ Database connected to: ${process.env.DATABASE_URL}\n`);
  }
});
