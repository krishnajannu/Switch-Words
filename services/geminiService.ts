import { GoogleGenAI } from "@google/genai";

// Helper to safely get the API key from various environment configurations
const getApiKey = () => {
  // 1. Check for Vite environment variable (Standard for Vercel/Vite deployments)
  // We use try-catch or checks to avoid errors in environments where import.meta might be restricted
  try {
    // @ts-ignore - import.meta is valid in ES modules/Vite
    if (import.meta && import.meta.env && import.meta.env.VITE_API_KEY) {
      // @ts-ignore
      return import.meta.env.VITE_API_KEY;
    }
  } catch (e) {
    // Ignore error if import.meta is not available
  }
  
  // 2. Check for standard Node.js/Process environment variable (Fallback or for backend usage)
  try {
    if (typeof process !== 'undefined' && process.env && process.env.API_KEY) {
      return process.env.API_KEY;
    }
  } catch (e) {
    // Ignore error if process is not defined
  }

  return '';
};

export const generateSwitchWord = async (situation: string): Promise<string> => {
  const apiKey = getApiKey();

  if (!apiKey) {
    console.error("API Key is missing. Ensure VITE_API_KEY is set in your Vercel Environment Variables.");
    throw new Error("API Key is missing configuration.");
  }

  const ai = new GoogleGenAI({ apiKey });

  const prompt = `
    You are an expert Intuitive Energy Mentor and Master of Metaphysical Switch Words.
    The user is approaching you with this situation/desire: "${situation}".

    Your Goal: Connect with the user's energy, validate their feelings, and provide a high-vibrational solution.

    Task:
    1. **Analyze**: deeply understand the emotional block or desire.
    2. **Construct**: Create a powerful Switch Word phrase (3-5 words). 
       - Use Master Switch Words (e.g., TOGETHER, DIVINE, REACH, GOLD, COUNT, BE) combined with specific energetic words.
       - Words MUST be uppercase and hyphenated (e.g., GOLD-CLOUDS-NOW).
    3. **Explain (The Wisdom)**: Write a relatable, empathetic, and inspiring explanation (2-3 sentences) telling the user exactly how these specific words shift their energy. Speak directly to them ("This helps you...").
    4. **Action (The Ritual)**: Provide a specific, 1-sentence micro-visualization or action to do while chanting (e.g., "Visualize a golden door opening," or "Place hand on heart").

    Output Format (Strictly follow this):
    PHRASE: [THE-SWITCH-PHRASE]
    WISDOM: [Your empathetic explanation]
    RITUAL: [The specific visualization/action]
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        temperature: 0.7, // Balance creativity with coherence
        topK: 40,
      }
    });
    
    return response.text || "Could not generate a phrase. Please try again.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Error connecting to cosmic intelligence. Please try again later.";
  }
};