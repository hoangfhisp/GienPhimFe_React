# Enterprise Production Deployment Guide

## 1. Overview

This guide outlines production deployment procedures for the GienPhim React application. It covers automated containerization using Docker, Nginx web server tuning with SPA routing fallback, WebSocket proxying for SignalR, and runtime configuration management.

---

## 2. Prerequisites & Environment Setup

### 2.1 Runtime Requirements
- **Node.js**: Version 18.x or 20.x LTS
- **Package Manager**: npm (v9+) or yarn (v1.22+)
- **Container Runtime**: Docker Engine 24.0+ / Docker Compose v2+
- **Reverse Proxy**: Nginx 1.24+ (with HTTP/2 and WebSocket support)

---

## 3. Local Production Build Pipeline

Execute the following commands to create a minified, production-optimized asset bundle:

```bash
# Step 1: Install exact dependency tree
npm ci

# Step 2: Configure production environment variables
cp .env.example .env.production
# Edit .env.production with production backend URLs and credentials

# Step 3: Compile optimized production build
npm run build
```

The resulting assets will be emitted to the `build/` directory with cryptographic content hashing on all filenames.

---

## 4. Multi-Stage Docker Containerization

Deploying via multi-stage Docker ensures a minimal final image size (under 30MB) containing only the static runtime web server.

### 4.1 Production Dockerfile

```dockerfile
# ==============================================================================
# STAGE 1: Compilation & Asset Build
# ==============================================================================
FROM node:20-alpine AS builder

WORKDIR /app

# Copy dependency manifests
COPY package.json package-lock.json ./

# Install clean dependencies
RUN npm ci

# Copy project source code
COPY . .

# Build-time environment arguments
ARG REACT_APP_GIENPHIM_BE_API_URL
ARG REACT_APP_GIENPHIM_BE_URL
ARG REACT_APP_GOOGLE_CLIENT_ID

ENV REACT_APP_GIENPHIM_BE_API_URL=$REACT_APP_GIENPHIM_BE_API_URL
ENV REACT_APP_GIENPHIM_BE_URL=$REACT_APP_GIENPHIM_BE_URL
ENV REACT_APP_GOOGLE_CLIENT_ID=$REACT_APP_GOOGLE_CLIENT_ID
ENV NODE_ENV=production

# Compile static assets
RUN npm run build

# ==============================================================================
# STAGE 2: High-Performance Nginx Web Server
# ==============================================================================
FROM nginx:1.25-alpine

# Remove default configuration
RUN rm -rf /etc/nginx/conf.d/default.conf

# Copy custom enterprise Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/gienphim.conf

# Copy compiled static assets from builder stage
COPY --from=builder /app/build /usr/share/nginx/html

# Expose standard HTTP/HTTPS ports
EXPOSE 80 443

# Start Nginx in foreground
CMD ["nginx", "-g", "daemon off;"]
```

### 4.2 Docker Compose Configuration (`docker-compose.yml`)

```yaml
version: '3.8'

services:
  gienphim-frontend:
    build:
      context: .
      dockerfile: Dockerfile
      args:
        REACT_APP_GIENPHIM_BE_API_URL: "https://api.gienphim.com/api"
        REACT_APP_GIENPHIM_BE_URL: "https://api.gienphim.com/"
        REACT_APP_GOOGLE_CLIENT_ID: "645483323057-c6q3bkj13crooeo2mdofa271shf2h17s.apps.googleusercontent.com"
    container_name: gienphim_ui_prod
    restart: always
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - /etc/letsencrypt:/etc/letsencrypt:ro
    networks:
      - gienphim_network

networks:
  gienphim_network:
    driver: bridge
```

---

## 5. Production Nginx Configuration (`nginx.conf`)

The configuration below ensures seamless client-side SPA routing and establishes WebSocket upgrades for SignalR connections.

```nginx
server {
    listen 80;
    server_name gienphim.com www.gienphim.com;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    server_name gienphim.com www.gienphim.com;

    # SSL Configuration
    ssl_certificate /etc/letsencrypt/live/gienphim.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/gienphim.com/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;

    root /usr/share/nginx/html;
    index index.html;

    # Gzip Compression Tuning
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied expired no-cache no-store private auth;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/json application/xml image/svg+xml;

    # Immutable Asset Caching (JS / CSS / Fonts / Images)
    location ~* \.(?:css|js|woff2?|eot|ttf|otf|png|jpg|jpeg|gif|ico|svg|webp)$ {
        expires 1y;
        add_header Cache-Control "public, max-age=31536000, immutable";
        access_log off;
    }

    # SPA Routing Fallback
    location / {
        try_files $uri $uri/ /index.html;
        add_header Cache-Control "no-cache, no-store, must-revalidate";
    }

    # SignalR WebSocket Reverse Proxy (Optional if routed through same host)
    location /watchPartyHub {
        proxy_pass http://backend-upstream:5000/watchPartyHub;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 3600s;
        proxy_send_timeout 3600s;
    }
}
```

---

## 6. Production Verification Checklist

1. **Verify SPA Routing**: Refreshing deep nested routes (e.g. `/XemPhim/45/tap-01` or `/admin/Tong-Quan`) must not trigger HTTP 404.
2. **Verify SignalR Hub Connectivity**: Inspect browser Developer Tools Network tab; verify status code `101 Switching Protocols` on the `/watchPartyHub` connection.
3. **Verify Token Rotation**: Allow access token to expire; confirm background dispatch of `/auth/refreshToken` without session termination.
4. **Verify Asset Caching**: Check response headers on `.js` bundles for `Cache-Control: public, max-age=31536000, immutable`.
