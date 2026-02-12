// ==UserScript==
// @name         厦门北京航班数据自动获取
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  自动获取厦门飞北京航班数据
// @author       AI Assistant
// @match        https://www.ctrip.com/*
// @match        https://flight.ctrip.com/*
// @match        https://flight.qunar.com/*
// @match        https://www.skyscanner.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    
    const flightData = [];
    
    // 等待页面加载完成
    function waitForPageLoad() {
        return new Promise(resolve => {
            if (document.readyState === 'complete') {
                resolve();
            } else {
                window.addEventListener('load', resolve);
            }
        });
    }
    
    // 自动填充搜索条件
    function autoFillSearchForm() {
        console.log('🤖 开始自动填充搜索条件...');
        
        // 等待一段时间让页面完全渲染
        setTimeout(() => {
            try {
                // 根据不同的网站选择不同的选择器
                const currentSite = window.location.hostname;
                
                if (currentSite.includes('ctrip.com')) {
                    fillCtripForm();
                } else if (currentSite.includes('qunar.com')) {
                    fillQunarForm();
                } else if (currentSite.includes('skyscanner.com')) {
                    fillSkyscannerForm();
                }
            } catch (error) {
                console.error('❌ 自动填充失败:', error);
                alert('自动填充失败，请手动输入搜索条件');
            }
        }, 3000);
    }
    
    // 携程表单填充
    function fillCtripForm() {
        console.log('🎯 填充携程表单...');
        
        // 出发城市
        const depCityInput = document.querySelector('input[placeholder*="出发"], input[data-testid*="departure"]');
        if (depCityInput) {
            depCityInput.value = '厦门';
            depCityInput.dispatchEvent(new Event('input', { bubbles: true }));
        }
        
        // 到达城市
        const arrCityInput = document.querySelector('input[placeholder*="到达"], input[data-testid*="arrival"]');
        if (arrCityInput) {
            arrCityInput.value = '北京';
            arrCityInput.dispatchEvent(new Event('input', { bubbles: true }));
        }
        
        // 设置明天的日期
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const dateStr = tomorrow.toISOString().split('T')[0];
        
        const dateInput = document.querySelector('input[type="date"], input[placeholder*="日期"]');
        if (dateInput) {
            dateInput.value = dateStr;
        }
        
        alert('✅ 搜索条件已自动填充！\n请手动选择商务舱，然后点击搜索按钮。\n搜索完成后，运行 extractFlightData() 提取数据。');
    }
    
    // 去哪儿表单填充
    function fillQunarForm() {
        console.log('🎯 填充去哪儿表单...');
        
        const fromInput = document.querySelector('input[placeholder*="出发"], #fromCity');
        const toInput = document.querySelector('input[placeholder*="到达"], #toCity');
        
        if (fromInput) {
            fromInput.value = '厦门';
            fromInput.dispatchEvent(new Event('input', { bubbles: true }));
        }
        
        if (toInput) {
            toInput.value = '北京';
            toInput.dispatchEvent(new Event('input', { bubbles: true }));
        }
        
        alert('✅ 搜索条件已自动填充！\n请手动选择商务舱，然后点击搜索按钮。\n搜索完成后，运行 extractFlightData() 提取数据。');
    }
    
    // Skyscanner表单填充
    function fillSkyscannerForm() {
        console.log('🎯 填充Skyscanner表单...');
        
        const fromInput = document.querySelector('input[placeholder*="From"], input[data-testid*="origin-input"]');
        const toInput = document.querySelector('input[placeholder*="To"], input[data-testid*="destination-input"]');
        
        if (fromInput) {
            fromInput.value = 'Xiamen';
            fromInput.dispatchEvent(new Event('input', { bubbles: true }));
        }
        
        if (toInput) {
            toInput.value = 'Beijing';
            toInput.dispatchEvent(new Event('input', { bubbles: true }));
        }
        
        alert('✅ 搜索条件已自动填充！\n请手动选择商务舱，然后点击搜索按钮。\n搜索完成后，运行 extractFlightData() 提取数据。');
    }
    
    // 提取航班数据
    window.extractFlightData = function() {
        console.log('🔍 开始提取航班数据...');
        flightData.length = 0; // 清空数组
        
        const currentSite = window.location.hostname;
        
        if (currentSite.includes('ctrip.com')) {
            extractCtripData();
        } else if (currentSite.includes('qunar.com')) {
            extractQunarData();
        } else if (currentSite.includes('skyscanner.com')) {
            extractSkyscannerData();
        }
        
        console.log('📊 提取完成！', flightData);
        displayResults();
        return flightData;
    };
    
    // 提取携程数据
    function extractCtripData() {
        console.log('📋 提取携程数据...');
        
        // 查找航班信息元素
        const flightElements = document.querySelectorAll('.flight-item, .flight-card, [data-testid*="flight"]');
        
        flightElements.forEach((element, index) => {
            try {
                const flight = {
                    airline: '',
                    flightNumber: '',
                    departureTime: '',
                    arrivalTime: '',
                    duration: '',
                    price: 0,
                    features: []
                };
                
                // 提取航空公司和航班号
                const airlineEl = element.querySelector('.airline-name, .flight-company, [data-testid*="airline"]');
                const flightNoEl = element.querySelector('.flight-number, .flight-no, [data-testid*="flight-number"]');
                
                if (airlineEl) flight.airline = airlineEl.textContent.trim();
                if (flightNoEl) flight.flightNumber = flightNoEl.textContent.trim();
                
                // 提取时间
                const timeEls = element.querySelectorAll('.time, .flight-time, [data-testid*="time"]');
                if (timeEls.length >= 2) {
                    flight.departureTime = timeEls[0].textContent.trim();
                    flight.arrivalTime = timeEls[1].textContent.trim();
                }
                
                // 提取价格
                const priceEl = element.querySelector('.price, .flight-price, [data-testid*="price"]');
                if (priceEl) {
                    const priceText = priceEl.textContent.trim();
                    const priceMatch = priceText.match(/\d+/g);
                    if (priceMatch) {
                        flight.price = parseInt(priceMatch.join(''));
                    }
                }
                
                // 提取航班特色
                const featureEls = element.querySelectorAll('.feature, .tag, .badge');
                featureEls.forEach(featureEl => {
                    const feature = featureEl.textContent.trim();
                    if (feature && feature.length < 20) {
                        flight.features.push(feature);
                    }
                });
                
                if (flight.airline && flight.flightNumber) {
                    flightData.push(flight);
                }
                
            } catch (error) {
                console.error(`❌ 提取第${index + 1}个航班数据失败:`, error);
            }
        });
    }
    
    // 提取去哪儿数据
    function extractQunarData() {
        console.log('📋 提取去哪儿数据...');
        
        const flightElements = document.querySelectorAll('.flight-item, .result-item, .flight-info');
        
        flightElements.forEach((element, index) => {
            try {
                const flight = {
                    airline: '',
                    flightNumber: '',
                    departureTime: '',
                    arrivalTime: '',
                    duration: '',
                    price: 0,
                    features: []
                };
                
                // 提取基本信息
                const airlineEl = element.querySelector('.airline, .company-name');
                const flightNoEl = element.querySelector('.flight-no, .flight-number');
                const priceEl = element.querySelector('.price, .ticket-price');
                
                if (airlineEl) flight.airline = airlineEl.textContent.trim();
                if (flightNoEl) flight.flightNumber = flightNoEl.textContent.trim();
                
                if (priceEl) {
                    const priceText = priceEl.textContent.trim();
                    const priceMatch = priceText.match(/\d+/g);
                    if (priceMatch) {
                        flight.price = parseInt(priceMatch.join(''));
                    }
                }
                
                // 提取时间信息
                const timeEls = element.querySelectorAll('.time, .depart-time, .arrive-time');
                if (timeEls.length >= 2) {
                    flight.departureTime = timeEls[0].textContent.trim();
                    flight.arrivalTime = timeEls[1].textContent.trim();
                }
                
                if (flight.airline && flight.flightNumber) {
                    flightData.push(flight);
                }
                
            } catch (error) {
                console.error(`❌ 提取第${index + 1}个航班数据失败:`, error);
            }
        });
    }
    
    // 提取Skyscanner数据
    function extractSkyscannerData() {
        console.log('📋 提取Skyscanner数据...');
        
        const flightElements = document.querySelectorAll('.FlightsTicket_container, .ticket-item, .flight-result');
        
        flightElements.forEach((element, index) => {
            try {
                const flight = {
                    airline: '',
                    flightNumber: '',
                    departureTime: '',
                    arrivalTime: '',
                    duration: '',
                    price: 0,
                    features: []
                };
                
                // 提取信息
                const airlineEl = element.querySelector('.airline-name, .carrier-name');
                const priceEl = element.querySelector('.price, .ticket-price');
                
                if (airlineEl) flight.airline = airlineEl.textContent.trim();
                
                if (priceEl) {
                    const priceText = priceEl.textContent.trim();
                    const priceMatch = priceText.match(/\d+/g);
                    if (priceMatch) {
                        flight.price = parseInt(priceMatch.join(''));
                    }
                }
                
                if (flight.airline) {
                    flightData.push(flight);
                }
                
            } catch (error) {
                console.error(`❌ 提取第${index + 1}个航班数据失败:`, error);
            }
        });
    }
    
    // 显示结果
    function displayResults() {
        console.log('📊 航班数据提取完成！');
        console.log('总共提取到', flightData.length, '个航班');
        
        if (flightData.length > 0) {
            // 按价格排序
            flightData.sort((a, b) => a.price - b.price);
            
            console.log('💰 最便宜航班：', flightData[0]);
            console.log('📋 所有航班数据：', flightData);
            
            // 生成HTML报告
            generateHTMLReport();
            
            alert(`✅ 数据提取完成！\n共提取到 ${flightData.length} 个航班\n最便宜：${flightData[0].airline} ${flightData[0].flightNumber} - ¥${flightData[0].price}\n\n请在控制台查看详细数据，或复制生成的HTML代码。`);
        } else {
            alert('⚠️ 未提取到航班数据，请确保：\n1. 已搜索到航班结果\n2. 页面已完全加载\n3. 重试 extractFlightData()');
        }
    }
    
    // 生成HTML报告
    function generateHTMLReport() {
        const bestDeal = flightData[0];
        const otherFlights = flightData.slice(1);
        
        const htmlContent = `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>厦门飞北京商务舱机票 - 实时数据搜索结果</title>
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
        
        .header h1 {
            font-size: 2.5rem;
            margin-bottom: 10px;
            font-weight: 300;
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
        
        .search-info {
            background: #f8f9fa;
            padding: 20px;
            text-align: center;
            border-bottom: 1px solid #e9ecef;
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
            <h1>🛫 厦门飞北京商务舱机票</h1>
            <p>实时数据搜索结果 - 多平台比价</p>
        </div>
        
        <div class="data-source">
            <strong>📊 数据来源：</strong> 实时抓取自各大机票平台
            <br><strong>⏰ 搜索时间：</strong> ${new Date().toLocaleString()}
            <br><strong>🎯 搜索条件：</strong> 厦门高崎 → 北京首都/大兴 | 2026-02-06 | 商务舱
        </div>
        
        <div class="search-info">
            <h2>🎯 搜索结果概览</h2>
            <p>共找到 <strong>${flightData.length}</strong> 个商务舱航班 | 价格区间：¥${flightData[flightData.length-1].price} - ¥${flightData[0].price}</p>
        </div>
        
        <div class="best-deal">
            <h3>🏆 最佳性价比推荐</h3>
            <h4>${bestDeal.airline} ${bestDeal.flightNumber}</h4>
            <p><strong>🛫 起飞时间：</strong> ${bestDeal.departureTime}</p>
            <p><strong>🛬 到达时间：</strong> ${bestDeal.arrivalTime}</p>
            ${bestDeal.duration ? `<p><strong>⏱️ 飞行时间：</strong> ${bestDeal.duration}</p>` : ''}
            <p><strong>💰 价格：</strong> <span class="price-highlight">¥${bestDeal.price.toLocaleString()}</span></p>
            ${bestDeal.features && bestDeal.features.length > 0 ? `<p><strong>✨ 特色：</strong> ${bestDeal.features.join(' • ')}</p>` : ''}
        </div>
        
        <div style="padding: 20px;">
            <h3>📋 其他商务舱选择</h3>
            ${otherFlights.map(flight => `
                <div class="flight-card">
                    <h4>${flight.airline} ${flight.flightNumber}</h4>
                    <p><strong>🛫 起飞：</strong> ${flight.departureTime}</p>
                    <p><strong>🛬 到达：</strong> ${flight.arrivalTime}</p>
                    ${flight.duration ? `<p><strong>⏱️ 飞行时间：</strong> ${flight.duration}</p>` : ''}
                    <p><strong>💰 价格：</strong> <span class="price-highlight">¥${flight.price.toLocaleString()}</span></p>
                    ${flight.features && flight.features.length > 0 ? `<p><strong>✨ 特色：</strong> ${flight.features.join(' • ')}</p>` : ''}
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
        a.download = 'xiamen-beijing-real-flights.html';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        console.log('💾 HTML报告已生成并下载！');
    }
    
    // 初始化
    waitForPageLoad().then(() => {
        console.log('✅ 航班数据提取脚本已加载！');
        console.log('📋 使用说明：');
        console.log('1. 访问机票搜索网站');
        console.log('2. 等待页面加载完成');
        console.log('3. 运行 autoFillSearchForm() 自动填充搜索条件');
        console.log('4. 手动选择商务舱并点击搜索');
        console.log('5. 搜索完成后运行 extractFlightData() 提取数据');
        
        // 自动运行（可选）
        // setTimeout(autoFillSearchForm, 2000);
    });
    
})();