# --- Start Next.js Dev Server ---
Write-Host "Starting Next.js development server..."
Start-Process powershell -ArgumentList "npm run dev" -WindowStyle Minimized

# Even wachten zodat de server opstart
Write-Host "Waiting 5 seconds for server to start..."
Start-Sleep -Seconds 5

# --- Start Loophole ---
Write-Host "Starting Loophole tunnel..."
.\loophole.exe http 3000 --hostname toesjabloxdex
