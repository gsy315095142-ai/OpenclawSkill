import { useState } from 'react';

function FlowChart() {
  const [activeStep, setActiveStep] = useState(1);

  const flowDetails = [
    {
      step: 1,
      icon: '💰',
      title: '获取竞猜币',
      subtitle: '多渠道积累',
      desc: '通过每日签到、分享好友、观看广告或充值获得竞猜币，为参与竞猜做准备。',
      methods: ['📅 每日签到 +100币', '📤 分享好友 +50币/次', '📺 观看广告 +30币/次', '💳 充值购买 100币=1元'],
      tip: '连续签到7天可额外获得500币奖励！',
      color: '#e94560'
    },
    {
      step: 2,
      icon: '🎮',
      title: '参与竞猜',
      subtitle: '赛前投注',
      desc: '比赛开始前，使用竞猜币对比赛结果进行投注。可选择基础胜负竞猜或趣味竞猜玩法。',
      methods: ['🏆 基础竞猜：猜胜负', '🔥 趣味竞猜：元素之王', '🎯 精准总分/分差'],
      tip: '段位差距越大，赔率差异越明显，低段胜高段回报丰厚！',
      color: '#ffd93d'
    },
    {
      step: 3,
      icon: '🎁',
      title: '打赏支持',
      subtitle: '赛中互动',
      desc: '比赛过程中，通过打赏功能物品为选手加油，同时获得实时弹幕展示和特效反馈。',
      methods: ['❤️ 免费点赞+弹幕', '🎉 彩带礼炮 100币', '🔥 火焰助威 300币', '👤 模型皮肤 800币'],
      tip: '大额打赏可获得红色特效弹幕，全场瞩目！',
      color: '#6bcb77'
    },
    {
      step: 4,
      icon: '🏆',
      title: '结果揭晓',
      subtitle: '结算奖励',
      desc: '比赛结束后，系统自动结算竞猜结果。猜中者按比例获得竞猜币奖励。',
      methods: ['✅ 猜中：本金×赔率', '❌ 未中：失去本金', '🎊 趣味猜中：高倍奖励'],
      tip: '精准总分猜中可获得20倍回报！',
      color: '#00bfff'
    },
    {
      step: 5,
      icon: '🛒',
      title: '兑换奖励',
      subtitle: '良性循环',
      desc: '使用累积的竞猜币兑换周边奖品，或继续参与下一轮竞猜，形成完整生态循环。',
      methods: ['🎁 兑换周边（贴纸/T恤/VR手柄）', '💎 继续投注', '🎨 购买皮肤道具'],
      tip: '20000币可兑换联名VR手柄！',
      color: '#ff6b6b'
    }
  ];

  const activeItem = flowDetails.find(item => item.step === activeStep) || flowDetails[0];

  return (
    <div className="section-content">
      <h2>🔄 竞猜系统完整流程</h2>
      <p className="flow-intro">点击左侧流程节点查看详细说明</p>
      
      {/* 竖向流程图 + 卡片并排布局 */}
      <div className="vertical-flow-container">
        {/* 左侧：流程节点 */}
        <div className="flow-steps-column">
          {flowDetails.map((item, i) => (
            <div 
              key={i} 
              className={`vertical-step ${activeStep === item.step ? 'active' : ''}`}
              onClick={() => setActiveStep(item.step)}
            >
              <div className="step-connector">
                <div className="step-dot" style={{ background: item.color }}>
                  <span className="step-num">{item.step}</span>
                </div>
                {i < flowDetails.length - 1 && <div className="step-line"></div>}
              </div>
              <div className="step-content">
                <div className="step-icon-large">{item.icon}</div>
                <div className="step-info">
                  <div className="step-title-vertical">{item.title}</div>
                  <div className="step-subtitle">{item.subtitle}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 右侧：详细卡片 */}
        <div className="flow-card-column">
          <div 
            className="detail-card"
            style={{ '--card-color': activeItem.color }}
          >
            <div className="detail-header">
              <span className="detail-step-badge" style={{ background: activeItem.color }}>
                步骤 {activeItem.step}
              </span>
              <span className="detail-icon">{activeItem.icon}</span>
            </div>
            
            <h3 className="detail-title">{activeItem.title}</h3>
            <span className="detail-subtitle">{activeItem.subtitle}</span>
            
            <p className="detail-desc">{activeItem.desc}</p>
            
            <div className="detail-section">
              <h4>📋 操作方式</h4>
              <div className="detail-methods">
                {activeItem.methods.map((m, j) => (
                  <span key={j} className="detail-method-tag">{m}</span>
                ))}
              </div>
            </div>
            
            <div className="detail-tip" style={{ borderLeftColor: activeItem.color }}>
              <span className="tip-icon-large">💡</span>
              <div className="tip-content">
                <strong>小贴士</strong>
                <p>{activeItem.tip}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 循环机制说明 */}
      <div className="cycle-section">
        <h3>🔄 循环生态机制</h3>
        <div className="cycle-diagram">
          <div className="cycle-center">
            <div className="cycle-icon">♻️</div>
            <div className="cycle-text">良性循环</div>
          </div>
          <div className="cycle-arrows">
            <div className="cycle-arrow arrow-1">
              <span>获取竞猜币</span>
              <div className="arrow-line"></div>
            </div>
            <div className="cycle-arrow arrow-2">
              <span>参与竞猜</span>
              <div className="arrow-line"></div>
            </div>
            <div className="cycle-arrow arrow-3">
              <span>打赏支持</span>
              <div className="arrow-line"></div>
            </div>
            <div className="cycle-arrow arrow-4">
              <span>获得回报</span>
              <div className="arrow-line"></div>
            </div>
          </div>
        </div>
        <div className="cycle-desc">
          <p><strong>生态价值：</strong>观众通过技巧（猜中竞猜）或活跃（签到/分享）积累竞猜币，</p>
          <p>支持喜爱的选手 → 选手表现更好 → 比赛更精彩 → 观众更积极参与 → <strong>形成良性生态循环</strong></p>
        </div>
      </div>

      {/* 关键数据一览 */}
      <div className="stats-section">
        <h3>📊 关键数据一览</h3>
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-number">7</div>
            <div className="stat-label">段位等级</div>
            <div className="stat-desc">从新手到王者</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">3</div>
            <div className="stat-label">竞猜类型</div>
            <div className="stat-desc">基础+趣味玩法</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">6</div>
            <div className="stat-label">打赏物品</div>
            <div className="stat-desc">彩带到皮肤</div>
          </div>
          <div className="stat-card highlight">
            <div className="stat-number">20x</div>
            <div className="stat-label">最高赔率</div>
            <div className="stat-desc">精准总分猜中</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FlowChart;
