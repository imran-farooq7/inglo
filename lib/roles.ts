export type UserRole = 'guest' | 'customer' | 'staff';

const splitList = (value?: string) =>
  (value ?? '')
    .split(',')
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean);

const staffEmailList = splitList(process.env.STAFF_EMAILS);
const premiumEmailList = splitList(process.env.PREMIUM_MEMBER_EMAILS);

const staffDomain = (process.env.STAFF_EMAIL_DOMAIN ?? '').trim().toLowerCase();

export const getUserRoleFromEmail = (email?: string | null): UserRole => {
  if (!email) {
    return 'guest';
  }

  const normalized = email.toLowerCase();
  const domain = normalized.split('@')[1] ?? '';

  if (staffEmailList.includes(normalized) || (staffDomain && domain === staffDomain)) {
    return 'staff';
  }

  return 'customer';
};

export const isPremiumMember = (email?: string | null) => {
  if (!email) {
    return false;
  }

  const normalized = email.toLowerCase();
  return premiumEmailList.includes(normalized);
};

export const canUsePremiumBooking = ({
  email,
  reservationAt,
}: {
  email?: string | null;
  reservationAt: Date;
}) => {
  if (!email) {
    return { allowed: false, reason: 'Premium bookings require a signed-in member account.' };
  }

  if (!isPremiumMember(email)) {
    return { allowed: false, reason: 'Your account is not enrolled in the premium program.' };
  }

  const now = Date.now();
  const minLeadHours = Number(process.env.PREMIUM_MIN_LEAD_HOURS ?? 4);
  const minAllowedTime = now + minLeadHours * 60 * 60 * 1000;

  if (reservationAt.getTime() < minAllowedTime) {
    return { allowed: false, reason: `Premium bookings require at least ${minLeadHours} hours notice.` };
  }

  return { allowed: true as const };
};
