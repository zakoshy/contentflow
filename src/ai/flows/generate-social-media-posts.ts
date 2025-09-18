'use server';

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

/**
 * -------------------------------
 * Input Schema
 * -------------------------------
 * User provides company name, topics, tone, language, number of posts.
 */
const GenerateSocialMediaPostsInputSchema = z.object({
  organizationName: z.string().describe('The name of the organization.'),
  topics: z
    .string()
    .describe('A description of the topics or keywords related to the organization.'),
  numberOfPosts: z
    .number()
    .int()
    .min(1)
    .max(10)
    .describe('The number of posts to generate.'),
  tone: z.enum(['Casual', 'Official', 'Fun']).describe('The desired tone for the posts.'),
  language: z.enum(['English', 'Swahili', 'Sheng']).describe('The desired language for the posts.'),
});
export type GenerateSocialMediaPostsInput = z.infer<typeof GenerateSocialMediaPostsInputSchema>;

/**
 * -------------------------------
 * Output Schema
 * -------------------------------
 * Each post contains text, hashtags, and a creative idea for an image/video.
 * You’ll attach/upload the real image separately in your Zapier workflow.
 */
const PostSchema = z.object({
  post_id: z.string().describe("A unique identifier for the post, e.g., 'post_1'."),
  text: z.string().describe('The generated social media post text.'),
  hashtags: z.array(z.string()).describe('A list of relevant hashtags.'),
  image_idea: z
    .string()
    .describe('A creative idea for an image or video (NOT a URL).'),
});

const GenerateSocialMediaPostsOutputSchema = z.object({
  organization: z.string().describe('The name of the organization.'),
  posts: z.array(PostSchema).describe('The generated social media posts.'),
});
export type GenerateSocialMediaPostsOutput = z.infer<typeof GenerateSocialMediaPostsOutputSchema>;

/**
 * -------------------------------
 * Prompt
 * -------------------------------
 * Instructs AI to generate post text, hashtags, and image ideas only.
 * Explicitly forbid it from generating URLs.
 */
const prompt = ai.definePrompt({
  name: 'generateSocialMediaPostsPrompt',
  input: { schema: GenerateSocialMediaPostsInputSchema },
  output: { schema: GenerateSocialMediaPostsOutputSchema },
  prompt: `
You are a social media content creation assistant.

Generate {{{numberOfPosts}}} unique, engaging social media posts for the organization "{{{organizationName}}}".

- Topics/keywords: {{{topics}}}
- Tone: {{{tone}}}
- Language: {{{language}}}

For each post:
- Write a short, engaging piece of text.
- Include 2–5 relevant hashtags.
- Suggest a **creative image or video idea** (but do NOT provide URLs — just the idea).

Output a single valid JSON object matching the required schema. Do not include any extra commentary.
  `,
});

/**
 * -------------------------------
 * Flow
 * -------------------------------
 */
const generateSocialMediaPostsFlow = ai.defineFlow(
  {
    name: 'generateSocialMediaPostsFlow',
    inputSchema: GenerateSocialMediaPostsInputSchema,
    outputSchema: GenerateSocialMediaPostsOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);

/**
 * -------------------------------
 * Exported function
 * -------------------------------
 */
export async function generateSocialMediaPosts(
  input: GenerateSocialMediaPostsInput
): Promise<GenerateSocialMediaPostsOutput> {
  return generateSocialMediaPostsFlow(input);
}
