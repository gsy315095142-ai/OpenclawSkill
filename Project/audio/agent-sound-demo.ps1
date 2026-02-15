# 🎯 Agent 音效集成示例
# 展示如何在 Agent 代码中使用音效系统

# ============================================
# 使用方式：在 Agent 脚本中引用这些函数
# ============================================

# 音效播放函数
function Invoke-AgentSound {
    param(
        [Parameter(Mandatory=$true)]
        [ValidateSet("difficulty", "progress", "complete", "reminder", "warning", "success", "error")]
        [string]$Type
    )
    
    $ScriptPath = "C:\Users\31509\clawd\Project\audio\scripts\play-sound.ps1"
    
    if (Test-Path $ScriptPath) {
        # 使用 Start-Process 避免执行策略限制
        Start-Process -FilePath "powershell.exe" -ArgumentList "-ExecutionPolicy Bypass -File `"$ScriptPath`" -Type $Type" -WindowStyle Hidden -Wait:$false
    }
}

# ============================================
# 场景 1：任务遇到卡点，向用户求助
# ============================================
function Invoke-DifficultySound {
    <#
    .SYNOPSIS
        任务遇到阻碍，需要向用户求助时播放
    .EXAMPLE
        Invoke-DifficultySound
        Write-Host "⚠️ 需要您的协助：无法连接到远程服务器"
    #>
    Invoke-AgentSound -Type "difficulty"
}

# ============================================
# 场景 2：任务有阶段性进展
# ============================================
function Invoke-ProgressSound {
    <#
    .SYNOPSIS
        完成阶段性步骤时播放
    .EXAMPLE
        Invoke-ProgressSound
        Write-Host "✅ Step 1 完成，正在执行 Step 2..."
    #>
    Invoke-AgentSound -Type "progress"
}

# ============================================
# 场景 3：任务完成
# ============================================
function Invoke-CompleteSound {
    <#
    .SYNOPSIS
        任务全部完成时播放
    .EXAMPLE
        Invoke-CompleteSound
        Write-Host "🎉 所有任务已完成！"
    #>
    Invoke-AgentSound -Type "complete"
}

# ============================================
# 演示：模拟任务执行流程
# ============================================
function Show-TaskDemo {
    Write-Host "🚀 开始执行任务..." -ForegroundColor Cyan
    
    # Step 1
    Start-Sleep -Seconds 1
    Invoke-ProgressSound
    Write-Host "✅ Step 1: 读取配置文件 - 完成" -ForegroundColor Green
    
    # Step 2 - 遇到卡点
    Start-Sleep -Seconds 1
    Invoke-DifficultySound
    Write-Host "⚠️ Step 2: 需要 API Key 才能继续" -ForegroundColor Yellow
    Write-Host "   请提供 OpenRouter API Key..." -ForegroundColor Gray
    
    # 模拟用户输入后继续
    Start-Sleep -Seconds 2
    Invoke-ProgressSound
    Write-Host "✅ Step 2: API Key 已配置 - 继续执行" -ForegroundColor Green
    
    # Step 3
    Start-Sleep -Seconds 1
    Invoke-ProgressSound
    Write-Host "✅ Step 3: 下载模型文件 - 完成" -ForegroundColor Green
    
    # 任务完成
    Start-Sleep -Seconds 1
    Invoke-CompleteSound
    Write-Host "🎉 任务全部完成！" -ForegroundColor Green -BackgroundColor Black
}

# 导出函数
Export-ModuleMember -Function Invoke-AgentSound, Invoke-DifficultySound, Invoke-ProgressSound, Invoke-CompleteSound, Show-TaskDemo

# 如果是直接运行此脚本，执行演示
if ($MyInvocation.InvocationName -eq $MyInvocation.MyCommand.Name) {
    Write-Host "🔊 音效集成示例" -ForegroundColor Cyan
    Write-Host "================" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "可用函数：" -ForegroundColor Yellow
    Write-Host "  Invoke-DifficultySound  - 任务遇到卡点"
    Write-Host "  Invoke-ProgressSound    - 阶段性进展"
    Write-Host "  Invoke-CompleteSound    - 任务完成"
    Write-Host ""
    Write-Host "运行演示 (Show-TaskDemo) ..." -ForegroundColor Gray
    Write-Host ""
    
    Show-TaskDemo
}
