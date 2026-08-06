import { Controller, Get, Put, Body, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UsersService } from './users.service';

@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private users: UsersService) {}

  @Get('me')
  getProfile(@Req() req: any) {
    const { passwordHash, ...user } = req.user;
    return user;
  }

  @Put('me')
  updateProfile(@Req() req: any, @Body() body: { displayName?: string }) {
    return this.users.updateProfile(req.user.id, body);
  }
}
