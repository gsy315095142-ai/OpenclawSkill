# Git Sensitive Data Management (Git 敏感信息管理)

此 Skill 定义了如何安全地管理 Git 仓库中的敏感信息（API Keys、Token、密码等），防止意外提交到版本控制。

---

## 1. 敏感信息识别

### 1.1 常见敏感信息类型

| 类型 | 示例 | 风险等级 |
|------|------|---------|
| API Keys | `sk-or-v1-xxx`, `hf_xxx`, `sk-xxx` | 🔴 极高 |
| Access Tokens | `t-g1042ekK...`, `ghp_xxx` | 🔴 极高 |
| 密码/密钥 | `Lumi123`, `password123` | 🔴 极高 |
| 私钥文件 | `.pem`, `.key` | 🔴 极高 |
| 配置文件 | `auth-profiles.json` | 🟡 高 |
| 环境变量文件 | `.env` | 🟡 高 |

### 1.2 检测命令

**搜索文件中的敏感关键词：**
```powershell
# PowerShell
Select-String -Path '*.md','memory\*.json' -Pattern '(token|api_key|apikey|secret|password|key|sk-)' -CaseSensitive:$false

# CMD / Git Bash
grep -r -i "token\|api_key\|secret\|password" --include="*.md" --include="*.json" .
```

**检查哪些文件将被 Git 追踪：**
```bash
git status
```

---

## 2. 解决方案

### 2.1 推荐方案：集中管理 + .gitignore

**步骤 1：创建集中存储文件**

创建 `memory/secrets.json`（或 `.openclaw/auth-profiles.json`）：
```json
{
  "api_keys": {
    "openrouter": "sk-or-v1-xxx",
    "huggingface": "hf_xxx"
  },
  "tokens": {
    "feishu": "t-g1042ekK..."
  },
  "nodes": [
    {
      "name": "AI电脑",
      "ip": "192.168.1.52",
      "port": 18789,
      "token": "f74bba248..."
    }
  ]
}
```

**步骤 2：更新 .gitignore**

```gitignore
# 敏感信息
memory/secrets.json
memory/feishu_token.json
memory/feishu_pending_updates.json
.openclaw/auth-profiles.json
.openclaw/openclaw.json.bak*
memory/*.key

# 包含 API Keys 的测试脚本
Project/*/test_*.py
Project/*/*.py  # 如果包含硬编码密钥
```

**步骤 3：修改引用文件**

将硬编码的敏感值替换为引用说明：
```markdown
<!-- 修改前 -->
Token: f74bba24876b82e3a1793ad4e19214c4bae91b2a030303cf

<!-- 修改后 -->
Token: [已移至 secrets.json]
```

### 2.2 替代方案

| 方案 | 适用场景 | 优缺点 |
|------|---------|--------|
| 环境变量 | 运行时读取 | ✅ 安全 ❌ 需要额外配置 |
| Git Secrets | 预提交检查 | ✅ 自动拦截 ❌ 需要安装工具 |
| Git Filter | 历史清理 | ✅ 可清除已提交敏感信息 ❌ 复杂 |
| 独立配置文件 | 项目级别隔离 | ✅ 灵活 ❌ 文件分散 |

---

## 3. 历史敏感信息清理（已提交到 Git）

如果敏感信息已经提交到 Git 历史，需要彻底清理：

### 3.1 使用 BFG Repo-Cleaner（推荐）

```bash
# 下载 BFG
curl -o bfg.jar https://repo1.maven.org/maven2/com/madgag/bfg/1.14.0/bfg-1.14.0.jar

# 创建替换规则文件 secrets.txt
# 格式: 敏感值 ==> 替换值
sk-or-v1-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx ==> ***REMOVED***
hf_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx ==> ***REMOVED***

# 运行清理
java -jar bfg.jar --replace-text secrets.txt my-repo.git
```

### 3.2 使用 git-filter-branch

