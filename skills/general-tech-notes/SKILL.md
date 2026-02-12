# 通用技术经验 (General Technical Notes)

本项目用于沉淀非特定领域的通用技术经验、环境配置问题及跨平台兼容性技巧。

---

## 1. PowerShell 命令行技巧

### 1.1 多文件操作语法
**问题**：
使用 `del file1 file2` 在 PowerShell 中会报错：
```
Remove-Item : 找不到接受实际参数的位置形参...
```
**原因**：
PowerShell 的 Cmdlet（如 `Remove-Item`，别名 `del`）参数解析机制与传统 CMD 或 Bash 不同，不直接支持空格分隔的多个位置参数。

**解决方案**：
1. **逐条执行**：
   ```powershell
   del file1
   del file2
   ```
2. **逗号分隔**：
   ```powershell
   del file1,file2
   ```
3. **通配符**：
   ```powershell
   del *.json
   ```

---

*持续更新中...*
