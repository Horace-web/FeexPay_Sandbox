import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payout } from './payout.entity';


@Module({
  imports: [TypeOrmModule.forFeature([Payout])],
  // controllers: [PayoutsController],
  // providers: [PayoutsService],
})
export class PayoutsModule {}