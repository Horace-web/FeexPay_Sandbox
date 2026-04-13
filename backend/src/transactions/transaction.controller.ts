import {
  Controller, Post, Get, Param, Body, UseGuards, Request
} from '@nestjs/common';
import {
  ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam
} from '@nestjs/swagger';
import { TransactionsService } from './transaction.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';

@ApiTags('Transactions')
@ApiBearerAuth() // ← indique que toutes les routes nécessitent un token JWT
@UseGuards(JwtAuthGuard)
@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post()
  @ApiOperation({ summary: 'Lancer une nouvelle transaction mobile money' })
  @ApiResponse({ status: 201, description: 'Transaction créée avec statut pending' })
  @ApiResponse({ status: 400, description: 'Données invalides' })
  @ApiResponse({ status: 401, description: 'Non authentifié' })
  create(@Request() req, @Body() dto: CreateTransactionDto) {
    return this.transactionsService.create(req.user.id, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Lister toutes mes transactions' })
  @ApiResponse({ status: 200, description: 'Liste des transactions de l\'utilisateur connecté' })
  @ApiResponse({ status: 401, description: 'Non authentifié' })
  findAll(@Request() req) {
    return this.transactionsService.findAll(req.user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Détail d\'une transaction' })
  @ApiParam({ name: 'id', description: 'UUID de la transaction' })
  @ApiResponse({ status: 200, description: 'Transaction trouvée' })
  @ApiResponse({ status: 401, description: 'Non authentifié' })
  @ApiResponse({ status: 404, description: 'Transaction introuvable' })
  findOne(@Request() req, @Param('id') id: string) {
    return this.transactionsService.findOne(req.user.id, id);
  }
}