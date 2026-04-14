import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Transaction } from '../transactions/transaction.entity';
import { Payout } from '../payouts/payout.entity';
import { Customer } from '../customers/customer.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  password!: string; // hashé avec bcrypt

  @Column()
  firstName!: string;

  @Column()
  lastName!: string;

  @Column()
  enterpriseName!: string;

  @OneToMany(() => Transaction, (transaction) => transaction.user)
  transactions!: Transaction[];

  @OneToMany(() => Payout, (payout) => payout.user)
  payouts!: Payout[];

  @OneToMany(() => Customer, (customer) => customer.user)
  customers!: Customer[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}