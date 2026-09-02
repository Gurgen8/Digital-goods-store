import { Controller, Post, Body } from '@nestjs/common';
import { WebhooksService } from '@/webhooks/webhooks.service';
import { z } from 'zod';

const PaymentWebhookSchema = z.object({
  event_id: z.string(),
  order_id: z.string(),
  status: z.enum(['paid', 'failed']),
  amount: z.number(),
  currency: z.string(),
  created_at: z.string(),
});

@Controller('api/webhook')
export class WebhooksController {
  constructor(private readonly webhooksService: WebhooksService) { }

  @Post('payment')
  async paymentWebhook(@Body() body: unknown) {
    const parsed = PaymentWebhookSchema.parse(body);
    await this.webhooksService.processPaymentWebhook(parsed);
    return { ok: true };
  }
}
