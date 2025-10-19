import { chatHistroryRepository } from '../repositories/chatHistory.repository';
import { GoogleGenAI, type Content } from '@google/genai';

export const chatHistoryService = {
   sendMessage,
   getHistory,
};

type ChatHistoryResponse = {
   userId: string;
   modelResponseText: string;
};

const client = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function sendMessage(
   userId: string,
   prompt: string
): Promise<ChatHistoryResponse> {
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

   const chatHistoryResponse: ChatHistoryResponse = {
      userId,
      modelResponseText: modelResponseText,
   };

   return chatHistoryResponse;
}

function getHistory(userId: string): Content[] {
   return chatHistroryRepository.getHistory(userId);
}
