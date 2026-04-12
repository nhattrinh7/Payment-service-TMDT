import { Payment as PrismaPayment } from '@prisma/client'
import { Payment } from '~/domain/entities/payment.entity'

export class PaymentMapper {
  static toDomain(prismaPayment: PrismaPayment): Payment {
    return new Payment(
      prismaPayment.id,
      prismaPayment.paymentCode,
      prismaPayment.userId,
      prismaPayment.amount,
      prismaPayment.sagaId,
      prismaPayment.status,
      prismaPayment.createdAt,
      prismaPayment.updatedAt,
    )
  }

  static toPersistence(payment: Payment): PrismaPayment {
    return {
      id: payment.id,
      paymentCode: payment.paymentCode,
      userId: payment.userId,
      amount: payment.amount,
      sagaId: payment.sagaId,
      status: payment.status,
      createdAt: payment.createdAt,
      updatedAt: payment.updatedAt,
    }
  }
}
