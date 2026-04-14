import {
  Controller, Post, Get, Delete,
  Param, Body, UseGuards, Request
} from '@nestjs/common';
import {
  ApiTags, ApiOperation, ApiResponse,
  ApiBearerAuth, ApiParam
} from '@nestjs/swagger';
import { CustomersService } from './customer.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';

@ApiTags('Customers')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Post()
  @ApiOperation({ summary: 'Ajouter un nouveau client' })
  @ApiResponse({ status: 201, description: 'Client créé avec succès' })
  @ApiResponse({ status: 400, description: 'Données invalides' })
  @ApiResponse({ status: 401, description: 'Non authentifié' })
  @ApiResponse({ status: 409, description: 'Email déjà utilisé' })
  create(@Request() req, @Body() dto: CreateCustomerDto) {
    return this.customersService.create(req.user.id, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Lister tous mes clients' })
  @ApiResponse({ status: 200, description: 'Liste des clients' })
  @ApiResponse({ status: 401, description: 'Non authentifié' })
  findAll(@Request() req) {
    return this.customersService.findAll(req.user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Détail d\'un client' })
  @ApiParam({ name: 'id', description: 'UUID du client' })
  @ApiResponse({ status: 200, description: 'Client trouvé' })
  @ApiResponse({ status: 401, description: 'Non authentifié' })
  @ApiResponse({ status: 404, description: 'Client introuvable' })
  findOne(@Request() req, @Param('id') id: string) {
    return this.customersService.findOne(req.user.id, id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Supprimer un client' })
  @ApiParam({ name: 'id', description: 'UUID du client' })
  @ApiResponse({ status: 200, description: 'Client supprimé' })
  @ApiResponse({ status: 401, description: 'Non authentifié' })
  @ApiResponse({ status: 404, description: 'Client introuvable' })
  remove(@Request() req, @Param('id') id: string) {
    return this.customersService.remove(req.user.id, id);
  }
}