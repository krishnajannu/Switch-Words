import { GoogleGenAI } from "@google/genai";

export const generateSwitchWord = async (situation: string): Promise<string> => {
  if (!process.env.API_KEY) {
    throw new Error("API Key is missing");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

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