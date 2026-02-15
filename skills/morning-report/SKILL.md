# Morning Report / 早报 Skill

自动获取国内外 AI 最新资讯，生成结构化早报。

## 触发方式

1. **关键词触发**: 用户发送包含「早报」或「morning report」的消息时自动触发
2. **定时任务**: 可通过 cron 配置每天早上自动推送

## 资讯来源

### 🇨🇳 国内 AI 来源

| 公司 | 官网/渠道 | RSS/API |
|-----|----------|---------|
| 智谱 AI | chatglm.cn | 官网新闻页 |
| DeepSeek | deepseek.com / GitHub | Release Notes |
| 阿里通义 | qwenlm.github.io | Blog |
| 字节跳动 | volcengine.com | 产品动态 |
| 百度文心 | yiyan.baidu.com | 更新日志 |
| 讯飞星火 | xinghuo.xfyun.cn | 新闻中心 |
| Moonshot | kimi.moonshot.cn | 产品更新 |
| MiniMax | minimaxi.com | 官方博客 |
| 零一万物 | 01.ai | Blog |
| 阶跃星辰 | stepfun.com | 官网动态 |

**技术媒体:**
- 机器之心: jiqizhixin.com
- Synced 中文: syncedreview.com
- 量子位: qbitai.com

### 🌏 国外 AI 来源

| 公司 | 官网 | RSS/News |
|-----|------|----------|
| OpenAI | openai.com | /news, /blog |
| Anthropic | anthropic.com | /news |
| Google AI | blog.google | /technology/ai |
| Meta AI | ai.meta.com | /blog |
| Microsoft | blogs.microsoft.com | /ai |
| xAI | x.ai | x.com/xAI |
| Mistral | mistral.ai | /news |
| Cohere | cohere.com | /blog |

**技术媒体:**
- TechCrunch AI Feed
- The Verge AI
- VentureBeat AI

## 输出格式

```
🌅 早报 (YYYY-MM-DD)

## 🇨🇳 国内 AI 模型动态

### 🔥 [公司] [模型名]
- **状态**: 新闻内容 / 无新动态
- **亮点**: 如有新闻，简要说明

### [公司] [模型名]
- **今日**: 无新动态

## 🌏 国际 AI 模型动态

### [公司] [模型名]
- **今日**: 无新动态

## 📊 一句话总结
> 今日 AI 领域核心变化一句话概括
```

### 格式规范 (Format Standard) ⭐ **新增**

**采用方案 A：列表式 + Emoji 区分**

```
🌅 **早报** YYYY-MM-DD

**🔥 今日热点**
模型名 — 新闻内容简述

━ ━ ━ ━ ━

**🇨🇳 国内模型 (N家)**
🟢 模型名 (有动态)
⚪ 模型名 · 模型名 · 模型名 (无动态)

━ ━ ━ ━ ━

**🌏 国际模型 (N家)**
🟢 模型名 (有动态)
⚪ 模型名 · 模型名 · 模型名 (无动态)

━ ━ ━ ━ ━

📌 **小结**: 一句话总结今日 AI 动态
```

**排版规则**：
1. **分隔线**: 使用 `━ ━ ━ ━ ━` 分区
2. **Emoji 标记**:
   - 🟢 绿色 = 有24小时内新闻
   - ⚪ 灰色 = 无新动态
3. **模型名称**: 明确标注（如 GLM-5、DeepSeek-V3）
4. **数量标注**: 括号内标注 (N家)
5. **无动态处理**: 多个无动态的模型用 `·` 连接，节省空间

**完整示例**：
```
🌅 **早报** 2026-02-15

**🔥 今日热点**
智谱 GLM-5 — 本周发布新一代模型（记忆/多模态提升）

━ ━ ━ ━ ━

**🇨🇳 国内模型 (10家)**
🟢 智谱 GLM-5
⚪ 百度文心 · 阿里通义 · 字节豆包 · DeepSeek
⚪ 讯飞星火 · Kimi · MiniMax · 零一万物 · 阶跃星辰

━ ━ ━ ━ ━

**🌏 国际模型 (7家)**
⚪ OpenAI GPT-4 · Claude · Gemini · Llama · Grok · Mistral · Cohere

━ ━ ━ ━ ━

📌 **小结**: 周日平静，智谱 GLM-5 本周发布是国产模型最大亮点
```

