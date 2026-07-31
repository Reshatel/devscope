import { useQuery } from "@tanstack/react-query";
import { searchGitHubUsers } from "@/lib/github";
import { useDebounce } from "@/lib/useDebounce";

export function useGitHubSearchSuggestions(query: string) {
  const debouncedQuery = useDebounce(query, 350);

  return useQuery({
    queryKey: ["github-search", debouncedQuery],
    queryFn: () => searchGitHubUsers(debouncedQuery),
    enabled: debouncedQuery.trim().length > 1,
  });
}