const fs = require('fs');
const path = require('path');

// 尝试从多个位置寻找 openclaw.json
function loadFeishuConfig() {
    const searchPaths = [
        'C:\\Users\\31509\\.openclaw\\openclaw.json', 
        path.join(process.cwd(), 'openclaw.json'),
        path.join(process.cwd(), '.openclaw', 'openclaw.json')
    ];

    for (const p of searchPaths) {
        if (fs.existsSync(p)) {
            try {
                const raw = fs.readFileSync(p, 'utf8');
                const config = JSON.parse(raw);
                if (config.channels && config.channels.feishu) {
                    const { appId, appSecret } = config.channels.feishu;
                    if (appId && appSecret) {
                        return { appId, appSecret };
                    }
                }
            } catch (e) {
                console.error(`Error reading config at ${p}:`, e.message);
            }
        }
    }
    throw new Error("Could not find valid Feishu config in openclaw.json");
}

module.exports = { loadFeishuConfig };
