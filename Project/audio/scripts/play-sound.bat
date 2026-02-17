@echo off
REM 音效播放批处理脚本
REM 用法: play-sound.bat <difficulty|progress|complete>

set "SOUND_TYPE=%1"
set "AUDIO_DIR=%~dp0..\sounds"

if "%SOUND_TYPE%"=="difficulty" (
    start "" "%AUDIO_DIR%\Mission_Difficulty.MP3"
    exit /b 0
)

if "%SOUND_TYPE%"=="progress" (
    start "" "%AUDIO_DIR%\Mission_Progress.MP3"
    exit /b 0
)

if "%SOUND_TYPE%"=="complete" (
    start "" "%AUDIO_DIR%\Mission_Complete.MP3"
    exit /b 0
)

echo 未知的音效类型: %SOUND_TYPE%
echo 可用类型: difficulty, progress, complete
exit /b 1
