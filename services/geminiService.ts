import { GoogleGenAI, Type } from "@google/genai";
import { GeneratedAdCopy, GeneratedStrategy } from "../types";

const getAiClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.error("API_KEY is missing");
    throw new Error("API Key is missing from environment variables");
  }
  return new GoogleGenAI({ apiKey });
};

/**
 * Generates marketing ad copy based on product details and platform.
 */
export const generateAdCopy = async (
  productName: string,
  description: string,
  platform: 'Facebook' | 'Google',
  tone: string
): Promise<GeneratedAdCopy> => {
  try {
    const ai = getAiClient();
    const prompt = `Write a high-converting ad for ${platform}.
    Product: ${productName}
    Description: ${description}
    Tone: ${tone}
    
    Return the result as a JSON object with keys: headline, primaryText, and callToAction.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
            type: Type.OBJECT,
            properties: {
                headline: { type: Type.STRING },
                primaryText: { type: Type.STRING },
                callToAction: { type: Type.STRING }
            },
            required: ["headline", "primaryText", "callToAction"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response text from Gemini");
    
    return JSON.parse(text) as GeneratedAdCopy;
  } catch (error) {
    console.error("Error generating ad copy:", error);
    throw error;
  }
};

/**
 * Generates a comprehensive marketing strategy including audience and keywords.
 */
export const generateMarketingStrategy = async (
  productName: string,
  description: string
): Promise<GeneratedStrategy> => {
  try {
    const ai = getAiClient();
    const prompt = `Act as a senior marketing strategist. Based on the product below, identify the target audience personas, best SEO keywords, and recommended platforms.
    
    Product: ${productName}
    Description: ${description}
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            targetAudience: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "List of 3 specific buyer personas"
            },
            keywords: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "List of 5 high-traffic SEO keywords"
            },
            suggestedPlatforms: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "List of top 2 social platforms to focus on"
            }
          },
          required: ["targetAudience", "keywords", "suggestedPlatforms"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response text from Gemini");

    return JSON.parse(text) as GeneratedStrategy;
  } catch (error) {
    console.error("Error generating strategy:", error);
    throw error;
  }
};

/**
 * Analyzes mock campaign data and provides strategic insights.
 */
export const analyzeCampaignPerformance = async (
  metricsSummary: string
): Promise<string> => {
  try {
    const ai = getAiClient();
    const prompt = `You are a senior marketing analyst. Analyze the following campaign metrics summary and provide 3 concise, actionable bullet points to improve ROI. 
    
    Metrics Summary:
    ${metricsSummary}
    
    Keep it professional and direct.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "Unable to generate analysis.";
  } catch (error) {
    console.error("Error analyzing campaign:", error);
    return "Error generating analysis. Please check your API key.";
  }
};
