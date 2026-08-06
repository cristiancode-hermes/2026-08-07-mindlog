import { Controller, Get, Post, Delete, Param, Body, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { TagsService } from './tags.service';

@ApiTags('Tags')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('tags')
export class TagsController {
  constructor(private tags: TagsService) {}

  @Get()
  findAll(@Req() req: any) {
    return this.tags.findByUser(req.user.id);
  }

  @Post()
  create(@Req() req: any, @Body() body: { name: string; color?: string }) {
    return this.tags.create(req.user.id, body.name, body.color);
  }

  @Delete(':id')
  remove(@Req() req: any, @Param('id') id: string) {
    return this.tags.delete(req.user.id, id);
  }
}
