import express from 'express';
import cors from 'cors';
import { config } from './config/index';
import { connectDB } from './config/db';
import routes from './routes/index';

const app = express();

app.use(cors({ origin: config.frontendUrl, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/api', (_req, res) => {
  res.json({ success: true, message: 'AI Career Coach API' });
});

app.use('/api', routes);

async function start() {
  await connectDB();

  app.listen(config.port, () => {
    console.log(`Server running on port ${config.port}`);
  });
}

start();
