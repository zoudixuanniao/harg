import React, { useState, useRef, useEffect } from 'react';
import {
  Camera, ChevronRight, RefreshCw, Heart, Download, Zap, Users,
  Briefcase, Brain, ThumbsUp, AlertCircle, MessageSquare, Share2,
  User, Calendar, ArrowUp, ArrowDown, Minus, X
} from 'lucide-react';

const questions = [
  { id: 1, text: '遇到突发状况时，我通常能保持冷静，优先思考解决对策而非发泄情绪。' },
  { id: 2, text: '当听到负面反馈或批评时，我能客观分析其合理性，而不是立刻感到被冒犯。' },
  { id: 3, text: '面对压力时，我有一套行之有效的自我调节机制（如运动、冥想、复盘）。' },
  { id: 4, text: '我能够坦然接受生命中的“不完美”，并懂得对过去无法改变的事情释怀。' },
  { id: 5, text: '我越来越觉得日常的平淡和稳定是一种幸福，不再盲目追求剧烈刺激。' },
  { id: 6, text: '我的情绪不再像过山车一样大起大落，大部分时间处于平稳状态。' },
  { id: 7, text: '深知改变别人是不可能的，所以在产生冲突时，我更倾向于调整自己。' },
  { id: 8, text: '我深知世界不是非黑即白的，能理解很多事情处于复杂的灰色地带。' },
  { id: 31, text: '我能敏锐地察觉自己身体发出的压力信号（如胃痛、失眠），并及时停下来休息。' },
  { id: 32, text: '面对突如其来的好运或赞赏，我能保持平常心，不会过度膨胀或患得患失。' },
  { id: 9, text: '我觉得朋友“在精不在多”，维持两三个知己比混迹广泛的社交圈更有意义。' },
  { id: 10, text: '周末或假期，我往往更享受安静的独处时光，而不是喧闹的社交聚会。' },
  { id: 11, text: '我的自我价值感不再过度依赖他人的夸奖、点赞或认可。' },
  { id: 12, text: '看到别人在社交媒体上展示优越的生活，我内心基本毫无波澜。' },
  { id: 13, text: '我能够毫无心理负担地拒绝别人不合理的要求，不再做“老好人”。' },
  { id: 14, text: '我已经很少为了迎合某个群体而委屈自己、假装合群了。' },
  { id: 15, text: '在与人争论时，即使我认为自己是对的，也懂得适时让步或闭嘴。' },
  { id: 16, text: '当面对比自己年轻或资历浅的人时，我会有意识地克制自己“好为人师”的冲动。' },
  { id: 33, text: '在群体聊天中，如果话题我不感兴趣，我敢于保持沉默，而不必硬凑热闹。' },
  { id: 34, text: '我开始欣赏那些与我观点不同的人，而不是急于反驳或改变他们。' },
  { id: 17, text: '相比于快消品，我更愿意投资那些耐用、有质感或能切实提升生活品质的物品。' },
  { id: 18, text: '我越来越觉得睡眠质量和身体健康比熬夜娱乐、游戏刷剧重要得多。' },
  { id: 19, text: '相比于虚无缥缈的梦想，我现在的目标大多与财务稳定、家庭健康有关。' },
  { id: 20, text: '遇到棘手的问题时，我的第一反应是自己想办法解决，而不是依赖他人。' },
  { id: 21, text: '面对不喜欢但必须做的事情，我能为了长远利益而耐心完成它。' },
  { id: 22, text: '我建立了一套适合自己的生活作息和边界，并且非常不喜欢被随意打破。' },
  { id: 23, text: '我认为承担责任不是一种束缚和负担，而是体现自我价值和担当的自然方式。' },
  { id: 24, text: '我发现自己现在买衣服或鞋子，更看重舒适度和面料，而不是款式是否花哨。' },
  { id: 35, text: '我会定期审视自己的财务状况，并为未来的风险做一定的储蓄准备。' },
  { id: 36, text: '即使没有外部监督，我也能按时完成对自己承诺的计划（如运动、学习）。' },
  { id: 25, text: '在处理复杂问题时，我越来越觉得“顺其自然”比“强求到底”更具智慧。' },
  { id: 26, text: '对于网络热词或新鲜事物，我不排斥，但也懒得盲目跟风。' },
  { id: 27, text: '回首往事，我越来越能够理解当初父母或长辈对我的一些看似不合理的苛求。' },
  { id: 28, text: '对于社会上的热点争议事件，我不轻易“站队”，而是习惯让子弹飞一会儿。' },
  { id: 29, text: '我彻底明白了“努力不一定马上成功”的现实，但依然愿意在能力范围内尽力而为。' },
  { id: 30, text: '我不再执着于向别人证明“我有多厉害”，而是更在意自己当下的感受是否舒服。' },
  { id: 37, text: '我不再执着于“寻找”宏大的人生意义，而是专注于“体验”当下的微小瞬间。' },
  { id: 38, text: '我能接受人与人之间的渐行渐远，认为这是一种自然的筛选过程。' },
  { id: 39, text: '面对未知的变化，我的第一反应是好奇，而不是恐惧或抵触。' },
  { id: 40, text: '我愿意花时间了解自己不熟悉的领域或文化，而不是固守已有的认知圈。' }
];

