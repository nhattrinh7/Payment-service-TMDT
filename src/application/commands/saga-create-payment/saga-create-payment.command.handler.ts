import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { Inject } from '@nestjs/common'
import { SagaCreatePaymentCommand } from './saga-create-payment.command'
import type { IPaymentRepository } from '~/domain/repositories/payment.repository.interface'
import { PAYMENT_REPOSITORY } from '~/domain/repositories/payment.repository.interface'
import { Payment } from '~/domain/entities/payment.entity'
import { PREFIX_PAYMENT_CODE } from '~/common/constants/payment.constant'

interface CreatePaymentResult {
  success: boolean
  paymentId?: string
  paymentCode?: string
  qrUrl?: string
  amount?: number
  error?: string
}

@CommandHandler(SagaCreatePaymentCommand)
export class SagaCreatePaymentHandler implements ICommandHandler<SagaCreatePaymentCommand, CreatePaymentResult> {
  constructor(
    @Inject(PAYMENT_REPOSITORY)
    private readonly paymentRepository: IPaymentRepository,
  ) {}

  async execute(command: SagaCreatePaymentCommand): Promise<CreatePaymentResult> {
    const { sagaId, userId, amount } = command

    // Tạo Payment entity qua factory method
    const payment = Payment.create(userId, amount, sagaId)

    // Lưu vào DB
    const savedPayment = await this.paymentRepository.save(payment)

    // Tạo QR URL (SePay format)
    const bankId = process.env.SEPAY_BANK_ID || '970422'
    const accountNumber = process.env.SEPAY_ACCOUNT_NUMBER || ''
    const qrUrl = `https://qr.sepay.vn/img?acc=${accountNumber}&bank=${bankId}&amount=${amount}&des=${PREFIX_PAYMENT_CODE}${savedPayment.paymentCode}`

    return {
      success: true,
      paymentId: savedPayment.id,
      paymentCode: savedPayment.paymentCode,
      qrUrl,
      amount,
    }
  }
}
