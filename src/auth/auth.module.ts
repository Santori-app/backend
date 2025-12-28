import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { LocalStrategy } from './strategies/local.strategy';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt.strategy';
import { AppCacheModule } from 'src/cache/cache.module';

@Module({
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  imports: [
    UsersModule, 
    JwtModule.register(
      {
        secret: process.env.JWT_SECRET,
        signOptions: {
          expiresIn: '30d'
        }
      }
    ),
    AppCacheModule
  ]
})
export class AuthModule {}
