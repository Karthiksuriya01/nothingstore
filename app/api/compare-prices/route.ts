import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { productName, basePrice } = await request.json();

    if (!productName || !basePrice) {
      return NextResponse.json(
        { error: 'Product name and base price are required' },
        { status: 400 }
      );
    }

    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key not configured' },
        { status: 500 }
      );
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `Based on typical market prices for "${productName}", provide estimated prices on these platforms:
    
Please respond in JSON format only, with no additional text:
{
  "amazon": { "price": number, "discount": number },
  "flipkart": { "price": number, "discount": number },
  "blinkit": { "price": number, "discount": number }
}

Where price is in USD and discount is percentage. Prices should be realistic estimates for this product. If product is not typically available on a platform, use 0.`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    // Extract JSON from the response
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return NextResponse.json(
        { error: 'Failed to parse response' },
        { status: 500 }
      );
    }

    const prices = JSON.parse(jsonMatch[0]);

    return NextResponse.json({
      productName,
      basePrice,
      marketPrices: {
        amazon: prices.amazon,
        flipkart: prices.flipkart,
        blinkit: prices.blinkit,
      },
    });
  } catch (error) {
    console.error('Error comparing prices:', error);
    return NextResponse.json(
      { error: 'Failed to compare prices' },
      { status: 500 }
    );
  }
}
