import { useState } from 'react'
import Header from './components/Header'
import NavTabs from './components/NavTabs'
import Overview from './pages/Overview'
import TierSystem from './pages/TierSystem'
import OddsTable from './pages/OddsTable'
import QuizGames from './pages/QuizGames'
import RewardSystem from './pages/RewardSystem'
import Currency from './pages/Currency'
import FlowChart from './pages/FlowChart'

const tabs = [
  { id: 'overview', label: '📋 系统概览' },
  { id: 'tier', label: '🎯 段位积分' },
  { id: 'odds', label: '💰 赔率对照' },
  { id: 'quiz', label: '🎮 趣味竞猜' },
  { id: 'reward', label: '🎁 打赏系统' },
  { id: 'currency', label: '💎 竞猜币' },
  { id: 'flow', label: '🔄 流程图' },
]

function App() {
  const [activeTab, setActiveTab] = useState('overview')

  const renderContent = () => {
    switch (activeTab) {
      case 'overview': return <Overview />
      case 'tier': return <TierSystem />
      case 'odds': return <OddsTable />
      case 'quiz': return <QuizGames />
      case 'reward': return <RewardSystem />
      case 'currency': return <Currency />
      case 'flow': return <FlowChart />
      default: return <Overview />
    }
  }

  return (
    <div className="container">
      <Header />
      <NavTabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
      {renderContent()}
      <footer>
        <p>🏒 魔法冰球竞猜系统 | LumiSports Project</p>
        <p>版本 5.0 | 2026年2月</p>
      </footer>
    </div>
  )
}

export default App
