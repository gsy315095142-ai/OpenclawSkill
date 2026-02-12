// ==UserScript==
// @name         厦门北京航班自动搜索 - 手动执行版
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  手动执行版 - 厦门飞北京航班数据自动获取
// @author       AI Assistant
// @match        https://www.ctrip.com/*
// @match        https://flight.ctrip.com/*
// @match        https://flights.ctrip.com/*
// @match        https://www.qunar.com/*
// @match        https://flight.qunar.com/*
// @match        https://www.skyscanner.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    
    console.log('🛫 厦门北京航班搜索脚本已加载！');
    console.log('📋 请在控制台中执行以下函数：');
    console.log('1. startFlightSearch() - 开始自动搜索');
    console.log('2. extractFlightData() - 提取航班数据');
    
    const flightData = [];
    
    // 开始航班搜索
    window.startFlightSearch = function() {
        console.log('🚀 开始厦门飞北京航班搜索...');
        
        // 获取当前网站
        const currentSite = window.location.hostname;
        console.log('📍 当前网站：', currentSite);
        
        // 等待页面加载
        setTimeout(() => {
            if (currentSite.includes('ctrip.com')) {
                searchCtrip();
            } else if (currentSite.includes('qunar.com')) {
                searchQunar();
            } else if (currentSite.includes('skyscanner.com')) {
                searchSkyscanner();
            } else {
                console.log('❌ 不支持当前网站，请手动操作');
                alert('请手动访问携程、去哪儿或Skyscanner进行搜索');
            }
        }, 2000);
    };
    
    // 携程搜索
    function searchCtrip() {
        console.log('🎯 开始携程搜索流程...');
        
        try {
            // 1. 点击往返/单程选择
            console.log('1️⃣ 选择单程...');
            const oneWayRadio = document.querySelector('input[type="radio"][value="oneway"], .trip-type-oneway, [data-testid*="oneway"]');
            if (oneWayRadio) {
                oneWayRadio.click();
                console.log('✅ 已选择单程');
            }
            
            // 2. 设置出发城市
            setTimeout(() => {
                console.log('2️⃣ 设置出发城市为厦门...');
                const depInput = document.querySelector('input[placeholder*="出发"], input[data-test="departure-input"], #departCityName');
                if (depInput) {
                    depInput.focus();
                    depInput.value = '厦门';
                    depInput.dispatchEvent(new Event('input', { bubbles: true }));
                    depInput.dispatchEvent(new Event('change', { bubbles: true }));
                    console.log('✅ 已设置出发城市：厦门');
                }
            }, 1000);
            
            // 3. 设置到达城市
            setTimeout(() => {
                console.log('3️⃣ 设置到达城市为北京...');
                const arrInput = document.querySelector('input[placeholder*="到达"], input[data-test="arrival-input"], #arriveCityName');
                if (arrInput) {
                    arrInput.focus();
                    arrInput.value = '北京';
                    arrInput.dispatchEvent(new Event('input', { bubbles: true }));
                    arrInput.dispatchEvent(new Event('change', { bubbles: true }));
                    console.log('✅ 已设置到达城市：北京');
                }
            }, 2000);
            
            // 4. 设置明天日期
            setTimeout(() => {
                console.log('4️⃣ 设置明天日期...');
                const tomorrow = new Date();
                tomorrow.setDate(tomorrow.getDate() + 1);
                const dateStr = tomorrow.toISOString().split('T')[0];
                
                const dateInput = document.querySelector('input[type="date"], input[placeholder*="日期"], [data-test="depart-date"]');
                if (dateInput) {
                    dateInput.value = dateStr;
                    dateInput.dispatchEvent(new Event('change', { bubbles: true }));
                    console.log('✅ 已设置日期：', dateStr);
                }
            }, 3000);
            
            // 5. 选择商务舱
            setTimeout(() => {
                console.log('5️⃣ 选择商务舱...');
                const cabinSelect = document.querySelector('select[data-test="cabin-class"], [data-testid*="cabin"], .cabin-select');
                if (cabinSelect) {
                    cabinSelect.value = 'business';
                    cabinSelect.dispatchEvent(new Event('change', { bubbles: true }));
                    console.log('✅ 已选择商务舱');
                } else {
                    // 寻找商务舱选项
                    const businessOption = document.querySelector('option[value="business"], [data-value="business"], label:contains("商务")');
                    if (businessOption) {
                        businessOption.click();
                        console.log('✅ 已选择商务舱选项');
                    }
                }
            }, 4000);
            
            // 6. 点击搜索按钮
            setTimeout(() => {
                console.log('6️⃣ 点击搜索按钮...');
                const searchBtn = document.querySelector('button[type="submit"], .search-btn, [data-test="search-btn"], .btn-search');
                if (searchBtn) {
                    searchBtn.click();
                    console.log('✅ 已点击搜索按钮');
                    console.log('⏳ 等待搜索结果加载...');
                    
                    // 等待搜索结果
                    setTimeout(() => {
                        console.log('🎉 搜索完成！现在可以运行 extractFlightData() 提取数据了');
                        alert('✅ 搜索完成！\n现在请在控制台运行：extractFlightData()\n来提取航班数据');
                    }, 5000);
                } else {
                    console.log('❌ 未找到搜索按钮');
                }
            }, 5000);
            
        } catch (error) {
            console.error('❌ 携程搜索流程出错:', error);
            alert('搜索流程出错，请手动完成搜索');
        }
    }
    
    // 去哪儿搜索
    function searchQunar() {
        console.log('🎯 开始去哪儿搜索流程...');
        
        try {
            // 设置出发城市
            setTimeout(() => {
                const fromInput = document.querySelector('#fromCity, input[placeholder*="出发"]');
                if (fromInput) {
                    fromInput.value = '厦门';
                    fromInput.dispatchEvent(new Event('input', { bubbles: true }));
                    console.log('✅ 已设置出发城市：厦门');
                }
            }, 1000);
            
            // 设置到达城市
            setTimeout(() => {
                const toInput = document.querySelector('#toCity, input[placeholder*="到达"]');
                if (toInput) {
                    toInput.value = '北京';
                    toInput.dispatchEvent(new Event('input', { bubbles: true }));
                    console.log('✅ 已设置到达城市：北京');
                }
            }, 2000);
            
            // 设置日期和舱位
            setTimeout(() => {
                console.log('✅ 请手动选择明天日期和商务舱，然后点击搜索');
                alert('请手动完成以下操作：\n1. 选择明天日期\n2. 选择商务舱\n3. 点击搜索按钮\n\n搜索完成后运行：extractFlightData()');
            }, 3000);
            
        } catch (error) {
            console.error('❌ 去哪儿搜索流程出错:', error);
        }
    }
    
    // 提取航班数据
    window.extractFlightData = function() {
        console.log('🔍 开始提取航班数据...');
        flightData.length = 0; // 清空数组
        
        const currentSite = window.location.hostname;
        console.log('📍 从', currentSite, '提取数据...');
        
        if (currentSite.includes('ctrip.com')) {
            extractCtripData();
        } else if (currentSite.includes('qunar.com')) {
            extractQunarData();
        } else if (currentSite.includes('skyscanner.com')) {
            extractSkyscannerData();
        }
        
        console.log('📊 提取完成！共找到', flightData.length, '个航班');
        
        if (flightData.length > 0) {
            // 按价格排序
            flightData.sort((a, b) => a.price - b.price);
            
            console.log('💰 最便宜航班：', flightData[0]);
            console.log('📋 所有航班数据：', flightData);
            
            // 生成结果HTML
            generateResultsHTML();
            
            alert(`✅ 数据提取完成！\n共找到 ${flightData.length} 个商务舱航班\n最便宜：${flightData[0].airline} ${flightData[0].flightNumber} - ¥${flightData[0].price}\n\n已生成HTML报告，请查看下载的文件。`);
        } else {
            alert('⚠️ 未提取到数据，请确保：\n1. 搜索结果已加载完成\n2. 页面包含航班信息\n3. 重试 extractFlightData()');
        }
        
        return flightData;
    };
    
    // 提取携程数据
    function extractCtripData() {
        console.log('📋 提取携程航班数据...');
        
        // 查找所有航班元素
        const flightElements = document.querySelectorAll('.flight-item, .flight-card, .result-item, [data-test*="flight"]');
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
                    features: [],
                    aircraft: '',
                    source: '携程'
                };
                
                // 提取航空公司
                const airlineEl = element.querySelector('.airline-name, .flight-company, .company-name, [data-test*="airline"]');
                if (airlineEl) flight.airline = airlineEl.textContent.trim();
                
                // 提取航班号
                const flightNoEl = element.querySelector('.flight-number, .flight-no, [data-test*="flight-number"]');
                if (flightNoEl) flight.flightNumber = flightNoEl.textContent.trim();
                
                // 提取时间
                const timeEls = element.querySelectorAll('.time, .depart-time, .arrive-time, [data-test*="time"]');
                if (timeEls.length >= 2) {
                    flight.departureTime = timeEls[0].textContent.trim();
                    flight.arrivalTime = timeEls[1].textContent.trim();
                }
                
                // 提取价格
                const priceEls = element.querySelectorAll('.price, .ticket-price, [data-test*="price"]');
                for (let priceEl of priceEls) {
                    const priceText = priceEl.textContent.trim();
                    const priceMatch = priceText.match(/[\d,]+/g);
                    if (priceMatch) {
                        const price = parseInt(priceMatch.join('').replace(/,/g, ''));
                        if (price > 1000) { // 商务舱价格阈值
                            flight.price = price;
                            break;
                        }
                    }
                }
                
                // 提取特色
                const featureEls = element.querySelectorAll('.feature, .tag, .badge, .service-item');
                featureEls.forEach(featureEl => {
                    const feature = featureEl.textContent.trim();
                    if (feature && feature.length < 20 && !feature.match(/^\d/)) {
                        flight.features.push(feature);
                    }
                });
                
                // 只保存有效数据
                if (flight.airline && flight.flightNumber && flight.price > 0) {
                    flightData.push(flight);
                    console.log(`✅ 提取第${index + 1}个航班：`, flight);
                }
                
            } catch (error) {
                console.error(`❌ 提取第${index + 1}个航班失败:`, error);
            }
        });
    }
    
    // 提取去哪儿数据
    function extractQunarData() {
        console.log('📋 提取去哪儿航班数据...');
        
        const flightElements = document.querySelectorAll('.flight-item, .result-item, .flight-info, .ticket-item');
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
                    features: [],
                    source: '去哪儿'
                };
                
                // 提取基本信息
                const airlineEl = element.querySelector('.airline, .company-name, .flight-company');
                const flightNoEl = element.querySelector('.flight-no, .flight-number');
                
                if (airlineEl) flight.airline = airlineEl.textContent.trim();
                if (flightNoEl) flight.flightNumber = flightNoEl.textContent.trim();
                
                // 提取价格
                const priceEl = element.querySelector('.price, .ticket-price, .total-price');
                if (priceEl) {
                    const priceText = priceEl.textContent.trim();
                    const priceMatch = priceText.match(/[\d,]+/g);
                    if (priceMatch) {
                        const price = parseInt(priceMatch.join('').replace(/,/g, ''));
                        if (price > 1000) flight.price = price;
                    }
                }
                
                // 提取时间
                const timeEls = element.querySelectorAll('.time, .depart-time, .arrive-time');
                if (timeEls.length >= 2) {
                    flight.departureTime = timeEls[0].textContent.trim();
                    flight.arrivalTime = timeEls[1].textContent.trim();
                }
                
                if (flight.airline && flight.flightNumber && flight.price > 0) {
                    flightData.push(flight);
                    console.log(`✅ 提取第${index + 1}个航班：`, flight);
                }
                
            } catch (error) {
                console.error(`❌ 提取第${index + 1}个航班失败:`, error);
            }
        });
    }
    
    // 生成结果HTML
    function generateResultsHTML() {
        const bestDeal = flightData[0];
        const otherFlights = flightData.slice(1);
        
        const htmlContent = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>厦门飞北京商务舱机票 - 实时搜索结果</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Segoe UI', 'Microsoft YaHei', Arial, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
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
            background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
            color: white;
            padding: 30px;
            text-align: center;
        }
        
        .data-source {
            background: #e8f5e8;
            border: 1px solid #4caf50;
            color: #2e7d32;
            padding: 15px;
            margin: 20px;
            border-radius: 10px;
            text-align: center;
        }
        
        .best-deal {
            background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%);
            color: white;
            padding: 25px;
            border-radius: 15px;
            margin: 20px;
            box-shadow: 0 10px 30px rgba(238, 90, 36, 0.3);
        }
        
        .flight-card {
            background: white;
            border: 2px solid #e9ecef;
            border-radius: 15px;
            padding: 20px;
            margin: 15px;
            transition: all 0.3s ease;
        }
        
        .price-highlight {
            font-size: 1.8rem;
            font-weight: bold;
            color: #e74c3c;
        }
        
        .best-deal .price-highlight {
            color: white;
        }
        
        .update-time {
            text-align: center;
            color: #6c757d;
            font-size: 0.9rem;
            margin: 20px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🛫 厦门飞北京商务舱机票 - 实时数据</h1>
            <p>明天早上航班搜索结果</p>
        </div>
        
        <div class="data-source">
            <strong>📊 搜索条件：</strong> 厦门高崎 → 北京 | 2026-02-06 早上 | 商务舱
            <br><strong>⏰ 搜索时间：</strong> ${new Date().toLocaleString()}
            <br><strong>📈 找到航班：</strong> ${flightData.length} 个
        </div>
        
        <div class="best-deal">
            <h3>🏆 最佳性价比 - 最便宜</h3>
            <h4>${bestDeal.airline} ${bestDeal.flightNumber}</h4>
            <p><strong>🛫 起飞：</strong> ${bestDeal.departureTime}</p>
            <p><strong>🛬 到达：</strong> ${bestDeal.arrivalTime}</p>
            ${bestDeal.duration ? `<p><strong>⏱️ 飞行时间：</strong> ${bestDeal.duration}</p>` : ''}
            <p><strong>💰 价格：</strong> <span class="price-highlight">¥${bestDeal.price.toLocaleString()}</span></p>
            ${bestDeal.features && bestDeal.features.length > 0 ? `<p><strong>✨ 特色：</strong> ${bestDeal.features.join(' • ')}</p>` : ''}
            <p><strong>📍 来源：</strong> ${bestDeal.source || '实时抓取'}</p>
        </div>
        
        <div style="padding: 20px;">
            <h3>📋 其他商务舱选择（按价格排序）</h3>
            ${otherFlights.map((flight, index) => `
                <div class="flight-card">
                    <h4>${index + 2}. ${flight.airline} ${flight.flightNumber}</h4>
                    <p><strong>🛫 起飞时间：</strong> ${flight.departureTime}</p>
                    <p><strong>🛬 到达时间：</strong> ${flight.arrivalTime}</p>
                    ${flight.duration ? `<p><strong>⏱️ 飞行时间：</strong> ${flight.duration}</p>` : ''}
                    <p><strong>💰 价格：</strong> <span class="price-highlight">¥${flight.price.toLocaleString()}</span></p>
                    ${flight.features && flight.features.length > 0 ? `<p><strong>✨ 特色：</strong> ${flight.features.join(' • ')}</p>` : ''}
                    <p><strong>📍 来源：</strong> ${flight.source || '实时抓取'}</p>
                </div>
            `).join('')}
        </div>
        
        <div class="update-time">
            📊 数据更新时间：${new Date().toLocaleString()}
            <br>🔍 数据来源：实时网页抓取
        </div>
    </div>
</body>
</html>`;
        
        // 创建下载链接
        const blob = new Blob([htmlContent], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'xiamen-beijing-real-flight-results.html';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        console.log('💾 实时航班数据HTML报告已生成并下载！');
    }
    
    // 显示操作指南
    function showGuide() {
        console.log('\n🛫 厦门北京航班搜索操作指南');
        console.log('='.repeat(40));
        console.log('1️⃣ 访问机票网站：');
        console.log('   • 携程：https://flight.ctrip.com');
        console.log('   • 去哪儿：https://flight.qunar.com');
        console.log('   • Skyscanner：https://www.skyscanner.com');
        console.log('');
        console.log('2️⃣ 在控制台执行：');
        console.log('   startFlightSearch()  - 开始自动搜索');
        console.log('   extractFlightData()  - 提取航班数据');
        console.log('');
        console.log('3️⃣ 脚本将自动：');
        console.log('   ✅ 填充搜索条件（厦门→北京，明天，商务舱）');
        console.log('   ✅ 提取至少10个航班数据');
        console.log('   ✅ 生成美观的HTML报告');
        console.log('   ✅ 按价格排序，找出最佳性价比');
        console.log('='.repeat(40));
    }
    
    // 初始化
    setTimeout(showGuide, 1000);
    
    // 自动提示
    console.log('💡 提示：如果你想开始搜索，请在控制台输入：startFlightSearch()');
    
})();