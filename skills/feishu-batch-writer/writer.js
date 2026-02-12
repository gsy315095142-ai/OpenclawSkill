const https = require('https');
const fs = require('fs');
const { loadFeishuConfig } = require('./config_loader');

// === Args Parsing ===
const args = process.argv.slice(2);
const docTokenIdx = args.indexOf('--doc');
const fileIdx = args.indexOf('--file');

if (docTokenIdx === -1 || fileIdx === -1) {
    console.error("Usage: node writer.js --doc <TOKEN> --file <CONTENT.json>");
    process.exit(1);
}

const docToken = args[docTokenIdx + 1];
const filePath = args[fileIdx + 1];

// === Main ===
(async () => {
    try {
        console.log("[1/4] Loading Config...");
        const { appId, appSecret } = loadFeishuConfig();
        
        console.log("[2/4] Authenticating...");
        const token = await getTenantAccessToken(appId, appSecret);
        
        console.log("[3/4] Reading Content...");
        const rawContent = fs.readFileSync(filePath, 'utf8');
        const blocks = JSON.parse(rawContent);
        
        console.log(`[4/4] Batch Writing ${blocks.length} blocks...`);
        // Get Root Block ID (Document ID is usually the Root Block ID for batch_create under root?) 
        // No, for batch_create we need a parent_id. For root, parent_id = docToken.
        
        await batchCreateBlocks(token, docToken, docToken, blocks);
        
        console.log("✅ DONE! All blocks written successfully.");
        
    } catch (e) {
        console.error("❌ FAILED:", e.message);
        if (e.response) console.error("API Response:", e.response);
        process.exit(1);
    }
})();

// === Helpers ===

function request(method, path, token, data) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'open.feishu.cn',
            path: path,
            method: method,
            headers: {
                'Content-Type': 'application/json; charset=utf-8'
            }
        };
        
        if (token) options.headers['Authorization'] = 'Bearer ' + token;

        const req = https.request(options, (res) => {
            let body = '';
            res.on('data', c => body += c);
            res.on('end', () => {
                try {
                    const json = JSON.parse(body);
                    if (json.code !== 0) {
                        reject({ message: `API Error ${json.code}: ${json.msg}`, response: json });
                    } else {
                        resolve(json);
                    }
                } catch (e) {
                    console.error("DEBUG - Raw Body:", body); // Add debug log
                    reject({ message: "Invalid JSON response", raw: body });
                }
            });
        });
        
        req.on('error', e => reject(e));
        if (data) req.write(JSON.stringify(data));
        req.end();
    });
}

async function getTenantAccessToken(appId, appSecret) {
    const res = await request('POST', '/open-apis/auth/v3/tenant_access_token/internal', null, {
        app_id: appId,
        app_secret: appSecret
    });
    return res.tenant_access_token;
}

async function batchCreateBlocks(token, docToken, parentId, blocks) {
    // 飞书限制：batch_create 不超过 50 个? 文档显示 limit 是 user defined but usually safe around 50-100?
    // 官方文档：batch_create 没有明确硬限制，通用建议分片。
    // 为了安全，我们按 50 个一组切片。
    
    const CHUNK_SIZE = 50;
    
    for (let i = 0; i < blocks.length; i += CHUNK_SIZE) {
        const chunk = blocks.slice(i, i + CHUNK_SIZE);
        console.log(`   -> Writing chunk ${i/CHUNK_SIZE + 1} (${chunk.length} blocks)...`);
        
        // Correct Path: POST .../children
        const apiPath = `/open-apis/docx/v1/documents/${docToken}/blocks/${parentId}/children`;

        await request('POST', apiPath, token, {
            children: chunk,
            index: -1 
        });
    }
}
