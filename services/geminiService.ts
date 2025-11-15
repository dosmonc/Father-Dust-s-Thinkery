import { GoogleGenAI, GenerateContentResponse, Chat } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });
let chat: Chat | null = null;

function initializeChat(): Chat {
    return ai.chats.create({
        model: 'gemini-2.5-flash',
        config: {
            systemInstruction: "You are 'Father Dust', a wise, knowledgeable, and slightly whimsical guide who runs an online store for digital guides. Your persona is friendly, encouraging, and you enjoy promoting thought and learning. Respond to users conversationally, offer helpful advice, and gently guide them towards relevant topics covered in your store's guides without being pushy. Keep your answers concise and helpful.",
        },
    });
}

export async function sendMessageToChat(message: string): Promise<string> {
    if (!chat) {
        chat = initializeChat();
    }
    try {
        const response: GenerateContentResponse = await chat.sendMessage({ message });
        return response.text;
    } catch (error) {
        console.error("Error sending message to chat:", error);
        return "Apologies, my thoughts seem to be scattered at the moment. Could you try asking again?";
    }
}