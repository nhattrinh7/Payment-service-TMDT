import { Body, Controller, Logger, Post, Req, UseGuards } from '@nestjs/common'
import { CommandBus, QueryBus } from '@nestjs/cqrs'
import { PaymentAPIKeyGuard } from '~/common/guards/payment-api-key.guard'
import { WebhookPaymentBodyDto } from '~/presentation/dtos/payment-transaction.dto'
import { HandleWebhookCommand } from '~/application/commands/handle-webhook/handle-webhook.command'

@Controller('v1/payments')
export class PaymentController {
  private readonly logger = new Logger(PaymentController.name)

  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @UseGuards(PaymentAPIKeyGuard)
  @Post('sepay')
  async receiver(@Body() body: WebhookPaymentBodyDto): Promise<any> {
    this.logger.log(`Webhook received: ${JSON.stringify(body)}`)
    return this.commandBus.execute(new HandleWebhookCommand(body))
  }
}
