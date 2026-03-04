import { Payment } from '~/domain/entities/payment.entity'
import { PaymentStatus } from '~/domain/enums/payment.enum'

export interface IPaymentRepository {
  save(payment: Payment): Promise<Payment>

  findById(id: string): Promise<Payment | null>

  findByPaymentCode(paymentCode: string): Promise<Payment | null>

  updateStatus(paymentId: string, status: PaymentStatus): Promise<void>
}
export const PAYMENT_REPOSITORY = Symbol('IPaymentRepository')
