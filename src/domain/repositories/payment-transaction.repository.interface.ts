import { PaymentTransaction } from '~/domain/entities/payment-transaction.entity'

export interface IPaymentTransactionRepository {
  save(transaction: PaymentTransaction): Promise<void>
}
export const PAYMENT_TRANSACTION_REPOSITORY = Symbol('IPaymentTransactionRepository')
