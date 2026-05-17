# NetherlandsBest.nl Deployment

## Environment

Create `.env` on the VPS:

```bash
DATABASE_URL="file:./dev.db"
ADMIN_PASSWORD="replace-with-a-long-password"
NEXT_PUBLIC_SITE_URL="https://netherlandsbest.nl"
NEXT_PUBLIC_ANALYTICS_SRC=""
```

## First deploy

```bash
npm ci
npm run db:push
npm run db:seed
npm run build
PORT=3002 pm2 start ecosystem.config.cjs
pm2 save
```

## Caddy

Copy `Caddyfile` to `/etc/caddy/Caddyfile`, then reload:

```bash
sudo caddy validate --config /etc/caddy/Caddyfile
sudo systemctl reload caddy
```

## Updates

```bash
git pull
npm ci
npm run db:push
npm run build
pm2 reload netherlandsbest
```
