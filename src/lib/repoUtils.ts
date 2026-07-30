import { GitHubRepo } from "@/types/github";

export type SortOption = "stars" | "updated" | "name";

export function sortRepos(
  repos: GitHubRepo[],
  sortBy: SortOption
): GitHubRepo[] {
  const sorted = [...repos];

  switch (sortBy) {
    case "stars":
      return sorted.sort((a, b) => b.stargazers_count - a.stargazers_count);
    case "updated":
      return sorted.sort(
        (a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
      );
    case "name":
      return sorted.sort((a, b) => a.name.localeCompare(b.name));
    default:
      return sorted;
  }
}

export function filterByLanguage(
  repos: GitHubRepo[],
  language: string | null
): GitHubRepo[] {
  if (!language) return repos;
  return repos.filter((repo) => repo.language === language);
}

export function getUniqueLanguages(repos: GitHubRepo[]): string[] {
  const languages = repos
    .map((repo) => repo.language)
    .filter((lang): lang is string => lang !== null);

  return [...new Set(languages)].sort();
}