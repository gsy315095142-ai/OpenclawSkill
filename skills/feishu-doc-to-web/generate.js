const fs = require('fs');
const path = require('path');

// 1. 读取数据
const jsonPath = path.join(__dirname, '../feishu-batch-writer/su_content.json');
const rawData = fs.readFileSync(jsonPath, 'utf8');
const blocks = JSON.parse(rawData);

// 2. HTML 模板 (升级版 - Tech/Dark Theme + Auto Image Injection)
const htmlTemplate = (content) => `
<!DOCTYPE html>
<html lang="zh-CN" class="scroll-smooth">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>苏总裁 | AR+AI 科技领航者</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet">
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    fontFamily: {
                        sans: ['Inter', 'sans-serif'],
                        display: ['Space Grotesk', 'sans-serif'],
                    },
                    colors: {
                        primary: '#3b82f6',
                        secondary: '#8b5cf6',
                        dark: '#0f172a',
                        surface: '#1e293b',
                    },
                    animation: {
                        'float': 'float 6s ease-in-out infinite',
                        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                    },
                    keyframes: {
                        float: {
                            '0%, 100%': { transform: 'translateY(0)' },
                            '50%': { transform: 'translateY(-20px)' },
                        }
                    }
                }
            }
        }
    </script>
    <style>
        body { background-color: #0f172a; color: #e2e8f0; }
        .glass-panel {
            background: rgba(30, 41, 59, 0.6);
            backdrop-filter: blur(16px);
            border: 1px solid rgba(255, 255, 255, 0.08);
            box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
        }
        .gradient-text {
            background: linear-gradient(to right, #60a5fa, #c084fc);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }
        .hero-glow {
            position: absolute;
            width: 800px;
            height: 800px;
            background: radial-gradient(circle, rgba(59,130,246,0.1) 0%, rgba(15,23,42,0) 70%);
            top: -300px;
            left: 50%;
            transform: translateX(-50%);
            z-index: -1;
            pointer-events: none;
        }
        .project-img {
            transition: transform 0.5s ease;
        }
        .project-item:hover .project-img {
            transform: scale(1.05);
        }
    </style>
</head>
<body class="antialiased selection:bg-blue-500 selection:text-white overflow-x-hidden">

    <!-- 背景光效 -->
    <div class="hero-glow animate-pulse-slow"></div>
    <div class="fixed inset-0 z-[-2] bg-[#0f172a]"></div>
    <img src="https://images.unsplash.com/photo-1617802690992-8618015437df?q=80&w=2000&auto=format&fit=crop" class="fixed inset-0 z-[-1] opacity-20 object-cover w-full h-full mix-blend-overlay" alt="bg">

    <!-- 导航/头部 -->
    <header class="relative pt-32 pb-20 px-6 mb-12">
        <div class="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-12">
            <div class="flex-1 text-center md:text-left z-10">
                <div class="inline-block mb-6 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium tracking-wide animate-float">
                    VISIONARY LEADER
                </div>
                <h1 class="font-display text-6xl md:text-7xl font-bold mb-6 tracking-tight gradient-text leading-tight">苏总裁<br><span class="text-white text-5xl md:text-6xl">事迹整理</span></h1>
                <p class="text-slate-400 text-xl font-light max-w-xl leading-relaxed mb-8">
                    以 <span class="text-white font-medium">XR空间叙事科技</span> 重构场景体验<br>
                    深耕泛文旅领域十余年的 AR+AI 先行者
                </p>
                <div class="flex gap-4 justify-center md:justify-start">
                    <span class="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium transition-colors cursor-pointer shadow-lg shadow-blue-500/20">查看成就</span>
                    <span class="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg font-medium transition-colors cursor-pointer">联系合作</span>
                </div>
            </div>
            
            <!-- Hero Image / Avatar Placeholder -->
            <div class="flex-1 relative w-full max-w-md md:max-w-full">
                <div class="relative rounded-2xl overflow-hidden glass-panel p-2 shadow-2xl animate-float" style="animation-delay: 1s;">
                    <img src="https://images.unsplash.com/photo-1573164713988-8665fc963095?q=80&w=800&auto=format&fit=crop" alt="苏总裁形象" class="rounded-xl w-full object-cover h-[400px]">
                    <div class="absolute bottom-6 left-6 right-6 glass-panel p-4 rounded-lg border-l-4 border-blue-500">
                        <div class="text-white font-bold text-lg">苏砚</div>
                        <div class="text-blue-400 text-sm">小签科技创始人兼CEO</div>
                    </div>
                </div>
                <div class="absolute -top-10 -right-10 w-40 h-40 bg-purple-500/20 rounded-full blur-3xl z-[-1]"></div>
                <div class="absolute -bottom-10 -left-10 w-40 h-40 bg-blue-500/20 rounded-full blur-3xl z-[-1]"></div>
            </div>
        </div>
    </header>

    <!-- 主要内容容器 -->
    <main class="max-w-6xl mx-auto px-6 space-y-32 pb-32">
        ${content}
    </main>

    <!-- 页脚 -->
    <footer class="border-t border-slate-800 py-12 text-center text-slate-500 text-sm">
        <p class="mb-2">Generated by OpenClaw · Powered by Gemini 3 Pro</p>
        <p>文档数据同步时间：2026年2月7日</p>
    </footer>

</body>
</html>
`;

