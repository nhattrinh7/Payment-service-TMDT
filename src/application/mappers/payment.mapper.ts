import { Payment } from '~/domain/entities/payment.entity'
import { PaymentDto } from '~/presentation/dtos/payment.dto'

export class PaymentMapper {
  static toPaymentResponse(payment: Payment): PaymentDto {
    return {
      id: payment.id,
      paymentCode: payment.paymentCode,
      userId: payment.userId,
      status: payment.status,
      createdAt: payment.createdAt.toISOString(),
      updatedAt: payment.updatedAt.toISOString(),
    }
  }
}
