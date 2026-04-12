import { Module } from '@nestjs/common'
import { ClientsModule, Transport } from '@nestjs/microservices'
import { MESSAGE_PUBLISHER } from '~/domain/contracts/message-publisher.interface'
import { RabbitMQPublisher } from '~/infrastructure/messaging/publishers/rabbitmq.publisher'
import { CqrsModule } from '@nestjs/cqrs'
import { SagaPaymentConsumer } from '~/infrastructure/messaging/consumers/saga-payment.consumer'

@Module({
  imports: [
    CqrsModule,
    ClientsModule.register([
      {
        name: 'NOTIFICATION_CLIENT',
        transport: Transport.RMQ,
        options: {
          urls: [`amqp://admin:admin123@${process.env.RABBITMQ_HOST || 'localhost'}:5672`],
          queue: 'notification_queue',
          persistent: true,
        },
      },
      {
        name: 'SAGA_CLIENT',
        transport: Transport.RMQ,
        options: {
          urls: [`amqp://admin:admin123@${process.env.RABBITMQ_HOST || 'localhost'}:5672`],
          queue: 'saga_queue',
          persistent: true,
        },
      },
    ]),
  ],
  controllers: [SagaPaymentConsumer],
  providers: [
    {
      provide: MESSAGE_PUBLISHER,
      useClass: RabbitMQPublisher,
    },
  ],
  exports: [ClientsModule, MESSAGE_PUBLISHER],
})
export class MessagingModule {}
