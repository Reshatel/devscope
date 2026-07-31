import { describe, it, expect } from "vitest";
import { getLanguageDistribution, getComparisonData } from "./chartUtils";
import { GitHubRepo } from "@/types/github";
import { ProfileStats } from "./compareUtils";

const mockRepos: GitHubRepo[] = [
  {
    id: 1,
    name: "a",
    html_url: "",
    description: null,
    stargazers_count: 1,
    language: "TypeScript",
    updated_at: "2026-01-01T00:00:00Z",
    fork: false,
  },
  {
    id: 2,
    name: "b",
    html_url: "",
    description: null,
    stargazers_count: 2,
    language: "TypeScript",
    updated_at: "2026-01-01T00:00:00Z",
    fork: false,
  },
  {
    id: 3,
    name: "c",
    html_url: "",
    description: null,
    stargazers_count: 3,
    language: "JavaScript",
    updated_at: "2026-01-01T00:00:00Z",
    fork: false,
  },
];

describe("getLanguageDistribution", () => {
  it("рахує кількість репо на мову, відсортовано спадно", () => {
    expect(getLanguageDistribution(mockRepos)).toEqual([
      { name: "TypeScript", value: 2 },
      { name: "JavaScript", value: 1 },
    ]);
  });

  it("повертає порожній масив, якщо репо немає", () => {
    expect(getLanguageDistribution([])).toEqual([]);
  });
});

describe("getComparisonData", () => {
  it("будує три рядки метрик з іменами юзерів як ключами", () => {
    const statsA: ProfileStats = {
      totalStars: 10,
      reposCount: 5,
      followers: 100,
      topLanguage: "TypeScript",
    };
    const statsB: ProfileStats = {
      totalStars: 20,
      reposCount: 8,
      followers: 200,
      topLanguage: "JavaScript",
    };

    const result = getComparisonData("userA", statsA, "userB", statsB);

    expect(result).toEqual([
      { metric: "Зірки", userA: 10, userB: 20 },
      { metric: "Репозиторії", userA: 5, userB: 8 },
      { metric: "Підписники", userA: 100, userB: 200 },
    ]);
  });
});