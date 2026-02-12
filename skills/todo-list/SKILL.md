# Todo List Skill

**Description:** Manage a simple markdown-based todo list.
**Data Source:** `memory/todos.md`

## Usage

### 1. List Todos (指令：【待办事项】)
- **Trigger:** User says "待办事项", "todo", "what needs doing", or "list tasks".
- **Action:**
  1. Read `memory/todos.md`.
  2. Display all **incomplete** tasks (`- [ ]`) clearly.
  3. Optionally mention recently completed tasks (`- [x]`) if relevant (e.g. "Completed today").
  4. If the file is empty or missing, say "No active todos."

### 2. Add Todo
- **Trigger:** User says "remind me to..." or "add todo..."
- **Action:**
  1. Append `- [ ] Task description (User) [YYYY-MM-DD]` to `memory/todos.md`.
  2. Confirm to user.

### 3. Complete Todo
- **Trigger:** User says "mark [task] as done" or "I did [task]".
- **Action:**
  1. Edit `memory/todos.md` to change `- [ ]` to `- [x]` for the matching line.
  2. Celebrate briefly! 🎉

### 4. Remove/Clear
- **Trigger:** User says "delete [task]" or "clear completed".
- **Action:**
  1. Edit file to remove the line(s).
