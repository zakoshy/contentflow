'use server';

import { z } from 'zod';

const sendToBufferSchema = z.object({
  text: z.string(),
  // The imageUrl is no longer needed as we are providing image ideas.
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

    const { text } = validatedFields.data;

    // The payload no longer includes an imageUrl.
    const payload = { text };

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
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
