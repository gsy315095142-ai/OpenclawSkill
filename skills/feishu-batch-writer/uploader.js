const fs = require('fs');
const path = require('path');
const https = require('https');

function uploadImage(filePath, accessToken, parentType = 'docx_image', parentNode) {
    return new Promise((resolve, reject) => {
        if (!fs.existsSync(filePath)) {
            return reject(new Error(`File not found: ${filePath}`));
        }

        const fileName = path.basename(filePath);
        const fileSize = fs.statSync(filePath).size;
        const fileContent = fs.readFileSync(filePath);
        
        const boundary = '----FeishuBatchWriterBoundary' + Date.now();
        
        // Construct multipart/form-data body
        const parts = [
            `--${boundary}`,
            `Content-Disposition: form-data; name="file_name"`,
            '',
            fileName,
            `--${boundary}`,
            `Content-Disposition: form-data; name="parent_type"`,
            '',
            parentType,
            `--${boundary}`,
            `Content-Disposition: form-data; name="parent_node"`,
            '',
            parentNode,
            `--${boundary}`,
            `Content-Disposition: form-data; name="size"`,
            '',
            fileSize.toString(),
            `--${boundary}`,
            `Content-Disposition: form-data; name="file"; filename="${fileName}"`,
            `Content-Type: application/octet-stream`,
            '',
            fileContent,
            `--${boundary}--`
        ];

        // Combine parts into a single buffer
        // Note: We need to handle mixed string/buffer parts carefully
        const bodyBuffer = Buffer.concat(parts.map((p, i) => {
            if (typeof p === 'string') {
                // Add CRLF to strings, except the last boundary part (maybe)
                // Standard multipart requires CRLF after each part
                return Buffer.from(p + '\r\n');
            } else {
                return Buffer.concat([p, Buffer.from('\r\n')]);
            }
        }));
        
        // Actually, the array above mixes logic. Let's do it properly.
        const crlf = Buffer.from('\r\n');
        const dashBoundary = Buffer.from(`--${boundary}`);
        const endBoundary = Buffer.from(`--${boundary}--`);
        
        const bodyParts = [];
        
        // Field: file_name
        bodyParts.push(dashBoundary, crlf);
        bodyParts.push(Buffer.from(`Content-Disposition: form-data; name="file_name"`), crlf, crlf);
        bodyParts.push(Buffer.from(fileName), crlf);

        // Field: parent_type
        bodyParts.push(dashBoundary, crlf);
        bodyParts.push(Buffer.from(`Content-Disposition: form-data; name="parent_type"`), crlf, crlf);
        bodyParts.push(Buffer.from(parentType), crlf);

        // Field: parent_node
        bodyParts.push(dashBoundary, crlf);
        bodyParts.push(Buffer.from(`Content-Disposition: form-data; name="parent_node"`), crlf, crlf);
        bodyParts.push(Buffer.from(parentNode), crlf);

        // Field: size
        bodyParts.push(dashBoundary, crlf);
        bodyParts.push(Buffer.from(`Content-Disposition: form-data; name="size"`), crlf, crlf);
        bodyParts.push(Buffer.from(fileSize.toString()), crlf);

        // Field: file
        bodyParts.push(dashBoundary, crlf);
        bodyParts.push(Buffer.from(`Content-Disposition: form-data; name="file"; filename="${fileName}"`), crlf);
        bodyParts.push(Buffer.from(`Content-Type: application/octet-stream`), crlf, crlf);
        bodyParts.push(fileContent, crlf);

        // End
        bodyParts.push(endBoundary, crlf);
        
        const finalBuffer = Buffer.concat(bodyParts);

        const options = {
            hostname: 'open.feishu.cn',
            path: '/open-apis/drive/v1/medias/upload_all',
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': `multipart/form-data; boundary=${boundary}`,
                'Content-Length': finalBuffer.length
            }
        };

        console.log(`   -> Uploading ${fileName} (${fileSize} bytes)...`);

        const req = https.request(options, (res) => {
            let responseData = '';
            res.on('data', chunk => responseData += chunk);
            res.on('end', () => {
                try {
                    const json = JSON.parse(responseData);
                    if (json.code === 0) {
                        console.log(`   -> Upload Success! Token: ${json.data.file_token}`);
                        resolve(json.data.file_token);
                    } else {
                        reject(new Error(`API Error ${json.code}: ${json.msg}`));
                    }
                } catch (e) {
                    reject(new Error("Invalid JSON response"));
                }
            });
        });

        req.on('error', (e) => reject(e));
        req.write(finalBuffer);
        req.end();
    });
}

module.exports = { uploadImage };
