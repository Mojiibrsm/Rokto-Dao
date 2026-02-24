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
  additionalNotes: z
    .string()
    .optional()
    .describe('Any additional health information, chronic diseases, or notes provided by the user.'),
});
export type DonorEligibilityCheckInput = z.infer<typeof DonorEligibilityCheckInputSchema>;

const DonorEligibilityCheckOutputSchema = z.object({
  isEligible: z
    .boolean()
    .describe('A preliminary determination of whether the donor is eligible to donate blood.'),
  reason: z
    .string()
    .describe(
      'A brief explanation for the eligibility determination in Bengali.'
    ),
  suggestions: z
    .array(z.string())
    .describe('A list of 2-4 actionable suggestions in Bengali based on the user\'s input.'),
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
  prompt: `আপনি একজন বিশেষজ্ঞ ডাক্তার এবং রক্তদান বিশেষজ্ঞ। আপনি একজন সম্ভাব্য রক্তদাতার তথ্যাবলি বিশ্লেষণ করে সিদ্ধান্ত দেবেন যে তিনি রক্তদান করতে পারবেন কি না।

**গুরুত্বপূর্ণ:** আপনার উত্তর অবশ্যই সম্পূর্ণ বাংলায় হতে হবে।

এখানে দাতার তথ্য দেওয়া হলো:
- বয়স: {{{age}}} বছর
- ওজন: {{{weightLbs}}} পাউন্ড (১১০ পাউন্ডের নিচে হলে সাধারণত অযোগ্য)
- সম্প্রতি অসুস্থ (গত ৭ দিন): {{#if feltSickRecently}}হ্যাঁ{{else}}না{{/if}}
- নিয়মিত ওষুধ সেবন করছেন: {{#if takingMedications}}হ্যাঁ{{else}}না{{/if}}
- ট্যাটু বা পিয়ার্সিং করেছেন (গত ৪ মাস): {{#if receivedTattooOrPiercing}}হ্যাঁ{{else}}না{{/if}}
- ম্যালেরিয়া প্রবণ এলাকায় ভ্রমণ (গত ৩ বছর): {{#if traveledToMalariaRiskArea}}হ্যাঁ{{else}}না{{/if}}
- অতিরিক্ত তথ্য/রোগের বিবরণ: {{{additionalNotes}}}

আপনার কাজ:
১. রক্তদানের যোগ্যতা যাচাই করা।
২. "reason" ফিল্ডে বাংলায় একটি বিস্তারিত কারণ বা উৎসাহমূলক বার্তা দেওয়া।
৩. "suggestions" ফিল্ডে ২-৪টি কার্যকর পরামর্শ দেওয়া (যেমন: প্রচুর পানি পান করা, বিশ্রাম নেওয়া, বা কতদিন অপেক্ষা করতে হবে)।

যদি ব্যবহারকারী কোনো জটিল রোগের কথা উল্লেখ করেন (যেমন: হেপাটাইটিস, এইডস, ক্যান্সার), তবে সরাসরি অযোগ্য ঘোষণা করুন এবং ডাক্তারের পরামর্শ নিতে বলুন।

উদাহরণ আউটপুট:
{
  "isEligible": true,
  "reason": "আপনার দেওয়া তথ্য অনুযায়ী আপনি প্রাথমিকভবে রক্তদানের যোগ্য। আপনার স্বাস্থ্যের অবস্থা ভালো মনে হচ্ছে।",
  "suggestions": [
    "রক্তদানের পূর্বে অন্তত ২ গ্লাস পানি পান করুন।",
    "রক্তদানের আগের রাতে ভালো ঘুম নিশ্চিত করুন।",
    "রক্তদানের পর ১০-১৫ মিনিট বিশ্রাম নিন।"
  ]
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
