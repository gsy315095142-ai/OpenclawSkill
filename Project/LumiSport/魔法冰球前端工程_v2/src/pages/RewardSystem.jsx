import { rewardData } from '../data/rulesData';

function RewardSystem() {
  return (
    <div className="section-content">
      <h2>🎁 打赏系统</h2>
      
      <h3>1️⃣ 点赞 + 实时弹幕</h3>
      <div className="highlight-box">
        <strong>免费点赞：</strong>点击 ❤️ 按钮为选手加油<br/>
        <strong>弹幕留言：</strong>点赞时可输入一句话（最多20字）<br/>
        <strong>实时投屏：</strong>弹幕同步显示在大屏幕上
      </div>
      
      <h4>弹幕样式</h4>
      <table className="data-table">
        <thead>
          <tr><th>用户类型</th><th>弹幕颜色</th><th>样式</th></tr>
        </thead>
        <tbody>
          {rewardData.danmakuStyles.map((s, i) => (
            <tr key={i}><td>{s.type}</td><td>{s.color}</td><td>{s.style}</td></tr>
          ))}
        </tbody>
      </table>
      
      <h3>2️⃣ 功能物品打赏</h3>
      <table className="data-table">
        <thead>
          <tr><th>物品</th><th>价格</th><th>效果</th><th>使用时机</th></tr>
        </thead>
        <tbody>
          {rewardData.items.map((item, i) => (
            <tr key={i}>
              <td>{item.name}</td>
              <td>{item.price}</td>
              <td>{item.effect}</td>
              <td>{item.timing}</td>
            </tr>
          ))}
        </tbody>
      </table>
      
      <h3>3️⃣ 模型皮肤系统</h3>
      <p><strong>皮肤有效期：</strong>24小时（从首次装备开始计算）</p>
      <p><strong>使用规则：</strong></p>
      <ul>
        <li>可同时拥有多个皮肤，但同一时间只能装备1个</li>
        <li>切换皮肤费用：<strong>100竞猜币</strong></li>
        <li>有效期内所有比赛可用，不局限于单局</li>
      </ul>
      
      <h4>皮肤类型</h4>
      <div className="skin-grid">
        {rewardData.skins.map((skin, i) => (
          <div className="skin-card" key={i}>
            <div className="emoji">{skin.emoji}</div>
            <div className="name">{skin.name}</div>
            <small>{skin.desc}</small>
          </div>
        ))}
      </div>
    </div>
  );
}

export default RewardSystem;
