/**
 * @fileOverview Blood Donor Matching Algorithm for RoktoDao.
 * Uses medical compatibility rules and geo-distance to rank donors.
 */

import { type Donor, type BloodRequest } from './sheets';
import { DISTRICT_COORDS } from './coordinates';

// Medical Compatibility Matrix: Donor -> Recipients
const GIVING_COMPATIBILITY: Record<string, string[]> = {
  'O-': ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
  'O+': ['O+', 'A+', 'B+', 'AB+'],
  'A-': ['A-', 'A+', 'AB-', 'AB+'],
  'A+': ['A+', 'AB+'],
  'B-': ['B-', 'B+', 'AB-', 'AB+'],
  'B+': ['B+', 'AB+'],
  'AB-': ['AB-', 'AB+'],
  'AB+': ['AB+']
};

// Medical Compatibility Matrix: Patient -> Possible Donors
const RECEIVING_COMPATIBILITY: Record<string, string[]> = {
  'A+': ['A+', 'A-', 'O+', 'O-'],
  'A-': ['A-', 'O-'],
  'B+': ['B+', 'B-', 'O+', 'O-'],
  'B-': ['B-', 'O-'],
  'O+': ['O+', 'O-'],
  'O-': ['O-'],
  'AB+': ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
  'AB-': ['A-', 'B-', 'AB-', 'O-']
};

/**
 * Haversine formula to calculate distance between two points in KM.
 */
function getDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export type MatchResult = {
  donor: Donor;
  score: number;
  distanceKm: number;
  matchReason: string;
};

/**
 * Finds best matching donors for a specific blood request.
 */
export function findMatchingDonors(request: BloodRequest, donors: Donor[]): MatchResult[] {
  const patientType = request.bloodType;
  const compatibleDonors = RECEIVING_COMPATIBILITY[patientType] || [];
  
  const reqLat = DISTRICT_COORDS[request.district]?.[0] || 23.8103;
  const reqLng = DISTRICT_COORDS[request.district]?.[1] || 90.4125;

  return donors
    .map(donor => {
      // 1. Compatibility Check
      if (!compatibleDonors.includes(donor.bloodType)) return null;

      // 2. Distance Calculation
      const dLat = donor.lat || DISTRICT_COORDS[donor.district || '']?.[0] || reqLat;
      const dLng = donor.lng || DISTRICT_COORDS[donor.district || '']?.[1] || reqLng;
      const dist = getDistance(reqLat, reqLng, dLat, dLng);

      // 3. Scoring
      let score = 100;
      
      // Exact blood match bonus
      if (donor.bloodType === patientType) score += 50;
      
      // Distance penalty
      score -= Math.min(dist * 2, 80); 
      
      // Availability bonus
      if (donor.status === 'Available') score += 20;

      return {
        donor,
        score: Math.max(0, score),
        distanceKm: Math.round(dist),
        matchReason: donor.bloodType === patientType ? 'Sought Group' : 'Compatible Group'
      };
    })
    .filter((res): res is MatchResult => res !== null)
    .sort((a, b) => b.score - a.score)
    .slice(0, 10); // Return top 10 matches
}

/**
 * Finds best matching requests for a specific donor.
 */
export function findMatchingRequests(donor: Donor, requests: BloodRequest[]): any[] {
  const donorType = donor.bloodType;
  const recipients = GIVING_COMPATIBILITY[donorType] || [];

  const donorLat = donor.lat || DISTRICT_COORDS[donor.district || '']?.[0] || 23.8103;
  const donorLng = donor.lng || DISTRICT_COORDS[donor.district || '']?.[1] || 90.4125;

  return requests
    .filter(req => recipients.includes(req.bloodType))
    .map(req => {
      const rLat = DISTRICT_COORDS[req.district]?.[0] || donorLat;
      const rLng = DISTRICT_COORDS[req.district]?.[1] || donorLng;
      const dist = getDistance(donorLat, donorLng, rLat, rLng);
      
      return { ...req, distance: Math.round(dist) };
    })
    .sort((a, b) => (a.isUrgent ? -1 : 1) || a.distance - b.distance)
    .slice(0, 5);
}
