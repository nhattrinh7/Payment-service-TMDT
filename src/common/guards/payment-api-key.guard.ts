import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common'
import { env } from '~/configs/env.config'

@Injectable()
export class PaymentAPIKeyGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest()
    const authHeader = request.headers['authorization'] || ''
    // console.log('authHeader', authHeader)
    const paymentApiKey = authHeader.replace(/^Apikey\s+/i, '')
    console.log('paymentApiKey', paymentApiKey)
    if (paymentApiKey !== env.config.PAYMENT_API_KEY) {
      throw new UnauthorizedException()
    }
    return true
  }
}
