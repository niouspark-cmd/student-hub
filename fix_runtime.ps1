
$files = Get-ChildItem -Path "src/app/api" -Recurse -Filter "route.ts"

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    
    # Only process if we find the problematic duplicates or just to ensure consistency
    if ($content -match "export const runtime = 'edge';") {
        # 1. Remove all occurrences of the runtime export line
        # We handle potential leading/trailing whitespace/newlines loosely
        $content = $content -replace "(?m)^\s*export const runtime = 'edge';\s*$", ""
        
        # 2. Add it back exactly ONCE before the FIRST export
        # Matches 'export async function', 'export function', 'export default'
        $regex = [regex] '(?m)^(export (async )?function|export default)'
        
        if ($regex.IsMatch($content)) {
            # Limit substitution to 1
            $content = $regex.Replace($content, "export const runtime = 'edge';`r`n`r`n`$1", 1)
            Set-Content -Path $file.FullName -Value $content -NoNewline
            Write-Host "Fixed $($file.FullName)"
        }
    }
}
