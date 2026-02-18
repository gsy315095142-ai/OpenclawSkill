# Local LLM Deployment (本地部署大模型)

此 Skill 定义了在本地部署大语言模型（LLM）的最佳实践，用于节省 API Token 费用并实现离线使用。

---

## 1. 适用场景

- 节省 API 费用（长期使用成本低）
- 数据隐私保护（敏感数据不上传云端）
- 离线使用（无需网络连接）
- 自定义模型（微调后的私有模型）

---

## 2. 硬件要求评估

### 2.1 显存需求参考

| 模型大小 | 显存需求 | 适合显卡 | 推荐方案 |
|---------|---------|---------|---------|
| 1.5B | 2-3 GB | GTX 1060 6GB | 入门级 |
| 7B | 6-8 GB | RTX 3060/4060 | ⭐ 推荐 |
| 13B | 12-16 GB | RTX 3080/4080 | 高性能 |
| 32B | 24-32 GB | RTX 3090/4090 | 顶级配置 |

### 2.2 RTX 5060 特别说明

**问题**：PyTorch 2.10 暂不支持 sm_120 架构（RTX 5060）
**解决方案**：
1. 使用 CUDA 12.6+ 和 PyTorch nightly 版本
2. 或使用 CPU 模式（性能较低）
3. 等待官方更新支持

---

## 3. 部署方案对比

### 3.1 推荐方案：Ollama ⭐

**优点**：
- 一键安装，开箱即用
- 自动管理模型下载
- 兼容 OpenAI API 格式
- 支持 CUDA 加速

**缺点**：
- 模型选择有限
- 不适合高级定制

**适用**：快速上手、个人使用

### 3.2 进阶方案：vLLM

**优点**：
- 高性能（PagedAttention）
- 支持高并发
- 适合生产环境

**缺点**：
- 配置复杂
- 需要手动管理依赖

**适用**：生产部署、多用户场景

### 3.3 轻量方案：llama.cpp

**优点**：
- 支持 CPU/GPU 混合
- 超低显存占用
- 跨平台支持

**缺点**：
- 需要手动编译
- 功能相对简单

**适用**：低配置设备、边缘部署

---

## 4. Ollama 部署流程

### 4.1 安装步骤

**Windows**：
```powershell
# 方法1：winget（推荐）
winget install Ollama.Ollama

# 方法2：官网下载安装包
# https://ollama.com/download
```

**macOS**：
```bash
brew install ollama
```

**Linux**：
```bash
curl -fsSL https://ollama.com/install.sh | sh
```

### 4.2 拉取模型

```bash
# 列出可用模型
ollama list

# 拉取推荐模型（7B 级别）
ollama pull llama3.1:8b        # Meta Llama 3.1
ollama pull qwen2.5:7b         # 阿里通义千问
ollama pull deepseek-r1:7b     # DeepSeek

# 拉取轻量模型（1.5B 级别）
ollama pull qwen2.5:1.5b
ollama pull llama3.2:1b
```

### 4.3 启动服务

```bash
# 启动 API 服务（后台运行）
ollama serve

# 测试服务
ollama run llama3.1:8b
```

### 4.4 配置 OpenClaw 连接

修改 `~/.openclaw/openclaw.json`：

```json
{
  "models": {
    "providers": {
      "ollama": {
        "baseUrl": "http://localhost:11434",
        "api": "openai-completions",
        "models": [
          {
            "id": "llama3.1:8b",
            "name": "Llama 3.1 8B (Local)",
            "contextWindow": 8192,
            "maxTokens": 4096,
            "cost": { "input": 0, "output": 0 }
          }
        ]
      }
    }
  },
  "agents": {
    "defaults": {
      "model": {
        "primary": "ollama/llama3.1:8b"
      }
    }
  }
}
```

---

## 5. 注意事项

### 5.1 权限要求

⚠️ **重要**：安装软件需要管理员权限

- Windows：需要 UAC 确认
- macOS/Linux：需要 sudo 权限

### 5.2 网络问题

**模型下载慢**：
- 使用镜像源（国内）
- 或手动下载模型文件

