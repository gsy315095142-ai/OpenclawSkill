# 🎵 音效控制系统

> 让 Agent 能够在不同场景播放音效

## 目录结构

```
Project/audio/
├── sounds/                    # 音效文件存放目录
│   ├── Mission_Difficulty.MP3 # 任务遇到卡点，向用户求助时 ⭐ 新增
│   ├── Mission_Progress.MP3   # 任务有阶段性进展（完成step）⭐ 新增
│   ├── Mission_Complete.MP3   # 任务完成时 ⭐ 新增
│   ├── reminder.wav           # 定期汇报提醒音
│   ├── warning.wav            # 卡点警告音
│   ├── success.wav            # 任务完成音
│   └── error.wav              # 错误提示音
├── scripts/                   # 播放脚本
│   └── play-sound.ps1         # PowerShell 播放脚本
└── README.md                  # 本文件
```

## 使用方法

### 1. 基础音效

```powershell
# 播放提醒音效（5分钟汇报）
.\scripts\play-sound.ps1 -Type reminder

# 播放警告音效（卡点）
.\scripts\play-sound.ps1 -Type warning

# 播放成功音效（任务完成）
.\scripts\play-sound.ps1 -Type success

# 播放错误音效
.\scripts\play-sound.ps1 -Type error
```

### 2. 任务状态音效 ⭐ 新增

```powershell
# 任务遇到卡点，需要向用户求助时
.\scripts\play-sound.ps1 -Type difficulty

# 任务有阶段性进展（比如完成了过程中的 step）
.\scripts\play-sound.ps1 -Type progress

# 任务完成时
.\scripts\play-sound.ps1 -Type complete
```

## 音效使用场景指南

| 场景 | 音效类型 | 示例 |
|------|---------|------|
| 任务遇到阻碍，需要用户协助 | `difficulty` | "下载失败，需要您提供 API Key" |
| 完成阶段性步骤 | `progress` | "✅ Step 1 完成，正在执行 Step 2..." |
| 任务全部完成 | `complete` | "所有任务已完成！" |
| 定期汇报提醒 | `reminder` | "⏰ 任务已进行 5 分钟..." |
| 警告/异常 | `warning` | "注意：磁盘空间不足" |
| 操作成功 | `success` | "配置已保存" |
| 发生错误 | `error` | "连接超时" |

## 集成到 Agent

在 Agent 脚本中调用：

```powershell
# 任务遇到卡点，向用户求助时
& "C:\Users\31509\clawd\Project\audio\scripts\play-sound.ps1" -Type difficulty
Write-Host "⚠️ 遇到阻碍：需要您提供 API Key 才能继续"

# 完成阶段性进展时
& "C:\Users\31509\clawd\Project\audio\scripts\play-sound.ps1" -Type progress
Write-Host "✅ Step 1 完成"

# 任务完成时
& "C:\Users\31509\clawd\Project\audio\scripts\play-sound.ps1" -Type complete
Write-Host "🎉 所有任务已完成！"
```

## 音效推荐网站

- https://freesound.org/ - 免费音效库
- https://mixkit.co/free-sound-effects/ - Mixkit 免费音效
- https://pixabay.com/sound-effects/ - Pixabay 音效

## 技术说明

- **MP3 格式**：使用 Windows Media Player COM 对象播放
- **WAV 格式**：使用 .NET System.Media.SoundPlayer 播放
- **兼容性**：支持 Windows 10/11，无需额外安装播放器

---

*上次更新：2026-02-16 - 新增任务状态音效 (difficulty, progress, complete)*
