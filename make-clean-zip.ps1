# make-clean-zip.ps1
# Creates Pala_Nimrod_ITE18-FNHX1_ThreeJS_Activities.zip on the Desktop with every activity,
# EXCLUDING node_modules, dist and .vercel folders (run "npm install" after unzipping).
#
# Usage (from this folder):
#   powershell -ExecutionPolicy Bypass -File .\make-clean-zip.ps1

$ErrorActionPreference = 'Stop'

$source   = $PSScriptRoot
$name     = Split-Path $source -Leaf
$desktop  = [Environment]::GetFolderPath('Desktop')
$zipPath  = Join-Path $desktop "$name.zip"
$excluded = @('node_modules', 'dist', '.vercel')

Add-Type -AssemblyName System.IO.Compression
Add-Type -AssemblyName System.IO.Compression.FileSystem

# Walk the tree without descending into excluded folders (node_modules is huge)
function Get-CleanFiles([string]$dir) {
    foreach ($item in Get-ChildItem -LiteralPath $dir -Force) {
        if ($item.PSIsContainer) {
            if ($excluded -notcontains $item.Name) { Get-CleanFiles $item.FullName }
        }
        else {
            $item
        }
    }
}

if (Test-Path -LiteralPath $zipPath) { Remove-Item -LiteralPath $zipPath -Force }

$files = @(Get-CleanFiles $source)
$zip = [System.IO.Compression.ZipFile]::Open($zipPath, [System.IO.Compression.ZipArchiveMode]::Create)
try {
    foreach ($file in $files) {
        $relative = $file.FullName.Substring($source.Length).TrimStart('\')
        $entryName = ($name + '/' + $relative) -replace '\\', '/'
        [System.IO.Compression.ZipFileExtensions]::CreateEntryFromFile(
            $zip, $file.FullName, $entryName, [System.IO.Compression.CompressionLevel]::Optimal) | Out-Null
    }
}
finally {
    $zip.Dispose()
}

$sizeMB = [Math]::Round((Get-Item -LiteralPath $zipPath).Length / 1MB, 2)
Write-Host "Created $zipPath ($($files.Count) files, $sizeMB MB)"
Write-Host "Excluded folders: $($excluded -join ', ')"