**GitHub 访问失败**：
- 配置代理
- 或使用 Gitee 镜像

### 5.3 模型存储位置

**默认路径**：
- Windows：`C:\Users\<用户名>\.ollama`
- macOS/Linux：`~/.ollama`

**修改路径**：
```bash
# 设置环境变量
$env:OLLAMA_MODELS = "D:\ollama-models"  # Windows
export OLLAMA_MODELS=/data/ollama-models  # Linux/Mac
```

---

## 6. 故障排查

### 6.1 模型加载失败

**症状**：`Error: model not found`
**解决**：
```bash
ollama pull <model-name>
```

### 6.2 CUDA 不可用

**症状**：使用 CPU 模式，速度很慢
**检查**：
```bash
nvidia-smi
```
**解决**：
- 更新 NVIDIA 驱动
- 安装 CUDA Toolkit

### 6.3 端口被占用

**症状**：`Error: listen tcp :11434: bind: address already in use`
**解决**：
```bash
# 查找占用进程
lsof -i :11434  # Linux/Mac
netstat -ano | findstr :11434  # Windows

# 杀死进程或更换端口
ollama serve --port 11435
```

---

## 7. 经验记录

### 7.1 RTX 5060 部署问题（2026-02-16）

**问题**：自动安装失败，PowerShell 命令无法完成安装
**原因**：
1. 安装程序需要用户交互确认
2. 需要管理员权限
3. 安全软件可能拦截

**解决方案**：
1. **手动运行安装程序**（最可靠）
2. 双击 `OllamaSetup.exe`
3. 点击"是"允许管理员权限
4. 按向导完成安装

**后续步骤**：
1. 验证安装：`ollama --version`
2. 拉取模型：`ollama pull deepseek-r1:7b`
3. 启动服务：`ollama serve`
4. 配置 OpenClaw 连接

### 7.2 429 Rate Limit 错误（2026-02-16）

**问题**：拉取模型时遇到 `429: Rate exceeded`
**原因**：Ollama 官方仓库对下载请求做了频率限制
**解决方案**：
1. 等待 5-10 分钟后重试
2. 使用国内镜像源：
   ```powershell
   $env:OLLAMA_HOST="https://ollama.m.daocloud.io"
   ollama pull deepseek-r1:7b
   ```
3. 或换时间段下载（避开高峰）

### 7.3 子 Agent 本地模型策略（2026-02-16）⭐ 最佳实践

**策略名称**：主-从模型分工协作

**核心思想**：
- **主 Agent**：使用云端大模型（Kimi/GPT-4）处理复杂任务
- **子 Agent**：使用本地小模型（DeepSeek 7B）处理日常简单任务
- **优势**：省钱（本地免费）+ 高效（复杂任务质量高）

**分工建议**：

| 任务类型 | 推荐模型 | 原因 |
|---------|---------|------|
| 日常对话、简单问答 | 本地 DeepSeek | 响应快，免费 |
| 代码片段解释 | 本地 DeepSeek | 足够用，省钱 |
| 短文本生成 | 本地 DeepSeek | 成本低 |
| 长文档分析 | 云端 Kimi | 上下文长，理解力强 |
| 复杂推理、数学 | 云端 Kimi | 推理能力强 |
| 多步骤任务 | 云端 Kimi | 稳定性高 |

**实现方式**：

```json
// 主 Agent 配置（openclaw.json）
{
  "agents": {
    "defaults": {
      "model": {
        "primary": "moonshot/kimi-k2.5",  // 主模型：云端
        "fallbacks": [
          "ollama/deepseek-r1:7b"          // 备选：本地
        ]
      }
    }
  }
}
```

```json
// 子 Agent 配置（特定任务）
{
  "agentId": "daily-chat",
  "model": "ollama/deepseek-r1:7b",  // 子 Agent 专用本地模型
  "task": "日常对话处理"
}
```

**使用示例**：

```
用户：DeepSeek: 今天天气怎么样？
→ 子 Agent 用本地模型回答

用户：帮我分析这份10页的报告
→ 主 Agent 用云端 Kimi 分析
```

