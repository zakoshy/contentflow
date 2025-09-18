'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateSocialMediaPostsInputSchema = z.object({
  organizationName: z.string().describe('The name of the organization.'),
  topics: z
    .string()
    .describe(
      'A description of the topics or keywords related to the organization.'
    ),
  platforms: z
    .array(z.enum(['X', 'LinkedIn', 'Instagram', 'Facebook', 'TikTok']))
    .describe('The social media platforms for the posts.'),
  numberOfPosts: z
    .number()
    .int()
    .min(1)
    .describe('The number of posts to generate.'),
  tone: z
    .enum(['Casual', 'Official', 'Fun'])
    .describe('The desired tone for the posts.'),
  language: z
    .enum(['English', 'Swahili', 'Sheng'])
    .describe('The desired language for the posts.'),
});
export type GenerateSocialMediaPostsInput = z.infer<
  typeof GenerateSocialMediaPostsInputSchema
>;

const PostSchema = z.object({
  text: z.string().describe('The generated social media post text.'),
  hashtags: z.array(z.string()).describe('A list of relevant hashtags.'),
  image_idea: z
    .string()
    .describe('An idea for an image or video to accompany the post.'),
  analytics_summary: z
    .string()
    .optional()
    .describe('Summary of post performance.'),
  highlights: z
    .array(z.string())
    .optional()
    .describe('Most important metrics or insights.'),
  recommendations: z
    .array(z.string())
    .optional()
    .describe('Optional tips or suggestions for next posts.'),
});

const GenerateSocialMediaPostsOutputSchema = z.object({
  organization: z.string().describe('The name of the organization.'),
  platforms: z.array(z.string()).describe('The social media platforms.'),
  posts: z.array(
    z.object({
      post_id: z
        .string()
        .describe(
          "A unique identifier for the conceptual post, e.g., 'post_1'."
        ),
      platform_posts: z
        .record(z.string(), PostSchema)
        .describe(
          "A record of posts, keyed by platform name (e.g., 'X', 'LinkedIn')."
        ),
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
  prompt: `You are a social media content creation agent. Your task is to generate social media post concepts based on the provided inputs and tailor them for various platforms.

**Instructions for Post Generation:**

1.  **Generate Concepts:** Create {{{numberOfPosts}}} unique and engaging social media post concepts. Each concept should be distinct from the others.
2.  **Tailor for Platforms:** For EACH of the {{{numberOfPosts}}} concepts, you must generate a version specifically tailored for EACH of the following platforms: {{#each platforms}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}.
3.  **Content Guidelines:**
    *   **Organization:** Posts should align with the mission of "{{{organizationName}}}".
    *   **Topics:** Base the content on this description: {{{topics}}}.
    *   **Tone:** Use a {{{tone}}} tone.
    *   **Language:** Write all content in {{{language}}}.
    *   **Hashtags:** Include 2-5 relevant hashtags for each post.
    *   **Visuals:** Suggest a relevant image or video idea for each post.

**Output Structure:**

Your output must be a single, valid JSON object that strictly follows the provided schema.

*   Each post concept must have a unique \`post_id\` (e.g., "post_1", "post_2").
*   The \`platform_posts\` object for each concept must contain a key for every platform specified in the input (e.g., "X", "LinkedIn"), with the tailored content as the value.

**Platform-Specific Hints:**

*   **X:** Keep it concise (under 280 characters). Hashtags are crucial.
*   **LinkedIn:** Professional tone. Longer, more detailed content is acceptable.
*   **Instagram:** Focus on visually-driven captions that tell a story.
*   **Facebook:** Good for community building, asking questions, and sharing links.
*   **TikTok:** Casual, fun, and video-oriented. The visual idea should be for a short video.

**IMPORTANT: Your response MUST be only the JSON object, with no additional text or explanations before or after it.**
`,
});

const generateSocialMediaPostsFlow = ai.defineFlow(
  {
    name: 'generateSocialMediaPostsFlow',
    inputSchema: GenerateSocialMediaPostsInputSchema,
    outputSchema: GenerateSocialMediaPostsOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);
