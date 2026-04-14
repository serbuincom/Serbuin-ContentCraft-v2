import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export type ContentType = "linkedin" | "twitter" | "blog" | "instagram" | "summary";
export type ToneType = "professional" | "casual" | "witty" | "inspirational";

export async function generateContent(
  input: string,
  type: ContentType,
  tone: ToneType,
  language: string = "Indonesian"
) {
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
      model: "gemini-3-flash-preview",
      contents: prompt,
    });

    return response.text;
  } catch (error) {
    console.error("Error generating content:", error);
    throw error;
  }
}
