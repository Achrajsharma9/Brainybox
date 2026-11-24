import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const RECOMMENDATION_PROMPT = `Given the song "{songName}", create a playlist of 10 similar songs that a fan might enjoy. Return the response in this exact JSON format:
{
  "playlistName": "A creative name for the playlist based on the input song's style",
  "description": "A brief description of the musical style and why these songs were chosen",
  "songs": ["Song 1 - Artist 1", "Song 2 - Artist 2", ...(exactly 10 songs)]
}
Focus on similar musical style, mood, and era. Include a mix of well-known and slightly less mainstream songs.
 Note: Do not include any additional text or formatting. I need the raw JSON object without any quotes, backticks, dots, or anything else outside of this JSON structure.
  Important: DO NOT start your response with ...json or anything else. It should start and end with curly braces only {}.`;

async function generateRecommendations(songName: string) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });
    const prompt = RECOMMENDATION_PROMPT.replace("{songName}", songName);
    
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    // console.log('text>>>>>>>', text)
    const cleanText = text.replace(/^```json|```$/g, '').trim();
    const recommendations = JSON.parse(cleanText);
    
    if (!recommendations.playlistName || !recommendations.description || !Array.isArray(recommendations.songs) || recommendations.songs.length !== 10) {
      throw new Error("Invalid recommendation format");
    }
    
    return recommendations;
  } catch (error) {
    console.error('Error generating recommendations:', error);
    throw error;
  }
}

export async function POST(request: Request) {
  try {
    const { songName } = await request.json();
    
    if (!songName) {
      return NextResponse.json({ error: 'Song name is required' }, { status: 400 });
    }

    const recommendations = await generateRecommendations(songName);
    return NextResponse.json({ recommendations });
    
  } catch (error) {
    console.error('Error in recommendation endpoint:', error);
    return NextResponse.json(
      { error: 'Failed to generate recommendations' },
      { status: 500 }
    );
  }
}