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
import { CalendarDays, Download } from 'lucide-react';
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
import { getVisitorsFromStore } from '@/lib/data';
import type { Visitor } from '@/lib/types';
import { TrendAnalysis } from './trend-analysis';
import { Button } from './ui/button';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Calendar } from './ui/calendar';
import React from 'react';
import { DateRange } from 'react-day-picker';
import { addDays, format } from 'date-fns';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import html2canvas from 'html2canvas';

const PIE_COLORS = [
  '#0ea5e9',
  '#84cc16',
  '#f97316',
  '#eab308',
  '#d946ef',
  '#14b8a6',
  '#f43f5e',
];

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
  const [allVisitors, setAllVisitors] = React.useState<Visitor[]>([]);

  React.useEffect(() => {
    const loadData = () => setAllVisitors(getVisitorsFromStore());
    loadData();
    window.addEventListener('focus', loadData);
    return () => window.removeEventListener('focus', loadData);
  }, []);

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const dailyData = React.useMemo(
    () =>
      Array.from({ length: 10 }, (_, i) => {
        const hour = i + 8;
        return {
          name: `${hour % 12 === 0 ? 12 : hour % 12}${
            hour < 12 ? 'AM' : 'PM'
          }`,
          visitors: allVisitors.filter((v) => {
            const entryDate = new Date(v.entryTime);
            return (
              entryDate.getDate() === today.getDate() &&
              entryDate.getMonth() === today.getMonth() &&
              entryDate.getFullYear() === today.getFullYear() &&
              entryDate.getHours() === hour
            );
          }).length,
        };
      }),
    [allVisitors, today]
  );

  const weeklyData = React.useMemo(() => {
    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);

    return weekDays
      .map((day, index) => {
        return {
          name: day,
          visitors: allVisitors.filter((v) => {
            const entryDate = new Date(v.entryTime);
            const entryDay = new Date(
              entryDate.getFullYear(),
              entryDate.getMonth(),
              entryDate.getDate()
            );
            const startDay = new Date(
              startOfWeek.getFullYear(),
              startOfWeek.getMonth(),
              startOfWeek.getDate()
            );
            const endDay = new Date(
              endOfWeek.getFullYear(),
              endOfWeek.getMonth(),
              endOfWeek.getDate()
            );
            return (
              entryDay >= startDay &&
              entryDay <= endDay &&
              entryDate.getDay() === index
            );
          }).length,
        };
      })
      .filter((d) => d.visitors > 0);
  }, [allVisitors, today]);

  const monthlyData = React.useMemo(() => {
    const daysInMonth = new Date(
      today.getFullYear(),
      today.getMonth() + 1,
      0
    ).getDate();
    return Array.from({ length: daysInMonth }, (_, i) => {
      const day = i + 1;
      return {
        name: `${day}`,
        visitors: allVisitors.filter((v) => {
          const entryDate = new Date(v.entryTime);
          return (
            entryDate.getMonth() === today.getMonth() &&
            entryDate.getFullYear() === today.getFullYear() &&
            entryDate.getDate() === day
          );
        }).length,
      };
    });
  }, [allVisitors, today]);

  const trafficChartData = React.useMemo(() => {
    if (!date?.from) return [];
    const data = [];
    const currentDate = new Date(date.from);
    const endDate = date.to ? new Date(date.to) : new Date(date.from);

    while (currentDate <= endDate) {
      const dateStr = currentDate.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      });
      const visitorCount = allVisitors.filter(
        (v) => new Date(v.entryTime).toDateString() === currentDate.toDateString()
      ).length;
      data.push({ date: dateStr, visitors: visitorCount });
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return data;
  }, [allVisitors, date]);

  const handleDownload = async (
    reportType: 'daily' | 'weekly' | 'monthly' | 'full'
  ) => {
    const doc = new jsPDF();
    doc.text(
      `Visitor Report - ${
        reportType.charAt(0).toUpperCase() + reportType.slice(1)
      }`,
      14,
      16
    );

    const addChartToPdf = async (doc: jsPDF, elementId: string, title: string, y: number) => {
        const element = document.getElementById(elementId);
        if (!element) return y;
    
        const canvas = await html2canvas(element, {
            scale: 2,
            useCORS: true,
            backgroundColor: 'white'
        });
        const imgData = canvas.toDataURL('image/png');
        const pdfWidth = doc.internal.pageSize.getWidth();
        const imgHeight = (canvas.height * (pdfWidth - 28)) / canvas.width;
        
        let newY = y;
        if (y + imgHeight > doc.internal.pageSize.getHeight() - 20) {
            doc.addPage();
            newY = 15;
        }
        
        doc.text(title, 14, newY);
        doc.addImage(imgData, 'PNG', 14, newY + 5, pdfWidth - 28, imgHeight);
        
        return newY + imgHeight + 15;
      };
      
      let yPos = 30;
      doc.text('Charts', 14, yPos);
      yPos += 10;
  
      yPos = await addChartToPdf(doc, 'daily-chart-card', "Today's Visitors", yPos);
      yPos = await addChartToPdf(doc, 'weekly-chart-card', "This Week's Visitors", yPos);
      yPos = await addChartToPdf(doc, 'monthly-chart-card', "This Month's Visitors", yPos);
      yPos = await addChartToPdf(doc, 'traffic-chart-card', 'Visitor Traffic', yPos);
      
      doc.addPage();

    let dataToExport: Visitor[] = [];
    const now = new Date();

    switch (reportType) {
      case 'daily':
        dataToExport = allVisitors.filter((v) => {
          const entryDate = new Date(v.entryTime);
          return entryDate.toDateString() === now.toDateString();
        });
        break;
      case 'weekly':
        const startOfWeek = new Date(now);
        startOfWeek.setHours(0, 0, 0, 0);
        startOfWeek.setDate(now.getDate() - now.getDay());
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        endOfWeek.setHours(23, 59, 59, 999);
        dataToExport = allVisitors.filter((v) => {
          const entryDate = new Date(v.entryTime);
          return entryDate >= startOfWeek && entryDate <= endOfWeek;
        });
        break;
      case 'monthly':
        dataToExport = allVisitors.filter((v) => {
          const entryDate = new Date(v.entryTime);
          return (
            entryDate.getMonth() === now.getMonth() &&
            entryDate.getFullYear() === now.getFullYear()
          );
        });
        break;
      case 'full':
        dataToExport = allVisitors;
        break;
    }

    (doc as any).autoTable({
      head: [['Name', 'Purpose', 'College/Office', 'Entry Time', 'Entry Type']],
      body: dataToExport.map((v) => [
        v.name,
        v.purpose,
        v.college,
        v.entryTime.toLocaleString(),
        v.entryType,
      ]),
      startY: 20,
    });

    doc.save(
      `libflow-report-${reportType}-${new Date().toISOString().split('T')[0]}.pdf`
    );
  };

  return (
    <div className="grid gap-4 md:gap-6">
      <div className="grid gap-4 md:grid-cols-3">
        <Card id="daily-chart-card">
          <CardHeader>
            <CardTitle className="text-base font-medium">
              Today's Visitors (by Hour)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-48 w-full">
              <ResponsiveContainer>
                <BarChart
                  data={dailyData}
                  margin={{ top: 0, right: 0, left: -20, bottom: -10 }}
                >
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="name"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                    fontSize={10}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tickMargin={10}
                    allowDecimals={false}
                    fontSize={12}
                  />
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent indicator="dot" />}
                  />
                  <Bar
                    dataKey="visitors"
                    fill="var(--color-visitors)"
                    radius={4}
                  />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
        <Card id="weekly-chart-card">
          <CardHeader>
            <CardTitle className="text-base font-medium">
              This Week's Visitors (by Day)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-48 w-full">
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={weeklyData}
                    dataKey="visitors"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={30}
                    outerRadius={50}
                    paddingAngle={2}
                  >
                    {weeklyData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={PIE_COLORS[index % PIE_COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent hideLabel />}
                  />
                  <Legend
                    layout="vertical"
                    align="right"
                    verticalAlign="middle"
                    iconSize={10}
                    wrapperStyle={{
                      fontSize: '12px',
                      paddingLeft: '10px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
        <Card id="monthly-chart-card">
          <CardHeader>
            <CardTitle className="text-base font-medium">
              This Month's Visitors (by Day)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-48 w-full">
              <ResponsiveContainer>
                <LineChart
                  data={monthlyData}
                  margin={{ top: 5, right: 10, left: -20, bottom: -10 }}
                >
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="name"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={10}
                    fontSize={10}
                    interval={6}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tickMargin={10}
                    allowDecimals={false}
                    fontSize={12}
                  />
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent indicator="dot" />}
                  />
                  <Line
                    type="monotone"
                    dataKey="visitors"
                    stroke="var(--color-visitors)"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
      <Card id="traffic-chart-card">
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
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Download className="h-4 w-4" />
                    <span className="sr-only">Download Report</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => handleDownload('daily')}>
                    Daily Report
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleDownload('weekly')}>
                    Weekly Report
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleDownload('monthly')}>
                    Monthly Report
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleDownload('full')}>
                    Full Report
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
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
                <Bar
                  dataKey="visitors"
                  fill="var(--color-visitors)"
                  radius={4}
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      <TrendAnalysis />
    </div>
  );
}
