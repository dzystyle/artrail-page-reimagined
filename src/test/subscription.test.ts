import { describe, expect, it } from "vitest";
import { dailyCredits, personalPlans, teamPricePerSeat, teamTotals } from "@/lib/subscription";

describe("reference subscription amounts", () => {
  it("uses the three monthly personal prices from the reference", () => {
    expect(personalPlans.map(plan => plan.price)).toEqual([20, 40, 200]);
  });
  it("uses the three monthly personal credit grants from the reference", () => {
    expect(personalPlans.map(plan => plan.credits)).toEqual([4000, 8000, 40000]);
  });
  it("shows 300 daily refresh credits", () => {
    expect(dailyCredits).toBe(300);
  });
  it("prices team seats at 20 monthly or 200 yearly", () => {
    expect(teamPricePerSeat).toEqual({ monthly: 20, annual: 200 });
  });
  it("gives ten seats 40000 monthly shared credits", () => {
    expect(teamTotals(10, "monthly").credits).toBe(40000);
  });
  it("totals ten monthly seats at 200", () => {
    expect(teamTotals(10, "monthly").price).toBe(200);
  });
  it("charges annual seats as a full year, not monthly installments", () => {
    expect(teamTotals(10, "annual").price).toBe(2000);
  });
});