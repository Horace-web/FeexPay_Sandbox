import {
  Controller, Post, Get, Patch, Param, Body, UseGuards, Request
} from '@nestjs/common';
import {
  ApiTags, ApiOperation, ApiResponse,
  ApiBearerAuth, ApiParam
} from '@nestjs/swagger';
import { PayoutsService } from './payout.service';
import { CreatePayoutDto } from './dto/create-payout.dto';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';

@ApiTags('Payouts')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('payouts')
export class PayoutsController {
  constructor(private readonly payoutsService: PayoutsService) {}

  // Étape 1 — Initier un reversement
  @Post()
  @ApiOperation({ summary: 'Initier un nouveau reversement (étape 1)' })
  @ApiResponse({ status: 201, description: 'Reversement initié avec statut pending' })
  @ApiResponse({ status: 400, description: 'Données invalides' })
  @ApiResponse({ status: 401, description: 'Non authentifié' })
  create(@Request() req, @Body() dto: CreatePayoutDto) {
    return this.payoutsService.create(req.user.id, dto);
  }

  // Étape 2 — Confirmer un reversement
  @Patch(':id/confirm')
  @ApiOperation({ summary: 'Confirmer un reversement (étape 2)' })
  @ApiParam({ name: 'id', description: 'UUID du reversement' })
  @ApiResponse({ status: 200, description: 'Reversement confirmé avec statut success' })
  @ApiResponse({ status: 401, description: 'Non authentifié' })
  @ApiResponse({ status: 404, description: 'Reversement introuvable' })
  confirm(@Request() req, @Param('id') id: string) {
    return this.payoutsService.confirm(req.user.id, id);
  }

  @Get()
  @ApiOperation({ summary: 'Lister tous mes reversements' })
  @ApiResponse({ status: 200, description: 'Liste des reversements' })
  @ApiResponse({ status: 401, description: 'Non authentifié' })
  findAll(@Request() req) {
    return this.payoutsService.findAll(req.user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Détail d\'un reversement' })
  @ApiParam({ name: 'id', description: 'UUID du reversement' })
  @ApiResponse({ status: 200, description: 'Reversement trouvé' })
  @ApiResponse({ status: 401, description: 'Non authentifié' })
  @ApiResponse({ status: 404, description: 'Reversement introuvable' })
  findOne(@Request() req, @Param('id') id: string) {
    return this.payoutsService.findOne(req.user.id, id);
  }

  @Patch(':id/cancel')
  @ApiOperation({ summary: 'Annuler un reversement' })
  @ApiParam({ name: 'id', description: 'UUID du reversement' })
  @ApiResponse({ status: 200, description: 'Reversement annulé' })
  @ApiResponse({ status: 401, description: 'Non authentifié' })
  @ApiResponse({ status: 404, description: 'Reversement introuvable' })
  cancel(@Request() req, @Param('id') id: string) {
    return this.payoutsService.cancel(req.user.id, id);
  }
}