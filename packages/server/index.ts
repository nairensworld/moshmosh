import express from 'express';
import type { Request, Response } from 'express';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req: Request, res: Response) => {
   console.log('a new request just came in');
   res.send('Hi this is Itay');
});

app.get('/api/hello', (req: Request, res: Response) => {
   res.send({ message: 'Hi Itay, welcome to the server client world' });
});

app.listen(port, () => {
   console.log(`Server is running at http://localhost:${port}`);
});
