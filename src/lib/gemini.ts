import { GoogleGenAI } from "@google/genai";

// Lazy initialization to avoid crashing if API key is missing at load time
let aiInstance: any = null;

function getAI() {
  if (!aiInstance) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is missing. Please add it to the Secrets panel in AI Studio.");
    }
    aiInstance = new GoogleGenAI({ apiKey });
  }
  return aiInstance;
}

export type ContentType = "linkedin" | "twitter" | "blog" | "instagram" | "summary";
export type ToneType = "professional" | "casual" | "witty" | "inspirational";

export async function generateContent(
  input: string,
  type: ContentType,
  tone: ToneType,
  language: string = "Indonesian"
) {
  const ai = getAI();
  const prompt = `
    You are an expert content creator. 
    Transform the following transcript or summary into a high-quality short-form content.
    
    INPUT TEXT:
    "${input}"
    
    TARGET CONTENT TYPE: ${type}
    TONE: ${tone}
    LANGUAGE: ${language}
    
    INSTRUCTIONS:
    - If type is "linkedin", create a professional post with a hook, body, and call to action. Use relevant emojis.
    - If type is "twitter", create a compelling thread (3-5 tweets) or a single punchy tweet.
    - If type is "blog", create a catchy introduction and a bulleted summary of key points.
    - If type is "instagram", create a visually descriptive caption with a strong hook and relevant hashtags.
    - If type is "summary", create a concise, structured summary of the main ideas.
    - Maintain the core message of the input but adapt it perfectly for the target platform.
    - Output only the generated content.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-flash-latest", // Using a more stable alias
      contents: prompt,
    });

    if (!response.text) {
      throw new Error("Model returned an empty response.");
    }

    return response.text;
  } catch (error: any) {
    console.error("Error generating content:", error);
    // Provide more context in the error message
    if (error.message?.includes("API_KEY_INVALID")) {
      throw new Error("API Key tidak valid. Silakan periksa kembali di panel Secrets.");
    }
    if (error.message?.includes("quota")) {
      throw new Error("Kuota API habis. Silakan coba lagi nanti.");
    }
    throw error;
  }
}
