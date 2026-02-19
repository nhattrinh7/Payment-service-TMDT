import { createZodDto } from 'nestjs-zod'
import z from 'zod'
import { PaymentStatus } from '~/domain/enums/payment.enum'

export const PaymentSchema = z.object({
  id: z.uuid(),
  paymentCode: z.string(),
  userId: z.uuid(),
  status: z.enum(PaymentStatus),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
})
export class PaymentDto extends createZodDto(PaymentSchema) {}