import { Module } from '@nestjs/common'
import { CqrsModule } from '@nestjs/cqrs'
import { DatabaseModule } from '~/infrastructure/database/database.module'
import { MessagingModule } from '~/infrastructure/messaging/messaging.module'
import { CreateInventoryHandler } from '~/application/commands/create-inventory/create-inventory.command.handler'
import { GetStocksHandler } from '~/application/queries/get-stocks/get-stocks.query.handler'
import { GetBuyCountHandler } from '~/application/queries/get-buy-count/get-buy-count.query.handler'
import { UpdateInventoryHandler } from '~/application/commands/update-inventory/update-inventory.command.handler'
import { SoftDeleteInventoryHandler } from '~/application/commands/soft-delete-inventory/soft-delete-inventory.command.handler'

const CommandHandlers = [
  CreateInventoryHandler,
  UpdateInventoryHandler,
  SoftDeleteInventoryHandler,
]

const QueryHandlers = [
  GetStocksHandler,
  GetBuyCountHandler,
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