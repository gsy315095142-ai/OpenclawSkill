# ComfyUI Audio Player
# 播放音效脚本 - PowerShell
# 支持 WAV 和 MP3 格式

param(
    [Parameter(Mandatory=$true)]
    [ValidateSet("reminder", "warning", "success", "error", "difficulty", "progress", "complete")]
    [string]$Type,
    
    [string]$SoundsDir = "$PSScriptRoot\..\sounds"
)

# 音效文件映射
$Sounds = @{
    # 基础音效 (WAV)
    "reminder" = "reminder.wav"
    "warning"  = "warning.wav"
    "success"  = "success.wav"
    "error"    = "error.wav"
    
    # 任务状态音效 (MP3)
    "difficulty" = "Mission_Difficulty.MP3"  # 任务遇到卡点，向我求助时
    "progress"   = "Mission_Progress.MP3"    # 任务有阶段性进展（完成step）
    "complete"   = "Mission_Complete.MP3"    # 任务完成时
}

$SoundFile = Join-Path $SoundsDir $Sounds[$Type]

function Play-MP3 {
    param([string]$FilePath)
    
    try {
        # 使用 Windows Media Player COM 对象播放 MP3
        $Player = New-Object -ComObject WMPlayer.OCX.7
        $Player.URL = $FilePath
        $Player.settings.volume = 100
        $Player.controls.play()
        
        # 等待播放完成
        while ($Player.playState -ne 1) {  # 1 = stopped
            Start-Sleep -Milliseconds 100
        }
        
        $Player.close()
    }
    catch {
        # 如果 COM 对象失败，使用系统默认播放器
        Start-Process "wmplayer.exe" -ArgumentList "`"$FilePath`"" -Wait
    }
}

function Play-WAV {
    param([string]$FilePath)
    
    $Player = New-Object System.Media.SoundPlayer $FileFile
    $Player.PlaySync()
}

if (Test-Path $SoundFile) {
    # 根据文件扩展名选择播放方式
    $Extension = [System.IO.Path]::GetExtension($SoundFile).ToLower()
    
    switch ($Extension) {
        ".mp3" { Play-MP3 -FilePath $SoundFile }
        ".wav" { Play-WAV -FilePath $SoundFile }
        default { 
            Write-Warning "不支持的音频格式: $Extension"
            [System.Media.SystemSounds]::Beep.Play()
        }
    }
}
else {
    Write-Warning "音效文件不存在: $SoundFile"
    
    # 回退到系统音效
    switch ($Type) {
        "reminder" { [System.Media.SystemSounds]::Beep.Play() }
        "warning"  { [System.Media.SystemSounds]::Exclamation.Play() }
        "success"  { [System.Media.SystemSounds]::Asterisk.Play() }
        "error"    { [System.Media.SystemSounds]::Hand.Play() }
        "difficulty" { [System.Media.SystemSounds]::Exclamation.Play() }
        "progress"   { [System.Media.SystemSounds]::Beep.Play() }
        "complete"   { [System.Media.SystemSounds]::Asterisk.Play() }
    }
}
