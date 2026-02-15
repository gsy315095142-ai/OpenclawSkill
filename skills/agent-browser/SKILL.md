---
name: Agent Browser
description: A fast Rust-based headless browser automation CLI with Node.js fallback that enables AI agents to navigate, click, type, and snapshot pages via structured commands.
read_when:
  - Automating web interactions
  - Extracting structured data from pages
  - Filling forms programmatically
  - Testing web UIs
metadata: {"clawdbot":{"emoji":"🌐","requires":{"bins":["node","npm"]}}}
allowed-tools: Bash(agent-browser:*)
---

# Browser Automation with agent-browser

## Installation

### npm recommended

```bash
npm install -g agent-browser
agent-browser install
agent-browser install --with-deps
```

### From Source

```bash
git clone https://github.com/vercel-labs/agent-browser
cd agent-browser
pnpm install
pnpm build
agent-browser install
```

## Quick start

```bash
agent-browser open <url>        # Navigate to page
agent-browser snapshot -i       # Get interactive elements with refs
agent-browser click @e1         # Click element by ref
agent-browser fill @e2 "text"   # Fill input by ref
agent-browser close             # Close browser
```

## Core workflow

1. Navigate: `agent-browser open <url>`
2. Snapshot: `agent-browser snapshot -i` (returns elements with refs like `@e1`, `@e2`)
3. Interact using refs from the snapshot
4. Re-snapshot after navigation or significant DOM changes

## Commands

### Navigation

```bash
agent-browser open <url>      # Navigate to URL
agent-browser back            # Go back
agent-browser forward         # Go forward
agent-browser reload          # Reload page
agent-browser close           # Close browser
```

### Snapshot (page analysis)

```bash
agent-browser snapshot            # Full accessibility tree
agent-browser snapshot -i         # Interactive elements only (recommended)
agent-browser snapshot -c         # Compact output
agent-browser snapshot -d 3       # Limit depth to 3
agent-browser snapshot -s "#main" # Scope to CSS selector
```

### Interactions (use @refs from snapshot)

```bash
agent-browser click @e1           # Click
agent-browser dblclick @e1        # Double-click
agent-browser focus @e1           # Focus element
agent-browser fill @e2 "text"     # Clear and type
agent-browser type @e2 "text"     # Type without clearing
agent-browser press Enter         # Press key
agent-browser press Control+a     # Key combination
agent-browser keydown Shift       # Hold key down
agent-browser keyup Shift         # Release key
agent-browser hover @e1           # Hover
agent-browser check @e1           # Check checkbox
agent-browser uncheck @e1         # Uncheck checkbox
agent-browser select @e1 "value"  # Select dropdown
agent-browser scroll down 500     # Scroll page
agent-browser scrollintoview @e1  # Scroll element into view
agent-browser drag @e1 @e2        # Drag and drop
agent-browser upload @e1 file.pdf # Upload files
```

### Get information

```bash
agent-browser get text @e1        # Get element text
agent-browser get html @e1        # Get innerHTML
agent-browser get value @e1       # Get input value
agent-browser get attr @e1 href   # Get attribute
agent-browser get title           # Get page title
agent-browser get url             # Get current URL
agent-browser get count ".item"   # Count matching elements
agent-browser get box @e1         # Get bounding box
```

### Check state

```bash
agent-browser is visible @e1      # Check if visible
agent-browser is enabled @e1      # Check if enabled
agent-browser is checked @e1      # Check if checked
```

### Screenshots & PDF

```bash
agent-browser screenshot          # Screenshot to stdout
agent-browser screenshot path.png # Save to file
agent-browser screenshot --full   # Full page
agent-browser pdf output.pdf      # Save as PDF
```

### Video recording

```bash
agent-browser record start ./demo.webm    # Start recording (uses current URL + state)
agent-browser click @e1                   # Perform actions
agent-browser record stop                 # Stop and save video
agent-browser record restart ./take2.webm # Stop current + start new recording
```

Recording creates a fresh context but preserves cookies/storage from your session. If no URL is provided, it automatically returns to your current page. For smooth demos, explore first, then start recording.

### Wait

```bash
agent-browser wait @e1                     # Wait for element
agent-browser wait 2000                    # Wait milliseconds
agent-browser wait --text "Success"        # Wait for text
agent-browser wait --url "/dashboard"    # Wait for URL pattern
agent-browser wait --load networkidle      # Wait for network idle
agent-browser wait --fn "window.ready"     # Wait for JS condition
```

