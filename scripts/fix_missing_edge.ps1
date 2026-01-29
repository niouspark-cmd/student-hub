Get-ChildItem -Path "src\app\api" -Recurse | Where-Object { $_.Name -eq "route.ts" } | ForEach-Object {
    $path = $_.FullName
    $content = Get-Content -LiteralPath $path -Raw
    
    if ($content -notmatch "export const runtime = 'edge';") {
        Write-Host "Adding Edge Runtime config to: $path"
        
        # Determine if we should insert at top or after imports?
        # Prepending is safest to ensure it exists, even if style is slightly off.
        # But let's try to be nice and put it after imports if possible?
        # Actually, prepend is safest for a guaranteed match.
        
        $newContent = "export const runtime = 'edge';" + [Environment]::NewLine + $content
        Set-Content -LiteralPath $path -Value $newContent -NoNewline
    }
    else {
        Write-Host "Skipping (already exists): $path"
    }
}
