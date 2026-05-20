import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import Anthropic from '@anthropic-ai/sdk';
import dotenv from 'dotenv';

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Anthropic API Initialization
  const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY || '',
  });

  // API Routes
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', uptime: process.uptime() });
  });

  app.post('/api/gemini/status', async (req, res) => {
    try {
      if (!process.env.ANTHROPIC_API_KEY || process.env.ANTHROPIC_API_KEY === 'YOUR_ANTHROPIC_API_KEY') {
        return res.status(401).json({ error: 'API_KEY_NOT_CONFIGURED' });
      }

      const message = await anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 64,
        messages: [
          {
            role: 'user',
            content: "Generate a short, futuristic system status report (max 15 words) for Aether OS (HOLOSPIN X). Use tech jargon like 'flux capacity stabilized' or 'hologram mesh 99%'.",
          },
        ],
      });

      const report = (message.content[0] as { type: string; text: string }).text;
      res.json({ report });
    } catch (error: any) {
      if (error.status === 429 || error.message?.includes('quota') || error.message?.includes('rate')) {
        console.warn('Anthropic rate limit hit - using fallback values');
        res.status(429).json({
          error: 'QUOTA_EXHAUSTED',
          fallback: "NEURAL_LINK_STABLE: Monitoring hologram integrity. All systems optimal."
        });
      } else if (error.status === 401) {
        res.status(403).json({ error: 'API_KEY_LEAKED' });
      } else {
        console.error('Anthropic error:', error);
        res.status(500).json({ error: 'Failed to generate status report' });
      }
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer().catch(console.error);
