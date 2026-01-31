import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { LocalStrategy } from './strategies/local.strategy';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt.strategy';
import { AppCacheModule } from 'src/cache/cache.module';
import { CompaniesModule } from 'src/companies/companies.module';

@Module({
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  imports: [
    UsersModule, 
    CompaniesModule,
    JwtModule.register(
      {
        secret: process.env.JWT_SECRET,
        signOptions: {
          expiresIn: Number(process.env.JWT_EXPIRES_IN) //? 7 Dias de expiração
        }
      }
    ),
    AppCacheModule
  ]
})
export class AuthModule {}