```bash
# 删除包含敏感信息的文件
git filter-branch --force --index-filter \
  'git rm --cached --ignore-unmatch memory/feishu_token.json' \
  --prune-empty --tag-name-filter cat -- --all

# 强制推送（⚠️ 危险：会重写历史）
git push origin --force --all
```

---

## 4. 预防措施

### 4.1 预提交检查清单

提交前运行：
```bash
# 1. 检查暂存区文件
git diff --cached --name-only

# 2. 搜索敏感关键词
git diff --cached | grep -i "token\|api_key\|secret"

# 3. 确认 .gitignore 已更新
git check-ignore -v memory/secrets.json
```

### 4.2 文件命名约定

| 文件名模式 | 用途 | 是否加入 .gitignore |
|-----------|------|-------------------|
| `secrets.json` | 敏感配置 | ✅ 必须 |
| `*.local.json` | 本地覆盖配置 | ✅ 建议 |
| `*.example.json` | 配置模板（脱敏） | ❌ 可以提交 |
| `.env` | 环境变量 | ✅ 必须 |
| `.env.example` | 环境变量模板 | ❌ 可以提交 |

---

## 5. 验证步骤

### 5.1 确认敏感文件已被忽略

```bash
# 检查文件是否被忽略
git check-ignore -v memory/secrets.json
# 输出：.gitignore:7:memory/secrets.json memory/secrets.json

# 检查文件是否仍被追踪
git ls-files | grep secrets
# 应该无输出
```

### 5.2 确认清理完成

```bash
# 搜索历史中的敏感值
git log --all --full-history -S 'sk-or-v1-xxx'

# 如果仍有输出，说明历史未清理干净
```

---

## 6. 应急处理流程

### 场景：不小心提交了敏感信息

1. **立即撤销提交（未 push）**
   ```bash
   git reset HEAD~1
   git checkout -- .
   ```

2. **已 push 到远程**
   - 立即撤销提交并强制推送（仅个人分支）
   - 通知协作者重新克隆仓库
   - 轮换/撤销已泄露的密钥

3. **密钥轮换**
   - 登录对应平台（OpenRouter、Hugging Face 等）
   - 撤销旧 API Key
   - 生成新 Key 并更新到 `secrets.json`

---

## 7. 参考案例

### 案例 1：OpenClaw 工作台敏感信息清理

**问题**：`git commit` 时检测到敏感信息，无法提交

**涉及的敏感信息**：
- `memory/feishu_token.json` - 飞书 Token
- `TOOLS.md` - 硬编码的远程节点 Token 和共享存储密码
- `memory/shared/*.md` - 日志中的 API Keys
- `Project/comfyui-setup/*.py` - 测试脚本中的硬编码密钥

**解决方案**：
1. 创建 `memory/secrets.json` 集中存储凭证
2. 更新 `.gitignore` 忽略敏感文件
3. 修改 `TOOLS.md` 和日志文件，移除硬编码值
4. 忽略整个 `Project/comfyui-setup/*.py` 目录（测试脚本）

**验证**：
```bash
git check-ignore -v memory/secrets.json  # 确认已忽略
Select-String -Path 'TOOLS.md' -Pattern 'f74bba248'  # 确认已清除
```

---

## 8. 相关工具

- [git-secrets](https://github.com/awslabs/git-secrets) - AWS 预提交检查工具
- [truffleHog](https://github.com/trufflesecurity/truffleHog) - 扫描 Git 历史中的敏感信息
- [BFG Repo-Cleaner](https://rtyley.github.io/bfg-repo-cleaner/) - 快速清理 Git 历史
- [GitGuardian](https://www.gitguardian.com/) - 实时监控 Git 泄露

---

## 总结

**核心原则**：
1. **永不硬编码** - 敏感信息存入独立文件
2. **必须忽略** - 敏感文件加入 `.gitignore`
3. **定期扫描** - 使用工具检测潜在泄露
4. **及时轮换** - 发现泄露立即撤销密钥

**一句口诀**：
> "敏感信息放 secrets，gitignore 要记牢，提交之前先检查，泄露之后速轮换。"
