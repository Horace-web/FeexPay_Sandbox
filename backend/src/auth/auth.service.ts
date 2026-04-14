import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    // Vérifie si l'email existe déjà
    const existing = await this.usersService.findByEmail(dto.email);
    if (existing) {
      throw new ConflictException('Cet email est déjà utilisé');
    }

    // Hash du mot de passe
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    // Création de l'utilisateur
    const user = await this.usersService.create({
      email: dto.email,
      password: hashedPassword,
      firstName: dto.firstName,
      lastName: dto.lastName,
      enterpriseName: dto.EnterpriseName,
    });

    // Génération du token
    const token = this.generateToken(user.id, user.email);

    return {
      message: 'Inscription réussie',
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        EnterpriseName: user.enterpriseName,
      },
    };
  }

  async login(dto: LoginDto) {
    // Cherche l'utilisateur
    const user = await this.usersService.findByEmail(dto.email);
    if (!user) {
      throw new UnauthorizedException('Email ou mot de passe incorrect');
    }

    // Vérifie le mot de passe
    const isMatch = await bcrypt.compare(dto.password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Email ou mot de passe incorrect');
    }

    const token = this.generateToken(user.id, user.email);

    return {
      message: 'Connexion réussie',
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        enterpriseName: user.enterpriseName,
      },
    };
  }

  private generateToken(userId: string, email: string) {
    return this.jwtService.sign({ sub: userId, email });
  }
}