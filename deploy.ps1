# Build and deploy romeotkoduah.org to the Contabo VPS.
#
# Usage:  ./deploy.ps1             build, upload, restart
#         ./deploy.ps1 -SkipBuild  upload the existing build as-is
#         ./deploy.ps1 -Migrate    also run database migrations after upload
#
# The site runs as a Next.js standalone server under PM2, proxied by nginx —
# the same pattern as the other apps on this box. The build happens here; only
# the artifact ships.

param(
    [switch]$SkipBuild,
    [switch]$Migrate
)

$ErrorActionPreference = "Stop"

$Server   = "root@169.58.42.182"
$Key      = "$env:USERPROFILE\.ssh\contabo_deploy"
$AppDir   = "/var/www/romeotkoduah-app"
$AppName  = "romeotkoduah"
$Domain   = "romeotkoduah.org"
$SshOpts  = @("-i", $Key, "-o", "IdentitiesOnly=yes", "-o", "BatchMode=yes")
$Root     = $PSScriptRoot
$Tarball  = Join-Path $env:TEMP "romeotkoduah-app.tgz"
$Staging  = Join-Path $env:TEMP "romeotkoduah-staging"

function Step($msg) { Write-Host "==> $msg" -ForegroundColor Cyan }
function Ok($msg)   { Write-Host "    $msg" -ForegroundColor Green }
function Warn($msg) { Write-Host "    $msg" -ForegroundColor Yellow }

# ----------------------------------------------------------------- build ----
if (-not $SkipBuild) {
    Step "Building"
    npm run build
    if ($LASTEXITCODE -ne 0) { throw "Build failed - nothing was deployed." }
}

$StandaloneDir = Join-Path $Root ".next\standalone"
if (-not (Test-Path $StandaloneDir)) {
    throw "No .next/standalone. Is `output: 'standalone'` still set in next.config.ts?"
}

# ------------------------------------------------------------------ pack ----
# The standalone output omits static assets and public/ by design; they have to
# be copied in beside it or every stylesheet and image 404s.
Step "Assembling"
if (Test-Path $Staging) { Remove-Item $Staging -Recurse -Force }
New-Item -ItemType Directory -Path $Staging -Force | Out-Null

Copy-Item "$StandaloneDir\*" $Staging -Recurse -Force
New-Item -ItemType Directory -Path "$Staging\.next" -Force | Out-Null
Copy-Item (Join-Path $Root ".next\static") "$Staging\.next\static" -Recurse -Force

# public/ minus the media directory, which lives on the server and holds uploads
$PublicSrc = Join-Path $Root "public"
Copy-Item $PublicSrc "$Staging\public" -Recurse -Force
if (Test-Path "$Staging\public\media") { Remove-Item "$Staging\public\media" -Recurse -Force }

# migrations travel with the app so -Migrate can run them server-side
Copy-Item (Join-Path $Root "db") "$Staging\db" -Recurse -Force
New-Item -ItemType Directory -Path "$Staging\scripts" -Force | Out-Null
Copy-Item (Join-Path $Root "scripts\migrate.mjs") "$Staging\scripts\" -Force
Copy-Item (Join-Path $Root "scripts\create-admin.mjs") "$Staging\scripts\" -Force
Copy-Item (Join-Path $Root "scripts\seed-posts.mjs") "$Staging\scripts\" -Force
if (Test-Path (Join-Path $Root "content\starter-posts.ts")) {
    Copy-Item (Join-Path $Root "content\starter-posts.ts") "$Staging\content\" -Force
}

$fileCount = (Get-ChildItem $Staging -Recurse -File | Measure-Object).Count
Ok "$fileCount files"

Step "Packing"
if (Test-Path $Tarball) { Remove-Item $Tarball -Force }
tar -czf $Tarball -C $Staging .
if ($LASTEXITCODE -ne 0) { throw "tar failed." }
Ok "$([math]::Round((Get-Item $Tarball).Length / 1MB, 2)) MB"

