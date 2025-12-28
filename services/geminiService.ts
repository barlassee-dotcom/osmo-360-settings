
import { GoogleGenAI, Type } from "@google/genai";
import { DeviceType, EnvironmentType, ProSettings, RecommendationRequest } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

const PRO_SETTINGS_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    resolution: { type: Type.STRING, description: "Recommended resolution (e.g., 5.7K, 4K 360)" },
    fps: { type: Type.STRING, description: "Recommended frames per second (e.g., 24, 30, 60)" },
    shutterSpeed: { type: Type.STRING, description: "Recommended shutter speed based on 180-degree rule for motion blur" },
    iso: { type: Type.STRING, description: "Recommended ISO range or fixed value" },
    ev: { type: Type.STRING, description: "Recommended Exposure Value compensation (e.g., -0.3, -0.7, 0.0)" },
    whiteBalance: { type: Type.STRING, description: "Recommended Kelvin value for consistency across lenses" },
    colorProfile: { type: Type.STRING, description: "Recommended profile (D-Log, HDR, or Standard)" },
    ndFilter: { type: Type.STRING, description: "Recommended ND filter strength for the 360 lenses" },
    explanation: { type: Type.STRING, description: "Brief explanation of why these settings were chosen for 360 capture" },
    proTips: { 
      type: Type.ARRAY, 
      items: { type: Type.STRING },
      description: "3 specific pro tips for 360-degree filming in this scenario" 
    }
  },
  required: ["resolution", "fps", "shutterSpeed", "iso", "ev", "whiteBalance", "colorProfile", "ndFilter", "explanation", "proTips"],
};

export async function getSettingsRecommendation(req: RecommendationRequest): Promise<ProSettings> {
  const model = "gemini-3-flash-preview";
  
  const systemInstruction = `You are a world-class 360-degree cinematographer and technical expert for the DJI Osmo 360 camera system. 
  Your goal is to provide precise 'Pro Mode' settings. 
  For 360 capture, focus on:
  1. Manual White Balance (CRITICAL for 360 to avoid stitching seams).
  2. The 180-degree rule for motion blur.
  3. EV (Exposure Value) management: In 360, it's often better to underexpose slightly (e.g., -0.3 or -0.7) to preserve sky details.
  4. ISO management to minimize noise in dark areas of the 360 sphere.
  5. Advice on 360-specific features like HorizonSteady.`;

  const prompt = `Provide the absolute best Pro Mode settings for the ${req.device}.
  Environment: ${req.environment}
  ${req.image ? "Analysis of the provided image is required to determine the exact lighting conditions, dynamic range, and required EV offset." : ""}
  
  Return the response in JSON format. Ensure the EV value is explicitly included to help the user avoid highlight clipping.`;

  const contents: any[] = [{ text: prompt }];
  if (req.image) {
    contents.push({
      inlineData: {
        mimeType: "image/jpeg",
        data: req.image.split(",")[1]
      }
    });
  }

  const response = await ai.models.generateContent({
    model,
    contents: { parts: contents },
    config: {
      systemInstruction,
      responseMimeType: "application/json",
      responseSchema: PRO_SETTINGS_SCHEMA,
    }
  });

  return JSON.parse(response.text || "{}") as ProSettings;
}
