'use server';

import {
  generateSocialMediaPosts,
  type GenerateSocialMediaPostsInput,
  type GenerateSocialMediaPostsOutput,
} from '@/ai/flows/generate-social-media-posts';
import { formSchema } from '@/lib/schema';

export interface FormState {
  message: string;
  data?: GenerateSocialMediaPostsOutput;
  error?: boolean;
}

export async function generatePostsAction(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  try {
    const validatedFields = formSchema.safeParse({
      organizationName: formData.get('organizationName'),
      topics: formData.get('topics'),
      platform: formData.get('platform'),
      numberOfPosts: formData.get('numberOfPosts'),
      likes: formData.get('likes') || undefined,
      comments: formData.get('comments') || undefined,
      shares: formData.get('shares') || undefined,
      clicks: formData.get('clicks') || undefined,
      impressions: formData.get('impressions') || undefined,
      date_posted: formData.get('date_posted') || undefined,
    });

    if (!validatedFields.success) {
      const issues = validatedFields.error.flatten().fieldErrors;
      const message = Object.values(issues).flat().join(' ');
      return {
        message: `Invalid form data. ${message}`,
        error: true,
      };
    }

    const input: GenerateSocialMediaPostsInput = {
      ...validatedFields.data,
      topics: validatedFields.data.topics.split(',').map(t => t.trim()),
    };

    const result = await generateSocialMediaPosts(input);

    return {
      message: 'Posts generated successfully.',
      data: result,
    };
  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
    return {
      message: `An error occurred: ${errorMessage}`,
      error: true,
    };
  }
}
