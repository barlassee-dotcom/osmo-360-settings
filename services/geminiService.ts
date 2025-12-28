
import { GoogleGenAI, Type } from "@google/genai";
import { DeviceType, ProSettings, RecommendationRequest } from "../types";

const getSchema = (lang: 'TR' | 'EN') => ({
  type: Type.OBJECT,
  properties: {
    resolution: { type: Type.STRING },
    fps: { type: Type.STRING },
    shutterSpeed: { type: Type.STRING },
    iso: { type: Type.STRING },
    ev: { type: Type.STRING },
    whiteBalance: { type: Type.STRING },
    colorProfile: { type: Type.STRING },
    ndFilter: { type: Type.STRING },
    explanation: { type: Type.STRING, description: `A brief explanation in ${lang === 'TR' ? 'Turkish' : 'English'}` },
    proTips: { 
      type: Type.ARRAY, 
      items: { type: Type.STRING },
      description: `3 pro tips in ${lang === 'TR' ? 'Turkish' : 'English'}` 
    }
  },
  required: ["resolution", "fps", "shutterSpeed", "iso", "ev", "whiteBalance", "colorProfile", "ndFilter", "explanation", "proTips"],
});

export async function getSettingsRecommendation(req: RecommendationRequest): Promise<ProSettings> {
  // Hard requirement: Use process.env.API_KEY directly. 
  // If undefined, the GenAI SDK will handle the missing key error internally.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
  // Using Pro model for complex cinematography reasoning
  const model = "gemini-3-pro-preview";
  const { envData, lang } = req;
  
  const systemInstruction = lang === 'TR' 
    ? `Sen DJI Osmo 360 için uzman bir sinematografsın. Çekim aktivitesine göre (örn: motor, sabit, yürüyüş, müze, parti) en doğru ayarları önerirsin. 
    İç mekan çekimlerinde yapay ışık titremesini (anti-flicker) ve dikiş izlerini (parallax) önleme konularına odaklan. 
    Düşük ışıkta gürültü kontrolü için ISO limitlerini vurgula. 
    Dış mekanda gökyüzü detayları için hafif negatif EV öner. Tüm yanıtlarını TÜRKÇE ver.`
    : `You are an expert cinematographer for DJI Osmo 360. Recommend settings based on activity (e.g., motorcycling, static, museum, party). 
    For indoor shots, focus on preventing light flicker (anti-flicker) and stitching seams (parallax issues with close subjects). 
    Emphasize ISO limits for noise control in low light. 
    For outdoor, suggest slightly negative EV to protect highlights. Provide all responses in ENGLISH.`;

  let prompt = `${req.device} ${lang === 'TR' ? 'Ayar Reçetesi' : 'Settings Recipe'}:
  Location: ${envData.type}
  Activity: ${envData.activity}
  `;

  if (envData.isAuto) {
    prompt += `[AUTO CONTEXT] Weather: ${envData.weather}, Temp: ${envData.temp}, Local Time: ${envData.time}\n`;
  } else if (envData.type === 'OUTDOOR') {
    prompt += `Manual Context: ${envData.city}, ${envData.country}, Time: ${envData.date} ${envData.time}, Weather: ${envData.weather}\n`;
  }

  if (envData.description) {
    prompt += `Additional User Notes: ${envData.description}\n`;
  }

  const contents: any[] = [{ text: prompt }];
  if (req.image) {
    contents.push({
      inlineData: {
        mimeType: "image/jpeg",
        data: req.image.split(",")[1]
      }
    });
  }

  try {
    const response = await ai.models.generateContent({
      model,
      contents: { parts: contents },
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: getSchema(lang),
      }
    });

    if (!response.text) {
      throw new Error("EMPTY_RESPONSE");
    }

    return JSON.parse(response.text) as ProSettings;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
}
