interface ChartTooltipProps {
  active?: boolean;
  payload?: { name: string; value: number; color: string }[];
  label?: string;
}

export function ChartTooltip({ active, payload, label }: ChartTooltipProps) {
  if (!active || !payload || payload.length === 0) return null;

  return (
    <div className="rounded-lg border border-sage/30 bg-ink px-3 py-2 font-mono text-xs shadow-lg">
      {label && <p className="mb-1 text-sage">{label}</p>}
      {payload.map((entry, index) => (
        <div key={index} className="flex items-center gap-2">
          <span
            className="h-2 w-2 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-bone">{entry.name}:</span>
          <span className="font-medium text-bone">{entry.value}</span>
        </div>
      ))}
    </div>
  );
}