import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common'
import { env } from '~/configs/env.config'

@Injectable()
export class PaymentAPIKeyGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest()
    const authHeader = request.headers['authorization'] || ''
    const paymentApiKey = authHeader.replace(/^Apikey\s+/i, '')
    if (paymentApiKey !== env.config.PAYMENT_API_KEY) {
      throw new UnauthorizedException()
    }
    return true
  }
}
