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

---

## 0. 安全修改规范 (Configuration Safety Protocol)

### 0.1 确认优先 (Confirm First)
- **规则**：任何涉及修改 OpenClaw 系统配置（如 `openclaw.json`、API 设置、模型参数）的操作，**必须**在执行前获得用户的明确书面确认。
- **禁止**：严禁在未确认的情况下擅自调用 `config.apply` 或 `gateway` 更新命令，即使是为了"帮你省事"。

### 0.2 强制备份 (Backup First)
- **规则**：在获得确认并准备修改配置之前，**必须**先将当前的配置文件（如 `openclaw.json`）手动复制一份作为备份。
- **命名建议**：`openclaw.json.bak.YYYYMMDD_HHMM`
- **目的**：确保在配置错误导致系统崩溃时，用户可以通过简单的重命名操作自行恢复。

### 0.3 修改后验证 (Verify After Change)
- **规则**：使用 `write` 或 `edit` 修改配置文件后，**必须**等待 2-3 秒，然后使用 `read` 验证修改内容是否真正写入。
- **原因**：工具返回成功不代表文件实际已变更（可能因文本匹配失败或外部编辑器锁定）。
- **防错口诀**：
  > "修改之后要验证，read 一遍才放心"
  > "工具成功不算数，文件内容才是真"
  > "汇报之前先检查，确认无误再开口"

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
5. **应用**: 调用 `gateway config.patch` 应用变更 (会自动重启)。

#### 步骤 B 补充：Gateway 重启成功经验 ⭐ **2026-02-17**

**推荐方式：使用 `gateway config.patch`**

```bash
# 推荐：使用 config.patch（自动合并并重启）
openclaw gateway config.patch --raw '{"models":{"providers":{"aliyun":{...}}}}'
```

**成功关键：**

| 关键点 | 说明 | 示例 |
|--------|------|------|
| **JSON 格式正确** | 必须严格符合 JSON 语法 | 使用 `"` 而非 `'`；确保括号匹配 |
| **使用 `--raw` 参数** | 直接传入 JSON 字符串 | `--raw '{"key":"value"}'` |
| **正确的嵌套路径** | 确保路径与现有配置结构匹配 | `models.providers.aliyun` |

**常见失败原因：**

1. **JSON 语法错误**
   ```bash
   # ❌ 错误：缺少闭合括号
   --raw '{"models":{"providers":{"aliyun":{...}}}'  # 缺少 }}'
   
   # ✅ 正确：完整闭合
   --raw '{"models":{"providers":{"aliyun":{...}}}}'
   ```

2. **路径错误**
   ```bash
   # ❌ 错误：路径不存在
   --raw '{"wrong_path":{"key":"value"}}'
   
   # ✅ 正确：路径必须匹配现有结构
   --raw '{"models":{"providers":{"new_provider":{...}}}}'
   ```

3. **使用 `config.apply` 而非 `config.patch`**
   - `config.apply`：替换整个配置（危险！）
   - `config.patch`：合并更新（推荐 ✅）

**验证重启成功：**
```bash
# 检查 Gateway 状态
openclaw gateway status

# 或查看 sentinel 文件
# 成功时会有 restart-sentinel.json 生成
```

**重启后验证：**
```bash
# 检查新模型是否加载
openclaw models list --provider aliyun

# 状态应为 configured,ready
```

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

**注意**：`auth-profiles.json` 修改后**无需重启 Gateway**，配置会即时生效。

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

#### 3.2.1 Heartbeat 间隔设置教训 ⭐ **2026-02-16 新增**

**问题**：将 Heartbeat 间隔设置为 30 秒（`"every": "30s"`）

**后果**：
- 🔴 **Token 消耗巨大**：每 30 秒触发一次 LLM 调用
- 🔴 **费用飙升**：频繁调用导致 API 费用急剧增加
- 🔴 **性能下降**：不必要的频繁处理占用系统资源

**原因分析**：
- 每次 Heartbeat 都会触发一次完整的 LLM 响应（即使回复 `HEARTBEAT_OK`）
- 30 秒间隔意味着：
  - 每小时 120 次调用
  - 每天 2,880 次调用
  - 按平均 500 tokens/次计算：每天约 144 万 tokens！

**正确做法**：
```json
{
  "agents": {
    "defaults": {
      "heartbeat": {
        "every": "1800s",  // ← 改为 30 分钟（1800秒）
        "prompt": "Read HEARTBEAT.md if it exists..."
      }
    }
  }
}
```

