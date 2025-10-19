// chatHistory.ts

import { type Content } from '@google/genai';

// 1. Define the UserHistoryStore type (Key: userId, Value: Content array)
export type UserHistoryStore = {
   [userId: string]: Content[];
};

// The in-memory store (simulating a database)
const userHistoryStore: UserHistoryStore = {};

export const chatHistroryRepository = {
   getHistory,
   saveHistoryTurn,
   clearHistory,
   getAllHistoryStore,
};

/**
 * Retrieves the conversation history for a specific user ID.
 * Returns an empty array if no history is found.
 * @param userId - The unique identifier for the user.
 * @returns The user's conversation history (array of Content objects).
 */
function getHistory(userId: string): Content[] {
   // Return existing history or an empty array for a new user
   return userHistoryStore[userId] || [];
}

/**
 * Saves a new user message and the model's response to the user's history.
 * @param userId - The unique identifier for the user.
 * @param userPrompt - The user's latest message text.
 * @param modelResponse - The model's generated response text.
 */
function saveHistoryTurn(
   userId: string,
   userPrompt: string,
   modelResponse: string
): void {
   // Initialize the user's history array if it doesn't exist
   if (!userHistoryStore[userId]) {
      userHistoryStore[userId] = [];
   }

   const history = userHistoryStore[userId];

   // Add the user's turn
   history.push({
      role: 'user',
      parts: [{ text: userPrompt }],
   });

   // Add the model's turn
   history.push({
      role: 'model',
      parts: [{ text: modelResponse }],
   });
}

/**
 * Clears the history for a specific user (optional utility function).
 * @param userId - The unique identifier for the user.
 */
function clearHistory(userId: string): void {
   if (userHistoryStore[userId]) {
      delete userHistoryStore[userId];
      console.log(`History cleared for user: ${userId}`);
   }
}

/**
 * Expose the internal store for inspection/debugging (optional).
 */
function getAllHistoryStore(): UserHistoryStore {
   return userHistoryStore;
}