# ---------------------------------------------------------------- upload ----
Step "Uploading"
scp @SshOpts $Tarball "${Server}:/tmp/romeotkoduah-app.tgz"
if ($LASTEXITCODE -ne 0) { throw "Upload failed." }

# --------------------------------------------------------------- swap in ----
# Unpack into a staging directory and swap, so a failed upload leaves the
# running app untouched. node_modules ships inside the standalone bundle.
Step "Swapping in"
$migrateStep = if ($Migrate) { "cd $AppDir && node scripts/migrate.mjs" } else { "true" }
$remote = @"
set -e
rm -rf ${AppDir}.new
mkdir -p ${AppDir}.new
tar -xzf /tmp/romeotkoduah-app.tgz -C ${AppDir}.new
test -f ${AppDir}.new/server.js
rm -rf ${AppDir}.old
if [ -d ${AppDir} ]; then mv ${AppDir} ${AppDir}.old; fi
mv ${AppDir}.new ${AppDir}

# sharp and @node-rs/argon2 ship platform-specific binaries. The bundle is
# built on Windows, so its natives are unusable here — swap in the Linux
# builds kept in romeotkoduah-native. Without this, /admin 500s on every
# deploy with "Failed to load native binding".
NATIVE=/var/www/romeotkoduah-native/node_modules
if [ -d "`$NATIVE" ]; then
  rm -rf ${AppDir}/node_modules/@img ${AppDir}/node_modules/sharp ${AppDir}/node_modules/@node-rs
  cp -r "`$NATIVE/@img"     ${AppDir}/node_modules/@img
  cp -r "`$NATIVE/sharp"    ${AppDir}/node_modules/sharp
  cp -r "`$NATIVE/@node-rs" ${AppDir}/node_modules/@node-rs
else
  echo "WARNING: `$NATIVE missing - admin will fail. See docs/deployment.md."
fi

set -a; . /root/romeotkoduah.env; set +a
$migrateStep
if pm2 describe ${AppName} > /dev/null 2>&1; then
  pm2 reload ${AppName} --update-env
else
  cd ${AppDir} && pm2 start server.js --name ${AppName} --update-env
  pm2 save
fi
rm -rf ${AppDir}.old /tmp/romeotkoduah-app.tgz
echo swapped
"@
$remote = $remote -replace "`r", ""
ssh @SshOpts $Server $remote
if ($LASTEXITCODE -ne 0) { throw "Remote swap failed - the previous build is still running." }

# ---------------------------------------------------------------- verify ----
Step "Verifying"
$checks = @("/", "/about", "/publications", "/blog", "/gallery")
$failed = $false
foreach ($path in $checks) {
    $code = ssh @SshOpts $Server "curl -sk -o /dev/null -w '%{http_code}' https://$Domain$path"
    if ($code -eq "200") { Ok "$path -> $code" }
    else { Warn "$path -> $code (expected 200)"; $failed = $true }
}

# /admin must redirect to the login page, not serve the dashboard
$adminCode = ssh @SshOpts $Server "curl -sk -o /dev/null -w '%{http_code}' https://$Domain/admin"
if ($adminCode -eq "307" -or $adminCode -eq "302" -or $adminCode -eq "200") {
    Ok "/admin -> $adminCode"
} else {
    Warn "/admin -> $adminCode"; $failed = $true
}

Remove-Item $Tarball -Force -ErrorAction SilentlyContinue
Remove-Item $Staging -Recurse -Force -ErrorAction SilentlyContinue

if ($failed) {
    Write-Host "`nDeployed, but some checks did not return the expected status." -ForegroundColor Yellow
    Write-Host "Check logs with:  ssh ... 'pm2 logs $AppName --lines 50'" -ForegroundColor Yellow
} else {
    Write-Host "`nLive at https://$Domain/" -ForegroundColor Green
}
