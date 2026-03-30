import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: 'http://localhost:3000', // URL de ton front Next.js
    methods: ['GET', 'POST' , 'PUT', 'DELETE', 'PATCH'],
    credentials: true, // si tu utilises des cookies/sessions
  });

  await app.listen(3001); // NestJS sur un port différent
}
bootstrap();
