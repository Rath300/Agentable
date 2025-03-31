import OpenAI from "openai";
import Anthropic from "@anthropic-ai/sdk";
import { SubscriptionTier } from "@/types/subscription";

export interface AIResponse {
  content: string;
  model: string;
  usage: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

export class AIService {
  private openai: OpenAI;
  private anthropic: Anthropic;
  private subscriptionTier: SubscriptionTier;

  constructor(apiKeys: { openai?: string; anthropic?: string }, subscriptionTier: SubscriptionTier) {
    this.openai = new OpenAI({ apiKey: apiKeys.openai });
    this.anthropic = new Anthropic({ apiKey: apiKeys.anthropic });
    this.subscriptionTier = subscriptionTier;
  }

  async generateResponse(prompt: string, model: string): Promise<AIResponse> {
    try {
      if (model.startsWith("gpt")) {
        return this.generateOpenAIResponse(prompt, model);
      } else if (model.startsWith("claude")) {
        return this.generateAnthropicResponse(prompt, model);
      } else {
        throw new Error(`Unsupported model: ${model}`);
      }
    } catch (error) {
      console.error("AI generation error:", error);
      throw error;
    }
  }

  private async generateOpenAIResponse(prompt: string, model: string): Promise<AIResponse> {
    const response = await this.openai.chat.completions.create({
      model,
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 1000,
    });

    return {
      content: response.choices[0].message.content || "",
      model: response.model,
      usage: {
        promptTokens: response.usage?.prompt_tokens || 0,
        completionTokens: response.usage?.completion_tokens || 0,
        totalTokens: response.usage?.total_tokens || 0,
      },
    };
  }

  private async generateAnthropicResponse(prompt: string, model: string): Promise<AIResponse> {
    const response = await this.anthropic.messages.create({
      model,
      max_tokens: 1000,
      messages: [{ role: "user", content: prompt }],
    });

    return {
      content: response.content[0].text,
      model: response.model,
      usage: {
        promptTokens: response.usage?.input_tokens || 0,
        completionTokens: response.usage?.output_tokens || 0,
        totalTokens: (response.usage?.input_tokens || 0) + (response.usage?.output_tokens || 0),
      },
    };
  }
} 