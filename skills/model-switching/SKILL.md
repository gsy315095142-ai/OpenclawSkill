# Model Switching (模型切换)

此 Skill 记录如何在对话中动态切换模型的方法。

## 1. 快速切换方法

### 1.1 使用 session_status 工具（推荐）

```json
session_status({
  "model": "zai/glm-5"
})
```

**支持的模型：**
- `moonshot/kimi-k2.5` - Moonshot Kimi-K2.5（默认）
- `zai/glm-5` - 智谱 AI GLM-5
- `openrouter/google/gemini-3-pro-preview` - Gemini 3 Pro
- `openrouter/sourceful/riverflow-v2-pro` - Riverflow V2 Pro
- `ollama/deepseek-r1:32b` - DeepSeek-R1 32B（远程 Ollama）
- `deepseek/deepseek-chat` - DeepSeek 官方 API

### 1.2 使用别名

也可以使用配置中定义的别名：
- `glm-5` → `zai/glm-5`
- `Kimi-K2.5` → `moonshot/kimi-k2.5`
- `Gemini 3 Pro` → `openrouter/google/gemini-3-pro-preview`

## 2. 查看当前模型

```json
session_status()
```

返回结果中会显示：
```
🧠 Model: zai/glm-5 · 🔑 api-key 7c6968…RG4Haz (zai:default)
```

## 3. 常见场景

### 3.1 用户要求切换模型

**用户说：** "切换为 glm-5 模型"

**Agent 应该：**
1. 直接调用 `session_status({ "model": "zai/glm-5" })`
2. 确认切换成功后回复用户

**❌ 错误做法：**
- 让用户自己发送 `/model` 命令
- 说"我无法切换模型"

### 3.2 检查当前模型

**用户说：** "你现在是哪个模型？"

**Agent 应该：**
1. 调用 `session_status()` 查看当前模型
2. 根据返回结果准确回复

## 4. 注意事项

1. **切换模型后上下文保留**：切换模型不会丢失对话历史
2. **Token 计数重置**：新模型的 token 使用量会重新计算
3. **某些模型不支持图片**：如 `deepseek/deepseek-chat` 只支持文本
4. **远程 Ollama 需要网络**：`ollama/*` 模型需要远程服务可用

## 5. 错误案例（2026-02-17）

**案例名称**：告诉用户"无法切换模型"

**错误经过：**
1. 用户要求切换到 glm-5
2. Agent 回复"你可以发送 /model zai/glm-5 来切换"
3. 用户指出"你明明可以直接切换的"
4. Agent 尝试了错误的方法（sessions_send），最后才发现 session_status 可以切换

**根本原因：**
- 不熟悉 session_status 工具的 model 参数
- 误以为需要用户发送命令

**防错口诀：**
> "模型切换用 session_status，model 参数指定即可"
> "不要让用户自己发命令，Agent 可以直接切换"

---

*创建时间: 2026-02-17*
*来源: 模型切换踩坑记录*
