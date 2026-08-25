import { GoogleGenAI } from "@google/genai";
import topics from "../data/topics.json";
import tools from "../data/tools.json";
import cases from "../data/cases.json";
import glossary from "../data/forensicGlossary.json";
import forensicCommands from "../data/forensicCommands.json";

export type AIProvider = "gemini" | "openai" | "auto";

export interface ChatHistoryItem {
  role: "user" | "assistant";
  content: string;
}

const GEMINI_KEY_STORAGE = "forensec_gemini_api_key";
const OPENAI_KEY_STORAGE = "forensec_openai_api_key";
const PROVIDER_STORAGE = "forensec_ai_provider";

export function getStoredApiKey(provider: "gemini" | "openai" = "gemini"): string {
  if (typeof window !== "undefined") {
    const storageKey = provider === "openai" ? OPENAI_KEY_STORAGE : GEMINI_KEY_STORAGE;
    const localKey = localStorage.getItem(storageKey);
    if (localKey && localKey.trim()) return localKey.trim();
  }

  if (provider === "openai") {
    return (import.meta.env.VITE_OPENAI_API_KEY || import.meta.env.OPENAI_API_KEY || "").trim();
  }

  return (import.meta.env.VITE_GEMINI_API_KEY || import.meta.env.GEMINI_API_KEY || "").trim();
}

export function saveApiKey(key: string, provider: "gemini" | "openai" = "gemini"): void {
  if (typeof window !== "undefined") {
    const storageKey = provider === "openai" ? OPENAI_KEY_STORAGE : GEMINI_KEY_STORAGE;
    if (key && key.trim()) {
      localStorage.setItem(storageKey, key.trim());
    } else {
      localStorage.removeItem(storageKey);
    }
  }
}

export function getActiveProviderSetting(): AIProvider {
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem(PROVIDER_STORAGE) as AIProvider | null;
    if (stored === "gemini" || stored === "openai" || stored === "auto") {
      return stored;
    }
  }
  const defaultEnv = (import.meta.env.VITE_DEFAULT_AI_PROVIDER || "auto").toLowerCase();
  if (defaultEnv === "openai") return "openai";
  if (defaultEnv === "gemini") return "gemini";
  return "auto";
}

export function setActiveProviderSetting(provider: AIProvider): void {
  if (typeof window !== "undefined") {
    localStorage.setItem(PROVIDER_STORAGE, provider);
  }
}

export function getEffectiveProvider(): "gemini" | "openai" | "dynamic" {
  const setting = getActiveProviderSetting();
  const openAiKey = getStoredApiKey("openai");
  const geminiKey = getStoredApiKey("gemini");

  if (setting === "openai" && openAiKey) return "openai";
  if (setting === "gemini" && geminiKey) return "gemini";

  if (setting === "auto") {
    if (openAiKey) return "openai";
    if (geminiKey) return "gemini";
  }

  if (openAiKey) return "openai";
  if (geminiKey) return "gemini";

  return "dynamic";
}

// SYSTEM PROMPT ENFORCING FORENSIC BOUNDARIES
export const SYSTEM_PROMPT = `
You are FORENSEC AI, an expert, real-time Digital Forensics & Incident Response (DFIR) Assistant.
You provide deep, accurate, and non-generic forensic investigation answers, code/command syntax, and workflows.

DOMAINS:
• Digital Forensics, Memory Triage (Volatility 2/3, Rekall, LiME), Disk Acquisition (FTK, dd, dc3dd, SleuthKit)
• Network Forensics (Wireshark, Zeek, Snort, PCAP), Malware Analysis (Ghidra, IDA, Radare2, YARA)
• Mobile Forensics (Cellebrite, AXIOM, Android/iOS artifacts, SQLite extraction)
• Windows/Linux/macOS Forensics (Event logs, Registry, Prefetch, Shimcache, $MFT, journal logs)
• Anti-Forensics Detection (Steganography, Timestomping, Obfuscation, Slack space carving)

RESPONSE FORMAT:
Use a clean, readable forensic format:
COMMAND: <exact forensic command or tool syntax>
PURPOSE: <clear explanation of what is being executed>
FORENSIC VALUE: <deep forensic rationale, artifacts examined, legal/technical evidence significance>
EXPECTED FINDINGS: <exact anomalies, hashes, process names, or artifacts to look for>
`;

