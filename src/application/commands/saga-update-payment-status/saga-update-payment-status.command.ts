export class SagaUpdatePaymentStatusCommand {
  constructor(
    public readonly sagaId: string,
    public readonly paymentId: string,
    public readonly status: string,
  ) {}
}
