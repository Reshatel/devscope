"use client";

import { useState } from "react";
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

export function ProfileSearch() {
  const [inputValue, setInputValue] = useState("");
  const [searchedUsername, setSearchedUsername] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("stars");  
  const [languageFilter, setLanguageFilter] = useState<string | null>(null);
  const [compareInput, setCompareInput] = useState("");
  const [compareUsername, setCompareUsername] = useState("");
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [isCompareInputFocused, setIsCompareInputFocused] = useState(false);


  const { data: compareUser, isLoading: compareUserLoading } =
  useGitHubUser(compareUsername);
    const { data: compareRepos } = useGitHubRepos(compareUsername);
  const { data: user, isLoading: userLoading, error: userError } =
    useGitHubUser(searchedUsername);
  const { data: repos, isLoading: reposLoading } =
    useGitHubRepos(searchedUsername);
    const { data: suggestions } = useGitHubSearchSuggestions(inputValue);
  const { favorites, addFavorite, removeFavorite, isFavorite } =
  useFavoritesStore();
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

const processedRepos = repos
  ? sortRepos(filterByLanguage(repos, languageFilter), sortBy)
  : [];
const availableLanguages = repos ? getUniqueLanguages(repos) : [];

const mainStats =
  user && repos ? computeProfileStats(user, repos) : null;
const compareStats =
  compareUser && compareRepos
    ? computeProfileStats(compareUser, compareRepos)
    : null;

    const comparisonChartData =
  mainStats && compareStats && user && compareUser
    ? getComparisonData(user.login, mainStats, compareUser.login, compareStats)
    : [];

  return (
    <div className="max-w-2xl mx-auto p-6">

{favorites.length > 0 && (
  <div className="mb-4 flex flex-wrap gap-2">
    {favorites.map((username) => (
      <button
        key={username}
        onClick={() => {
          setInputValue(username);
          setSearchedUsername(username);
        }}
        className="rounded-full border border-gray-300 px-3 py-1 text-sm text-gray-700 hover:bg-gray-100"
      >
        {username}
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
    placeholder="Введи GitHub username (напр. torvalds)"
    className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
  />
  <button
    type="submit"
    className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
  >
    Шукати
  </button>

  {isInputFocused && suggestions && suggestions.length > 0 && (
    <ul className="absolute top-full left-0 z-10 mt-1 w-full max-w-[calc(100%-88px)] rounded-lg border border-gray-200 bg-white shadow-lg">
      {suggestions.map((suggestion) => (
        <li key={suggestion.id}>
          <button
            type="button"
            onClick={() => {
              setInputValue(suggestion.login);
              setSearchedUsername(suggestion.login);
              setIsInputFocused(false);
            }}
            className="flex w-full items-center gap-2 px-4 py-2 text-left hover:bg-gray-50"
          >
            <img
              src={suggestion.avatar_url}
              alt={suggestion.login}
              className="h-6 w-6 rounded-full"
            />
            <span className="text-sm">{suggestion.login}</span>
          </button>
        </li>
      ))}
    </ul>
  )}
</form>

      {userLoading && (
        <p className="mt-4 text-gray-500">Завантаження...</p>
      )}

      {userError && (
        <p className="mt-4 text-red-600">{userError.message}</p>
      )}

      {user && (
        <div className="mt-6 rounded-lg border border-gray-200 p-4">
          <div className="flex items-center gap-4">
            <img
              src={user.avatar_url}
              alt={user.login}
              className="h-16 w-16 rounded-full"
            />
            <div>
              <h2 className="text-lg font-semibold">
                {user.name ?? user.login}
              </h2>
              <p className="text-gray-500">@{user.login}</p>
            </div>
            <button
              onClick={() =>
                isFavorite(user.login)
                  ? removeFavorite(user.login)
                  : addFavorite(user.login)
              }
              className="ml-auto rounded-lg border px-3 py-1 text-sm"
            >
              {isFavorite(user.login) ? "★ В улюблених" : "☆ Додати"}
            </button>
          </div>

          {user.bio && <p className="mt-3 text-gray-700">{user.bio}</p>}

          <div className="mt-3 flex gap-4 text-sm text-gray-600">
            <span>{user.public_repos} репозиторіїв</span>
            <span>{user.followers} підписників</span>
          </div>
        </div>
      )}

      {repos && repos.length > 0 && (
  <div className="mt-6 rounded-lg border border-gray-200 p-4">
    <h3 className="mb-2 text-sm font-semibold text-gray-700">
      Розподіл мов програмування
    </h3>
    <LanguageChart data={languageData} />
  </div>
)}

      {reposLoading && <p className="mt-4 text-gray-500">Завантаження репозиторіїв...</p>}

      {repos && (
  <>
    <div className="mt-6 flex gap-3">
      <select
        value={sortBy}
        onChange={(e) => setSortBy(e.target.value as SortOption)}
        className="rounded-lg border border-gray-300 px-3 py-1 text-sm"
      >
        <option value="stars">За зірками</option>
        <option value="updated">За оновленням</option>
        <option value="name">За назвою</option>
      </select>

      <select
        value={languageFilter ?? ""}
        onChange={(e) => setLanguageFilter(e.target.value || null)}
        className="rounded-lg border border-gray-300 px-3 py-1 text-sm"
      >
        <option value="">Всі мови</option>
        {availableLanguages.map((lang) => (
          <option key={lang} value={lang}>
            {lang}
          </option>
        ))}
      </select>
    </div>

    <ul className="mt-4 space-y-2">
      {processedRepos.slice(0, 10).map((repo) => (
            <li
              key={repo.id}
              className="rounded-lg border border-gray-200 p-3"
            >
              <a
                href={repo.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-blue-600 hover:underline"
              >
                {repo.name}
              </a>
              {repo.description && (
                <p className="text-sm text-gray-600">{repo.description}</p>
              )}
              <div className="mt-1 flex gap-3 text-xs text-gray-500">
                {repo.language && <span>{repo.language}</span>}
                <span>★ {formatStars(repo.stargazers_count)}</span>
              </div>
            </li>
          ))}
        </ul>
        </>
      )}

      <div className="mt-10 border-t pt-6">
  <h3 className="text-lg font-semibold text-gray-900">
    Порівняти з іншим профілем
  </h3>

  <form onSubmit={handleCompareSubmit} className="relative mt-3 flex gap-2">
  <input
    type="text"
    value={compareInput}
    onChange={(e) => setCompareInput(e.target.value)}
    onFocus={() => setIsCompareInputFocused(true)}
    onBlur={() => setTimeout(() => setIsCompareInputFocused(false), 150)}
    placeholder="Введи другий username для порівняння"
    className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
  />
  <button
    type="submit"
    className="rounded-lg bg-gray-800 px-4 py-2 text-white hover:bg-gray-900"
  >
    Порівняти
  </button>

  {isCompareInputFocused &&
    compareSuggestions &&
    compareSuggestions.length > 0 && (
      <ul className="absolute top-full left-0 z-10 mt-1 w-full max-w-[calc(100%-104px)] rounded-lg border border-gray-200 bg-white shadow-lg">
        {compareSuggestions.map((suggestion) => (
          <li key={suggestion.id}>
            <button
              type="button"
              onClick={() => {
                setCompareInput(suggestion.login);
                setCompareUsername(suggestion.login);
                setIsCompareInputFocused(false);
              }}
              className="flex w-full items-center gap-2 px-4 py-2 text-left hover:bg-gray-50"
            >
              <img
                src={suggestion.avatar_url}
                alt={suggestion.login}
                className="h-6 w-6 rounded-full"
              />
              <span className="text-sm">{suggestion.login}</span>
            </button>
          </li>
        ))}
      </ul>
    )}
</form>

{compareInput.trim().toLowerCase() === searchedUsername.toLowerCase() &&
  compareInput.trim().length > 0 && (
    <p className="mt-2 text-sm text-amber-600">
      Введи інший профіль для порівняння — не той самий
    </p>
  )}

  {compareUserLoading && <ProfileSkeleton />}

  {mainStats && compareStats && user && compareUser && (
    <>
    <div className="mt-6 grid grid-cols-2 gap-4">
      <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
        <h4 className="font-semibold text-gray-900">{user.login}</h4>
        <dl className="mt-2 space-y-1 text-sm text-gray-700">
          <div className="flex justify-between">
            <dt>Зірок:</dt>
            <dd className="font-medium">{mainStats.totalStars}</dd>
          </div>
          <div className="flex justify-between">
            <dt>Репозиторіїв:</dt>
            <dd className="font-medium">{mainStats.reposCount}</dd>
          </div>
          <div className="flex justify-between">
            <dt>Підписників:</dt>
            <dd className="font-medium">{mainStats.followers}</dd>
          </div>
          <div className="flex justify-between">
            <dt>Топ мова:</dt>
            <dd className="font-medium">{mainStats.topLanguage ?? "—"}</dd>
          </div>
        </dl>
      </div>

      <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
        <h4 className="font-semibold text-gray-900">{compareUser.login}</h4>
        <dl className="mt-2 space-y-1 text-sm text-gray-700">
          <div className="flex justify-between">
            <dt>Зірок:</dt>
            <dd className="font-medium">{compareStats.totalStars}</dd>
          </div>
          <div className="flex justify-between">
            <dt>Репозиторіїв:</dt>
            <dd className="font-medium">{compareStats.reposCount}</dd>
          </div>
          <div className="flex justify-between">
            <dt>Підписників:</dt>
            <dd className="font-medium">{compareStats.followers}</dd>
          </div>
          <div className="flex justify-between">
            <dt>Топ мова:</dt>
            <dd className="font-medium">{compareStats.topLanguage ?? "—"}</dd>
          </div>
        </dl>
     </div>
    </div>

    <div className="mt-6">
      <h4 className="mb-2 text-sm font-semibold text-gray-700">
        Порівняння метрик
      </h4>
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