import { z } from 'zod';

export const formSchema = z.object({
  organizationName: z.string().min(1, 'Organization name is required.'),
  topics: z.string().min(1, 'Please provide at least one topic.'),
  platform: z.enum(['Twitter', 'LinkedIn', 'Instagram', 'Facebook']),
  numberOfPosts: z.coerce.number().int().min(1).max(5),
  likes: z.coerce.number().optional(),
  comments: z.coerce.number().optional(),
  shares: z.coerce.number().optional(),
  clicks: z.coerce.number().optional(),
  impressions: z.coerce.number().optional(),
  date_posted: z.string().optional(),
});

export type FormSchema = z.infer<typeof formSchema>;
