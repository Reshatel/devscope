import { GitHubRepo, GitHubUser } from "@/types/github";

export interface ProfileStats {
  totalStars: number;
  reposCount: number;
  followers: number;
  topLanguage: string | null;
}

export function computeProfileStats(
  user: GitHubUser,
  repos: GitHubRepo[]
): ProfileStats {
  const totalStars = repos.reduce(
    (sum, repo) => sum + repo.stargazers_count,
    0
  );

  const languageCounts = repos.reduce<Record<string, number>>((acc, repo) => {
    if (repo.language) {
      acc[repo.language] = (acc[repo.language] ?? 0) + 1;
    }
    return acc;
  }, {});

  const topLanguage =
    Object.entries(languageCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;

  return {
    totalStars,
    reposCount: repos.length,
    followers: user.followers,
    topLanguage,
  };
}