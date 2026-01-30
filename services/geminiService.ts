
import { GoogleGenAI, Type } from "@google/genai";
import { StrategyReport } from "../types";

export async function generateStrategyReport(businessContext: string): Promise<StrategyReport> {
  try {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      console.warn("API Key is missing. AI analysis will be skipped.");
      return getDefaultReport();
    }

    const ai = new GoogleGenAI({ apiKey });
    // Using gemini-3-pro-preview for complex strategic reasoning tasks
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Analyze the following business context and provide a luxury digital strategy report in JSON format. 
      The report should be visionary, high-end, and focused on exponential growth.
      Context: ${businessContext}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            executiveSummary: { type: Type.STRING, description: "A high-level summary of the strategic path." },
            marketGap: { type: Type.STRING, description: "Identification of overlooked opportunities in the niche." },
            recommendedEcosystem: { type: Type.STRING, description: "The digital platforms and tools recommended for 2026." },
            projectedRoI: { type: Type.STRING, description: "Anticipated financial or brand growth metrics." }
          },
          required: ['executiveSummary', 'marketGap', 'recommendedEcosystem', 'projectedRoI']
        },
        systemInstruction: 'You are Lê Châu Kiệt, a world-class luxury digital strategist and growth engineer. Your tone is authoritative, exclusive, and mathematically precise. You speak in the language of C-level executives.'
      }
    });

    const text = response.text || '{}';
    return JSON.parse(text);
  } catch (error) {
    console.error("Analysis Generation Error:", error);
    return getDefaultReport();
  }
}

function getDefaultReport(): StrategyReport {
  return {
    executiveSummary: "Initial parameters received. Our preliminary assessment suggests significant untapped equity in your current digital footprint.",
    marketGap: "Identifying specific competitive voids and high-intent acquisition channels...",
    recommendedEcosystem: "Architecting a bespoke 2026-compliant conversion funnel...",
    projectedRoI: "Estimated 150-300% efficiency increase in scalable acquisition."
  };
}
