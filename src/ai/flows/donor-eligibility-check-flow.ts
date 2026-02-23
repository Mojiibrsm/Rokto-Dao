'use server';
/**
 * @fileOverview A Genkit flow for determining preliminary blood donation eligibility.
 *
 * - checkDonorEligibility - A function that handles the preliminary eligibility check.
 * - DonorEligibilityCheckInput - The input type for the checkDonorEligibility function.
 * - DonorEligibilityCheckOutput - The return type for the checkDonorEligibility function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DonorEligibilityCheckInputSchema = z.object({
  age: z.number().int().min(16).max(99).describe('The age of the potential donor in years.'),
  weightLbs: z.number().min(110).describe('The weight of the potential donor in pounds.'),
  feltSickRecently: z
    .boolean()
    .describe('True if the donor has felt sick (cold, flu, fever) in the last 7 days, false otherwise.'),
  takingMedications: z
    .boolean()
    .describe('True if the donor is currently taking any prescription medications, false otherwise.'),
  receivedTattooOrPiercing: z
    .boolean()
    .describe('True if the donor has received a tattoo or body piercing in the last 4 months, false otherwise.'),
  traveledToMalariaRiskArea: z
    .boolean()
    .describe('True if the donor has traveled to a malaria-risk area in the last 3 years, false otherwise.'),
});
export type DonorEligibilityCheckInput = z.infer<typeof DonorEligibilityCheckInputSchema>;

const DonorEligibilityCheckOutputSchema = z.object({
  isEligible: z
    .boolean()
    .describe('A preliminary determination of whether the donor is eligible to donate blood.'),
  reason: z
    .string()
    .describe(
      'A brief explanation for the eligibility determination, or an encouraging message if eligible.'
    ),
});
export type DonorEligibilityCheckOutput = z.infer<typeof DonorEligibilityCheckOutputSchema>;

export async function checkDonorEligibility(
  input: DonorEligibilityCheckInput
): Promise<DonorEligibilityCheckOutput> {
  return donorEligibilityCheckFlow(input);
}

const donorEligibilityCheckPrompt = ai.definePrompt({
  name: 'donorEligibilityCheckPrompt',
  input: {schema: DonorEligibilityCheckInputSchema},
  output: {schema: DonorEligibilityCheckOutputSchema},
  prompt: `You are an AI assistant specialized in providing preliminary information about blood donation eligibility. You will be given health-related questions from a potential donor. Your task is to provide a preliminary determination of their eligibility based on common guidelines. This is NOT a definitive medical assessment.

Here are the donor's answers:
Age: {{{age}}} years old
Weight: {{{weightLbs}}} lbs
Felt sick recently (last 7 days): {{{feltSickRecently}}}
Taking prescription medications: {{{takingMedications}}}
Received tattoo or piercing (last 4 months): {{{receivedTattooOrPiercing}}}
Traveled to malaria-risk area (last 3 years): {{{traveledToMalariaRiskArea}}}

Based on these answers, provide a preliminary determination of eligibility. If the donor is likely ineligible, provide a concise reason based on the provided information. If they are likely eligible, provide an encouraging message and remind them that a final determination requires a full medical screening at the donation center.

Common reasons for temporary deferral:
- Age under 16 or over 99.
- Weight under 110 lbs.
- Recent illness (cold, flu, fever) within 7 days.
- Recent tattoo or piercing within 4 months.
- Travel to malaria-risk area within 3 years.

Keep in mind that taking some medications may also lead to deferral, but without knowing the specific medication, you should only flag this as a potential issue if other factors are present or if you need more information.

Example Output (JSON):
{
  "isEligible": true,
  "reason": "Based on the information provided, you appear to meet the basic requirements. A full medical screening will be conducted at the donation center."
}

Example Output (JSON):
{
  "isEligible": false,
  "reason": "You have received a tattoo or piercing within the last 4 months, which typically requires a deferral period. Please check local guidelines for exact waiting times."
}`,
});

const donorEligibilityCheckFlow = ai.defineFlow(
  {
    name: 'donorEligibilityCheckFlow',
    inputSchema: DonorEligibilityCheckInputSchema,
    outputSchema: DonorEligibilityCheckOutputSchema,
  },
  async (input) => {
    const {output} = await donorEligibilityCheckPrompt(input);
    return output!;
  }
);
