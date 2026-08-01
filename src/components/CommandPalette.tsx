"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useHotkey } from "@/lib/useHotkey";

interface CommandPaletteProps {
  favorites: string[];
  onSearch: (username: string) => void;
}

export function CommandPalette({ favorites, onSearch }: CommandPaletteProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useHotkey("k", () => setIsOpen((prev) => !prev), { meta: true });

  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setActiveIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  const filteredFavorites = favorites.filter((f) =>
    f.toLowerCase().includes(query.toLowerCase())
  );

  const items =
    query.trim().length > 0
      ? [`search: ${query.trim()}`, ...filteredFavorites]
      : favorites;

  function runItem(item: string) {
    const username = item.startsWith("search: ") ? item.replace("search: ", "") : item;
    onSearch(username);
    setIsOpen(false);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Escape") {
      setIsOpen(false);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) => Math.min(prev + 1, items.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) => Math.max(prev - 1, 0));
    } else if (e.key === "Enter" && items[activeIndex]) {
      runItem(items[activeIndex]);
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-50 flex items-start justify-center bg-ink/70 pt-32 backdrop-blur-sm"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -8 }}
            transition={{ duration: 0.15 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg rounded-lg border border-sage/20 bg-surface shadow-lg"
          >
            <div className="flex items-center gap-2 border-b border-sage/20 px-4 py-3">
              <span className="font-mono text-sm text-amber">$</span>
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setActiveIndex(0);
                }}
                onKeyDown={handleKeyDown}
                placeholder="search username or jump to favorite..."
                className="flex-1 bg-transparent font-mono text-sm text-bone placeholder:text-sage/50 focus:outline-none"
              />
              <span className="rounded border border-sage/30 px-1.5 py-0.5 font-mono text-[10px] text-sage">
                esc
              </span>
            </div>

            <div className="max-h-72 overflow-y-auto py-2">
              {items.length === 0 && (
                <p className="px-4 py-3 font-mono text-xs text-sage">
                  // type a username and press enter
                </p>
              )}
              {items.map((item, index) => (
                <button
                  key={item}
                  onClick={() => runItem(item)}
                  onMouseEnter={() => setActiveIndex(index)}
                  className={`flex w-full items-center gap-2 px-4 py-2 text-left font-mono text-sm ${
                    index === activeIndex ? "bg-surface-hover text-amber" : "text-bone"
                  }`}
                >
                  <span className="text-sage">
                    {item.startsWith("search: ") ? ">" : "+"}
                  </span>
                  {item}
                </button>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}