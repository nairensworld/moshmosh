const conversations = new Map<string, String>();

export const conversationRepository = {
   getLastConversation,
   setLastConversation,
};

function getLastConversation(conversationId: string): String | null {
   return conversations.get(conversationId) || null;
}

function setLastConversation(conversationId: string, message: String): void {
   conversations.set(conversationId, message);
}
