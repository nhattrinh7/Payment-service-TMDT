import { AggregateRoot } from '@nestjs/cqrs'
import { v4 as uuidv4 } from 'uuid'
import { nanoid } from 'nanoid'
import { PaymentStatus } from '~/domain/enums/payment.enum'

export class Payment extends AggregateRoot {
  constructor(
    public id: string,
    public paymentCode: string,
    public userId: string,
    public status: PaymentStatus,
    public createdAt: Date,
    public updatedAt: Date,
  ) {
    super()
  }

  static create(userId: string): Payment {
    return new Payment(
      uuidv4(),
      nanoid(20),
      userId,
      PaymentStatus.PENDING,
      new Date(),
      new Date(),
    )
  }
}
