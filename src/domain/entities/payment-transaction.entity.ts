import { v4 as uuidv4 } from 'uuid'

interface PaymentTransactionProps {
  id: string
  gateway: string
  transactionDate: Date
  accountNumber: string | null
  subAccount: string | null
  amountIn: number
  amountOut: number
  accumulated: number
  code: string | null
  transactionContent: string | null
  referenceNumber: string | null
  body: string | null
}

export class PaymentTransaction {
  private constructor(private readonly props: PaymentTransactionProps) {}

  static create(data: {
    gateway: string
    transactionDate: Date
    accountNumber?: string | null
    subAccount?: string | null
    amountIn: number
    amountOut?: number
    accumulated?: number
    code?: string | null
    transactionContent?: string | null
    referenceNumber?: string | null
    body?: string | null
  }): PaymentTransaction {
    return new PaymentTransaction({
      id: uuidv4(),
      gateway: data.gateway,
      transactionDate: data.transactionDate,
      accountNumber: data.accountNumber ?? null,
      subAccount: data.subAccount ?? null,
      amountIn: data.amountIn,
      amountOut: data.amountOut ?? 0,
      accumulated: data.accumulated ?? 0,
      code: data.code ?? null,
      transactionContent: data.transactionContent ?? null,
      referenceNumber: data.referenceNumber ?? null,
      body: data.body ?? null,
    })
  }

  get id(): string {
    return this.props.id
  }
  get gateway(): string {
    return this.props.gateway
  }
  get transactionDate(): Date {
    return this.props.transactionDate
  }
  get accountNumber(): string | null {
    return this.props.accountNumber
  }
  get subAccount(): string | null {
    return this.props.subAccount
  }
  get amountIn(): number {
    return this.props.amountIn
  }
  get amountOut(): number {
    return this.props.amountOut
  }
  get accumulated(): number {
    return this.props.accumulated
  }
  get code(): string | null {
    return this.props.code
  }
  get transactionContent(): string | null {
    return this.props.transactionContent
  }
  get referenceNumber(): string | null {
    return this.props.referenceNumber
  }
  get body(): string | null {
    return this.props.body
  }

  toPlainObject(): PaymentTransactionProps {
    return { ...this.props }
  }
}
