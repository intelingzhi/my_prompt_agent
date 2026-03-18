# 构建阶段
FROM node:20-alpine AS builder

WORKDIR /app

# 复制依赖说明（包含 package-lock.json）
COPY package.json package-lock.json ./

# 使用 npm ci，保证和本地锁文件一致
RUN npm ci

# 复制源代码
COPY . .

# 构建 Next.js 应用
RUN npm run build

# 运行阶段
FROM node:20-alpine AS runner

WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000

# 从构建阶段复制 standalone 产物
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
# 如果项目里有 public 目录，可以加上这一行；没有就不要写：
# COPY --from=builder /app/public ./public

EXPOSE 3000

CMD ["node", "server.js"]
