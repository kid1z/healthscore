"use client";

import { format } from "date-fns";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type ChartData = {
  date: string;
  healthScore: number;
  calories: number;
};

type HealthScoreChartProps = {
  data: ChartData[];
};

export function HealthScoreChart({ data }: HealthScoreChartProps) {
  const formattedData = data.map((item) => ({
    ...item,
    date: format(new Date(item.date), "MMM d"),
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Health Score Trend</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer height="100%" width="100%">
            <LineChart data={formattedData}>
              <defs>
                <linearGradient
                  id="healthScoreGradient"
                  x1="0"
                  x2="0"
                  y1="0"
                  y2="1"
                >
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid className="stroke-muted" strokeDasharray="3 3" />
              <XAxis
                className="text-xs"
                dataKey="date"
                tick={{ fill: "hsl(var(--muted-foreground))" }}
              />
              <YAxis
                className="text-xs"
                domain={[0, 100]}
                tick={{ fill: "hsl(var(--muted-foreground))" }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--background))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
              />
              <Line
                activeDot={{ r: 8, fill: "#8b5cf6" }}
                dataKey="healthScore"
                dot={{ fill: "#8b5cf6", strokeWidth: 2 }}
                stroke="#8b5cf6"
                strokeWidth={3}
                type="monotone"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

type ScoreDistribution = {
  excellent: number;
  good: number;
  moderate: number;
  poor: number;
};

type ScoreDistributionChartProps = {
  data: ScoreDistribution;
};

export function ScoreDistributionChart({ data }: ScoreDistributionChartProps) {
  const chartData = [
    { name: "Excellent (90+)", value: data.excellent, color: "#10b981" },
    { name: "Good (70-89)", value: data.good, color: "#22c55e" },
    { name: "Moderate (50-69)", value: data.moderate, color: "#eab308" },
    { name: "Poor (<50)", value: data.poor, color: "#ef4444" },
  ].filter((item) => item.value > 0);

  if (chartData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Score Distribution</CardTitle>
        </CardHeader>
        <CardContent className="flex h-[300px] items-center justify-center text-muted-foreground">
          No meals analyzed yet
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Score Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer height="100%" width="100%">
            <PieChart>
              <Pie
                cx="50%"
                cy="50%"
                data={chartData}
                dataKey="value"
                innerRadius={60}
                label={({ value }) => `${value}`}
                outerRadius={100}
                paddingAngle={5}
              >
                {chartData.map((entry) => (
                  <Cell fill={entry.color} key={`cell-${entry.name}`} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--background))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

type MacroData = {
  protein: number;
  carbs: number;
  fats: number;
};

type MacroAverageChartProps = {
  data: MacroData;
};

export function MacroAverageChart({ data }: MacroAverageChartProps) {
  const chartData = [
    { name: "Protein", value: data.protein, fill: "#ec4899" },
    { name: "Carbs", value: data.carbs, fill: "#f59e0b" },
    { name: "Fats", value: data.fats, fill: "#3b82f6" },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Average Macros per Meal</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer height="100%" width="100%">
            <BarChart data={chartData} layout="vertical">
              <CartesianGrid className="stroke-muted" strokeDasharray="3 3" />
              <XAxis
                className="text-xs"
                tick={{ fill: "hsl(var(--muted-foreground))" }}
                type="number"
              />
              <YAxis
                className="text-xs"
                dataKey="name"
                tick={{ fill: "hsl(var(--muted-foreground))" }}
                type="category"
                width={60}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--background))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
                formatter={(value: number) => [`${value}g`, ""]}
              />
              <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                {chartData.map((entry) => (
                  <Cell fill={entry.fill} key={`cell-${entry.name}`} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
