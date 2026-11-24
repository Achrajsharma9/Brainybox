import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(`${process.env.GEMINI_API_KEY}`);

interface SuggestionRequestBody {
  ingredients: string;
}

interface Suggestion {
  name: string;
  description: string;
}

const SUGGESTION_PROMPT = `Based on the following ingredients, suggest 6 possible dishes that could be made. Return the response as a JSON array in this exact format:
[
  {
    "name": "dish name",
    "description": "brief description of the dish"
  }
]
Available ingredients: {ingredients}
Note: Do not include any additional text or formatting. I need the raw JSON array without any quotes, backticks, dots, or anything else outside of this JSON structure.`;

async function suggestDishes(ingredients: string): Promise<Suggestion[]> {
  const prompt = SUGGESTION_PROMPT.replace('{ingredients}', ingredients);

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview"});
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    const cleanText = text.replace(/^```json|```$/g, '').trim();
    const jsonResponse = JSON.parse(cleanText) as Suggestion[];
    
    if (!Array.isArray(jsonResponse) || jsonResponse.length === 0) {
      throw new Error("Invalid JSON response from AI");
    }

    return jsonResponse;
  } catch (error) {
    console.error('Error generating suggestions with Gemini:', error);
    return [
      { name: "Simple Salad", description: "A fresh salad with the ingredients you have" },
      { name: "Quick Stir-fry", description: "A simple stir-fry using your available ingredients" }
    ];
  }
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  const body = await request.json() as SuggestionRequestBody;
  const { ingredients } = body;

  if (!ingredients) {
    return NextResponse.json({ error: 'Ingredients are required' }, { status: 400 });
  }

  try {
    const suggestions = await suggestDishes(ingredients);
    return NextResponse.json({ suggestions });
  } catch (error) {
    console.error('Error generating suggestions:', error);
    return NextResponse.json({ error: 'Failed to generate suggestions' }, { status: 500 });
  }
}