const calculateResult = (answers, actualAge) => {
  const totalScore = answers.reduce((a, b) => a + b, 0);
  let exactMentalAge = 0;

  if (totalScore <= 60) exactMentalAge = Math.floor(12 + ((totalScore - 40) / 20) * 8);
  else if (totalScore <= 80) exactMentalAge = Math.floor(21 + ((totalScore - 60) / 20) * 8);
  else if (totalScore <= 100) exactMentalAge = Math.floor(30 + ((totalScore - 80) / 20) * 19);
  else exactMentalAge = Math.floor(50 + ((totalScore - 100) / 20) * 35);

  const ageDiff = exactMentalAge - actualAge;
  let diffMeta = { type: '', text: '', icon: null, color: '' };

  if (ageDiff < -3) {
    diffMeta = {
      type: '减龄',
      text: `你的内心比实际年龄年轻 ${Math.abs(ageDiff)} 岁，保留着珍贵的纯真。`,
      icon: <ArrowDown className="w-5 h-5" />,
      color: 'text-green-500'
    };
  } else if (ageDiff > 3) {
    diffMeta = {
      type: '早熟',
      text: `你的内心比实际年龄成熟 ${Math.abs(ageDiff)} 岁，拥有超龄的稳重。`,
      icon: <ArrowUp className="w-5 h-5" />,
      color: 'text-purple-500'
    };
  } else {
    diffMeta = {
      type: '同频',
      text: '你的身心步调一致，处于非常舒适的平衡状态。',
      icon: <Minus className="w-5 h-5" />,
      color: 'text-blue-500'
    };
  }

  const getScore = (id) => {
    const idx = questions.findIndex((q) => q.id === id);
    return answers[idx] || 0;
  };

  const calcRate = (ids) => {
    const sum = ids.reduce((acc, id) => acc + getScore(id), 0);
    const max = ids.length * 3;
    return Math.round((sum / max) * 100);
  };

  const radarData = [
    { label: '情绪掌控', value: calcRate([1, 2, 6, 32]) },
    { label: '逆商自愈', value: calcRate([3, 4, 30, 31]) },
    { label: '社交独立', value: calcRate([9, 10, 14, 33]) },
    { label: '边界意识', value: calcRate([11, 13, 15, 34]) },
    { label: '务实程度', value: calcRate([17, 19, 24, 35]) },
    { label: '责任自律', value: calcRate([18, 21, 22, 23, 36]) },
    { label: '包容力', value: calcRate([7, 16, 27, 38, 40]) },
    { label: '认知通透', value: calcRate([5, 8, 25, 28, 37, 39]) }
  ];

  let resultMeta = {};
  if (totalScore <= 60) {
    resultMeta = {
      title: '赤诚热血的少年', tags: ['#热血', '#纯真', '#直率', '#行动派', '#理想主义'],
      desc: '你的内心如如同团燃烧的火焰，充满了对世界的好奇与热爱。岁月似乎从未在你心中留下痕迹，你依然保留着最珍贵的赤子之心。你爱憎分明，情绪外露，是朋友圈里的小太阳。虽然偶尔会因为冲动而受伤，但这种鲜活的生命力是成年世界最稀缺的宝藏。',
      colorTheme: 'from-orange-400 to-red-500', radarColor: '#F97316',
      strengths: ['无限的活力与创造力', '极具感染力的真诚', '敢于打破常规的勇气'],
      blindSpots: ['情绪容易大起大落', '缺乏耐心与长远规划', '容易轻信他人'],
      dimAnalysis: '在好奇心与生活热情维度接近满分，但在情绪掌控和务实程度上有待提升。记得保护好你的初心，但也要学会穿上铠甲。',
      social: { archetype: '孙策 / 江东小霸王', partner: '周瑜 (懂你的知音)', partnerDesc: '你需要一个能理解你疯狂想法，又能帮你兜底的人。', nemesis: '循规蹈矩的守成者', nemesisDesc: '他们过分保守和刻板的行事风格会让你感到窒息和抓狂。' },
      advice: '不要为了长大而丢掉你的光。试着在做决定前多停顿三秒，在这份热血中加入一点点冷静的智慧，你会变得无坚不摧。'
    };
  } else if (totalScore <= 80) {
    resultMeta = {
      title: '奋斗进取的青年', tags: ['#勇敢', '#成长', '#潜力股', '#探索', '#真实'],
      desc: '你正处于人生中最精彩的蜕变期，褪去了少年的稚气，开始披上成年的铠甲。你既保留了对理想的追求，又开始懂得脚踏实地的可贵。你在不断的试错中寻找自己的坐标，虽然偶尔会迷茫和焦虑，但这种向上的挣扎感，正是你生命力最旺盛的证明。',
      colorTheme: 'from-blue-400 to-cyan-500', radarColor: '#0EA5E9',
      strengths: ['超强的执行力与适应力', '勇于走出舒适区', '对自我成长的执着'],
      blindSpots: ['偶尔会陷入自我怀疑', '容易被同辈压力影响', '难以平衡理想与现实'],
      dimAnalysis: '社交独立与责任自律得分较高，但在认知通透度上仍有提升空间。你正在构建属于自己的价值体系，请多给自己一点时间。',
      social: { archetype: '赵云 / 常胜将军', partner: '刘备 (赏识你的伯乐)', partnerDesc: '你需要一个能指引方向，并给予你充分信任的领导者或导师。', nemesis: '精于算计的谋略家', nemesisDesc: '你讨厌虚伪和复杂的勾心斗角，这会让你觉得疲惫不堪。' },
      advice: '迷茫是成长的必经之路。不必急着向世界证明什么，专注当下的每一次积累。接受自己的平凡，然后去创造不平凡。'
    };
  } else if (totalScore <= 100) {
    resultMeta = {
      title: '从容成熟的中坚', tags: ['#稳重', '#深思熟虑', '#可靠', '#城府', '#掌控力'],
      desc: '经过岁月的洗礼，你的内心如磐石般稳固。你不再轻易被情绪左右，看问题深刻且全面。你是周围人的依靠，行事稳重，顾全大局。你更看重长远的价值而非眼前的利益，对于复杂的人际关系处理得游刃有余，生活节奏尽在你的掌握之中。',
      colorTheme: 'from-emerald-400 to-teal-600', radarColor: '#10B981',
      strengths: ['情绪管理大师', '极高的可靠性与责任感', '拥有全局视野与格局'],
      blindSpots: ['略显保守，缺乏冒险精神', '对他人的高标准要求', '不仅难以敞开心扉'],
      dimAnalysis: '情绪稳定、社交从容和责任担当都接近满分，唯独好奇心和生活热情有所下降，记得找回一些乐趣。',
      social: { archetype: '曹操 / 乱世枭雄', partner: '郭嘉 (鬼才谋士)', partnerDesc: '你欣赏他们的才华与洞察力，他们能为你提供独特的破局思路。', nemesis: '热血探索的少年', nemesisDesc: '少年的情绪化和冲动有时会挑战你的掌控欲，让你觉得不可理喻。' },
      advice: '过于稳重有时会显得缺乏情趣，不妨偶尔打破一下常规，给生活制造一点小惊喜。保持对新事物的好奇心，能让你看起来更年轻。'
    };
  } else {
    resultMeta = {
      title: '通透豁达的智者', tags: ['#通透', '#佛系', '#智慧', '#极简', '#达观'],
      desc: '行到水穷处，坐看云起时。你的心理境界已经超越了大部分同龄人。你看透了世事无常，内心拥有一种超然的宁静。外界的喧嚣很难再打扰你，你不再执着于输赢对错，而是更关注内心的平静与精神的丰盈。你是真正懂得生活真谛的人。',
      colorTheme: 'from-indigo-500 to-purple-600', radarColor: '#8B5CF6',
      strengths: ['极高的认知维度', '泰山崩于前而色不变', '包容一切的胸怀'],
      blindSpots: ['可能显得有些疏离冷漠', '缺乏改变现状的动力', '容易陷入虚无主义'],
      dimAnalysis: "认知通透与包容力满分，但现实掌控和务实程度可能因'佛系'心态而降低。出世入世，皆是修行。",
      social: { archetype: '诸葛亮 / 卧龙居士', partner: '姜维 (传承者)', partnerDesc: '你愿意将智慧传授给有悟性的人，在精神交流中获得满足。', nemesis: '急功近利的冒险家', nemesisDesc: '短视和浮躁是你最无法忍受的特质，你会本能地远离这类人。' },
      advice: '你的智慧是宝贵的财富，但不要让它成为你与世界隔离的墙。尝试多向下兼容，用你的光去照亮更多迷茫的人。'
    };
  }

  return { exactMentalAge, diffMeta, radarData, ...resultMeta };
};

