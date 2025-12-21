
$files = Get-ChildItem -Path "src/app/api" -Recurse -Filter "route.ts"
foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    if ($content -notmatch "export const runtime = 'edge'") {
        # Insert before the first 'export' that is likely a function (GET, POST, etc.)
        # We capture the match to put it back
        $content = $content -replace '(?m)^(export (async )?function)', "export const runtime = 'edge';`r`n`r`n`$1"
        Set-Content -Path $file.FullName -Value $content -NoNewline
        Write-Host "Updated $($file.FullName)"
    }
}
