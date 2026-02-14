---
name: message-queue
description: OpenClaw 消息队列处理经验。当遇到消息并发冲突、快速连续 @mentions 导致崩溃等问题时参考。
---

# Message Queue 消息队列处理

此 Skill 记录 OpenClaw 中消息并发处理的经验和解决方案。

## 1. 问题背景

### 1.1 症状

在飞书群聊中，当多个用户**快速连续 @机器人**时：
- 机器人崩溃或报错
- 部分消息无响应
- 日志显示并发冲突

### 1.2 根本原因

OpenClaw 的消息处理函数 `handleFeishuMessage` 是**异步并发执行**的：
- 每条消息到达时立即触发处理
- 多条消息同时处理，共享资源（如 session、history）产生竞争
- 导致状态混乱甚至崩溃

## 2. 解决方案：Per-Chat 队列

### 2.1 核心思路

为每个聊天（群/私聊）创建独立的消息队列：
- **同一聊天的消息**：按顺序处理（并发=1）
- **不同聊天的消息**：可以并行处理
- 使用 `p-queue` 库实现

### 2.2 代码改动

**文件**：`extensions/feishu/src/bot.ts`

```typescript
import PQueue from "p-queue";

// --- Per-chat message queue ---
const chatQueues = new Map<string, PQueue>();
const CHAT_QUEUE_CONCURRENCY = 1;
const CHAT_QUEUE_MAX_SIZE = 100;

function getOrCreateChatQueue(chatId: string): PQueue {
  let queue = chatQueues.get(chatId);
  if (!queue) {
    queue = new PQueue({ concurrency: CHAT_QUEUE_CONCURRENCY });
    chatQueues.set(chatId, queue);
  }
  return queue;
}

// Cleanup idle queues periodically
const QUEUE_CLEANUP_INTERVAL_MS = 30 * 60 * 1000;
let lastQueueCleanupTime = Date.now();

function cleanupIdleQueues(): void {
  const now = Date.now();
  if (now - lastQueueCleanupTime < QUEUE_CLEANUP_INTERVAL_MS) return;

  for (const [chatId, queue] of chatQueues) {
    if (queue.pending === 0 && queue.size === 0) {
      chatQueues.delete(chatId);
    }
  }
  lastQueueCleanupTime = now;
}
```

### 2.3 包装消息处理函数

将原有的 `handleFeishuMessage` 拆分为：
- **外层**：队列入口，负责去重和排队
- **内层** (`handleFeishuMessageImpl`)：实际处理逻辑

```typescript
export async function handleFeishuMessage(params: {...}): Promise<void> {
  // ... 去重检查 ...

  const chatId = event.message.chat_id;
  const queue = getOrCreateChatQueue(chatId);

  // Queue full protection
  if (queue.size >= CHAT_QUEUE_MAX_SIZE) {
    log(`queue full for chat ${chatId}, dropping message`);
    return;
  }

  // Process through queue
  return queue.add(() =>
    handleFeishuMessageImpl(params).catch((err) => {
      error(`error in queued message handler: ${String(err)}`);
    })
  );
}
```

## 3. 关键配置参数

| 参数 | 值 | 说明 |
|------|-----|------|
| `CHAT_QUEUE_CONCURRENCY` | 1 | 每个聊天的并发数 |
| `CHAT_QUEUE_MAX_SIZE` | 100 | 每个队列最大排队数 |
| `QUEUE_CLEANUP_INTERVAL_MS` | 30min | 空闲队列清理间隔 |

## 4. 内存管理

### 4.1 防止内存泄漏

- 定期清理空闲队列（`pending=0 && size=0`）
- 队列满时丢弃新消息并记录日志
- 消息去重机制（TTL=30min）防止重复处理

### 4.2 去重机制（已存在）

```typescript
const processedMessageIds = new Map<string, number>();
const DEDUP_TTL_MS = 30 * 60 * 1000;
```

## 5. 其他渠道参考

OpenClaw 已有类似的队列机制：
- `command-queue`：命令处理的 lane-based 队列
- Discord/Telegram 等渠道可能也需要类似处理

### 5.1 查看现有队列工具

```typescript
// openclaw/plugin-sdk
import { enqueueCommandInLane, setCommandLaneConcurrency } from "openclaw/plugin-sdk";
```

## 6. 备份策略

修改前务必备份原文件：

```bash
cp bot.ts bot.ts.backup
```

## 7. 测试验证

改动后测试：
1. 快速连续发送 3-5 条 @消息
2. 检查是否依次响应
3. 查看日志确认队列工作正常

---

*经验来源：2026-02-14 飞书群聊并发崩溃修复*
