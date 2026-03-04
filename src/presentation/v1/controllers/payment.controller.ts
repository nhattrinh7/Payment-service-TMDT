import {
  Body,
  Controller,
  Post,
  UseGuards,
} from '@nestjs/common'
import { CommandBus, QueryBus } from '@nestjs/cqrs'
import { PaymentAPIKeyGuard } from '~/common/guards/payment-api-key.guard'
import { WebhookPaymentBodyDto } from '~/presentation/dtos/payment-transaction.dto'
import { HandleWebhookCommand } from '~/application/commands/handle-webhook/handle-webhook.command'

@Controller('v1/payments')
export class PaymentController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @UseGuards(PaymentAPIKeyGuard)
  @Post('sepay-webhook')
  async receiver(
    @Body() body: WebhookPaymentBodyDto,
  ): Promise<any> {
    return this.commandBus.execute(new HandleWebhookCommand(body))
  }
}
