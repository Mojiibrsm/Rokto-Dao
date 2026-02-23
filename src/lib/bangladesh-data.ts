/**
 * @fileOverview Data source for Bangladesh administrative divisions.
 * Focuses on Districts and Upazilas. Unions are typically handled as text or 
 * filtered subsets due to high volume.
 */

export const BANGLADESH_DIVISIONS = [
  "Dhaka", "Chittagong", "Rajshahi", "Khulna", "Barisal", "Sylhet", "Rangpur", "Mymensingh"
];

export const BANGLADESH_DATA: Record<string, { upazilas: string[] }> = {
  "Dhaka": {
    upazilas: ["Dhamrai", "Dohar", "Keraniganj", "Nawabganj", "Savar", "Tejgaon", "Mirpur", "Gulshan", "Uttara"]
  },
  "Chittagong": {
    upazilas: ["Anwara", "Banshkhali", "Boalkhali", "Chandanaish", "Fatikchhari", "Hathazari", "Lohagara", "Mirsharai", "Patiya", "Rangunia", "Raozan", "Sandwip", "Satkania", "Sitakunda"]
  },
  "Sylhet": {
    upazilas: ["Balaganj", "Beanibazar", "Bishwanath", "Companiganj", "Fenchuganj", "Golapganj", "Gowainghat", "Jaintiapur", "Kanaighat", "Osmani Nagar", "South Surma", "Sylhet Sadar", "Zakiganj"]
  },
  "Rajshahi": {
    upazilas: ["Bagha", "Bagmara", "Charghat", "Durgapur", "Godagari", "Mohanpur", "Paba", "Puthia", "Tanore"]
  },
  "Khulna": {
    upazilas: ["Batiaghata", "Dacope", "Dumuria", "Dighalia", "Koyra", "Paikgachha", "Phultala", "Rupsha", "Terokhada"]
  },
  "Barisal": {
    upazilas: ["Agailjhara", "Babuganj", "Bakerganj", "Banaripara", "Gaurnadi", "Hizla", "Mehendiganj", "Muladi", "Wazirpur"]
  },
  "Rangpur": {
    upazilas: ["Badarganj", "Gangachara", "Kaunia", "Rangpur Sadar", "Mithapukur", "Pirgachha", "Pirganj", "Taraganj"]
  },
  "Mymensingh": {
    upazilas: ["Bhaluka", "Dhobaura", "Fulbaria", "Gaffargaon", "Gauripur", "Haluaghat", "Ishwarganj", "Mymensingh Sadar", "Muktagachha", "Nandail", "Phulpur", "Trishal"]
  },
  "Shariatpur": {
     upazilas: ["Bhedarganj", "Damudya", "Gosairhat", "Naria", "Shariatpur Sadar", "Zajira"]
  },
  "Cox's Bazar": {
     upazilas: ["Chakaria", "Cox's Bazar Sadar", "Kutubdia", "Maheshkhali", "Ramu", "Teknaf", "Ukhia", "Pekua"]
  }
};

// Simplified dynamic Union provider (usually these are fetched via API or text input)
export const getUnions = (upazila: string) => {
  // Mocking union list based on upazila for demonstration
  return [`${upazila} Union 1`, `${upazila} Union 2`, `${upazila} Union 3`, `${upazila} Pourashava`].sort();
};

export const DISTRICTS = Object.keys(BANGLADESH_DATA).sort();