### Mouse control

```bash
agent-browser mouse move 100 200      # Move mouse
agent-browser mouse down left         # Press button
agent-browser mouse up left           # Release button
agent-browser mouse wheel 100         # Scroll wheel
```

### Semantic locators (alternative to refs)

```bash
agent-browser find role button click --name "Submit"
agent-browser find text "Sign In" click
agent-browser find label "Email" fill "user@test.com"
agent-browser find first ".item" click
agent-browser find nth 2 "a" text
```

### Browser settings

```bash
agent-browser set viewport 1920 1080      # Set viewport size
agent-browser set device "iPhone 14"      # Emulate device
agent-browser set geo 37.7749 -122.4194   # Set geolocation
agent-browser set offline on              # Toggle offline mode
agent-browser set headers '{"X-Key":"v"}' # Extra HTTP headers
agent-browser set credentials user pass   # HTTP basic auth
agent-browser set media dark              # Emulate color scheme
```

### Cookies & Storage

```bash
agent-browser cookies                     # Get all cookies
agent-browser cookies set name value      # Set cookie
agent-browser cookies clear               # Clear cookies
agent-browser storage local               # Get all localStorage
agent-browser storage local key           # Get specific key
agent-browser storage local set k v       # Set value
agent-browser storage local clear         # Clear all
```

### Network

```bash
agent-browser network route <url>              # Intercept requests
agent-browser network route <url> --abort      # Block requests
agent-browser network route <url> --body '{}'  # Mock response
agent-browser network unroute [url]            # Remove routes
agent-browser network requests                 # View tracked requests
agent-browser network requests --filter api    # Filter requests
```

### Tabs & Windows

```bash
agent-browser tab                 # List tabs
agent-browser tab new [url]       # New tab
agent-browser tab 2               # Switch to tab
agent-browser tab close           # Close tab
agent-browser window new          # New window
```

### Frames

```bash
agent-browser frame "#iframe"     # Switch to iframe
agent-browser frame main          # Back to main frame
```

### Dialogs

```bash
agent-browser dialog accept [text]  # Accept dialog
agent-browser dialog dismiss        # Dismiss dialog
```

### JavaScript

```bash
agent-browser eval "document.title"   # Run JavaScript
```

### State management

```bash
agent-browser state save auth.json    # Save session state
agent-browser state load auth.json    # Load saved state
```

## Example: Form submission

```bash
agent-browser open https://example.com/form
agent-browser snapshot -i
# Output shows: textbox "Email" [ref=e1], textbox "Password" [ref=e2], button "Submit" [ref=e3]

agent-browser fill @e1 "user@example.com"
agent-browser fill @e2 "password123"
agent-browser click @e3
agent-browser wait --load networkidle
agent-browser snapshot -i  # Check result
```

## Example: Authentication with saved state

```bash
# Login once
agent-browser open https://app.example.com/login
agent-browser snapshot -i
agent-browser fill @e1 "username"
agent-browser fill @e2 "password"
agent-browser click @e3
agent-browser wait --url "/dashboard"
agent-browser state save auth.json

# Later sessions: load saved state
agent-browser state load auth.json
agent-browser open https://app.example.com/dashboard
```

## Sessions (parallel browsers)

```bash
agent-browser --session test1 open site-a.com
agent-browser --session test2 open site-b.com
agent-browser session list
```

## JSON output (for parsing)

Add `--json` for machine-readable output:

```bash
agent-browser snapshot -i --json
agent-browser get text @e1 --json
```

## Debugging

```bash
agent-browser open example.com --headed              # Show browser window
agent-browser console                                # View console messages
agent-browser console --clear                        # Clear console
agent-browser errors                                 # View page errors
agent-browser errors --clear                         # Clear errors
agent-browser highlight @e1                          # Highlight element
agent-browser trace start                            # Start recording trace
agent-browser trace stop trace.zip                   # Stop and save trace
agent-browser record start ./debug.webm              # Record from current page
agent-browser record stop                            # Save recording
agent-browser --cdp 9222 snapshot                    # Connect via CDP
```

## Troubleshooting

- If the command is not found on Linux ARM64, use the full path in the bin folder.
- If an element is not found, use snapshot to find the correct ref.
- If the page is not loaded, add a wait command after navigation.
- Use --headed to see the browser window for debugging.

## Options

- --session <name> uses an isolated session.
- --json provides JSON output.
- --full takes a full page screenshot.
- --headed shows the browser window.
- --timeout sets the command timeout in milliseconds.
- --cdp <port> connects via Chrome DevTools Protocol.

