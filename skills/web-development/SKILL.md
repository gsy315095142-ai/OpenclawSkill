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

### 1.3 设计目标前置 (Design Goals First) ⭐新增
- **原则**: 当页面展示数值/规则时，先展示"设计目标"，再展示具体数值模块。
- **好处**: 让用户理解"为什么这样设计"，再看到"具体是什么"。
- **实现**: 使用突出的卡片式布局展示3-5个核心目标，每个目标配图标+标题+简短描述。

### 1.4 多卡片并排布局 (Multi-Card Grid) ⭐新增
- **场景**: 当页面有3个并列的内容模块（如3种玩法、3种打赏方式）时。
- **布局**: 使用 `grid-template-columns: repeat(3, 1fr)` 并排展示。
- **区分度**: 每个卡片使用不同颜色的边框（`border-color`），hover 时边框加亮+阴影。
- **标签**: 每个卡片顶部可加标签（如"免费"、"付费"、"高级"）区分等级。

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
  - <span style="background:#fee2e2; color:#dc2626; padding:2px 5px;">[早上]</span> <span style="background:#ffedd5; color:#ea580c; padding:2px 5px;">[下午]</span> <span style="background:#dbeafe; color:#2562eb; padding:2px 5px;">[晚上]</span>

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

### 2.5 横向时间轴设计 (Horizontal Timeline) ⭐新增
- **场景**: 展示流程步骤时，优先考虑横向布局（从左到右）。
- **结构**:
  - 上方：横向节点 + 箭头连接
  - 下方：选中步骤的详细卡片
  - 底部：导航按钮（上一步/下一步）+ 进度点
- **交互**: 点击节点切换详情，添加淡入动画。
- **响应式**: 移动端自动变为纵向布局。

### 2.6 图片占位方案 (Image Placeholder) ⭐新增
- **场景**: 当真实图片暂时缺失，但需要展示"这里会有图片"时。
- **方案**: 使用大号 emoji（3-4em）作为占位，配合渐变背景。
- **优点**: 避免空白，提供视觉暗示，后续替换真实图片即可。

## 3. 交付与交互 (Delivery & Interaction)

### 3.1 开发服务器启动
- **规则**: 对于前端项目（Vite/React/Vue 等），在打开浏览器预览之前，**必须先启动开发服务器**。
- **命令示例**:
  - Vite: `cmd /c "cd /d <项目目录> && npm run dev"`
  - 启动后等待控制台显示 `Local: http://localhost:xxxx/`
- **注意**: 不要假设服务器已经在运行，每次预览前都要检查或重新启动。

### 3.1.1 服务器状态验证（必须执行）
- **规则**: 启动服务器后，**必须**使用 `process log` 检查日志，确认看到 `Local: http://localhost:xxxx/` 输出后，才能告诉用户"服务器已启动"。
- **禁止**: 仅仅执行启动命令就认为服务器已运行，必须验证日志确认。
- **教训**: 曾出现执行了启动命令后，没有验证日志就告诉用户"服务器已启动"，但实际上服务器并未成功启动，导致用户刷新页面无法访问。

### 3.2 自动预览
- **规则**: 开发服务器启动成功后，使用 `exec start chrome "http://localhost:xxxx/"` 指令打开浏览器。
- **静态 HTML**: 对于纯静态 HTML 文件，使用 `exec start chrome "file://..."` 指令打开。

### 3.3 交互反馈
- **悬停效果**: 为所有可交互元素（链接、卡片）添加 `:hover` 动画（上浮、发光、变色）。

### 3.4 响应式断点 (Responsive Breakpoints) ⭐新增
- **三档断点**:
  - `> 1024px`: 完整3列布局
  - `768px - 1024px`: 2列布局
  - `< 768px`: 单列布局
- **移动端优化**: 隐藏次要信息（如表格中的详细列），保持核心内容可见。

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

### 多卡片并排布局 CSS 模板 ⭐新增
```css
.cards-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 25px;
}

.card {
  background: linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.03) 100%);
  border: 2px solid rgba(255,255,255,0.15);
  border-radius: 20px;
  padding: 25px;
  transition: all 0.3s ease;
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 40px rgba(0,0,0,0.3);
}

/* 不同颜色变体 */
.card.type-a { border-color: rgba(255, 107, 107, 0.4); }
.card.type-a:hover { border-color: rgba(255, 107, 107, 0.7); }

.card.type-b { border-color: rgba(255, 217, 61, 0.4); }
.card.type-b:hover { border-color: rgba(255, 217, 61, 0.7); }

@media (max-width: 1024px) {
  .cards-grid { grid-template-columns: repeat(2, 1fr); }
}
@media (max-width: 768px) {
  .cards-grid { grid-template-columns: 1fr; }
}
```

### 横向时间轴 CSS 模板 ⭐新增
```css
.timeline-track {
  display: flex;
  align-items: center;
  justify-content: center;
}

.timeline-node {
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
}

.node-circle {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: var(--node-color);
  display: flex;
  align-items: center;
  justify-content: center;
}

.timeline-arrow {
  width: 40px;
  color: rgba(255,255,255,0.3);
}

/* 移动端变为纵向 */
@media (max-width: 768px) {
  .timeline-track { flex-direction: column; }
  .timeline-arrow { transform: rotate(90deg); }
}
```

---

## 5. 经验教训 (Lessons Learned)

### 5.1 开发服务器误报问题
- **问题**: 执行启动命令后，没有验证日志就告诉用户"服务器已启动"，但实际未启动成功。
- **解决**: 新增 3.1.1 规则，强制要求验证日志。
- **日期**: 2026-02-13

### 5.2 内容区分度不足问题
- **问题**: 多个并列内容模块（如3种竞猜玩法）排版相似，用户反馈"容易混淆"。
- **解决**: 使用卡片式布局 + 不同颜色边框 + 标签区分，提高视觉区分度。
- **日期**: 2026-02-13
