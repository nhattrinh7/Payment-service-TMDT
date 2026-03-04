import { Controller, Inject } from '@nestjs/common'
import { Payload, Ctx, RmqContext, EventPattern } from '@nestjs/microservices'
import { CommandBus } from '@nestjs/cqrs'
import { BaseRetryConsumer } from '~/common/utils/base-retry.consumer'
import { SagaCreatePaymentCommand } from '~/application/commands/saga-create-payment/saga-create-payment.command'
import { SagaCancelPaymentCommand } from '~/application/commands/saga-cancel-payment/saga-cancel-payment.command'
import { SagaUpdatePaymentStatusCommand } from '~/application/commands/saga-update-payment-status/saga-update-payment-status.command'
import type { IMessagePublisher } from '~/domain/contracts/message-publisher.interface'
import { MESSAGE_PUBLISHER } from '~/domain/contracts/message-publisher.interface'

@Controller()
export class SagaPaymentConsumer extends BaseRetryConsumer {
  constructor(
    private readonly commandBus: CommandBus,
    @Inject(MESSAGE_PUBLISHER)
    private readonly messagePublisher: IMessagePublisher,
  ) {
    super()
  }

  @EventPattern('saga.create-payment')
  async handleCreatePayment(
    @Payload() data: {
      sagaId: string
      userId: string
      amount: number
    },
    @Ctx() context: RmqContext,
  ) {
    await this.handleWithRetry(context, async () => {
      this.logger.log(`Event saga.create-payment received, sagaId=${data.sagaId}`)
      try {
        const result = await this.commandBus.execute(
          new SagaCreatePaymentCommand(data.sagaId, data.userId, data.amount),
        )

        this.messagePublisher.emitToSagaOrchestrator('saga.result.create-payment', {
          sagaId: data.sagaId,
          success: true,
          paymentId: result.paymentId,
          paymentCode: result.paymentCode,
          qrUrl: result.qrUrl,
          amount: result.amount,
        })
      } catch (error: any) {
        this.messagePublisher.emitToSagaOrchestrator('saga.result.create-payment', {
          sagaId: data.sagaId,
          success: false,
          error: error.message || 'Lỗi tạo payment',
        })
      }
    })
  }

  @EventPattern('saga.cancel-payment')
  async handleCancelPayment(
    @Payload() data: { sagaId: string; paymentId: string },
    @Ctx() context: RmqContext,
  ) {
    await this.handleWithRetry(context, async () => {
      this.logger.log(`Event saga.cancel-payment received, sagaId=${data.sagaId}`)
      try {
        await this.commandBus.execute(
          new SagaCancelPaymentCommand(data.sagaId, data.paymentId),
        )
      } catch (error: any) {
        this.logger.error(`Cancel payment failed: ${error.message}`)
      }
    })
  }

  @EventPattern('saga.update-payment-status')
  async handleUpdatePaymentStatus(
    @Payload() data: { sagaId: string; paymentId: string; status: string },
    @Ctx() context: RmqContext,
  ) {
    await this.handleWithRetry(context, async () => {
      this.logger.log(`Event saga.update-payment-status received, sagaId=${data.sagaId}`)
      try {
        await this.commandBus.execute(
          new SagaUpdatePaymentStatusCommand(data.sagaId, data.paymentId, data.status),
        )
      } catch (error: any) {
        this.logger.error(`Update payment status failed: ${error.message}`)
      }
    })
  }
}