const RadarChart = ({ data, color }) => {
  const size = 220;
  const center = size / 2;
  const radius = 80;
  const angleSlice = (Math.PI * 2) / 8;
  const getPoint = (value, index) => {
    const angle = index * angleSlice - Math.PI / 2;
    const r = (value / 100) * radius;
    return `${center + r * Math.cos(angle)},${center + r * Math.sin(angle)}`;
  };

  const grids = [33, 66, 100].map((level) => Array.from({ length: 8 }).map((_, i) => getPoint(level, i)).join(' '));
  const dataPoints = data.map((d, i) => getPoint(d.value, i)).join(' ');

  return (
    <div className="flex justify-center my-4 relative">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="overflow-visible">
        {grids.map((points, i) => <polygon key={i} points={points} fill={i === 2 ? '#F8FAFC' : 'none'} stroke="#E2E8F0" strokeWidth="1" />)}
        {Array.from({ length: 8 }).map((_, i) => {
          const [x, y] = getPoint(100, i).split(',');
          return <line key={i} x1={center} y1={center} x2={x} y2={y} stroke="#E2E8F0" strokeWidth="1" opacity="0.5" />;
        })}
        <polygon points={dataPoints} fill={color} fillOpacity="0.3" stroke={color} strokeWidth="2" />
        {data.map((d, i) => {
          const [x, y] = getPoint(d.value, i).split(',');
          return <circle key={i} cx={x} cy={y} r="3" fill="white" stroke={color} strokeWidth="2" />;
        })}
        {data.map((d, i) => {
          const angle = i * angleSlice - Math.PI / 2;
          const r = radius + 20;
          const x = center + r * Math.cos(angle);
          const y = center + r * Math.sin(angle);
          return <text key={i} x={x} y={y} textAnchor="middle" dominantBaseline="middle" className="text-[10px] fill-gray-400 font-medium">{d.label}</text>;
        })}
      </svg>
    </div>
  );
};

