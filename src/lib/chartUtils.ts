import { GitHubRepo } from "@/types/github";
import { ProfileStats } from "@/lib/compareUtils";

export interface LanguageDataPoint {
  name: string;
  value: number;
}

export interface ComparisonDataPoint {
  metric: string;
  [username: string]: string | number;
}

export function getLanguageDistribution(
  repos: GitHubRepo[]
): LanguageDataPoint[] {
  const counts = repos.reduce<Record<string, number>>((acc, repo) => {
    if (repo.language) {
      acc[repo.language] = (acc[repo.language] ?? 0) + 1;
    }
    return acc;
  }, {});

  return Object.entries(counts)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);
}

export function getComparisonData(
  mainUsername: string,
  mainStats: ProfileStats,
  compareUsername: string,
  compareStats: ProfileStats
): ComparisonDataPoint[] {
  return [
    {
      metric: "Зірки",
      [mainUsername]: mainStats.totalStars,
      [compareUsername]: compareStats.totalStars,
    },
    {
      metric: "Репозиторії",
      [mainUsername]: mainStats.reposCount,
      [compareUsername]: compareStats.reposCount,
    },
    {
      metric: "Підписники",
      [mainUsername]: mainStats.followers,
      [compareUsername]: compareStats.followers,
    },
  ];
}