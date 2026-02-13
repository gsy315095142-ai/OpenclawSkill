import { currencyData } from '../data/rulesData';

function Currency() {
  return (
    <div className="section-content">
      <h2>💎 竞猜币系统</h2>
      
      <h3>获取途径</h3>
      <table className="data-table">
        <thead>
          <tr><th>方式</th><th>获得数量</th><th>每日限制</th></tr>
        </thead>
        <tbody>
          {currencyData.sources.map((s, i) => (
            <tr key={i}><td>{s.method}</td><td>{s.amount}</td><td>{s.limit}</td></tr>
          ))}
        </tbody>
      </table>
      
      <h3>兑换奖励</h3>
      <h4>周边奖励</h4>
      <table className="data-table">
        <thead>
          <tr><th>奖品</th><th>所需竞猜币</th></tr>
        </thead>
        <tbody>
          {currencyData.rewards.map((r, i) => (
            <tr key={i}><td>{r.prize}</td><td>{r.cost}</td></tr>
          ))}
        </tbody>
      </table>
      
      <h4>打赏功能物品</h4>
      <p>可兑换所有打赏物品（彩带礼炮、能量饮料、火焰助威、冰霜守护、全场聚光灯、模型皮肤）</p>
      
      <div className="highlight-box">
        <strong>💡 经济循环：</strong><br/>
        获取竞猜币 → 参与竞猜/兑换打赏物品 → 支持选手 → 选手表现更好 → 观众更积极参与 → 生态良性循环
      </div>
    </div>
  );
}

export default Currency;
