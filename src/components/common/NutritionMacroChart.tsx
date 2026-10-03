import React, { useState } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
  Legend
} from 'recharts';

interface NutritionMacroChartProps {
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
  dishName: string;
}

// Average daily intake benchmarks (ICMR / RDA standard: 2000 kcal, 60g protein, 65g fat, 250g carbs)
const DAILY_RECOMMENDED = {
  calories: 2000,
  protein: 60,
  fat: 65,
  carbs: 250
};

// Target for a single main meal (~33% of daily recommendation)
const MEAL_BENCHMARK_PCT = 33.3;

export const NutritionMacroChart: React.FC<NutritionMacroChartProps> = ({
  calories,
  protein,
  fat,
  carbs,
  dishName
}) => {
  const [viewMode, setViewMode] = useState<'percent' | 'grams'>('percent');

  // Calculate percentages of daily intake
  const calPct = Math.round((calories / DAILY_RECOMMENDED.calories) * 100);
  const proteinPct = Math.round((protein / DAILY_RECOMMENDED.protein) * 100);
  const fatPct = Math.round((fat / DAILY_RECOMMENDED.fat) * 100);
  const carbsPct = Math.round((carbs / DAILY_RECOMMENDED.carbs) * 100);

  const chartDataPercent = [
    {
      macro: 'Energy (kcal)',
      short: 'Energy',
      mealPct: calPct,
      recommendedMealPct: MEAL_BENCHMARK_PCT,
      actualVal: `${calories} kcal`,
      dailyTarget: `${DAILY_RECOMMENDED.calories} kcal`,
      color: '#63e6ff'
    },
    {
      macro: 'Protein (g)',
      short: 'Protein',
      mealPct: proteinPct,
      recommendedMealPct: MEAL_BENCHMARK_PCT,
      actualVal: `${protein}g`,
      dailyTarget: `${DAILY_RECOMMENDED.protein}g`,
      color: '#75f5a6'
    },
    {
      macro: 'Lipids (g)',
      short: 'Fat',
      mealPct: fatPct,
      recommendedMealPct: MEAL_BENCHMARK_PCT,
      actualVal: `${fat}g`,
      dailyTarget: `${DAILY_RECOMMENDED.fat}g`,
      color: '#ff6b7a'
    },
    {
      macro: 'Carbs (g)',
      short: 'Carbs',
      mealPct: carbsPct,
      recommendedMealPct: MEAL_BENCHMARK_PCT,
      actualVal: `${carbs}g`,
      dailyTarget: `${DAILY_RECOMMENDED.carbs}g`,
      color: '#ffd86b'
    }
  ];

  const chartDataGrams = [
    {
      macro: 'Energy (x10 kcal)',
      short: 'Energy',
      mealVal: Math.round(calories / 10), // scaled for visual harmony
      targetVal: Math.round(DAILY_RECOMMENDED.calories / 30), // ~66.6
      displayMeal: `${calories} kcal`,
      displayTarget: '650 kcal (Meal Target)',
      color: '#63e6ff'
    },
    {
      macro: 'Protein (g)',
      short: 'Protein',
      mealVal: protein,
      targetVal: Math.round(DAILY_RECOMMENDED.protein / 3), // 20g
      displayMeal: `${protein}g`,
      displayTarget: '20g (Meal Target)',
      color: '#75f5a6'
    },
    {
      macro: 'Lipids (g)',
      short: 'Fat',
      mealVal: fat,
      targetVal: Math.round(DAILY_RECOMMENDED.fat / 3), // ~22g
      displayMeal: `${fat}g`,
      displayTarget: '22g (Meal Target)',
      color: '#ff6b7a'
    },
    {
      macro: 'Carbs (g)',
      short: 'Carbs',
      mealVal: carbs,
      targetVal: Math.round(DAILY_RECOMMENDED.carbs / 3), // ~83g
      displayMeal: `${carbs}g`,
      displayTarget: '83g (Meal Target)',
      color: '#ffd86b'
    }
  ];

  // Custom tooltip for styled dark theme
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="p-2.5 rounded-xl bg-[#0b101d] border border-[#63e6ff]/40 shadow-xl text-xs space-y-1 z-50">
          <p className="font-space font-bold text-[#F5F8FF]">{data.macro}</p>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#63e6ff]" />
            <span className="text-[#869396]">This Meal:</span>
            <span className="font-bold text-[#63e6ff] font-space">
              {viewMode === 'percent' ? `${data.mealPct}% of Daily` : data.displayMeal}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#ffd86b]" />
            <span className="text-[#869396]">Avg Meal Goal:</span>
            <span className="font-bold text-[#ffd86b] font-space">
              {viewMode === 'percent' ? `~33% of Daily` : data.displayTarget}
            </span>
          </div>
          <p className="text-[10px] text-[#869396] pt-1 border-t border-white/10">
            Daily RDA Benchmark: {data.dailyTarget || '2000 kcal / 60g Pro'}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="p-4 rounded-2xl bg-[#10182A]/90 border border-white/10 space-y-3.5 shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[#63e6ff]/15 text-[#63e6ff] flex items-center justify-center">
            <span className="material-symbols-outlined text-[17px]">show_chart</span>
          </div>
          <div>
            <h3 className="text-xs font-bold text-[#F5F8FF] font-space tracking-wide">
              MACRO INTAKE VS DAILY GOALS
            </h3>
            <p className="text-[10px] text-[#869396]">
              Visual breakdown compared to standard 2,000 kcal RDA
            </p>
          </div>
        </div>

        {/* View Mode Toggle */}
        <div className="flex bg-[#060914] p-0.5 rounded-lg border border-white/10">
          <button
            onClick={() => setViewMode('percent')}
            className={`px-2 py-1 text-[10px] font-space rounded-md font-bold transition-all ${
              viewMode === 'percent'
                ? 'bg-[#63e6ff] text-black shadow-sm'
                : 'text-[#869396] hover:text-white'
            }`}
          >
            % DAILY
          </button>
          <button
            onClick={() => setViewMode('grams')}
            className={`px-2 py-1 text-[10px] font-space rounded-md font-bold transition-all ${
              viewMode === 'grams'
                ? 'bg-[#63e6ff] text-black shadow-sm'
                : 'text-[#869396] hover:text-white'
            }`}
          >
            METRICS
          </button>
        </div>
      </div>

      {/* Recharts Line Chart Container */}
      <div className="w-full h-44 pt-1 pb-0 -ml-2">
        <ResponsiveContainer width="100%" height="100%">
          {viewMode === 'percent' ? (
            <LineChart
              data={chartDataPercent}
              margin={{ top: 12, right: 16, left: -16, bottom: 4 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#222b40" vertical={false} />
              <XAxis
                dataKey="short"
                stroke="#69778c"
                tick={{ fill: '#869396', fontSize: 10, fontFamily: 'Space Grotesk, sans-serif' }}
                axisLine={{ stroke: '#222b40' }}
                tickLine={false}
              />
              <YAxis
                unit="%"
                stroke="#69778c"
                domain={[0, (dataMax: number) => Math.max(60, Math.ceil(dataMax / 10) * 10 + 10)]}
                tick={{ fill: '#869396', fontSize: 9, fontFamily: 'Space Grotesk, sans-serif' }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                wrapperStyle={{
                  fontSize: '10px',
                  fontFamily: 'Space Grotesk, sans-serif',
                  paddingTop: '6px'
                }}
                iconSize={8}
              />
              {/* Reference Baseline at 33.3% (One Meal Target) */}
              <ReferenceLine
                y={33.3}
                stroke="#ffd86b"
                strokeDasharray="4 4"
                strokeWidth={1.5}
                label={{
                  value: '1-Meal Baseline (33%)',
                  fill: '#ffd86b',
                  fontSize: 9,
                  position: 'insideTopRight'
                }}
              />
              {/* This Dish Line */}
              <Line
                name={`${dishName.slice(0, 14)} (% RDA)`}
                type="monotone"
                dataKey="mealPct"
                stroke="#63e6ff"
                strokeWidth={2.5}
                dot={{ r: 4, fill: '#63e6ff', stroke: '#060914', strokeWidth: 1.5 }}
                activeDot={{ r: 6, fill: '#75f5a6', stroke: '#fff', strokeWidth: 2 }}
              />
              {/* Average Meal Target Line */}
              <Line
                name="Target Meal Avg (33%)"
                type="monotone"
                dataKey="recommendedMealPct"
                stroke="#ffaa40"
                strokeDasharray="3 3"
                strokeWidth={1.5}
                dot={{ r: 3, fill: '#ffaa40' }}
              />
            </LineChart>
          ) : (
            <LineChart
              data={chartDataGrams}
              margin={{ top: 12, right: 16, left: -16, bottom: 4 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#222b40" vertical={false} />
              <XAxis
                dataKey="short"
                stroke="#69778c"
                tick={{ fill: '#869396', fontSize: 10, fontFamily: 'Space Grotesk, sans-serif' }}
                axisLine={{ stroke: '#222b40' }}
                tickLine={false}
              />
              <YAxis
                stroke="#69778c"
                domain={[0, 'auto']}
                tick={{ fill: '#869396', fontSize: 9, fontFamily: 'Space Grotesk, sans-serif' }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                wrapperStyle={{
                  fontSize: '10px',
                  fontFamily: 'Space Grotesk, sans-serif',
                  paddingTop: '6px'
                }}
                iconSize={8}
              />
              <Line
                name="This Meal (Grams / Scaled)"
                type="monotone"
                dataKey="mealVal"
                stroke="#63e6ff"
                strokeWidth={2.5}
                dot={{ r: 4, fill: '#63e6ff', stroke: '#060914', strokeWidth: 1.5 }}
                activeDot={{ r: 6, fill: '#75f5a6', stroke: '#fff', strokeWidth: 2 }}
              />
              <Line
                name="Meal Target Goal"
                type="monotone"
                dataKey="targetVal"
                stroke="#ffd86b"
                strokeDasharray="3 3"
                strokeWidth={1.5}
                dot={{ r: 3, fill: '#ffd86b' }}
              />
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* Quick Insights Cards */}
      <div className="grid grid-cols-2 gap-2 pt-1 border-t border-white/5">
        <div className="p-2 rounded-xl bg-[#060914] border border-white/5 flex items-center justify-between">
          <div>
            <div className="text-[9px] font-space text-[#869396]">PROTEIN QUOTA</div>
            <div className="text-xs font-bold text-[#75f5a6] font-space">
              {proteinPct >= 33 ? `+${proteinPct - 33}% Optimal` : `${proteinPct}% of RDA`}
            </div>
          </div>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#75f5a6]/15 text-[#75f5a6] font-space font-bold">
            {protein >= 25 ? 'HIGH-PRO' : 'BALANCED'}
          </span>
        </div>

        <div className="p-2 rounded-xl bg-[#060914] border border-white/5 flex items-center justify-between">
          <div>
            <div className="text-[9px] font-space text-[#869396]">DAILY CALORIE LOAD</div>
            <div className="text-xs font-bold text-[#ffd86b] font-space">
              {calPct}% of 2,000 kcal
            </div>
          </div>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#ffd86b]/15 text-[#ffd86b] font-space font-bold">
            {calories <= 650 ? 'FIT MEAL' : 'HEARTY'}
          </span>
        </div>
      </div>
    </div>
  );
};
