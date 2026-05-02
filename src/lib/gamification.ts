/**
 * @fileOverview logic for donor badges and gamification levels.
 */

export type BadgeType = {
  label: string;
  icon: string;
  color: string;
  bgColor: string;
  minDonations: number;
};

export const DONOR_BADGES: BadgeType[] = [
  {
    label: 'Life Saver',
    icon: '🏆',
    color: 'text-amber-600',
    bgColor: 'bg-amber-100',
    minDonations: 15,
  },
  {
    label: 'Hero Donor',
    icon: '💪',
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
    minDonations: 5,
  },
  {
    label: 'Emergency Responder',
    icon: '🔥',
    color: 'text-orange-600',
    bgColor: 'bg-orange-100',
    minDonations: 1,
  },
];

export function getDonorBadge(donations: number): BadgeType | null {
  return DONOR_BADGES.find(badge => donations >= badge.minDonations) || null;
}
