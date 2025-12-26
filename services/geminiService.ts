import { GoogleGenAI, Type } from "@google/genai";
import { SocialPost } from "../types";

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateSocialPost = async (
  inputText: string, 
  onStatusUpdate?: (status: string) => void
): Promise<SocialPost> => {
  try {
    // Step 1: Generate Text Content
    if (onStatusUpdate) onStatusUpdate("正在構思爆紅文案...");
    
    const textResponse = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `請將以下內容改寫為一篇極具吸引力的社群媒體貼文（如 Facebook, Instagram, Threads）。
      
      角色設定：你是一位頂尖的網路行銷專家、社群小編，擅長「爆文寫作」與「點擊誘餌（Clickbait）」心理學。
      
      要求：
      1. 標題 (Headline)：必須非常聳動、具備懸念或強烈的情緒價值，讓人忍不住想點開。使用「痛點」、「秘密」、「震驚」或「數字」等元素。
      2. 內文 (Body)：使用口語化、親切但專業的語氣。分段清楚，加入適當的表情符號 (Emoji) 增加易讀性。
      3. 行動呼籲 (CTA)：結尾必須有一個強而有力的 CTA，引導讀者按讚、留言、分享或點擊連結。
      4. 標籤 (Hashtags)：生成 3-5 個高流量的相關 Hashtag。
      5. 語言：繁體中文 (Traditional Chinese - Taiwan)。

      原文內容：
      ${inputText}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            headline: {
              type: Type.STRING,
              description: "The sensational headline designed to get clicks.",
            },
            body: {
              type: Type.STRING,
              description: "The main content of the post, formatted with line breaks.",
            },
            cta: {
              type: Type.STRING,
              description: "Call to action phrase.",
            },
            hashtags: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "List of relevant hashtags.",
            },
          },
          required: ["headline", "body", "cta", "hashtags"],
        },
      },
    });

    const resultText = textResponse.text;
    if (!resultText) {
      throw new Error("Text generation failed");
    }

    const postData = JSON.parse(resultText) as SocialPost;

    // Step 2: Generate Image
    if (onStatusUpdate) onStatusUpdate("正在繪製吸睛配圖...");

    try {
      // Simplified prompt to avoid safety filters and focus on visual style
      const imagePrompt = `Create a high-quality, eye-catching social media illustration for a post about: "${postData.headline}".
      Style: Modern, colorful, professional digital art.
      Requirements: 1:1 aspect ratio, high resolution, no text in the image.`;

      const imageResponse = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: imagePrompt,
        config: {
          imageConfig: {
            aspectRatio: "1:1",
          }
        }
      });

      let imageUrl = "";
      
      if (imageResponse.candidates?.[0]?.content?.parts) {
        for (const part of imageResponse.candidates[0].content.parts) {
          if (part.inlineData) {
            const base64String = part.inlineData.data;
            imageUrl = `data:image/png;base64,${base64String}`;
            break;
          } else if (part.text) {
             console.warn("Image model returned text instead of image:", part.text);
             // If the model refuses to generate an image, it usually returns text explanation
             if (!imageUrl) {
                 postData.imageError = "AI 無法生成圖片: " + part.text.substring(0, 100) + "...";
             }
          }
        }
      }
      
      if (imageUrl) {
        postData.imageUrl = imageUrl;
      } else if (!postData.imageError) {
        postData.imageError = "圖片生成失敗，未返回圖像數據。";
      }

    } catch (imgError: any) {
      console.error("Image generation failed:", imgError);
      postData.imageError = "圖片服務暫時無法使用 (" + (imgError.message || "Unknown error") + ")";
    }

    return postData;

  } catch (error) {
    console.error("Error generating post:", error);
    throw new Error("生成失敗，請稍後再試或檢查您的 API Key。");
  }
};