/**
 * Dynamic Local Forensic Knowledge Synthesis Engine
 * Fallback when no live API key is configured.
 */
export function synthesizeDynamicForensicResponse(query: string): string {
  const tokens = query.toLowerCase().split(/\s+/).filter(t => t.length > 2);

  // 1. Search matching tools
  const matchingTools = tools.filter(t =>
    tokens.some(token =>
      t.name.toLowerCase().includes(token) ||
      t.category.toLowerCase().includes(token) ||
      t.useCase.toLowerCase().includes(token)
    )
  );

  // 2. Search matching topics & modules
  const matchingTopics = topics.filter(topic =>
    tokens.some(token =>
      topic.title.toLowerCase().includes(token) ||
      topic.summary.toLowerCase().includes(token) ||
      topic.sections.some(s => s.heading.toLowerCase().includes(token) || s.content.toLowerCase().includes(token))
    )
  );

  // 3. Search matching cases
  const matchingCases = cases.filter(c =>
    tokens.some(token =>
      c.id.toLowerCase().includes(token) ||
      c.scenario.toLowerCase().includes(token) ||
      c.artifacts.some(a => a.type.toLowerCase().includes(token) || a.description.toLowerCase().includes(token))
    )
  );

  // 4. Search matching commands
  const matchingCommands = forensicCommands.filter(c =>
    tokens.some(token =>
      c.command.toLowerCase().includes(token) ||
      c.category.toLowerCase().includes(token) ||
      c.description.toLowerCase().includes(token)
    )
  );

  // 5. Search glossary terms
  const matchedGlossary = Object.entries(glossary.terms).find(([term]) =>
    tokens.some(token => term.toLowerCase().includes(token) || token.includes(term.toLowerCase()))
  );

  // Synthesize dynamic response
  const primaryTool = matchingTools[0];
  const primaryCmd = matchingCommands[0];
  const primaryTopic = matchingTopics[0];
  const primaryCase = matchingCases[0];

  const suggestedCmd = primaryCmd?.command
    ? primaryCmd.command
    : primaryTool?.example?.command
      ? primaryTool.example.command
      : `volatility -f memory.raw windows.pslist`;

  const purpose = primaryCmd?.description
    ? primaryCmd.description
    : primaryTool?.useCase
      ? primaryTool.useCase
      : primaryTopic?.summary
        ? primaryTopic.summary
        : `Execute forensic triage across digital artifacts to uncover system anomalies and intrusion footprint.`;

  const forensicValue = matchedGlossary
    ? `${matchedGlossary[0].toUpperCase()}: ${matchedGlossary[1].definition} Context: ${matchedGlossary[1].context}`
    : primaryCase
      ? `Case Investigation [${primaryCase.id.toUpperCase()}]: Key artifacts include ${primaryCase.artifacts.map(a => a.type).slice(0, 3).join(', ')}.`
      : primaryTopic
        ? `Module Reference [${primaryTopic.title}]: Covers ${primaryTopic.sections.map(s => s.heading).slice(0, 3).join(' • ')}.`
        : `Provides verifiable digital evidence chain, volatile memory preservation, and timeline correlation for forensic reporting.`;

  const expectedFindings = primaryCase
    ? `Outcomes: ${primaryCase.outcomes.slice(0, 2).join(' ')}`
    : primaryTopic?.sections?.[0]?.content
      ? `Analysis Focus: ${primaryTopic.sections[0].content.substring(0, 160)}...`
      : `Anomalous network beacons, unlinked process memory segments, modified file timestamps, or extracted cryptographic hashes.`;

  return `COMMAND: ${suggestedCmd}

PURPOSE:
${purpose}

FORENSIC VALUE:
${forensicValue}

EXPECTED FINDINGS:
${expectedFindings}

(💡 Tip: Add your OpenAI or Gemini API Key via the 🔑 button in the chat header for live AI responses!)`;
}

