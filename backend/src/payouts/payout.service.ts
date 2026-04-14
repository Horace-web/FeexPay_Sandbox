import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payout, PayoutStatus } from './payout.entity';
import { CreatePayoutDto } from './dto/create-payout.dto';

@Injectable()
export class PayoutsService {
  constructor(
    @InjectRepository(Payout)
    private readonly payoutRepo: Repository<Payout>,
  ) {}

  // Étape 1 : initier le reversement (status = pending)
  async create(userId: string, dto: CreatePayoutDto): Promise<Payout> {
    const payout = this.payoutRepo.create({
      ...dto,
      userId,
      status: PayoutStatus.PENDING,
    });
    return this.payoutRepo.save(payout);
  }

  // Étape 2 : confirmer le reversement (status = success)
  async confirm(userId: string, id: string): Promise<Payout> {
    const payout = await this.payoutRepo.findOne({ where: { id, userId } });
    if (!payout) throw new NotFoundException('Reversement introuvable');
    payout.status = PayoutStatus.SUCCESS;
    return this.payoutRepo.save(payout);
  }

  async findAll(userId: string): Promise<Payout[]> {
    return this.payoutRepo.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(userId: string, id: string): Promise<Payout> {
    const payout = await this.payoutRepo.findOne({ where: { id, userId } });
    if (!payout) throw new NotFoundException('Reversement introuvable');
    return payout;
  }

  async cancel(userId: string, id: string): Promise<Payout> {
    const payout = await this.payoutRepo.findOne({ where: { id, userId } });
    if (!payout) throw new NotFoundException('Reversement introuvable');
    payout.status = PayoutStatus.CANCELLED;
    return this.payoutRepo.save(payout);
  }
}