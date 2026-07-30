import { useQuery } from "@tanstack/react-query";
import { fetchGitHubUser, fetchGitHubRepos } from "@/lib/github";

export function useGitHubUser(username: string) {
  return useQuery({
    queryKey: ["github-user", username],
    queryFn: () => fetchGitHubUser(username),
    enabled: username.length > 0,
  });
}

export function useGitHubRepos(username: string) {
  return useQuery({
    queryKey: ["github-repos", username],
    queryFn: () => fetchGitHubRepos(username),
    enabled: username.length > 0,
  });
}