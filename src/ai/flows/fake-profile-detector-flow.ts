'use server';
/**
 * @fileOverview A Genkit flow for detecting suspicious or fake donor profiles.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const FakeProfileInputSchema = z.object({
  fullName: z.string(),
  phone: z.string(),
  bloodType: z.string(),
  age: z.number(),
  weightKg: z.number(),
  lastDonationDate: z.string().optional(),
  district: z.string(),
  area: z.string(),
});
export type FakeProfileInput = z.infer<typeof FakeProfileInputSchema>;

const FakeProfileOutputSchema = z.object({
  riskScore: z.number().int().min(0).max(100).describe('A score from 0 to 100 indicating the likelihood the profile is fake.'),
  isSuspicious: z.boolean().describe('True if the profile shows suspicious patterns.'),
  analysis: z.string().describe('Detailed reasoning for the risk score.'),
});
export type FakeProfileOutput = z.infer<typeof FakeProfileOutputSchema>;

export async function analyzeProfile(input: FakeProfileInput): Promise<FakeProfileOutput> {
  return fakeProfileDetectorFlow(input);
}

const fakeProfileDetectorPrompt = ai.definePrompt({
  name: 'fakeProfileDetectorPrompt',
  input: {schema: FakeProfileInputSchema},
  output: {schema: FakeProfileOutputSchema},
  prompt: `You are a security analyst for a blood donation platform. Analyze the following donor profile for signs of being a "fake" or "bot" profile.

Donor Details:
Name: {{{fullName}}}
Phone: {{{phone}}}
Blood Type: {{{bloodType}}}
Age: {{{age}}}
Weight: {{{weightKg}}} kg
District: {{{district}}}
Area: {{{area}}}
Last Donation: {{{lastDonationDate}}}

Look for common fake profile patterns:
1. Nonsensical or repetitive names.
2. Invalid phone formats (though assume basic length is checked).
3. Highly improbable age/weight combinations.
4. "Last donation" dates that are logically impossible (e.g., in the future or too frequent).
5. Generic or placeholder text in location fields.

Provide a risk score (0-100), where 100 is definitely fake, and a detailed analysis in English.`,
});

const fakeProfileDetectorFlow = ai.defineFlow(
  {
    name: 'fakeProfileDetectorFlow',
    inputSchema: FakeProfileInputSchema,
    outputSchema: FakeProfileOutputSchema,
  },
  async (input) => {
    const {output} = await fakeProfileDetectorPrompt(input);
    return output!;
  }
);
