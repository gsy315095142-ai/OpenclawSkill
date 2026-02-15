# OpenRouter 图片生成解决方案

## 调研发现

基于 glm-5 的初步调研，已发现核心问题：

### 问题 1：OpenClaw 模型配置缺少 `output` 字段

**当前配置**（`openclaw.json`）：
```json
{
  "id": "google/gemini-3-pro-image-preview",
  "input": ["text", "image"]
  // ❌ 缺少 output 字段
}
```

**OpenRouter API 返回的正确配置**：
```json
{
  "id": "google/gemini-3-pro-image-preview",
  "architecture": {
    "input_modalities": ["text", "image"],
    "output_modalities": ["image", "text"]  // ✅ 支持图片输出
  }
}
```

### 问题 2：图片生成 API 调用方式

通过 OpenRouter 生成图片的标准请求格式：

```json
POST https://openrouter.ai/api/v1/chat/completions
Headers:
  Authorization: Bearer {OPENROUTER_API_KEY}
  Content-Type: application/json

Body:
{
  "model": "openai/gpt-5-image",
  "messages": [
    {
      "role": "user",
      "content": "Generate a simple red circle image"
    }
  ]
}
```

响应格式（图片为 base64 编码）：
```json
{
  "choices": [{
    "message": {
      "content": [
        {"type": "text", "text": "Here's your image:"},
        {"type": "image_url", "image_url": {"url": "data:image/png;base64,iVBORw0..."}}
      ]
    }
  }]
}
```

---

## 推荐解决方案

### 方案 A：修改 openclaw.json 模型配置（推荐）

添加 `output` 字段到图片生成模型配置：

```json
{
  "models": {
    "providers": {
      "openrouter": {
        "models": [
          {
            "id": "google/gemini-3-pro-image-preview",
            "name": "Gemini 3 Pro Image",
            "input": ["text", "image"],
            "output": ["image", "text"],  // ← 添加此行
            "contextWindow": 32000,
            "pricing": { "input": 0.0, "output": 0.0 }
          },
          {
            "id": "openai/gpt-5-image", 
            "name": "GPT-5 Image",
            "input": ["text", "image"],
            "output": ["image", "text"],  // ← 添加此行
            "contextWindow": 128000,
            "pricing": { "input": 0.0, "output": 0.0 }
          }
        ]
      }
    }
  }
}
```

**验证方式**：
```bash
curl https://openrouter.ai/api/v1/models | grep -A 5 "gemini-3-pro-image"
```

### 方案 B：检查 OpenClaw 的 LLM 调用逻辑

如果 OpenClaw 已经支持多模态输出，问题可能在于：
1. 响应解析逻辑未处理 `image_url` 类型
2. 需要更新 `skills/llm/SKILL.md` 或相关处理代码

### 方案 C：直接使用 API（绕过限制）

在 OpenClaw 修复前，直接用 curl/脚本调用：

```powershell
$headers = @{
    "Authorization" = "Bearer $env:OPENROUTER_API_KEY"
    "Content-Type" = "application/json"
}
$body = @{
    model = "openai/gpt-5-image"
    messages = @(@{ role = "user"; content = "Generate a cat image" })
} | ConvertTo-Json

$response = Invoke-RestMethod -Uri "https://openrouter.ai/api/v1/chat/completions" `
    -Method Post -Headers $headers -Body $body
```

---

## 需要进一步确认的问题

1. OpenClaw 的模型配置是否支持 `output` 字段？
2. 如果支持，添加后能否正确识别图片输出？
3. 如果不支持，是否需要修改 OpenClaw 代码？

**建议下一步**：
- 查看 OpenClaw 源码中模型配置的解析逻辑
- 或咨询 OpenClaw 社区/文档关于多模态输出的支持情况

---

## 参考资源

- OpenRouter 模型列表 API: https://openrouter.ai/api/v1/models
- OpenRouter 文档: https://openrouter.ai/docs
- OpenClaw 配置路径: `~/.openclaw/openclaw.json`

---

**调研时间**: 2026-02-15
**调研模型**: glm-5 (zai/glm-5)
**状态**: 初步发现，待验证
