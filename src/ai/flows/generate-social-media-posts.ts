'use server';

/**
 * @fileOverview A social media post generation AI agent.
 *
 * - generateSocialMediaPosts - A function that generates social media posts.
 * - GenerateSocialMediaPostsInput - The input type for the generateSocialMediaPosts function.
 * - GenerateSocialMediaPostsOutput - The return type for the generateSocialMediaPosts function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateSocialMediaPostsInputSchema = z.object({
  organizationName: z.string().describe('The name of the organization.'),
  topics: z.array(z.string()).describe('A list of topics or keywords related to the organization.'),
  platform: z
    .enum(['Twitter', 'LinkedIn', 'Instagram', 'Facebook'])
    .describe('The social media platform for the posts.'),
  numberOfPosts: z.number().int().min(1).describe('The number of posts to generate.'),
});
export type GenerateSocialMediaPostsInput = z.infer<
  typeof GenerateSocialMediaPostsInputSchema
>;

const GenerateSocialMediaPostsOutputSchema = z.object({
  organization: z.string().describe('The name of the organization.'),
  platform: z.string().describe('The social media platform.'),
  posts: z.array(
    z.object({
      text: z.string().describe('The generated social media post text.'),
      hashtags: z.array(z.string()).describe('A list of relevant hashtags.'),
      image_idea: z.string().describe('An idea for an image to accompany the post.'),
    })
  ),
});
export type GenerateSocialMediaPostsOutput = z.infer<
  typeof GenerateSocialMediaPostsOutputSchema
>;

export async function generateSocialMediaPosts(
  input: GenerateSocialMediaPostsInput
): Promise<GenerateSocialMediaPostsOutput> {
  return generateSocialMediaPostsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateSocialMediaPostsPrompt',
  input: {schema: GenerateSocialMediaPostsInputSchema},
  output: {schema: GenerateSocialMediaPostsOutputSchema},
  prompt: `You are a social media content creation agent for organizations.
Your task is to generate engaging, professional, and audience-relevant social media posts.

Rules:
1. Always write posts that align with the organization’s mission and tone of voice.
2. Keep posts short (max 280 characters for X/Twitter, up to 200 words for LinkedIn/Instagram/Facebook).
3. Always include relevant hashtags (2–5 per post).
4. Optionally suggest an image idea (but do not generate the image).

Input:
- Organization name: {{{organizationName}}}
- Topics/keywords: {{#each topics}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}
- Platform: {{{platform}}}
- Number of posts: {{{numberOfPosts}}}

Output format (JSON):
{
  "organization": "{{{organizationName}}}",
  "platform": "{{{platform}}}",
  "posts": [
    {
      "text": "Post caption here...",
      "hashtags": ["#tag1", "#tag2"],
      "image_idea": "Describe the kind of image/graphic that would go well"
    }
  ]
}

Generate {{numberOfPosts}} social media posts for {{organizationName}} on {{platform}}.
Topics include: {{#each topics}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}.
Follow the rules and output the JSON format.
`,
});

const generateSocialMediaPostsFlow = ai.defineFlow(
  {
    name: 'generateSocialMediaPostsFlow',
    inputSchema: GenerateSocialMediaPostsInputSchema,
    outputSchema: GenerateSocialMediaPostsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