/**
 * Call OpenAI API directly (GPT-4o-mini / GPT-4o) with conversation history
 */
async function callOpenAIApi(
  userMessage: string,
  apiKey: string,
  history: ChatHistoryItem[] = []
): Promise<string> {
  const formattedMessages = [
    { role: "system", content: SYSTEM_PROMPT },
    ...history.slice(-6).map((h) => ({ role: h.role, content: h.content })),
    { role: "user", content: userMessage },
  ];

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: formattedMessages,
      temperature: 0.3,
      max_tokens: 1000,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const errMessage = errorData?.error?.message || `OpenAI request failed with status ${response.status}`;
    throw new Error(errMessage);
  }

  const data = await response.json();
  const text = data?.choices?.[0]?.message?.content;
  if (!text) {
    throw new Error("No response text returned by OpenAI.");
  }
  return text.trim();
}

/**
 * Call Google Gemini API with conversation history
 */
async function callGeminiApi(
  userMessage: string,
  apiKey: string,
  history: ChatHistoryItem[] = []
): Promise<string> {
  const client = new GoogleGenAI({ apiKey });
  
  const conversationContext = history
    .slice(-4)
    .map(h => `${h.role === 'user' ? 'User' : 'Assistant'}: ${h.content}`)
    .join('\n\n');

  const fullPrompt = `${SYSTEM_PROMPT}

${conversationContext ? `Prior Conversation:\n${conversationContext}\n\n` : ''}User Investigation Query:
${userMessage}`;

  const response = await client.models.generateContent({
    model: "gemini-2.5-flash-lite",
    contents: fullPrompt,
  });

  const text =
    response?.candidates?.[0]?.content?.parts?.[0]?.text ||
    response?.text;

  if (!text || !text.trim()) {
    throw new Error("Empty response from Gemini");
  }

  return text.trim();
}

/**
 * Primary AI Entrypoint supporting OpenAI, Gemini, and Dynamic Local Synthesis
 */
export async function askForensecAI(
  userMessage: string,
  history: ChatHistoryItem[] = [],
  customApiKey?: string,
  preferredProvider?: AIProvider
): Promise<string> {
  const providerToUse = preferredProvider || getEffectiveProvider();

  // 1. OpenAI Path
  if (providerToUse === "openai" || (providerToUse === "auto" && getStoredApiKey("openai"))) {
    const openAiKey = customApiKey || getStoredApiKey("openai");
    if (openAiKey) {
      try {
        return await callOpenAIApi(userMessage, openAiKey, history);
      } catch (error: any) {
        console.error("OpenAI API generation error:", error);
        return `⚠️ **OpenAI Error**: ${error?.message || "Failed to communicate with OpenAI"}\n\nFalling back to dynamic forensic synthesis:\n\n${synthesizeDynamicForensicResponse(userMessage)}`;
      }
    }
  }

  // 2. Gemini Path
  if (providerToUse === "gemini" || (providerToUse === "auto" && getStoredApiKey("gemini"))) {
    const geminiKey = customApiKey || getStoredApiKey("gemini");
    if (geminiKey) {
      try {
        return await callGeminiApi(userMessage, geminiKey, history);
      } catch (error: any) {
        console.error("Gemini API generation error:", error);
        return `⚠️ **Gemini Error**: ${error?.message || "Failed to communicate with Gemini"}\n\nFalling back to dynamic forensic synthesis:\n\n${synthesizeDynamicForensicResponse(userMessage)}`;
      }
    }
  }

  // 3. Fallback to Dynamic Knowledge Synthesis
  return synthesizeDynamicForensicResponse(userMessage);
}
