import { z } from 'zod';

export const formSchema = z.object({
  organizationName: z.string().min(1, 'Organization name is required.'),
  topics: z.string().min(1, 'Please provide at least one topic.'),
  platforms: z.array(z.enum(['X', 'LinkedIn', 'Instagram', 'Facebook', 'TikTok'])).min(1, {
    message: 'You must select at least one social media platform.',
  }),
  numberOfPosts: z.coerce.number().int().min(1).max(5),
  tone: z.enum(['Official', 'Casual', 'Fun']),
  language: z.enum(['English', 'Swahili', 'Sheng']),
});

export type FormSchema = z.infer<typeof formSchema>;
