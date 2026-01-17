import { Module } from '@nestjs/common'
import { CqrsModule } from '@nestjs/cqrs'
import { InventoryController } from '~/presentation/v1/controllers/inventory.controller'
import { ApplicationModule } from '~/application/application.module'
import { MessagingModule } from '~/infrastructure/messaging/messaging.module'

@Module({
  imports: [CqrsModule, ApplicationModule, MessagingModule],
  controllers: [InventoryController],
  exports: [],
})
export class PresentationModule {}
