'use server';

/**
 * @fileOverview A Genkit flow for generating images from a text prompt.
 *
 * This file defines:
 * - GenerateImageInput: The input schema for the image generation flow.
 * - GenerateImageOutput: The output schema for the image generation flow.
 * - generateImage: An async function that invokes the image generation flow.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

export const GenerateImageInputSchema = z.object({
  prompt: z.string().describe('The text prompt to generate an image from.'),
});
export type GenerateImageInput = z.infer<typeof GenerateImageInputSchema>;

export const GenerateImageOutputSchema = z.object({
  imageUrl: z.string().describe('The data URI of the generated image.'),
});
export type GenerateImageOutput = z.infer<typeof GenerateImageOutputSchema>;

export async function generateImage(input: GenerateImageInput): Promise<GenerateImageOutput> {
  return generateImageFlow(input);
}

const generateImageFlow = ai.defineFlow(
  {
    name: 'generateImageFlow',
    inputSchema: GenerateImageInputSchema,
    outputSchema: GenerateImageOutputSchema,
  },
  async (input) => {
    const { media } = await ai.generate({
      model: 'googleai/imagen-4.0-fast-generate-001',
      prompt: input.prompt,
    });
    
    const imageUrl = media.url;
    if (!imageUrl) {
        throw new Error('Image generation failed.');
    }

    return { imageUrl };
  }
);
