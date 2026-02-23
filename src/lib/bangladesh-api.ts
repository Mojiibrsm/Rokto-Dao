'use server';

/**
 * @fileOverview Server Actions to fetch Bangladesh administrative data from bangladesh.gov.bd API.
 */

export type LocationEntry = {
  id: string;
  bn_name: string;
  url: string;
};

async function fetchLocationData(parentId: string, type: 'District' | 'Upazilla' | 'Union'): Promise<LocationEntry[]> {
  try {
    const response = await fetch("https://bangladesh.gov.bd/child.domains.bangla.php", {
      method: "POST",
      headers: {
        "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
        "accept": "*/*",
      },
      body: `parent=${parentId}&domain_type=${type}`,
    });

    if (!response.ok) return [];
    
    const text = await response.text();
    if (!text) return [];

    try {
      return JSON.parse(text);
    } catch (e) {
      console.error(`Error parsing JSON for ${type}:`, e);
      return [];
    }
  } catch (error) {
    console.error(`Fetch error for ${type}:`, error);
    return [];
  }
}

/**
 * Fetch all Districts. Parent 36 is usually used as the root for Districts in this API.
 */
export async function getDistricts(): Promise<LocationEntry[]> {
  return fetchLocationData("36", "District");
}

/**
 * Fetch Upazillas for a specific District ID.
 */
export async function getUpazillas(districtId: string): Promise<LocationEntry[]> {
  if (!districtId) return [];
  return fetchLocationData(districtId, "Upazilla");
}

/**
 * Fetch Unions for a specific Upazilla ID.
 */
export async function getUnionsApi(upazillaId: string): Promise<LocationEntry[]> {
  if (!upazillaId) return [];
  return fetchLocationData(upazillaId, "Union");
}
