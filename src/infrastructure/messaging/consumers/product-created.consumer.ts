import { Controller } from '@nestjs/common'
import { EventPattern, Payload, Ctx, RmqContext } from '@nestjs/microservices'
import { CommandBus } from '@nestjs/cqrs'
import { BaseRetryConsumer } from '~/common/utils/base-retry.consumer'
import { CreateInventoryCommand } from '~/application/commands/create-inventory/create-inventory.command'

@Controller()
export class ProductCreatedConsumer extends BaseRetryConsumer {
  constructor(
    private readonly commandBus: CommandBus
  ) {
    super()
  }

  @EventPattern('product.created')
  async handleProductCreated(
    @Payload() data: any,
    @Ctx() context: RmqContext,
  ) {
    console.log('Event product.created received:', data)

    await this.handleWithRetry(context, async () => {
      await this.commandBus.execute(new CreateInventoryCommand(data.variants))
    })
  }
}
