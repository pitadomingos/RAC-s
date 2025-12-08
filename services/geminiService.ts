import { GoogleGenAI } from "@google/genai";
import { RAC } from '../types';

// Safely access API key, defaulting to empty string if env is not configured to prevent crashes
// We check for type of process first to avoid ReferenceError in browser
const apiKey = (typeof process !== 'undefined' && process.env && process.env.API_KEY) ? process.env.API_KEY : '';

const ai = new GoogleGenAI({ apiKey });

export const getSafetyAdvice = async (rac: string, query: string): Promise<string> => {
  try {
    const model = 'gemini-2.5-flash';
    const systemPrompt = `You are an expert Industrial Safety Consultant for 'Vulcan Mining'. 
    Provide concise, actionable safety advice regarding ${rac}. 
    Focus on Critical Activity Requirements (RAC). Keep answers under 100 words.`;
    
    const response = await ai.models.generateContent({
      model: model,
      contents: query,
      config: {
        systemInstruction: systemPrompt,
      }
    });

    return response.text || "No advice available at this time.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Unable to connect to Safety Advisor. Please try again later.";
  }
};

export const generateSafetyReport = async (stats: any, period: string): Promise<string> => {
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

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        systemInstruction: systemPrompt,
      }
    });

    return response.text || "Unable to generate report analysis.";
  } catch (error) {
    console.error("Gemini Report Error:", error);
    return "Error generating AI report analysis. Please ensure API Key is configured.";
  }
};