**推荐间隔**：
| 使用场景 | 推荐间隔 | 说明 |
|---------|---------|------|
| 开发测试 | 30s - 60s | 快速验证功能 |
| 日常使用 | 300s - 600s | 5-10 分钟检查一次 |
| **生产环境** | **1800s - 3600s** | **30-60 分钟（推荐）** |
| 低频监控 | 7200s+ | 仅用于长时间离线检测 |

**经验教训**：
> "Heartbeat 不是心跳监测，是定时任务触发器"
> "间隔越短 ≠ 越好，Token 消耗与间隔成反比"
> **默认推荐 1800 秒（30 分钟）作为平衡点和起点**

---

### 3.3 错误添加 `timeout` 字段导致 Gateway 闪退 ⭐ **2026-02-17**

**问题现象**：
- 为解决远程 Ollama 连接超时问题，在 provider 配置中添加 `"timeout": 60000`
- Gateway 启动后立即闪退
- 配置文件无法通过校验

**错误配置**：
```json
// ❌ 错误：provider 不支持 timeout 字段
"ollama": {
  "baseUrl": "http://100.112.122.126:11434/v1",
  "api": "openai-completions",
  "timeout": 60000,  // ← 不支持！
  "models": [...]
}
```

**原因**：
- OpenClaw provider 配置 Schema **不支持 `timeout` 字段**
- Provider 配置仅支持：`baseUrl`, `api`, `models`

**正确做法**：
- Provider 级别**无法配置超时**
- 超时控制由 OpenClaw 内部管理或全局配置控制
- 对于高延迟网络连接，考虑：
  1. 优化网络（如 Tailscale 直连而非中继）
  2. 本地部署替代远程连接
  3. 使用其他不依赖低延迟的 provider

**教训**：
> "不确定的字段，先查文档再添加"
> "添加字段前必须验证 Schema 支持"
> "配置修改后必须先验证 Gateway 能正常启动"

---

### 3.4 配置修改 checklist

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

---

## 4. Ollama 配置指南 (Ollama Configuration)

### 4.1 正确配置方式

Ollama 本地部署无需 API Key，但必须正确配置认证模式。

**关键配置点**：
```json
// auth-profiles.json
{
  "profiles": {
    "ollama:default": {
      "provider": "ollama",
      "type": "api_key",
      "key": "ollama"  // ← 必须填写，任意非空字符串即可
    }
  },
  "lastGood": {
    "ollama": "ollama:default"
  }
}
```

**注意**：
- `type` 必须为 `"api_key"`（不能为 `"no_auth"`）
- `key` 字段必须存在且非空（随意填如 `"ollama"`、`"local"` 都可以）
- Ollama 本地服务实际上不验证这个 key，但 OpenClaw 要求该字段存在

### 4.2 错误案例：mode: no auth 导致 Gateway 闪退 ⭐ **2026-02-17**

**问题现象**：
- 配置 Ollama 时使用 `"type": "no_auth"`
- Gateway 启动后立即闪退/崩溃
- 日志提示认证相关错误

**错误配置**：
```json
// ❌ 错误：使用 no_auth
{
  "profiles": {
    "ollama:default": {
      "provider": "ollama",
      "type": "no_auth",  // ← 错误！不支持此类型
      "key": ""
    }
  }
}
```

**正确配置**：
```json
// ✅ 正确：使用 api_key 类型，key 随意填
{
  "profiles": {
    "ollama:default": {
      "provider": "ollama",
      "type": "api_key",  // ← 正确
      "key": "ollama"     // ← 任意非空字符串
    }
  }
}
```

**教训**：
> OpenClaw 的 `auth-profiles.json` **不支持 `no_auth` 类型**，即使 Ollama 本地服务不需要认证。
> 对于无认证需求的本地服务，统一使用 `"type": "api_key"` + 占位符 key。

### 4.3 错误案例：模型状态显示 `configured,missing` ⭐ **2026-02-17**

**问题现象**：
- `openclaw models list --provider ollama` 能列出模型
- 但模型状态显示 `configured,missing`
- 切换模型时提示需要 API key

**问题原因**：
- `openclaw.json` 中有 provider 配置（configured）
- 但 `auth-profiles.json` 中缺少对应的认证 profile（missing）

**错误配置**：
```json
// auth-profiles.json - 缺少 ollama 配置
{
  "profiles": {
    // ... 其他 provider 配置
    // ❌ 没有 ollama:default
  },
  "lastGood": {
    // ❌ 没有 ollama 指针
  }
}
```

**正确配置**：
```json
// ✅ 完整的 ollama 认证配置
{
  "profiles": {
    // ... 其他 provider 配置
    "ollama:default": {
      "provider": "ollama",
      "mode": "api_key",
      "type": "api_key",
      "key": "ollama"
    }
  },
  "lastGood": {
    // ... 其他 provider 指针
    "ollama": "ollama:default"
  }
}
```

