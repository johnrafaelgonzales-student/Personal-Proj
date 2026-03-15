/**
 * This server-side module defines an AI-powered flow for analyzing visitor data.
 * It uses Genkit and a Large Language Model to identify trends like peak hours and days
 * from a list of visitor timestamps.
 *
 * @fileOverview An AI agent for analyzing historical visitor data to identify trends.
 * @exports analyzeVisitorTrends - An async function to trigger the analysis flow.
 * @exports AnalyzeVisitorTrendsInput - The Zod schema for the input data.
 * @exports AnalyzeVisitorTrendsOutput - The Zod schema for the expected output.
 */
'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Defines the schema for the complete input to the analysis flow.
const AnalyzeVisitorTrendsInputSchema = z.object({
  visitorDataJson: z.string().describe('A JSON string representing an array of historical visitor entry records.'),
});
export type AnalyzeVisitorTrendsInput = z.infer<typeof AnalyzeVisitorTrendsInputSchema>;

// Defines the schema for the structured output expected from the AI.
const AnalyzeVisitorTrendsOutputSchema = z.object({
  peakHours: z.array(z.string()).describe('Suggested peak hours based on the analysis (e.g., ["10 AM - 11 AM", "2 PM - 3 PM"]).'),
  peakDays: z.array(z.string()).describe('Suggested peak days of the week based on the analysis (e.g., ["Monday", "Wednesday"]).'),
  analysisSummary: z.string().describe('A summary of the visitor trends and insights found, explaining the findings.'),
});
export type AnalyzeVisitorTrendsOutput = z.infer<typeof AnalyzeVisitorTrendsOutputSchema>;

/**
 * Publicly exported function that serves as a wrapper to run the AI flow.
 * @param {AnalyzeVisitorTrendsInput} input - The historical visitor data as a JSON string.
 * @returns {Promise<AnalyzeVisitorTrendsOutput>} The analysis result from the AI.
 */
export async function analyzeVisitorTrends(input: AnalyzeVisitorTrendsInput): Promise<AnalyzeVisitorTrendsOutput> {
  return adminAnalyzeVisitorTrendsFlow(input);
}

// Defines the AI prompt itself.
const prompt = ai.definePrompt({
  name: 'analyzeVisitorTrendsPrompt',
  input: {schema: AnalyzeVisitorTrendsInputSchema},
  output: {schema: AnalyzeVisitorTrendsOutputSchema},
  // The prompt provides instructions to the LLM on how to process the data.
  prompt: `You are an AI assistant specialized in analyzing library visitor data.
Your goal is to identify peak hours and peak days of the week based on the provided historical visitor entries.
Analyze the following JSON data representing visitor entries. Each entry has a 'timestamp' field in ISO 8601 format.

Visitor Data:
{{{visitorDataJson}}}

Based on this data, provide:
1. A list of peak hours (e.g., "10 AM - 11 AM", "2 PM - 3 PM"). Consider general blocks of time.
2. A list of peak days of the week (e.g., "Monday", "Wednesday").
3. A summary of the visitor trends and insights found, explaining your findings.

Output your response in the specified JSON format.`,
});

// Defines the Genkit flow, which orchestrates the AI call.
const adminAnalyzeVisitorTrendsFlow = ai.defineFlow(
  {
    name: 'adminAnalyzeVisitorTrendsFlow',
    inputSchema: AnalyzeVisitorTrendsInputSchema,
    outputSchema: AnalyzeVisitorTrendsOutputSchema,
  },
  async input => {
    // Calls the defined prompt with the input data.
    const {output} = await prompt(input);
    // Returns the structured output from the LLM.
    return output!;
  }
);
