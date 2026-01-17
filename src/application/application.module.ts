import { Module } from '@nestjs/common'
import { CqrsModule } from '@nestjs/cqrs'
import { DatabaseModule } from '~/infrastructure/database/database.module'
import { MessagingModule } from '~/infrastructure/messaging/messaging.module'
import { CreateInventoryHandler } from '~/application/commands/create-inventory/create-inventory.command.handler'
import { GetStocksHandler } from '~/application/queries/get-stocks.query.handler'
import { UpdateInventoryHandler } from '~/application/commands/update-inventory/update-inventory.command.handler'

const CommandHandlers = [
  CreateInventoryHandler,
  UpdateInventoryHandler
]

const QueryHandlers = [
  GetStocksHandler
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