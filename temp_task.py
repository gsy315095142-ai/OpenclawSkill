#!/usr/bin/env python3
"""删除指定文件并验证其他文件是否存在"""

import os
import sys

# 要删除的文件
file_to_delete = r"C:\Users\31509\clawd\Project\novel-writing\小说规范.md"

# 要验证的文件列表
files_to_check = [
    r"C:\Users\31509\clawd\Project\novel-writing\novel-content\第0012章-紫皮的裁决.md",
    r"C:\Users\31509\clawd\Project\novel-writing\novel-content\第0020章-培育区的真相.md",
    r"C:\Users\31509\clawd\Project\novel-writing\plot-outline\chapters\第0012章简介-紫皮的裁决.md"
]

print("=" * 60)
print("任务执行开始")
print("=" * 60)

# 1. 删除文件
print("\n【任务1】删除文件：")
print(f"目标: {file_to_delete}")

if os.path.exists(file_to_delete):
    try:
        os.remove(file_to_delete)
        print(f"✅ 成功删除: {file_to_delete}")
    except Exception as e:
        print(f"❌ 删除失败: {e}")
        sys.exit(1)
else:
    print(f"⚠️ 文件不存在（可能已被删除）: {file_to_delete}")

# 2. 验证文件是否存在
print("\n【任务2】验证文件是否存在：")
print("-" * 60)

all_exist = True
for file_path in files_to_check:
    exists = os.path.exists(file_path)
    status = "✅ 存在" if exists else "❌ 不存在"
    print(f"{status}: {file_path}")
    if not exists:
        all_exist = False

print("-" * 60)

# 总结
print("\n" + "=" * 60)
print("执行结果总结")
print("=" * 60)
print(f"删除操作: 完成")
print(f"验证结果: {'所有文件都存在' if all_exist else '存在缺失文件'}")
print("=" * 60)
