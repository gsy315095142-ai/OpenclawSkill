# OpenClaw Config Manager Skill

本 Skill 封装了对 OpenClaw 核心配置文件 (`openclaw.json` 和 `auth-profiles.json`) 的安全修改流程。用于添加新的 AI 提供商、模型或更新认证信息。

## 适用场景
- 用户通过指令 (如 "添加新的 API", "接入 DeepSeek", "配置 PoloAI") 请求扩展模型能力。
- 需要修改系统核心参数或网关配置。

## 数据源与路径
- **核心配置**: `C:\Users\%USERNAME%\.openclaw\openclaw.json`
  - 定义提供商 (providers)、模型列表 (models)、代理参数 (agents)。
- **认证配置**: `C:\Users\%USERNAME%\.openclaw\agents\main\agent\auth-profiles.json`
  - 定义具体的 API Key 和认证方式 (profiles)。

## 核心原则 (Safety First)
1. **备份优先**: 修改任何 JSON 前，必须先复制一份 `.bak` 文件。
2. **分步执行**: 先修改结构 (openclaw.json)，重启验证成功后，再修改认证 (auth-profiles.json)。
3. **确认机制**: 每一步修改前必须向用户确认关键信息 (模型ID、BaseURL、Key等)。

## 1. 添加新提供商流程 (Add Provider)

### 步骤 A: 收集信息 (Ask)
在执行修改前，必须询问用户：
1. **Name**: 提供商名称 (如 `poloai`, `deepseek`)。
2. **Base URL**: 接口地址 (如 `https://api.deepseek.com/v1`)。
3. **Models**: 需要接入的具体模型 ID (如 `deepseek-chat`, `gpt-4o`)。
   - *注意*: 这一步至关重要，否则无法在配置中正确注册模型。
4. **Key**: (可选) API 密钥，如果不提供则留空待用户填。

### 步骤 B: 修改 openclaw.json (Structure)
1. **备份**: `copy openclaw.json openclaw.json.bak.<时间戳>`
2. **读取**: 读取当前 `openclaw.json`。
3. **编辑**: 注入新提供商块。
   ```json
   "models": {
     "providers": {
       "<provider_name>": {
         "baseUrl": "<base_url>",
         "api": "openai-completions",
         "models": [
           { "id": "<model_id>", "name": "<display_name>", ... } // 必须包含用户指定的具体模型ID
         ]
       }
     }
   }
   ```
4. **注入短别名 (Alias)**:
   - 在 `agents.defaults.models` 中为新模型添加 alias（如 `claude-opus-4-6`），方便用户调用。
5. **应用**: 调用 `gateway config.apply` 应用变更 (会自动重启)。

### 步骤 C: 修改 auth-profiles.json (Secret)
1. **备份**: `copy auth-profiles.json auth-profiles.json.bak`
2. **读取**: 读取当前文件。
3. **编辑**:
   - **Step 1**: 添加认证 profile。
     ```json
     "profiles": {
       "<provider_name>:default": {
         "provider": "<provider_name>",
         "type": "api_key",
         "key": "<api_key_placeholder>"
       }
     }
     ```
   - **Step 2 (必须)**: 更新 `lastGood` 指针。
     ```json
     "lastGood": {
       "<provider_name>": "<provider_name>:default"
     }
     ```
   - **Step 3 (可选)**: 初始化 `usageStats` 以保持结构完整。
     ```json
     "usageStats": {
       "<provider_name>:default": { "lastUsed": 0, "lastFailureAt": 0, "errorCount": 0 }
     }
     ```
4. **通知**: 告知用户 key 已预留，请手动填写或提供。

## 2. 修改现有配置 (Update Config)
... (包括修改模型参数、切换默认模型等)

---

## 3. 常见错误与经验 (Common Errors & Lessons) ⭐ **2026-02-15 新增**

### 3.1 模型配置字段限制

**问题**：在 `openclaw.json` 的模型配置中添加 `"output": ["image", "text"]` 字段

**后果**：Gateway 启动失败，报错提示不支持的字段

**原因**：
- OpenClaw 模型配置 Schema **不支持 `output` 字段**
- 仅支持：`id`, `name`, `input`, `cost`, `contextWindow`, `maxTokens`, `reasoning`

**正确做法**：
```json
{
  "id": "google/gemini-3-pro-image-preview",
  "name": "Gemini 3 Pro Image Preview",
  "input": ["text", "image"],
  // ❌ 不要添加 "output": ["image", "text"]
  "cost": { "input": 5, "output": 15 },
  "contextWindow": 1000000,
  "maxTokens": 8192
}
```

**注意**：`input` 字段中的 `"image"` 仅表示**视觉理解能力**（看图），不代表**图片生成能力**。

---

### 3.2 Heartbeat 配置位置

**问题**：在 `openclaw.json` 根级别添加 `heartbeat` 配置

**后果**：Gateway 启动失败，报错提示不支持的字段

**原因**：
- `openclaw.json` **根级别不支持 `heartbeat` 字段**
- Heartbeat 配置应该放在 `agents.defaults.heartbeat` 或具体 agent 配置中

**正确做法**：
```json
{
  "agents": {
    "defaults": {
      "heartbeat": {
        "every": "30s",
        "prompt": "Read HEARTBEAT.md if it exists..."
      }
    }
  }
}
```

**注意**：`heartbeat` 不是根级配置项，必须放在 `agents.defaults` 或 `agents.list[].heartbeat` 中。

#### 修复案例（2026-02-16）

**问题现象**：
- Heartbeat 配置放在 `hooks.internal.entries.heartbeat`
- 会话启动时**没有自动触发**启动确认流程
- 需要手动发送消息才能激活

**错误配置**：
```json
"hooks": {
  "internal": {
    "entries": {
      "heartbeat": {
        "enabled": true,
        "prompt": "Read HEARTBEAT.md..."
      }
    }
  }
}
```

**修复步骤**：
1. 备份 `openclaw.json`
2. 删除 `hooks.internal.entries` 中的 `heartbeat` 节点
3. 在 `agents.defaults` 中添加正确的 `heartbeat` 配置：
```json
"agents": {
  "defaults": {
    "heartbeat": {
      "every": "30s",
      "prompt": "Read HEARTBEAT.md if it exists..."
    }
  }
}
```
4. 重启 Gateway

**验证成功**：
- 重启后会话自动触发 Heartbeat
- 自动读取 `HEARTBEAT.md` 和任务执行规范
- 自动发送启动确认消息

---

### 3.3 配置修改 checklist

修改 `openclaw.json` 前必须检查：

| 检查项 | 说明 |
|--------|------|
| ✅ 备份 | 先创建 `.bak` 备份文件 |
| ✅ 字段有效性 | 确认新增字段在 Schema 中支持 |
| ✅ JSON 格式 | 确保没有语法错误（逗号、括号匹配）|
| ✅ 重启验证 | 修改后重启 Gateway 验证是否正常 |

**安全原则**：
> "宁可多备份一次，不要修复一次故障"
> "不确定的字段，先查文档再添加"
