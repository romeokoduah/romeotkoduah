# Deployment

The site runs as a **Next.js standalone server under PM2**, proxied by nginx —
the same pattern as the other eight apps on the box.

| | |
|---|---|
| Server | `root@169.58.42.182` (Ubuntu 24.04) |
| App name | `romeotkoduah` (PM2) |
| Port | 3008 |
| App directory | `/var/www/romeotkoduah-app` |
| Uploads | `/var/www/romeotkoduah-media`, served at `/media/` |
| Secrets | `/root/romeotkoduah.env` (mode 600) |
| Database | Postgres `romeotkoduah`, role `romeotkoduah` |

## Everyday deploy

```powershell
./deploy.ps1              # build, upload, pm2 reload, verify
./deploy.ps1 -Migrate     # same, and run pending migrations first
./deploy.ps1 -SkipBuild   # ship the existing build
```

The script unpacks into a staging directory and swaps, so a failed upload
leaves the running app untouched.

**Why the script copies extra directories:** Next's standalone output
deliberately omits `.next/static` and `public/`. They must sit beside
`server.js` or every stylesheet, font and image 404s. `deploy.ps1` copies both,
minus `public/media`, which lives on the server and holds uploads.

## First-time setup on a new server

```bash
# 1. Database and role
sudo -u postgres createuser --pwprompt romeotkoduah
sudo -u postgres createdb -O romeotkoduah romeotkoduah
sudo -u postgres psql -d romeotkoduah -c 'GRANT ALL ON SCHEMA public TO romeotkoduah;'

# 2. Secrets — never in the repo
cat > /root/romeotkoduah.env <<'EOF'
DATABASE_URL=postgres://romeotkoduah:<password>@127.0.0.1:5432/romeotkoduah
SESSION_SECRET=<openssl rand -base64 48 | tr -d '/+='>
IP_SALT=<openssl rand -base64 24 | tr -d '/+='>
REDIS_URL=redis://127.0.0.1:6379
MEDIA_DIR=/var/www/romeotkoduah-media
MEDIA_BASE_URL=/media
NODE_ENV=production
PORT=3008
EOF
chmod 600 /root/romeotkoduah.env

mkdir -p /var/www/romeotkoduah-media /var/www/romeotkoduah-app
```

Then deploy with `./deploy.ps1 -Migrate`, and create the admin account:

```bash
cd /var/www/romeotkoduah-app
set -a; . /root/romeotkoduah.env; set +a
node scripts/create-admin.mjs romeo.tweneboahkoduah@gmail.com \
  --out /root/romeotkoduah-admin-initial-password
```

The password is generated on the server and written to that file with mode 600.
Only its argon2 hash is stored. Read it over SSH, sign in at `/admin`, and
change it — the plaintext file can be deleted afterwards.

## nginx

The vhost proxies to the app and serves uploads directly:

```nginx
location ^~ /media/ {
    alias /var/www/romeotkoduah-media/;
    add_header Cache-Control "public, max-age=2592000" always;
    access_log off;
    try_files $uri =404;
}

location / {
    proxy_pass http://127.0.0.1:3008;
    proxy_http_version 1.1;
    proxy_set_header Upgrade            $http_upgrade;
    proxy_set_header Connection         'upgrade';
    proxy_set_header Host               $host;
    proxy_set_header X-Real-IP          $remote_addr;
    proxy_set_header X-Forwarded-For    $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto  $scheme;
    proxy_cache_bypass $http_upgrade;
    proxy_read_timeout 60s;
}
```

`X-Forwarded-For` matters: rate limiting and the stored comment IP hash both
read it. Without it every visitor looks like `127.0.0.1` and the limiter would
throttle everyone at once.

Always `nginx -t` before `systemctl reload nginx`. Never `restart` — the box
runs nine other production sites.

## Rolling back

The previous static build is still on disk at `/var/www/romeotkoduah.org`. To
fall back, point the vhost `root` there and remove the `proxy_pass` block. Keep
the `/media/` location either way.

## Logs

```bash
pm2 logs romeotkoduah --lines 50
pm2 describe romeotkoduah
```
