import { AggregateRoot } from '@nestjs/cqrs'
import { v4 as uuidv4 } from 'uuid'
import { nanoid } from 'nanoid'
import { PaymentStatus } from '~/domain/enums/payment.enum'

export class Payment extends AggregateRoot {
  constructor(
    public id: string,
    public paymentCode: string,
    public userId: string,
    public amount: number,
    public sagaId: string | null,
    public status: PaymentStatus,
    public createdAt: Date,
    public updatedAt: Date,
  ) {
    super()
  }

  static create(userId: string, amount: number, sagaId?: string): Payment {
    return new Payment(
      uuidv4(),
      nanoid(12),
      userId,
      amount,
      sagaId || null,
      PaymentStatus.PENDING,
      new Date(),
      new Date(),
    )
  }

  cancel(): void {
    this.status = PaymentStatus.FAILED
    this.updatedAt = new Date()
  }

  markSuccess(): void {
    this.status = PaymentStatus.SUCCESS
    this.updatedAt = new Date()
  }

  isPending(): boolean {
    return this.status === PaymentStatus.PENDING
  }

  isCorrectAmount(transferAmount: number): boolean {
    return transferAmount >= this.amount
  }

  updateStatus(status: PaymentStatus): void {
    this.status = status
    this.updatedAt = new Date()
  }
}
