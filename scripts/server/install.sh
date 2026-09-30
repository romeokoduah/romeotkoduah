#!/usr/bin/env bash
# Installs or updates the romeotkoduah.org Next.js app on the Contabo box.
# Uploaded and run by deploy.ps1 as root; safe to run again on every deploy.
#
#   bash install.sh <bundle.tgz> <posts.sql>
#
# Follows the post-rebuild layout (Sep 2026): a dedicated system user, a
# hardened systemd unit named app-<name>, bound to 127.0.0.1, nginx in front.
# Nothing here runs the app as root.
#
# First run only: creates the user, resets the romeotkoduah DB role password
# and writes /etc/romeotkoduah/app.env, hands the restored tables to that role,
# and replaces the static nginx vhost with a proxy (backed up first).
set -euo pipefail

BUNDLE=${1:?bundle path}
POSTS_SQL=${2:?posts sql path}

NAME=romeotkoduah
UNIT=app-$NAME
APP_USER=$NAME
DB=$NAME
DB_ROLE=$NAME
PORT=""   # chosen in preflight, then kept in the env file
DOMAIN=romeotkoduah.org
APP_DIR=/var/www/$NAME-app
MEDIA_DIR=/var/www/$NAME-media
ENV_DIR=/etc/$NAME
ENV_FILE=$ENV_DIR/app.env
VHOST=""   # located in the nginx step - the rebuild did not keep the old path
ADMIN_EMAIL=romeo.tweneboahkoduah@gmail.com
ADMIN_PW_FILE=/root/$NAME-admin-password.txt

step() { printf '\n==> %s\n' "$*"; }
ok()   { printf '    %s\n' "$*"; }
die()  { printf '\n!!  %s\n' "$*" >&2; exit 1; }

# ------------------------------------------------------------ preflight ----
step "Preflight"
NODE=$(command -v node) || die "node is not installed"
NODE_MAJOR=$("$NODE" -p 'process.versions.node.split(".")[0]')
[ "$NODE_MAJOR" -ge 18 ] || die "node $("$NODE" -v) is too old for Next 15 (need 18.18+)"
ok "node $("$NODE" -v) at $NODE"
command -v psql >/dev/null || die "psql missing"
sudo -u postgres psql -Atc 'select 1' >/dev/null || die "cannot reach Postgres as postgres"

# The port is chosen once, on the first install, and kept in the env file.
# A candidate is skipped if anything listens on it or any nginx config points
# at it - a stopped app still owns its port.
port_in_use() {
  [ -n "$(ss -ltnH "sport = :$1")" ] && return 0
  grep -rqsE "(127\.0\.0\.1|localhost):$1([^0-9]|\$)" /etc/nginx/ && return 0
  return 1
}
if [ -f "$ENV_FILE" ] && grep -q '^PORT=' "$ENV_FILE"; then
  PORT=$(grep -m1 '^PORT=' "$ENV_FILE" | cut -d= -f2)
  if [ -n "$(ss -ltnH "sport = :$PORT")" ] && ! systemctl is-active --quiet "$UNIT"; then
    die "port $PORT (from $ENV_FILE) is taken by something other than $UNIT: $(ss -ltnpH "sport = :$PORT")"
  fi
  ok "port $PORT (from $ENV_FILE)"
else
  PORT=""
  for p in $(seq 3010 3099); do
    if ! port_in_use "$p"; then PORT=$p; break; fi
  done
  [ -n "$PORT" ] || die "no free port between 3010 and 3099"
  ok "port $PORT is free - using it"
fi

# ----------------------------------------------------------------- user ----
step "User and directories"
if ! id "$APP_USER" >/dev/null 2>&1; then
  useradd --system --no-create-home --home-dir /nonexistent --shell /usr/sbin/nologin "$APP_USER"
  ok "created system user $APP_USER"
else
  ok "user $APP_USER exists"
fi
install -d -m 755 -o "$APP_USER" -g "$APP_USER" "$MEDIA_DIR"
install -d -m 750 -o root -g "$APP_USER" "$ENV_DIR"

# ------------------------------------------------------ database + env ----
step "Database and environment"
if [ ! -f "$ENV_FILE" ]; then
  DB_PW=$(openssl rand -hex 24)

  sudo -u postgres psql -v ON_ERROR_STOP=1 -q <<SQL
