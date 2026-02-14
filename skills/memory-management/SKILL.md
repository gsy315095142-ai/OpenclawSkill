# Memory Management Skill

Memory 目录结构管理规范和最佳实践。

## 1. 目录结构

### 1.1 标准结构

```
memory/
├── dm/{chat_id}/        # 私聊记录（按会话隔离）
├── group/{chat_id}/     # 群聊记录（按会话隔离）
├── shared/              # 共享记忆（工作日志、待办等）
├── {config-files}.json  # 配置文件（如 feishu_pending_updates.json）
└── README.md            # 目录说明
```

### 1.2 各目录用途

| 目录 | 用途 | 示例 |
|------|------|------|
| `dm/{chat_id}/` | 私聊会话记录 | `dm/ou_xxx/2026-02-14.md` |
| `group/{chat_id}/` | 群聊会话记录 | `group/oc_xxx/2026-02-14.md` |
| `shared/` | 不区分会话的共享内容 | `shared/2026-02-14.md`、`shared/todos.md` |

### 1.3 文件命名规范

- **日期文件**：`YYYY-MM-DD.md`
- **特殊文件**：小写英文，如 `todos.md`、`heartbeat-state.json`
- **chat_id**：使用飞书原始 ID（`ou_xxx` 或 `oc_xxx`）

---

## 2. 为什么需要隔离？

### 2.1 问题背景

**2026-02-14 事件**：

私聊和群聊的会话同时写入同一份聊天记录文件时，出现：
1. **并发写入冲突** - 两个会话同时修改文件
2. **内容覆盖** - 一个会话的内容被另一个覆盖
3. **API 错误** - 飞书 API 返回 `400 API 调用参数有误`

### 2.2 解决方案

按 **会话类型** + **chat_id** 双层隔离：

```
memory/
├── dm/                          # 私聊（不同用户的私聊互不干扰）
│   ├── ou_user1/2026-02-14.md
│   └── ou_user2/2026-02-14.md
└── group/                       # 群聊（不同群的记录互不干扰）
    ├── oc_group1/2026-02-14.md
    └── oc_group2/2026-02-14.md
```

### 2.3 核心原则

**每个会话 = 独立的目录**

这样即使多个会话同时写入，也不会冲突。

---

## 3. 重构步骤

### 3.1 安全重构流程

```
1. 备份现有 memory 目录
   → Copy-Item -Path "memory" -Destination "memory_backup_$(Get-Date -Format 'yyyyMMdd_HHmmss')" -Recurse

2. 创建新目录结构
   → New-Item -ItemType Directory -Path "memory\dm", "memory\group", "memory\shared" -Force

3. 分类并迁移现有文件
   - 工作日志 → shared/
   - 待办事项 → shared/
   - 配置文件 → 保留在根目录

4. 创建 README.md 说明目录结构

5. 更新 AGENTS.md 中的引用路径
   - memory/YYYY-MM-DD.md → memory/shared/YYYY-MM-DD.md
```

### 3.2 备份命令（PowerShell）

```powershell
$backupPath = "memory_backup_$(Get-Date -Format 'yyyyMMdd_HHmmss')"
Copy-Item -Path "memory" -Destination $backupPath -Recurse
Write-Host "Backup created: $backupPath"
```

### 3.3 迁移命令（PowerShell）

```powershell
# 创建目录
New-Item -ItemType Directory -Path "memory\dm", "memory\group", "memory\shared" -Force

# 移动共享文件
Move-Item -Path "memory\2026-*.md" -Destination "memory\shared\" -Force
Move-Item -Path "memory\todos.md" -Destination "memory\shared\" -Force
```

---

## 4. 写入规则

### 4.1 判断写入位置

| 场景 | 写入位置 |
|------|----------|
| 私聊中的对话记录 | `memory/dm/{chat_id}/YYYY-MM-DD.md` |
| 群聊中的对话记录 | `memory/group/{chat_id}/YYYY-MM-DD.md` |
| 工作日志、项目记录 | `memory/shared/YYYY-MM-DD.md` |
| 待办事项 | `memory/shared/todos.md` |
| 跨会话的通用信息 | `memory/shared/` |

### 4.2 读取规则

- **每日启动时**：读取 `memory/shared/YYYY-MM-DD.md`（今天 + 昨天）
- **需要会话语境时**：读取对应的 `dm/` 或 `group/` 目录
- **MAIN SESSION**：额外读取 `MEMORY.md`

---

## 5. 相关文件

| 文件 | 用途 |
|------|------|
| `AGENTS.md` | 包含 Memory 模块的读取规则 |
| `MEMORY.md` | 长期记忆（仅 main session 读取） |
| `memory/README.md` | 目录结构说明 |

---

## 6. 经验总结

### 6.1 关键教训

> **多会话并发写入 = 潜在冲突**

解决方案：隔离存储，每个会话独立目录。

### 6.2 最佳实践

1. **修改前先备份** - 永远保留回滚能力
2. **更新引用路径** - AGENTS.md 等配置文件要同步更新
3. **记录变更原因** - README.md 中说明为什么这样设计

---

*Last updated: 2026-02-14*
*Related: skills/group-chat-etiquette/SKILL.md*