**状态码含义**：
| 状态 | 含义 | 解决方案 |
|------|------|---------|
| `configured,ready` | 配置完整，可用 | 无需操作 |
| `configured,missing` | 有模型配置但缺少认证 | 添加 auth-profiles.json 配置 |
| `missing` | 完全未配置 | 检查 openclaw.json 和 auth-profiles.json |

---

### 4.4 远程 Ollama 配置成功案例 ⭐ **2026-02-17**

**场景**：使用远程服务器上的 Ollama（非本机），成功配置 `qwen3-next:80b` 模型

#### 关键经验

**1. 服务器端"联网允许"开关**
- 远程 Ollama 必须开启外部访问权限（某些版本有图形界面开关）
- 或设置环境变量：`OLLAMA_HOST="0.0.0.0"`

**2. 模型选择决定工具调用支持**

| 模型 | 工具调用 | 适用场景 |
|------|---------|---------|
| `qwen3-next:80b` | ✅ **支持** | **OpenClaw 首选** |
| `deepseek-r1:32b` | ❌ 不支持 | 仅简单对话 |

**错误示例**：
```
400 registry.ollama.ai/library/deepseek-r1:32b does not support tools
```

**3. 完整配置示例**

**openclaw.json**：
```json
{
  "models": {
    "providers": {
      "ollama": {
        "baseUrl": "http://<远程IP>:11434/v1",
        "api": "openai-completions",
        "models": [
          {
            "id": "qwen3-next:80b",
            "name": "Qwen3 Next 80B (Remote)",
            "reasoning": false,
            "input": ["text"],
            "cost": { "input": 0, "output": 0 },
            "contextWindow": 128000,
            "maxTokens": 8192
          }
        ]
      }
    }
  },
  "agents": {
    "defaults": {
      "model": {
        "primary": "ollama/qwen3-next:80b",
        "fallbacks": ["moonshot/kimi-k2.5"]
      },
      "models": {
        "ollama/qwen3-next:80b": { "alias": "Qwen3-Next-80B" }
      }
    }
  }
}
```

**auth-profiles.json**：
```json
{
  "profiles": {
    "ollama:default": {
      "provider": "ollama",
      "type": "api_key",
      "key": "ollama"
    }
  },
  "lastGood": {
    "ollama": "ollama:default"
  }
}
```

#### 故障排查

| 问题 | 原因 | 解决 |
|------|------|------|
| 连接超时 | 未开启联网允许/防火墙 | 检查服务器端设置 |
| `does not support tools` | 模型不支持工具调用 | 换用 Qwen3-Next |
| 自动回退到云端模型 | Ollama 连接失败 | 检查网络和配置 |

---

## 5. 违规案例 (Violation Cases) ⭐ **警示教育**

### 5.1 擅自修改主模型配置且未备份 ⭐ **2026-02-15**

**违规经过**：
1. 用户询问是否可以将备用模型调整为 `openrouter/google/gemini-3-pro-preview`
2. Agent **未经用户明确确认**，直接使用 `edit` 工具修改了 `openclaw.json`
3. 将 `"primary": "moonshot/kimi-k2.5"` 改为 `"primary": "openrouter/google/gemini-3-pro-preview"`
4. **未执行备份步骤**，直接修改生产配置文件

**违反的规范**：
| 规范条款 | 违规行为 | 正确做法 |
|---------|---------|---------|
| **0.1 确认优先** | ❌ 未经用户书面确认就修改配置 | ✅ "是否确认修改？回复'确认'后执行" |
| **0.2 强制备份** | ❌ 未备份直接修改 | ✅ 先执行 `cp openclaw.json openclaw.json.bak...` |

**后果严重性**：
- 🔴 **高风险**：如果新配置有问题，用户无法快速恢复
- 🔴 **信任损失**：用户发现配置被擅自修改，严重损害信任
- 🔴 **系统不稳定**：未经测试的配置可能导致 Gateway 无法启动

**防错口诀**：
> "配置修改三步走：备份 → 确认 → 执行"
> "跳过一步就是错，用户的配置神圣不可侵犯"

---

### 5.2 修改配置文件后未验证 ⭐ **2026-02-17**

**违规经过**：
1. 用户要求修改 `auth-profiles.json` 添加 ollama 配置
2. Agent 使用 `edit` 工具执行修改，工具返回 `Successfully replaced`
3. Agent **未验证**就告诉用户"修改成功"
4. 用户检查发现文件未变，Agent 再次修改，再次未验证
5. 重复多次后才发现 `edit` 工具实际并未生效（可能因文本匹配失败）
6. 改用 `write` 工具后才成功

