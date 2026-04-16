# AMHS Frontend 배포 가이드

Oracle Cloud VM (Ubuntu, 952MB RAM + 4GB swap) 기준.

---

## 사전 준비

```bash
# Docker + Docker Compose 설치 확인
docker --version
docker compose version

# swap 확인 (4GB 이상 권장)
free -h
```

---

## 배포 절차

### 1. 소스 가져오기

```bash
# 최초
git clone https://github.com/SF-KONA/AMHS-frontend.git
cd AMHS-frontend

# 이후 업데이트
git pull origin develop
```

### 2. BE URL 설정

`.env.production` 파일을 생성하거나 수정:

```bash
# .env.production (Vite 빌드 시 자동으로 읽힘)
echo "VITE_API_BASE_URL=http://<BE서버IP>:8080" > .env.production
```

또는 docker-compose 환경변수로 override:

```bash
# .env 파일 (docker-compose가 읽음)
echo "VITE_API_BASE_URL=http://<BE서버IP>:8080" > .env
```

### 3. 빌드 & 실행

```bash
docker compose up -d --build
```

### 4. 확인

```bash
# 컨테이너 상태
docker compose ps

# 로그 확인
docker compose logs -f frontend

# 브라우저에서 접속
curl http://localhost
```

---

## BE URL 변경 시 재배포

Vite는 빌드 시점에 환경변수를 번들에 박아넣으므로, URL 변경 시 **재빌드** 필요:

```bash
# .env.production 수정 후
docker compose up -d --build
```

---

## 문제 해결

### 빌드 시 메모리 부족 (OOM Killed)

```bash
# 1. swap 확인
free -h

# 2. swap이 없거나 부족하면 추가
sudo fallocate -l 4G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile

# 영구 적용
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab

# 3. Dockerfile의 NODE_OPTIONS 조정 (기본 512MB)
# 더 줄여야 하면 256으로:
# ENV NODE_OPTIONS="--max-old-space-size=256"
```

### 포트 80 충돌

```bash
# 80 포트 사용 중인 프로세스 확인
sudo lsof -i :80

# docker-compose.yml에서 포트 변경
# ports:
#   - "3000:80"
```

### Nginx 로그 확인

```bash
# 접속 로그
docker compose exec frontend cat /var/log/nginx/access.log

# 에러 로그
docker compose exec frontend cat /var/log/nginx/error.log

# 실시간 로그
docker compose logs -f frontend
```

### 컨테이너 재시작

```bash
# 중지 후 재시작
docker compose down
docker compose up -d --build

# 이미지 캐시까지 삭제 후 재빌드
docker compose down --rmi local
docker compose up -d --build
```

---

## 이미지 크기 참고

| 레이어 | 크기 |
|---|---|
| nginx:alpine 베이스 | ~40 MB |
| dist/ 빌드 결과물 | ~2 MB |
| **최종 이미지** | **~42 MB** |

node_modules, 소스 코드는 최종 이미지에 포함되지 않음 (multi-stage build).
