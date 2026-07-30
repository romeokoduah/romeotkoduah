# Build and deploy romeotkoduah.org to the Contabo VPS (nginx, static site).
#
# Usage:  ./deploy.ps1             build, upload, swap in
#         ./deploy.ps1 -SkipBuild  upload the existing ./out as-is
#
# The site is a Next.js static export, so nothing runs on the server — the
# build happens here and only the artifact ships.

param(
    [switch]$SkipBuild
)

$ErrorActionPreference = "Stop"

$Server  = "root@169.58.42.182"
$Key     = "$env:USERPROFILE\.ssh\contabo_deploy"
$WebRoot = "/var/www/romeotkoduah.org"
$Domain  = "romeotkoduah.org"
$SshOpts = @("-i", $Key, "-o", "IdentitiesOnly=yes", "-o", "BatchMode=yes")
$OutDir  = Join-Path $PSScriptRoot "out"
$Tarball = Join-Path $env:TEMP "romeotkoduah-site.tgz"

function Step($msg) { Write-Host "==> $msg" -ForegroundColor Cyan }
function Ok($msg)   { Write-Host "    $msg" -ForegroundColor Green }
function Warn($msg) { Write-Host "    $msg" -ForegroundColor Yellow }

# ----------------------------------------------------------------- build ----
if (-not $SkipBuild) {
    Step "Building static export"
    npm run build
    if ($LASTEXITCODE -ne 0) { throw "Build failed - nothing was deployed." }
}

if (-not (Test-Path $OutDir)) { throw "No ./out directory. Run without -SkipBuild." }
if (-not (Test-Path (Join-Path $OutDir "index.html"))) {
    throw "./out has no index.html - the export looks incomplete. Aborting."
}

$fileCount = (Get-ChildItem $OutDir -Recurse -File | Measure-Object).Count
Ok "$fileCount files in ./out"

# ------------------------------------------------------------------ pack ----
Step "Packing"
if (Test-Path $Tarball) { Remove-Item $Tarball -Force }
tar -czf $Tarball -C $OutDir .
if ($LASTEXITCODE -ne 0) { throw "tar failed." }
$sizeMb = [math]::Round((Get-Item $Tarball).Length / 1MB, 2)
Ok "$sizeMb MB"

# ---------------------------------------------------------------- upload ----
Step "Uploading"
scp @SshOpts $Tarball "${Server}:/tmp/romeotkoduah-site.tgz"
if ($LASTEXITCODE -ne 0) { throw "Upload failed." }

# --------------------------------------------------------------- swap in ----
# Unpack into a staging directory, then swap. A failed unpack leaves the live
# site untouched.
Step "Swapping in"
$remote = @"
set -e
rm -rf ${WebRoot}.new
mkdir -p ${WebRoot}.new
tar -xzf /tmp/romeotkoduah-site.tgz -C ${WebRoot}.new
test -f ${WebRoot}.new/index.html
chown -R www-data:www-data ${WebRoot}.new
find ${WebRoot}.new -type d -exec chmod 755 {} +
find ${WebRoot}.new -type f -exec chmod 644 {} +
rm -rf ${WebRoot}.old
if [ -d ${WebRoot} ]; then mv ${WebRoot} ${WebRoot}.old; fi
mv ${WebRoot}.new ${WebRoot}
rm -rf ${WebRoot}.old /tmp/romeotkoduah-site.tgz
nginx -t >/dev/null 2>&1 && systemctl reload nginx
echo swapped
"@
ssh @SshOpts $Server $remote
if ($LASTEXITCODE -ne 0) { throw "Remote swap failed - the previous site is still live." }

# ----------------------------------------------------------------- verify ----
Step "Verifying"
$checks = @(
    @{ Url = "https://$Domain/";             Expect = "200" },
    @{ Url = "https://$Domain/about";        Expect = "200" },
    @{ Url = "https://$Domain/publications"; Expect = "200" }
)
$failed = $false
foreach ($c in $checks) {
    $code = ssh @SshOpts $Server "curl -sk -o /dev/null -w '%{http_code}' $($c.Url)"
    if ($code -eq $c.Expect) { Ok "$($c.Url) -> $code" }
    else { Warn "$($c.Url) -> $code (expected $($c.Expect))"; $failed = $true }
}

Remove-Item $Tarball -Force -ErrorAction SilentlyContinue

if ($failed) {
    Write-Host "`nDeployed, but some checks did not return the expected status." -ForegroundColor Yellow
} else {
    Write-Host "`nLive at https://$Domain/" -ForegroundColor Green
}
