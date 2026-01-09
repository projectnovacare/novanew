import { z } from "zod";

export const CONTRACT_ADDRESS = "0x5b92a5e01419e8aaf44fcd80345a360D30c9B811";
export const USDT_ADDRESS = "0x55d398326f99059fF775485246999027B3197955"; // BSC USDT

export const PACKAGES = [
  { id: 1, name: "Starter", amount: 50, amountWei: "50000000000000000000" },
  { id: 2, name: "Pro", amount: 100, amountWei: "100000000000000000000" },
  { id: 3, name: "Elite", amount: 200, amountWei: "200000000000000000000" },
];

export const LEVEL_PERCENTAGES = [35, 12, 6, 4, 3, 3, 3, 3, 3, 2, 2, 2, 2, 2, 2, 2];

export const userProfileSchema = z.object({
  name: z.string(),
  email: z.string(),
  phone: z.string(),
});

export const userSchema = z.object({
  walletAddress: z.string(),
  upline: z.string(),
  totalInvestment: z.string(),
  directReferralsCount: z.number(),
  registrationDate: z.number(),
  isActive: z.boolean(),
  profile: userProfileSchema,
});

export const earningSchema = z.object({
  id: z.number(),
  user: z.string(),
  amount: z.string(),
  fromUser: z.string(),
  level: z.number(),
  date: z.number(),
  isClaimed: z.boolean(),
});

export const investmentSchema = z.object({
  id: z.number(),
  user: z.string(),
  packageId: z.number(),
  amount: z.string(),
  date: z.number(),
});

export const directReferralSchema = z.object({
  referralAddress: z.string(),
  name: z.string(),
  registrationDate: z.number(),
  totalInvestment: z.string(),
  isActive: z.boolean(),
});

export const dashboardDataSchema = z.object({
  totalInvestment: z.string(),
  totalEarnings: z.string(),
  unclaimedEarnings: z.string(),
  directReferralsCount: z.number(),
  levelIncome: z.string(),
  isActive: z.boolean(),
});

export type UserProfile = z.infer<typeof userProfileSchema>;
export type User = z.infer<typeof userSchema>;
export type Earning = z.infer<typeof earningSchema>;
export type Investment = z.infer<typeof investmentSchema>;
export type DirectReferral = z.infer<typeof directReferralSchema>;
export type DashboardData = z.infer<typeof dashboardDataSchema>;
