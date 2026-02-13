import { tierData } from '../data/rulesData';

function TierSystem() {
  return (
    <div className="section-content">
      <h2>🎯 段位积分系统</h2>
      
      <h3>段位划分（每500分一个段位）</h3>
      <table className="data-table tier-table">
        <thead>
          <tr><th>段位</th><th>积分区间</th><th>标识</th></tr>
        </thead>
        <tbody>
          {tierData.tiers.map((t, i) => (
            <tr key={i}>
              <td className={t.class}>{t.name}</td>
              <td>{t.range}</td>
              <td>{t.icon}</td>
            </tr>
          ))}
        </tbody>
      </table>
      
      <h3>积分计算规则</h3>
      <table className="data-table">
        <thead>
          <tr><th>段位差距</th><th>获胜得分</th><th>失败扣分</th></tr>
        </thead>
        <tbody>
          {tierData.scoreRules.map((r, i) => (
            <tr key={i}>
              <td>{r.gap}</td>
              <td className="win">{r.win}</td>
              <td className={r.lose.includes('0分') ? 'no-lose' : 'lose'}>{r.lose}</td>
            </tr>
          ))}
        </tbody>
      </table>
      
      <h3>📊 晋级规则：10场胜利即可晋级</h3>
      <div className="highlight-box">
        <strong>🎯 核心设计：</strong>如果玩家累计获得<strong>10场胜利</strong>（同段位），即可晋级到下一个段位！<br/><br/>
        每场胜利获得<strong>+50分</strong>，500分 ÷ 50分 = <strong>10场胜利</strong>（不需要连胜，累计即可）
      </div>
      
      <table className="data-table">
        <thead>
          <tr><th>当前段位</th><th>目标段位</th><th>所需积分</th><th>所需胜场（同段位）</th></tr>
        </thead>
        <tbody>
          {tierData.promotionRules.map((r, i) => (
            <tr key={i}>
              <td className={`tier-${r.current.slice(0,2)}`}>{r.current}</td>
              <td className={`tier-${r.target.slice(0,2)}`}>{r.target}</td>
              <td>{r.points}</td>
              <td>{r.wins}</td>
            </tr>
          ))}
        </tbody>
      </table>
      
      <div className="example-box">
        <strong>💡 示例说明：</strong><br/>
        小明是<strong>新手魔法师</strong>（0分），挑战同段位对手：<br/>
        • 第1场胜利：+50分（总分50分）<br/>
        • 第5场胜利：+50分（总分250分）<br/>
        • 第10场胜利：+50分（总分500分）→ <strong>晋级青铜魔法师！</strong><br/><br/>
        <em>注意：中间可以有失败，累计10场胜利即可，不需要连胜。</em>
      </div>
      
      <h3>🏆 王者魔法师</h3>
      <div className="highlight-box">
        <strong>当积分达到3000分（王者魔法师）后：</strong><br/><br/>
        • 不再显示段位名称，改为显示<strong>全国排名</strong><br/>
        • 排名根据积分高低实时更新<br/>
        • 显示格式：王者魔法师 · 全国第127名<br/>
        • 积分无上限，可继续累积提升排名
      </div>
    </div>
  );
}

export default TierSystem;
