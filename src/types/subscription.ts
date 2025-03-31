export type SubscriptionTier = "free" | "pro" | "enterprise";

export interface SubscriptionFeatures {
  maxWorkflows: number;
  maxWorkflowExecutions: number;
  maxTeamMembers: number;
  aiModels: string[];
  apiAccess: boolean;
  prioritySupport: boolean;
  customBranding: boolean;
}

export interface SubscriptionPlan {
  tier: SubscriptionTier;
  name: string;
  price: number;
  billingPeriod: "monthly" | "yearly";
  features: SubscriptionFeatures;
}

export const SUBSCRIPTION_PLANS: Record<SubscriptionTier, SubscriptionPlan> = {
  free: {
    tier: "free",
    name: "Free",
    price: 0,
    billingPeriod: "monthly",
    features: {
      maxWorkflows: 3,
      maxWorkflowExecutions: 100,
      maxTeamMembers: 1,
      aiModels: ["gpt-3.5-turbo"],
      apiAccess: false,
      prioritySupport: false,
      customBranding: false,
    },
  },
  pro: {
    tier: "pro",
    name: "Pro",
    price: 49,
    billingPeriod: "monthly",
    features: {
      maxWorkflows: 20,
      maxWorkflowExecutions: 1000,
      maxTeamMembers: 5,
      aiModels: ["gpt-3.5-turbo", "gpt-4"],
      apiAccess: true,
      prioritySupport: true,
      customBranding: false,
    },
  },
  enterprise: {
    tier: "enterprise",
    name: "Enterprise",
    price: 199,
    billingPeriod: "monthly",
    features: {
      maxWorkflows: 100,
      maxWorkflowExecutions: 10000,
      maxTeamMembers: 20,
      aiModels: ["gpt-3.5-turbo", "gpt-4", "claude-2"],
      apiAccess: true,
      prioritySupport: true,
      customBranding: true,
    },
  },
}; 