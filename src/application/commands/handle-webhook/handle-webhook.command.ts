import { WebhookPaymentBodyDto } from '~/presentation/dtos/payment-transaction.dto'

export class HandleWebhookCommand {
  constructor(
    public readonly data: WebhookPaymentBodyDto,
  ) {}
}
