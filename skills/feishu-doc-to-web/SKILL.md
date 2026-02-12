# Feishu Doc to Web Generator

将飞书云文档（结构化 JSON 数据）转换为现代化、精美排版的 HTML 网页。

## 功能特性
- **数据驱动**：输入标准的 Block JSON 数组，输出 HTML。
- **智能排版**：
  - **Timeline**：自动识别时间线内容并渲染为垂直时间轴。
  - **Grid Card**：自动识别产品章节并渲染为卡片网格。
  - **Info Panel**：自动美化基本信息区域。
- **零依赖**：基于 Tailwind CSS (CDN)，无需 `npm install`，单脚本运行。

## 目录结构
- `generate.js`: 核心转换脚本
- `template.html`: (内嵌于 JS 中) 页面骨架

## 使用方法

1. 确保已有文档内容的 JSON 文件（如 `su_content.json`）。
2. 修改 `generate.js` 中的 `jsonPath` 指向该文件。
3. 运行转换：
   ```bash
   node skills/feishu-doc-to-web/generate.js
   ```
4. 生成的 `su_story.html` 将位于同级目录。

## 扩展建议
- 可修改 `htmlTemplate` 中的 CSS 变量以定制配色。
- 可在 `parseBlocks` 函数中添加更多 Block 类型的支持（如图片、表格）。
