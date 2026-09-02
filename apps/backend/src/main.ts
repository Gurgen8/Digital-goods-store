import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from '@/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  const port = process.env.BACKEND_PORT || 3001;
  await app.listen(port);
  console.log(`[backend] listening on http://localhost:${port}`);
}
bootstrap();
