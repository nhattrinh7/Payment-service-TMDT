import { Payment } from '~/domain/entities/payment.entity'

export interface IPaymentRepository {
  create(payment: Payment): Promise<Payment>
}
export const PAYMENT_REPOSITORY = Symbol('IPaymentRepository')
