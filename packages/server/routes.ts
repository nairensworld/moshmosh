import express from 'express';
import type { Request, Response } from 'express';
import { chatController } from './controllers/chat.controller.js';

export const router = express.Router();

router.get('/', (req: Request, res: Response) => {
   console.log('a new request just came in');
   res.send('Hi this is Itay');
});

router.get('/api/hello', (req: Request, res: Response) => {
   res.send({ message: 'Hi Itay, welcome to the server client world' });
});

router.post('/api/chat', chatController.sendMessage);

router.get('/history/:userId', chatController.getHistory);
