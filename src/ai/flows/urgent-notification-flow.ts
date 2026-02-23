'use server';
/**
 * @fileOverview A Genkit flow for generating personalized urgent blood request notifications in Bengali.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const NotificationInputSchema = z.object({
  donorName: z.string(),
  patientName: z.string(),
  bloodType: z.string(),
  hospitalName: z.string(),
  contactPhone: z.string(),
  location: z.string(),
});
export type NotificationInput = z.infer<typeof NotificationInputSchema>;

const NotificationOutputSchema = z.object({
  message: z.string().describe('The generated notification message in Bengali.'),
});
export type NotificationOutput = z.infer<typeof NotificationOutputSchema>;

export async function generateNotification(input: NotificationInput): Promise<NotificationOutput> {
  return urgentNotificationFlow(input);
}

const urgentNotificationPrompt = ai.definePrompt({
  name: 'urgentNotificationPrompt',
  input: {schema: NotificationInputSchema},
  output: {schema: NotificationOutputSchema},
  prompt: `You are a professional communicator for RoktoDao, a blood donation platform. Generate a personalized, emotionally compelling, yet professional SMS/WhatsApp notification in Bengali for a potential donor.

Details:
Donor Name: {{{donorName}}}
Patient Context: {{{patientName}}}
Required Blood Group: {{{bloodType}}}
Hospital: {{{hospitalName}}}
Location: {{{location}}}
Contact Phone: {{{contactPhone}}}

The message should:
1. Start with a respectful greeting.
2. Clearly state the urgency of the need.
3. Mention the donor's specific blood group and how they can save a life.
4. Provide the contact information.
5. End with an encouraging closing.

Format the output as a single string of text in Bengali.`,
});

const urgentNotificationFlow = ai.defineFlow(
  {
    name: 'urgentNotificationFlow',
    inputSchema: NotificationInputSchema,
    outputSchema: NotificationOutputSchema,
  },
  async (input) => {
    const {output} = await urgentNotificationPrompt(input);
    return output!;
  }
);
