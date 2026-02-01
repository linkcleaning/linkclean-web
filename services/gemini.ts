
import { GoogleGenAI } from "@google/genai";

const SYSTEM_INSTRUCTION = `
당신은 제주 프리미엄 청소 브랜드 "링크클린(LinkClean)"의 AI 시니어 컨설턴트입니다.
고객에게 청소 서비스에 대한 전문적이고 친절한 조언을 제공하는 것이 주 목적입니다.

[상담 원칙]
1. 채팅창에서 구체적인 예상 금액(예: ~원)을 직접적으로 언급하지 마십시오. 
2. 가격 문의 시에는 "공간의 면적, 오염도, 천장 높이, 특수 자재 사용 여부 및 제주의 지역적 특성(습도/염분)에 따라 견적이 상이하므로 정확한 확인이 필요함"을 정중히 설명하십시오.
3. 대신 고객이 궁금해하는 서비스의 '범위'와 '과정'을 상세히 설명하여 서비스의 가치를 전달하십시오.
4. 더 정확한 견적을 원하실 경우 "전화 상담"이나 "현장 방문 견적"이 가장 정확함을 안내하고 유도하십시오.
5. 답변은 한국어로, 정중하고 신뢰감 있는 전문가의 어조를 유지하십시오.
6. 제주의 환경적 요인(곰팡이, 염분 등)에 특화된 링크클린만의 케어 방식을 강조하십시오.
`;

export async function getCleaningAdvice(prompt: string) {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
      },
    });
    return response.text || "죄송합니다. 현재 상담이 원활하지 않습니다.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "상담 서비스에 일시적인 오류가 발생했습니다. 잠시 후 다시 시도해주세요.";
  }
}

export async function generateCleanImage(prompt: string, aspectRatio: "1:1" | "16:9" | "9:16" = "1:1") {
  // 고성능 이미지 생성을 위해 새로운 인스턴스 생성 (최신 키 사용 보장)
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-image-preview',
      contents: {
        parts: [{ text: `A high-end, professionally cleaned interior of: ${prompt}. Cinematic lighting, architectural photography, 8k resolution, minimalist aesthetic.` }],
      },
      config: {
        imageConfig: {
          aspectRatio: aspectRatio,
          imageSize: "1K"
        },
        tools: [{ googleSearch: {} }] // Visual Intelligence를 위한 검색 도구 활용
      },
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
      }
    }
    return null;
  } catch (error: any) {
    console.error("Image Generation Error:", error);
    if (error.message?.includes("Requested entity was not found.")) {
      throw new Error("KEY_RESET");
    }
    return null;
  }
}

export async function generateCleaningVideo(prompt: string, onProgress?: (msg: string) => void) {
  try {
    const dynamicAi = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    if (onProgress) onProgress("청소 전문가 AI가 현장을 분석하고 있습니다...");
    
    let operation = await dynamicAi.models.generateVideos({
      model: 'veo-3.1-fast-generate-preview',
      prompt: `A cinematic, high-definition 1080p video showing: ${prompt}. Professional cleaning transition from messy to sparkling clean, Jeju island vibes, soft morning sunlight, premium lifestyle aesthetic.`,
      config: {
        numberOfVideos: 1,
        resolution: '720p',
        aspectRatio: '16:9'
      }
    });

    const statusMessages = [
      "공간의 미세한 먼지 입자를 제거하는 중입니다...",
      "제주의 맑은 공기를 실내로 들여오고 있습니다...",
      "바닥 광택 작업을 정밀하게 진행 중입니다...",
      "최종 검수 단계를 거쳐 영상을 렌더링하고 있습니다...",
      "거의 다 되었습니다! 링크클린의 마법이 곧 공개됩니다."
    ];

    let messageIdx = 0;
    while (!operation.done) {
      if (onProgress) {
        onProgress(statusMessages[messageIdx % statusMessages.length]);
        messageIdx++;
      }
      await new Promise(resolve => setTimeout(resolve, 8000));
      operation = await dynamicAi.operations.getVideosOperation({ operation: operation });
    }

    const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
    if (!downloadLink) return null;

    const videoRes = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
    const blob = await videoRes.blob();
    return URL.createObjectURL(blob);
  } catch (error: any) {
    console.error("Video Generation Error:", error);
    if (error.message?.includes("Requested entity was not found.")) {
      throw new Error("KEY_RESET");
    }
    return null;
  }
}
