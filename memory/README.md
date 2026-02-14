# Memory 目录结构

## 目录说明

```
memory/
├── dm/                    # 私聊记录（按 chat_id 隔离）
│   └── {chat_id}/
│       └── YYYY-MM-DD.md
├── group/                 # 群聊记录（按 chat_id 隔离）
│   └── {chat_id}/
│       └── YYYY-MM-DD.md
├── shared/                # 共享的长期记忆（不区分会话）
│   ├── YYYY-MM-DD.md     # 工作日志
│   └── todos.md          # 待办事项
├── feishu_pending_updates.json  # 飞书待更新队列
└── README.md              # 本文件
```

## 使用规则

### 1. 私聊记录
- 存放路径：`memory/dm/{chat_id}/YYYY-MM-DD.md`
- 每个私聊会话有独立的目录
- 避免不同私聊之间的文件冲突

### 2. 群聊记录
- 存放路径：`memory/group/{chat_id}/YYYY-MM-DD.md`
- 每个群聊会话有独立的目录
- 避免不同群聊之间的文件冲突

### 3. 共享记忆
- 存放路径：`memory/shared/`
- 工作日志、项目记录、待办事项等
- 不区分来源会话的通用内容

## 命名规范

- **chat_id**：使用飞书的原始 ID（如 `ou_xxx` 或 `oc_xxx`）
- **日期文件**：`YYYY-MM-DD.md` 格式
- **特殊文件**：使用小写英文，如 `todos.md`

## 2026-02-14 重构记录

**原因**：私聊和群聊的聊天记录文件冲突导致 400 API 错误

**解决方案**：
1. 按会话类型和 chat_id 隔离存储目录
2. 现有工作日志移至 `shared/` 目录
3. 未来新建的会话记录按规则存放

**备份位置**：`memory_backup_20260214_163032/`
