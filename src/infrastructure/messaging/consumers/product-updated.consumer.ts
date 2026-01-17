import { Controller } from '@nestjs/common'
import { EventPattern, Payload, Ctx, RmqContext } from '@nestjs/microservices'
import { CommandBus } from '@nestjs/cqrs'
import { BaseRetryConsumer } from '~/common/utils/base-retry.consumer'
import { UpdateInventoryCommand } from '~/application/commands/update-inventory/update-inventory.command'

interface ProductUpdatedEvent {
  variants: Array<{
    productVariantId: string
    stock: number
  }>
}

@Controller()
export class ProductUpdatedConsumer extends BaseRetryConsumer {
  constructor(
    private readonly commandBus: CommandBus
  ) {
    super()
  }

  @EventPattern('product.updated')
  async handleProductUpdated(
    @Payload() data: ProductUpdatedEvent,
    @Ctx() context: RmqContext,
  ) {
    console.log('Event product.updated received:', data)

    await this.handleWithRetry(context, async () => {
      await this.commandBus.execute(new UpdateInventoryCommand(data.variants))
    })
  }
}
