'use server';
/**
 * @fileOverview An AI agent for analyzing historical visitor data to identify trends.
 *
 * - analyzeVisitorTrends - A function that handles the visitor trend analysis process.
 * - AnalyzeVisitorTrendsInput - The input type for the analyzeVisitorTrends function.
 * - AnalyzeVisitorTrendsOutput - The return type for the analyzeVisitorTrends function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const VisitorEntrySchema = z.object({
  id: z.string().describe('Unique identifier for the visitor entry.'),
  timestamp: z.string().datetime().describe('ISO 8601 formatted timestamp of the visit (e.g., "2023-10-27T10:00:00Z").'),
});

const AnalyzeVisitorTrendsInputSchema = z.object({
  visitorData: z.array(VisitorEntrySchema).describe('An array of historical visitor entry records.'),
});
export type AnalyzeVisitorTrendsInput = z.infer<typeof AnalyzeVisitorTrendsInputSchema>;

const AnalyzeVisitorTrendsOutputSchema = z.object({
  peakHours: z.array(z.string()).describe('Suggested peak hours based on the analysis (e.g., ["10 AM - 11 AM", "2 PM - 3 PM"]).'),
  peakDays: z.array(z.string()).describe('Suggested peak days of the week based on the analysis (e.g., ["Monday", "Wednesday"]).'),
  analysisSummary: z.string().describe('A summary of the visitor trends and insights found, explaining the findings.'),
});
export type AnalyzeVisitorTrendsOutput = z.infer<typeof AnalyzeVisitorTrendsOutputSchema>;

export async function analyzeVisitorTrends(input: AnalyzeVisitorTrendsInput): Promise<AnalyzeVisitorTrendsOutput> {
  return adminAnalyzeVisitorTrendsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeVisitorTrendsPrompt',
  input: {schema: AnalyzeVisitorTrendsInputSchema},
  output: {schema: AnalyzeVisitorTrendsOutputSchema},
  prompt: `You are an AI assistant specialized in analyzing library visitor data.
Your goal is to identify peak hours and peak days of the week based on the provided historical visitor entries.
Analyze the following JSON data representing visitor entries. Each entry has a 'timestamp' field in ISO 8601 format.

Visitor Data:
{{{JSON.stringify visitorData}}}

Based on this data, provide:
1. A list of peak hours (e.g., "10 AM - 11 AM", "2 PM - 3 PM"). Consider general blocks of time.
2. A list of peak days of the week (e.g., "Monday", "Wednesday").
3. A summary of the visitor trends and insights found, explaining your findings.

Output your response in the specified JSON format.`,
});

const adminAnalyzeVisitorTrendsFlow = ai.defineFlow(
  {
    name: 'adminAnalyzeVisitorTrendsFlow',
    inputSchema: AnalyzeVisitorTrendsInputSchema,
    outputSchema: AnalyzeVisitorTrendsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
