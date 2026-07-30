import { GitHubUser, GitHubRepo } from "@/types/github";

const BASE_URL = "https://api.github.com";

export async function fetchGitHubUser(username: string): Promise<GitHubUser> {
  const response = await fetch(`${BASE_URL}/users/${username}`);

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error(`Користувача "${username}" не знайдено`);
    }
    if (response.status === 403) {
      throw new Error("Перевищено ліміт запитів до GitHub API. Спробуй пізніше");
    }
    throw new Error("Щось пішло не так при завантаженні даних");
  }

  return response.json();
}

export async function fetchGitHubRepos(username: string): Promise<GitHubRepo[]> {
  const response = await fetch(
    `${BASE_URL}/users/${username}/repos?sort=updated&per_page=100`
  );

  if (!response.ok) {
    throw new Error("Не вдалося завантажити репозиторії");
  }

  const repos: GitHubRepo[] = await response.json();
  return repos.filter((repo) => !repo.fork);
}