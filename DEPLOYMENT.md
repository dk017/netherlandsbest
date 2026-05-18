# NetherlandsBest.nl Deployment

## Environment

Create `.env` on the VPS:

```bash
DATABASE_URL="file:./dev.db"
ADMIN_PASSWORD="replace-with-a-long-password"
NEXT_PUBLIC_SITE_URL="https://netherlandsbest.nl"
NEXT_PUBLIC_ANALYTICS_SRC=""
```

## GitHub Actions Deploy

Builds should happen in GitHub Actions. Hetzner should only receive the built standalone output and restart PM2.

Required GitHub secrets:

```text
HETZNER_HOST=65.108.243.208
HETZNER_USER=root
HETZNER_SSH_KEY=<private SSH key that can access the server>
```

Run the workflow:

```bash
gh workflow run "Build and deploy" \
  --repo dk017/netherlandsbest \
  --ref main \
  -f deploy=true \
  -f deploy_dir=/opt/netherlandsbest
```

Watch it:

```bash
gh run watch --repo dk017/netherlandsbest --exit-status
```

The workflow builds `.next/standalone` on GitHub, deploys it under `/opt/netherlandsbest/releases/<sha>`, updates `/opt/netherlandsbest/current`, and restarts PM2 with `server.js`.

Persistent production data lives outside releases:

```text
/opt/netherlandsbest/shared/dev.db
/opt/netherlandsbest/shared/uploads
```

## First Manual Deploy

Use this only if GitHub Actions is unavailable.

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
