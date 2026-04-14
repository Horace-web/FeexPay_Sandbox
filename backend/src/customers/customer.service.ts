import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Customer } from './customer.entity';
import { CreateCustomerDto } from './dto/create-customer.dto';

@Injectable()
export class CustomersService {
  constructor(
    @InjectRepository(Customer)
    private readonly customerRepo: Repository<Customer>,
  ) {}

  async create(userId: string, dto: CreateCustomerDto): Promise<Customer> {
    // Vérifie si l'email est déjà utilisé pour ce user
    if (dto.email) {
      const existing = await this.customerRepo.findOne({
        where: { email: dto.email, userId },
      });
      if (existing) throw new ConflictException('Un client avec cet email existe déjà');
    }

    const customer = this.customerRepo.create({ ...dto, userId });
    return this.customerRepo.save(customer);
  }

  async findAll(userId: string): Promise<Customer[]> {
    return this.customerRepo.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(userId: string, id: string): Promise<Customer> {
    const customer = await this.customerRepo.findOne({
      where: { id, userId },
    });
    if (!customer) throw new NotFoundException('Client introuvable');
    return customer;
  }

  async remove(userId: string, id: string): Promise<{ message: string }> {
    const customer = await this.findOne(userId, id);
    await this.customerRepo.remove(customer);
    return { message: 'Client supprimé avec succès' };
  }
}