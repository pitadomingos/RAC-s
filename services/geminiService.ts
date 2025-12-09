import { GoogleGenAI } from "@google/genai";
import { logger } from '../utils/logger';

// Safely access API key
const apiKey = (typeof process !== 'undefined' && process.env && process.env.API_KEY) ? process.env.API_KEY : '';

// Singleton instance logic could be applied here if needed
let ai: GoogleGenAI | null = null;

try {
    ai = new GoogleGenAI({ apiKey });
} catch (e) {
    logger.error("Failed to initialize Google GenAI client", e);
}

export const getSafetyAdvice = async (rac: string, query: string): Promise<string> => {
  if (!ai) return "AI Service Unavailable.";
  
  try {
    const model = 'gemini-2.5-flash';
    const systemPrompt = `You are an expert Industrial Safety Consultant for 'Vulcan Mining'. 
    Provide concise, actionable safety advice regarding ${rac}. 
    Focus on Critical Activity Requirements (RAC). Keep answers under 100 words.`;
    
    logger.info(`Gemini Query: ${rac}`);

    const response = await ai.models.generateContent({
      model: model,
      contents: query,
      config: {
        systemInstruction: systemPrompt,
      }
    });

    return response.text || "No advice available at this time.";
  } catch (error) {
    logger.error("Gemini API Error", error);
    return "Unable to connect to Safety Advisor. Please try again later.";
  }
};

export const generateSafetyReport = async (stats: any, period: string): Promise<string> => {
  if (!ai) return "AI Service Unavailable.";

  try {
    const model = 'gemini-2.5-flash';
    const systemPrompt = `You are a Senior Safety Data Analyst for 'Vulcan Mining'.
    Generate a professional, formatted safety training report based on the provided JSON statistics.
    
    The report should include:
    1. Executive Summary
    2. Operational Key Metrics (Bookings, Pass Rates, Attendance)
    3. Critical Trends (High failure rates, Specific RAC issues)
    4. Strategic Recommendations for the Safety Management Team.
    
    Format the output using Markdown-like headers and bullet points for readability. Keep it professional, data-driven, and concise.`;
    
    const prompt = `Report Period: ${period}
    Statistics: ${JSON.stringify(stats, null, 2)}`;

    logger.info(`Generating Safety Report for period: ${period}`);

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        systemInstruction: systemPrompt,
      }
    });

    return response.text || "Unable to generate report analysis.";
  } catch (error) {
    logger.error("Gemini Report Generation Error", error);
    return "Error generating AI report analysis. Please ensure API Key is configured.";
  }
};