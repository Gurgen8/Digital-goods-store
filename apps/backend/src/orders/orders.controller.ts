import { Controller, Get, Post, Body, Param, Headers } from '@nestjs/common';
import { OrdersService } from '@/orders/orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { MockPayDto } from './dto/mock-pay.dto';
import { ApplyPromoDto } from './dto/apply-promo.dto';

@Controller('api/orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  async createOrder(
    @Body() body: CreateOrderDto,
    @Headers('idempotency-key') idempotencyKey?: string,
  ) {
    return this.ordersService.createOrder(body.productId, idempotencyKey);
  }

  @Get(':id')
  async getOrder(@Param('id') id: string) {
    return this.ordersService.getOrder(id);
  }

  @Post(':id/pay')
  async mockPay(@Param('id') id: string, @Body() body: MockPayDto) {
    return this.ordersService.mockPay(id, body.result);
  }

  @Post(':id/apply-promo')
  async applyPromo(@Param('id') id: string, @Body() body: ApplyPromoDto) {
    return this.ordersService.applyPromo(id, body.code);
  }
}
