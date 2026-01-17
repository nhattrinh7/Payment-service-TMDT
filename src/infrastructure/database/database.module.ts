import { Module } from '@nestjs/common'
import { PrismaService } from '~/infrastructure/database/prisma/prisma.service'
import { INVENTORY_REPOSITORY } from '~/domain/repositories/inventory.repository.interface'
import { InventoryRepository } from '~/infrastructure/database/repositories/inventory.repository'
import { CqrsModule } from '@nestjs/cqrs'

@Module({
  imports: [CqrsModule],
  providers: [
    PrismaService,
    {
      provide: INVENTORY_REPOSITORY,
      useClass: InventoryRepository,
    },
  ],
  exports: [
    INVENTORY_REPOSITORY,
  ],
})
export class DatabaseModule {}
