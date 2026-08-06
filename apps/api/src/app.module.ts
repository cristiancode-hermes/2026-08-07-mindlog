import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { EntriesModule } from './entries/entries.module';
import { TagsModule } from './tags/tags.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { SeedModule } from './seed/seed.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'better-sqlite3',
      database: 'data/mindlog.db',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    AuthModule,
    UsersModule,
    EntriesModule,
    TagsModule,
    AnalyticsModule,
    SeedModule,
  ],
})
export class AppModule {}
