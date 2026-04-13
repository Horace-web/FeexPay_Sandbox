import { IsEmail, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ example: 'horace@feexpay.com' })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: 'motdepasse123', minLength: 6 })
  @IsString()
  @MinLength(6)
  password!: string;

  @ApiProperty({ example: 'Horace' })
  @IsString()
  firstName!: string;

  @ApiProperty({ example: 'OAO' })
  @IsString()
  lastName!: string;

  @ApiProperty({ example: 'SeedSarl', required: false })
  @IsString()
  EnterpriseName?: string;
}