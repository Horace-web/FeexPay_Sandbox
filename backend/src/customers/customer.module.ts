import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Customer } from './customer.entity';


@Module({
  imports: [TypeOrmModule.forFeature([Customer])],
  // controllers: [CustomersController],
  // providers: [CustomersService],
})
export class CustomersModule {}