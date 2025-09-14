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
    .enum(['X', 'LinkedIn', 'Instagram', 'Facebook', 'TikTok'])
    .describe('The social media platform for the posts.'),
  numberOfPosts: z.number().int().min(1).describe('The number of posts to generate.'),
  tone: z.enum(['Casual', 'Official', 'Fun']).describe('The desired tone for the posts.'),
  language: z.enum(['English', 'Swahili', 'Sheng']).describe('The desired language for the posts.'),
  postText: z.string().optional().describe('The text of a specific post to be analyzed.'),
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
If no specific post text is provided for analysis, your primary task is to generate new posts.
1. Generate engaging, professional, audience-relevant social media posts.
2. Align posts with the organization’s mission.
3. Use the specified tone: {{{tone}}}.
4. Write all posts in the specified language: {{{language}}}. For Sheng, use a modern, authentic Nairobi slang style.
5. Keep posts short: max 280 characters for X, up to 200 words for LinkedIn/Instagram/Facebook. For TikTok, keep it even shorter and use a more casual, trending-aware tone.
6. Include 2–5 relevant hashtags per post.
7. Suggest an image idea for each post.

### Phase 2: Analyze Post Performance
If a specific post text (postText) and its analytics data (likes, comments, etc.) are provided, your primary task is to analyze that post.
1. Use the provided post text as the content to analyze.
2. Summarize the post's engagement in a clear, professional way.
3. Highlight key metrics: likes, comments, shares, clicks, impressions/reach.
4. Provide recommendations for improving future posts based on the performance of this specific post.
5. In this case, you should only return one post in the 'posts' array, which includes the original text and the new analytics fields.

### Input:
- Organization name: {{{organizationName}}}
- Platform: {{{platform}}}
- Tone: {{{tone}}}
- Language: {{{language}}}
{{#if postText}}
- Post to Analyze: {{{postText}}}
{{else}}
- Topics/keywords: {{#each topics}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}
- Number of posts: {{{numberOfPosts}}}
{{/if}}
{{#if likes}}
- Analytics Data:
  - Likes: {{{likes}}}
  - Comments: {{{comments}}}
  - Shares: {{{shares}}}
  - Clicks: {{{clicks}}}
  - Impressions/Reach: {{{impressions}}}
  - Date posted: {{{date_posted}}}
{{/if}}

Please follow the rules and output the JSON format.
- If analytics data and postText are provided, perform Phase 2 for that specific post.
- Otherwise, perform Phase 1 and generate {{numberOfPosts}} new posts for {{organizationName}} on {{platform}}.
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
