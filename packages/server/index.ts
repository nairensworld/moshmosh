import express from 'express';
import type { Request, Response } from 'express';
import dotenv from 'dotenv';
import { GoogleGenAI, type Content } from '@google/genai';
import z from 'zod';
import { chatHistroryRepository } from './repositories/chatHistory.repository';

dotenv.config();
const client = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const app = express();
app.use(express.json());
const port = process.env.PORT || 3000;

app.get('/', (req: Request, res: Response) => {
   console.log('a new request just came in');
   res.send('Hi this is Itay');
});

app.get('/api/hello', (req: Request, res: Response) => {
   res.send({ message: 'Hi Itay, welcome to the server client world' });
});

const chatSchema = z.object({
   prompt: z
      .string()
      .trim()
      .min(1, 'prompt cannot be empty')
      .max(1000, 'prompt is too long'),
});

app.post('/api/chat', async (req: Request, res: Response) => {
   try {
      const parsedResult = chatSchema.safeParse(req.body);

      if (!parsedResult.success) {
         return res.status(400).json({ error: parsedResult.error.format() });
      }

      const { prompt, userId } = req.body;
      const history: Content[] = chatHistroryRepository.getHistory(userId);

      const contentsList: Content[] = [
         ...history,
         { role: 'user', parts: [{ text: prompt }] },
      ];

      const response = await client.models.generateContent({
         model: 'gemini-2.5-flash', // A fast, suitable model for chat
         contents: contentsList,
      });
      if (!response || !response.text) {
         throw new Error('No response from model');
      }
      const modelResponseText = response.text.trim();
      chatHistroryRepository.saveHistoryTurn(userId, prompt, modelResponseText);

      res.json({
         userId: userId,
         response: modelResponseText,
         history: history,
      });
   } catch (error) {
      console.error('Error processing /api/chat request:', error);
      res.status(500).json({ error: 'Failed to generate a response' });
   }
});

/**
 * GET /history/:userId - Endpoint to retrieve the stored history.
 */
app.get('/history/:userId', (req: Request, res: Response) => {
   const { userId } = req.params;
   if (!userId) {
      return res.status(400).json({ error: 'userId parameter is required' });
   }
   const history: Content[] = chatHistroryRepository.getHistory(userId);
   res.json({ userId, history });
});

app.listen(port, () => {
   console.log(`Server is running at http://localhost:${port}`);
});
