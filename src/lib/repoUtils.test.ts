import { describe, it, expect } from "vitest";
import { sortRepos, filterByLanguage, getUniqueLanguages } from "./repoUtils";
import { GitHubRepo } from "@/types/github";

const mockRepos: GitHubRepo[] = [
  {
    id: 1,
    name: "zebra-project",
    html_url: "",
    description: null,
    stargazers_count: 5,
    language: "TypeScript",
    updated_at: "2026-01-01T00:00:00Z",
    fork: false,
  },
  {
    id: 2,
    name: "alpha-project",
    html_url: "",
    description: null,
    stargazers_count: 100,
    language: "JavaScript",
    updated_at: "2026-06-01T00:00:00Z",
    fork: false,
  },
  {
    id: 3,
    name: "middle-project",
    html_url: "",
    description: null,
    stargazers_count: 20,
    language: "TypeScript",
    updated_at: "2026-03-01T00:00:00Z",
    fork: false,
  },
];

describe("sortRepos", () => {
  it("сортує за зірками спадно", () => {
    const result = sortRepos(mockRepos, "stars");
    expect(result.map((r) => r.name)).toEqual([
      "alpha-project",
      "middle-project",
      "zebra-project",
    ]);
  });

  it("сортує за іменем алфавітно", () => {
    const result = sortRepos(mockRepos, "name");
    expect(result.map((r) => r.name)).toEqual([
      "alpha-project",
      "middle-project",
      "zebra-project",
    ]);
  });

  it("не мутує оригінальний масив", () => {
    const original = [...mockRepos];
    sortRepos(mockRepos, "stars");
    expect(mockRepos).toEqual(original);
  });
});

describe("filterByLanguage", () => {
  it("фільтрує за конкретною мовою", () => {
    const result = filterByLanguage(mockRepos, "TypeScript");
    expect(result).toHaveLength(2);
    expect(result.every((r) => r.language === "TypeScript")).toBe(true);
  });

  it("повертає всі репо, якщо мова не вказана", () => {
    const result = filterByLanguage(mockRepos, null);
    expect(result).toHaveLength(3);
  });
});

describe("getUniqueLanguages", () => {
  it("повертає унікальні мови відсортовані за алфавітом", () => {
    expect(getUniqueLanguages(mockRepos)).toEqual([
      "JavaScript",
      "TypeScript",
    ]);
  });
});