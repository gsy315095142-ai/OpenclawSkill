import { useState } from 'react'
import './App.css'

// 导入页面组件
import Overview from './pages/Overview'
import TierSystem from './pages/TierSystem'
import OddsTable from './pages/OddsTable'
import QuizModes from './pages/QuizModes'
import RewardSystem from './pages/RewardSystem'
import Currency from './pages/Currency'
import FlowChart from './pages/FlowChart'

const tabs = [
  { id: 'overview', label: '📋 系统概览', component: Overview },
  { id: 'flow', label: '🔄 流程图', component: FlowChart },
  { id: 'tier', label: '🎯 段位积分', component: TierSystem },
  { id: 'odds', label: '💰 赔率对照', component: OddsTable },
  { id: 'quiz', label: '🎮 趣味竞猜', component: QuizModes },
  { id: 'reward', label: '🎁 打赏系统', component: RewardSystem },
  { id: 'currency', label: '💎 竞猜币', component: Currency },
]

function App() {
  const [activeTab, setActiveTab] = useState('overview')
  
  const ActiveComponent = tabs.find(t => t.id === activeTab)?.component || Overview

  return (
    <div className="container">
      <header>
        <h1>🏒 魔法冰球竞猜系统</h1>
        <p>完整规则文档 v5.0 | LumiSports Project</p>
      </header>
      
      <div className="nav-tabs">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`nav-tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      
      <main className="section active">
        <ActiveComponent />
      </main>
      
      <footer>
        <p>🏒 魔法冰球竞猜系统 | LumiSports Project</p>
        <p>版本 5.0 | 2026年</p>
      </footer>
    </div>
  )
}

export default App
