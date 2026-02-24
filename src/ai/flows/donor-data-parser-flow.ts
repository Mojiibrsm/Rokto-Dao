'use server';
/**
 * @fileOverview A Genkit flow for parsing raw, multi-format donor data into structured JSON.
 * Updated to translate Upazila/Area names to Bengali for better searchability.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { DISTRICTS } from '@/lib/bangladesh-data';

const DonorDataParserInputSchema = z.object({
  rawText: z.string().describe('The raw text containing one or more donor records in any format.'),
});
export type DonorDataParserInput = z.infer<typeof DonorDataParserInputSchema>;

const DonorDataParserOutputSchema = z.object({
  donors: z.array(z.object({
    fullName: z.string(),
    phone: z.string(),
    bloodType: z.string().describe('Standard format like A+, B-, etc.'),
    district: z.string().describe('Standardized Bengali district name.'),
    area: z.string().optional().describe('Upazila or PS area in Bengali.'),
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
  prompt: `You are an expert data entry assistant for Bangladesh. Your task is to extract donor information from the provided raw text and return it as a structured JSON array.

Standard Districts List (use these for the 'district' field):
${DISTRICTS.join(', ')}

Instructions:
1. Identify individual donor records. They might be in blocks, CSV, Tab-separated, or loose sentences.
2. For each donor, extract: Name, Phone, Blood Group, District, and Area/Upazila (often mentioned after 'PS').
3. **MANDATORY BENGALI CONVERSION**: Both 'district' and 'area' (Upazila) MUST be returned in Bengali script. 
   - Example: "Coxbazar" -> "কক্সবাজার", "Maheshkhali" -> "মহেশখালী", "Dhaka" -> "ঢাকা", "Mirpur" -> "মিরপুর".
4. Standardize Blood Groups: "B Positive" -> "B+", "O Negative" -> "O-", etc.
5. Standardize Districts: Map any English or misspelled district name to the correct Bengali name from the provided list.
6. For the 'area' field, extract the Upazila/Police Station (PS) name and translate it to its standard Bengali equivalent.
7. If a field is missing, use an empty string.
8. Ignore any text that is not a donor record.

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
