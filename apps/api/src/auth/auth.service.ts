import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User } from '../users/user.entity';
import { RegisterDto, LoginDto } from './auth.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const existing = await this.userRepo.findOne({
      where: [{ username: dto.username }, { email: dto.email }],
    });
    if (existing) throw new ConflictException('Username or email already exists');

    const passwordHash = await bcrypt.hash(dto.password, 10);
    const user = this.userRepo.create({ username: dto.username, email: dto.email, passwordHash, displayName: dto.displayName } as any);
    const saved = await this.userRepo.save(user);
    return this.generateToken(saved as unknown as User);
  }

  async login(dto: LoginDto) {
    const user = await this.userRepo.findOne({
      where: [{ username: dto.login }, { email: dto.login }],
    });
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const valid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!valid) throw new UnauthorizedException('Invalid credentials');

    return this.generateToken(user);
  }

  private generateToken(user: User) {
    const payload = { sub: user.id, username: user.username };
    return {
      accessToken: this.jwtService.sign(payload),
      user: { id: user.id, username: user.username, email: user.email, displayName: user.displayName },
    };
  }

  async validateUser(userId: string) {
    return this.userRepo.findOne({ where: { id: userId } });
  }
}
