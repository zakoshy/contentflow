// src/ai/flows/suggest-relevant-hashtags.ts
'use server';

/**
 * @fileOverview This file defines a Genkit flow for suggesting relevant hashtags for a social media post.
 *
 * - suggestRelevantHashtags - A function that takes social media post text as input and returns a list of suggested hashtags.
 * - SuggestRelevantHashtagsInput - The input type for the suggestRelevantHashtags function.
 * - SuggestRelevantHashtagsOutput - The return type for the suggestRelevantHashtags function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestRelevantHashtagsInputSchema = z.object({
  postText: z.string().describe('The text content of the social media post.'),
});
export type SuggestRelevantHashtagsInput = z.infer<typeof SuggestRelevantHashtagsInputSchema>;

const SuggestRelevantHashtagsOutputSchema = z.object({
  hashtags: z.array(z.string()).describe('An array of relevant hashtags.'),
});
export type SuggestRelevantHashtagsOutput = z.infer<typeof SuggestRelevantHashtagsOutputSchema>;

export async function suggestRelevantHashtags(input: SuggestRelevantHashtagsInput): Promise<SuggestRelevantHashtagsOutput> {
  return suggestRelevantHashtagsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestRelevantHashtagsPrompt',
  input: {schema: SuggestRelevantHashtagsInputSchema},
  output: {schema: SuggestRelevantHashtagsOutputSchema},
  prompt: `You are a social media expert. Given the following post text, suggest a list of 2-5 relevant hashtags to increase its visibility.

Post Text: {{{postText}}}

Please provide the hashtags as a JSON array of strings.
`,
});

const suggestRelevantHashtagsFlow = ai.defineFlow(
  {
    name: 'suggestRelevantHashtagsFlow',
    inputSchema: SuggestRelevantHashtagsInputSchema,
    outputSchema: SuggestRelevantHashtagsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
