'use server';

import {
  generateSocialMediaPosts,
  type GenerateSocialMediaPostsInput,
  type GenerateSocialMediaPostsOutput,
} from '@/ai/flows/generate-social-media-posts';
import { formSchema } from '@/lib/schema';

export interface FormState {
  message: string;
  data?: GenerateSocialMediaPostsOutput[];
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
      platforms: formData.getAll('platforms'),
      numberOfPosts: formData.get('numberOfPosts'),
      tone: formData.get('tone'),
      language: formData.get('language'),
    });

    if (!validatedFields.success) {
      const issues = validatedFields.error.flatten().fieldErrors;
      const message = Object.values(issues).flat().join(' ');
      return {
        message: `Invalid form data. ${message}`,
        error: true,
      };
    }

    const { platforms, ...commonInput } = validatedFields.data;
    const topics = commonInput.topics.split(',').map(t => t.trim());

    const results = await Promise.all(
      platforms.map(platform => {
        const input: GenerateSocialMediaPostsInput = {
          ...commonInput,
          topics,
          platform,
        };
        return generateSocialMediaPosts(input);
      })
    );

    return {
      message: 'Posts generated successfully.',
      data: results,
    };
  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
    return {
      message: `An error occurred: ${errorMessage}`,
      error: true,
    };
  }
}
