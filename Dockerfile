########################
# Stage 1: Build
########################
FROM node:22.12-alpine AS builder

WORKDIR /app

# Dependências do sistema necessárias para o Prisma Client em Alpine
RUN apk add --no-cache openssl libc6-compat

# Copiar arquivos essenciais para instalar dependências e buildar
COPY package*.json ./
COPY tsconfig*.json ./
COPY nest-cli.json ./
COPY prisma ./prisma/
COPY src ./src

# Instalar TODAS as dependências (incluindo dev) para conseguir rodar o build
RUN npm ci

# Gerar Prisma Client e buildar a aplicação
RUN npx prisma generate
RUN npm run build

# Remover devDependencies para deixar apenas dependências de produção
RUN npm prune --omit=dev

########################
# Stage 2: Production
########################
FROM node:22.12-alpine AS production

WORKDIR /app

ENV NODE_ENV=production

# Mesmas libs usadas no build (necessárias para o Prisma Client)
RUN apk add --no-cache openssl libc6-compat

# Copiar apenas o que é necessário para rodar em produção
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/dist ./dist
COPY package*.json ./

# Criar usuário não-root para segurança
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nestjs -u 1001 && \
    chown -R nestjs:nodejs /app

USER nestjs

# Expor porta da aplicação Nest
EXPOSE 3000

# Start da aplicação (usa o mesmo comando do script start:prod)
CMD ["node", "dist/main.js"]