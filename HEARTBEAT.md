# HEARTBEAT.md - 启动时自动执行

## 🚀 启动确认任务（每次新会话自动执行）

### 必做检查清单
- [x] 读取 `skills/execution-standards/SKILL.md`
- [x] 读取 `skills/web-search/SKILL.md`
- [x] 读取 `skills/multi-model-async/SKILL.md`
- [x] 向用户发送启动确认消息

### 启动确认消息格式
```
✅ 已读取任务执行规范 (Execution Standards)
当前配置：
- 默认模型: [model_name]
- 工作目录: [workspace_path]
- 关键技能: execution-standards, web-search, multi-model-async

准备就绪，请指示。
```

---

## 💡 说明

**为什么用 Heartbeat？**
- OpenClaw 每次启动时会触发一次 heartbeat
- 利用这个机制自动完成启动确认
- 无需用户手动提醒

**执行时机**：
- 新会话启动时
- Gateway 重启后
- 长时间无活动后的重新连接

---

*配置时间: 2026-02-15*
