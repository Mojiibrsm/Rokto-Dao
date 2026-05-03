/**
 * @fileOverview বাংলাদেশের প্রধান ব্লাড ব্যাংক এবং হাসপাতালের পূর্ণাঙ্গ তালিকা।
 */

import { DISTRICT_COORDS } from './coordinates';

export type HospitalEntry = {
  name: string;
  lat: number;
  lng: number;
  district: string;
  upazila?: string;
  address?: string;
};

const getCoords = (dist: string): { lat: number; lng: number } => {
  const coords = DISTRICT_COORDS[dist] || [23.6850, 90.3563];
  return { lat: coords[0], lng: coords[1] };
};

export const HOSPITALS: HospitalEntry[] = [
  // Major Hospitals with Exact Coords
  { name: "ঢাকা মেডিকেল কলেজ হাসপাতাল", lat: 23.7258, lng: 90.3976, district: "ঢাকা", address: "Bakshi Bazar, Dhaka" },
  { name: "স্যার সলিমুল্লাহ মেডিকেল কলেজ ও মিটফোর্ড হাসপাতাল", lat: 23.7093, lng: 90.3958, district: "ঢাকা", address: "Mitford, Dhaka" },
  { name: "চট্টগ্রাম মেডিকেল কলেজ হাসপাতাল", lat: 22.3598, lng: 91.8285, district: "চট্টগ্রাম", address: "Panchlaish, Chattogram" },
  { name: "রাজশাহী মেডিকেল কলেজ হাসপাতাল", lat: 24.3701, lng: 88.5835, district: "রাজশাহী", address: "Rajpara, Rajshahi" },
  { name: "সিলেট এম এ জি ওসমানী মেডিকেল কলেজ হাসপাতাল", lat: 24.8988, lng: 91.8515, district: "সিলেট", address: "Sylhet Sadar" },
  { name: "রংপুর মেডিকেল কলেজ হাসপাতাল", lat: 25.7592, lng: 89.2405, district: "রংপুর", address: "Rangpur Sadar" },
  
  // Data from User Provided List (English names as provided)
  { name: "Bandhan Blood Bank and Transfusion Center", ...getCoords("ঢাকা"), district: "ঢাকা", upazila: "Chak Bazar", address: "19, Bakshi Bazar Road, Chak Bazar, Dhaka-121" },
  { name: "Medical Centre Blood Transfusion", ...getCoords("চট্টগ্রাম"), district: "চট্টগ্রাম", upazila: "Panchlaish", address: "953, O. R Nizam Road, Panchlaish, Cgattogram" },
  { name: "Ashiyan Medical College Hospital", ...getCoords("ঢাকা"), district: "ঢাকা", upazila: "Khilkhet", address: "Barua, Khilkhet, Dhaka - 1229" },
  { name: "BIHS General Hospital", ...getCoords("ঢাকা"), district: "ঢাকা", upazila: "Mirpur", address: "125/1, Darus Salam, Mirpur-1, Dhaka" },
  { name: "BRAHMANBARIA MEDICAL COLLEGE HOSPITAL LIMITED", ...getCoords("ব্রাহ্মণবাড়িয়া"), district: "ব্রাহ্মণবাড়িয়া", upazila: "Brahmanbaria Sadar", address: "Ghatura, Brahmanbaria." },
  { name: "OMEGA MEDICAL COMPLEX LIMITED", ...getCoords("ঢাকা"), district: "ঢাকা", upazila: "Turag", address: "Mokka Tower, Kamar Para, Turag, Dhaka." },
  { name: "SAVAR PRIME HOSPITAL", ...getCoords("ঢাকা"), district: "ঢাকা", upazila: "Savar", address: "A-89, Talbag, Savar, Dhaka" },
  { name: "KHULNA CITY MEDICAL COLLEGE HOSPITAL", ...getCoords("খুলনা"), district: "খুলনা", upazila: "Khulna Sadar", address: "25/26, KDA AVENUE, KHULNA" },
  { name: "Aalok Healthcare Ltd. (Blood Bank)", ...getCoords("ঢাকা"), district: "ঢাকা", upazila: "Mirpur", address: "Section-10, Mirpur, Dhaka-1216" },
  { name: "Accura Blood Bank & Transfusion Centre", ...getCoords("কক্সবাজার"), district: "কক্সবাজার", upazila: "COXS BAZAR SADAR", address: "Central Jame Masjid Road, Coxs Bazar" },
  { name: "Active Blood Bank", ...getCoords("ঢাকা"), district: "ঢাকা", upazila: "Chak Bazar", address: "85/A-B, Hosni Dalan Road, Chankherpool, Dhaka" },
  { name: "Ad-din Barrister Rafique-ul-Huq Hospital", ...getCoords("ঢাকা"), district: "ঢাকা", upazila: "Shyampur", address: "23/1,Jurain, Postogola Dhaka-1204" },
  { name: "Ad-din womens medical college hospital", ...getCoords("ঢাকা"), district: "ঢাকা", upazila: "Shahbagh", address: "2, Baro Moghbazar, Dhaka-1217" },
  { name: "ADARSHA DEAGNOSTIC CENTER & BLOOD BANK", ...getCoords("পঞ্চগড়"), district: "পঞ্চগড়", upazila: "Panchagarh Sadar", address: "Mithapukur,Tetulia Road, Panchagarh" },
  { name: "AHSANIA MISSION CANCER & GENERAL HOSPITAL", ...getCoords("ঢাকা"), district: "ঢাকা", upazila: "Uttara Paschim", address: "Sector#10, Uttara Model Town, Dhaka-1230" },
  { name: "Aichi Hospital Ltd.", ...getCoords("ঢাকা"), district: "ঢাকা", upazila: "Uttara Purba", address: "Plot No: 35 & 37, Sector 8, Uttara, Dhaka" },
  { name: "Akij Medical College Hospital", ...getCoords("খুলনা"), district: "খুলনা", upazila: "Khulna Sadar", address: "Boyra Khulna" },
  { name: "Al Haramain Hospital Private Ltd.", ...getCoords("সিলেট"), district: "সিলেট", upazila: "Sylhet Sadar", address: "Subhani Ghat, kotwali, Sylhet" },
  { name: "Al-Helal Specialized Hospital Limited", ...getCoords("ঢাকা"), district: "ঢাকা", upazila: "Kafrul", address: "Mirpur-10, Dhaka-1216" },
  { name: "Al-Manar Hospital Ltd.", ...getCoords("ঢাকা"), district: "ঢাকা", upazila: "Mohammadpur", address: "Satmasjid Road, Lalmatia, Dhaka" },
  { name: "Alif Blood Bank", ...getCoords("ঢাকা"), district: "ঢাকা", upazila: "Dhanmondi", address: "44, Shiekh Rasel Squar, Dhaka" },
  { name: "AMZ Hospital LTD", ...getCoords("ঢাকা"), district: "ঢাকা", upazila: "Badda", address: "Pragati Sarani, North Badda, Dhaka-1212" },
  { name: "Anwara Blood Transfusion", ...getCoords("চট্টগ্রাম"), district: "চট্টগ্রাম", upazila: "Anowara", address: "Kala Bibi Dighir Mor, Anowara, Chittagong." },
  { name: "Anwer Khan Modern Blood Bank", ...getCoords("ঢাকা"), district: "ঢাকা", upazila: "Kalabagan", address: "Road No:8, Dhanmondi, Dhaka-1205." },
  { name: "ASGAR ALI HOSPITAL", ...getCoords("ঢাকা"), district: "ঢাকা", upazila: "Gendaria", address: "Gandaria, Dhaka-1204" },
  { name: "ASIYA BLOOD BANK", ...getCoords("নাটোর"), district: "নাটোর", upazila: "Baraigram", address: "Bonpara Mission Market, Natote" },
  { name: "BANDHAN BLOOD BANK O SANCHALAN KENDRO", ...getCoords("ঠাকুরগাঁও"), district: "ঠাকুরগাঁও", upazila: "Thakurgaon Sadar", address: "Hazipara, Thakurgaon" },
  { name: "Bangladesh Specialized Hospital Ltd.", ...getCoords("ঢাকা"), district: "ঢাকা", upazila: "Adabor", address: "21 Shyamoli, Mirpur Road, Dhaka" },
  { name: "Barind Medical Collge Hospital", ...getCoords("রাজশাহী"), district: "রাজশাহী", upazila: "Boalia", address: "Choto Bongram, Rajshahi-6207" },
  { name: "Barisal Blood Bank", ...getCoords("বরিশাল"), district: "বরিশাল", upazila: "Barishal Sadar", address: "South Alekanda, Barisal" },
  { name: "Better Life Hospital Ltd.", ...getCoords("ঢাকা"), district: "ঢাকা", upazila: "Rampura", address: "01 East Rampura, Dhaka - 1219" },
  { name: "Blood Transfusion Department, Prime Medical College", ...getCoords("রংপুর"), district: "রংপুর", upazila: "Rangpur Sadar", address: "Badargonj Road, Rangpur" },
  { name: "BOGURA ROKTO PORISONCHALON KENDRO", ...getCoords("বগুড়া"), district: "বগুড়া", upazila: "Bogra Sadar", address: "Sutrapur, Bogura." },
  { name: "BROTI BLOOD BANK & LAB", ...getCoords("টাঙ্গাইল"), district: "টাঙ্গাইল", upazila: "Tangail Sadar", address: "MYMENSING ROAD, TANGAIL" },
  { name: "BURO Health Care Foundation", ...getCoords("টাঙ্গাইল"), district: "টাঙ্গাইল", upazila: "Tangail Sadar", address: "Registri Para,Tangail" },
  { name: "Central Hospital Ltd", ...getCoords("ঢাকা"), district: "ঢাকা", upazila: "Dhanmondi", address: "Road No. 5, Dhanmondi, Dhaka" },
  { name: "Chapai Blood Bank", ...getCoords("চাঁপাইনবাবগঞ্জ"), district: "চাঁপাইনবাবগঞ্জ", upazila: "Chapai Nababganj Sadar", address: "Hospital Road, Chapainawabganj" },
  { name: "Chattogram Maa-Shishu O General Hospital", ...getCoords("চট্টগ্রাম"), district: "চট্টগ্রাম", upazila: "Double Mooring", address: "Agrabad, Chattogram" },
  { name: "City Blood Bank", ...getCoords("কুমিল্লা"), district: "কুমিল্লা", upazila: "Cumilla Adarsha Sadar", address: "Badurtala, Comilla." },
  { name: "City Medical College & Hospital", ...getCoords("গাজীপুর"), district: "গাজীপুর", upazila: "Gazipur Sadar", address: "Chandana Chowrasta, Gazipur-1702" },
  { name: "Community Based Medical College", ...getCoords("ময়মনসিংহ"), district: "ময়মনসিংহ", upazila: "Mymensingh Sadar", address: "Winner Per, Mymensingh." },
  { name: "Delta Health Care", ...getCoords("ঢাকা"), district: "ঢাকা", upazila: "Shyampur", address: "West Dholaipar, Dhaka-1204." },
  { name: "DIABETIC ASSOCIATION MEDICAL COLLEGE", ...getCoords("ফরিদপুর"), district: "ফরিদপুর", upazila: "Faridpur Sadar", address: "Jheeltuli, Faridpur" },
  { name: "Digital Blood Bank", ...getCoords("টাঙ্গাইল"), district: "টাঙ্গাইল", upazila: "Tangail Sadar", address: "Kodalia,Tangail" },
  { name: "Dinajpur Blood Bank", ...getCoords("দিনাজপুর"), district: "দিনাজপুর", upazila: "Dinajpur Sadar", address: "Nimnogor, Dinajpur." },
  { name: "DMFR Molecular Lab", ...getCoords("ঢাকা"), district: "ঢাকা", upazila: "Sher-e-bangla Nagar", address: "Sobhanbag, Mirpur Road, Dhaka" },
  { name: "Dr. Azmal Hospital Ltd.", ...getCoords("ঢাকা"), district: "ঢাকা", upazila: "Mirpur", address: "Section -6, Mirpur, Dhaka-1216" },
  { name: "Dr. Sirajul Islam Medical College", ...getCoords("ঢাকা"), district: "ঢাকা", upazila: "Khilgaon", address: "Malibagh, Dhaka-1217" },
  { name: "Eastern Medical College Hospital", ...getCoords("কুমিল্লা"), district: "কুমিল্লা", upazila: "Burichang", address: "Kabila, Comilla." },
  { name: "Enam Medical Hospital (Pvt.) Ltd.", ...getCoords("ঢাকা"), district: "ঢাকা", upazila: "Savar", address: "Thana Road, Savar, Dhaka-1340" },
  { name: "Evercare Hospital Chattogram", ...getCoords("চট্টগ্রাম"), district: "চট্টগ্রাম", upazila: "Hathazari", address: "Ananna Residential Area, Chattogram" },
  { name: "Evercare Hospital Dhaka", ...getCoords("ঢাকা"), district: "ঢাকা", upazila: "Bhatara", address: "Bashundhara R/A, Dhaka-1229" },
  { name: "Farazy Hospital Ltd", ...getCoords("ঢাকা"), district: "ঢাকা", upazila: "Rampura", address: "Block-E, Rampura, Dhaka-1219" },
  { name: "Fatikchhari blood bank", ...getCoords("চট্টগ্রাম"), district: "চট্টগ্রাম", upazila: "Fatikchari", address: "Fatikchhari,Chattogram" },
  { name: "Gonoshasthaya blood bank", ...getCoords("ঢাকা"), district: "ঢাকা", upazila: "Savar", address: "asulia,savar,dhaka" },
  { name: "Green Life Hospital Ltd", ...getCoords("ঢাকা"), district: "ঢাকা", upazila: "Kalabagan", address: "Dhanmondi, Dhaka-1205" },
  { name: "Hi-Care General Hospital Ltd.", ...getCoords("ঢাকা"), district: "ঢাকা", upazila: "Uttara Paschim", address: "Sector# 7, Uttara, Dhaka-1230." },
  { name: "Holy Crescent Blood Bank", ...getCoords("যশোর"), district: "যশোর", upazila: "Jashore Sadar", address: "Jail Road, Sadar, Jashore." },
  { name: "Ibn Sina Hospital Sylhet", ...getCoords("সিলেট"), district: "সিলেট", upazila: "Sylhet Sadar", address: "Subhanighat Point, Sylhet." },
  { name: "Imperial Hospital Limited", ...getCoords("চট্টগ্রাম"), district: "চট্টগ্রাম", upazila: "Pahartali", address: "Zakir Hossain Road, Chittagong" },
  { name: "International Medical College", ...getCoords("গাজীপুর"), district: "গাজীপুর", upazila: "Gazipur Sadar", address: "Tongi, Gazipur" },
  { name: "ISHWARDI BLOOD BANK", ...getCoords("পাবনা"), district: "পাবনা", upazila: "Ishwardi", address: "Akborermor, Ishwardi, Pabna" },
  { name: "ISLAMI BANK CENTRAL HOSPITAL", ...getCoords("ঢাকা"), district: "ঢাকা", upazila: "Paltan", address: "Kakrail, Dhaka" },
  { name: "JAHURUL ISLAM MEDICAL COLLEGE", ...getCoords("কিশোরগঞ্জ"), district: "কিশোরগঞ্জ", upazila: "Bajitpur", address: "Bhagalpur, Bajitpur, Kishoregonj." },
  { name: "Jalalabad Ragib-Rabeya Medical College", ...getCoords("সিলেট"), district: "সিলেট", upazila: "Sylhet Sadar", address: "Pathantula, Sylhet" },
  { name: "Khidmah Hospital (Pvt) Ltd.", ...getCoords("ঢাকা"), district: "ঢাকা", upazila: "Khilgaon", address: "Khilgaon Biswa Road,Dhaka" },
  { name: "Khwaja Yunus Ali Medical College", ...getCoords("সিরাজগঞ্জ"), district: "সিরাজগঞ্জ", upazila: "Chauhali", address: "Enayetpur, Sirajganj" },
  { name: "Kumudini Hospital Blood Bank", ...getCoords("টাঙ্গাইল"), district: "টাঙ্গাইল", upazila: "Mirzapur", address: "Mirzapur, Tangail" },
  { name: "KUSHTIA BLOOD BANK", ...getCoords("কুষ্টিয়া"), district: "কুষ্টিয়া", upazila: "Kushtia Sadar", address: "Courtpara, Kushtia" },
  { name: "LAB ONE BLOOD BANK", ...getCoords("ঢাকা"), district: "ঢাকা", upazila: "Uttara Paschim", address: "Sector-14, Uttara, Dhaka-1230" },
  { name: "Labaid Cancer Hospital", ...getCoords("ঢাকা"), district: "ঢাকা", upazila: "Dhanmondi", address: "26, Green road, Dhaka-1205" },
  { name: "Life Save Blood Bank", ...getCoords("চট্টগ্রাম"), district: "চট্টগ্রাম", upazila: "Panchlaish", address: "O.R. NIZAM ROAD, CHITTAGONG" },
  { name: "Lions Blood Bank", ...getCoords("ঢাকা"), district: "ঢাকা", upazila: "Sher-e-bangla Nagar", address: "Agargaon, Dhaka" },
  { name: "M A RASHID HOSPITAL", ...getCoords("জামালপুর"), district: "জামালপুর", upazila: "Jamalpur Sadar", address: "1072 Sardar Para, Jamalpur" },
  { name: "Manikganj Sandhani", ...getCoords("মানিকগঞ্জ"), district: "মানিকগঞ্জ", upazila: "Manikganj Sadar", address: "North Sewta, Manikganj-1800" },
  { name: "Monno Medical College Hospital", ...getCoords("মানিকগঞ্জ"), district: "মানিকগঞ্জ", upazila: "Manikganj Sadar", address: "Monno City, Manikganj" },
  { name: "Mount Adora Hospital", ...getCoords("সিলেট"), district: "সিলেট", upazila: "Sylhet Sadar", address: "Akhalia, Sylhet." },
  { name: "NAOGAON BLOOD BANK", ...getCoords("নওগাঁ"), district: "নওগাঁ", upazila: "Naogaon Sadar", address: "Sadar Hospital Gate, Naogaon" },
  { name: "Narayanganj Blood Bank", ...getCoords("নারায়ণগঞ্জ"), district: "নারায়ণগঞ্জ", upazila: "Narayanganj Sadar", address: "Chashara, Narayanganj" },
  { name: "NATIONAL BLOOD BANK COMILLA", ...getCoords("কুমিল্লা"), district: "কুমিল্লা", upazila: "Cumilla Adarsha Sadar", address: "Laksam Road, Cumilla" },
  { name: "National Heart Foundation", ...getCoords("ঢাকা"), district: "ঢাকা", upazila: "Mirpur", address: "Mirpur, Dhaka-1216" },
  { name: "NATORE BLOOD BANK", ...getCoords("নাটোর"), district: "নাটোর", upazila: "Natore Sadar", address: "Dhaka Road, Natore." },
  { name: "Noakhali Blood Bank", ...getCoords("নোয়াখালী"), district: "নোয়াখালী", upazila: "Noakhali Sadar", address: "Maijdee, Noakhali" },
  { name: "Pabna Blood Bank", ...getCoords("পাবনা"), district: "পাবনা", upazila: "Pabna Sadar", address: "Shalgaria, Pabna" },
  { name: "PARKVIEW HOSPITAL", ...getCoords("চট্টগ্রাম"), district: "চট্টগ্রাম", upazila: "Panchlaish", address: "KATALGONJ ROAD, CHITTAGONG" },
  { name: "Prime Blood Bank Naogaon", ...getCoords("নওগাঁ"), district: "নওগাঁ", upazila: "Naogaon Sadar", address: "Sadar Hospital Road, Nagaon" },
  { name: "SAFE BLOOD BANK THAKURGAON", ...getCoords("ঠাকুরগাঁও"), district: "ঠাকুরগাঁও", upazila: "Thakurgaon Sadar", address: "Hallpara, Thakurgaon" },
  { name: "Samorita Hospital Ltd.", ...getCoords("ঢাকা"), district: "ঢাকা", upazila: "Sher-e-bangla Nagar", address: "Panthapath, Dhaka-1215" },
  { name: "Sirajgonj Community Hospital", ...getCoords("সিরাজগঞ্জ"), district: "সিরাজগঞ্জ", upazila: "Sirajganj Sadar", address: "Mujib Sarak, Sirajganj" },
  { name: "SQUARE HOSPITALS LIMITED", ...getCoords("ঢাকা"), district: "ঢাকা", upazila: "Sher-e-bangla Nagar", address: "West Panthapath, Dhaka-1205" },
  { name: "TANGAIL BLOOD BANK", ...getCoords("টাঙ্গাইল"), district: "টাঙ্গাইল", upazila: "Tangail Sadar", address: "Sabalia, Tangail." },
  { name: "United Hospital Limited", ...getCoords("ঢাকা"), district: "ঢাকা", upazila: "Gulshan", address: "Gulshan-2, Dhaka-1212" },
  { name: "Uttara Adhunik Medical College", ...getCoords("ঢাকা"), district: "ঢাকা", upazila: "Uttara Paschim", address: "Sector 9, Uttara, Dhaka" }
];
