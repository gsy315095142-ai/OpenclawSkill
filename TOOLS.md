# TOOLS.md - Local Notes

Skills define *how* tools work. This file is for *your* specifics — the stuff that's unique to your setup.

## What Goes Here

Things like:
- Camera names and locations
- SSH hosts and aliases  
- Preferred voices for TTS
- Speaker/room names
- Device nicknames
- Anything environment-specific

## Examples

```markdown
### Cameras
- living-room → Main area, 180° wide angle
- front-door → Entrance, motion-triggered

### SSH
- home-server → 192.168.1.100, user: admin

### TTS
- Preferred voice: "Nova" (warm, slightly British)
- Default speaker: Kitchen HomePod
```

## Why Separate?

Skills are shared. Your setup is yours. Keeping them apart means you can update skills without losing your notes, and share skills without leaking your infrastructure.

---

### 远程 OpenClaw 节点

| 名称 | IP | 端口 | Token |
|------|-----|------|-------|
| AI电脑 | 192.168.1.52 | 18789 | f74bba24876b82e3a1793ad4e19214c4bae91b2a030303cf |

**使用方式：** 详见 `skills/multi-gateway/SKILL.md`

### 跨实例共享存储

| 项目 | 值 |
|------|-----|
| 路径 | `\\192.168.1.39\Share\光速产研中心` |
| 账号 | `LumiEra` |
| 密码 | `Lumi123` |

**用途：** 多个 OpenClaw 实例之间的消息传递和文件共享

**访问命令：**
```powershell
net use "\\192.168.1.39\Share\光速产研中心" /user:LumiEra Lumi123
```

---

Add whatever helps you do your job. This is your cheat sheet.
