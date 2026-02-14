import { GoogleGenAI, Type } from "@google/genai";
import { MarketPair, AIAnalysis } from '../types';

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) throw new Error("API Key is missing");
  return new GoogleGenAI({ apiKey });
};

export const analyzeMarketConditions = async (pairs: MarketPair[]): Promise<AIAnalysis> => {
  try {
    const client = getClient();
    const topPairs = pairs.slice(0, 5); // Analyze top 5 opportunities

    const prompt = `
      You are a quantitative finance expert specializing in Delta Neutral Funding Rate Arbitrage.
      Analyze the following market data for top crypto pairs:
      ${JSON.stringify(topPairs)}

      The user is running a bot that executes a Long Spot + Short Perpetual Futures strategy to collect funding fees.
      
      Provide a risk assessment and recommendation.
      Return the response in JSON format strictly adhering to this schema.
    `;

    const response = await client.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            riskScore: { type: Type.NUMBER, description: "Risk score from 0 (Safe) to 100 (High Risk)" },
            sentiment: { type: Type.STRING, enum: ["Bullish", "Bearish", "Neutral"], description: "Overall market sentiment regarding funding rates" },
            recommendation: { type: Type.STRING, description: "Short actionable advice (max 20 words)" },
            reasoning: { type: Type.STRING, description: "Detailed reasoning for the recommendation (max 50 words)" }
          },
          required: ["riskScore", "sentiment", "recommendation", "reasoning"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("Empty response from Gemini");
    
    return JSON.parse(text) as AIAnalysis;
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    return {
      riskScore: 50,
      sentiment: 'Neutral',
      recommendation: 'Monitor market manually.',
      reasoning: 'AI analysis failed due to connectivity or API issues. Proceed with standard safeguards.'
    };
  }
};