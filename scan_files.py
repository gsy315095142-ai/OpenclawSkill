import os
import json

root = r'C:\Users\31509\clawd'
files = []

for dirpath, dirnames, filenames in os.walk(root):
    dirnames[:] = [d for d in dirnames if d not in ['.git', 'node_modules', '.openclaw']]
    for filename in filenames:
        full_path = os.path.join(dirpath, filename)
        rel_path = os.path.relpath(full_path, root)
        files.append(rel_path)

# 写入结果到文件
with open(r'C:\Users\31509\clawd\file_list.json', 'w', encoding='utf-8') as f:
    json.dump(files, f, ensure_ascii=False, indent=2)

print(f"找到 {len(files)} 个文件")
print("结果已保存到 file_list.json")
