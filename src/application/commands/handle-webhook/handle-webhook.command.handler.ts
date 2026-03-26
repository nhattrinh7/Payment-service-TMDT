import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { Inject, Logger } from '@nestjs/common'
import { HandleWebhookCommand } from './handle-webhook.command'
import type { IPaymentRepository } from '~/domain/repositories/payment.repository.interface'
import { PAYMENT_REPOSITORY } from '~/domain/repositories/payment.repository.interface'
import type { IPaymentTransactionRepository } from '~/domain/repositories/payment-transaction.repository.interface'
import { PAYMENT_TRANSACTION_REPOSITORY } from '~/domain/repositories/payment-transaction.repository.interface'
import { PaymentTransaction } from '~/domain/entities/payment-transaction.entity'
import { PREFIX_PAYMENT_CODE, DEFAULT_PAYMENT_GATEWAY } from '~/common/constants/payment.constant'
import type { IMessagePublisher } from '~/domain/contracts/message-publisher.interface'
import { MESSAGE_PUBLISHER } from '~/domain/contracts/message-publisher.interface'


// Một số chỗ sẽ bắt buộc return success : true là 1 kĩ thuật bắt buộc khi làm việc với các hệ thống thanh toán như Sepay,... khi muốn tránh Sepay Retry
@CommandHandler(HandleWebhookCommand)
export class HandleWebhookHandler implements ICommandHandler<HandleWebhookCommand> {
  constructor(
    @Inject(PAYMENT_REPOSITORY)
    private readonly paymentRepository: IPaymentRepository,
    @Inject(PAYMENT_TRANSACTION_REPOSITORY)
    private readonly paymentTransactionRepository: IPaymentTransactionRepository,
    @Inject(MESSAGE_PUBLISHER)
    private readonly messagePublisher: IMessagePublisher,
  ) {}

  private readonly logger = new Logger(HandleWebhookHandler.name)

  async execute(command: HandleWebhookCommand): Promise<any> {
    const body = command.data

    // Tạo PaymentTransaction entity qua factory method
    const transaction = PaymentTransaction.create({
      gateway: body.gateway || DEFAULT_PAYMENT_GATEWAY,
      transactionDate: body.transactionDate ? new Date(body.transactionDate) : new Date(),
      accountNumber: body.accountNumber,
      subAccount: body.subAccount,
      amountIn: body.transferAmount || 0,
      amountOut: 0,
      accumulated: body.accumulated || 0,
      code: body.code,
      transactionContent: body.content,
      referenceNumber: body.referenceCode,
      body: JSON.stringify(body),
    })

    // Lưu transaction log qua repository
    await this.paymentTransactionRepository.save(transaction)

    // Lấy paymentCode: ưu tiên từ trường code (SePay tự nhận diện), fallback parse content
    const paymentCode = body.code
      ? body.code.split(PREFIX_PAYMENT_CODE)[1]
      : (() => {
          const content = body.content || ''
          const codeMatch = content.match(new RegExp(`${PREFIX_PAYMENT_CODE}([A-Za-z0-9]+)`))
          return codeMatch ? codeMatch[1] : null
        })()

    if (!paymentCode) {
      this.logger.warn('Webhook: không tìm thấy payment code')
      return { success: true, message: 'Transaction logged but no payment code found' }
    }

    // Lấy Payment entity từ repository
    const payment = await this.paymentRepository.findByPaymentCode(paymentCode)

    if (!payment) {
      // ko emit sự kiện, sau 15 phút sẽ timeout
      this.logger.warn(`Webhook: Payment với code ${paymentCode} không tồn tại`)
      return { success: true, message: 'Payment not found' }
    }

    // Dùng domain method kiểm tra trạng thái
    if (!payment.isPending()) {
      this.logger.warn(`Webhook: Payment ${paymentCode} đã được xử lý (${payment.status})`)
      return { success: true, message: 'Payment already processed' }
    }

    // Dùng domain method kiểm tra số tiền
    const transferAmount = body.transferAmount || 0

    if (!payment.isCorrectAmount(transferAmount)) {
      this.logger.warn(`Webhook: Sai số tiền - expected ${payment.amount}, got ${transferAmount}`)

      this.messagePublisher.emitToSagaOrchestrator('saga.payment-webhook', {
        sagaId: payment.sagaId,
        paymentId: payment.id,
        paymentCode,
        transferAmount,
        success: false,
        error: `Số tiền chuyển khoản không đúng: expected ${payment.amount}, got ${transferAmount}`,
      })

      return { success: true, message: 'Incorrect amount' }
    }

    // Thanh toán thành công → cập nhật status trong DB
    payment.markSuccess()
    await this.paymentRepository.save(payment)

    this.logger.log(`Webhook: Thanh toán thành công cho payment ${paymentCode}`)

    this.messagePublisher.emitToSagaOrchestrator('saga.payment-webhook', {
      sagaId: payment.sagaId,
      paymentId: payment.id,
      paymentCode,
      transferAmount,
      success: true,
    })

    return { success: true, message: 'Payment processed' }
  }
}
