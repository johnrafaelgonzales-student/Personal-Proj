/**
 * @fileoverview This is the development entry point for Genkit.
 * It's used to register and start all the AI flows when running in a development environment.
 * The `dotenv` configuration loads environment variables from a `.env` file.
 */
import { config } from 'dotenv';
config();

// This import registers the `adminAnalyzeVisitorTrends` flow with the Genkit framework.
import '@/ai/flows/admin-analyze-visitor-trends.ts';
