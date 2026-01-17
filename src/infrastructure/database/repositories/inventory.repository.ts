import { Injectable } from '@nestjs/common'
import { PrismaService } from '~/infrastructure/database/prisma/prisma.service'
import { Inventory } from '~/domain/entities/inventory.entity'
import { InventoryMapper } from '~/infrastructure/database/mappers/inventory.mapper'
import { IInventoryRepository } from '~/domain/repositories/inventory.repository.interface'
import { GetStocksResponseType, ProductStock } from '~/domain/interfaces/inventory.interface'

@Injectable()
export class InventoryRepository implements IInventoryRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createMany(inventories: Inventory[]): Promise<void> {
    const inventoryRecords = inventories.map(inventory =>
      InventoryMapper.toPersistence(inventory)
    )
    await this.prisma.inventory.createMany({
      data: inventoryRecords,
    })
  }

  async getStocksByProductIds(productIds: string[]): Promise<GetStocksResponseType> {
    // Query tất cả inventory records với productId trong list productIds
    const inventories = await this.prisma.inventory.findMany({
      where: {
        productId: {
          in: productIds,
        },
      },
      select: {
        productId: true,
        productVariantId: true,
        availableQuantity: true,
        soldQuantity: true,
      },
    })

    // Group theo productId và transform sang format GetStocksResponseType
    const stocksMap = new Map<string, ProductStock>()

    for (const inventory of inventories) {
      if (!stocksMap.has(inventory.productId)) {
        stocksMap.set(inventory.productId, {
          productId: inventory.productId,
          variants: [],
        })
      }

      const productStock = stocksMap.get(inventory.productId)!
      productStock.variants.push({
        productVariantId: inventory.productVariantId,
        stock: inventory.availableQuantity,
        soldQuantity: inventory.soldQuantity,
      })
    }

    return {
      stocks: Array.from(stocksMap.values()),
    }
  }

  async findByProductVariantId(productVariantId: string): Promise<Inventory | null> {
    const inventory = await this.prisma.inventory.findUnique({
      where: { productVariantId },
    })

    if (!inventory) {
      return null
    }

    return InventoryMapper.toDomain(inventory)
  }

  async updateStocks(variants: Array<{ productVariantId: string; availableQuantity: number; totalQuantity: number }>): Promise<void> {
    // Chỉ thực hiện data access, không có business logic
    await Promise.all(
      variants.map(variant =>
        this.prisma.inventory.update({
          where: { productVariantId: variant.productVariantId },
          data: {
            availableQuantity: variant.availableQuantity,
            totalQuantity: variant.totalQuantity,
            updatedAt: new Date(),
          },
        })
      )
    )
  }
}
