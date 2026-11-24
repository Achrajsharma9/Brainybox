import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(`${process.env.GEMINI_API_KEY}`);

interface RecipeRequestBody {
  ingredients: string;
  dishName?: string;
}

interface Recipe {
  name: string;
  ingredients: string[];
  instructions: string[];
}

const RECIPE_PROMPT = `Create a simple recipe in JSON format exactly like this structure:
{
  "name": "name of the dish",
  "ingredients": ["ingredient1", "ingredient2", ...],
  "instructions": ["instruction1", "instruction2", ...]
}
Use these ingredients: {ingredients}. If a dish name {dishName} is provided, use it as the name of the dish. Note: Do not include any additional text or formatting. I need the raw JSON object without any quotes, backticks, dots, or anything else outside of this JSON structure.`;

async function generateRecipe(ingredients: string, dishName?: string): Promise<Recipe> {
  let prompt = RECIPE_PROMPT.replace('{ingredients}', ingredients);
  
  if (dishName) {
    prompt = prompt.replace('{dishName}', dishName);
  } else {
    prompt = prompt.replace('If a dish name {dishName} is provided, use it as the name of the dish.', '');
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview"});
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    const cleanText = text.replace(/^```json|```$/g, '').trim();
    const jsonResponse = JSON.parse(cleanText) as Recipe;
    
    if (!jsonResponse.name || !Array.isArray(jsonResponse.ingredients) || !Array.isArray(jsonResponse.instructions)) {
      throw new Error("Invalid JSON response from AI");
    }

    return jsonResponse;
  } catch (error) {
    console.error('Error generating recipe with Gemini:', error);
    return {
      name: dishName || "Simple Dish",
      ingredients: ingredients.split(',').map(i => i.trim()),
      instructions: ["Combine all ingredients in a bowl.", "Mix well.", "Serve and enjoy!"]
    };
  }
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  const body = await request.json() as RecipeRequestBody;
  const { ingredients, dishName } = body;

  try {
    const recipe = await generateRecipe(ingredients, dishName);
    return NextResponse.json({ recipe });
  } catch (error) {
    console.error('Error generating recipe:', error);
    return NextResponse.json({ error: 'Failed to generate recipe' }, { status: 500 });
  }
}