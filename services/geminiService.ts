import { GoogleGenAI, Type, Schema } from "@google/genai";
import { SearchMode, SearchResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Define the response schema to ensure structured JSON output
const sonicSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    inputAnalysis: {
      type: Type.OBJECT,
      properties: {
        artistOrSong: { type: Type.STRING, description: "The identified artist and song name from input" },
        detectedGenre: { type: Type.STRING, description: "The specific sub-genre identified" },
        sonicSignature: { type: Type.STRING, description: "Technical analysis of timbre, texture, soundstage, and rhythm" },
      },
      required: ["artistOrSong", "detectedGenre", "sonicSignature"],
    },
    recommendations: {
      type: Type.ARRAY,
      description: "Exactly 10 recommended artists",
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          genre: { type: Type.STRING },
          subGenre: { type: Type.STRING },
          style: { type: Type.STRING, description: "Description of the artist's sonic style" },
          nuancedSimilarities: { type: Type.STRING, description: "How this artist matches the input's DNA" },
          searchableName: { type: Type.STRING, description: "The most unique name to search for (e.g. 'Afterlife Tale of Us' instead of just 'Afterlife'). Do NOT add 'Music', 'Band', or 'Topic' unless it is part of the actual name." },
          youtubeChannelId: { type: Type.STRING, description: "Optional: The artist's YouTube Channel ID starting with UC if known" },
        },
        required: ["name", "genre", "subGenre", "style", "nuancedSimilarities", "searchableName"],
      },
    },
  },
  required: ["inputAnalysis", "recommendations"],
};

export const analyzeSonicStyle = async (
  query: string,
  mode: SearchMode
): Promise<SearchResult> => {
  const model = "gemini-3-flash-preview";

  const systemInstruction = `
You are a specialized Music Recommendation Engine. Your sole purpose is to analyze a user's input (Artist Name, Song Title, or Song Link) and recommend exactly 10 artists that share a highly specific "Sonic Signature."

# Input Handling & Analysis (Sonic DNA Scan)
1. **Sonic Signature Analysis:** Identify the core "DNA" of the input by analyzing:
   - **Timbre & Texture:** Analog (warm, saturated) vs. digital (crisp, precise) and organic vs. synthetic.
   - **Soundstage & Spatiality:** Widescreen/Cinematic (wide stereo, deep reverb) vs. Intimate/Dry.
   - **Rhythmic Architecture:** BPM range and the specific "groove" (e.g., syncopated beats vs. ambient washes).
2. **Contextual Identification:** Extract the artist and stylistic era from the name or provided URL (YouTube/Spotify) before processing.
3. **Sub-genre Precision:** Identify specific sub-genres.
   - **Avoid Generic:** Do not use broad terms like "Electronic", "Rock", or "Pop".
   - **Target:** Use established sub-genres like "Deep House", "Dream Pop", "Synthwave", "Lo-Fi Hip Hop", "Techno", "Indie Rock".

# Selection Modes
Current Mode: ${mode}

- **STRICT PRECISION:** (95%+ match) Only include artists that share the specific production DNA, soundstage, and rhythmic architecture. Recommendations must stay within the exact same sub-genre.
- **SONIC DISCOVERY:** (Allow 38% drift) Focus on atmospheric consistency and "Pure Vibe." Prioritize texture and mood match over strict sub-genre boundaries, allowing for adjacent genres.

# Quality Standards
- **Quantity:** Identify exactly 10 artists.
- **Production Fidelity:** Recommendations must meet or exceed the technical production quality of the source.

# Link Optimization
- **searchableName:** This is CRITICAL. Provide a name that uniquely identifies the artist on YouTube.
  - If the artist is "Afterlife" (generic), return "Afterlife Tale of Us".
  - If the artist is "Health" (generic), return "Health band".
  - If the artist is "Lemongrass", return "Lemongrass".
  - **Do NOT** append "Topic" or "Music" to this string. The frontend will handle suffixes.
  `;

  const prompt = `Analyze the sonic DNA of: "${query}". Provide 10 recommendations based on ${mode} mode rules.`;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: sonicSchema,
        temperature: mode === 'STRICT' ? 0.3 : 0.7, // Lower temp for strict, higher for discovery
      },
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");

    const parsed = JSON.parse(text);
    
    // Inject the mode used into the result for the UI to display
    return {
      ...parsed,
      inputAnalysis: {
        ...parsed.inputAnalysis,
        modeUsed: mode
      }
    };

  } catch (error) {
    console.error("Sonic DNA Analysis Failed:", error);
    throw error;
  }
};