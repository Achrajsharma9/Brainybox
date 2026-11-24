import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(`${process.env.GEMINI_API_KEY}`);

const conversations = new Map();

export async function POST(request: Request) {
  const body = await request.json();
  const userMessage = body.message;
  const sessionId = body.sessionId || 'default'; 

  try {
    if (!conversations.has(sessionId)) {
      conversations.set(sessionId, []);
    }
    
    const history = conversations.get(sessionId);
    
    history.push({
      role: 'user',
      parts: [{ text: userMessage }]
    });
    
    const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });
    const chat = model.startChat({
      history: history,
      generationConfig: {
        maxOutputTokens: 1000,
      },
    });
    
    const result = await chat.sendMessage(userMessage);
    const text = result.response.text();
    
    history.push({
      role: 'model',
      parts: [{ text: text }]
    });
    
    conversations.set(sessionId, history);
    
    return NextResponse.json({ message: text });
  } catch (error) {
    console.error('Error fetching AI response:', error);
    return NextResponse.json({ error: 'Failed to fetch AI response' }, { status: 500 });
  }
}