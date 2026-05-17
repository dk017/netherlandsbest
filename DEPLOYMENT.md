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

The current Hetzner server for the related apps uses Nginx on ports 80/443, with WerkCV reverse-proxied to port 3001.
Deploy NetherlandsBest on local port `3002` to avoid the existing apps.

## Nginx

Copy `nginx.netherlandsbest.conf` to `/etc/nginx/sites-available/netherlandsbest.nl`, symlink it, and reload:

```bash
sudo ln -s /etc/nginx/sites-available/netherlandsbest.nl /etc/nginx/sites-enabled/netherlandsbest.nl
sudo nginx -t
sudo systemctl reload nginx
sudo certbot --nginx -d netherlandsbest.nl -d www.netherlandsbest.nl
```

## Updates

```bash
git pull
npm ci
npm run db:push
npm run build
pm2 reload netherlandsbest
```
