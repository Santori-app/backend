import { Module } from '@nestjs/common';
import { CacheModule }  from '@nestjs/cache-manager';
import { CacheService } from './cache.service';
import { redisStore } from 'cache-manager-redis-yet';

@Module({
  imports: [
    CacheModule.registerAsync({
      isGlobal: true,
      useFactory: async () => {
        const store = await redisStore({
          socket: {
            host: process.env.REDIS_HOST ?? 'localhost',
            port: parseInt(process.env.REDIS_PORT ?? '6379'),
            tls: false
          },
          //! username: process.env.REDIS_USER, SOMENTE EM PRODUÇÃO COM TLS TRUE E REDIS_USER E REDIS_PASSWORD NO ENV
          //! password: process.env.REDIS_PASSWORD, SOMENTE EM PRODUÇÃO COM TLS TRUE E REDIS_USER E REDIS_PASSWORD NO ENV
        });
        return {
          store: () => store,
        };
      },
    }),
  ],
  controllers: [],
  providers: [CacheService],
  exports: [CacheService]
})
export class AppCacheModule {}