**目的**：
- 简洁清晰，一目了然
- Emoji 快速区分有/无动态
- 分隔线明确分区
- 节省空间，适合移动端阅读

**模型名称对照表**：

| 公司 | 模型名称 |
|------|----------|
| 智谱 AI | GLM-5 / GLM-4 |
| DeepSeek | DeepSeek-V3 |
| 阿里 | 通义千问 Qwen |
| 字节 | 豆包 |
| 百度 | 文心一言 |
| 讯飞 | 星火 |
| Moonshot | Kimi |
| OpenAI | GPT-4 / GPT-4o |
| Anthropic | Claude 3.5 |
| Google | Gemini 1.5 |
| Meta | Llama 3 |
| xAI | Grok |
| Mistral | Mistral Large |
| Cohere | Command R+ |

## 内容筛选规范 (Content Filtering) ⭐ **新增**

### 时间范围
- **只收录过去24小时内的新闻** (昨天 09:00 到今天 09:00)
- **严禁混入过期内容**：即使是重要新闻，超过24小时也不放入早报

### 完整性要求 (Completeness) ⭐ **新增**

**必须列出所有关注的公司/模型**，无论是否有新闻：

| 类型 | 处理方式 |
|------|----------|
| 有24小时内新闻 | 正常展示标题+摘要 |
| 无24小时内新闻 | 标注 **"最近24小时无新闻"** |

**目的**：
- 让用户了解全貌（哪些公司有动静，哪些没有）
- 避免用户猜测"是不是漏了"
- 体现专业性和透明度

### 新闻来源检查清单

#### 🇨🇳 国内必须检查 (10家公司)
- [ ] 智谱 AI
- [ ] DeepSeek
- [ ] 阿里通义
- [ ] 字节豆包
- [ ] 百度文心
- [ ] 讯飞星火
- [ ] Moonshot (Kimi)
- [ ] MiniMax
- [ ] 零一万物
- [ ] 阶跃星辰

#### 🌏 国际必须检查 (8家公司)
- [ ] OpenAI
- [ ] Anthropic
- [ ] Google AI
- [ ] Meta AI
- [ ] Microsoft AI
- [ ] xAI
- [ ] Mistral
- [ ] Cohere

## 使用方法

### 手动触发
用户发送: `早报` 或 `morning report`

### 定时自动推送
配置 cron job:
```json
{
  "name": "morning-report-daily",
  "schedule": { "kind": "cron", "expr": "0 9 * * *", "tz": "Asia/Shanghai" },
  "payload": { "kind": "systemEvent", "text": "__morning_report_trigger__" }
}
```

## 去重策略

1. **标题相似度检测**: Levenshtein 距离 > 80% 视为重复
2. **时间窗口**: 24 小时内同一事件只保留最早来源
3. **来源优先级**: 官方渠道 > 技术媒体 > 第三方报道

## 文件结构

```
C:\Users\31509\clawd\skills\morning-report/
├── SKILL.md              # 本文件
├── sources.json          # 资讯源配置
├── report-template.md    # 早报模板
└── fetch-news.py         # 抓取脚本
```

## 当前实现状态

- ✅ **SKILL.md** - 技能文档
- ✅ **sources.json** - 17个国内外 AI 来源配置
- ✅ **fetch-news.py** - 新闻抓取脚本（基础版）
- ✅ **report-template.md** - 输出格式模板

## 使用方法 (Agent)

当用户发送「早报」时，Agent 应：

1. 读取 `sources.json` 获取资讯源列表
2. 使用 `web_fetch` 或其他方式获取各来源最新内容
3. 按模板格式生成早报
4. 输出给用户

## 配置来源清单

### 🇨🇳 国内 (10家公司 + 3家媒体)
- 智谱 AI、DeepSeek、阿里通义、字节豆包、百度文心
- 讯飞星火、Moonshot、MiniMax、零一万物、阶跃星辰
- 机器之心、Synced 中文、量子位

### 🌏 国际 (8家公司 + 2家媒体)
- OpenAI、Anthropic、Google AI、Meta AI、Microsoft AI
- xAI、Mistral、Cohere
- TechCrunch AI、The Verge AI

## TODO (未来优化)

- [ ] 实现 RSS 订阅自动抓取
- [ ] 实现网页内容爬取 + AI 摘要生成
- [ ] 支持自定义关注的公司列表
- [ ] 添加定时推送功能
- [ ] 实现智能去重算法
