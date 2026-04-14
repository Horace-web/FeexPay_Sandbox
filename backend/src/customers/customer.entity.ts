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

@Entity('customers')
export class Customer {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  lastName!: string;            // "Nom" (image 1)

  @Column()
  firstName!: string;           // "Prénoms"

  @Column()
  phoneNumber!: string;         // ex: "+22966000000"

  @Column({ nullable: true, unique: true })
  email?: string;               // optionnel (image 1)

  @Column({ nullable: true })
  photoUrl?: string;            // URL de la photo de profil

  // Relation vers le propriétaire (user)
  @ManyToOne(() => User, (user) => user.customers, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user!: User;

  @Column()
  userId!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}