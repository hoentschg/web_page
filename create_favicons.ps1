Add-Type -AssemblyName System.Drawing

$srcPath = Join-Path $PSScriptRoot "public\assets\MARCA o29_Mesa de trabajo 1.png"
if (-not (Test-Path $srcPath)) {
    Write-Error "Source file not found: $srcPath"
    exit 1
}

$srcBmp = [System.Drawing.Bitmap]::FromFile($srcPath)

# High precision bounding box of the letter 'Q' from the official Quimera logo
$minX = 939
$maxX = 1355
$minY = 328
$maxY = 721

$qW = $maxX - $minX + 1
$qH = $maxY - $minY + 1

# We use 8% padding around the Q for optical centering and crisp tab margins
$maxDim = [Math]::Max($qW, $qH)
$padding = [int]($maxDim * 0.08)
$squareSize = $maxDim + ($padding * 2)

# Create master 1024x1024 transparent bitmap
$masterBmp = New-Object System.Drawing.Bitmap(1024, 1024, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$g = [System.Drawing.Graphics]::FromImage($masterBmp)
$g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
$g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
$g.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
$g.Clear([System.Drawing.Color]::Transparent)

# Calculate placement to center the letter Q inside the square
$scale = 1024.0 / $squareSize
$destW = [int]($qW * $scale)
$destH = [int]($qH * $scale)
$destX = [int]((1024 - $destW) / 2)
$destY = [int]((1024 - $destH) / 2)

$srcRect = New-Object System.Drawing.Rectangle($minX, $minY, $qW, $qH)
$destRect = New-Object System.Drawing.Rectangle($destX, $destY, $destW, $destH)

$g.DrawImage($srcBmp, $destRect, $srcRect, [System.Drawing.GraphicsUnit]::Pixel)
$g.Dispose()
$srcBmp.Dispose()

$assetsDir = Join-Path $PSScriptRoot "public\assets"
$publicDir = Join-Path $PSScriptRoot "public"

# Function to resize master and save as PNG
function Save-ResizedPng($size, $outPath) {
    $resBmp = New-Object System.Drawing.Bitmap($size, $size, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $resG = [System.Drawing.Graphics]::FromImage($resBmp)
    $resG.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $resG.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $resG.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $resG.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
    $resG.Clear([System.Drawing.Color]::Transparent)
    
    $resG.DrawImage($masterBmp, 0, 0, $size, $size)
    $resG.Dispose()
    
    $resBmp.Save($outPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $resBmp.Dispose()
    Write-Output "Saved: $outPath ($size x $size)"
}

# Generate PNG icons across all standard device and browser resolutions
Save-ResizedPng 1024 (Join-Path $assetsDir "quimera-q-square.png")
Save-ResizedPng 512 (Join-Path $assetsDir "favicon-512x512.png")
Save-ResizedPng 192 (Join-Path $assetsDir "favicon-192x192.png")
Save-ResizedPng 180 (Join-Path $assetsDir "apple-touch-icon.png")
Save-ResizedPng 48 (Join-Path $assetsDir "favicon-48x48.png")
Save-ResizedPng 32 (Join-Path $assetsDir "favicon-32x32.png")
Save-ResizedPng 16 (Join-Path $assetsDir "favicon-16x16.png")

# Also copy 32x32 directly to public/favicon-32x32.png
Copy-Item (Join-Path $assetsDir "favicon-32x32.png") (Join-Path $publicDir "favicon-32x32.png") -Force

# Create multi-res .ico file containing 16x16, 32x32, 48x48 using PNG payload
$sizes = @(16, 32, 48)
$pngBytesList = @()

foreach ($s in $sizes) {
    $path = Join-Path $assetsDir "favicon-$($s)x$($s).png"
    $bytes = [System.IO.File]::ReadAllBytes($path)
    $pngBytesList += ,@($s, $bytes)
}

# Build ICO binary
$ms = New-Object System.IO.MemoryStream
$bw = New-Object System.IO.BinaryWriter($ms)

# ICO Header
$bw.Write([uint16]0) # Reserved
$bw.Write([uint16]1) # Type (1 = Icon)
$bw.Write([uint16]$pngBytesList.Count) # Number of images

# Calculate offset for first image data (6 header bytes + 16 bytes per entry)
$dataOffset = 6 + (16 * $pngBytesList.Count)

foreach ($item in $pngBytesList) {
    $s = $item[0]
    $data = $item[1]
    
    $bw.Write([byte]$s)             # Width
    $bw.Write([byte]$s)             # Height
    $bw.Write([byte]0)              # Color count
    $bw.Write([byte]0)              # Reserved
    $bw.Write([uint16]1)            # Color planes
    $bw.Write([uint16]32)           # Bits per pixel
    $bw.Write([uint32]$data.Length) # Image size in bytes
    $bw.Write([uint32]$dataOffset)  # Offset
    
    $dataOffset += $data.Length
}

# Write PNG payloads
foreach ($item in $pngBytesList) {
    $data = $item[1]
    $bw.Write($data)
}

$icoBytes = $ms.ToArray()
$bw.Dispose()
$ms.Dispose()

$icoPublic = Join-Path $publicDir "favicon.ico"
$icoAssets = Join-Path $assetsDir "favicon.ico"
[System.IO.File]::WriteAllBytes($icoPublic, $icoBytes)
[System.IO.File]::WriteAllBytes($icoAssets, $icoBytes)

Write-Output "Generated multi-resolution favicon.ico ($($icoBytes.Length) bytes) with the letter 'Q' in public/ and public/assets/"

# Generate SVG wrapper with base64 embedded high-res master
$master512Path = Join-Path $assetsDir "favicon-512x512.png"
$master512Bytes = [System.IO.File]::ReadAllBytes($master512Path)
$b64 = [Convert]::ToBase64String($master512Bytes)
$svgContent = @"
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="100%" height="100%">
  <image width="512" height="512" href="data:image/png;base64,$b64"/>
</svg>
"@
[System.IO.File]::WriteAllText((Join-Path $assetsDir "favicon.svg"), $svgContent)
Write-Output "Generated SVG favicon in public/assets/favicon.svg"

$masterBmp.Dispose()
