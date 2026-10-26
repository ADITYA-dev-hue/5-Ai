Add-Type -AssemblyName System.Drawing

$inputPath = "public/logo.png"
$outputPath = "public/logo_transparent.png"

$bmp = [System.Drawing.Bitmap]::FromFile((Resolve-Path $inputPath))
$w = $bmp.Width
$h = $bmp.Height

Write-Output "Image size: ${w}x${h}, format: $($bmp.PixelFormat)"

# Create new 32-bit ARGB bitmap
$newBmp = New-Object System.Drawing.Bitmap($w, $h, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)

# Calculate center for radial feathering
$cx = $w / 2.0
$cy = $h / 2.0
$maxDist = [Math]::Sqrt($cx * $cx + $cy * $cy)

for ($y = 0; $y -lt $h; $y++) {
    for ($x = 0; $x -lt $w; $x++) {
        $p = $bmp.GetPixel($x, $y)
        $r = $p.R
        $g = $p.G
        $b = $p.B
        
        # Calculate luminance / brightness
        $lum = [Math]::Max($r, [Math]::Max($g, $b))
        
        # Distance from edge falloff
        $edgeX = [Math]::Min($x, $w - 1 - $x) / ($w * 0.15)
        $edgeY = [Math]::Min($y, $h - 1 - $y) / ($h * 0.20)
        $edgeFactor = [Math]::Min(1.0, [Math]::Min($edgeX, $edgeY))
        $edgeFactor = [Math]::Max(0.0, $edgeFactor)
        
        # Screen / Alpha blend:
        # If luminance is very low (< 15), make it 0.
        # Otherwise scale alpha smoothly
        if ($lum -lt 12) {
            $alpha = 0
        } elseif ($lum -lt 55) {
            $t = ($lum - 12) / (55 - 12)
            $alpha = [int]($t * $lum * $edgeFactor)
        } else {
            $alpha = [int]([Math]::Min(255, ($lum * 1.15)) * $edgeFactor)
        }
        
        if ($alpha -gt 255) { $alpha = 255 }
        if ($alpha -lt 0) { $alpha = 0 }
        
        if ($alpha -eq 0) {
            $newBmp.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(0, 0, 0, 0))
        } else {
            # Normalize color to prevent dark fringing
            $scale = if ($lum -gt 0) { [Math]::Min(1.2, 255.0 / [Math]::Max(1.0, $lum)) } else { 1.0 }
            $newR = [Math]::Min(255, [int]($r * 1.05))
            $newG = [Math]::Min(255, [int]($g * 1.05))
            $newB = [Math]::Min(255, [int]($b * 1.05))
            $newBmp.SetPixel($x, $y, [System.Drawing.Color]::FromArgb($alpha, $newR, $newG, $newB))
        }
    }
}

$bmp.Dispose()
$newBmp.Save($outputPath, [System.Drawing.Imaging.ImageFormat]::Png)
$newBmp.Dispose()

Write-Output "Successfully generated $outputPath"
