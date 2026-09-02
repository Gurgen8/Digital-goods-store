import { IsEnum, IsNotEmpty } from 'class-validator';

export class MockPayDto {
  @IsNotEmpty()
  @IsEnum(['success', 'failed'])
  result: 'success' | 'failed';
}
