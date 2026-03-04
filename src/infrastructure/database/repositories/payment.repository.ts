import { Injectable } from '@nestjs/common'
import { PrismaService } from '~/infrastructure/database/prisma/prisma.service'
import { IPaymentRepository } from '~/domain/repositories/payment.repository.interface'
import { Payment } from '~/domain/entities/payment.entity'
import { PaymentStatus } from '~/domain/enums/payment.enum'
import { PaymentStatus as PrismaPaymentStatus } from '@prisma/client'

@Injectable()
export class PaymentRepository implements IPaymentRepository {
  constructor(private readonly prisma: PrismaService) {}

  async save(payment: Payment): Promise<Payment> {
    const result = await this.prisma.payment.upsert({
      where: { id: payment.id },
      create: {
        id: payment.id,
        paymentCode: payment.paymentCode,
        userId: payment.userId,
        amount: payment.amount,
        sagaId: payment.sagaId,
        status: payment.status as PrismaPaymentStatus,
      },
      update: {
        status: payment.status as PrismaPaymentStatus,
        updatedAt: payment.updatedAt,
      },
    })

    return new Payment(
      result.id,
      result.paymentCode,
      result.userId,
      result.amount,
      result.sagaId,
      result.status as PaymentStatus,
      result.createdAt,
      result.updatedAt,
    )
  }

  async findById(id: string): Promise<Payment | null> {
    const result = await this.prisma.payment.findUnique({ where: { id } })
    if (!result) return null

    return new Payment(
      result.id,
      result.paymentCode,
      result.userId,
      result.amount,
      result.sagaId,
      result.status as PaymentStatus,
      result.createdAt,
      result.updatedAt,
    )
  }

  async findByPaymentCode(paymentCode: string): Promise<Payment | null> {
    const result = await this.prisma.payment.findUnique({ where: { paymentCode } })
    if (!result) return null

    return new Payment(
      result.id,
      result.paymentCode,
      result.userId,
      result.amount,
      result.sagaId,
      result.status as PaymentStatus,
      result.createdAt,
      result.updatedAt,
    )
  }

  async updateStatus(paymentId: string, status: PaymentStatus): Promise<void> {
    await this.prisma.payment.update({
      where: { id: paymentId },
      data: { status: status as PrismaPaymentStatus },
    })
  }
}