DO \$\$ BEGIN
  IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = '$DB_ROLE') THEN
    CREATE ROLE $DB_ROLE LOGIN;
  END IF;
END \$\$;
ALTER ROLE $DB_ROLE LOGIN PASSWORD '$DB_PW';
SQL

  if ! sudo -u postgres psql -Atc "select 1 from pg_database where datname='$DB'" | grep -q 1; then
    sudo -u postgres createdb -O "$DB_ROLE" "$DB"
    ok "created database $DB"
  fi

  # The restored tables belong to whoever ran the restore. Migrations ALTER
  # them, which needs ownership, so hand everything in public to the app role.
  sudo -u postgres psql -v ON_ERROR_STOP=1 -q -d "$DB" <<SQL
ALTER DATABASE $DB OWNER TO $DB_ROLE;
ALTER SCHEMA public OWNER TO $DB_ROLE;
DO \$\$ DECLARE r record; BEGIN
  FOR r IN SELECT tablename FROM pg_tables WHERE schemaname = 'public' LOOP
    EXECUTE format('ALTER TABLE public.%I OWNER TO $DB_ROLE', r.tablename);
  END LOOP;
  FOR r IN SELECT sequence_name FROM information_schema.sequences WHERE sequence_schema = 'public' LOOP
    EXECUTE format('ALTER SEQUENCE public.%I OWNER TO $DB_ROLE', r.sequence_name);
  END LOOP;
END \$\$;
CREATE EXTENSION IF NOT EXISTS pgcrypto;
SQL

  REDIS_LINE="# REDIS_URL unset - rate limiting fails open"
  if command -v redis-cli >/dev/null && redis-cli -h 127.0.0.1 ping 2>/dev/null | grep -q PONG; then
    REDIS_LINE="REDIS_URL=redis://127.0.0.1:6379"
  fi

  umask 027
  cat > "$ENV_FILE" <<ENV
# romeotkoduah.org - written by install.sh on $(date -u +%F). Root-owned, group-readable by the app.
NODE_ENV=production
HOSTNAME=127.0.0.1
PORT=$PORT
DATABASE_URL=postgres://$DB_ROLE:$DB_PW@127.0.0.1:5432/$DB
SESSION_SECRET=$(openssl rand -base64 48 | tr -d '\n=' | tr '+/' '-_')
IP_SALT=$(openssl rand -hex 16)
MEDIA_DIR=$MEDIA_DIR
MEDIA_BASE_URL=/media
$REDIS_LINE
ENV
  chown root:"$APP_USER" "$ENV_FILE"
  chmod 640 "$ENV_FILE"
  umask 022

  if [ -f /root/DB-CREDENTIALS.txt ]; then
    printf '\n%s (password reset %s by romeotkoduah install.sh): see %s\n' "$DB_ROLE" "$(date -u +%F)" "$ENV_FILE" >> /root/DB-CREDENTIALS.txt
  fi
  ok "wrote $ENV_FILE (new DB password, fresh secrets)"
else
  ok "$ENV_FILE exists - keeping it"
fi

set -a; . "$ENV_FILE"; set +a

# ------------------------------------------------------------ app files ----
step "Unpacking the build"
rm -rf "$APP_DIR.new"
mkdir -p "$APP_DIR.new"
tar -xzf "$BUNDLE" -C "$APP_DIR.new"
[ -f "$APP_DIR.new/server.js" ] || die "bundle has no server.js - nothing changed"
chown -R root:root "$APP_DIR.new"
chmod -R u=rwX,go=rX "$APP_DIR.new"
# Next writes its fetch/ISR cache here; everything else stays read-only.
install -d -m 755 -o "$APP_USER" -g "$APP_USER" "$APP_DIR.new/.next/cache"

# The natives in the bundle must be the Linux builds deploy.ps1 swapped in.
compgen -G "$APP_DIR.new/node_modules/@img/sharp-linux-x64*" >/dev/null || die "bundle lacks Linux sharp binaries - nothing changed"
compgen -G "$APP_DIR.new/node_modules/@node-rs/argon2-linux-x64*" >/dev/null || die "bundle lacks Linux argon2 binaries - nothing changed"

