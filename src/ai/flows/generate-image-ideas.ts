'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating image ideas for social media posts.
 *
 * It includes:
 * - GenerateImageIdeasInput: The input type for the generateImageIdeas function.
 * - GenerateImageIdeasOutput: The output type for the generateImageIdeas function.
 * - generateImageIdeas: An async function that calls the generateImageIdeasFlow with the input and returns the output.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateImageIdeasInputSchema = z.object({
  postText: z
    .string()
    .describe('The text content of the social media post.'),
  platform: z
    .string()
    .describe('The social media platform for the post (e.g., Twitter, LinkedIn, Instagram, Facebook).'),
  organizationName: z.string().describe('The name of the organization.'),
});
export type GenerateImageIdeasInput = z.infer<typeof GenerateImageIdeasInputSchema>;

const GenerateImageIdeasOutputSchema = z.object({
  imageIdea: z.string().describe('An idea for an image to accompany the social media post.'),
});
export type GenerateImageIdeasOutput = z.infer<typeof GenerateImageIdeasOutputSchema>;

export async function generateImageIdeas(input: GenerateImageIdeasInput): Promise<GenerateImageIdeasOutput> {
  return generateImageIdeasFlow(input);
}

const generateImageIdeasPrompt = ai.definePrompt({
  name: 'generateImageIdeasPrompt',
  input: {schema: GenerateImageIdeasInputSchema},
  output: {schema: GenerateImageIdeasOutputSchema},
  prompt: `You are a social media expert generating ideas for images to accompany social media posts.

  Given the following social media post, generate an idea for an image that would be visually appealing and relevant to the post's content.

  Organization: {{{organizationName}}}
  Platform: {{{platform}}}
  Post Text: {{{postText}}}

  Image Idea:`,
});

const generateImageIdeasFlow = ai.defineFlow(
  {
    name: 'generateImageIdeasFlow',
    inputSchema: GenerateImageIdeasInputSchema,
    outputSchema: GenerateImageIdeasOutputSchema,
  },
  async input => {
    const {output} = await generateImageIdeasPrompt(input);
    return output!;
  }
);
