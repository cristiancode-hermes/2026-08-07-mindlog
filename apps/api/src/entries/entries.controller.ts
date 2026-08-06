import { Controller, Get, Post, Put, Delete, Param, Query, Body, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { EntriesService } from './entries.service';
import { CreateEntryDto, UpdateEntryDto } from './entry.dto';

@ApiTags('Entries')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('entries')
export class EntriesController {
  constructor(private entries: EntriesService) {}

  @Get()
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'tag', required: false })
  @ApiQuery({ name: 'mood', required: false })
  @ApiQuery({ name: 'search', required: false })
  findAll(
    @Req() req: any,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('tag') tag?: string,
    @Query('mood') mood?: number,
    @Query('search') search?: string,
  ) {
    return this.entries.findByUser(req.user.id, page || 1, limit || 20, tag, mood ? +mood : undefined, search);
  }

  @Get('date/:date')
  findByDate(@Req() req: any, @Param('date') date: string) {
    return this.entries.findByDate(req.user.id, date);
  }

  @Get(':id')
  findOne(@Req() req: any, @Param('id') id: string) {
    return this.entries.findById(req.user.id, id);
  }

  @Post()
  create(@Req() req: any, @Body() dto: CreateEntryDto) {
    return this.entries.create(req.user.id, dto);
  }

  @Put(':id')
  update(@Req() req: any, @Param('id') id: string, @Body() dto: UpdateEntryDto) {
    return this.entries.update(req.user.id, id, dto);
  }

  @Delete(':id')
  remove(@Req() req: any, @Param('id') id: string) {
    return this.entries.delete(req.user.id, id);
  }
}
