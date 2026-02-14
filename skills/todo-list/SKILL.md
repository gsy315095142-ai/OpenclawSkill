# Todo List Skill

**Description:** Manage a simple markdown-based todo list.
**Data Source:** `memory/todos.md`

## Usage

### 1. List Todos (指令：【待办事项】)
- **Trigger:** User says "待办事项", "todo", "what needs doing", or "list tasks".
- **Action:**
  1. Read `memory/todos.md`.
  2. **分类展示**（单页，不分页）：
     - **🔄 进行中**：包含 `🔄` 标记的任务
     - **📋 未开始**：不包含 `🔄` 标记的待办任务
  3. **使用列表格式，不用表格**（飞书不支持 Markdown 表格）
  4. 底部显示统计：`进行中 X 项 | 未开始 Y 项`
  5. 如果文件为空或不存在，显示 "No active todos."

**展示格式示例（列表格式）：**
```
🦉 **待办事项**

**🔄 进行中**
• 验收魔法冰球（部分特效调整、角色模型更替）_02-12_
• 验收魔法拳王（优化显示规则）_02-12_
• 调研酒店数据获取完善（年后更新）_02-10_

**📋 未开始**
• 调研 Xmax X1 _02-10_
• 项目进展预期盘点 _02-10_
• 魔法学院小程序主体变更 _02-10_

_进行中 3 项 | 未开始 3 项_
```

### 2. Add Todo
- **Trigger:** User says "remind me to..." or "add todo..."
- **Action:**
  1. Append `- [ ] Task description (User) [YYYY-MM-DD]` to `memory/todos.md`.
  2. 如果是进行中的任务，添加 `🔄` 标记：`- [ ] Task description (User) [YYYY-MM-DD] 🔄 进行中`
  3. Confirm to user.

### 3. Complete Todo
- **Trigger:** User says "mark [task] as done" or "I did [task]".
- **Action:**
  1. Edit `memory/todos.md` to change `- [ ]` to `- [x]` for the matching line.
  2. Celebrate briefly! 🎉

### 4. Remove/Clear
- **Trigger:** User says "delete [task]" or "clear completed".
- **Action:**
  1. Edit file to remove the line(s).

### 5. Mark as In Progress
- **Trigger:** User says "mark [task] as in progress" or "开始做 [task]".
- **Action:**
  1. Add `🔄 进行中` marker to the task line if not already present.
  2. Confirm to user.

---

## 状态标记说明

| 标记 | 含义 |
|------|------|
| `- [ ]` | 未开始 |
| `- [ ] ... 🔄 ...` | 进行中 |
| `- [x]` | 已完成 |

---

## ⚠️ 飞书注意事项

- **不要使用 Markdown 表格**（`| col1 | col2 |` 格式），飞书不支持
- 使用列表格式（`• item`）替代
- 日期可以用斜体或下划线格式：`_02-12_`
