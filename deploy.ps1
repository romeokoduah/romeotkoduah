# Build and deploy romeotkoduah.org to the Contabo VPS.
#
# Usage:  ./deploy.ps1                                   build, upload, install
#         ./deploy.ps1 -SkipBuild                        ship the existing build
#         ./deploy.ps1 -Publish the-front-door-to-brussels   also publish that post
#
# Since the Sep 2026 rebuild the box runs every app as its own system user
# under a hardened systemd unit (app-<name>), bound to 127.0.0.1 behind nginx.
# PM2 is gone. The build happens here; scripts/server/install.sh does the rest
# on the server and is safe to re-run: the first run creates the user, the env
# file and the service and switches nginx over; later runs just swap the build.

param(
    [switch]$SkipBuild,
    [string]$Publish = ""
)

$ErrorActionPreference = "Stop"

$Server   = "root@169.58.42.182"
$Key      = "$env:USERPROFILE\.ssh\contabo_deploy"
$Domain   = "romeotkoduah.org"
$SshOpts  = @("-i", $Key, "-o", "IdentitiesOnly=yes", "-o", "BatchMode=yes")
$Root     = $PSScriptRoot
$Tarball  = Join-Path $env:TEMP "romeotkoduah-app.tgz"
$PostsSql = Join-Path $env:TEMP "romeotkoduah-posts.sql"
$Install  = Join-Path $env:TEMP "romeotkoduah-install.sh"
$Staging  = Join-Path $env:TEMP "romeotkoduah-staging"
$Natives  = Join-Path $env:TEMP "romeotkoduah-linux-natives"

function Step($msg) { Write-Host "==> $msg" -ForegroundColor Cyan }
function Ok($msg)   { Write-Host "    $msg" -ForegroundColor Green }
function Warn($msg) { Write-Host "    $msg" -ForegroundColor Yellow }

Set-Location $Root

# ------------------------------------------------------ security floor ----
# GHSA-2xp9-vwfh-vxw4: unauthenticated RCE through Next's image optimiser,
# fixed in 15.5.24 / 16.3.3. It is how the box was broken into; never ship below.
$nextVersion = node -p "require('./node_modules/next/package.json').version"
$v = [version]$nextVersion
if (($v.Major -eq 15 -and $v -lt [version]"15.5.24") -or ($v.Major -eq 16 -and $v -lt [version]"16.3.3") -or $v.Major -lt 15) {
    throw "next $nextVersion is below the patched release - refusing to deploy."
}
Ok "next $nextVersion (patched)"

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

# ------------------------------------------------------------ natives ----
# sharp and @node-rs/argon2 ship per-platform binaries and this build ran on
# Windows. Fetch the Linux x64 glibc builds at the same versions and swap them in.
Step "Fetching Linux native modules"
$sharpV  = node -p "require('./node_modules/sharp/package.json').version"
$argonV  = node -p "require('./node_modules/@node-rs/argon2/package.json').version"
if (Test-Path $Natives) { Remove-Item $Natives -Recurse -Force }
New-Item -ItemType Directory -Path $Natives -Force | Out-Null
Set-Content -Path (Join-Path $Natives "package.json") -Value '{"name":"natives","private":true}' -Encoding ascii
Push-Location $Natives
npm install --no-audit --no-fund --no-package-lock --os=linux --cpu=x64 --libc=glibc "sharp@$sharpV" "@node-rs/argon2@$argonV" | Out-Null
$npmExit = $LASTEXITCODE
Pop-Location
if ($npmExit -ne 0) { throw "Could not fetch Linux native modules." }
if (-not (Test-Path "$Natives\node_modules\@img\sharp-linux-x64")) { throw "sharp-linux-x64 missing after install." }
if (-not (Test-Path "$Natives\node_modules\@node-rs\argon2-linux-x64-gnu")) { throw "argon2-linux-x64-gnu missing after install." }
Ok "sharp $sharpV, argon2 $argonV (linux-x64-gnu)"

# ------------------------------------------------------------------ pack ----
Step "Assembling"
if (Test-Path $Staging) { Remove-Item $Staging -Recurse -Force }
New-Item -ItemType Directory -Path $Staging -Force | Out-Null

Copy-Item "$StandaloneDir\*" $Staging -Recurse -Force
New-Item -ItemType Directory -Path "$Staging\.next" -Force | Out-Null
Copy-Item (Join-Path $Root ".next\static") "$Staging\.next\static" -Recurse -Force

# public/ minus media, which lives on the server and holds uploads
Copy-Item (Join-Path $Root "public") "$Staging\public" -Recurse -Force
if (Test-Path "$Staging\public\media") { Remove-Item "$Staging\public\media" -Recurse -Force }