step "Migrations"
(cd "$APP_DIR.new" && runuser -u "$APP_USER" -- env DATABASE_URL="$DATABASE_URL" "$NODE" scripts/migrate.mjs)

step "Posts"
psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -q -f "$POSTS_SQL"

step "Admin account"
ADMINS=$(psql "$DATABASE_URL" -Atc 'select count(*) from admin_user')
if [ "$ADMINS" = "0" ]; then
  (cd "$APP_DIR.new" && env DATABASE_URL="$DATABASE_URL" "$NODE" scripts/create-admin.mjs "$ADMIN_EMAIL" --out "$ADMIN_PW_FILE")
  ok "created admin $ADMIN_EMAIL - password is in $ADMIN_PW_FILE (read it, log in, change it, delete the file)"
else
  ok "admin account already present - left alone"
fi

# ----------------------------------------------------------------- swap ----
step "Swapping in"
rm -rf "$APP_DIR.old"
[ -d "$APP_DIR" ] && mv "$APP_DIR" "$APP_DIR.old"
mv "$APP_DIR.new" "$APP_DIR"

# ------------------------------------------------------------- systemd ----
step "Service $UNIT"
cat > /etc/systemd/system/$UNIT.service <<UNITFILE
[Unit]
Description=$NAME ($DOMAIN)
After=network.target postgresql.service
Wants=postgresql.service

[Service]
Type=simple
User=$APP_USER
Group=$APP_USER
WorkingDirectory=$APP_DIR
EnvironmentFile=$ENV_FILE
ExecStart=$NODE server.js
Restart=on-failure
RestartSec=3

NoNewPrivileges=true
ProtectSystem=strict
ReadWritePaths=$MEDIA_DIR $APP_DIR/.next/cache
ProtectHome=true
PrivateTmp=true
PrivateDevices=true
ProtectKernelTunables=true
ProtectKernelModules=true
ProtectKernelLogs=true
ProtectControlGroups=true
ProtectClock=true
ProtectHostname=true
RestrictNamespaces=true
RestrictRealtime=true
RestrictSUIDSGID=true
LockPersonality=true
RestrictAddressFamilies=AF_INET AF_INET6 AF_UNIX
CapabilityBoundingSet=
AmbientCapabilities=
SystemCallArchitectures=native
# 0022, not 0027: nginx (www-data) must be able to read uploaded photos.
UMask=0022

[Install]
WantedBy=multi-user.target
UNITFILE
systemctl daemon-reload
systemctl enable --quiet "$UNIT"
systemctl restart "$UNIT"

for i in $(seq 1 30); do
  code=$(curl -s -o /dev/null -w '%{http_code}' "http://127.0.0.1:$PORT/" || true)
  [ "$code" = "200" ] && break
  sleep 1
done
if [ "$code" != "200" ]; then
  journalctl -u "$UNIT" -n 40 --no-pager
  if [ -d "$APP_DIR.old" ] && [ -f "$APP_DIR.old/server.js" ]; then
    rm -rf "$APP_DIR.failed"; mv "$APP_DIR" "$APP_DIR.failed"; mv "$APP_DIR.old" "$APP_DIR"
    systemctl restart "$UNIT"
    die "new build did not answer on :$PORT - rolled back to the previous build (failed one kept at $APP_DIR.failed)"
  fi
  die "app did not answer on :$PORT - nginx NOT switched, the static site is still live"
fi
ok "answering on 127.0.0.1:$PORT"
rm -rf "$APP_DIR.old"

