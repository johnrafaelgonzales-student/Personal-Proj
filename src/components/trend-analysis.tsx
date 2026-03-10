'use client';

import { useState } from 'react';
import { Bot, Loader2 } from 'lucide-react';

import {
  analyzeVisitorTrends,
  type AnalyzeVisitorTrendsOutput,
} from '@/ai/flows/admin-analyze-visitor-trends';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { mockVisitors } from '@/lib/data';
import { Skeleton } from './ui/skeleton';

export function TrendAnalysis() {
  const [analysis, setAnalysis] = useState<AnalyzeVisitorTrendsOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    setIsLoading(true);
    setError(null);
    setAnalysis(null);
    try {
      const visitorData = mockVisitors.map((v) => ({
        id: v.id,
        timestamp: v.entryTime.toISOString(),
      }));

      const result = await analyzeVisitorTrends({ visitorData });
      setAnalysis(result);
    } catch (e) {
      setError('Failed to analyze trends. Please try again.');
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle>Visitor Trend Analysis</CardTitle>
            <CardDescription>
              Use AI to get insights into visitor patterns.
            </CardDescription>
          </div>
          <Button onClick={handleAnalyze} disabled={isLoading}>
            {isLoading ? (
              <Loader2 className="animate-spin" />
            ) : (
              <Bot />
            )}
            <span>{isLoading ? 'Analyzing...' : 'Analyze Trends'}</span>
          </Button>
        </div>
      </CardHeader>
      {(isLoading || analysis || error) && (
        <CardContent>
            {isLoading && <AnalysisSkeleton />}
            {error && <p className="text-sm text-destructive">{error}</p>}
            {analysis && (
                <div className="space-y-4">
                    <div>
                        <h4 className="font-medium text-sm mb-2">Analysis Summary</h4>
                        <p className="text-sm text-muted-foreground">{analysis.analysisSummary}</p>
                    </div>
                    <div>
                        <h4 className="font-medium text-sm mb-2">Peak Days</h4>
                        <div className="flex flex-wrap gap-2">
                        {analysis.peakDays.map((day) => (
                            <Badge key={day} variant="secondary">{day}</Badge>
                        ))}
                        </div>
                    </div>
                    <div>
                        <h4 className="font-medium text-sm mb-2">Peak Hours</h4>
                        <div className="flex flex-wrap gap-2">
                        {analysis.peakHours.map((hour) => (
                            <Badge key={hour} variant="secondary">{hour}</Badge>
                        ))}
                        </div>
                    </div>
                </div>
            )}
        </CardContent>
      )}
    </Card>
  );
}


function AnalysisSkeleton() {
    return (
        <div className="space-y-4">
            <div>
                <Skeleton className="h-5 w-32 mb-2" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full mt-2" />
                <Skeleton className="h-4 w-3/4 mt-2" />
            </div>
             <div>
                <Skeleton className="h-5 w-24 mb-2" />
                <div className="flex flex-wrap gap-2">
                    <Skeleton className="h-6 w-20 rounded-full" />
                    <Skeleton className="h-6 w-24 rounded-full" />
                </div>
            </div>
            <div>
                <Skeleton className="h-5 w-24 mb-2" />
                <div className="flex flex-wrap gap-2">
                    <Skeleton className="h-6 w-28 rounded-full" />
                    <Skeleton className="h-6 w-32 rounded-full" />
                </div>
            </div>
        </div>
    )
}
