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

## 🇨🇳 国内头条

### [公司名] 标题
- **要点**: 核心内容摘要
- **详情**: 链接

...

## 🌏 国际头条

### [公司名] 标题
- **要点**: 核心内容摘要
- **详情**: 链接

...

## 📊 一句话总结
> 今日 AI 领域核心变化一句话概括
```

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
