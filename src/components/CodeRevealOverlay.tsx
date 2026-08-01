"use client";

import { useEffect, useRef } from "react";

const CHARS = [
  "+", "-", "*", "/", "\\", "%", "&", "|", "^", "~",
  "&&", "||", "!", "==", "===", "!=", "!==", ">=", "<=",
  "=>", "::", "..", "...", "??", "?.", "++", "--",

  "()", "{}", "[]", "<>", "</>", "<div>", "</div>", "<html>",
  "<body>", "<script>", "/>", "<!-- -->",

  "const", "let", "var", "function", "class", "extends",
  "import", "export", "default", "return", "yield",
  "async", "await", "new", "this", "super",
  "true", "false", "null", "undefined",
  "NaN", "Infinity", "typeof", "instanceof",
  "switch", "case", "break", "continue",
  "try", "catch", "finally", "throw",

  "map()", "filter()", "reduce()", "find()", "forEach()",
  "Promise", "fetch", "JSON", "parse", "stringify",

  "git", "commit", "push", "pull", "clone", "fetch",
  "merge", "rebase", "stash", "checkout", "cherry-pick",
  "HEAD", "origin", "main", "master", "branch",
  "status", "diff", "log", "tag", "reset", "init",

  "npm", "npx", "yarn", "pnpm", "node", "bun",
  "vite", "webpack", "gulp", "eslint", "prettier",

  "React", "Vue", "Angular", "Next.js", "Nuxt",
  "JS", "TS", "HTML", "CSS", "SCSS", "PHP",
  "SQL", "MySQL", "MongoDB", "Redis",

  "GET", "POST", "PUT", "PATCH", "DELETE",
  "200", "201", "301", "400", "401", "403", "404", "500",
  "HTTP", "HTTPS", "REST", "API", "JSON",

  "/home", "/usr", "/etc", "~/", "$", "#", "sudo",
  "chmod", "ls", "cd", "mkdir", "rm", "grep",
  "cat", "touch", "curl", "ssh", "docker",

  "0x", "0xff", "0b1010", "0o777",
  "1a2b3c", "deadbeef", "c0ffee", "1337",
  "101010", "010101",

  "CPU", "GPU", "RAM", "SSD", "TCP", "UDP",
  "IPv4", "IPv6", "DNS", "SSL", "TLS",

  "TODO", "FIXME", "BUG", "WIP", "DEBUG",
  "ERROR", "WARN", "INFO", "SUCCESS",

  "λ", "π", "Σ", "∞", "∑", "∫", "∂", "∆",
  "√", "≈", "≠", "≤", "≥",

  "█", "▓", "▒", "░", "■", "□", "●", "○",
  "◆", "◇", "▲", "▼", "▶", "◀",

  "dev", "prod", "build", "deploy",
  "cache", "cookie", "token", "auth",
  "localhost", "127.0.0.1", "443", "8080", "3000",
];
const CELL_SIZE = 22;
const RADIUS = 140;
const EASE = 0.12;

export function CodeRevealOverlay() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const targetPos = useRef({ x: -1000, y: -1000 });
  const displayPos = useRef({ x: -1000, y: -1000 });
  const gridRef = useRef<Map<string, string>>(new Map());

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    function resize() {
      canvas!.width = window.innerWidth;
      canvas!.height = window.innerHeight;
    }
    resize();
    window.addEventListener("resize", resize);

    function handleMouseMove(e: MouseEvent) {
      targetPos.current = { x: e.clientX, y: e.clientY };
    }
    window.addEventListener("mousemove", handleMouseMove);

    function charAt(col: number, row: number): string {
      const key = `${col},${row}`;
      let char = gridRef.current.get(key);
      if (!char) {
        char = CHARS[Math.floor(Math.random() * CHARS.length)];
        gridRef.current.set(key, char);
      }
      return char;
    }

    let frameId: number;

    function draw() {
      displayPos.current.x += (targetPos.current.x - displayPos.current.x) * EASE;
      displayPos.current.y += (targetPos.current.y - displayPos.current.y) * EASE;

      ctx!.clearRect(0, 0, canvas!.width, canvas!.height);

      const { x: mx, y: my } = displayPos.current;
      const startCol = Math.floor((mx - RADIUS) / CELL_SIZE);
      const endCol = Math.ceil((mx + RADIUS) / CELL_SIZE);
      const startRow = Math.floor((my - RADIUS) / CELL_SIZE);
      const endRow = Math.ceil((my + RADIUS) / CELL_SIZE);

      ctx!.font = "12px var(--font-mono, monospace)";
      ctx!.textBaseline = "middle";

      for (let col = startCol; col <= endCol; col++) {
        for (let row = startRow; row <= endRow; row++) {
          const cx = col * CELL_SIZE;
          const cy = row * CELL_SIZE;
          const dist = Math.hypot(cx - mx, cy - my);
          if (dist > RADIUS) continue;

          const opacity = 1 - dist / RADIUS;
          const isAmber = (col + row) % 2 === 0;

          ctx!.fillStyle = isAmber
            ? `rgba(232, 163, 61, ${opacity * 0.8})`
            : `rgba(91, 127, 219, ${opacity * 0.8})`;
          ctx!.fillText(charAt(col, row), cx, cy);
        }
      }

      frameId = requestAnimationFrame(draw);
    }

    frameId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-0"
      aria-hidden="true"
    />
  );
}