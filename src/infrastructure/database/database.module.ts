import { Module } from '@nestjs/common'
import { PrismaService } from '~/infrastructure/database/prisma/prisma.service'
import { PAYMENT_REPOSITORY } from '~/domain/repositories/payment.repository.interface'
import { PAYMENT_TRANSACTION_REPOSITORY } from '~/domain/repositories/payment-transaction.repository.interface'
import { PaymentRepository } from '~/infrastructure/database/repositories/payment.repository'
import { PaymentTransactionRepository } from '~/infrastructure/database/repositories/payment-transaction.repository'
import { CqrsModule } from '@nestjs/cqrs'

@Module({
  imports: [CqrsModule],
  providers: [
    PrismaService,
    {
      provide: PAYMENT_REPOSITORY,
      useClass: PaymentRepository,
    },
    {
      provide: PAYMENT_TRANSACTION_REPOSITORY,
      useClass: PaymentTransactionRepository,
    },
  ],
  exports: [PAYMENT_REPOSITORY, PAYMENT_TRANSACTION_REPOSITORY],
})
export class DatabaseModule {}
