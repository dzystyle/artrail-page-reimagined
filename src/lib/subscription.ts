export type BillingPeriod = "monthly" | "annual";

// Reference-display values only; checkout and entitlements are not connected.
export const personalPlans = [
  { price: 20, credits: 4000, description: "基础月度用量" },
  { price: 40, credits: 8000, description: "可自定义月度用量" },
  { price: 200, credits: 40000, description: "可提升生产力的用量" },
] as const;

export const dailyCredits = 300;
export const teamCreditsPerSeat = 4000;
export const teamPricePerSeat = { monthly: 20, annual: 200 } as const;

export function teamTotals(seats: number, period: BillingPeriod) {
  const count = Math.max(1, Math.floor(Number.isFinite(seats) ? seats : 1));
  return { seats: count, credits: count * teamCreditsPerSeat, price: count * teamPricePerSeat[period] };
}