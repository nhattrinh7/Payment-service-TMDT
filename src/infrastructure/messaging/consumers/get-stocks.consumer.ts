import { Controller } from '@nestjs/common'
import { Payload, Ctx, RmqContext, MessagePattern } from '@nestjs/microservices'
import { QueryBus } from '@nestjs/cqrs'
import { BaseRetryConsumer } from '~/common/utils/base-retry.consumer'
import { GetStocksQuery } from '~/application/queries/get-stocks.query'
import { type GetStocksPayload } from '~/domain/interfaces/inventory.interface'

@Controller()
export class GetStocksConsumer extends BaseRetryConsumer {
  constructor(
    private readonly queryBus: QueryBus
  ) {
    super()
  }

  @MessagePattern('get.stocks')
  async handleGetStocks(
    @Payload() data: GetStocksPayload,
    @Ctx() context: RmqContext,
  ) {
    console.log('Event get.stocks received:', data)

    const result = await this.handleWithRetry(context, async () => {
      const result = await this.queryBus.execute(new GetStocksQuery(data.productIds))
      return result
    }) 

    return result
  }
}