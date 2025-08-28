"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

interface PerformanceChartProps<T extends { month: string }> {
  data: T[];
  title: string;
  description: string;
  dataKey: keyof T;
  label: string;
}

export function PerformanceChart<T extends { month: string }>({ data, title, description, dataKey, label }: PerformanceChartProps<T>) {
  
  const chartConfig = {
    [dataKey]: {
      label,
      color: "hsl(var(--primary))",
    },
  } as ChartConfig;
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
          <BarChart accessibilityLayer data={data}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
             <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={10}
             />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dashed" />}
            />
            <Bar dataKey={dataKey as string} fill={`var(--color-${dataKey as string})`} radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
