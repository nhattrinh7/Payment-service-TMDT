export class SagaCancelPaymentCommand {
  constructor(
    public readonly sagaId: string,
    public readonly paymentId: string,
  ) {}
}