export default function App() {
  const [step, setStep] = useState('welcome');
  const [actualAge, setActualAge] = useState('');
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [resultData, setResultData] = useState(null);
  const [showQRCode, setShowQRCode] = useState(false);
  const resultRef = useRef(null);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
    script.async = true;
    document.body.appendChild(script);
    return () => document.body.removeChild(script);
  }, []);

  const startTest = () => {
    if (!actualAge || isNaN(actualAge) || actualAge < 5 || actualAge > 100) {
      alert('请输入一个有效的实际年龄（5-100岁）便于对比哦～');
      return;
    }
    setStep('quiz');
  };

  const handleAnswer = (score) => {
    const newAnswers = [...answers, score];
    setAnswers(newAnswers);
    if (currentQIndex < questions.length - 1) setTimeout(() => setCurrentQIndex(currentQIndex + 1), 150);
    else finishTest(newAnswers);
  };

  const finishTest = (finalAnswers) => {
    setStep('analyzing');
    const totalScore = finalAnswers.reduce((a, b) => a + b, 0);
    const result = calculateResult(finalAnswers, parseInt(actualAge, 10));
    setTimeout(() => {
      setResultData({ score: totalScore, ...result });
      setStep('result');
    }, 1500);
  };

  const saveImage = () => {
    if (window.html2canvas && resultRef.current) {
      window.html2canvas(resultRef.current, { useCORS: true, scale: 2, backgroundColor: null }).then((canvas) => {
        const link = document.createElement('a');
        link.download = `心理画像_${Date.now()}.png`;
        link.href = canvas.toDataURL();
        link.click();
      }).catch(() => alert('保存失败，请直接截图保存哦～'));
    } else alert('组件尚未加载完成，请稍后再试，或直接截图保存～');
  };

  const restart = () => { setStep('welcome'); setAnswers([]); setCurrentQIndex(0); setActualAge(''); setShowQRCode(false); };

  return <div className="min-h-screen bg-[#F8FAFC] font-sans text-gray-800 flex justify-center overflow-x-hidden"><div className="w-full max-w-md bg-white min-h-screen shadow-2xl relative flex flex-col">
    <div className="sticky top-0 z-50 bg-white/90 backdrop-blur-md px-4 py-3 flex items-center justify-between border-b border-gray-100"><span className="font-bold text-lg tracking-wide flex items-center gap-2"><Brain className="w-5 h-5 text-[#FF2442]" /> 心理时光机</span><div className="flex gap-2"><span className="bg-gray-100 px-2 py-1 rounded-full text-xs text-gray-500 font-medium">40题精准版</span></div></div>
    {step === 'welcome' && <div className="p-6 flex flex-col items-center justify-center flex-grow animate-fade-in"><div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mb-6 animate-bounce-slow"><Heart className="w-12 h-12 text-[#FF2442] fill-current" /></div><h1 className="text-3xl font-extrabold text-gray-900 mb-2 text-center">你的心，今年几岁？</h1><p className="text-gray-500 text-center mb-10 px-4 leading-relaxed"><span className="text-[#FF2442] font-bold">40道</span> 专业心理投射题<br />更精准揭示你潜意识里的<span className="text-[#FF2442] font-bold">真实年龄</span>与<span className="text-[#FF2442] font-bold">人格原型</span></p><div className="w-full bg-white border-2 border-gray-100 p-6 rounded-3xl mb-8 shadow-sm focus-within:border-[#FF2442] focus-within:shadow-md transition-all"><label className="block text-sm font-bold text-gray-500 mb-2 text-center flex items-center justify-center gap-1"><User className="w-4 h-4" /> 输入你的实际年龄</label><input type="number" value={actualAge} onChange={(e) => setActualAge(e.target.value)} placeholder="例如：25" className="w-full bg-transparent outline-none text-3xl font-bold text-center py-2 text-gray-800 placeholder:text-gray-200" /></div><button onClick={startTest} className="w-full bg-[#FF2442] text-white text-lg font-bold py-4 rounded-full shadow-lg shadow-red-200 active:scale-95 transition-transform flex items-center justify-center gap-2 hover:bg-[#E01F3A]">开始深度探索 <ChevronRight className="w-5 h-5" /></button></div>}
    {step === 'quiz' && <div className="p-6 h-full flex flex-col flex-grow"><div className="w-full bg-gray-100 h-2 rounded-full mb-8 overflow-hidden"><div className="h-full bg-[#FF2442] transition-all duration-300 ease-out" style={{ width: `${((currentQIndex + 1) / questions.length) * 100}%` }} /></div><div className="text-[#FF2442] font-bold text-xs mb-4 tracking-widest uppercase">Question {currentQIndex + 1} / {questions.length}</div><div className="flex-grow flex flex-col justify-center mb-10"><h2 className="text-2xl font-bold text-gray-800 leading-snug">{questions[currentQIndex].text}</h2></div><div className="flex flex-col gap-4 mt-auto mb-8"><button onClick={() => handleAnswer(3)} className="w-full py-4 px-6 rounded-2xl border border-[#FFEBEE] bg-[#FFF5F7] text-[#FF2442] font-bold text-left hover:bg-[#FF2442] hover:text-white transition-all active:scale-98 shadow-sm">A. 非常符合 / 是的 👍</button><button onClick={() => handleAnswer(2)} className="w-full py-4 px-6 rounded-2xl border border-gray-100 bg-white text-gray-600 font-medium text-left hover:border-gray-300 transition-all active:scale-98 shadow-sm">B. 看情况 / 偶尔 😐</button><button onClick={() => handleAnswer(1)} className="w-full py-4 px-6 rounded-2xl border border-gray-100 bg-white text-gray-600 font-medium text-left hover:border-gray-300 transition-all active:scale-98 shadow-sm">C. 完全不符 / 不是 🙅‍♂️</button></div></div>}
    {step === 'analyzing' && <div className="h-[calc(100vh-60px)] flex flex-col items-center justify-center p-8 text-center bg-white"><div className="w-16 h-16 border-4 border-gray-100 border-t-[#FF2442] rounded-full animate-spin mb-6" /><h3 className="text-xl font-bold text-gray-800 mb-2">正在绘制心理画像...</h3><p className="text-gray-500 text-sm animate-pulse">比对时间与记忆...</p></div>}
    {step === 'result' && resultData && <div className="flex-grow bg-gray-50 pb-24"><div ref={resultRef} className="bg-white pb-10"><div className="p-6 pt-10 pb-0"><div className="flex justify-center mb-4"><span className="px-3 py-1 bg-gray-100 text-gray-400 text-xs rounded-full font-bold tracking-widest">测试完成</span></div><h1 className="text-3xl font-black text-center text-gray-800 mb-8 font-serif italic">你的心理画像</h1><div className="flex flex-col gap-4"><div className="bg-white border-2 border-[#5B4DFF]/10 rounded-2xl p-6 flex flex-col items-center justify-center shadow-[0_4px_20px_rgba(91,77,255,0.08)] relative overflow-hidden"><span className="text-xs font-bold text-[#5B4DFF] mb-2 tracking-widest">心理年龄</span><div className="text-[#5B4DFF] text-6xl font-black leading-none font-mono">{resultData.exactMentalAge}<span className="text-xl ml-1">岁</span></div></div><div className="flex justify-center items-center -my-2 z-10"><div className={`bg-white border border-gray-100 rounded-full px-3 py-1 shadow-sm flex items-center gap-1 text-xs font-bold ${resultData.diffMeta.color}`}>{resultData.diffMeta.icon}{resultData.diffMeta.type}</div></div><div className="bg-white border-2 border-gray-100 rounded-2xl p-6 flex flex-col items-center justify-center shadow-sm"><span className="text-xs font-bold text-gray-400 mb-2 tracking-widest">实际年龄</span><div className="text-gray-600 text-5xl font-black leading-none font-mono">{actualAge}<span className="text-lg ml-1">岁</span></div></div></div><div className="mt-6 mb-8"><div className="bg-gradient-to-r from-emerald-100 to-green-50 border border-green-100 rounded-full p-4 text-center"><p className="text-emerald-800 text-sm font-bold">{resultData.diffMeta.text}</p></div></div></div><div className={`w-full py-8 px-6 bg-gradient-to-br ${resultData.colorTheme} text-white text-center relative overflow-hidden`}><h2 className="text-2xl font-black tracking-tight relative z-10">{resultData.title}</h2></div><div className="px-6 mt-8 relative z-20"><div className="bg-white rounded-2xl p-6 shadow-xl shadow-gray-100 mb-6 border border-gray-50"><div className="flex items-center gap-2 mb-3"><MessageSquare className="w-5 h-5 text-purple-500" /><h3 className="text-lg font-bold text-gray-800">性格深度解析</h3></div><p className="text-sm text-gray-600 leading-7 text-justify">{resultData.desc}</p></div><div className="mb-8"><h3 className="text-base font-bold text-gray-800 mb-3">关键词标签</h3><div className="flex flex-wrap gap-2">{resultData.tags.map((tag, i) => <span key={i} className="px-3 py-1.5 bg-gray-100 text-gray-600 text-xs font-bold rounded-lg">{tag}</span>)}</div></div><div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-8 flex flex-col items-center"><h3 className="text-sm font-bold text-gray-400 mb-2">维度分析</h3><RadarChart data={resultData.radarData} color={resultData.radarColor} /></div></div></div><div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4 pb-6 flex flex-col gap-3 z-50 max-w-md mx-auto shadow-[0_-5px_20px_rgba(0,0,0,0.05)]"><div className="flex gap-3"><button onClick={restart} className="flex-1 py-3 rounded-full border border-gray-200 font-bold text-gray-600 text-sm flex items-center justify-center gap-2 hover:bg-gray-50"><RefreshCw className="w-4 h-4" /> 重新测试</button><button onClick={() => setShowQRCode(true)} className="flex-1 py-3 rounded-full border border-[#FF2442] font-bold text-[#FF2442] text-sm flex items-center justify-center gap-2 bg-white"><Users className="w-4 h-4" /> 加入交流群</button></div><button onClick={saveImage} className="w-full py-3 rounded-full bg-[#5B4DFF] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-200 active:scale-95 transition-transform"><Share2 className="w-4 h-4" /> 分享结果</button></div></div>}

    {showQRCode && <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4 animate-fade-in" onClick={() => setShowQRCode(false)}><div className="bg-white rounded-2xl p-6 max-w-sm w-full relative" onClick={(e) => e.stopPropagation()}><button onClick={() => setShowQRCode(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"><X className="w-6 h-6" /></button><h3 className="text-xl font-bold text-center mb-4">扫码加入交流群</h3><div className="bg-gray-100 rounded-xl p-4 mb-4 flex items-center justify-center min-h-[200px]"><img src="image_628edb.png" onError={(e) => { e.target.style.display = 'none'; e.target.parentNode.innerHTML = '<div class="text-sm text-gray-400 text-center">请在代码中替换<br/>二维码图片路径</div>'; }} alt="群二维码" className="w-48 h-48 object-contain" /></div><p className="text-xs text-gray-500 text-center">长按识别二维码，寻找你的同频伙伴</p></div></div>}

    <style>{`@keyframes bounce-slow {0%, 100% { transform: translateY(-5%); }50% { transform: translateY(5%); }} .animate-bounce-slow {animation: bounce-slow 3s infinite ease-in-out;} @keyframes fade-in {from { opacity: 0; transform: translateY(10px); }to { opacity: 1; transform: translateY(0); }} .animate-fade-in {animation: fade-in 0.3s ease-out forwards;}`}</style>
  </div></div>;
}
