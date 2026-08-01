"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { useGitHubUser, useGitHubRepos } from "@/lib/useGitHubUser";
import { useFavoritesStore } from "@/store/useFavoritesStore";
import { formatStars } from "@/lib/formatStars";
import { sortRepos, filterByLanguage, getUniqueLanguages, SortOption } from "@/lib/repoUtils";
import { computeProfileStats } from "@/lib/compareUtils";
import { ProfileSkeleton } from "@/components/ProfileSkeleton";
import { getLanguageDistribution } from "@/lib/chartUtils";
import { LanguageChart } from "@/components/LanguageChart";
import { getComparisonData } from "@/lib/chartUtils";
import { ComparisonChart } from "@/components/ComparisonChart";
import { useGitHubSearchSuggestions } from "@/lib/useGitHubSearchSuggestions";
import { HunkHeader } from "@/components/HunkHeader";
import { AnimatedNumber } from "@/components/AnimatedNumber";
import { CommandPalette } from "@/components/CommandPalette";

export function ProfileSearch() {
  const [inputValue, setInputValue] = useState("");
  const [searchedUsername, setSearchedUsername] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("stars");
  const [languageFilter, setLanguageFilter] = useState<string | null>(null);
  const [compareInput, setCompareInput] = useState("");
  const [compareUsername, setCompareUsername] = useState("");
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [isCompareInputFocused, setIsCompareInputFocused] = useState(false);

  const { data: compareUser, isLoading: compareUserLoading } = useGitHubUser(compareUsername);
  const { data: compareRepos } = useGitHubRepos(compareUsername);
  const { data: user, isLoading: userLoading, error: userError } = useGitHubUser(searchedUsername);
  const { data: repos, isLoading: reposLoading } = useGitHubRepos(searchedUsername);
  const { data: suggestions } = useGitHubSearchSuggestions(inputValue);
  const { favorites, addFavorite, removeFavorite, isFavorite } = useFavoritesStore();
  const { data: compareSuggestions } = useGitHubSearchSuggestions(compareInput);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSearchedUsername(inputValue.trim());
  }

  function handleCompareSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = compareInput.trim();
    if (trimmed.toLowerCase() === searchedUsername.toLowerCase()) {
      return;
    }
    setCompareUsername(trimmed);
  }

  const languageData = repos ? getLanguageDistribution(repos) : [];
  const processedRepos = repos ? sortRepos(filterByLanguage(repos, languageFilter), sortBy) : [];
  const availableLanguages = repos ? getUniqueLanguages(repos) : [];
  const mainStats = user && repos ? computeProfileStats(user, repos) : null;
  const compareStats = compareUser && compareRepos ? computeProfileStats(compareUser, compareRepos) : null;
  const comparisonChartData =
    mainStats && compareStats && user && compareUser
      ? getComparisonData(user.login, mainStats, compareUser.login, compareStats)
      : [];

  return (
    <div className="mx-auto mt-10 max-w-2xl p-6">
        <CommandPalette
  favorites={favorites}
  onSearch={(username) => {
    setInputValue(username);
    setSearchedUsername(username);
  }}
/>
      {favorites.length > 0 && (
        <div className="mb-4 flex flex-wrap gap-2">
          {favorites.map((username) => (
            <button
              key={username}
              onClick={() => {
                setInputValue(username);
                setSearchedUsername(username);
              }}
              className="rounded-full border border-amber/40 px-3 py-1 font-mono text-xs text-amber hover:bg-amber/10"
            >
              + {username}
            </button>
          ))}
        </div>
      )}

      <form onSubmit={handleSubmit} className="relative flex gap-2">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onFocus={() => setIsInputFocused(true)}
          onBlur={() => setTimeout(() => setIsInputFocused(false), 150)}
          placeholder="git checkout username"
          className="flex-1 rounded-lg border border-sage/30 bg-surface px-4 py-2 font-mono text-sm text-bone placeholder:text-sage/60 focus:border-amber focus:outline-none"
        />
        <motion.button
            type="submit"
             whileHover={{ scale: 1.03 }}
             whileTap={{ scale: 0.97 }}
             className="rounded-lg bg-amber px-4 py-2 font-mono text-sm font-medium text-ink"
              >
             search
            </motion.button>

        {isInputFocused && suggestions && suggestions.length > 0 && (
          <ul className="absolute top-full left-0 z-10 mt-1 w-full max-w-[calc(100%-88px)] rounded-lg border border-sage/20 bg-surface shadow-lg">
            {suggestions.map((suggestion) => (
              <li key={suggestion.id}>
                <button
                  type="button"
                  onClick={() => {
                    setInputValue(suggestion.login);
                    setSearchedUsername(suggestion.login);
                    setIsInputFocused(false);
                  }}
                  className="flex w-full items-center gap-2 px-4 py-2 text-left hover:bg-surface-hover"
                >
                  <img src={suggestion.avatar_url} alt={suggestion.login} className="h-6 w-6 rounded-full" />
                  <span className="font-mono text-sm text-bone">{suggestion.login}</span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </form>

      {userLoading && <ProfileSkeleton />}

      {userError && (
        <p className="mt-4 font-mono text-sm text-red-400">// {userError.message}</p>
      )}

      {user && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mt-6 rounded-lg border border-sage/20 bg-surface p-4"
        >
          <div className="flex items-center gap-4">
            <img src={user.avatar_url} alt={user.login} className="h-16 w-16 rounded-full" />
            <div>
              <h2 className="font-[family-name:var(--font-display)] text-lg font-semibold text-bone">
                {user.name ?? user.login}
              </h2>
              <p className="font-mono text-sm text-sage">@{user.login}</p>
            </div>
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() =>
                  isFavorite(user.login) ? removeFavorite(user.login) : addFavorite(user.login)
                }
                className="ml-auto rounded-lg border border-sage/30 px-3 py-1 font-mono text-xs text-sage hover:border-amber hover:text-amber"
                >
                 {isFavorite(user.login) ? "+ saved" : "+ save"}
                </motion.button>
          </div>

          {user.bio && <p className="mt-3 text-sm text-bone/80">{user.bio}</p>}

          <div className="mt-3 flex gap-4 font-mono text-xs text-sage">
            <span>{user.public_repos} repos</span>
            <span>{user.followers} followers</span>
          </div>
        </motion.div>
      )}

      {repos && repos.length > 0 && (
        <div className="mt-6 rounded-lg border border-sage/20 bg-surface p-4">
          <HunkHeader text="@@ language distribution @@" />
          <div className="mt-2">
            <LanguageChart data={languageData} />
          </div>
        </div>
      )}

      {reposLoading && <p className="mt-4 font-mono text-sm text-sage">// loading repositories...</p>}

      {repos && (
        <>
          <div className="mt-6 flex gap-3">
            <select
                 value={sortBy}
                 onChange={(e) => setSortBy(e.target.value as SortOption)}
                 className="appearance-none rounded-lg border border-sage/30 bg-surface bg-[length:14px] bg-[right_10px_center] bg-no-repeat py-1.5 pl-3 pr-8 font-mono text-xs text-bone transition-colors hover:border-amber/50 focus:border-amber focus:outline-none"
                 style={{
                  backgroundImage:
                    "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%238B9C8F'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E\")",
                 }}
                >
              <option value="stars">sort: stars</option>
              <option value="updated">sort: updated</option>
              <option value="name">sort: name</option>
            </select>

            <select
                value={languageFilter ?? ""}
                onChange={(e) => setLanguageFilter(e.target.value || null)}
                  className="appearance-none rounded-lg border border-sage/30 bg-surface bg-[length:14px] bg-[right_10px_center] bg-no-repeat py-1.5 pl-3 pr-8 font-mono text-xs text-bone transition-colors hover:border-amber/50 focus:border-amber focus:outline-none"
                style={{
                 backgroundImage:
                   "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%238B9C8F'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E\")",
                }}
                >
              <option value="">all languages</option>
              {availableLanguages.map((lang) => (
                <option key={lang} value={lang}>
                  {lang}
                </option>
              ))}
            </select>
          </div>

          <ul className="mt-4 space-y-2">
            {processedRepos.slice(0, 10).map((repo) => (
              <motion.li
                key={repo.id}
                layout
                className="rounded-lg border border-sage/20 bg-surface p-3"
              >
                <a
                  href={repo.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-sm font-medium text-periwinkle hover:underline"
                >
                  {repo.name}
                </a>
                {repo.description && <p className="text-sm text-bone/70">{repo.description}</p>}
                <div className="mt-1 flex gap-3 font-mono text-xs text-sage">
                  {repo.language && <span>{repo.language}</span>}
                  <span>★ {formatStars(repo.stargazers_count)}</span>
                </div>
              </motion.li>
            ))}
          </ul>
        </>
      )}

      <div className="mt-10 border-t border-sage/20 pt-6">
        <HunkHeader text="@@ compare with another profile @@" />

        <form onSubmit={handleCompareSubmit} className="relative mt-3 flex gap-2">
          <input
            type="text"
            value={compareInput}
            onChange={(e) => setCompareInput(e.target.value)}
            onFocus={() => setIsCompareInputFocused(true)}
            onBlur={() => setTimeout(() => setIsCompareInputFocused(false), 150)}
            placeholder="git merge username"
            className="flex-1 rounded-lg border border-sage/30 bg-surface px-4 py-2 font-mono text-sm text-bone placeholder:text-sage/60 focus:border-periwinkle focus:outline-none"
          />
         <motion.button
            type="submit"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="rounded-lg bg-periwinkle px-4 py-2 font-mono text-sm font-medium text-ink"
            >
            merge
            </motion.button>

          {isCompareInputFocused && compareSuggestions && compareSuggestions.length > 0 && (
            <ul className="absolute top-full left-0 z-10 mt-1 w-full max-w-[calc(100%-88px)] rounded-lg border border-sage/20 bg-surface shadow-lg">
              {compareSuggestions.map((suggestion) => (
                <li key={suggestion.id}>
                  <button
                    type="button"
                    onClick={() => {
                      setCompareInput(suggestion.login);
                      setCompareUsername(suggestion.login);
                      setIsCompareInputFocused(false);
                    }}
                    className="flex w-full items-center gap-2 px-4 py-2 text-left hover:bg-surface-hover"
                  >
                    <img src={suggestion.avatar_url} alt={suggestion.login} className="h-6 w-6 rounded-full" />
                    <span className="font-mono text-sm text-bone">{suggestion.login}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </form>

        {compareInput.trim().toLowerCase() === searchedUsername.toLowerCase() &&
          compareInput.trim().length > 0 && (
            <p className="mt-2 font-mono text-xs text-amber">// can not merge a profile with itself</p>
          )}

        {compareUserLoading && <ProfileSkeleton />}

        {mainStats && compareStats && user && compareUser && (
          <>
            <div className="mt-6 grid grid-cols-2 gap-4">
              <motion.div
                initial={{ x: -24, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="rounded-lg border border-amber/30 bg-surface p-4"
              >
                <h4 className="font-mono text-sm font-medium text-amber">+ {user.login}</h4>
                <dl className="mt-2 space-y-1 font-mono text-xs text-bone/80">
                  <div className="flex justify-between">
                    <dt>stars</dt>
                    <dd><AnimatedNumber value={mainStats.totalStars} /></dd>
                  </div>
                  <div className="flex justify-between">
                    <dt>repos</dt>
                    <dd><AnimatedNumber value={mainStats.reposCount} /></dd>
                  </div>
                  <div className="flex justify-between">
                    <dt>followers</dt>
                    <dd><AnimatedNumber value={mainStats.followers} /></dd>
                  </div>
                  <div className="flex justify-between">
                    <dt>top lang</dt>
                    <dd>{mainStats.topLanguage ?? "—"}</dd>
                  </div>
                </dl>
              </motion.div>

              <motion.div
                initial={{ x: 24, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="rounded-lg border border-periwinkle/30 bg-surface p-4"
              >
                <h4 className="font-mono text-sm font-medium text-periwinkle">+ {compareUser.login}</h4>
                <dl className="mt-2 space-y-1 font-mono text-xs text-bone/80">
                  <div className="flex justify-between">
                    <dt>stars</dt>
                    <dd><AnimatedNumber value={compareStats.totalStars} /></dd>
                  </div>
                  <div className="flex justify-between">
                    <dt>repos</dt>
                    <dd><AnimatedNumber value={compareStats.reposCount} /></dd>
                  </div>
                  <div className="flex justify-between">
                    <dt>followers</dt>
                    <dd><AnimatedNumber value={compareStats.followers} /></dd>
                  </div>
                  <div className="flex justify-between">
                    <dt>top lang</dt>
                    <dd>{compareStats.topLanguage ?? "—"}</dd>
                  </div>
                </dl>
              </motion.div>
            </div>

            <div className="mt-6 rounded-lg border border-sage/20 bg-surface p-4">
              <ComparisonChart
                data={comparisonChartData}
                mainUsername={user.login}
                compareUsername={compareUser.login}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}