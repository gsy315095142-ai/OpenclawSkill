// ==UserScript==
// @name         真实航班数据抓取器 - 手动执行版
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  手动执行获取真实航班数据 - 厦门飞北京
// @author       AI Assistant
// @match        https://www.google.com/travel/flights*
// @match        https://flight.qunar.com/*
// @match        https://www.ctrip.com/*
// @match        https://www.skyscanner.com/*
// @grant        GM_download
// ==/UserScript==

(function() {
    'use strict';
    
    console.log('🛫 真实航班数据抓取器已启动！');
    console.log('📋 请按以下步骤操作：');
    console.log('1. 访问上述机票网站');
    console.log('2. 搜索：厦门→北京，明天，商务舱');
    console.log('3. 搜索结果出来后，在控制台运行：extractRealFlightData()');
    
    // 存储真实抓取的数据
    const realFlightData = [];
    
    // 主要抓取函数
    window.extractRealFlightData = function() {
        console.log('🔍 开始抓取真实航班数据...');
        realFlightData.length = 0; // 清空数组
        
        const currentSite = window.location.hostname;
        console.log('📍 当前网站：', currentSite);
        
        try {
            if (currentSite.includes('google.com')) {
                extractGoogleFlightsData();
            } else if (currentSite.includes('qunar.com')) {
                extractQunarData();
            } else if (currentSite.includes('ctrip.com')) {
                extractCtripData();
            } else if (currentSite.includes('skyscanner.com')) {
                extractSkyscannerData();
            } else {
                extractGenericData();
            }
            
            if (realFlightData.length > 0) {
                console.log('✅ 成功抓取', realFlightData.length, '个航班');
                generateRealReport();
            } else {
                console.log('⚠️ 未抓取到数据，尝试手动提取...');
                manualDataExtraction();
            }
            
        } catch (error) {
            console.error('❌ 抓取失败:', error);
            manualDataExtraction();
        }
    };
    
    // Google Flights 数据提取
    function extractGoogleFlightsData() {
        console.log('🎯 提取 Google Flights 数据...');
        
        // 等待页面完全加载
        setTimeout(() => {
            const flightElements = document.querySelectorAll('[data-result-id], .gws-flights-results-result, .flight-result, [jsaction*="flight"]');
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
                        source: 'Google Flights',
                        features: []
                    };
                    
                    // 提取航空公司
                    const airlineEl = element.querySelector('.gws-flights-results-airline, .airline-name, [data-airline]');
                    if (airlineEl) flight.airline = airlineEl.textContent.trim();
                    
                    // 提取航班号
                    const flightNoEl = element.querySelector('.gws-flights-results-flight-number, .flight-number, [data-flight-number]');
                    if (flightNoEl) flight.flightNumber = flightNoEl.textContent.trim();
                    
                    // 提取时间
                    const timeEls = element.querySelectorAll('.gws-flights-results-time, .departure-time, .arrival-time, [data-time]');
                    if (timeEls.length >= 2) {
                        flight.departureTime = timeEls[0].textContent.trim();
                        flight.arrivalTime = timeEls[1].textContent.trim();
                    }
                    
                    // 提取价格
                    const priceEl = element.querySelector('.gws-flights-results-price, .price, [data-price]');
                    if (priceEl) {
                        const priceText = priceEl.textContent.trim();
                        const priceMatch = priceText.match(/[\d,]+/g);
                        if (priceMatch) {
                            flight.price = parseInt(priceMatch.join('').replace(/,/g, ''));
                        }
                    }
                    
                    // 提取经停信息
                    const stopsEl = element.querySelector('.gws-flights-results-stops, .stops');
                    if (stopsEl) flight.stops = stopsEl.textContent.trim();
                    
                    // 提取飞行时间
                    const durationEl = element.querySelector('.gws-flights-results-duration, .duration');
                    if (durationEl) flight.duration = durationEl.textContent.trim();
                    
                    // 只保存有效数据
                    if (flight.airline && flight.price > 0) {
                        realFlightData.push(flight);
                        console.log(`✅ 提取第${realFlightData.length}个航班：${flight.airline} ${flight.flightNumber} - ¥${flight.price}`);
                    }
                    
                } catch (error) {
                    console.error(`❌ 提取第${index + 1}个航班失败:`, error);
                }
            });
            
        }, 3000);
    }
    
    // 去哪儿数据提取
    function extractQunarData() {
        console.log('🎯 提取去哪儿数据...');
        
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
                    stops: '',
                    source: '去哪儿'
                };
                
                // 航空公司
                const airlineEl = element.querySelector('.airline, .company-name, .flight-company');
                if (airlineEl) flight.airline = airlineEl.textContent.trim();
                
                // 航班号
                const flightNoEl = element.querySelector('.flight-no, .flight-number');
                if (flightNoEl) flight.flightNumber = flightNoEl.textContent.trim();
                
                // 价格
                const priceEl = element.querySelector('.price, .ticket-price, .total-price');
                if (priceEl) {
                    const priceText = priceEl.textContent.trim();
                    const priceMatch = priceText.match(/[\d,]+/g);
                    if (priceMatch) {
                        flight.price = parseInt(priceMatch.join('').replace(/,/g, ''));
                    }
                }
                
                // 时间
                const timeEls = element.querySelectorAll('.time, .depart-time, .arrive-time');
                if (timeEls.length >= 2) {
                    flight.departureTime = timeEls[0].textContent.trim();
                    flight.arrivalTime = timeEls[1].textContent.trim();
                }
                
                if (flight.airline && flight.price > 0) {
                    realFlightData.push(flight);
                    console.log(`✅ 提取第${realFlightData.length}个航班：${flight.airline} - ¥${flight.price}`);
                }
                
            } catch (error) {
                console.error(`❌ 提取第${index + 1}个航班失败:`, error);
            }
        });
    }
    
    // 携程数据提取
    function extractCtripData() {
        console.log('🎯 提取携程数据...');
        
        const flightElements = document.querySelectorAll('.flight-item, .flight-card, [data-test*="flight"]');
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
                    source: '携程'
                };
                
                // 提取基本信息
                const airlineEl = element.querySelector('.airline-name, .flight-company, [data-test*="airline"]');
                const flightNoEl = element.querySelector('.flight-number, .flight-no, [data-test*="flight-number"]');
                const priceEl = element.querySelector('.price, .ticket-price, [data-test*="price"]');
                
                if (airlineEl) flight.airline = airlineEl.textContent.trim();
                if (flightNoEl) flight.flightNumber = flightNoEl.textContent.trim();
                
                if (priceEl) {
                    const priceText = priceEl.textContent.trim();
                    const priceMatch = priceText.match(/[\d,]+/g);
                    if (priceMatch) {
                        flight.price = parseInt(priceMatch.join('').replace(/,/g, ''));
                    }
                }
                
                // 提取时间
                const timeEls = element.querySelectorAll('.time, .depart-time, .arrive-time, [data-test*="time"]');
                if (timeEls.length >= 2) {
                    flight.departureTime = timeEls[0].textContent.trim();
                    flight.arrivalTime = timeEls[1].textContent.trim();
                }
                
                if (flight.airline && flight.price > 0) {
                    realFlightData.push(flight);
                    console.log(`✅ 提取第${realFlightData.length}个航班：${flight.airline} ${flight.flightNumber} - ¥${flight.price}`);
                }
                
            } catch (error) {
                console.error(`❌ 提取第${index + 1}个航班失败:`, error);
            }
        });
    }
    
    // 生成真实数据报告
    function generateRealReport() {
        if (realFlightData.length === 0) {
            alert('⚠️ 没有航班数据，请先提取或手动添加数据');
            return;
        }
        
        // 按价格排序
        realFlightData.sort((a, b) => a.price - b.price);
        
        const bestDeal = realFlightData[0];
        const otherFlights = realFlightData.slice(1);
        
        const htmlContent = generateRealTimeHTML(realFlightData, bestDeal, otherFlights);
        
        // 下载报告
        const blob = new Blob([htmlContent], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `real-flight-data-${new Date().toISOString().split('T')[0]}.html`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        console.log('💾 真实航班数据报告已生成！');
        console.log('📊 统计：', {
            total: realFlightData.length,
            cheapest: bestDeal.price,
            mostExpensive: realFlightData[realFlightData.length-1].price,
            average: Math.round(realFlightData.reduce((sum, f) => sum + f.price, 0) / realFlightData.length)
        });
        
        alert(`✅ 真实航班数据报告生成完成！\n\n📊 共收录 ${realFlightData.length} 个航班\n💰 价格区间：¥${realFlightData[realFlightData.length-1].price} - ¥${bestDeal.price}\n🏆 最便宜：${bestDeal.airline} ${bestDeal.flightNumber} - ¥${bestDeal.price}\n\n报告已下载到本地！`);
    }
    
    // 操作指南
    window.showHelp = function() {
        console.log('\n🛫 真实航班数据抓取操作指南');
        console.log('='.repeat(50));
        console.log('💡 使用步骤：');
        console.log('1️⃣ 访问机票网站（Google Flights/去哪儿/携程/Skyscanner）');
        console.log('2️⃣ 搜索：厦门→北京，明天，商务舱');
        console.log('3️⃣ 等待搜索结果完全加载');
        console.log('4️⃣ 在控制台运行：extractRealFlightData()');
        console.log('5️⃣ 自动提取数据并生成报告');
        console.log('');
        console.log('🔧 如果自动提取失败：');
        console.log('• 运行：manualDataExtraction() 查看手动提取说明');
        console.log('• 或运行：addManualFlightData(航班对象) 手动添加');
        console.log('• 完成后运行：generateRealReport() 生成报告');
        console.log('='.repeat(50));
    };
    
    // 自动显示帮助
    setTimeout(showHelp, 2000);
    
})();