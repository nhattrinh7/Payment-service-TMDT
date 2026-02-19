import { Injectable } from '@nestjs/common'
import { PrismaService } from '~/infrastructure/database/prisma/prisma.service'
import { Payment } from '~/domain/entities/payment.entity'
import { PaymentMapper } from '~/infrastructure/database/mappers/payment.mapper'
import { IPaymentRepository } from '~/domain/repositories/payment.repository.interface'
import { WebhookPaymentBodyDto } from '~/presentation/dtos/payment-transaction.dto'

@Injectable()
export class PaymentRepository implements IPaymentRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(payment: Payment): Promise<Payment> {
    const prismaPayment = PaymentMapper.toPersistence(payment)
    const createdPayment = await this.prisma.payment.create({
      data: prismaPayment,
    })
    return PaymentMapper.toDomain(createdPayment)
  }

  async receiver(body: WebhookPaymentBodyDto): Promise<any> {

  }
}
