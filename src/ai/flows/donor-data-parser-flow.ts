'use server';
/**
 * @fileOverview A Genkit flow for parsing raw, multi-format donor data into structured JSON.
 * Specifically optimized for Excel/Spreadsheet copy-pasted data.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { DISTRICTS } from '@/lib/bangladesh-data';

const DonorDataParserInputSchema = z.object({
  rawText: z.string().describe('The raw text containing one or more donor records, often copied from Excel.'),
});
export type DonorDataParserInput = z.infer<typeof DonorDataParserInputSchema>;

const DonorDataParserOutputSchema = z.object({
  donors: z.array(z.object({
    email: z.string().optional(),
    fullName: z.string(),
    phone: z.string(),
    bloodType: z.string().describe('Standard format like A+, B-, etc.'),
    registrationDate: z.string().optional().describe('ISO format or readable date.'),
    district: z.string().describe('Standardized Bengali district name.'),
    area: z.string().optional().describe('Upazila or area in Bengali.'),
    lastDonationDate: z.string().optional().describe('Last date the donor gave blood.'),
    totalDonations: z.number().optional().default(0),
    organization: z.string().optional().describe('Name of the blood donation organization or team.'),
    password: z.string().optional(),
  })),
});
export type DonorDataParserOutput = z.infer<typeof DonorDataParserOutputSchema>;

export async function parseDonorData(input: DonorDataParserInput): Promise<DonorDataParserOutput> {
  return donorDataParserFlow(input);
}

const donorDataParserPrompt = ai.definePrompt({
  name: 'donorDataParserPrompt',
  input: {schema: DonorDataParserInputSchema},
  output: {schema: DonorDataParserOutputSchema},
  prompt: `You are an expert data entry assistant for RoktoDao. Your task is to extract donor information from the provided raw text (often copied from Excel/Spreadsheets) and return it as structured JSON.

Standard Districts List:
${DISTRICTS.join(', ')}

Excel Columns provided by user:
Email, Full Name, Phone, Blood Type, Registration Date, District, Area, Last Donation Date, Total Donations, Organization, Password

Instructions:
1. Identify individual donor records. Handle Tab-separated or Space-separated data from Excel.
2. For each donor, extract ALL available fields.
3. **MANDATORY BENGALI CONVERSION**: Both 'district' and 'area' (Upazila) MUST be returned in Bengali script. 
4. Standardize Blood Groups: "B Positive" -> "B+", "O Negative" -> "O-", etc.
5. Standardize Districts: Map any English or misspelled district name to the correct Bengali name from the list.
6. For 'registrationDate' and 'lastDonationDate', if they look like dates, return them in a readable format.
7. For 'totalDonations', ensure it is a number.
8. If 'email' is missing, do not invent one.
9. If a field is missing, use null or empty string.

Input Text:
{{{rawText}}}

Return the output as a JSON object with a 'donors' key containing the array of objects.`,
});

const donorDataParserFlow = ai.defineFlow(
  {
    name: 'donorDataParserFlow',
    inputSchema: DonorDataParserInputSchema,
    outputSchema: DonorDataParserOutputSchema,
  },
  async (input) => {
    const {output} = await donorDataParserPrompt(input);
    return output!;
  }
);
