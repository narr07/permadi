# Script to convert PNG, JPG, and JPEG images to WebP format on Windows recursively.
# Default cwebp path: C:\cwebp\bin\cwebp.exe
# Only processes images inside subfolders of the target folder (default: public).

param (
	[string]$Folder = "public",
	[int]$Quality = 80,
	[string]$CwebpPath = "C:\cwebp\bin\cwebp.exe",
	[switch]$DeleteSource = $false
)

# Check if cwebp.exe exists
if (-not (Test-Path $CwebpPath)) {
	Write-Host "Error: cwebp.exe tidak ditemukan di '$CwebpPath'." -ForegroundColor Red
	Write-Host "Silakan periksa folder instalasi cwebp Anda." -ForegroundColor Yellow
	exit 1
}

# Resolve absolute path of the target folder
if (-not (Test-Path $Folder)) {
	Write-Host "Error: Folder '$Folder' tidak ditemukan." -ForegroundColor Red
	exit 1
}
$ResolvedFolder = (Resolve-Path $Folder).Path
Write-Host "Target Folder: $ResolvedFolder (Hanya memproses subfolder)" -ForegroundColor Cyan
Write-Host "Kualitas: $Quality" -ForegroundColor Cyan

# Ask if they want to delete original images if -DeleteSource is not explicitly set
$DeleteOriginals = $DeleteSource
if (-not $PSBoundParameters.ContainsKey('DeleteSource')) {
	$choice = Read-Host "Hapus file gambar asli (.png/.jpg) setelah dikonversi ke .webp? (y/N)"
	if ($choice -eq 'y' -or $choice -eq 'Y') {
		$DeleteOriginals = $true
	}
}

# Fetch all matching files recursively, ignoring system/dependency folders
# and ignoring files directly inside the root of $ResolvedFolder.
Write-Host "Scanning files..." -ForegroundColor Cyan
$Files = Get-ChildItem -Path $ResolvedFolder -File -Recurse -ErrorAction SilentlyContinue | Where-Object {
	$_.FullName -notmatch '\\(node_modules|\.nuxt|\.output|\.git)\\' -and
	$_.DirectoryName -ne $ResolvedFolder -and
	$_.Extension -match '^\.(jpg|jpeg|png)$'
}

if ($Files.Count -eq 0) {
	Write-Host "Tidak ada file JPG, JPEG, atau PNG yang ditemukan di subfolder." -ForegroundColor Yellow
	exit 0
}

Write-Host "Menemukan $($Files.Count) gambar untuk dikonversi." -ForegroundColor Green
Write-Host ""

$SuccessCount = 0
$FailedCount = 0

foreach ($File in $Files) {
	$InputFile = $File.FullName
	$OutputFile = [System.IO.Path]::ChangeExtension($InputFile, ".webp")
	$OutputName = [System.IO.Path]::GetFileName($OutputFile)
	$RelativePath = $File.FullName.Replace($ResolvedFolder, "")
	
	Write-Host "Mengonversi '$RelativePath'... " -NoNewline
	
	# Execute cwebp command
	& $CwebpPath -q $Quality $InputFile -o $OutputFile *>$null
	
	if (Test-Path $OutputFile) {
		Write-Host "[OK] Sukses" -ForegroundColor Green
		$SuccessCount++
		
		# Optional: Delete original source file
		if ($DeleteOriginals) {
			Remove-Item -Path $InputFile -Force
			Write-Host "  [File asli dihapus]" -ForegroundColor Gray
		}
	} else {
		Write-Host "[FAILED] Gagal" -ForegroundColor Red
		$FailedCount++
	}
}

Write-Host ""
Write-Host "Konversi selesai: $SuccessCount sukses, $FailedCount gagal." -ForegroundColor Cyan
