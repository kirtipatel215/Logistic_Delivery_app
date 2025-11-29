import { GoogleGenAI } from "@google/genai";

// Initialize AI Client
// Note: In a real production app, ensure the API key is secured via server actions or a proxy.
const apiKey = (typeof process !== 'undefined' && process.env && process.env.API_KEY) ? process.env.API_KEY : '';
const ai = new GoogleGenAI({ apiKey });

export interface PlaceResult {
  address: string;
  mapLink?: string;
  sourceTitle?: string;
}

export const aiService = {
  /**
   * Uses Gemini 2.5 Flash with Maps Grounding to find a precise address and map link.
   * @param query The user's location query (e.g., "Central Park")
   */
  async findPlace(query: string): Promise<PlaceResult> {
    if (!query.trim()) return { address: '' };
    if (!apiKey) {
      console.warn("Maps Grounding skipped: No API Key found in process.env.API_KEY");
      return { address: query };
    }

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `Find the precise full address for the location: "${query}". Return the address text clearly.`,
        config: {
          tools: [{ googleMaps: {} }],
        }
      });

      // The textual response from the model (e.g., "123 Main St, New York...")
      const text = response.text ? response.text.trim() : query;
      
      // Extract Maps Grounding Metadata
      // Expected structure: groundingChunks: [{ maps: { uri: string, title: string } }]
      const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
      
      let mapLink: string | undefined = undefined;
      let sourceTitle: string | undefined = undefined;

      // Find the first valid maps chunk
      const mapChunk = chunks.find((c: any) => c.maps);
      if (mapChunk && mapChunk.maps) {
        mapLink = mapChunk.maps.uri;
        sourceTitle = mapChunk.maps.title;
      }

      return {
        address: text,
        mapLink,
        sourceTitle
      };

    } catch (error) {
      console.error("Gemini Maps Grounding Error:", error);
      // Graceful fallback: just return the query as the address
      return { address: query };
    }
  }
};