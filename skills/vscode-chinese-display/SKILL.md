# VS Code 中文显示问题排查

## 描述
记录 VS Code 中文字符显示异常的诊断方法和解决方案。

---

## ⚠️ 典型问题：中文上方有方框

### 问题现象
- Markdown 或其他文件中的中文能正常显示
- 但每个中文字符上方有一个方框/矩形背景
- 看起来像是字体不支持或渲染错误

### ❌ 错误诊断路径

**最初误判**：以为是字体不支持中文
- 尝试修改 `editor.fontFamily` 为 `"Consolas, 'Microsoft YaHei', monospace"`
- 尝试重启 VS Code
- 问题依然存在

### ✅ 真正原因

**不是字体问题！是 VS Code 的 Unicode 高亮功能。**

VS Code 默认启用 `editor.unicodeHighlight.nonBasicASCII`，当检测到非 ASCII 字符（包括中文、全角标点、特殊符号等）时，会在这些字符周围显示高亮方框，以提醒开发者注意可能的隐藏字符问题。

**特征识别**：
- 方框出现在所有中文字符周围（不仅是缺失字体的方框/问号）
- 文件保存正常，不是只读问题
- 同时出现蓝色提示条："This document contains many non-basic ASCII unicode characters"

---

## 解决方案

### 方法 1：点击禁用（推荐）

当出现蓝色提示条时：
```
⚠️ This document contains many non-basic ASCII unicode characters
   [Disable Non ASCII Highlight]
```

直接点击 **"Disable Non ASCII Highlight"** 链接，方框立即消失。

### 方法 2：手动关闭设置

**通过 UI 设置**：
1. `Ctrl+Shift+P` → "Preferences: Open User Settings"
2. 搜索 `unicode highlight`
3. 找到 **Editor: Unicode Highlight** → **Non Basic ASCII**
4. 取消勾选

**通过 settings.json**：
```json
"editor.unicodeHighlight.nonBasicASCII": false
```

### 方法 3：仅对特定文件类型禁用

如果只想在 Markdown 文件中禁用：
```json
"[markdown]": {
    "editor.unicodeHighlight.nonBasicASCII": false
}
```

---

## 区分：真正的字体缺失 vs Unicode 高亮

| 现象 | 字体缺失 | Unicode 高亮 |
|------|---------|-------------|
| 显示内容 | 方框/问号/乱码替代中文 | 中文正常显示，但有背景方框 |
| 范围 | 可能只影响部分生僻字 | 影响所有非 ASCII 字符 |
| 伴随提示 | 无 | 有蓝色提示条 |
| 解决方案 | 更换字体 | 关闭 Unicode 高亮 |

---

## 其他相关设置

### 完全禁用 Unicode 高亮（不推荐，但可行）
```json
"editor.unicodeHighlight.enabled": false
```

### 只高亮特定类型的非 ASCII 字符
```json
"editor.unicodeHighlight.ambiguousCharacters": true,
"editor.unicodeHighlight.invisibleCharacters": true
```

---

## 经验总结

### 🎯 排查优先级

看到中文有方框时，按此顺序排查：

1. **检查是否有 Unicode 高亮提示** ← **最常见**
   - 看顶部是否有蓝色提示条
   - 点击 "Disable Non ASCII Highlight"

2. **检查字体设置**（如果无提示条）
   - 修改 `editor.fontFamily` 添加中文字体
   - 常用：`Microsoft YaHei`, `PingFang SC`, `Noto Sans CJK SC`

3. **检查文件编码**
   - 右下角状态栏查看编码（应为 UTF-8）
   - 如果不是，点击重新打开为 UTF-8

### 💡 为什么容易误判

- Unicode 高亮功能的方框和字体缺失的方框看起来相似
- 容易先想到"字体问题"这个更常见的故障
- 蓝色提示条可能被忽略或误解

### 📝 记录时间

- **创建时间**：2026-02-17
- **事件**：中文上方方框问题，最终发现是 Unicode 高亮而非字体问题
- **教训**：看到方框先检查是否有 Unicode 高亮提示，不要直接改字体

---

## 参考链接

- [VS Code Unicode Highlight 官方文档](https://code.visualstudio.com/docs/editor/unicode-highlight)
