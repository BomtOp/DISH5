import React from 'react';

interface NutritionSummaryBadgeProps {
  calories: number;
  protein: number;
  carbs?: number;
  fat?: number;
  variant?: 'compact' | 'detailed' | 'mini';
  className?: string;
  animate?: boolean;
}

export const NutritionSummaryBadge: React.FC<NutritionSummaryBadgeProps> = ({
  calories,
  protein,
  carbs = 0,
  fat = 0,
  variant = 'compact',
  className = '',
  animate = true
}) => {
  // Estimate carbs & fat if not provided
  const validCarbs = carbs || Math.max(0, Math.round((calories - protein * 4 - (fat || 15) * 9) / 4));
  const validFat = fat || Math.max(0, Math.round((calories - protein * 4 - validCarbs * 4) / 9));

  // Compute energy distribution percentages
  const proteinCals = protein * 4;
  const carbsCals = validCarbs * 4;
  const fatCals = validFat * 9;
  const totalCals = Math.max(1, proteinCals + carbsCals + fatCals);

  const proteinPct = Math.round((proteinCals / totalCals) * 100);
  const carbsPct = Math.round((carbsCals / totalCals) * 100);
  const fatPct = Math.max(0, 100 - proteinPct - carbsPct);

  const isHighProtein = protein >= 30;
  const pulseClass = animate ? 'animate-telemetry-pulse' : '';

  if (variant === 'mini') {
    return (
      <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-[#0D1424] border border-white/10 text-[10px] font-space tabular-nums ${pulseClass} ${className}`}>
        <span className="w-1.5 h-1.5 rounded-full bg-[#75f5a6] animate-live-beacon" />
        <span className="text-[#ffd86b] font-bold">{calories} kcal</span>
        <span className="text-white/30">•</span>
        <span className="text-[#75f5a6] font-bold">{protein}g P</span>
      </div>
    );
  }

  if (variant === 'detailed') {
    return (
      <div className={`rounded-xl bg-[#090D18]/90 border border-white/10 p-2.5 space-y-2 font-space ${pulseClass} ${className}`}>
        {/* Top Header Row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#75f5a6] animate-live-beacon shadow-[0_0_6px_#75f5a6]" />
            <span className="text-[11px] font-bold text-[#F5F8FF] uppercase tracking-wider">
              NUTRITIONAL SYNTHESIS
            </span>
          </div>
          {isHighProtein && (
            <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-[#75f5a6]/20 text-[#75f5a6] border border-[#75f5a6]/40 uppercase tracking-tight flex items-center gap-1">
              <span>🔥</span>
              <span>30G+ BIO-PROTEIN</span>
            </span>
          )}
        </div>

        {/* Macro Distribution Multi-Color Bar */}
        <div className="space-y-1">
          <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden flex">
            <div
              style={{ width: `${proteinPct}%` }}
              className="h-full bg-[#75f5a6] transition-all"
              title={`Protein: ${proteinPct}%`}
            />
            <div
              style={{ width: `${carbsPct}%` }}
              className="h-full bg-[#ffd86b] transition-all"
              title={`Carbs: ${carbsPct}%`}
            />
            <div
              style={{ width: `${fatPct}%` }}
              className="h-full bg-[#ff6b7a] transition-all"
              title={`Fat: ${fatPct}%`}
            />
          </div>
          <div className="flex items-center justify-between text-[9px] text-[#869396] font-medium">
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#75f5a6]" />
              <strong className="text-[#F5F8FF]">{protein}g</strong> Protein ({proteinPct}%)
            </span>
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#ffd86b]" />
              <strong className="text-[#F5F8FF]">{validCarbs}g</strong> Carbs ({carbsPct}%)
            </span>
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#ff6b7a]" />
              <strong className="text-[#F5F8FF]">{validFat}g</strong> Fat ({fatPct}%)
            </span>
          </div>
        </div>
      </div>
    );
  }

  // Compact Variant (Default for list and grid cards)
  return (
    <div className={`flex flex-col gap-1 py-1.5 px-2 rounded-lg bg-[#0A0F1D]/90 border border-white/10 hover:border-[#63e6ff]/30 font-space text-[10px] tabular-nums transition-all shadow-sm ${pulseClass} ${className}`}>
      {/* Metrics Row */}
      <div className="flex items-center justify-between gap-1.5">
        <div className="flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-[#75f5a6] animate-live-beacon shadow-[0_0_4px_#75f5a6]" />
          <span className="text-[#ffd86b] font-bold flex items-center gap-0.5">
            <span>⚡</span>
            <span>{calories}</span>
            <span className="text-[8px] font-normal text-[#869396]">kcal</span>
          </span>
        </div>

        <span className="text-[#75f5a6] font-bold flex items-center gap-0.5">
          <span>💪</span>
          <span>{protein}g</span>
          <span className="text-[8px] font-normal text-[#869396]">P</span>
        </span>

        <span className="text-[#63e6ff] font-medium flex items-center gap-0.5">
          <span>🌾</span>
          <span>{validCarbs}g</span>
          <span className="text-[8px] font-normal text-[#869396]">C</span>
        </span>

        <span className="text-[#ff6b7a] font-medium flex items-center gap-0.5">
          <span>🥑</span>
          <span>{validFat}g</span>
          <span className="text-[8px] font-normal text-[#869396]">F</span>
        </span>
      </div>

      {/* Mini Macro Breakdown Progress Bar */}
      <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden flex">
        <div
          style={{ width: `${proteinPct}%` }}
          className="h-full bg-[#75f5a6] transition-all"
          title={`Protein: ${proteinPct}%`}
        />
        <div
          style={{ width: `${carbsPct}%` }}
          className="h-full bg-[#ffd86b] transition-all"
          title={`Carbs: ${carbsPct}%`}
        />
        <div
          style={{ width: `${fatPct}%` }}
          className="h-full bg-[#ff6b7a] transition-all"
          title={`Fat: ${fatPct}%`}
        />
      </div>
    </div>
  );
};
