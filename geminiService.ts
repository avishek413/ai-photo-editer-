import { GoogleGenAI, Modality } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

// Helper function to convert data URL to base64
const getBase64Data = (dataUrl: string): string => {
  const parts = dataUrl.split(',');
  if (parts.length !== 2) {
    throw new Error('Invalid data URL format');
  }
  return parts[1];
};

export const editImage = async (
  imageBase64Url: string,
  mimeType: string,
  prompt: string
): Promise<string | null> => {
  try {
    const base64Data = getBase64Data(imageBase64Url);

    const enhancedPrompt = `${prompt}, high quality, detailed`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image-preview',
      contents: {
        parts: [
          {
            inlineData: {
              data: base64Data,
              mimeType: mimeType,
            },
          },
          {
            text: enhancedPrompt,
          },
        ],
      },
      config: {
        responseModalities: [Modality.IMAGE, Modality.TEXT],
      },
    });

    // Find the image part in the response
    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        const newBase64 = part.inlineData.data;
        const newMimeType = part.inlineData.mimeType;
        return `data:${newMimeType};base64,${newBase64}`;
      }
    }

    return null; // Return null if no image is found in the response
  } catch (error) {
    console.error("Error editing image with Gemini API:", error);
    throw new Error("Failed to communicate with the Gemini API.");
  }
};
