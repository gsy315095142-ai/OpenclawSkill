# Memory

## User Preferences

### ⚠️ Magic Word 执行规则（重要）
当收到 Magic Word 指令时，**必须先读取对应的 Skill 文件**，然后严格按照 Skill 规范执行。不可跳过此步骤。

---

### Magic Words 清单

- **Magic Word:** "早报" (Morning Report)
  - **Skill 文件:** `skills/morning-report/SKILL.md` ← **必须先读取**
  - **Action:** 按 Skill 规范获取最新 AI 资讯（过去 24h），生成结构化早报
  - **关键要求:** 必须包含国内外来源、按模板格式输出、去重
  - **遇阻处理:** 若工具不可用，按 `skills/execution-standards/SKILL.md` 的"遇阻停顿原则"处理

- **Magic Word:** "任务队列"
  - **Action:** 读取 `TASKS.md`，展示当前进行中/待办的任务，按顺序执行
  - **说明:** 这是 **Agent 要执行的任务**，用于管理 Agent 的工作流程

- **Magic Word:** "待办事项" (Todo List)
  - **Skill 文件:** `skills/todo-list/SKILL.md` ← **必须先读取**
  - **Action:** 按 Skill 规范管理/列出任务
  - **说明:** 这是 **用户要做的事情**，用于记录备忘，与"任务队列"完全不同

- **Magic Word:** "OpenRouter 账户"
  - **Skill 文件:** `skills/openrouter-account/SKILL.md` ← **必须先读取**
  - **Action:** Fetch account balance using stored read-only API Key.

---

### 其他偏好
- **Browser Preference:** ALWAYS use Google Chrome (`profile="chrome"`) for web tasks.
- **Security:** Feishu access restricted to 郭郭 only.

## Current State
- **Identity:** Clawd (Digital Owl).
- **User:** 郭郭.
- **Status:** Active.
