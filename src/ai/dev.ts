import { config } from 'dotenv';
config();

import '@/ai/flows/donor-eligibility-check-flow.ts';
import '@/ai/flows/fake-profile-detector-flow.ts';
import '@/ai/flows/urgent-notification-flow.ts';
import '@/ai/flows/location-correction-flow.ts';
