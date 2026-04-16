# ============================================================
# AMHS Frontend — Multi-stage Docker Build
# 최종 이미지: nginx:alpine (~40 MB)
# ============================================================

# ---------- Stage 1: Build ----------
FROM node:20-alpine AS builder

WORKDIR /app

# 의존성 캐싱 레이어 (소스 변경 시 npm ci 재실행 방지)
COPY package.json package-lock.json ./
RUN npm ci --ignore-scripts

# 소스 복사 + 빌드
COPY . .

# Vite 빌드 시 메모리 제한 (Oracle Cloud VM 952 MB 대응)
# .env.production이 있으면 VITE_API_BASE_URL을 거기서 읽음
# docker-compose build args로 override 가능
ARG VITE_API_BASE_URL=http://localhost:8080
ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}
ENV NODE_OPTIONS="--max-old-space-size=512"

RUN npm run build

# ---------- Stage 2: Serve ----------
FROM nginx:alpine

# Nginx 커스텀 설정 (SPA 라우팅 + gzip + 캐싱)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 빌드 결과물만 복사
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
