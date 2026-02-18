const fs = require('fs');
const path = require('path');

function findFiles(dir, pattern, results = []) {
  if (!fs.existsSync(dir)) return results;
  
  const items = fs.readdirSync(dir);
  for (const item of items) {
    if (item.startsWith('.') || item === 'node_modules') continue;
    
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      findFiles(fullPath, pattern, results);
    } else if (pattern.test(item)) {
      results.push(fullPath);
    }
  }
  return results;
}

const rootDir = 'C:/Users/31509/clawd';

// 1. 查找所有 .md 文件
const allMdFiles = findFiles(rootDir, /\.md$/i);
console.log('=== 所有 Markdown 文件 ===');
allMdFiles.forEach(f => console.log(f.replace(rootDir, '')));

// 2. 查找包含"规范"或"小说"的文件
const standardFiles = allMdFiles.filter(f => 
  /规范|小说|novel|chapter|章/i.test(f)
);
console.log('\n=== 相关文件（规范/小说/章节）===');
standardFiles.forEach(f => console.log(f.replace(rootDir, '')));

// 3. 特别检查 Project 目录下的文件
console.log('\n=== Project 目录下的文件 ===');
const projectDir = path.join(rootDir, 'Project');
if (fs.existsSync(projectDir)) {
  const projectFiles = findFiles(projectDir, /.*/);
  projectFiles.forEach(f => console.log(f.replace(rootDir, '')));
} else {
  console.log('Project 目录不存在');
}
