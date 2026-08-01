import { useEffect } from "react";

export function useHotkey(
  key: string,
  callback: () => void,
  options?: { meta?: boolean }
) {
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      const metaOk = options?.meta ? e.metaKey || e.ctrlKey : true;
      if (e.key.toLowerCase() === key.toLowerCase() && metaOk) {
        e.preventDefault();
        callback();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [key, callback, options?.meta]);
}