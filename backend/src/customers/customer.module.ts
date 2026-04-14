import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Customer } from './customer.entity';
import { CustomersService } from './customer.service';
import { CustomersController } from './customer.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Customer])],
  controllers: [CustomersController],
  providers: [CustomersService],
})
export class CustomersModule {}