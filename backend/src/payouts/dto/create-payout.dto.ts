import { IsString, IsNotEmpty, IsNumber, IsPositive, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PaymentMethod } from '../payout.entity';

export class CreatePayoutDto {
  @ApiProperty({
    enum: PaymentMethod,
    example: PaymentMethod.MOBILE_MONEY,
    description: 'Moyen de paiement',
  })
  @IsEnum(PaymentMethod)
  paymentMethod!: PaymentMethod;

  @ApiProperty({ example: 5000, description: 'Montant à reverser en FCFA' })
  @IsNumber()
  @IsPositive()
  amount!: number;

  @ApiPropertyOptional({ example: 'Reversement commissions Mars', description: 'Motif du reversement' })
  @IsString()
  @IsOptional()
  motif?: string;
}