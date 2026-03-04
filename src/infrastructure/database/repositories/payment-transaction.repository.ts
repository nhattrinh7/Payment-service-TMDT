import { Injectable } from '@nestjs/common'
import { PrismaService } from '~/infrastructure/database/prisma/prisma.service'
import { IPaymentTransactionRepository } from '~/domain/repositories/payment-transaction.repository.interface'
import { PaymentTransaction } from '~/domain/entities/payment-transaction.entity'

@Injectable()
export class PaymentTransactionRepository implements IPaymentTransactionRepository {
  constructor(private readonly prisma: PrismaService) {}

  async save(transaction: PaymentTransaction): Promise<void> {
    await this.prisma.paymentTransaction.create({
      data: {
        id: transaction.id,
        gateway: transaction.gateway,
        transactionDate: transaction.transactionDate,
        accountNumber: transaction.accountNumber,
        subAccount: transaction.subAccount,
        amountIn: transaction.amountIn,
        amountOut: transaction.amountOut,
        accumulated: transaction.accumulated,
        code: transaction.code,
        transactionContent: transaction.transactionContent,
        referenceNumber: transaction.referenceNumber,
        body: transaction.body,
      },
    })
  }
}
