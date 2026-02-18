# 查找小说文件

import os

def list_all_files(root_dir):
    """递归列出所有文件"""
    files_list = []
    for dirpath, dirnames, filenames in os.walk(root_dir):
        # 跳过 .git 和 node_modules
        dirnames[:] = [d for d in dirnames if d not in ['.git', 'node_modules', '.openclaw']]
        for filename in filenames:
            full_path = os.path.join(dirpath, filename)
            rel_path = os.path.relpath(full_path, root_dir)
            files_list.append(rel_path)
    return files_list

root = r'C:\Users\31509\clawd'
all_files = list_all_files(root)

# 过滤出可能的章节文件
chapter_patterns = ['章', 'chapter', 'novel', '小说', '简介']
chapter_files = []

for f in all_files:
    lower_f = f.lower()
    if any(p in lower_f for p in chapter_patterns):
        chapter_files.append(f)

print("=== 所有文件 ===")
for f in sorted(all_files):
    print(f)

print("\n=== 小说/章节相关文件 ===")
for f in sorted(chapter_files):
    print(f)
