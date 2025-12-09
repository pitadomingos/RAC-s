
import { GoogleGenAI } from "@google/genai";
import { logger } from '../utils/logger';
import { translations, Language } from '../utils/translations';

// Safely access API key
const apiKey = (typeof process !== 'undefined' && process.env && process.env.API_KEY) ? process.env.API_KEY : '';

// Singleton instance logic could be applied here if needed
let ai: GoogleGenAI | null = null;

try {
    ai = new GoogleGenAI({ apiKey });
} catch (e) {
    logger.error("Failed to initialize Google GenAI client", e);
}

export const getSafetyAdvice = async (rac: string, query: string, language: Language = 'en'): Promise<string> => {
  if (!ai) return "AI Service Unavailable.";
  
  try {
    const t = translations[language];
    const model = 'gemini-2.5-flash';
    const langName = language === 'en' ? 'English' : 'Portuguese';
    
    // Replace placeholders in system prompt
    const systemPrompt = t.ai.systemPromptAdvice
        .replace('{rac}', rac)
        .replace('{language}', langName);
    
    logger.info(`Gemini Query: ${rac} [${language}]`);

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

export const generateSafetyReport = async (stats: any, period: string, language: Language = 'en'): Promise<string> => {
  if (!ai) return "AI Service Unavailable.";

  try {
    const t = translations[language];
    const model = 'gemini-2.5-flash';
    const langName = language === 'en' ? 'English' : 'Portuguese';
    
    const systemPrompt = t.ai.systemPromptReport.replace('{language}', langName);
    
    const prompt = `Report Period: ${period}
    Statistics: ${JSON.stringify(stats, null, 2)}`;

    logger.info(`Generating Safety Report for period: ${period} [${language}]`);

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
