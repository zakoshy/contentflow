'use server';

/**
 * @fileOverview A social media post generation and analytics AI agent.
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
    .enum(['X', 'LinkedIn', 'Instagram', 'Facebook'])
    .describe('The social media platform for the posts.'),
  numberOfPosts: z.number().int().min(1).describe('The number of posts to generate.'),
  likes: z.number().optional().describe('Number of likes for analytics.'),
  comments: z.number().optional().describe('Number of comments for analytics.'),
  shares: z.number().optional().describe('Number of shares for analytics.'),
  clicks: z.number().optional().describe('Number of clicks for analytics.'),
  impressions: z.number().optional().describe('Number of impressions/reach for analytics.'),
  date_posted: z.string().optional().describe('Date the post was made for analytics.'),
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
      analytics_summary: z.string().optional().describe('Summary of post performance.'),
      highlights: z.array(z.string()).optional().describe('Most important metrics or insights.'),
      recommendations: z.array(z.string()).optional().describe('Optional tips or suggestions for next posts.'),
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
  prompt: `You are a social media content creation and analytics agent for organizations.
Your task has two phases:

### Phase 1: Generate Posts
1. Generate engaging, professional, audience-relevant social media posts.
2. Align posts with the organization’s mission and tone.
3. Keep posts short: max 280 characters for X/Twitter, up to 200 words for LinkedIn/Instagram/Facebook.
4. Include 2–5 relevant hashtags per post.
5. Optionally suggest an image idea (do not generate the image).

### Phase 2: Analyze Post Performance (if analytics are available)
1. Summarize post engagement in a clear, professional way.
2. Highlight key metrics: likes, comments, shares, clicks, impressions/reach.
3. Provide recommendations for improving future posts (e.g., posting time, hashtags, content type).

### Input:
- Organization name: {{{organizationName}}}
- Topics/keywords: {{#each topics}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}
- Platform: {{{platform}}}
- Number of posts: {{{numberOfPosts}}}
{{#if likes}}
- Optional Analytics (for Phase 2):
  - Likes: {{{likes}}}
  - Comments: {{{comments}}}
  - Shares: {{{shares}}}
  - Clicks: {{{clicks}}}
  - Impressions/Reach: {{{impressions}}}
  - Date posted: {{{date_posted}}}
{{/if}}

Generate {{numberOfPosts}} social media posts for {{organizationName}} on {{platform}}.
Topics include: {{#each topics}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}.
Follow the rules and output the JSON format. If analytics data is provided, perform Phase 2.
If analytics data is not provided, only perform Phase 1.
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
