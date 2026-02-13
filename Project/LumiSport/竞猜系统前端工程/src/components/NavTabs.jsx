function NavTabs({ tabs, activeTab, onTabChange }) {
  return (
    <div className="nav-tabs">
      {tabs.map(tab => (
        <div
          key={tab.id}
          className={`nav-tab ${activeTab === tab.id ? 'active' : ''}`}
          onClick={() => onTabChange(tab.id)}
        >
          {tab.label}
        </div>
      ))}
    </div>
  )
}

export default NavTabs
