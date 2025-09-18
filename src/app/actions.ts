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
      platforms: formData.getAll('platforms'), // Correctly get all platform values
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

    const { topics, ...rest } = validatedFields.data;
    const topicsArray = topics.split(',').map(t => t.trim());

    const input: GenerateSocialMediaPostsInput = {
      ...rest,
      topics: topicsArray,
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
