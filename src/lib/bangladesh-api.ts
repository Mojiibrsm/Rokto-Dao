'use server';

/**
 * @fileOverview Server Actions to fetch Bangladesh administrative data from bangladesh.gov.bd API.
 * Includes a fallback mechanism to static data if the API is unreachable.
 */

import { BANGLADESH_DATA, DISTRICTS } from './bangladesh-data';

export type LocationEntry = {
  id: string;
  bn_name: string;
  url: string;
};

// Static Fallback Data
const fallbackDistricts: LocationEntry[] = DISTRICTS.map((d, i) => ({
  id: `static-d-${i}`,
  bn_name: d,
  url: '#'
}));

async function fetchLocationData(parentId: string, type: 'District' | 'Upazilla' | 'Union'): Promise<LocationEntry[]> {
  try {
    const response = await fetch("https://bangladesh.gov.bd/child.domains.bangla.php", {
      method: "POST",
      headers: {
        "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
        "accept": "*/*",
        "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
      body: `parent=${parentId}&domain_type=${type}`,
      next: { revalidate: 3600 } // Cache for 1 hour
    });

    if (!response.ok) throw new Error('API Response not OK');
    
    const text = await response.text();
    if (!text || text.trim() === "") return [];

    try {
      const data = JSON.parse(text);
      return Array.isArray(data) ? data : [];
    } catch (e) {
      console.error(`Error parsing JSON for ${type}:`, e);
      return [];
    }
  } catch (error) {
    console.error(`Fetch error for ${type}:`, error);
    return []; // Return empty to trigger local fallback in the UI or here
  }
}

/**
 * Fetch all Districts.
 */
export async function getDistricts(): Promise<LocationEntry[]> {
  const data = await fetchLocationData("36", "District");
  return data.length > 0 ? data : fallbackDistricts;
}

/**
 * Fetch Upazillas for a specific District ID.
 */
export async function getUpazillas(districtId: string): Promise<LocationEntry[]> {
  if (!districtId) return [];
  
  // Check if it's a static ID
  if (districtId.startsWith('static-d-')) {
    const districtIndex = parseInt(districtId.split('-').pop() || '0');
    const districtName = DISTRICTS[districtIndex];
    const upazilas = BANGLADESH_DATA[districtName]?.upazilas || [];
    return upazilas.map((u, i) => ({
      id: `static-u-${i}`,
      bn_name: u,
      url: '#'
    }));
  }

  const data = await fetchLocationData(districtId, "Upazilla");
  return data;
}

/**
 * Fetch Unions for a specific Upazilla ID.
 */
export async function getUnionsApi(upazillaId: string): Promise<LocationEntry[]> {
  if (!upazillaId) return [];
  
  // Fallback for static upazilas
  if (upazillaId.startsWith('static-u-')) {
    return [
      { id: 's-un-1', bn_name: 'ইউনিয়ন ১', url: '#' },
      { id: 's-un-2', bn_name: 'ইউনিয়ন ২', url: '#' },
      { id: 's-un-3', bn_name: 'ইউনিয়ন ৩', url: '#' },
    ];
  }

  const data = await fetchLocationData(upazillaId, "Union");
  return data;
}
