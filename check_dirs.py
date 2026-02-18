import os
import glob

# 检查目录内容
content_dir = r'C:\Users\31509\clawd\Project\novel-writing\novel-content'
chapters_dir = r'C:\Users\31509\clawd\Project\novel-writing\plot-outline\chapters'

print("=== novel-content 目录 ===")
if os.path.exists(content_dir):
    files = os.listdir(content_dir)
    for f in files:
        print(f)
else:
    print("目录不存在")

print("\n=== chapters 目录 ===")
if os.path.exists(chapters_dir):
    files = os.listdir(chapters_dir)
    for f in files:
        print(f)
else:
    print("目录不存在")
