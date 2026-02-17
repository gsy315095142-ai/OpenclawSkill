#!/usr/bin/env python3
"""
音效播放器 - 用于 Agent 任务状态反馈
支持 MP3 和 WAV 格式
"""

import sys
import os
from pathlib import Path

# 音效文件映射
SOUNDS = {
    # 任务状态音效 (MP3)
    "difficulty": "Mission_Difficulty.MP3",  # 任务遇到卡点，向用户求助时
    "progress": "Mission_Progress.MP3",      # 任务有阶段性进展（完成step）
    "complete": "Mission_Complete.MP3",      # 任务完成时
    
    # 基础音效 (WAV)
    "reminder": "reminder.wav",
    "warning": "warning.wav",
    "success": "success.wav",
    "error": "error.wav",
}

def get_sound_path(sound_type):
    """获取音效文件路径"""
    script_dir = Path(__file__).parent
    sounds_dir = script_dir.parent / "sounds"
    
    if sound_type not in SOUNDS:
        print(f"未知的音效类型: {sound_type}", file=sys.stderr)
        return None
    
    sound_file = sounds_dir / SOUNDS[sound_type]
    if not sound_file.exists():
        print(f"音效文件不存在: {sound_file}", file=sys.stderr)
        return None
    
    return str(sound_file)

def play_sound_windows(sound_path):
    """在 Windows 上播放音效"""
    try:
        # 方法1: 使用 winsound (仅支持 WAV)
        if sound_path.lower().endswith('.wav'):
            import winsound
            winsound.PlaySound(sound_path, winsound.SND_FILENAME | winsound.SND_ASYNC)
            return True
        
        # 方法2: 使用 Windows Media Player COM (支持 MP3)
        try:
            import comtypes.client
            player = comtypes.client.CreateObject("WMPlayer.OCX.7")
            player.URL = sound_path
            player.settings.volume = 100
            player.controls.play()
            
            # 等待播放开始
            import time
            time.sleep(0.5)
            return True
        except:
            pass
        
        # 方法3: 使用 os.startfile (异步播放)
        os.startfile(sound_path)
        return True
        
    except Exception as e:
        print(f"播放失败: {e}", file=sys.stderr)
        return False

def play_sound(sound_type):
    """播放指定类型的音效"""
    sound_path = get_sound_path(sound_type)
    if not sound_path:
        return False
    
    if sys.platform == 'win32':
        return play_sound_windows(sound_path)
    else:
        # Linux/Mac 使用系统播放器
        try:
            import subprocess
            subprocess.Popen(['xdg-open' if sys.platform == 'linux' else 'open', sound_path])
            return True
        except Exception as e:
            print(f"播放失败: {e}", file=sys.stderr)
            return False

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("用法: python play_sound.py <difficulty|progress|complete|reminder|warning|success|error>")
        sys.exit(1)
    
    sound_type = sys.argv[1].lower()
    
    if sound_type not in SOUNDS:
        print(f"未知的音效类型: {sound_type}")
        print(f"可用类型: {', '.join(SOUNDS.keys())}")
        sys.exit(1)
    
    success = play_sound(sound_type)
    sys.exit(0 if success else 1)
