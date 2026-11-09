$ErrorActionPreference = 'Stop'
$project = Split-Path -Parent $PSScriptRoot
$url = 'http://127.0.0.1:5174/'
$stateDir = Join-Path $env:LOCALAPPDATA 'FlowerBoutiqueLanding'
$pidFile = Join-Path $stateDir 'vite.pid'
$stdoutFile = Join-Path $stateDir 'vite-stdout.log'
$stderrFile = Join-Path $stateDir 'vite-stderr.log'

New-Item -ItemType Directory -Force -Path $stateDir | Out-Null

try {
  $response = Invoke-WebRequest -Uri $url -TimeoutSec 2 -UseBasicParsing
  if ($response.Content -match 'MAISON DE FLEURS') {
    Start-Process $url
    exit 0
  }
  throw 'Another site is already using port 5174.'
} catch {
  if ($_.Exception.Message -like '*already using port 5174*') { throw }
}

$npm = (Get-Command npm.cmd -ErrorAction Stop).Source
$escapedProject = $project.Replace("'", "''")
$escapedNpm = $npm.Replace("'", "''")
$command = "Set-Location -LiteralPath '$escapedProject'; & '$escapedNpm' run dev"
$process = Start-Process -FilePath 'powershell.exe' -ArgumentList @('-NoProfile','-WindowStyle','Hidden','-Command',$command) -WorkingDirectory $project -WindowStyle Hidden -PassThru -RedirectStandardOutput $stdoutFile -RedirectStandardError $stderrFile
Set-Content -LiteralPath $pidFile -Value $process.Id -Encoding ascii

$ready = $false
for ($i = 0; $i -lt 40; $i++) {
  Start-Sleep -Milliseconds 500
  try {
    $response = Invoke-WebRequest -Uri $url -TimeoutSec 2 -UseBasicParsing
    if ($response.Content -match 'MAISON DE FLEURS') { $ready = $true; break }
  } catch {}
  if ($process.HasExited) { break }
}

if (-not $ready) {
  if (-not $process.HasExited) { Stop-Process -Id $process.Id -Force -ErrorAction SilentlyContinue }
  Remove-Item -LiteralPath $pidFile -Force -ErrorAction SilentlyContinue
  Write-Host 'Could not start the site. Logs:' $stdoutFile $stderrFile
  exit 1
}

Start-Process $url
