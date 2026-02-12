# Web Development Best Practices (网页开发最佳实践)

本 Skill 总结了生成高质量 HTML/Web 交付物的最佳设计模式和经验。当用户要求"生成网页"、"制作页面"或"整理内容为网页"时，请遵循以下规范。

## 1. 核心设计原则 (Core Design Principles)

### 1.1 主题化设计 (Theming)
- **拒绝通用模板**：不要总是使用白底黑字的默认样式。根据项目内容定制主题。
- **案例**:
  - **复盘/商务**: 干净、专业、蓝/灰色调。
  - **创意/魔法**: 深色背景 (`#0f0c29`)、发光效果 (`box-shadow`)、渐变文字、粒子背景。
- **字体**: 引入 Google Fonts（如 *Noto Sans SC*, *Cinzel* 等）提升质感。

### 1.2 卡片式布局 (Card UI)
- **模块隔离**: 将每个独立的信息块（如一次出差、一次会议）封装在独立的卡片容器中。
- **视觉层次**: 使用 `border-radius`, `box-shadow` 和 `backdrop-filter` (磨砂玻璃) 来增加层次感。

## 2. 内容排版规范 (Content Formatting)

### 2.1 列表化 (Listify Everything)
- **严禁大段堆砌**: 超过 2 个逗号的长句，必须拆分为列表 (`<ul>` + `<li>`)。
- **示例**:
  - ❌ *错误*: "讨论了A厅的动线、B厅的朝向、还有C厅的安全距离。"
  - ✅ *正确*:
    - A厅的动线调整
    - B厅的朝向优化
    - C厅的安全距离确认

### 2.2 时间轴细化 (Timeline Detailing)
- **分行显示**: 如果一天内发生了多件事（早/中/晚），绝不合并在同一行。
- **时间标签**: 使用彩色标签高亮时间段。
  - <span style="background:#fee2e2; color:#dc2626; padding:2px 5px;">[早上]</span> <span style="background:#ffedd5; color:#ea580c; padding:2px 5px;">[下午]</span> <span style="background:#dbeafe; color:#2563eb; padding:2px 5px;">[晚上]</span>

### 2.3 图标增强 (Visual Anchors)
- **Font Awesome**: 充分使用图标来辅助标题和列表项。
- **仪式感**: 为关键数据（小结、重点）添加专属图标容器。

### 2.4 渐进式信息披露 (Progressive Disclosure)
- **原则**: 页面只展示"精简摘要"，细节内容隐藏在 Tooltip 中。
- **场景**: 当某一点有大段解释性文字，会导致页面臃肿时。
- **实现**:
  - **Layer 1**: 关键词/标题 (Bold) + 精简描述 (Inline)。
  - **Layer 2**: 叹号图标 (`<i class="fas fa-exclamation-circle"></i>`)。
  - **Layer 3**: 悬停图标显示完整细节 (Tooltip/Hover Card)。

## 3. 交付与交互 (Delivery & Interaction)

### 3.1 自动预览
- **规则**: HTML 文件生成后，必须立即使用 `exec start chrome "file://..."` 指令打开，让用户即刻看到效果。

### 3.2 交互反馈
- **悬停效果**: 为所有可交互元素（链接、卡片）添加 `:hover` 动画（上浮、发光、变色）。

## 4. 代码模板片段 (Snippets)

### 魔法风格 CSS 变量
```css
:root {
    --bg-dark: #0f0c29;
    --text-main: #e2e8f0;
    --gold: #ffd700;
    --magic-cyan: #22d3ee;
    --card-bg: rgba(26, 22, 58, 0.6);
}
```

### Tooltip CSS 模板
```css
.info-icon { position: relative; cursor: help; margin-left: 8px; }
.info-tooltip {
    visibility: hidden; opacity: 0;
    position: absolute; bottom: 150%; left: 50%; transform: translateX(-50%);
    width: 250px; padding: 10px; background: rgba(0,0,0,0.9); color: white;
    border-radius: 8px; pointer-events: none; transition: all 0.2s; z-index: 100;
}
.info-icon:hover .info-tooltip { visibility: visible; opacity: 1; bottom: 160%; }
```
