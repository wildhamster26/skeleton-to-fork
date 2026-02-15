import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { connectDB } from './config/db.js';
import { getUser } from './middleware/auth.js';
import typeDefs from './graphql/typeDefs.js';
import resolvers from './graphql/resolvers.js';
import webhookRouter from './routes/webhooks.js';

// Validate required environment variables at startup
const REQUIRED_ENV = ['MONGODB_URI', 'JWT_SECRET', 'LEMONSQUEEZY_API_KEY', 'LEMONSQUEEZY_STORE_ID', 'LEMONSQUEEZY_WEBHOOK_SECRET'];
for (const key of REQUIRED_ENV) {
  if (!process.env[key]) {
    console.error(`Missing required environment variable: ${key}`);
    process.exit(1);
  }
}

const PORT = process.env.PORT || 4000;
const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'];

async function start() {
  await connectDB();

  const app = express();

  // Webhook routes need raw body — mount BEFORE json parser
  app.use('/webhooks', webhookRouter);

  app.use(cors({ origin: ALLOWED_ORIGINS, credentials: true }));
  app.use(helmet({ contentSecurityPolicy: false }));
  app.use(express.json({ limit: '16kb' }));

  const apollo = new ApolloServer({ typeDefs, resolvers });
  await apollo.start();

  app.use(
    '/graphql',
    expressMiddleware(apollo, {
      context: async ({ req }) => {
        const user = await getUser(req.headers.authorization);
        return { user };
      },
    })
  );

  app.get('/health', (_req, res) => res.json({ status: 'ok' }));

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`GraphQL at http://localhost:${PORT}/graphql`);
  });
}

process.on('unhandledRejection', (err) => {
  console.error('Unhandled rejection:', err);
  process.exit(1);
});

start().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
