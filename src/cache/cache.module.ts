import { Module } from '@nestjs/common';
import { CacheModule }  from '@nestjs/cache-manager';
import { CacheService } from './cache.service';
import { redisStore } from 'cache-manager-redis-yet';

@Module({
  imports: [
    CacheModule.registerAsync({
      isGlobal: true,
      useFactory: async () => {
        // Se não houver REDIS_HOST definido, usa o cache em memória padrão do Nest (sem Redis)
        const redisHost = process.env.REDIS_HOST;
        if (!redisHost) {
          return {};
        }

        const redisPortEnv = process.env.REDIS_PORT;
        const parsedPort = Number(redisPortEnv);
        const redisPort = Number.isFinite(parsedPort) ? parsedPort : 6379;

        console.log('redisHost', redisHost);
        console.log('redisPort', redisPort);
        const store = await redisStore({
          socket: {
            host: redisHost,
            port: redisPort,
            tls: false,
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
