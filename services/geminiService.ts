import { GoogleGenAI, Type, Schema } from "@google/genai";
import { Category, AnalysisResult } from "../types";

const apiKey = process.env.API_KEY;

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: apiKey });

const analysisSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    isBusinessRelated: {
      type: Type.BOOLEAN,
      description: "True if the content is related to running a business, entrepreneurship, or professional advice. False otherwise.",
    },
    category: {
      type: Type.STRING,
      enum: [
        "Agriculture",
        "Retail",
        "Technology",
        "Services",
        "Hospitality",
        "Manufacturing",
        "Other"
      ],
      description: "The most fitting business sector for the content.",
    },
    summary: {
      type: Type.STRING,
      description: "A short, 1-2 sentence summary of the business advice or story given.",
    },
    reasoning: {
      type: Type.STRING,
      description: "Brief explanation of why this classification was chosen.",
    },
    confidenceScore: {
      type: Type.NUMBER,
      description: "A score from 0 to 1 indicating confidence in the business relatedness.",
    }
  },
  required: ["isBusinessRelated", "category", "summary", "reasoning"],
};

export const analyzeContent = async (
  textContent: string,
  mediaFile: File | null
): Promise<AnalysisResult> => {
  try {
    const modelId = "gemini-2.5-flash"; // Using Flash for speed and multimodal capabilities

    const prompt = `
      You are a strict community moderator for a small business peer-to-peer platform.
      Analyze the provided content (text and/or video/image).
      
      Your goal is to:
      1. Determine if this is legitimate business advice, a business story, or operational insight.
      2. If it is NOT business related (e.g., personal vlog, gaming, spam, unrelated entertainment), mark isBusinessRelated as false.
      3. Classify it into one of the provided categories.
      4. Summarize the advice.
    `;

    const parts: any[] = [{ text: prompt }];

    if (textContent) {
      parts.push({ text: `User Text Content: ${textContent}` });
    }

    if (mediaFile) {
      const base64Data = await fileToBase64(mediaFile);
      parts.push({
        inlineData: {
          mimeType: mediaFile.type,
          data: base64Data,
        },
      });
    }

    const response = await ai.models.generateContent({
      model: modelId,
      contents: { parts: parts },
      config: {
        responseMimeType: "application/json",
        responseSchema: analysisSchema,
        temperature: 0.1, // Low temperature for consistent classification
      },
    });

    const resultText = response.text;
    if (!resultText) {
      throw new Error("No response from Gemini");
    }

    const parsedResult = JSON.parse(resultText) as AnalysisResult;

    // Map string category from JSON to Enum, fallback to Services if "Other" or unknown
    let mappedCategory = Category.SERVICES;
    const catUpper = parsedResult.category.toUpperCase();
    
    // Simple mapping logic
    if (Object.values(Category).includes(parsedResult.category as Category)) {
        mappedCategory = parsedResult.category as Category;
    } else {
        // Fallback mapping
        switch(catUpper) {
            case 'AGRICULTURE': mappedCategory = Category.AGRICULTURE; break;
            case 'RETAIL': mappedCategory = Category.RETAIL; break;
            case 'TECHNOLOGY': mappedCategory = Category.TECHNOLOGY; break;
            case 'HOSPITALITY': mappedCategory = Category.HOSPITALITY; break;
            case 'MANUFACTURING': mappedCategory = Category.MANUFACTURING; break;
            default: mappedCategory = Category.SERVICES;
        }
    }

    return {
      ...parsedResult,
      category: mappedCategory
    };

  } catch (error) {
    console.error("Gemini Analysis Failed:", error);
    throw new Error("Failed to analyze content. Please try again.");
  }
};

// Helper to convert file to base64 for Gemini InlineData
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      // Remove the Data URL prefix (e.g., "data:image/jpeg;base64,")
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = (error) => reject(error);
  });
};
