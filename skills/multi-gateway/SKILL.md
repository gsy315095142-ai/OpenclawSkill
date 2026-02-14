---
name: multi-gateway
description: 多台电脑 OpenClaw 协作指南。当需要配置多台电脑之间的 OpenClaw 远程连接、任务分发、或讨论分布式执行方案时使用。
---

# Multi-Gateway 多机协作

此 Skill 记录多台电脑之间 OpenClaw 的连接与协作配置经验。

## 1. 配置被控端（另一台电脑）

### 1.1 修改 Gateway bind

默认 Gateway 只监听 `loopback`（本机），要允许局域网访问，需修改 `bind` 为 `"lan"`。

编辑 `~\.openclaw\openclaw.json`：

```json
"gateway": {
  "port": 18789,
  "mode": "local",
  "bind": "lan",    // ← 关键！可选值: "loopback" | "lan" | "auto" | "custom" | "tailnet"
  "auth": {
    "token": "your-token-here"
  }
}
```

**bind 可选值：**
- `loopback` - 仅本机访问（默认）
- `lan` - 局域网访问
- `auto` - 自动选择
- `custom` - 自定义 IP
- `tailnet` - Tailscale 网络

### 1.2 重启 Gateway

```bash
openclaw gateway restart
```

### 1.3 获取连接信息

在被控端运行：

```bash
openclaw gateway status
```

记录：
- **IP 地址**（如 `192.168.1.52`）
- **端口号**（默认 `18789`）
- **Token**（在配置文件的 `gateway.auth.token`）

## 2. 主控端配置（本机）

主控端无需修改配置，只需获得被控端的连接信息即可远程调用。

### 2.1 连接信息存储

将被控端信息记录在 `TOOLS.md` 或 `MEMORY.md` 中：

```markdown
### 远程 OpenClaw 节点

| 名称 | IP | 端口 | Token |
|------|-----|------|-------|
| AI电脑 | 192.168.1.52 | 18789 | f74bba... |
```

## 3. 远程调用方式

### 3.1 直接 API 调用

```powershell
# 测试连接
Invoke-WebRequest -Uri "http://192.168.1.52:18789/" -Headers @{Authorization="Bearer <token>"} -UseBasicParsing

# 调用 spawn 任务（需通过 WebSocket 或特定 API）
```

### 3.2 通过主控端分发任务

主控端 Agent 可以：
1. 评估任务复杂度
2. 决定本地执行还是远程执行
3. 调用远程 Gateway API 分发任务

## 4. 互联网访问（Tailscale 方案）

如需在互联网上远程访问，使用 Tailscale：

### 4.1 被控端配置

```json
"gateway": {
  "tailscale": {
    "mode": "serve"    // 或 "funnel" 用于公开访问
  }
}
```

### 4.2 要求

- 两台电脑都安装 Tailscale
- 登录同一 Tailscale 账号/网络
- 被控端开启 Tailscale Serve 模式

## 5. 常见问题

### Q: bind 改成 "all" 或 "0.0.0.0" 报错？

**A:** 这是错误的值！正确值是 `"lan"`，不是 `"all"` 或 `"0.0.0.0"`。

Schema 只接受：`"auto" | "lan" | "loopback" | "custom" | "tailnet"`

### Q: Node 配对码是什么？

**A:** Node 配对是给手机/平板用的，不是给电脑之间连接用的。电脑之间通过 Gateway API 远程调用。

## 6. 使用场景

- **任务分发**：主控端收到任务 → 评估复杂度 → 分发给其他电脑执行
- **负载均衡**：多台电脑并行处理任务
- **资源利用**：利用其他电脑的 GPU/算力执行任务
- **异地协作**：通过 Tailscale 实现互联网远程控制

---

*经验来源：2026-02-14 配置多机协作时的踩坑记录*
