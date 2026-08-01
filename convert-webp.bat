@echo off
setlocal enabledelayedexpansion

:: Configuration
set "CWEBP=C:\cwebp\bin\cwebp.exe"
set "QUALITY=80"
set "TARGET_DIR=%CD%\public"

:: Check if cwebp.exe exists
if not exist "%CWEBP%" (
	echo Error: cwebp.exe tidak ditemukan di "%CWEBP%".
	echo Silakan pastikan cwebp terinstal di C:\cwebp\bin\
	pause
	exit /b 1
)

:: Verify public folder exists
if not exist "%TARGET_DIR%" (
	set "TARGET_DIR=%CD%"
)

echo Menjalankan konversi gambar ke WebP secara rekursif...
echo Direktori target: %TARGET_DIR% (Hanya memproses subfolder)
echo Kualitas: %QUALITY%
echo.

set /p DELETE_ORIGINAL="Hapus gambar asli (PNG/JPG) setelah konversi? (y/n): "

echo.
echo Mencari gambar di subfolder...
echo ------------------------------------------------------------

set "SUCCESS_COUNT=0"
set "FAILED_COUNT=0"

:: Loop recursively, but check if the file is NOT directly in TARGET_DIR
for /r "%TARGET_DIR%" %%f in (*.jpg *.jpeg *.png) do (
	set "filepath=%%f"
	set "dirpath=%%~dpf"
	
	:: Remove trailing backslash from dirpath for comparison
	set "dirpath_no_slash=!dirpath:~0,-1!"
	
	:: Filter out node_modules, .git, .nuxt, .output
	echo !filepath! | findstr /i "\\node_modules\\ \\\.git\\ \\\.nuxt\\ \\\.output\\" >nul
	if errorlevel 1 (
		:: Check if file's directory is NOT the root target directory
		if /i not "!dirpath_no_slash!"=="%TARGET_DIR%" (
			set "filename=%%~nf"
			echo Mengonversi "%%f"...
			"%CWEBP%" -q %QUALITY% "%%f" -o "!dirpath!!filename!.webp" >nul 2>&1
			
			if exist "!dirpath!!filename!.webp" (
				echo   ^[^SUKSES^] - ^> !filename!.webp
				set /a SUCCESS_COUNT+=1
				if /i "!DELETE_ORIGINAL!"=="y" (
					del /f /q "%%f"
					echo   [Gambar asli dihapus]
				)
			) else (
				echo   ^[^GAGAL^]  - ^> %%f
				set /a FAILED_COUNT+=1
			)
		)
	)
)

echo ------------------------------------------------------------
echo Selesai. !SUCCESS_COUNT! sukses, !FAILED_COUNT! gagal.
echo.
pause
