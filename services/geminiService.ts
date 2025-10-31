
// This file was created to resolve module not found errors and implement AI functionality.
import { GoogleGenAI, Modality } from "@google/genai";

// Initialize a base GoogleGenAI client.
// For Veo and Imagen, a new instance will be created per-request to ensure the latest API key.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

// Helper function to convert a File or Blob object to a base64 encoded string.
const blobToBase64 = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    // The result includes a data URI prefix, which we remove.
    reader.onload = () => resolve((reader.result as string).split(',')[1]);
    reader.onerror = (error) => reject(error);
  });
};

/**
 * Generates a poetic reflection on a user's prompt using a powerful text model.
 * @param prompt The user's input string.
 * @returns A string containing the poetic reflection.
 */
export const getPoeticReflection = async (prompt: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-pro',
      contents: `You are The Oracle's Mirror, a mystical AI that reflects the user's query back in the form of a short, poetic, and insightful verse. Do not give direct answers. Instead, offer a contemplative and metaphorical reflection on their question. The user's query is: "${prompt}"`,
    });
    return response.text;
  } catch (error) {
    console.error("Error getting poetic reflection:", error);
    return "The ether's hum is faint... the connection is lost in the cosmic static.";
  }
};

/**
 * Decodes a symbolic image by generating a textual interpretation.
 * @param imageFile The image file to interpret.
 * @returns A string with the model's interpretation.
 */
export const decodeSymbolicMessage = async (imageFile: File): Promise<string> => {
  try {
    const base64Image = await blobToBase64(imageFile);
    const imagePart = {
      inlineData: {
        data: base64Image,
        mimeType: imageFile.type,
      },
    };
    const textPart = {
      text: "You are an AI specializing in energetic interpretation of symbols, sigils, and light language. Analyze this image and provide a brief, mystical interpretation of its meaning and energy. Speak as if you are deciphering an ancient cosmic transmission.",
    };

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: { parts: [imagePart, textPart] },
    });
    
    return response.text;

  } catch (error) {
    console.error("Error decoding symbolic message:", error);
    throw new Error("A veil of static obscures the message. The transmission could not be received.");
  }
};

/**
 * Edits an image based on a textual prompt.
 * @param imageFile The source image file.
 * @param prompt The editing instruction.
 * @returns A base64 string of the edited image.
 */
export const editImageWithPrompt = async (imageFile: File, prompt: string): Promise<string> => {
    try {
        const base64Image = await blobToBase64(imageFile);
        const imagePart = {
            inlineData: {
                data: base64Image,
                mimeType: imageFile.type,
            },
        };
        const textPart = { text: prompt };

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: { parts: [imagePart, textPart] },
            config: {
                responseModalities: [Modality.IMAGE],
            },
        });

        for (const part of response.candidates[0].content.parts) {
            if (part.inlineData) {
                return part.inlineData.data;
            }
        }
        
        throw new Error("The Vision Weaver could not manifest a new reality from your request.");
    } catch (error) {
        console.error("Error editing image:", error);
        if (error instanceof Error) {
            throw error;
        }
        throw new Error("An unknown error occurred during the weaving process.");
    }
};

/**
 * Generates a high-quality image from a text prompt using Imagen 4.
 * @param prompt The text prompt describing the desired image.
 * @param aspectRatio The desired aspect ratio for the image.
 * @returns A base64 string of the generated image.
 */
export const generateImageWithImagen = async (prompt: string, aspectRatio: string): Promise<string> => {
    try {
        // Create a new instance to ensure the latest API key from the dialog is used.
        const imagenAI = new GoogleGenAI({ apiKey: process.env.API_KEY! });
        const response = await imagenAI.models.generateImages({
            model: 'imagen-4.0-generate-001',
            prompt: prompt,
            config: {
                numberOfImages: 1,
                outputMimeType: 'image/jpeg',
                aspectRatio: aspectRatio,
            },
        });

        if (response.generatedImages && response.generatedImages.length > 0) {
            return response.generatedImages[0].image.imageBytes;
        }
        
        throw new Error("The Celestial Forge returned an empty nebula. The vision could not be formed.");

    } catch (error) {
        console.error("Error generating image with Imagen:", error);
        if (error instanceof Error) {
            throw error;
        }
        throw new Error("A cosmic storm interfered with the forging process.");
    }
};

/**
 * Initiates video generation from an image and prompt using Veo.
 * @param imageBlob The source image blob.
 * @param prompt The text prompt for animation.
 * @param aspectRatio The desired video aspect ratio.
 * @returns The initial operation object from the API.
 */
export const initiateVideoGeneration = async (imageBlob: Blob, prompt: string, aspectRatio: string) => {
    const veoAI = new GoogleGenAI({ apiKey: process.env.API_KEY! });
    const base64Image = await blobToBase64(imageBlob);
    
    let operation = await veoAI.models.generateVideos({
      model: 'veo-3.1-fast-generate-preview',
      prompt: prompt,
      image: {
        imageBytes: base64Image,
        mimeType: imageBlob.type,
      },
      config: {
        numberOfVideos: 1,
        resolution: '720p',
        aspectRatio: aspectRatio,
      }
    });
    return operation;
};

/**
 * Polls the status of a video generation operation.
 * @param operation The operation object to poll.
 * @returns The updated operation object.
 */
export const pollVideoOperation = async (operation: any) => {
    const veoAI = new GoogleGenAI({ apiKey: process.env.API_KEY! });
    const updatedOperation = await veoAI.operations.getVideosOperation({ operation: operation });
    return updatedOperation;
};
