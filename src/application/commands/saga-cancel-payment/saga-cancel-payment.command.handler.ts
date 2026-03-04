import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { Inject } from '@nestjs/common'
import { SagaCancelPaymentCommand } from './saga-cancel-payment.command'
import type { IPaymentRepository } from '~/domain/repositories/payment.repository.interface'
import { PAYMENT_REPOSITORY } from '~/domain/repositories/payment.repository.interface'

@CommandHandler(SagaCancelPaymentCommand)
export class SagaCancelPaymentHandler implements ICommandHandler<SagaCancelPaymentCommand> {
  constructor(
    @Inject(PAYMENT_REPOSITORY)
    private readonly paymentRepository: IPaymentRepository,
  ) {}

  async execute(command: SagaCancelPaymentCommand): Promise<void> {
    const { paymentId } = command

    // Lấy entity từ DB
    const payment = await this.paymentRepository.findById(paymentId)
    if (!payment) return

    // Gọi domain method
    payment.cancel()

    // Lưu lại
    await this.paymentRepository.save(payment)
  }
}
