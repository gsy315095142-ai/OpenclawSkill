import { quizData } from '../data/rulesData';

function QuizModes() {
  return (
    <div className="section-content">
      <h2>🎮 趣味竞猜玩法</h2>
      
      <h3>1️⃣ 元素之王</h3>
      <p><strong>问题：</strong>本局全场出现次数最多的元素球是哪一种？</p>
      <table className="data-table">
        <thead>
          <tr><th>选项</th><th>赔率</th><th>说明</th></tr>
        </thead>
        <tbody>
          {quizData.elementKing.map((item, i) => (
            <tr key={i}>
              <td className={item.option.includes('冰') ? 'element-冰' : item.option.includes('火') ? 'element-火' : item.option.includes('风') ? 'element-风' : ''}>
                {item.option}
              </td>
              <td className={item.odds === '1:8' ? 'highlight' : ''}>{item.odds}</td>
              <td>{item.desc}</td>
            </tr>
          ))}
        </tbody>
      </table>
      
      <h4>📊 赔率计算说明</h4>
      <div className="formula">
        <strong>赔率设计原理（基于概率）：</strong><br/><br/>
        • <strong>单一元素（1:3）：</strong>3种可能，理论概率33%，赔率设置1:3提供合理回报<br/><br/>
        • <strong>双元素并列（1:6）：</strong>3种组合，理论概率16.7%，赔率提升至1:6<br/><br/>
        • <strong>三者均衡（1:8）：</strong>1种可能，理论概率极低（约5%以下），高赔率1:8补偿风险
      </div>
      
      <h3>2️⃣ 精准总分 ⭐高难度</h3>
      <p><strong>问题：</strong>本局双方总得分会是多少分？</p>
      <div className="highlight-box">
        <strong>玩法说明：</strong><br/>
        • 玩家手动输入数字（如：输入"12"）<br/>
        • <strong>必须完全一致才算中奖</strong><br/>
        • 赔率：<strong>1:20</strong>（高难度高回报）
      </div>
      <p><strong>示例：</strong>玩家猜12分，实际红队7:蓝队5=12分 → <strong>中奖！</strong></p>
      
      <h3>3️⃣ 精准分差 ⭐高难度</h3>
      <p><strong>问题：</strong>本局双方得分相差多少分？</p>
      <div className="highlight-box">
        <strong>玩法说明：</strong><br/>
        • 玩家手动输入数字（如：输入"3"）<br/>
        • <strong>必须完全一致才算中奖</strong>（不区分谁高谁低）<br/>
        • 赔率：<strong>1:15</strong>
      </div>
      <p><strong>示例：</strong>玩家猜相差3分，实际红队8:蓝队5=3分 → <strong>中奖！</strong></p>
    </div>
  );
}

export default QuizModes;
