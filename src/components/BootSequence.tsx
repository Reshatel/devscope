"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";

const LINES = [
  "$ git clone devscope.git",
  "$ cd devscope && npm install",
  "$ analyzing github network...",
  "Ready.",
];

export function BootSequence({ onDone }: { onDone: () => void }) {
  const [visibleLines, setVisibleLines] = useState<string[]>([]);
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion) {
      setIsDone(true);
      onDone();
      return;
    }

    let lineIndex = 0;
    const interval = setInterval(() => {
      lineIndex += 1;
      setVisibleLines(LINES.slice(0, lineIndex));

      if (lineIndex >= LINES.length) {
        clearInterval(interval);
        setTimeout(() => {
          setIsDone(true);
          setTimeout(onDone, 400);
        }, 400);
      }
    }, 350);

    return () => clearInterval(interval);
  }, [onDone]);

  return (
    <AnimatePresence>
      {!isDone && (
        <motion.div
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          onClick={() => {
            setIsDone(true);
            onDone();
          }}
          className="fixed inset-0 z-50 flex cursor-pointer items-center justify-center bg-ink"
        >
          <div className="font-mono text-sm text-sage">
            {visibleLines.map((line, index) => (
              <p key={index} className={index === LINES.length - 1 ? "mt-2 text-amber" : ""}>
                {line}
              </p>
            ))}
            <span className="inline-block h-4 w-2 animate-pulse bg-sage align-middle" />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}