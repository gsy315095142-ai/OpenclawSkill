import { oddsData } from '../data/rulesData';

function OddsTable() {
  const tiers = ['新手', '青铜', '白银', '黄金', '钻石', '铂金', '王者'];
  
  return (
    <div className="section-content">
      <h2>💰 赔率对照表</h2>
      
      <h3>基础胜负竞猜</h3>
      <div className="formula">
        <strong>赔率格式：红方赔率:蓝方赔率</strong><br/><br/>
        段位修正系数：<br/>
        • 押高段位胜（vs低段位）：×0.6<br/>
        • 同段位对决：×1.0<br/>
        • 押低段位胜（vs高段位）：×1.8
      </div>
      
      <h3>完整赔率矩阵</h3>
      <p>格式：<strong>红方赔率:蓝方赔率</strong></p>
      <p className="hint">同段位：段位越高，赔率越高（高手对决更精彩）<br/>跨段位：弱者赔率高，强者赔率低风险小</p>
      
      <table className="data-table odds-matrix">
        <thead>
          <tr>
            <th>红方\蓝方</th>
            {tiers.map((t, i) => <th key={i}>{t}</th>)}
          </tr>
        </thead>
        <tbody>
          {oddsData.matrix.map((row, i) => (
            <tr key={i}>
              <th>{tiers[i]}({oddsData.tiers[i].match(/\d+\.\d+/)[0]})</th>
              {row.map((cell, j) => (
                <td key={j} className={i === j ? 'highlight' : ''}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      
      <div className="highlight-box">
        <strong>🎯 同段位赔率规则：</strong>段位越高，同段对决赔率越高！<br/>
        • 新手/青铜/白银同段：<strong>1.5:1.5</strong><br/>
        • 黄金/钻石同段：<strong>1.6:1.6</strong><br/>
        • 铂金同段：<strong>1.7:1.7</strong><br/>
        • 王者同段：<strong>1.8:1.8</strong>（高手对决最刺激！）<br/><br/>
        <strong>跨段位规则：</strong>弱者赔率高（新手2.0），强者赔率低（王者1.1）
      </div>
    </div>
  );
}

export default OddsTable;