foreach ($dir in @("@img", "sharp", "@node-rs")) {
    $target = "$Staging\node_modules\$dir"
    if (Test-Path $target) { Remove-Item $target -Recurse -Force }
    Copy-Item "$Natives\node_modules\$dir" $target -Recurse -Force
}
# sharp's loader needs these beside it
foreach ($dep in @("detect-libc", "semver", "@emnapi")) {
    if ((Test-Path "$Natives\node_modules\$dep") -and -not (Test-Path "$Staging\node_modules\$dep")) {
        Copy-Item "$Natives\node_modules\$dep" "$Staging\node_modules\$dep" -Recurse -Force
    }
}

# migrations and the admin script travel with the app
Copy-Item (Join-Path $Root "db") "$Staging\db" -Recurse -Force
New-Item -ItemType Directory -Path "$Staging\scripts" -Force | Out-Null
Copy-Item (Join-Path $Root "scripts\migrate.mjs") "$Staging\scripts\" -Force
Copy-Item (Join-Path $Root "scripts\create-admin.mjs") "$Staging\scripts\" -Force

$fileCount = (Get-ChildItem $Staging -Recurse -File | Measure-Object).Count
Ok "$fileCount files"

Step "Packing"
if (Test-Path $Tarball) { Remove-Item $Tarball -Force }
tar -czf $Tarball -C $Staging .
if ($LASTEXITCODE -ne 0) { throw "tar failed." }
Ok "$([math]::Round((Get-Item $Tarball).Length / 1MB, 2)) MB"

# Posts as plain SQL: the server's Node may not import TypeScript.
$publishArgs = if ($Publish) { @("--publish", $Publish) } else { @() }
$sqlText = node --no-warnings scripts/posts-sql.mjs @publishArgs
if ($LASTEXITCODE -ne 0) { throw "Could not generate posts SQL." }
[System.IO.File]::WriteAllText($PostsSql, (($sqlText -join "`n") + "`n"), (New-Object System.Text.UTF8Encoding $false))

# LF endings, or bash chokes on the installer
$installText = (Get-Content (Join-Path $Root "scripts\server\install.sh") -Raw) -replace "`r", ""
[System.IO.File]::WriteAllText($Install, $installText, (New-Object System.Text.UTF8Encoding $false))

# ---------------------------------------------------------------- upload ----
Step "Uploading"
scp @SshOpts $Tarball $PostsSql $Install "${Server}:/root/"
if ($LASTEXITCODE -ne 0) { throw "Upload failed - nothing changed on the server." }

# --------------------------------------------------------------- install ----
Step "Installing on the server"
ssh @SshOpts $Server "bash /root/romeotkoduah-install.sh /root/romeotkoduah-app.tgz /root/romeotkoduah-posts.sql; rc=`$?; rm -f /root/romeotkoduah-install.sh; exit `$rc"
if ($LASTEXITCODE -ne 0) { throw "Remote install failed - see the output above. It stops before touching nginx unless the app is healthy." }

# ---------------------------------------------------------------- verify ----
Step "Verifying from here"
$checks = @("/", "/about", "/blog", "/gallery")
if ($Publish) { $checks += $Publish.Split(",") | ForEach-Object { "/blog/$_" } }
$failed = $false
foreach ($path in $checks) {
    $code = curl.exe -s -o NUL -w "%{http_code}" "https://$Domain$path"
    $body = curl.exe -s "https://$Domain$path"
    if ($code -eq "200" -and -not ($body -match "This page isn.t here")) { Ok "$path -> $code" }
    else { Warn "$path -> $code"; $failed = $true }
}
$adminCode = curl.exe -s -o NUL -w "%{http_code}" "https://$Domain/admin"
if (@("200", "302", "307") -contains $adminCode) { Ok "/admin -> $adminCode" } else { Warn "/admin -> $adminCode"; $failed = $true }
$imgCode = curl.exe -s -o NUL -w "%{http_code}" "https://$Domain/_next/image?url=%2Ficon.svg&w=64&q=75"
if ($imgCode -eq "403") { Ok "/_next/image -> 403 (blocked)" } else { Warn "/_next/image -> $imgCode (expected 403)"; $failed = $true }

Remove-Item $Tarball, $PostsSql, $Install -Force -ErrorAction SilentlyContinue
Remove-Item $Staging, $Natives -Recurse -Force -ErrorAction SilentlyContinue

if ($failed) {
    Write-Host "`nDeployed, but some checks did not pass." -ForegroundColor Yellow
    Write-Host "Logs:  ssh -i $Key $Server 'journalctl -u app-romeotkoduah -n 50 --no-pager'" -ForegroundColor Yellow
} else {
    Write-Host "`nLive at https://$Domain/" -ForegroundColor Green
}
