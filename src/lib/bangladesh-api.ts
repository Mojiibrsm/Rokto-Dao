/**
 * @fileOverview Helper functions to access Bangladesh administrative data locally.
 * Removed external API dependencies to ensure reliability and speed.
 */

import { BANGLADESH_DATA, DISTRICTS } from './bangladesh-data';

export type LocationEntry = {
  id: string;
  bn_name: string;
  url: string;
};

/**
 * Get all Districts.
 */
export async function getDistricts(): Promise<LocationEntry[]> {
  return DISTRICTS.map(district => ({
    id: district,
    bn_name: district,
    url: '#'
  }));
}

/**
 * Get Upazillas for a specific District.
 */
export async function getUpazillas(districtName: string): Promise<LocationEntry[]> {
  if (!districtName || !BANGLADESH_DATA[districtName]) return [];
  
  const upazilas = Object.keys(BANGLADESH_DATA[districtName]);
  return upazilas.map(upazila => ({
    id: upazila,
    bn_name: upazila,
    url: '#'
  }));
}

/**
 * Get Unions for a specific Upazilla within a District.
 */
export async function getUnionsApi(upazilaName: string, districtName: string): Promise<LocationEntry[]> {
  if (!districtName || !upazilaName || !BANGLADESH_DATA[districtName]?.[upazilaName]) return [];
  
  const unions = BANGLADESH_DATA[districtName][upazilaName];
  return unions.map(union => ({
    id: union,
    bn_name: union,
    url: '#'
  }));
}
