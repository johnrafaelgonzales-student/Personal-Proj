/**
 * @fileoverview This component provides a UI for the AI-powered visitor trend analysis.
 * It includes a button to trigger the analysis, handles loading and error states,
 * and displays the results received from the Genkit AI flow.
 */
'use client';

import { useState } from 'react';
import { Bot, Loader2 } from 'lucide-react';

import {
  analyzeVisitorTrends,
  type AnalyzeVisitorTrendsOutput,
} from '@/ai/flows/admin-analyze-visitor-trends';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from './ui/skeleton';
import type { Visitor } from '@/lib/types';

/**
 * The main component for the trend analysis feature.
 * @param {object} props - Component props.
 * @param {Visitor[]} props.visitors - The list of visitor entries to analyze.
 */
export function TrendAnalysis({ visitors }: { visitors: Visitor[] }) {
  // State to store the analysis results from the AI.
  const [analysis, setAnalysis] =
    useState<AnalyzeVisitorTrendsOutput | null>(null);
  // State to manage the loading indicator while the AI is processing.
  const [isLoading, setIsLoading] = useState(false);
  // State to store any potential errors during the analysis.
  const [error, setError] = useState<string | null>(null);

  /**
   * Handles the click event of the "Analyze Trends" button.
   * It prepares the data, calls the AI flow, and updates the state with the result.
   */
  const handleAnalyze = async () => {
    setIsLoading(true);
    setError(null);
    setAnalysis(null);

    if (!visitors || visitors.length === 0) {
      setError('No visitor data available to analyze.');
      setIsLoading(false);
      return;
    }

    try {
      // Prepares the visitor data into the format expected by the AI flow.
      const visitorData = visitors.map((v) => ({
        id: v.id,
        timestamp: v.entryTime.toISOString(),
      }));

      // Calls the Genkit flow to analyze the data.
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
          <Button
            onClick={handleAnalyze}
            disabled={isLoading || visitors.length === 0}
          >
            {isLoading ? <Loader2 className="animate-spin" /> : <Bot />}
            <span>{isLoading ? 'Analyzing...' : 'Analyze Trends'}</span>
          </Button>
        </div>
      </CardHeader>
      {/* Conditionally renders content based on the loading/result state. */}
      {(isLoading || analysis || error) && (
        <CardContent>
          {isLoading && <AnalysisSkeleton />}
          {error && <p className="text-sm text-destructive">{error}</p>}
          {analysis && (
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-sm mb-2">Analysis Summary</h4>
                <p className="text-sm text-muted-foreground">
                  {analysis.analysisSummary}
                </p>
              </div>
              <div>
                <h4 className="font-medium text-sm mb-2">Peak Days</h4>
                <div className="flex flex-wrap gap-2">
                  {analysis.peakDays.map((day) => (
                    <Badge key={day} variant="secondary">
                      {day}
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="font-medium text-sm mb-2">Peak Hours</h4>
                <div className="flex flex-wrap gap-2">
                  {analysis.peakHours.map((hour) => (
                    <Badge key={hour} variant="secondary">
                      {hour}
                    </Badge>
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

/**
 * A skeleton component to show a loading state while the analysis is in progress.
 */
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
  );
}
