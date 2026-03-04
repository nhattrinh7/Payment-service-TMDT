import { Module } from '@nestjs/common'
import { CqrsModule } from '@nestjs/cqrs'
import { DatabaseModule } from '~/infrastructure/database/database.module'
import { MessagingModule } from '~/infrastructure/messaging/messaging.module'
import { HandleWebhookHandler } from './commands/handle-webhook/handle-webhook.command.handler'
import { SagaCreatePaymentHandler } from './commands/saga-create-payment/saga-create-payment.command.handler'
import { SagaCancelPaymentHandler } from './commands/saga-cancel-payment/saga-cancel-payment.command.handler'
import { SagaUpdatePaymentStatusHandler } from './commands/saga-update-payment-status/saga-update-payment-status.command.handler'

const CommandHandlers = [
  HandleWebhookHandler,
  SagaCreatePaymentHandler,
  SagaCancelPaymentHandler,
  SagaUpdatePaymentStatusHandler,
]

const QueryHandlers = [

]

const EventHandlers = [

]
 
@Module({
  imports: [
    CqrsModule,
    DatabaseModule,
    MessagingModule
  ],
  providers: [
    ...CommandHandlers,
    ...QueryHandlers,
    ...EventHandlers,
  ],
  exports: [],
})
export class ApplicationModule {}