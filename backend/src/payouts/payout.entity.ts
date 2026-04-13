import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../users/users.entity';

export enum PayoutStatus {
  PENDING   = 'pending',
  SUCCESS   = 'success',
  FAILED    = 'failed',
  CANCELLED = 'cancelled',
}

export enum PaymentMethod {
  MOBILE_MONEY   = 'mobile_money',
  BANK_TRANSFER  = 'bank_transfer',
}

@Entity('payouts')
export class Payout {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({
    type: 'enum',
    enum: PaymentMethod,
  })
  paymentMethod!: PaymentMethod;  // moyen de paiement (image 2)

  @Column('decimal', { precision: 15, scale: 2 })
  amount!: number;                // montant à payer

  @Column({ nullable: true })
  motif?: string;                 // motif de reversement

  @Column({
    type: 'enum',
    enum: PayoutStatus,
    default: PayoutStatus.PENDING,
  })
  status!: PayoutStatus;

  @Column({ nullable: true })
  externalReference?: string;

  // Relation vers le propriétaire (user)
  @ManyToOne(() => User, (user) => user.payouts, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user!: User;

  @Column()
  userId!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}