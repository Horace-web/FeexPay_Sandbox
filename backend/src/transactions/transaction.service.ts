import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction, TransactionStatus } from './transaction.entity';
import { CreateTransactionDto } from './dto/create-transaction.dto';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepo: Repository<Transaction>,
  ) {}

  // Créer une nouvelle transaction
  async create(userId: string, dto: CreateTransactionDto): Promise<Transaction> {
    const transaction = this.transactionRepo.create({
      ...dto,
      userId,
      status: TransactionStatus.PENDING,
    });
    return this.transactionRepo.save(transaction);
  }

  // Lister toutes les transactions d'un user
  async findAll(userId: string): Promise<Transaction[]> {
    return this.transactionRepo.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  // Détail d'une transaction
  async findOne(userId: string, id: string): Promise<Transaction> {
    const transaction = await this.transactionRepo.findOne({
      where: { id, userId },
    });
    if (!transaction) throw new NotFoundException('Transaction introuvable');
    return transaction;
  }

  // Mettre à jour le statut (ex: webhook provider)
  async updateStatus(id: string, status: TransactionStatus): Promise<Transaction> {
    const transaction = await this.transactionRepo.findOne({ where: { id } });
    if (!transaction) throw new NotFoundException('Transaction introuvable');
    transaction.status = status;
    return this.transactionRepo.save(transaction);
  }
}