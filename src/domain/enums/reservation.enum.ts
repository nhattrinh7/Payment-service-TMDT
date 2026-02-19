export const ReservationStatus = {
  PENDING: 'PENDING',
  CONFIRMED: 'CONFIRMED',
  EXPIRED: 'EXPIRED',
  CANCELLED: 'CANCELLED',
} as const
export type ReservationStatus = (typeof ReservationStatus)[keyof typeof ReservationStatus]
