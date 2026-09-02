import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class PaymentWebhookDto {
  @IsString()
  @IsNotEmpty()
  event_id: string;

  @IsString()
  @IsNotEmpty()
  order_id: string;

  @IsNotEmpty()
  @IsEnum(['paid', 'failed'])
  status: 'paid' | 'failed';

  @IsNumber()
  amount: number;

  @IsString()
  @IsNotEmpty()
  currency: string;

  @IsString()
  @IsNotEmpty()
  created_at: string;
}
