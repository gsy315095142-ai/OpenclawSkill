# VR 头显开发调研笔记

**项目**: 自研 VR 头显 Android Framework 定制  
**创建时间**: 2026-02-11  
**创建人**: Clawd (整理自与郭郭的讨论)

---

## 📋 目录

1. [项目背景](#项目背景)
2. [Android Framework 概述](#android-framework-概述)
3. [开源资源汇总](#开源资源汇总)
4. [头显硬件对接架构](#头显硬件对接架构)
5. [关键技术点](#关键技术点)
6. [推荐学习路径](#推荐学习路径)

---

## 项目背景

### 目标
自研 VR 头显设备，基于 Android 系统深度定制 Framework 层，实现头显硬件与软件的完美对接。

### 核心问题
- Android Framework 是否开源？ ✅ **完全开源（AOSP）**
- 头显硬件如何与 Framework 对接？
- 有哪些开源项目可以参考？

---

## Android Framework 概述

### 系统架构

```
┌─────────────────────────┐
│     系统应用层           │  ← 头显Launcher、设置、商店等
├─────────────────────────┤
│     Java API 框架层      │  ← Android Framework
│  (ActivityManager,      │
│   WindowManager,        │
│   InputManager...)      │
├─────────────────────────┤
│     Native 层           │  ← C/C++ 库 (OpenGL, WebKit)
├─────────────────────────┤
│     HAL 硬件抽象层       │  ← 头显驱动 (显示、传感器、摄像头)
├─────────────────────────┤
│     Linux 内核          │  ← 驱动程序
└─────────────────────────┘
```

### 核心 Framework 组件（头显相关）

| 组件 | 路径 | 头显定制需求 |
|------|------|-------------|
| **SurfaceFlinger** | `frameworks/native/services/surfaceflinger/` | 双屏渲染、异步时间扭曲(ATW)、低延迟 |
| **InputManager** | `frameworks/native/services/inputflinger/` | 6DOF手柄、手势追踪、眼动追踪 |
| **SensorService** | `frameworks/native/services/sensorservice/` | 高频IMU、SLAM、姿态融合 |
| **PowerManager** | `frameworks/base/services/core/java/...` | 高功耗优化、息屏策略 |
| **WindowManager** | `frameworks/base/services/core/java/...` | VR模式、悬浮窗、多应用 |

---

## 开源资源汇总

### 1. Android Framework 源码（AOSP）

**官方源码**
- Google AOSP: https://android.googlesource.com/
- GitHub 镜像: https://github.com/aosp-mirror/

**下载命令**
```bash
mkdir android_framework && cd android_framework
repo init -u https://android.googlesource.com/platform/manifest -b android-13.0.0_r1
repo sync
```

**关键目录**
```
frameworks/base/          # 核心 Framework（Java层）
frameworks/native/        # Native层（SurfaceFlinger等）
frameworks/av/            # 音视频媒体框架
hardware/libhardware/     # HAL硬件抽象层
system/core/              # 系统核心服务
```

### 2. 头显开发开源项目

#### Cardboard (Google) ⭐⭐⭐
- 地址: https://github.com/googlevr/cardboard
- 特点: 快速原型验证，支持Android/iOS
- 包含: 陀螺仪追踪、镜头畸变矫正、分屏渲染
- **适合**: 快速验证VR渲染流程

#### GVR (Google VR, 已停更) ⭐⭐
- 地址: https://github.com/googlevr/gvr-android-sdk
- 特点: 代码仍有参考价值
- 包含: 空间音频、头部追踪、输入系统
- **注意**: 已转向Cardboard，但实现思路值得学习

#### Monado (OpenXR Runtime) ⭐⭐⭐⭐
- 地址: https://github.com/Monado/
- 特点: 开源OpenXR运行时，支持Linux/Android
- 包含: Vulkan/OpenGL合成、追踪算法
- **适合**: 头显硬件与Framework的桥梁

#### WaveVR SDK (HTC) ⭐⭐
- 地址: 
  - https://github.com/ViveSoftware/Vive-Dual-Screen-Sample
  - https://github.com/ViveSoftware/Wave-OpenXR-Samples
- 特点: 商业头显对接参考
- **适合**: 学习商业头显如何实现

### 3. 开源项目对比

| 项目 | 开源程度 | 学习价值 | 上手难度 | 推荐度 |
|------|---------|---------|---------|--------|
| AOSP | 完全 | ⭐⭐⭐⭐⭐ | 高 | 必学 |
| Cardboard | 完全 | ⭐⭐⭐ | 低 | 入门 |
| Monado | 完全 | ⭐⭐⭐⭐ | 中 | 进阶 |
| WaveVR | 部分 | ⭐⭐ | 中 | 参考 |

---

## 头显硬件对接架构

### 硬件 → Framework 完整链路

```
┌─────────────────────────────────────────────────────┐
│                    Framework 层                      │
│  ┌──────────────┬──────────────┬─────────────────┐  │
│  │ SurfaceFlinger│ InputManager │  SensorService  │  │
│  │  （显示合成）  │  （输入管理）  │   （传感器）     │  │
│  └──────┬───────┴──────┬───────┴────────┬────────┘  │
└─────────┼──────────────┼────────────────┼───────────┘
          │              │                │
          ▼              ▼                ▼
┌─────────────────────────────────────────────────────┐
│                    HAL 层                            │
│  ┌──────────────┬──────────────┬─────────────────┐  │
│  │  gralloc     │  input       │  sensors        │  │
│  │  （显示内存）  │  （输入HAL）  │   （传感器HAL）  │  │
│  └──────┬───────┴──────┬───────┴────────┬────────┘  │
└─────────┼──────────────┼────────────────┼───────────┘
          │              │                │
          ▼              ▼                ▼
┌─────────────────────────────────────────────────────┐
│                   头显硬件                           │
│  ┌──────────┬──────────┬──────────┬──────────────┐ │
│  │  双屏幕   │  IMU     │  摄像头   │   手柄       │ │
│  │  (左右眼) │ (陀螺仪)  │ (SLAM)   │  (6DOF)      │ │
│  └──────────┴──────────┴──────────┴──────────────┘ │
└─────────────────────────────────────────────────────┘
```

### 各模块职责

| 硬件 | HAL层 | Framework层 | 定制重点 |
|------|-------|------------|---------|
| 双屏幕 | gralloc | SurfaceFlinger | 畸变矫正、ATW、低延迟 |
| IMU | sensors.h | SensorService | 高频采样、姿态融合 |
| 手柄 | input.h | InputManager | 6DOF映射、手势识别 |
| 摄像头 | camera.h | CameraService | SLAM追踪、Passthrough |

---

## 关键技术点

### 1. SurfaceFlinger 修改（显示系统）

**需要实现的功能**
- 双屏输出（左右眼分别渲染）
- 异步时间扭曲（Asynchronous Timewarp）
- 镜头畸变和色散矫正
- 低延迟渲染管道

**参考代码位置**
```cpp
// frameworks/native/services/surfaceflinger/
├── SurfaceFlinger.cpp      # 主合成器
├── DispSync.cpp            # VSYNC同步
├── BufferQueue.cpp         # 缓冲队列
└── CompositionEngine/      # 合成引擎
```

### 2. InputManager 修改（输入系统）

**需要实现的功能**
- 自定义 InputDevice 支持 6DOF 手柄
- 手势追踪输入（裸手交互）
- 眼动追踪输入（注视点渲染）

**参考代码位置**
```cpp
// frameworks/native/services/inputflinger/
├── InputManager.cpp        # 输入管理器
├── InputReader.cpp         # 输入读取
├── InputDispatcher.cpp     # 输入分发
└── reader/                 # 各类输入设备
```

### 3. SensorService 修改（传感器）

**需要实现的功能**
- 高频 IMU 采样（1000Hz+）
- 传感器融合算法（卡尔曼滤波）
- 预测性姿态计算

**参考代码位置**
```cpp
// frameworks/native/services/sensorservice/
├── SensorService.cpp       # 传感器服务
├── Fusion.cpp              # 传感器融合
└── SensorDevice.cpp        # 传感器设备接口
```

---

## 推荐学习路径

### 阶段一：基础了解（1-2周）
1. **下载 AOSP 源码**
   - 熟悉目录结构
   - 了解编译流程

2. **阅读 Cardboard 源码**
   - 理解 VR 渲染基本原理
   - 学习畸变矫正实现

3. **搭建开发环境**
   - Android Studio + NDK
   - 准备测试设备（手机+Cardboard盒子）

### 阶段二：Framework 深入（2-4周）
1. **研究 SurfaceFlinger**
   - 理解显示合成流程
   - 学习如何添加自定义合成器

2. **研究 InputManager**
   - 理解输入事件流程
   - 学习如何添加自定义输入设备

3. **参考 Monado**
   - 了解 OpenXR 标准
   - 学习 VR 运行时架构

### 阶段三：硬件对接（4-8周）
1. **开发 HAL 层驱动**
   - 实现头显硬件的 HAL 接口
   - 与 Framework 层对接测试

2. **Framework 定制**
   - 修改 SurfaceFlinger 支持双屏
   - 修改 InputManager 支持新手柄

3. **系统集成测试**
   - 延迟测试
   - 追踪精度测试
   - 用户体验测试

---

## 📚 参考资料

### 文档
- [AOSP 官方文档](https://source.android.com/)
- [OpenXR 规范](https://www.khronos.org/openxr/)
- [Android VR 开发指南](https://developers.google.com/cardboard/develop)

### 社区
- [Android Developers Forum](https://groups.google.com/g/android-developers)
- [Monado Discord](https://monado.freedesktop.org/)
- [GitHub VR 话题](https://github.com/topics/virtual-reality)

---

## ✅ 待办事项

- [ ] 下载 AOSP 源码
- [ ] 编译测试 Cardboard Demo
- [ ] 研究 SurfaceFlinger 双屏渲染
- [ ] 调研头显硬件方案（芯片平台）
- [ ] 评估 Monado 集成可行性

---

**最后更新**: 2026-02-11  
**文档状态**: 初版整理完成，持续更新中
