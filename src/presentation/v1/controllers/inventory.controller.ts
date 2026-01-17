import {
  Controller,
} from '@nestjs/common'
import { CommandBus, QueryBus } from '@nestjs/cqrs'

@Controller('v1/inventories')
export class InventoryController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

}
