import { Module } from '@nestjs/common'
import { PrismaService } from '~/infrastructure/database/prisma/prisma.service'
import { PAYMENT_REPOSITORY } from '~/domain/repositories/payment.repository.interface'
import { PaymentRepository } from '~/infrastructure/database/repositories/payment.repository'
import { CqrsModule } from '@nestjs/cqrs'

@Module({
  imports: [CqrsModule],
  providers: [
    PrismaService,
    {
      provide: PAYMENT_REPOSITORY,
      useClass: PaymentRepository,
    },
  ],
  exports: [
    PAYMENT_REPOSITORY,
  ],
})
export class DatabaseModule {}
