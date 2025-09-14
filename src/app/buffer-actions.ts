'use server';

import { z } from 'zod';

const sendToBufferSchema = z.object({
  text: z.string(),
  imageUrl: z.string().optional(),
});

export interface SendToBufferState {
  message: string;
  error?: boolean;
}

export async function sendToBuffer(
  formData: FormData
): Promise<SendToBufferState> {
  try {
    const validatedFields = sendToBufferSchema.safeParse({
      text: formData.get('text'),
      imageUrl: formData.get('imageUrl'),
    });

    if (!validatedFields.success) {
      return {
        message: 'Invalid post data.',
        error: true,
      };
    }

    const webhookUrl = process.env.ZAPIER_WEBHOOK_URL;

    if (!webhookUrl) {
      return {
        message: 'Zapier webhook URL is not configured.',
        error: true,
      };
    }

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        text: validatedFields.data.text,
        imageUrl: validatedFields.data.imageUrl
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      return {
        message: `Failed to send to Zapier: ${errorBody}`,
        error: true,
      };
    }

    return {
      message: 'Post sent successfully!',
    };
  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
    return {
      message: `An error occurred: ${errorMessage}`,
      error: true,
    };
  }
}
