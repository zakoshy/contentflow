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
  platforms: z.array(z
    .enum(['X', 'LinkedIn', 'Instagram', 'Facebook', 'TikTok']))
    .describe('The social media platforms for the posts.'),
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

const PostSchema = z.object({
  text: z.string().describe('The generated social media post text.'),
  hashtags: z.array(z.string()).describe('A list of relevant hashtags.'),
  image_idea: z.string().describe('An idea for an image or video to accompany the post.'),
  analytics_summary: z.string().optional().describe('Summary of post performance.'),
  highlights: z.array(z.string()).optional().describe('Most important metrics or insights.'),
  recommendations: z.array(z.string()).optional().describe('Optional tips or suggestions for next posts.'),
});

const GenerateSocialMediaPostsOutputSchema = z.object({
  organization: z.string().describe('The name of the organization.'),
  platforms: z.array(z.string()).describe('The social media platforms.'),
  posts: z.array(
    z.object({
      post_id: z.string().describe("A unique identifier for the conceptual post, e.g., 'post_1'."),
      platform_posts: z.record(z.string(), PostSchema).describe("A record of posts, keyed by platform name (e.g., 'X', 'LinkedIn')."),
    })
  )
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
1. Generate a total of {{{numberOfPosts}}} unique, engaging, professional, audience-relevant social media post concepts.
2. For each post concept, generate a version tailored for EACH of the following platforms: {{#each platforms}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}.
3. Align posts with the organization’s mission.
4. Use the specified tone: {{{tone}}}.
5. Write all posts in the specified language: {{{language}}}. For Sheng, use a modern, authentic Nairobi slang style.
6. Include 2–5 relevant hashtags per post.
7. Suggest a visual idea (image or video) for each post, keeping the platform in mind.
8. Each conceptual post should have a unique 'post_id' (e.g., "post_1", "post_2"). The 'platform_posts' object should contain the tailored post for each specified platform.

### Platform-Specific Guidelines:
- X: Keep posts concise. The post text itself should be **no more than 250 characters**. This is to leave room for an image URL that will be added later. Use hashtags and mentions. Image ideas should be impactful and simple.
- LinkedIn: Professional tone. Longer posts (up to 200 words) are acceptable. Focus on industry insights, company news, and thought leadership. Image ideas should be professional graphics, charts, or team photos.
- Instagram: Visually-driven. Write engaging captions. Image ideas should be high-quality photos, carousels, or short Reels.
- Facebook: Versatile. Can be casual or official. Posts can be longer. Good for community building and sharing links.
- TikTok: Casual, fun, and trend-aware tone. Keep text very short. The 'image_idea' should be a concept for a short vertical video (e.g., "A quick tutorial video showing... a before-and-after clip...").

### Phase 2: Analyze Post Performance
If a specific post text (postText) and its analytics data (likes, comments, etc.) are provided, your primary task is to analyze that one post for one platform.
1. Use the provided post text as the content to analyze.
2. Summarize the post's engagement in a clear, professional way.
3. Highlight key metrics: likes, comments, shares, clicks, impressions/reach.
4. Provide recommendations for improving future posts based on the performance of this specific post.
5. In this case, you should return a single conceptual post in the 'posts' array. The 'platform_posts' object will contain only one entry for the specified platform, which includes the original text and the new analytics fields.

### Input:
- Organization name: {{{organizationName}}}
- Platforms: {{#each platforms}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}
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
- Otherwise, perform Phase 1 and generate {{numberOfPosts}} new post concepts for {{organizationName}} across all specified platforms.
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
