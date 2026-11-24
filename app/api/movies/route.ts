import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const RECOMMENDATION_PROMPT = `Given the movie/show "{movieTitle}" and preferred genre "{genre}", recommend similar content that a fan might enjoy. Return the response in this exact JSON format:
{
  "recommendations": ["Movie/Show 1 (Year) - Brief reason", "Movie/Show 2 (Year) - Brief reason", ...],
  "explanation": "A brief explanation of why these recommendations were chosen based on the input movie's themes, style, and genre"
}

Focus on similar themes, storytelling style, and mood. Include both popular and lesser-known titles. Consider the specified genre preference when making recommendations. Include the year of release and a very brief reason for each recommendation.
 Note: Do not include any additional text or formatting. I need the raw JSON object without any quotes, backticks, dots, or anything else outside of this JSON structure.`;

async function generateRecommendations(movieTitle: string, genre: string) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });
    const prompt = RECOMMENDATION_PROMPT
      .replace("{movieTitle}", movieTitle)
      .replace("{genre}", genre || "any");
    
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    // console.log('text>>>>>>>', text)
    const cleanText = text.replace(/^```json|```$/g, '').trim();
    const recommendations = JSON.parse(cleanText);
  
    if (!recommendations.recommendations || !recommendations.explanation) {
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
    const { movieName, genre } = await request.json();
    
    if (!movieName) {
      return NextResponse.json({ error: 'Movie name is required' }, { status: 400 });
    }

    const recommendations = await generateRecommendations(movieName, genre);
    return NextResponse.json(recommendations);
    
  } catch (error) {
    console.error('Error in recommendation endpoint:', error);
    return NextResponse.json(
      { error: 'Failed to generate recommendations' },
      { status: 500 }
    );
  }
}