## Notes

- Refs are stable per page load but change on navigation.
- Always snapshot after navigation to get new refs.
- Use fill instead of type for input fields to ensure existing text is cleared.

## 🚀 启动 Chrome 浏览器 (Windows) ⭐ **重要**

**Agent 可以自己启动 Chrome，无需用户操作！**

### 方案 1：PowerShell/CMD 直接启动（基础方案）

```powershell
Start-Process "chrome.exe" -ArgumentList "https://example.com","--remote-debugging-port=9222"
```

```cmd
start chrome https://example.com --remote-debugging-port=9222
```

### 方案 2：Playwright + 系统 Chrome（推荐方案）⭐ **2026-02-15 验证成功**

**适用场景**：
- 无法下载 Playwright Chromium（网络问题）
- 需要使用系统已安装的 Chrome
- 需要完整的浏览器自动化控制

**配置步骤**：

1. **安装 Playwright Python**
```bash
pip install playwright
```

2. **设置环境变量**（指向系统 Chrome）
```python
import os
os.environ['PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH'] = r'C:\Users\{username}\AppData\Local\Google\Chrome\Application\chrome.exe'
```

3. **使用示例代码**
```python
import os
from playwright.sync_api import sync_playwright

# 设置系统 Chrome 路径
os.environ['PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH'] = r'C:\Users\31509\AppData\Local\Google\Chrome\Application\chrome.exe'

with sync_playwright() as p:
    # 使用系统 Chrome（非 headless 模式可看到浏览器窗口）
    browser = p.chromium.launch(
        executable_path=os.environ['PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH'],
        headless=False
    )
    
    page = browser.new_page()
    page.goto("https://example.com")
    
    print(f"Title: {page.title()}")
    
    # 自动化操作示例
    # page.click("selector")
    # page.fill("input", "text")
    # page.screenshot(path="screenshot.png")
    
    browser.close()
```

**查找系统 Chrome 路径**：
```python
import os

chrome_paths = [
    r'C:\Program Files\Google\Chrome\Application\chrome.exe',
    r'C:\Program Files (x86)\Google\Chrome\Application\chrome.exe',
    os.path.expandvars(r'%LOCALAPPDATA%\Google\Chrome\Application\chrome.exe'),
]

for path in chrome_paths:
    if os.path.exists(path):
        print(f'Found Chrome: {path}')
        break
```

**成功验证记录**（2026-02-15）：
- ✅ Playwright Python 安装成功
- ✅ 系统 Chrome 路径配置成功
- ✅ 浏览器启动成功
- ✅ 页面访问成功（openrouter.ai）
- ✅ 标题获取成功

**优势**：
- 无需下载 Chromium（绕过网络限制）
- 直接使用稳定版 Chrome
- 完整的 Playwright API 支持
- 支持 headless 和 headed 模式

---

## ⚠️ 常见问题与解决方案

### 问题 1：无法下载 Chromium（ECONNRESET）

**现象**：
```
Error: read ECONNRESET
Failed to download Chrome for Testing
```

**原因**：
- 网络连接不稳定
- Playwright CDN 访问受限
- 防火墙阻止长时间下载

**解决方案**：
使用**方案 2**（Playwright + 系统 Chrome）

### 问题 2：Chrome 远程调试端口无法连接

**现象**：
```
ConnectionRefusedError: [WinError 10061] 目标计算机积极拒绝
```

**原因**：
- Chrome 未启动远程调试
- 端口被占用
- 防火墙阻止

**解决方案**：
使用 Playwright 直接控制，无需手动配置远程调试端口

### 问题 3：Selenium ChromeDriver 连接失败

**现象**：
```
Unable to obtain driver for chrome
```

**解决方案**：
改用 Playwright（无需单独下载 ChromeDriver）

---

**规则**：
> 当需要打开浏览器时，**Agent 应直接使用 PowerShell/CMD 启动 Chrome**，而不是请求用户手动操作。
> 
> ❌ 错误："请打开 Chrome 浏览器"
> 
> ✅ 正确：直接执行 `Start-Process chrome.exe` 或使用 Playwright 自动启动

## Reporting Issues

- Skill issues: Open an issue at https://github.com/TheSethRose/Agent-Browser-CLI
- agent-browser CLI issues: Open an issue at https://github.com/vercel-labs/agent-browser
- Playwright issues: https://github.com/microsoft/playwright
