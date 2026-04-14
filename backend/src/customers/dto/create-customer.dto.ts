import { IsString, IsNotEmpty, IsOptional, IsEmail } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCustomerDto {
  @ApiProperty({ example: 'ODOUNLAMI', description: 'Nom du client' })
  @IsString()
  @IsNotEmpty()
  lastName!: string;

  @ApiProperty({ example: 'Horace', description: 'Prénom(s) du client' })
  @IsString()
  @IsNotEmpty()
  firstName!: string;

  @ApiProperty({ example: '66000000', description: 'Numéro de téléphone (sans indicatif)' })
  @IsString()
  @IsNotEmpty()
  phoneNumber!: string;

  @ApiPropertyOptional({ example: 'horace@email.com', description: 'Email (optionnel)' })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiPropertyOptional({ description: 'URL photo de profil (optionnel)' })
  @IsString()
  @IsOptional()
  photoUrl?: string;
}