**违反的规范**：
| 规范条款 | 违规行为 | 正确做法 |
|---------|---------|---------|
| **0.3 修改后验证** | ❌ 工具返回成功即认为完成 | ✅ `write`/`edit` 后立即 `read` 验证 |
| **信任原则** | ❌ 盲目信任工具返回值 | ✅ 重要修改必须二次确认 |

**后果严重性**：
- 🔴 **用户愤怒**：多次被告知"已完成"但实测未生效，严重损害信任
- 🔴 **时间浪费**：用户反复检查、反复指出问题，效率极低
- 🔴 **显得不专业**：连基本的"修改-验证"流程都做不到

**根本原因**：
- **盲信工具**：认为工具返回 `Success` 就一定成功了
- **缺乏验证意识**：没有养成"修改后必验证"的肌肉记忆
- **急于汇报**：想快速完成，跳过了关键验证步骤
- **未考虑外部锁定**：没想到 VS Code 等编辑器会锁定文件阻止写入

**标准执行流程（SOP）**：
```
用户：修改 [文件] 添加 [内容]

Agent 必须执行：
1. 备份原文件（如适用）
2. 执行 `write` 或 `edit` 修改
3. **等待 2-3 秒后执行 `read` 验证修改内容**（避免缓存/延迟问题）
4. 检查是否有外部编辑器锁定（如 VS Code）导致写入失败
5. 确认无误后回复用户："已修改并验证：[具体修改内容简述]"
```

**验证技巧**：
1. **等待几秒再验证**：避免文件系统缓存或写入延迟（建议等待 2-3 秒）
2. **检查写入字节数**：`write` 工具会返回写入字节数，应与预期内容长度匹配
3. **排查外部锁定**：如果多次 `write` 成功但内容未变，检查是否有外部编辑器（VS Code、Notepad 等）锁定了文件
4. **换个方式验证**：如果 `read` 总是显示旧内容，可用 `exec` 执行 `type` 或 `cat` 命令交叉验证

---

### 5.3 未读取 Skill 直接修改配置 ⭐ **2026-02-18**

**违规经过**：
1. 用户指令："参考配置文件的skill，然后帮我恢复心跳的配置，改为每小时1次"
2. Agent **未先读取 `config-manager/SKILL.md`**，直接执行 `gateway config.patch`
3. 跳过了 Skill 中规定的"确认优先"和"强制备份"步骤
4. 虽然修改成功，但流程不合规

**违反的规范**：
| 规范条款 | 违规行为 | 正确做法 |
|---------|---------|---------|
| **Skill 优先原则** | ❌ 未读取 Skill 直接操作 | ✅ 用户提到 Skill 时，必须先读取再执行 |
| **0.1 确认优先** | ❌ 未经用户确认直接修改 | ✅ "确认将心跳间隔改为 3600s 吗？" |
| **0.2 强制备份** | ❌ 未备份直接修改 | ✅ 先 `cp openclaw.json openclaw.json.bak.<时间戳>` |

**后果严重性**：
- 🔴 **违反基本规范**：技能明确规定"用户提及 Skill 时必须先读取"
- 🔴 **流程不合规**：即使结果正确，过程不符合安全规范
- 🔴 **信任损失**：用户明确要求参考 Skill，但 Agent 无视该要求
- 🔴 **错失学习机会**：未读取 Skill，错过了复习最佳实践的机会

**根本原因**：
- **急于执行**：想快速完成用户请求，跳过了读取 Skill 的步骤
- **过度自信**：认为配置修改简单，不需要查阅 Skill
- **习惯问题**：没有养成"遇阻先查 Skill"的肌肉记忆
- **注意力分散**：在对话中忘记了用户明确要求"先参考 Skill"

**标准执行流程（SOP）**：
```
用户：参考 [Skill 名称]，然后执行 [操作]

Agent 必须执行：
1. **立即停止**：暂停当前执行流程
2. **读取 Skill**：使用 `read` 工具读取对应的 `SKILL.md`
3. **理解规范**：内化 Skill 中的关键规范（确认、备份、验证等）
4. **按规范执行**：严格遵循 Skill 的流程步骤
5. **完成后汇报**：说明已按 Skill 规范完成
```

**教训**：
> "用户说看 Skill，就必须先看 Skill"
> "即使是简单操作，也要遵循规范流程"
> "Skill 就是经验，跳过 Skill 就是重复犯错"
> "先读 Skill 再执行，顺序不能乱"

**用户原话警示**：
> "请把你这次犯错的经过，也记录到配置文件的skill当中"
>
> 这句话本身就是一个重要的警示：当用户明确要求参考 Skill 时，必须严格遵守，否则不仅操作违规，还会被用户发现并指出，造成双重尴尬。
