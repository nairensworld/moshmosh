import  express  from "express";
import type { Request, Response } from "express";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.get("/", (req: Request, res: Response) => {
  res.send(process.env.GEMINI_API_KEY || "No API Key Set");
});

app.get("/api/hello", (req: Request, res: Response) => {
  res.send({ message: "Hello, World!" });
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});