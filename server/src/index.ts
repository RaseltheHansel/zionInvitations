import express, { Application } from 'express';
import { createServer } from 'http';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

import connectDB from './config/db';
import guestRoutes from './routes/guestRoutes';
import rsvpRoutes  from './routes/rsvpRoutes';

const app: Application = express();
const httpServer = createServer(app);

app.set('trust proxy', 1);

app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173', credentials: true }));
app.use(express.json());

app.use('/api/guests', guestRoutes);
app.use('/api/rsvp',   rsvpRoutes);

app.get('/',       (_req, res) => res.send('Christening API running!'));
app.get('/health', (_req, res) => res.status(200).json({ status: 'ok' }));

const PORT = parseInt(process.env.PORT ?? '5000', 10);

httpServer.listen(PORT, '0.0.0.0', async () => {
  console.log(`Server running on http://localhost:${PORT}`);
  await connectDB();
  console.log('🎉 Ready!');
});
