/**
 * @fileoverview This file initializes and configures the Genkit AI framework.
 * It sets up the necessary plugins (like Google AI) and specifies a default model
 * to be used throughout the application for generative AI tasks.
 */
import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/google-genai';

// Initialize Genkit with the Google AI plugin.
// This allows the application to connect to Google's generative models (e.g., Gemini).
export const ai = genkit({
  plugins: [googleAI()],
  // Sets the default model to be used for generation tasks.
  model: 'googleai/gemini-2.5-flash',
});
