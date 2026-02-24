'use server';
/**
 * @fileOverview A Genkit flow for correcting and standardizing Bangladesh district names.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { DISTRICTS } from '@/lib/bangladesh-data';

const LocationCorrectionInputSchema = z.object({
  rawLocations: z.array(z.string()).describe('A list of raw location or district names provided by the user.'),
});
export type LocationCorrectionInput = z.infer<typeof LocationCorrectionInputSchema>;

const LocationCorrectionOutputSchema = z.object({
  corrections: z.array(z.object({
    original: z.string(),
    corrected: z.string(),
    isChanged: z.boolean()
  })).describe('A list of corrections where raw input is mapped to standardized Bengali district names.'),
});
export type LocationCorrectionOutput = z.infer<typeof LocationCorrectionOutputSchema>;

export async function correctLocations(input: LocationCorrectionInput): Promise<LocationCorrectionOutput> {
  return locationCorrectionFlow(input);
}

const locationCorrectionPrompt = ai.definePrompt({
  name: 'locationCorrectionPrompt',
  input: {schema: LocationCorrectionInputSchema},
  output: {schema: LocationCorrectionOutputSchema},
  prompt: `You are a location data expert for Bangladesh. Your task is to take a list of raw district names and map them to the correct, standardized Bengali district names from the provided list.

Standard Districts List:
${DISTRICTS.join(', ')}

Instructions:
1. If the input is in English (e.g., "Dhaka"), convert it to the corresponding Bengali name ("ঢাকা").
2. If the input is misspelled (e.g., "Daka", "কুমিল্লাা"), correct it to the nearest valid district name.
3. If the input is already correct, keep it as is.
4. If you cannot identify the district, return it as "অজানা".

Input Locations:
{{#each rawLocations}}
- {{{this}}}
{{/each}}

Return the output as a JSON object containing an array of corrections with 'original', 'corrected', and 'isChanged' fields.`,
});

const locationCorrectionFlow = ai.defineFlow(
  {
    name: 'locationCorrectionFlow',
    inputSchema: LocationCorrectionInputSchema,
    outputSchema: LocationCorrectionOutputSchema,
  },
  async (input) => {
    const {output} = await locationCorrectionPrompt(input);
    return output!;
  }
);
