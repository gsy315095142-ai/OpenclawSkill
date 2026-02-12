// ==UserScript==
// @name         无API航班数据抓取器
// @namespace    http://tampermonkey.net/
// @version      3.0
// @description  无需API - 直接抓取网页航班数据
// @author       AI Assistant
// @match        https://www.google.com/travel/flights*
// @match        https://www.skyscanner.com/*
// @match        https://www.kayak.com/*
// @match        https://www.expedia.com/*
// @match        https://flightaware.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_download
// ==/UserScript==

(function() {
    'use strict';
    
    console.log('🛫 无API航班数据抓取器已启动！');
    
    const flightData = [];
    
    // 主要抓取功能
    window.scrapeFlightData = function() {
        console.log('🔍 开始抓取当前页面航班数据...');
        flightData.length = 0;
        
        const currentSite = window.location.hostname;
        console.log('📍 当前站点：', currentSite);
        
        try {
            if (currentSite.includes('google.com')) {
                scrapeGoogleFlights();
            } else if (currentSite.includes('skyscanner.com')) {
                scrapeSkyscanner();
            } else if (currentSite.includes('kayak.com')) {
                scrapeKayak();
            } else if (currentSite.includes('expedia.com')) {
                scrapeExpedia();
            } else if (currentSite.includes('flightaware.com')) {
                scrapeFlightAware();
            }
            
            if (flightData.length > 0) {
                processAndDisplayResults();
            } else {
                console.log('⚠️ 未抓取到数据，尝试通用抓取方法...');
                scrapeGeneric();
            }
            
        } catch (error) {
            console.error('❌ 抓取失败:', error);
            scrapeGeneric(); //  fallback到通用方法
        }
    };
    
    // Google Flights 抓取
    function scrapeGoogleFlights() {
        console.log('🎯 抓取 Google Flights 数据...');
        
        const flightElements = document.querySelectorAll('[data-result-id], .gws-flights-results-result, .flight-result');
        console.log('找到', flightElements.length, '个航班元素');
        
        flightElements.forEach((element, index) => {
            try {
                const flight = {
                    airline: '',
                    flightNumber: '',
                    departureTime: '',
                    arrivalTime: '',
                    duration: '',
                    price: 0,
                    stops: '',
                    aircraft: '',
                    source: 'Google Flights'
                };
                
                // 航空公司
                const airlineEl = element.querySelector('.gws-flights-results-airline, .airline-name, [data-airline]');
                if (airlineEl) flight.airline = airlineEl.textContent.trim();
                
                // 航班号
                const flightNoEl = element.querySelector('.gws-flights-results-flight-number, .flight-number');
                if (flightNoEl) flight.flightNumber = flightNoEl.textContent.trim();
                
                // 时间
                const timeEls = element.querySelectorAll('.gws-flights-results-time, .departure-time, .arrival-time');
                if (timeEls.length >= 2) {
                    flight.departureTime = timeEls[0].textContent.trim();
                    flight.arrivalTime = timeEls[1].textContent.trim();
                }
                
                // 价格
                const priceEl = element.querySelector('.gws-flights-results-price, .price, [data-price]');
                if (priceEl) {
                    const priceText = priceEl.textContent.trim();
                    const priceMatch = priceText.match(/[\d,]+/g);
                    if (priceMatch) {
                        flight.price = parseInt(priceMatch.join('').replace(/,/g, ''));
                    }
                }
                
                // 经停
                const stopsEl = element.querySelector('.gws-flights-results-stops, .stops');
                if (stopsEl) flight.stops = stopsEl.textContent.trim();
                
                // 飞行时间
                const durationEl = element.querySelector('.gws-flights-results-duration, .duration');
                if (durationEl) flight.duration = durationEl.textContent.trim();
                
                if (flight.airline && flight.price > 0) {
                    flightData.push(flight);
                    console.log(`✅ 抓取第${flightData.length}个航班：${flight.airline} ${flight.flightNumber} - ¥${flight.price}`);
                }
                
            } catch (error) {
                console.error(`❌ 抓取第${index + 1}个航班失败:`, error);
            }
        });
    }
    
    // Skyscanner 抓取
    function scrapeSkyscanner() {
        console.log('🎯 抓取 Skyscanner 数据...');
        
        const flightElements = document.querySelectorAll('.FlightsTicket_container, .ticket-item, .flight-card, [data-testid*="flight"]');
        
        flightElements.forEach((element, index) => {
            try {
                const flight = {
                    airline: '',
                    flightNumber: '',
                    departureTime: '',
                    arrivalTime: '',
                    duration: '',
                    price: 0,
                    stops: '',
                    source: 'Skyscanner'
                };
                
                // 航空公司和时间
                const infoEls = element.querySelectorAll('.info, .time, .carrier');
                infoEls.forEach(el => {
                    const text = el.textContent.trim();
                    if (text.includes(':') && !flight.departureTime) {
                        flight.departureTime = text;
                    } else if (text.match(/^[A-Z]{2}\d+/)) {
                        flight.flightNumber = text;
                    } else if (text.length > 2 && text.length < 20 && !flight.airline) {
                        flight.airline = text;
                    }
                });
                
                // 价格
                const priceEl = element.querySelector('.price, [data-testid*="price"], .ticket-price');
                if (priceEl) {
                    const priceText = priceEl.textContent.trim();
                    const priceMatch = priceText.match(/[\d,]+/g);
                    if (priceMatch) {
                        flight.price = parseInt(priceMatch.join('').replace(/,/g, ''));
                    }
                }
                
                if (flight.airline && flight.price > 0) {
                    flightData.push(flight);
                    console.log(`✅ 抓取第${flightData.length}个航班：${flight.airline} - ¥${flight.price}`);
                }
                
            } catch (error) {
                console.error(`❌ 抓取第${index + 1}个航班失败:`, error);
            }
        });
    }
    
    // Kayak 抓取
    function scrapeKayak() {
        console.log('🎯 抓取 Kayak 数据...');
        
        const flightElements = document.querySelectorAll('.result-item, .flight-result, .searchResult');
        
        flightElements.forEach((element, index) => {
            try {
                const flight = {
                    airline: '',
                    flightNumber: '',
                    departureTime: '',
                    arrivalTime: '',
                    duration: '',
                    price: 0,
                    stops: '',
                    source: 'Kayak'
                };
                
                // 航空公司
                const airlineEl = element.queryQuerySelector('.airline-name, .carrier, .airline');
                if (airlineEl) flight.airline = airlineEl.textContent.trim();
                
                // 价格
                const priceEl = element.querySelector('.price, .ticket-price, .result-price');
                if (priceEl) {
                    const priceText = priceEl.textContent.trim();
                    const priceMatch = priceText.match(/[\d,]+/g);
                    if (priceMatch) {
                        flight.price = parseInt(priceMatch.join('').replace(/,/g, ''));
                    }
                }
                
                // 时间
                const timeEls = element.querySelectorAll('.time, .departure-time, .arrival-time');
                if (timeEls.length >= 2) {
                    flight.departureTime = timeEls[0].textContent.trim();
                    flight.arrivalTime = timeEls[1].textContent.trim();
                }
                
                if (flight.airline && flight.price > 0) {
                    flightData.push(flight);
                    console.log(`✅ 抓取第${flightData.length}个航班：${flight.airline} - ¥${flight.price}`);
                }
                
            } catch (error) {
                console.error(`❌ 抓取第${index + 1}个航班失败:`, error);
            }
        });
    }
    
    // 通用抓取方法
    function scrapeGeneric() {
        console.log('🔧 使用通用抓取方法...');
        
        // 寻找所有可能的航班相关元素
        const selectors = [
            '.flight', '.flight-item', '.flight-card', '.flight-result',
            '[data-flight]', '[data-result]', '.result-item', '.ticket',
            '.route', '.flight-info', '.flight-detail'
        ];
        
        let flightElements = [];
        selectors.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            if (elements.length > 0) {
                flightElements = flightElements.concat(Array.from(elements));
            }
        });
        
        console.log('通用方法找到', flightElements.length, '个潜在航班元素');
        
        flightElements.forEach((element, index) => {
            try {
                const flight = {
                    airline: '',
                    flightNumber: '',
                    departureTime: '',
                    arrivalTime: '',
                    price: 0,
                    source: '通用抓取'
                };
                
                // 获取所有文本内容
                const allText = element.textContent;
                
                // 提取航班号 (CA1234, MU5678 等格式)
                const flightNumberMatch = allText.match(/[A-Z]{2}\s*\d{3,4}/g);
                if (flightNumberMatch) {
                    flight.flightNumber = flightNumberMatch[0];
                }
                
                // 提取时间 (08:30, 14:25 等格式)
                const timeMatches = allText.match(/\d{1,2}:\d{2}/g);
                if (timeMatches && timeMatches.length >= 2) {
                    flight.departureTime = timeMatches[0];
                    flight.arrivalTime = timeMatches[1];
                }
                
                // 提取价格
                const priceMatches = allText.match(/[\d,]+\s*元?/g);
                if (priceMatches) {
                    for (let priceMatch of priceMatches) {
                        const price = parseInt(priceMatch.replace(/[,元]/g, ''));
                        if (price > 1000 && price < 50000) { // 合理价格范围
                            flight.price = price;
                            break;
                        }
                    }
                }
                
                // 提取航空公司
                const airlines = ['中国国航', '南方航空', '东方航空', '海南航空', '厦门航空', '深圳航空', '四川航空', '山东航空', '春秋航空', '华夏航空'];
                for (let airline of airlines) {
                    if (allText.includes(airline)) {
                        flight.airline = airline;
                        break;
                    }
                }
                
                if (flight.price > 0) {
                    flightData.push(flight);
                    console.log(`✅ 通用抓取第${flightData.length}个航班：${flight.airline || '未知'} ${flight.flightNumber || '未知'} - ¥${flight.price}`);
                }
                
            } catch (error) {
                console.error(`❌ 通用抓取第${index + 1}个元素失败:`, error);
            }
        });
    }
    
    // 处理和显示结果
    function processAndDisplayResults() {
        console.log('📊 处理抓取结果...');
        
        if (flightData.length === 0) {
            console.log('⚠️ 未抓取到任何航班数据');
            alert('未抓取到航班数据，请确保：\n1. 页面已完全加载\n2. 搜索结果已显示\n3. 重试 scrapeFlightData()');
            return;
        }
        
        // 数据清洗和排序
        flightData.forEach(flight => {
            // 清理价格数据
            if (flight.price > 100000) flight.price = Math.floor(flight.price / 100); // 处理分转元
            
            // 清理时间数据
            flight.departureTime = flight.departureTime.replace(/[^\d:]/g, '');
            flight.arrivalTime = flight.arrivalTime.replace(/[^\d:]/g, '');
            
            // 清理航班号
            if (flight.flightNumber) {
                flight.flightNumber = flight.flightNumber.replace(/\s+/g, '');
            }
        });
        
        // 按价格排序
        flightData.sort((a, b) => a.price - b.price);
        
        console.log('💰 最便宜航班：', flightData[0]);
        console.log('📈 价格范围：¥' + flightData[flightData.length-1].price + ' - ¥' + flightData[0].price);
        
        generateRealTimeReport();
    }
    
    // 生成实时报告
    function generateRealTimeReport() {
        const bestDeal = flightData[0];
        const otherFlights = flightData.slice(1, 15); // 最多显示14个其他航班
        
        const htmlContent = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>厦门飞北京商务舱 - 实时数据报告</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Segoe UI', 'Microsoft YaHei', Arial, sans-serif;
            background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
            min-height: 100vh;
            padding: 20px;
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
            background: white;
            border-radius: 20px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
            overflow: hidden;
        }
        
        .header {
            background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%);
            color: white;
            padding: 30px;
            text-align: center;
        }
        
        .stats {
            background: #f8f9fa;
            padding: 20px;
            text-align: center;
            border-bottom: 1px solid #e9ecef;
        }
        
        .stat-item {
            display: inline-block;
            margin: 0 20px;
            text-align: center;
        }
        
        .stat-number {
            font-size: 2rem;
            font-weight: bold;
            color: #2a5298;
            display: block;
        }
        
        .best-deal {
            background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
            color: white;
            padding: 30px;
            margin: 20px;
            border-radius: 15px;
            box-shadow: 0 10px 30px rgba(40, 167, 69, 0.3);
        }
        
        .flight-card {
            background: white;
            border: 2px solid #e9ecef;
            border-radius: 15px;
            padding: 20px;
            margin: 15px;
            transition: all 0.3s ease;
            position: relative;
        }
        
        .flight-card:hover {
            border-color: #2a5298;
            box-shadow: 0 5px 15px rgba(42, 82, 152, 0.2);
            transform: translateY(-2px);
        }
        
        .price-tag {
            position: absolute;
            top: 20px;
            right: 20px;
            background: #e74c3c;
            color: white;
            padding: 10px 15px;
            border-radius: 25px;
            font-size: 1.2rem;
            font-weight: bold;
        }
        
        .best-deal .price-tag {
            background: #ffc107;
            color: #212529;
        }
        
        .airline-logo {
            width: 40px;
            height: 40px;
            background: #2a5298;
            border-radius: 50%;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: bold;
            margin-right: 10px;
        }
        
        .flight-header {
            display: flex;
            align-items: center;
            margin-bottom: 15px;
        }
        
        .flight-times {
            display: grid;
            grid-template-columns: 1fr auto 1fr;
            gap: 20px;
            align-items: center;
            margin: 15px 0;
        }
        
        .time-info h4 {
            font-size: 1.5rem;
            color: #2a5298;
            margin-bottom: 5px;
        }
        
        .time-info p {
            color: #6c757d;
            font-size: 0.9rem;
        }
        
        .flight-path {
            text-align: center;
            color: #adb5bd;
        }
        
        .flight-path .duration {
            font-size: 0.8rem;
            margin-top: 5px;
        }
        
        .arrow {
            font-size: 1.5rem;
        }
        
        .features {
            margin-top: 15px;
            padding-top: 15px;
            border-top: 1px solid #e9ecef;
        }
        
        .feature-tag {
            display: inline-block;
            background: #e3f2fd;
            color: #1565c0;
            padding: 4px 8px;
            border-radius: 12px;
            font-size: 0.8rem;
            margin: 2px;
        }
        
        .update-time {
            text-align: center;
            color: #6c757d;
            font-size: 0.9rem;
            margin: 20px;
            padding: 20px;
            border-top: 1px solid #e9ecef;
        }
        
        .data-source {
            background: #fff3cd;
            border: 1px solid #ffeaa7;
            color: #856404;
            padding: 15px;
            margin: 20px;
            border-radius: 10px;
            text-align: center;
        }
        
        @media (max-width: 768px) {
            .flight-times {
                grid-template-columns: 1fr;
                gap: 10px;
            }
            
            .price-tag {
                position: static;
                display: inline-block;
                margin-top: 10px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🛫 厦门飞北京商务舱机票</h1>
            <p>实时数据抓取报告 - 明天早上航班</p>
        </div>
        
        <div class="data-source">
            <strong>🔍 数据来源：</strong> ${flightData[0].source} 实时抓取
            <br><strong>⏰ 抓取时间：</strong> ${new Date().toLocaleString()}
            <br><strong>🎯 搜索条件：</strong> 厦门 → 北京 | 明天早上 | 商务舱
        </div>
        
        <div class="stats">
            <div class="stat-item">
                <span class="stat-number">${flightData.length}</span>
                <span>个航班</span>
            </div>
            <div class="stat-item">
                <span class="stat-number">¥${bestDeal.price.toLocaleString()}</span>
                <span>最低价</span>
            </div>
            <div class="stat-item">
                <span class="stat-number">¥${Math.round(flightData.reduce((sum, f) => sum + f.price, 0) / flightData.length).toLocaleString()}</span>
                <span>平均价</span>
            </div>
        </div>
        
        <div class="best-deal">
            <div class="price-tag">🏆 最佳</div>
            <div class="flight-header">
                <div class="airline-logo">${bestDeal.airline.charAt(0)}</div>
                <div>
                    <h3>${bestDeal.airline}</h3>
                    <p class="text-muted">${bestDeal.flightNumber || '航班号未知'}</p>
                </div>
            </div>
            
            <div class="flight-times">
                <div class="time-info">
                    <h4>${bestDeal.departureTime || '--:--'}</h4>
                    <p>厦门高崎机场</p>
                </div>
                <div class="flight-path">
                    <div class="arrow">→</div>
                    <div class="duration">${bestDeal.duration || '直飞'}</div>
                </div>
                <div class="time-info">
                    <h4>${bestDeal.arrivalTime || '--:--'}</h4>
                    <p>北京首都/大兴机场</p>
                </div>
            </div>
            
            ${bestDeal.stops ? `<p><strong>🔄 经停：</strong> ${bestDeal.stops}</p>` : ''}
            ${bestDeal.features && bestDeal.features.length > 0 ? `
            <div class="features">
                <strong>✨ 特色服务：</strong>
                ${bestDeal.features.map(feature => `<span class="feature-tag">${feature}</span>`).join('')}
            </div>
            ` : ''}
        </div>
        
        <div style="padding: 20px;">
            <h3>📋 其他商务舱选择</h3>
            ${otherFlights.map((flight, index) => `
                <div class="flight-card">
                    <div class="price-tag">第${index + 2}位</div>
                    <div class="flight-header">
                        <div class="airline-logo">${flight.airline.charAt(0)}</div>
                        <div>
                            <h4>${flight.airline}</h4>
                            <p class="text-muted">${flight.flightNumber || '航班号未知'}</p>
                        </div>
                    </div>
                    
                    <div class="flight-times">
                        <div class="time-info">
                            <h4>${flight.departureTime || '--:--'}</h4>
                            <p>厦门高崎机场</p>
                        </div>
                        <div class="flight-path">
                            <div class="arrow">→</div>
                            <div class="duration">${flight.duration || '直飞'}</div>
                        </div>
                        <div class="time-info">
                            <h4>${flight.arrivalTime || '--:--'}</h4>
                            <p>北京首都/大兴机场</p>
                        </div>
                    </div>
                    
                    <div style="text-align: center; margin-top: 15px;">
                        <span style="font-size: 1.3rem; font-weight: bold; color: #e74c3c;">¥${flight.price.toLocaleString()}</span>
                        <span style="color: #6c757d; margin-left: 10px;">(${flight.source})</span>
                    </div>
                    
                    ${flight.stops ? `<p style="margin-top: 10px;"><strong>🔄 经停：</strong> ${flight.stops}</p>` : ''}
                </div>
            `).join('')}
        </div>
        
        <div class="update-time">
            📊 数据更新时间：${new Date().toLocaleString()}
            <br>🔍 抓取工具：无API航班数据抓取器
            <br>✅ 共抓取 ${flightData.length} 个真实航班数据
        </div>
    </div>
</body>
</html>`;
        
        // 下载文件
        const blob = new Blob([htmlContent], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `xiamen-beijing-flights-${new Date().toISOString().split('T')[0]}.html`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        console.log('💾 实时航班数据报告已生成并下载！');
        console.log('📊 统计信息：');
        console.log(`   • 总航班数：${flightData.length}`);
        console.log(`   • 价格范围：¥${flightData[flightData.length-1].price} - ¥${flightData[0].price}`);
        console.log(`   • 平均价格：¥${Math.round(flightData.reduce((sum, f) => sum + f.price, 0) / flightData.length)}`);
        console.log(`   • 最便宜航班：${bestDeal.airline} ${bestDeal.flightNumber} - ¥${bestDeal.price}`);
    }
    
    // 设置搜索参数
    window.setSearchParams = function() {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        
        console.log('🛫 推荐搜索参数：');
        console.log('📍 航线：厦门高崎机场 (XMN) → 北京首都机场 (PEK) 或北京大兴机场 (PKX)');
        console.log('📅 日期：' + tomorrow.toISOString().split('T')[0] + '（明天）');
        console.log('⏰ 时间：早上 (06:00-12:00)');
        console.log('💺 舱位：商务舱 (Business Class)');
        console.log('');
        console.log('🔗 推荐搜索网站：');
        console.log('   • Google Flights: https://www.google.com/travel/flights');
        console.log('   • Skyscanner: https://www.skyscanner.com');
        console.log('   • Kayak: https://www.kayak.com');
        console.log('');
        console.log('💡 操作步骤：');
        console.log('1. 访问上述网站');
        console.log('2. 输入搜索条件');
        console.log('3. 搜索完成后运行：scrapeFlightData()');
    };
    
    // 自动运行提示
    setTimeout(() => {
        console.log('\n🛫 无API航班数据抓取器已就绪！');
        console.log('='.repeat(50));
        console.log('💡 使用步骤：');
        console.log('1️⃣ 访问 Google Flights 或 Skyscanner');
        console.log('2️⃣ 搜索：厦门→北京，明天，商务舱');
        console.log('3️⃣ 搜索结果出来后运行：scrapeFlightData()');
        console.log('4️⃣ 获得真实数据并生成报告');
        console.log('');
        console.log('🎯 或者运行：setSearchParams() 查看详细参数');
        console.log('='.repeat(50));
    }, 2000);
    
})();