// 3. 解析器 (升级版)
function parseBlocks(blocks) {
    let html = '';
    
    // 简单的状态机
    let isTimeline = false;
    let isCards = false;

    for (let i = 0; i < blocks.length; i++) {
        const b = blocks[i];
        
        if (b.heading1) continue; // Skip H1

        // --- H2: Section Titles ---
        if (b.heading2) {
            if (isTimeline) { html += '</div></div>'; isTimeline = false; }
            if (isCards) { html += '</div>'; isCards = false; }

            const title = getText(b.heading2);
            
            // Emoji 装饰
            let icon = '🔹';
            if (title.includes('基本信息')) icon = '👤';
            if (title.includes('公司简介')) icon = '🏢';
            if (title.includes('发展历程')) icon = '🚀';
            if (title.includes('核心产品')) icon = '💎';
            if (title.includes('标杆项目')) icon = '🏆';
            if (title.includes('荣誉')) icon = '🎖️';
            if (title.includes('愿景')) icon = '🌟';

            html += `
            <div class="mb-12">
                <div class="flex items-center gap-4 mb-8">
                    <span class="text-2xl">${icon}</span>
                    <h2 class="font-display text-3xl font-bold text-white tracking-wide">${title.replace(/^[一二三四五六七]、/, '')}</h2>
                    <div class="h-px bg-slate-800 flex-grow ml-4"></div>
                </div>
            `;
            
            if (title.includes("发展历程")) {
                isTimeline = true;
                html += '<div class="relative pl-8 border-l border-slate-700 ml-3 space-y-12 py-4">';
            } else if (title.includes("核心产品")) {
                isCards = true;
                html += '<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">';
            } else {
                html += '<div class="space-y-6 text-lg text-slate-300 leading-relaxed">';
            }
            continue;
        }

        // --- H3: Card Titles (核心产品) ---
        if (b.heading3) {
            const title = getText(b.heading3);
            if (isCards) {
                // Collect card content until next H3 or H2
                let cardContent = [];
                let j = i + 1;
                while (j < blocks.length) {
                    const nextB = blocks[j];
                    if (nextB.heading2 || nextB.heading3) break; 
                    cardContent.push(nextB);
                    j++;
                }
                
                // 渲染卡片
                let desc = "";
                let features = "";
                
                // 图片注入逻辑 (Unsplash)
                let cardImgUrl = "";
                if (title.includes("神奇系统")) cardImgUrl = "https://images.unsplash.com/photo-1593508512255-86ab42a8e620?q=80&w=800&auto=format&fit=crop"; // VR/AR
                else if (title.includes("绿洲系统")) cardImgUrl = "https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?q=80&w=800&auto=format&fit=crop"; // Indoor
                else if (title.includes("实训")) cardImgUrl = "https://images.unsplash.com/photo-1531403009284-440f080d1e12?q=80&w=800&auto=format&fit=crop"; // Education
                else cardImgUrl = "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800&auto=format&fit=crop"; // Tech default

                cardContent.forEach(cb => {
                    if (cb.text) desc += getText(cb.text);
                    if (cb.bullet) {
                        const ft = getText(cb.bullet);
                        features += `
                        <li class="flex items-start gap-2 text-slate-400 text-sm">
                            <span class="text-blue-500 mt-1">✓</span>
                            <span>${ft}</span>
                        </li>`;
                    }
                });

                html += `
                <div class="glass-panel rounded-2xl hover:bg-slate-800/80 transition-all duration-300 group flex flex-col h-full border border-white/5 hover:border-blue-500/30 hover:shadow-2xl hover:shadow-blue-500/10 hover:-translate-y-2 relative overflow-hidden">
                    
                    <!-- 卡片顶部大图 -->
                    <div class="h-48 overflow-hidden relative">
                         <div class="absolute inset-0 bg-blue-900/20 z-10 group-hover:bg-transparent transition-colors"></div>
                         <img src="${cardImgUrl}" class="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" alt="${title}">
                         <div class="absolute bottom-4 left-4 z-20">
                             <span class="inline-block px-3 py-1 bg-black/50 backdrop-blur-md text-white border border-white/10 text-xs font-bold rounded-lg">${title.split(' ')[0]}</span>
                         </div>
                    </div>

                    <div class="p-8 flex flex-col flex-grow">
                        <div class="mb-6 relative z-10">
                            <h3 class="text-2xl font-bold text-white group-hover:text-blue-400 transition-colors">${title.split(' ')[1] || title}</h3>
                        </div>
                        
                        <p class="text-slate-300 text-sm leading-relaxed mb-6 flex-grow border-b border-slate-700/50 pb-6">${desc || "暂无描述"}</p>
                        
                        ${features ? `<ul class="space-y-3 mt-auto">${features}</ul>` : ''}
                        
                        <div class="mt-8 pt-4 border-t border-slate-800 flex items-center text-blue-400 text-sm font-medium group/btn cursor-pointer">
                            <span>探索详情</span>
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-2 transform group-hover/btn:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                        </div>
                    </div>
                </div>
                `;
                
                // 跳过已处理的 Blocks
                i = j - 1; 
            } else {
                html += `<h3 class="text-xl font-bold mt-8 mb-4 text-white">${title}</h3>`;
            }
            continue;
        }

        // --- Bullets (Other) ---
        if (b.bullet) {
            // 如果是在 Timeline 模式下
            if (isTimeline) {
                const text = getText(b.bullet);
                const parts = text.split('：');
                const year = parts[0] || '';
                const event = parts.slice(1).join('：') || text;
                
                html += `
                <div class="relative group pl-8 border-l border-slate-800 ml-3 pb-8 last:pb-0 last:border-0">
                    <span class="absolute -left-[5px] top-2 h-2.5 w-2.5 rounded-full bg-slate-600 group-hover:bg-blue-500 group-hover:scale-150 transition-all duration-300 shadow-[0_0_0_4px_rgba(15,23,42,1)] z-10"></span>
                    <div class="group-hover:translate-x-2 transition-transform duration-300 glass-panel p-4 rounded-xl -mt-2">
                        <span class="inline-block text-blue-400 text-sm font-bold mb-1 font-display tracking-wider">${year}</span>
                        <p class="text-slate-300 text-lg group-hover:text-white transition-colors">${event}</p>
                    </div>
                </div>
                `;
            } 
            // 如果是非 Card 非 Timeline 模式下的 Bullet (例如荣誉)
            else if (!isCards) {
                 const text = getText(b.bullet);
                 html += `
                <div class="flex items-start gap-3 mb-3">
                    <div class="mt-1.5 h-1.5 w-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)]"></div>
                    <span class="text-slate-300 text-lg">${text}</span>
                </div>`;
            }
            continue;
        }

        // --- Ordered List (Projects - Image Version) ---
        if (b.ordered) {
            const text = getText(b.ordered);
            
            // 项目图片匹配
            let projImg = "";
            if (text.includes("故宫")) projImg = "https://images.unsplash.com/photo-1599571340176-9d32789115f2?q=80&w=300&auto=format&fit=crop";
            else if (text.includes("土楼")) projImg = "https://images.unsplash.com/photo-1536254581290-0b6dc0f89d31?q=80&w=300&auto=format&fit=crop"; // 替代：中国古建筑
            else if (text.includes("西安")) projImg = "https://images.unsplash.com/photo-1506461883276-594a12b11cf3?q=80&w=300&auto=format&fit=crop"; // 西安
            else if (text.includes("曾厝垵")) projImg = "https://images.unsplash.com/photo-1548983965-070ded643c16?q=80&w=300&auto=format&fit=crop"; // 厦门海边
            else projImg = "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=300&auto=format&fit=crop"; // Default Architecture

             html += `
            <div class="glass-panel p-4 rounded-xl flex items-center gap-6 hover:border-blue-500/30 transition-all project-item hover:bg-slate-800/50">
                <div class="w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden border border-white/10">
                    <img src="${projImg}" class="w-full h-full object-cover project-img" alt="Project">
                </div>
                <div>
                    <div class="flex items-center gap-3 mb-1">
                        <span class="w-6 h-6 flex items-center justify-center bg-blue-500/20 text-blue-400 font-bold rounded text-xs border border-blue-500/30">${blocks[i].ordered.sequence}</span>
                        <span class="text-white text-lg font-bold">${text.split('：')[0]}</span>
                    </div>
                    <p class="text-slate-400 text-sm">${text.split('：')[1] || ''}</p>
                </div>
            </div>
            `;
            continue;
        }

        // --- Text ---
        if (b.text) {
            const text = getText(b.text);
            if (text.trim() === '') continue;

            if (text.includes('姓名：')) {
                // Basic Info Grid
                const lines = text.split('\n').filter(l => l.trim());
                html += `<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">`;
                lines.forEach(line => {
                    const [label, val] = line.split('：');
                    html += `
                    <div class="glass-panel p-4 rounded-xl">
                        <div class="text-slate-500 text-xs uppercase tracking-wider mb-1">${label}</div>
                        <div class="text-white font-medium text-lg">${val}</div>
                    </div>`;
                });
                html += `</div>`;
            } else {
                html += `<p>${text}</p>`;
            }
            continue;
        }
    }

    if (isTimeline) html += '</div></div>';
    if (isCards) html += '</div></div>'; 
    else html += '</div>';

    return html;
}

// 辅助：提取 TextRun 内容
function getText(blockData) {
    if (!blockData.elements) return '';
    return blockData.elements.map(e => e.text_run ? e.text_run.content : '').join('');
}

// 4. 执行
const htmlContent = parseBlocks(blocks);
const finalHtml = htmlTemplate(htmlContent);
const outputPath = path.join(__dirname, 'su_story.html');

fs.writeFileSync(outputPath, finalHtml);
console.log(`Webpage generated at: ${outputPath}`);
