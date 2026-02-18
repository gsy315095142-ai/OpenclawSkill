import os
import subprocess
import json

# 检查目录并获取文件列表
content_dir = r'C:\Users\31509\clawd\Project\novel-writing\novel-content'
chapters_dir = r'C:\Users\31509\clawd\Project\novel-writing\plot-outline\chapters'

result = {
    "content_files": [],
    "chapter_files": []
}

# 获取正文文件
if os.path.exists(content_dir):
    result["content_files"] = [f for f in os.listdir(content_dir) if os.path.isfile(os.path.join(content_dir, f))]

# 获取简介文件
if os.path.exists(chapters_dir):
    result["chapter_files"] = [f for f in os.listdir(chapters_dir) if os.path.isfile(os.path.join(chapters_dir, f))]

# 输出 JSON 格式结果
print("RESULT_START")
print(json.dumps(result, ensure_ascii=False))
print("RESULT_END")

# 同时写入文件
output_path = r'C:\Users\31509\clawd\temp\scan_result.txt'
os.makedirs(os.path.dirname(output_path), exist_ok=True)
with open(output_path, 'w', encoding='utf-8') as f:
    f.write(json.dumps(result, ensure_ascii=False, indent=2))
