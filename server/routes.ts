import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  // put application routes here
  // prefix all routes with /api

  // use storage to perform CRUD operations on the storage interface
  // e.g. storage.insertUser(user) or storage.getUserByUsername(username)

  app.get('/api/health', (req, res) => {
    res.json({ ok: true });
  });

  app.post('/api/arpeggio/generate', async (req, res) => {
    try {
      const body = req.body || {};
      const {
        key, chord, pattern = 'ascending', position = 'low', length = 16, tempo = 120, subdivision = 2
      } = body;

      if (!key || typeof key !== 'string') return res.status(400).json({ error: 'key is required' });
      if (!chord || typeof chord !== 'string') return res.status(400).json({ error: 'chord is required' });
      const lengthNum = Number(length);
      const tempoNum = Number(tempo);
      const subNum = Number(subdivision);
      if (!Number.isFinite(lengthNum) || lengthNum < 1 || lengthNum > 128) return res.status(400).json({ error: 'invalid length' });
      if (!Number.isFinite(tempoNum) || tempoNum < 30 || tempoNum > 300) return res.status(400).json({ error: 'invalid tempo' });
      if (!Number.isFinite(subNum) || subNum < 1 || subNum > 8) return res.status(400).json({ error: 'invalid subdivision' });

      const { generateArpeggio } = await import('../shared/arpeggio.ts');
      const result = generateArpeggio({ key, chord, pattern, position, length: lengthNum, tempo: tempoNum, subdivision: subNum });
      return res.json(result);
    } catch (err) {
      console.error('arpeggio generation failed', err);
      return res.status(500).json({ error: 'internal_error' });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
