import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/users.entity';
import { Transaction } from './transactions/transaction.entity';
import { Payout } from './payouts/payout.entity';
import { Customer } from './customers/customer.entity';
import { AuthModule } from './auth/auth.module';
import { TransactionsModule } from './transactions/transaction.module';
import { PayoutsModule } from './payouts/payout.module';
import { CustomersModule } from './customers/customer.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get('DB_HOST'),
        port: config.get<number>('DB_PORT'),
        username: config.get('DB_USERNAME'),
        password: config.get('DB_PASSWORD'),
        database: config.get('DB_NAME'),
        entities: [User, Transaction, Payout, Customer], // ← toutes les entities
        synchronize: true, // ⚠️ dev uniquement
      }),
    }),

    AuthModule,
    TransactionsModule, // ← ajouté
    PayoutsModule,      // ← ajouté
    CustomersModule,    // ← ajouté
  ],
})
export class AppModule {}