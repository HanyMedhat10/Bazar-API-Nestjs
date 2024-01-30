import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Put,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { CurrentUser } from 'src/utility/decorators/current-user.decorator';
import { User } from 'src/users/entities/user.entity';
import { JwtAuthGuard } from 'src/users/jwt.guard';
import { RoleGuard } from 'src/utility/common/role/role.guard';
import { Order } from './entities/order.entity';
import { UpdateOrderStatusDto } from './dto/update-order-status-dto';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}
  @UseGuards(JwtAuthGuard, RoleGuard) //must using token in using this method (login) & return payload in request
  @Post()
  // async create(@Body() createOrderDto: CreateOrderDto, @Req() req) {
  async create(
    @Body() createOrderDto: CreateOrderDto,
    @CurrentUser() currentUser: User,
  ): Promise<Order> {
    return await this.ordersService.create(createOrderDto, currentUser);
  }

  @Get()
  async findAll(): Promise<Order[]> {
    return await this.ordersService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Order> {
    return await this.ordersService.findOne(+id);
  }
  // @Roles('admin')
  @UseGuards(JwtAuthGuard, RoleGuard) //must using token in using this method (login) & return payload in request
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateOrderStatusDto: UpdateOrderStatusDto,
    @CurrentUser() currentUser: User,
  ): Promise<Order> {
    return await this.ordersService.update(
      +id,
      updateOrderStatusDto,
      currentUser,
    );
  }
  @UseGuards(JwtAuthGuard, RoleGuard) //must using token in using this method (login) & return payload in request
  @Put('cancel/:id')
  async cancelled(
    @Param('id') id: string,
    @CurrentUser() currentUser: User,
  ): Promise<Order> {
    return await this.ordersService.cancelled(+id, currentUser);
  }
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.ordersService.remove(+id);
  }
}
