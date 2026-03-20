import { PickupRequest, User } from "@/data/types";

export type IncentiveLevel = "Bronze" | "Silver" | "Gold" | "Platinum";

export interface EcoScoreResult {
  score: number; // 0-100
  level: IncentiveLevel;
  levelProgress: number; // 0-100 progress toward next level
  breakdown: {
    frequency: number;
    wasteImpact: number;
    packagingContribution: number;
    diversity: number;
  };
}

const LEVEL_THRESHOLDS: { level: IncentiveLevel; min: number }[] = [
  { level: "Platinum", min: 80 },
  { level: "Gold", min: 55 },
  { level: "Silver", min: 30 },
  { level: "Bronze", min: 0 },
];

export const LEVEL_COLORS: Record<IncentiveLevel, string> = {
  Bronze: "hsl(30, 60%, 50%)",
  Silver: "hsl(210, 10%, 60%)",
  Gold: "hsl(45, 90%, 50%)",
  Platinum: "hsl(200, 70%, 55%)",
};

export const LEVEL_BG: Record<IncentiveLevel, string> = {
  Bronze: "bg-orange-100 text-orange-700 border-orange-200",
  Silver: "bg-gray-100 text-gray-600 border-gray-200",
  Gold: "bg-yellow-100 text-yellow-700 border-yellow-200",
  Platinum: "bg-sky-100 text-sky-700 border-sky-200",
};

export function calculateEcoScore(user: User, pickups: PickupRequest[]): EcoScoreResult {
  const userPickups = pickups.filter((p) => p.userId === user.id && p.status === "completed");
  const totalPickups = pickups.filter((p) => p.status === "completed").length || 1;

  // Frequency score (0-30): based on number of completed pickups
  const frequency = Math.min(30, userPickups.length * 6);

  // Waste impact score (0-30): higher weight for plastic/e-waste
  const wasteWeights: Record<string, number> = { plastic: 3, "e-waste": 4, cardboard: 2 };
  const weightedWaste = userPickups.reduce((sum, p) => sum + p.weight * (wasteWeights[p.wasteType] || 2), 0);
  const wasteImpact = Math.min(30, Math.round(weightedWaste * 2));

  // Packaging contribution (0-20)
  const ecomPickups = userPickups.filter((p) => p.isEcommercePackaging).length;
  const packagingContribution = Math.min(20, ecomPickups * 5);

  // Diversity score (0-20): using different waste types
  const uniqueTypes = new Set(userPickups.map((p) => p.wasteType)).size;
  const diversity = Math.min(20, uniqueTypes * 7);

  const score = Math.min(100, frequency + wasteImpact + packagingContribution + diversity);

  const currentLevel = LEVEL_THRESHOLDS.find((l) => score >= l.min)!;
  const nextLevel = LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.indexOf(currentLevel) - 1];
  const levelProgress = nextLevel
    ? Math.round(((score - currentLevel.min) / (nextLevel.min - currentLevel.min)) * 100)
    : 100;

  return {
    score,
    level: currentLevel.level,
    levelProgress: Math.min(100, levelProgress),
    breakdown: { frequency, wasteImpact, packagingContribution, diversity },
  };
}

export interface SocietyIndex {
  name: string;
  totalWaste: number;
  activeUsers: number;
  avgEcoScore: number;
  sustainabilityScore: number;
  packagingPercentage: number;
  rank: number;
}

export function calculateSocietyIndex(
  users: User[],
  pickups: PickupRequest[]
): SocietyIndex[] {
  const societies = new Map<string, { users: User[]; pickups: PickupRequest[] }>();

  users.forEach((u) => {
    if (!societies.has(u.society)) societies.set(u.society, { users: [], pickups: [] });
    societies.get(u.society)!.users.push(u);
  });

  pickups.forEach((p) => {
    if (!societies.has(p.society)) societies.set(p.society, { users: [], pickups: [] });
    societies.get(p.society)!.pickups.push(p);
  });

  const results: SocietyIndex[] = [];
  societies.forEach((data, name) => {
    const completedPickups = data.pickups.filter((p) => p.status === "completed");
    const totalWaste = completedPickups.reduce((sum, p) => sum + p.weight, 0);
    const ecomPickups = completedPickups.filter((p) => p.isEcommercePackaging);
    const packagingPercentage = completedPickups.length
      ? Math.round((ecomPickups.length / completedPickups.length) * 100)
      : 0;

    const ecoScores = data.users.map((u) => calculateEcoScore(u, pickups).score);
    const avgEcoScore = ecoScores.length
      ? Math.round(ecoScores.reduce((a, b) => a + b, 0) / ecoScores.length)
      : 0;

    // Sustainability score: weighted combo
    const sustainabilityScore = Math.min(
      100,
      Math.round(avgEcoScore * 0.4 + Math.min(40, totalWaste * 2) + Math.min(20, data.users.length * 5))
    );

    results.push({
      name,
      totalWaste: Math.round(totalWaste * 10) / 10,
      activeUsers: data.users.length,
      avgEcoScore,
      sustainabilityScore,
      packagingPercentage,
      rank: 0,
    });
  });

  results.sort((a, b) => b.sustainabilityScore - a.sustainabilityScore);
  results.forEach((r, i) => (r.rank = i + 1));
  return results;
}
