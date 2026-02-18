import os
import json

# 检查两个目录
content_dir = r'C:\Users\31509\clawd\Project\novel-writing\novel-content'
chapters_dir = r'C:\Users\31509\clawd\Project\novel-writing\plot-outline\chapters'

result = {
    "novel_content": [],
    "chapters": []
}

# 读取正文目录
if os.path.exists(content_dir):
    result["novel_content"] = [f for f in os.listdir(content_dir) if f.endswith('.md')]

# 读取简介目录
if os.path.exists(chapters_dir):
    result["chapters"] = [f for f in os.listdir(chapters_dir) if f.endswith('.md')]

# 保存结果到临时文件
output_path = r'C:\Users\31509\clawd\temp\file_scan_result.json'
os.makedirs(os.path.dirname(output_path), exist_ok=True)

with open(output_path, 'w', encoding='utf-8') as f:
    json.dump(result, f, ensure_ascii=False, indent=2)

print(f"扫描完成，找到 {len(result['novel_content'])} 个正文文件，{len(result['chapters'])} 个简介文件")
