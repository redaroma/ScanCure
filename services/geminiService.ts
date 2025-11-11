import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult, SafetyRating } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const responseSchema = {
    type: Type.OBJECT,
    properties: {
        overallSafety: { type: Type.STRING, enum: Object.values(SafetyRating), description: "The overall safety rating for the product, which is the most severe rating among all ingredients. Unsafe > Caution > Safe." },
        summary: { type: Type.STRING, description: "A gentle, reassuring, and empathetic summary of the findings. Mention the number of ingredients found in each category." },
        ingredients: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    name: { type: Type.STRING, description: "The normalized, common name of the ingredient (e.g., 'Salicylic Acid')." },
                    safety: { type: Type.STRING, enum: Object.values(SafetyRating), description: "The safety classification for this specific ingredient." },
                    explanation: { type: Type.STRING, description: "A concise, empathetic, and science-backed explanation for the rating. Avoid alarmist language. If safe, briefly explain why." },
                    alternatives: {
                        type: Type.ARRAY,
                        description: "A list of 1-2 specific, real product suggestions that are safer alternatives and can be found on Amazon.",
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                productName: { type: Type.STRING, description: "The full, specific name of a suggested alternative product (e.g., 'The Ordinary Azelaic Acid Suspension 10%')." },
                                reason: { type: Type.STRING, description: "A brief, one-sentence reason why this is a good alternative." }
                            },
                            required: ["productName", "reason"]
                        }
                    }
                },
                required: ["name", "safety", "explanation"]
            }
        }
    },
    required: ["overallSafety", "summary", "ingredients"]
};


export const analyzeIngredientsFromImage = async (base64Image: string, mimeType: string): Promise<AnalysisResult> => {
    const model = "gemini-2.5-flash";

    const prompt = `You are a warm, empathetic, and safety-focused AI from Scan Cure, specializing in pregnancy-related product safety. Your goal is to help expectant mothers feel secure and informed.

Analyze the ingredients list from the provided image. First, perform OCR to extract all ingredients. Then, for each ingredient, determine if it is Safe, Caution, or Unsafe for use during pregnancy based on current scientific understanding.

When an ingredient is 'Caution' or 'Unsafe', suggest 1-2 real, specific, and popular product alternatives that are generally considered pregnancy-safe and are available on Amazon. For each alternative product, provide its name and a brief reason it's a good choice.

Return your analysis in the specified JSON format. The overallSafety rating must be the most severe rating found among all ingredients (Unsafe > Caution > Safe). Your tone must always be gentle, reassuring, and non-alarmist. For any uncertain cases, classify as 'Caution' and recommend consulting a doctor.`;

    const imagePart = {
        inlineData: {
            mimeType: mimeType,
            data: base64Image,
        },
    };

    const textPart = {
        text: prompt
    };

    const response = await ai.models.generateContent({
        model: model,
        contents: { parts: [imagePart, textPart] },
        config: {
            responseMimeType: "application/json",
            responseSchema: responseSchema,
            temperature: 0.2,
        },
    });

    const jsonText = response.text.trim();
    try {
        const result = JSON.parse(jsonText);
        // Post-process to ensure enum values are correct just in case
        result.ingredients.forEach((ing: any) => {
            if (!Object.values(SafetyRating).includes(ing.safety)) {
                ing.safety = SafetyRating.Unknown;
            }
        });
        if (!Object.values(SafetyRating).includes(result.overallSafety)) {
            result.overallSafety = SafetyRating.Unknown;
        }
        return result as AnalysisResult;
    } catch (e) {
        console.error("Failed to parse JSON response from Gemini:", jsonText);
        throw new Error("The AI response was not in the expected format.");
    }
};