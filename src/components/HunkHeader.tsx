export function HunkHeader({ text }: { text: string }) {
  return (
    <div
      className="overflow-hidden whitespace-nowrap border-r-2 border-amber font-mono text-sm text-sage"
      style={{
        width: `${text.length}ch`,
        animation: `typing 1.2s steps(${text.length}, end) 3s both, blink 0.75s step-end infinite`,
      }}
    >
      {text}
    </div>
  );
}