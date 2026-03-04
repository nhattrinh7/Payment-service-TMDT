export class SagaCreatePaymentCommand {
  constructor(
    public readonly sagaId: string,
    public readonly userId: string,
    public readonly amount: number,
  ) {}
}