**注意事项**：
1. 本地模型只有 8K 上下文，不适合长对话
2. 复杂任务 fallback 到云端模型
3. 可以显式指定模型：`DeepSeek: ` 或 `本地模型: `

### 7.4 远程访问方案（Tailscale）⭐ **2026-02-16 新增**

**场景**：想在其他设备（如笔记本、手机、服务器）上使用这台电脑的 Ollama

**推荐方案**：Tailscale VPN（最安全、最简单）

---

#### 7.4.1 架构说明

```
[其他设备] --Tailscale VPN--> [本机 Ollama @ 100.x.x.x:11434]
```

**优势**：
- ✅ 加密通信（WireGuard 协议）
- ✅ 无需暴露公网端口
- ✅ 跨网络（家里 ↔ 公司）
- ✅ 免费个人版足够

---

#### 7.4.2 配置步骤

**Step 1: 安装 Tailscale**
- 官网：https://tailscale.com/
- 下载安装并登录账号
- 获取本机 Tailscale IP（格式：`100.x.x.x`）

**Step 2: 重启 Ollama（绑定到 0.0.0.0）**

```powershell
# 停止当前 Ollama
taskkill /F /IM ollama.exe

# 设置环境变量并启动（绑定所有网卡）
$env:OLLAMA_HOST="0.0.0.0"
ollama serve
```

**注意**：`0.0.0.0` 表示监听所有网络接口，包括 Tailscale 虚拟网卡

**Step 3: 更新 OpenClaw 配置**

编辑 `openclaw.json`：

```json
{
  "models": {
    "providers": {
      "ollama": {
        "baseUrl": "http://100.x.x.x:11434",  // ← 改为你的 Tailscale IP
        "api": "openai-completions",
        "models": [
          {
            "id": "deepseek-r1:7b",
            "name": "DeepSeek R1 7B (Remote)",
            "reasoning": true,
            "input": ["text"],
            "cost": { "input": 0, "output": 0 },
            "contextWindow": 8192,
            "maxTokens": 4096
          }
        ]
      }
    }
  }
}
```

**Step 4: 测试连接**

```powershell
# 在其他设备上测试
Invoke-RestMethod -Uri "http://100.x.x.x:11434/api/tags"
```

---

#### 7.4.3 故障排查

| 症状 | 原因 | 解决方案 |
|------|------|---------|
| 连接超时 | Tailscale 未连接 | 检查 Tailscale 客户端状态 |
| 拒绝连接 | Ollama 未绑定 0.0.0.0 | 重启 Ollama 并设置 `OLLAMA_HOST=0.0.0.0` |
| 找不到主机 | IP 地址错误 | 在 Tailscale 客户端确认正确的 IP |

---

#### 7.4.4 安全建议

**为什么不需要额外认证？**
- Tailscale 本身提供 WireGuard 加密
- 只有加入同一 Tailscale 网络的设备才能访问
- 比暴露到公网安全得多

**如需更高安全性**：
- 可在 Tailscale ACL 中限制端口访问
- 或使用 Ollama 的 API 密钥功能（如有）

---

### 7.5 其他远程方案对比

| 方案 | 安全性 | 复杂度 | 适用场景 |
|------|--------|--------|----------|
| **Tailscale** ⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐ | **最推荐**，个人/小团队 |
| 局域网直连 | ⭐⭐⭐ | ⭐⭐ | 同网络内设备 |
| Nginx + Basic Auth | ⭐⭐⭐ | ⭐⭐⭐ | 局域网内简单保护 |
| 直接暴露 0.0.0.0 | ⭐ | ⭐ | 仅测试，不推荐生产 |
| 云服务器部署 | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | 需要 24h 在线 |

---

## 总结

**本地部署口诀**：
> Ollama 最简便，7B 模型适合咱，手动安装最可靠，配置好就能离线玩。

**远程访问口诀**：
> Tailscale 最安全，加密通信不花钱，IP 一换就连通，远程调用真方便。

**关键要点**：
1. 先评估硬件（显存最关键）
2. Ollama 是入门首选
3. 安装需要管理员权限
4. 自动安装可能失败，手动安装更可靠
5. **远程访问用 Tailscale，安全又简单**
