import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { Inject } from '@nestjs/common'
import { SagaUpdatePaymentStatusCommand } from './saga-update-payment-status.command'
import type { IPaymentRepository } from '~/domain/repositories/payment.repository.interface'
import { PAYMENT_REPOSITORY } from '~/domain/repositories/payment.repository.interface'
import { PaymentStatus } from '~/domain/enums/payment.enum'

@CommandHandler(SagaUpdatePaymentStatusCommand)
export class SagaUpdatePaymentStatusHandler implements ICommandHandler<SagaUpdatePaymentStatusCommand> {
  constructor(
    @Inject(PAYMENT_REPOSITORY)
    private readonly paymentRepository: IPaymentRepository,
  ) {}

  async execute(command: SagaUpdatePaymentStatusCommand): Promise<void> {
    const { paymentId, status } = command

    // Lấy entity từ DB
    const payment = await this.paymentRepository.findById(paymentId)
    if (!payment) return

    // Gọi domain method
    payment.updateStatus(status as PaymentStatus)

    // Lưu lại
    await this.paymentRepository.save(payment)
  }
}
