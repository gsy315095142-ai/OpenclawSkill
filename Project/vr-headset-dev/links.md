# 资源链接汇总

## 🔗 立即收藏

### AOSP 源码
- **官方**: https://android.googlesource.com/
- **GitHub**: https://github.com/aosp-mirror/
- **镜像**: https://mirrors.tuna.tsinghua.edu.cn/help/AOSP/ (清华镜像)

### VR 开源项目
- **Cardboard**: https://github.com/googlevr/cardboard
- **Monado**: https://github.com/Monado/
- **WaveVR**: https://github.com/ViveSoftware/

### 文档
- **AOSP 文档**: https://source.android.com/
- **OpenXR**: https://www.khronos.org/openxr/
- **Android VR**: https://developers.google.com/cardboard/develop

---

## 📥 快速开始命令

### 1. 下载 AOSP（最小化）
```bash
# 只下载 frameworks 目录（节省空间和时间）
mkdir aosp-framework && cd aosp-framework
repo init -u https://android.googlesource.com/platform/manifest -b android-13.0.0_r1
repo sync frameworks/base frameworks/native frameworks/av
```

### 2. 下载 Cardboard
```bash
git clone https://github.com/googlevr/cardboard.git
cd cardboard
```

### 3. 下载 Monado
```bash
git clone https://gitlab.freedesktop.org/monado/monado.git
cd monado
```

---

## 📂 项目文件位置

**本地项目路径**: `C:\Users\31509\clawd\Project\vr-headset-dev\`

**文件列表**:
- `README.md` - 主要调研笔记
- `links.md` - 本文件（资源链接）
- `notes/` - 后续可以添加详细笔记
- `code-samples/` - 代码示例
