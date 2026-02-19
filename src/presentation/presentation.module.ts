import { Module } from '@nestjs/common'
import { CqrsModule } from '@nestjs/cqrs'
import { PaymentController } from '~/presentation/v1/controllers/payment.controller'
import { ApplicationModule } from '~/application/application.module'
import { MessagingModule } from '~/infrastructure/messaging/messaging.module'

@Module({
  imports: [CqrsModule, ApplicationModule, MessagingModule],
  controllers: [PaymentController],
  exports: [],
})
export class PresentationModule {}
