import { Controller, Get, Post, Body, Param, Headers } from '@nestjs/common';
import { OrdersService } from '@/orders/orders.service';
import { z } from 'zod';

const CreateOrderSchema = z.object({
  productId: z.string().min(1),
});

const MockPaySchema = z.object({
  result: z.enum(['success', 'failed']),
});

@Controller('api/orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  async createOrder(
    @Body() body: any,
    @Headers('idempotency-key') idempotencyKey?: string,
  ) {
    const parsed = CreateOrderSchema.parse(body);
    return this.ordersService.createOrder(parsed.productId, idempotencyKey);
  }

  @Get(':id')
  async getOrder(@Param('id') id: string) {
    return this.ordersService.getOrder(id);
  }

  @Post(':id/pay')
  async mockPay(@Param('id') id: string, @Body() body: any) {
    const parsed = MockPaySchema.parse(body);
    return this.ordersService.mockPay(id, parsed.result);
  }
}
