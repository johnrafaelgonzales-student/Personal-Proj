'use client';

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from 'recharts';
import {
  CalendarDays,
  Clock,
  Download,
  Users,
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartTooltip,
  ChartTooltipContent,
  ChartContainer,
} from '@/components/ui/chart';
import { mockVisitors } from '@/lib/data';
import { TrendAnalysis } from './trend-analysis';
import { Button } from './ui/button';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Calendar } from './ui/calendar';
import React from 'react';
import { DateRange } from 'react-day-picker';
import { addDays, format } from 'date-fns';

const now = new Date();
const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
const startOfWeek = new Date(today);
startOfWeek.setDate(today.getDate() - today.getDay());
const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

const todayVisitors = mockVisitors.filter(
  (v) => v.entryTime.toDateString() === today.toDateString()
).length;
const weeklyVisitors = mockVisitors.filter(
  (v) => v.entryTime >= startOfWeek
).length;
const monthlyVisitors = mockVisitors.filter(
  (v) => v.entryTime >= startOfMonth
).length;

const chartData = Array.from({ length: 7 }, (_, i) => {
  const date = new Date();
  date.setDate(now.getDate() - (6 - i));
  return {
    date: date.toLocaleDateString('en-US', { weekday: 'short' }),
    visitors: mockVisitors.filter(
      (v) => v.entryTime.toDateString() === date.toDateString()
    ).length,
  };
});

const chartConfig = {
  visitors: {
    label: 'Visitors',
    color: 'hsl(var(--accent))',
  },
};

export function AdminDashboard() {
    const [date, setDate] = React.useState<DateRange | undefined>({
        from: addDays(new Date(), -6),
        to: new Date(),
    });

  return (
    <div className="grid gap-4 md:gap-6">
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Today's Visitors
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todayVisitors}</div>
            <p className="text-xs text-muted-foreground">
              Total visitors for today
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              This Week's Visitors
            </CardTitle>
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{weeklyVisitors}</div>
            <p className="text-xs text-muted-foreground">
              Since Sunday
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              This Month's Visitors
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{monthlyVisitors}</div>
            <p className="text-xs text-muted-foreground">
              Since the start of the month
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <CardTitle>Visitor Traffic</CardTitle>
              <CardDescription>
                Overview of visitor entries for the selected period.
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="date"
                    variant={'outline'}
                    className="w-[300px] justify-start text-left font-normal"
                  >
                    <CalendarDays className="mr-2 h-4 w-4" />
                    {date?.from ? (
                      date.to ? (
                        <>
                          {format(date.from, 'LLL dd, y')} -{' '}
                          {format(date.to, 'LLL dd, y')}
                        </>
                      ) : (
                        format(date.from, 'LLL dd, y')
                      )
                    ) : (
                      <span>Pick a date range</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="end">
                  <Calendar
                    initialFocus
                    mode="range"
                    defaultMonth={date?.from}
                    selected={date}
                    onSelect={setDate}
                    numberOfMonths={2}
                  />
                </PopoverContent>
              </Popover>
              <Button variant="outline" size="icon">
                <Download className="h-4 w-4" />
                <span className="sr-only">Download Report</span>
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-64 w-full">
            <ResponsiveContainer>
              <BarChart data={chartData}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  tickFormatter={(value) => value}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickMargin={10}
                  allowDecimals={false}
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent indicator="dot" />}
                />
                <Bar dataKey="visitors" fill="var(--color-visitors)" radius={4} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      <TrendAnalysis />
    </div>
  );
}
