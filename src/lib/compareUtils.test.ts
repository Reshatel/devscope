import { describe, it, expect } from "vitest";
import { computeProfileStats } from "./compareUtils";
import { GitHubUser, GitHubRepo } from "@/types/github";

const mockUser: GitHubUser = {
  login: "testuser",
  name: "Test User",
  avatar_url: "",
  bio: null,
  public_repos: 2,
  followers: 42,
  following: 10,
  html_url: "",
};

const mockRepos: GitHubRepo[] = [
  {
    id: 1,
    name: "repo-a",
    html_url: "",
    description: null,
    stargazers_count: 10,
    language: "TypeScript",
    updated_at: "2026-01-01T00:00:00Z",
    fork: false,
  },
  {
    id: 2,
    name: "repo-b",
    html_url: "",
    description: null,
    stargazers_count: 5,
    language: "TypeScript",
    updated_at: "2026-01-01T00:00:00Z",
    fork: false,
  },
  {
    id: 3,
    name: "repo-c",
    html_url: "",
    description: null,
    stargazers_count: 3,
    language: "JavaScript",
    updated_at: "2026-01-01T00:00:00Z",
    fork: false,
  },
];

describe("computeProfileStats", () => {
  it("рахує загальну кількість зірок", () => {
    const stats = computeProfileStats(mockUser, mockRepos);
    expect(stats.totalStars).toBe(18);
  });

  it("визначає найпопулярнішу мову", () => {
    const stats = computeProfileStats(mockUser, mockRepos);
    expect(stats.topLanguage).toBe("TypeScript");
  });

  it("повертає null для мови, якщо репозиторіїв немає", () => {
    const stats = computeProfileStats(mockUser, []);
    expect(stats.topLanguage).toBeNull();
  });

  it("бере кількість підписників з профілю юзера", () => {
    const stats = computeProfileStats(mockUser, mockRepos);
    expect(stats.followers).toBe(42);
  });
});