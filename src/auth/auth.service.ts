import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CacheService } from 'src/cache/cache.service';
import { UserPayload } from 'src/common/interfaces/UserPayload';
import { UserToken } from 'src/common/interfaces/UserToken';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { PasswordHashUtils } from 'src/utils/PasswordHash.utils';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService, 
    private readonly jwtService: JwtService,
    private readonly cacheManager: CacheService
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);

    if (user) {
      const isPasswordValid = PasswordHashUtils.isValid(password, user.password);

      if (isPasswordValid) {
        delete user.password;

        return user;
      }
    }

    throw new Error('Email address or password provided is incorrect.');
  }

  login(user: User): UserToken {
    const payload : UserPayload = {
      sub: user.id,
      email: user.email,
      name: user.name
    };

    const jwtToken = this.jwtService.sign(payload);

    return {
      access_token: jwtToken
    }
  }

  async logout(jwt: string) {
    await this.cacheManager.storeData(jwt);
  }
}
