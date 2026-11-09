$ErrorActionPreference = 'Stop'
$stateDir = Join-Path $env:LOCALAPPDATA 'FlowerBoutiqueLanding'
$pidFile = Join-Path $stateDir 'vite.pid'
$url = 'http://127.0.0.1:5174/'

if (-not (Test-Path -LiteralPath $pidFile)) {
  Write-Host 'Site server is not running.'
  exit 0
}

$trackedPid = 0
[void][int]::TryParse((Get-Content -LiteralPath $pidFile -ErrorAction SilentlyContinue), [ref]$trackedPid)
if ($trackedPid -gt 0) {
  $tracked = Get-CimInstance Win32_Process -Filter "ProcessId = $trackedPid" -ErrorAction SilentlyContinue
  if ($tracked -and $tracked.CommandLine -match 'FlowerBoutiqueLanding|npm run dev|5174') {
    & taskkill.exe /PID $trackedPid /T /F | Out-Null
  }
}

Remove-Item -LiteralPath $pidFile -Force -ErrorAction SilentlyContinue
Write-Host 'Site server stopped.'
