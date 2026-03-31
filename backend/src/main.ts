import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Active la validation des DTOs
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  app.enableCors({
    origin: 'http://localhost:3000', // URL de ton front Next.js
    methods: ['GET', 'POST' , 'PUT', 'DELETE', 'PATCH'],
    credentials: false, 
  });


  // ── Swagger ──
  const config = new DocumentBuilder()
    .setTitle('FeexPay Sandbox API')
    .setDescription('Documentation de l\'API FeexPay')
    .setVersion('1.0')
    .addBearerAuth() // ← ajoute le champ Authorization pour les JWT
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document); // ← accessible sur /api/docs

  await app.listen(3001);
  console.log('Backend running     → http://localhost:3001');
  console.log('Swagger docs        → http://localhost:3001/api/docs');
}
bootstrap();
