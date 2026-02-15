# Agent Sound Effects (Agent 音效播放)

此 Skill 定义了在 Agent 执行任务时播放音效的最佳实践，用于增强任务状态反馈。

---

## 1. 适用场景

- **任务遇到卡点** - 需要向用户求助时播放警示音
- **任务有阶段性进展** - 完成某个 step 时播放进度音
- **任务完成** - 全部任务结束时播放完成音
- **定期汇报提醒** - 长时间任务的进度汇报提醒

---

## 2. 音效文件位置

```
Project/audio/
├── sounds/                    # 音效文件目录
│   ├── Mission_Difficulty.MP3 # ⭐ 任务遇到卡点，向用户求助时
│   ├── Mission_Progress.MP3   # ⭐ 任务有阶段性进展
│   ├── Mission_Complete.MP3   # ⭐ 任务完成时
│   ├── reminder.wav           # 定期汇报提醒音
│   ├── warning.wav            # 警告音
│   ├── success.wav            # 成功音
│   └── error.wav              # 错误音
├── scripts/
│   └── play-sound.ps1         # PowerShell 播放脚本
└── README.md                  # 使用文档
```

---

## 3. 播放脚本使用

### 3.1 基础用法

```powershell
# 任务遇到卡点，向用户求助时
.\Project\audio\scripts\play-sound.ps1 -Type difficulty

# 任务有阶段性进展
.\Project\audio\scripts\play-sound.ps1 -Type progress

# 任务完成
.\Project\audio\scripts\play-sound.ps1 -Type complete
```

### 3.2 Agent 代码集成

```powershell
function Invoke-AgentSound {
    param([Parameter(Mandatory=$true)][string]$Type)
    
    $ScriptPath = "C:\Users\31509\clawd\Project\audio\scripts\play-sound.ps1"
    
    if (Test-Path $ScriptPath) {
        Start-Process -FilePath "powershell.exe" `
            -ArgumentList "-ExecutionPolicy Bypass -File `"$ScriptPath`" -Type $Type" `
            -WindowStyle Hidden -Wait:$false
    }
}

# 使用示例
Invoke-AgentSound -Type difficulty
Write-Host "⚠️ 遇到阻碍：需要您提供 API Key"

Invoke-AgentSound -Type progress
Write-Host "✅ Step 1 完成"

Invoke-AgentSound -Type complete
Write-Host "🎉 任务全部完成！"
```

---

## 4. 音效使用场景指南

| 场景 | 音效类型 | 示例 |
|------|---------|------|
| 任务遇到阻碍，需要用户协助 | `difficulty` | "下载失败，需要您提供 API Key" |
| 完成阶段性步骤 | `progress` | "✅ Step 1 完成，正在执行 Step 2..." |
| 任务全部完成 | `complete` | "🎉 所有任务已完成！" |
| 定期汇报提醒 | `reminder` | "⏰ 任务已进行 5 分钟..." |
| 警告/异常 | `warning` | "注意：磁盘空间不足" |
| 操作成功 | `success` | "配置已保存" |
| 发生错误 | `error` | "连接超时" |

---

## 5. 技术实现说明

### 5.1 支持格式

| 格式 | 播放方式 | 适用场景 |
|------|---------|---------|
| MP3 | Windows Media Player COM | 高质量音效（任务状态音） |
| WAV | System.Media.SoundPlayer | 简单音效（提醒、警告） |

### 5.2 PowerShell 执行策略

由于 Windows 安全策略限制，直接使用 `& script.ps1` 可能会被阻止。

**解决方案**：使用 `Start-Process` 并添加 `-ExecutionPolicy Bypass`：

```powershell
Start-Process -FilePath "powershell.exe" `
    -ArgumentList "-ExecutionPolicy Bypass -File `"$ScriptPath`" -Type $Type" `
    -WindowStyle Hidden -Wait:$false
```

### 5.3 异步播放

为避免音效播放阻塞 Agent 流程，使用 `-Wait:$false` 参数让音效在后台播放：

```powershell
Start-Process ... -Wait:$false  # 不等待，立即继续
```

---

## 6. 最佳实践

### 6.1 音效选择原则

- **不要滥用** - 只在关键状态变化时播放
- **区分优先级** - 卡点/完成用强音效，进度用轻音效
- **考虑环境** - 用户可能在会议/深夜，提供关闭选项

### 6.2 消息配合

播放音效时**必须**配合文字消息，不要只播声音：

```powershell
# ✅ 正确
Invoke-AgentSound -Type difficulty
Write-Host "⚠️ 遇到卡点：网络连接失败，请检查网络"

# ❌ 错误（用户不知道发生了什么）
Invoke-AgentSound -Type difficulty
```

### 6.3 错误处理

音效播放失败**不应**影响主任务流程：

```powershell
try {
    Invoke-AgentSound -Type progress
} catch {
    # 音效播放失败不影响主流程
    Write-Verbose "音效播放失败: $_"
}
```

---

## 7. 音效资源推荐

| 网站 | 特点 | 许可 |
|------|------|------|
| [freesound.org](https://freesound.org/) | 社区上传，种类丰富 | CC 许可 |
| [mixkit.co](https://mixkit.co/free-sound-effects/) | 精选免费音效 | 免版税 |
| [pixabay.com](https://pixabay.com/sound-effects/) | 高质量音效 | Pixabay 许可 |

**搜索关键词**：
- 任务完成：`mission complete`, `success`, `achievement`
- 进度更新：`progress`, `level up`, `checkpoint`
- 警告/卡点：`alert`, `warning`, `error`, `attention`

---

## 8. 故障排查

### 8.1 音效不播放

| 症状 | 原因 | 解决方案 |
|------|------|---------|
| 无声音 | 文件不存在 | 检查 `sounds/` 目录是否有对应 MP3 |
| 权限错误 | PowerShell 执行策略 | 使用 `Start-Process -ExecutionPolicy Bypass` |
| COM 错误 | WMP 组件问题 | 使用备用播放方式或忽略 |

### 8.2 调试命令

```powershell
# 检查音效文件是否存在
Test-Path "C:\Users\31509\clawd\Project\audio\sounds\Mission_Complete.MP3"

# 手动播放测试（使用 Windows Media Player）
Start-Process "wmplayer.exe" "C:\Users\31509\clawd\Project\audio\sounds\Mission_Complete.MP3"

# 检查 PowerShell 执行策略
Get-ExecutionPolicy
```

---

## 9. 更新记录

### 2026-02-16
- 创建 Skill
- 添加任务状态音效：`difficulty`, `progress`, `complete`
- 记录 MP3 播放实现和 PowerShell 执行策略解决方案

---

## 总结

**核心口诀**：
> 卡点用 difficulty，进度用 progress，完成用 complete，文字配合不可少。

**关键要点**：
1. 音效文件放在 `Project/audio/sounds/`
2. 使用 `Start-Process` 避免 PowerShell 执行策略限制
3. 异步播放（`-Wait:$false`）不阻塞主流程
4. 必须配合文字消息，不要只播声音
