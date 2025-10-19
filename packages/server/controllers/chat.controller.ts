import z from 'zod';
import { chatHistoryService } from '../services/chatHistory.service.js';
import { type Request, type Response } from 'express';

export const chatController = {
   getHistory,
   sendMessage,
};

 


const chatSchema = z.object({
   prompt: z
      .string()
      .trim()
      .min(1, 'prompt cannot be empty')
      .max(1000, 'prompt is too long'),
});

async function sendMessage(req: Request, res: Response) {
   try {
      const parsedResult = chatSchema.safeParse(req.body);

      if (!parsedResult.success) {
         return res.status(400).json({ error: parsedResult.error.format() });
      }

      const { prompt, userId } = req.body;
      const chatHistoryResponse = await chatHistoryService.sendMessage(
         userId,
         prompt
      );

      res.json({
         userId: userId,
         response: chatHistoryResponse.modelResponseText,
      });
   } catch (error) {
      console.error('Error processing /api/chat request:', error);
      res.status(500).json({ error: 'Failed to generate a response' });
   }
};

async function getHistory(req: Request, res: Response) {
    const { userId } = req.params;
    if (!userId) {
       return res.status(400).json({ error: 'userId parameter is required' });
    }
    const history = chatHistoryService.getHistory(userId);
    res.json({ userId, history });
}   