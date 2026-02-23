
'use server';

/**
 * @fileOverview Service to fetch hospital/facility data from DGHS server.
 * Uses the specific endpoints provided by the user.
 */

const DIVISION_MAP: Record<string, string> = {
  "বরিশাল": "1", "চট্টগ্রাম": "2", "ঢাকা": "3", "খুলনা": "4",
  "ময়মনসিংহ": "5", "রাজশাহী": "6", "রংপুর": "7", "সিলেট": "8"
};

// Map of common districts to their DGHS IDs (Sample mapping based on provided data)
const DISTRICT_ID_MAP: Record<string, string> = {
  "কক্সবাজার": "23",
  "ঢাকা": "13",
  "চট্টগ্রাম": "10",
  "কুমিল্লা": "11",
  "সিলেট": "60",
  "খুলনা": "27",
  "রাজশাহী": "51",
  "রংপুর": "55",
  "বরিশাল": "2",
  "ময়মনসিংহ": "41"
};

/**
 * Fetch hospitals from DGHS Server side script.
 * @param district Name of the district
 * @param division Name of the division (needed for the API)
 */
export async function getDynamicHospitals(district: string, division?: string): Promise<string[]> {
  const districtId = DISTRICT_ID_MAP[district];
  const divisionId = division ? DIVISION_MAP[division] : "2"; // Default to 2 (Chittagong) if unknown

  if (!districtId) return [];

  try {
    const url = `http://103.247.238.81/hsmdghs/registration/server_side.php?type=43&division=${divisionId}&district=${districtId}&user_type=public`;
    
    // Constructing the specific DataTable payload required by the server
    const body = new URLSearchParams();
    body.append('draw', '1');
    body.append('start', '0');
    body.append('length', '100'); // Fetch up to 100 hospitals
    body.append('search[value]', '');
    body.append('search[regex]', 'false');

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'Accept': 'application/json, text/javascript, */*; q=0.01',
        'X-Requested-With': 'XMLHttpRequest'
      },
      body: body.toString()
    });

    if (!response.ok) return [];

    const data = await response.json();
    
    // The DGHS server typically returns data in a 'data' array where index 1 or 2 is the name
    if (data && data.data && Array.isArray(data.data)) {
      return data.data.map((row: any[]) => {
        // Based on standard DGHS table structure, column 1 or 2 contains the name
        // Strip HTML if any (sometimes names are links)
        const rawName = row[1] || row[2] || '';
        return rawName.replace(/<[^>]*>?/gm, '').trim();
      }).filter(name => name.length > 0);
    }

    return [];
  } catch (error) {
    console.error("Error fetching dynamic hospitals:", error);
    return [];
  }
}