# ---------------------------------------------------------------- nginx ----
step "nginx"
# Ask nginx itself which loaded file declares the domain: `nginx -T` prints
# every config file it reads, each under a "# configuration file <path>:" header.
mapfile -t HITS < <(nginx -T 2>/dev/null | awk -v d="$DOMAIN" '
  /^# configuration file / { f = $4; sub(/:$/, "", f) }
  $1 == "server_name" { for (i = 2; i <= NF; i++) { n = $i; sub(/;$/, "", n); if (n == d) print f } }
' | xargs -r -n1 readlink -f | sort -u)
[ "${#HITS[@]}" -eq 1 ] || die "expected one nginx file serving $DOMAIN, found ${#HITS[@]}: ${HITS[*]:-none} - nginx unchanged, app is running on :$PORT"
VHOST=${HITS[0]}
ok "vhost: $VHOST"

# This file is about to be replaced wholesale, so it must serve nothing else.
OTHER=$(grep -hE '^\s*server_name\s' "$VHOST" | sed -E 's/^\s*server_name\s+//; s/;.*//' | tr ' ' '
'         | grep -vxE "(www\.)?${DOMAIN//./\.}|_|" || true)
[ -z "$OTHER" ] || die "$VHOST also serves: $OTHER - refusing to rewrite a shared file; nginx unchanged, app is running on :$PORT"

if grep -q "proxy_pass http://127.0.0.1:$PORT" "$VHOST" 2>/dev/null; then
  ok "vhost already proxies to :$PORT - unchanged"
else
  [ -f "$VHOST" ] || die "no vhost at $VHOST"
  CERT=$(grep -m1 -E '^\s*ssl_certificate\s' "$VHOST" | awk '{print $2}' | tr -d ';')
  KEY=$(grep -m1 -E '^\s*ssl_certificate_key\s' "$VHOST" | awk '{print $2}' | tr -d ';')
  NAMES=$(grep -m1 -E '^\s*server_name\s' "$VHOST" | sed -E 's/^\s*server_name\s+//; s/;.*//')
  [ -n "$CERT" ] && [ -n "$KEY" ] && [ -n "$NAMES" ] || die "could not read cert/server_name from $VHOST - nginx unchanged, app is running on :$PORT"

  mkdir -p /root/nginx-backups
  BACKUP=/root/nginx-backups/$DOMAIN.$(date -u +%Y%m%dT%H%M%SZ)
  cp -a "$VHOST" "$BACKUP"

  SSL_EXTRA=""
  [ -f /etc/letsencrypt/options-ssl-nginx.conf ] && SSL_EXTRA+="    include /etc/letsencrypt/options-ssl-nginx.conf;"$'\n'
  [ -f /etc/letsencrypt/ssl-dhparams.pem ] && SSL_EXTRA+="    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;"$'\n'

  cat > "$VHOST" <<NGINX
# romeotkoduah.org - Next.js app on 127.0.0.1:$PORT ($UNIT).
# Written by install.sh; previous version at $BACKUP
server {
    listen 80;
    listen [::]:80;
    server_name $NAMES;
    return 301 https://\$host\$request_uri;
}

server {
    listen 443 ssl;
    listen [::]:443 ssl;
    server_name $NAMES;

    ssl_certificate $CERT;
    ssl_certificate_key $KEY;
$SSL_EXTRA
    access_log /var/log/nginx/$DOMAIN.access.log;
    error_log  /var/log/nginx/$DOMAIN.error.log;

    client_max_body_size 25m;
    server_tokens off;

    # The image optimiser is off in next.config.ts; deny it outright anyway -
    # it was the RCE path behind the 2026 break-ins (GHSA-2xp9-vwfh-vxw4).
    location ^~ /_next/image { return 403; }

    location /_next/static/ {
        alias $APP_DIR/.next/static/;
        expires 1y;
        add_header Cache-Control "public, immutable";
        access_log off;
    }

    # Gallery uploads, written by the app, served straight from disk.
    location /media/ {
        alias $MEDIA_DIR/;
        expires 30d;
        add_header X-Content-Type-Options nosniff;
        location ~* \.(php|pl|py|sh|cgi|html?|svg)\$ { return 403; }
    }

    location / {
        proxy_pass http://127.0.0.1:$PORT;
        proxy_http_version 1.1;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_read_timeout 60s;
    }
}
NGINX

  if nginx -t 2>/tmp/nginx-test.log; then
    systemctl reload nginx
    ok "vhost switched to the app (backup: $BACKUP)"
  else
    cat /tmp/nginx-test.log
    cp -a "$BACKUP" "$VHOST"
    nginx -t && systemctl reload nginx
    die "new vhost failed nginx -t - restored the backup, static site still live"
  fi
fi

rm -f "$BUNDLE" "$POSTS_SQL"
step "Done"
ok "rollback to the static site:  cp <backup> $VHOST && systemctl reload nginx"
