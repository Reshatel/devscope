"use client";

import { useState } from "react";
import { useGitHubUser, useGitHubRepos } from "@/lib/useGitHubUser";
import { useFavoritesStore } from "@/store/useFavoritesStore";
import { formatStars } from "@/lib/formatStars";
import { sortRepos, filterByLanguage, getUniqueLanguages, SortOption } from "@/lib/repoUtils";
import { computeProfileStats } from "@/lib/compareUtils";

export function ProfileSearch() {
  const [inputValue, setInputValue] = useState("");
  const [searchedUsername, setSearchedUsername] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("stars");  
  const [languageFilter, setLanguageFilter] = useState<string | null>(null);
  const [compareInput, setCompareInput] = useState("");
  const [compareUsername, setCompareUsername] = useState("");


  const { data: compareUser, isLoading: compareUserLoading } =
  useGitHubUser(compareUsername);
  const { data: compareRepos } = useGitHubRepos(compareUsername);

  const { data: user, isLoading: userLoading, error: userError } =
    useGitHubUser(searchedUsername);
  const { data: repos, isLoading: reposLoading } =
    useGitHubRepos(searchedUsername);

  const { favorites, addFavorite, removeFavorite, isFavorite } =
  useFavoritesStore();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSearchedUsername(inputValue.trim());
  }

  function handleCompareSubmit(e: React.FormEvent) {
  e.preventDefault();
  setCompareUsername(compareInput.trim());
}

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

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Введи GitHub username (напр. torvalds)"
          className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          Шукати
        </button>
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

  <form onSubmit={handleCompareSubmit} className="mt-3 flex gap-2">
    <input
      type="text"
      value={compareInput}
      onChange={(e) => setCompareInput(e.target.value)}
      placeholder="Введи другий username для порівняння"
      className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
    <button
      type="submit"
      className="rounded-lg bg-gray-800 px-4 py-2 text-white hover:bg-gray-900"
    >
      Порівняти
    </button>
  </form>

  {compareUserLoading && (
    <p className="mt-3 text-gray-500">Завантаження...</p>
  )}

  {mainStats && compareStats && user && compareUser && (
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
  )}
</div>
    </div>
  );
}