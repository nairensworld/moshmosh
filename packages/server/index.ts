import express from 'express';
import type { Request, Response } from 'express';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import z from 'zod';

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
   const parsedResult = chatSchema.safeParse(req.body);

   if (!parsedResult.success) {
      return res.status(400).json({ error: parsedResult.error.format() });
   }

   const { prompt } = req.body;
   const response = await client.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
   });
   res.json({ message: response.text });
});

app.listen(port, () => {
   console.log(`Server is running at http://localhost:${port}`);
});
