import { IsString, IsNotEmpty, IsNumber, IsPositive, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateTransactionDto {
  @ApiProperty({ example: '66000000', description: 'Numéro mobile money (sans indicatif)' })
  @IsString()
  @IsNotEmpty()
  phoneNumber!: string;

  @ApiProperty({ example: 500, description: 'Montant en FCFA' })
  @IsNumber()
  @IsPositive()
  amount!: number;

  @ApiPropertyOptional({ example: 'Paiement commande #123', description: 'Description optionnelle' })
  @IsString()
  @IsOptional()
  description?: string;
}