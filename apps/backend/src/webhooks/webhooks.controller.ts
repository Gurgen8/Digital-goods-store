import { Controller, Post, Body } from '@nestjs/common';
import { WebhooksService } from '@/webhooks/webhooks.service';
import { PaymentWebhookDto } from './dto/payment-webhook.dto';

@Controller('api/webhook')
export class WebhooksController {
  constructor(private readonly webhooksService: WebhooksService) { }

  @Post('payment')
  async paymentWebhook(@Body() body: PaymentWebhookDto) {
    await this.webhooksService.processPaymentWebhook(body);
    return { ok: true };
  }
}
