'use client';

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis,
  PieChart,
  Pie,
  Cell,
  Legend,
  LineChart,
  Line,
} from 'recharts';
import {
  CalendarDays,
  Download,
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

// Daily Data (by hour from 8 AM to 5 PM)
const dailyData = Array.from({ length: 10 }, (_, i) => {
    const hour = i + 8;
    return {
        name: `${hour % 12 === 0 ? 12 : hour % 12}${hour < 12 ? 'AM' : 'PM'}`,
        visitors: mockVisitors.filter(v => {
            const entryDate = new Date(v.entryTime);
            return entryDate.getDate() === today.getDate() &&
                   entryDate.getMonth() === today.getMonth() &&
                   entryDate.getFullYear() === today.getFullYear() &&
                   entryDate.getHours() === hour;
        }).length
    };
});

// Weekly Data (by day)
const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const startOfWeek = new Date(today);
startOfWeek.setDate(today.getDate() - today.getDay());
const endOfWeek = new Date(startOfWeek);
endOfWeek.setDate(startOfWeek.getDate() + 6);

const weeklyData = weekDays.map((day, index) => {
    return {
        name: day,
        visitors: mockVisitors.filter(v => {
            const entryDate = new Date(v.entryTime);
            const entryDay = new Date(entryDate.getFullYear(), entryDate.getMonth(), entryDate.getDate());
            const startDay = new Date(startOfWeek.getFullYear(), startOfWeek.getMonth(), startOfWeek.getDate());
            const endDay = new Date(endOfWeek.getFullYear(), endOfWeek.getMonth(), endOfWeek.getDate());
            return entryDay >= startDay && entryDay <= endDay && entryDate.getDay() === index;
        }).length
    };
}).filter(d => d.visitors > 0);

const PIE_COLORS = ['#0ea5e9', '#84cc16', '#f97316', '#eab308', '#d946ef', '#14b8a6', '#f43f5e'];

// Monthly Data (by day of month)
const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();

const monthlyData = Array.from({ length: daysInMonth }, (_, i) => {
    const day = i + 1;
    return {
        name: `${day}`,
        visitors: mockVisitors.filter(v => {
            const entryDate = new Date(v.entryTime);
            return entryDate.getMonth() === today.getMonth() &&
                   entryDate.getFullYear() === today.getFullYear() &&
                   entryDate.getDate() === day;
        }).length
    };
});


const trafficChartData = Array.from({ length: 7 }, (_, i) => {
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
    color: 'hsl(var(--primary))',
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
            <CardHeader>
                <CardTitle className="text-base font-medium">
                Today's Visitors (by Hour)
                </CardTitle>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig} className="h-48 w-full">
                    <ResponsiveContainer>
                        <BarChart data={dailyData} margin={{ top: 0, right: 0, left: -20, bottom: -10 }}>
                            <CartesianGrid vertical={false} />
                            <XAxis dataKey="name" tickLine={false} tickMargin={10} axisLine={false} fontSize={10} />
                            <YAxis tickLine={false} axisLine={false} tickMargin={10} allowDecimals={false} fontSize={12} />
                            <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
                            <Bar dataKey="visitors" fill="var(--color-visitors)" radius={4} />
                        </BarChart>
                    </ResponsiveContainer>
                </ChartContainer>
            </CardContent>
        </Card>
        <Card>
            <CardHeader>
                <CardTitle className="text-base font-medium">
                This Week's Visitors (by Day)
                </CardTitle>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig} className="h-48 w-full">
                    <ResponsiveContainer>
                        <PieChart>
                            <Pie data={weeklyData} dataKey="visitors" nameKey="name" cx="50%" cy="50%" innerRadius={30} outerRadius={50} paddingAngle={2}>
                                {weeklyData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                                ))}
                            </Pie>
                            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                            <Legend layout="vertical" align="right" verticalAlign="middle" iconSize={10} wrapperStyle={{fontSize: '12px', paddingLeft: '10px'}}/>
                        </PieChart>
                    </ResponsiveContainer>
                </ChartContainer>
            </CardContent>
        </Card>
        <Card>
            <CardHeader>
                <CardTitle className="text-base font-medium">
                This Month's Visitors (by Day)
                </CardTitle>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig} className="h-48 w-full">
                    <ResponsiveContainer>
                        <LineChart data={monthlyData} margin={{ top: 5, right: 10, left: -20, bottom: -10 }}>
                             <CartesianGrid vertical={false} />
                            <XAxis dataKey="name" tickLine={false} axisLine={false} tickMargin={10} fontSize={10} interval={6} />
                            <YAxis tickLine={false} axisLine={false} tickMargin={10} allowDecimals={false} fontSize={12}/>
                            <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
                            <Line type="monotone" dataKey="visitors" stroke="var(--color-visitors)" strokeWidth={2} dot={false} />
                        </LineChart>
                    </ResponsiveContainer>
                </ChartContainer>
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
              <BarChart data={trafficChartData}>
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
