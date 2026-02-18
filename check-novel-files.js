const fs = require('fs');
const path = require('path');

// 需要检查的两个目录
const dirs = [
  'C:/Users/31509/clawd/Project/novel-writing/novel-content',
  'C:/Users/31509/clawd/Project/novel-writing/plot-outline/chapters'
];

console.log('=== 扫描目录 ===\n');

dirs.forEach(dir => {
  console.log(`目录: ${dir}`);
  console.log('─'.repeat(60));
  
  if (!fs.existsSync(dir)) {
    console.log('❌ 目录不存在');
    // 创建目录
    fs.mkdirSync(dir, { recursive: true });
    console.log('✅ 已创建目录');
  } else {
    const files = fs.readdirSync(dir).filter(f => f !== '.keep' && !f.startsWith('.'));
    if (files.length === 0) {
      console.log('📂 目录为空');
    } else {
      files.forEach(f => {
        const stat = fs.statSync(path.join(dir, f));
        console.log(`📄 ${f} (${stat.size} bytes)`);
      });
    }
  }
  console.log('');
});
