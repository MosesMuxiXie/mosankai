(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory();else root.Neuro46Data=factory();})(typeof window==='object'?window:globalThis,function(){
'use strict';
const sources={
 N4:{title:'Chapter 4_ Action Potential .pdf',note:'6 页课堂手写笔记，已逐页核读'},
 N5:{title:'Chapter 5 Synaptic Transmission  .pdf',note:'12 页课堂手写笔记，已逐页核读'},
 N6:{title:'Chapter 6_ Neurotransmitter System.pdf',note:'6 页课堂手写笔记，已逐页核读'},
 K4:{title:'Chapter 4: Action Potential · Kahoot',note:'20 题；重复内容不作独立频次'},
 K5A:{title:'Chapter 5: Synaptic Transmission Part 1 · Kahoot',note:'18 题'},
 K5B:{title:'Chapter 5: Synaptic Transmission Part 2 · Kahoot',note:'18 题'},
 K6:{title:'Chapter 6 Neurotransmitter System Part 1 · Kahoot',note:'13 题'},
 EX:{title:'Neuroscience Mid-Term Va.pdf',note:'2025–2026 原卷：30 道 MCQ、5 道 bonus、10 道 FRQ'},
 MS:{title:'Neuroscience Mid-Term FRQ MS.docx',note:'参考评分标准；与教材冲突处单独校准'},
 B:{title:'Neuroscience: Exploring the Brain (2015)',note:'以下页码均为 PDF 阅读器页码；第 4／5／6 章起于 125／153／187',href:'/studyguides/neuroscience/sources/Neuroscience_%20Exploring%20the%20Brain%20(2015).pdf'},
 R:{title:'Brown et al. (2006) · Neonicotinoid actions on native insect nAChRs',note:'原始膜片钳研究：新烟碱类在昆虫 nAChRs 的激动作用，用于核对 N6 p.4 药理简写',href:'https://pubmed.ncbi.nlm.nih.gov/16899070/'}
};
const topics=[];
function T(ch,n,title,en,lead,body,mcqTip,frqTip,refs,priority=1){topics.push({id:`c${ch}-t${n}`,chapter:ch,title,en,lead,body,mcqTip,frqTip,sources:refs,priority});}
T(4,1,'读懂动作电位曲线','Phases of an action potential','先看哪个离子的电导变化，再解释 Vm 为什么向哪个平衡电位移动。',[
 '静息时细胞内相对外负，课堂常用 −65 至 −70 mV。K⁺漏通道电导通常占优势；Na⁺／K⁺泵长期维持浓度梯度，不是每次下降支的直接发动机。',
 '达到阈值后，电压门控 Na⁺通道迅速开放，Na⁺内流构成正反馈。上升支去极化；Vm 超过 0 的区段叫 overshoot，不等于整段上升支。',
 'Na⁺通道失活，同时延迟整流 K⁺通道开放，K⁺外流使膜复极。K⁺电导仍高时 Vm 接近 E_K，形成 undershoot；随后 K⁺通道关闭，膜回到静息附近。',
 '约 −55 mV 阈值、+30 至 +40 mV 峰值和约 1 至 2 ms 时程是课堂示例，不是所有细胞与物种的固定常数。'
],'曲线题同时标清 phase、ion flux 和 relative conductance；不要把峰值解释为 E_K。','按“通道状态→g_Na／g_K→离子方向→Vm 变化”逐阶段写，比较静息与峰值时要说相对电导。',[['N4','p.1、3–4'],['EX','MCQ 2、9、31；FRQ 8'],['B','PDF p.126–143']]);
T(4,2,'Na⁺通道的三种状态','Closed, open and inactivated','关闭而可激活，和失活而暂不可激活，是两种不同状态。',[
 '静息时 Na⁺通道关闭但可被阈值去极化激活；激活很快，随后即使膜仍去极化也会失活。复极使失活解除，通道恢复为关闭但可用。',
 '延迟整流 K⁺通道相对较慢开放，持续时间较长。若只说“Na 通道关闭”，必须补出是失活还是关闭可用，否则解释不了不应期。',
 '典型电压门控 Na⁺通道的成孔 α 链是一条多肽上的四个重复结构域，不是四条独立 α 多肽。典型电压门控 K⁺通道可由四个成孔亚基组成；不要互套结构。'
],'“再加大刺激能否重新打开”是区分失活与普通关闭的线索。','用 closed → open → inactivated → closed/available 的序列，并把复极写在恢复步骤。',[['N4','p.3–4'],['K4','Q15、17'],['EX','bonus 33'],['B','PDF p.135–142']]);
T(4,3,'绝对与相对不应期','Refractory periods','不应期既限制放电频率，也帮助解释正常传播的方向。',[
 '绝对不应期的关键是足够多的 Na⁺通道处于失活状态，强刺激也不能立即产生第二个正常动作电位。不能把整段不应期粗略等同于“所有 Na⁺电导恒为零”。',
 '相对不应期时部分 Na⁺通道恢复，但 K⁺电导仍较高、膜可能超极化；更强刺激才可能达到阈值。',
 '若给定绝对不应期为 1 ms，理想上限约为 1/0.001 s = 1000 Hz。实际持续频率还受适应、K⁺电流和细胞类型限制，1000 Hz 不是所有神经元的正常频率。'
],'先把毫秒换成秒，再求频率；absolute 与 relative 不能互换。','原因写 Na channel inactivation；相对期再补 elevated K conductance 和 higher threshold requirement。',[['N4','p.4'],['K4','Q9–10、16'],['EX','bonus 33'],['B','PDF p.129、140–143']]);
T(4,4,'全或无与频率编码','All or none and neural coding','更强的持续输入，通常增加 spike 数量或频率，而不是把单个 spike 变大。',[
 '对同一神经元、相近条件下的正常动作电位，阈下不触发再生性 spike；达阈后产生完整 spike。这里的“全或无”不表示不同神经元有完全相同波形。',
 '强度可以通过放电频率、时间模式和群体活动编码。更强持续去极化常提高发放率，但在极端持续去极化下也可能发生去极化阻滞，因此不用“任何情况下都更快”。',
 'PSP 是可分级、可衰减、可总和的信号；AP 是沿轴突再生传播的信号。输入的大小与输出的 spike 频率属于不同层级。'
],'排除“刺激越强，AP amplitude 越大”；不要把 PSP 总和说成 AP 振幅相加。','先限定 same neuron and conditions，再写阈值与 Na⁺正反馈，最后用 frequency/pattern 解释强度编码。',[['N4','p.1–2'],['K4','Q2–3、7–8'],['EX','MCQ 27；FRQ 9'],['B','PDF p.126–130']]);
T(4,5,'电流由电导和驱动力共同决定','I = g(Vm − Eion)','通道开得多，不代表任意时刻电流都最大。',[
 '按约定的膜电流正负号，I_ion = g_ion(Vm − E_ion)，外向正电荷电流记正。Na⁺在 Vm 低于 E_Na 时的电流通常为负，即内向电流。',
 '若 g = 0，即使驱动力很大也无该通道电流；若 Vm = E_ion，即使通道开放也无净电流。离子仍可双向随机运动，净通量为零。',
 '上升支中 g_Na 增大，但 Vm 越靠近 E_Na，Na⁺驱动力越小。最大 Na⁺内向电流取决于两者乘积，不能直接把峰值电压当作最大内流时刻。',
 '电导 g = 1/R。固定输入电流时，膜电阻降低会使电压响应变小，这条关系会在分流抑制中再次使用。'
],'图上同时比较 g 和 Vm − E；电流符号与具体离子的移动方向要结合电荷判断。','写公式、规定符号、代入方向，再解释 zero conductance 与 zero driving force 两种零电流情形。',[['N4','p.1、4'],['K4','Q11'],['EX','MCQ 16、26'],['B','PDF p.132–134']]);
T(4,6,'用 Nernst 预测曲线变化','Equilibrium potentials','改变浓度梯度先改变 E_ion，再由当时占优势的电导影响 Vm。',[
 'E_ion = (RT/zF) ln([ion]_out/[ion]_in)。对 K⁺，增加细胞外浓度使 E_K 变得较不负；降低外 K⁺或增加内 K⁺使 E_K 更负。',
 '静息与后超极化常更受 K⁺影响；Na⁺梯度对 AP 峰值影响更直接。若只改变 E_K，简化模型下 AP 峰值近似不变，不能机械套用“所有阶段都同方向”。',
 '对阴离子 z 为负，浓度比的结论反向。例如 E_Z− 为正时通常意味着 [Z−]_in > [Z−]_out。先写价态再判断。',
 '神经活动可局部提高外 K⁺；星形胶质细胞摄取与空间缓冲、BBB 对血液与脑细胞外液交换的控制有助稳定环境。ATP 停止后泵不能维持梯度，梯度逐渐耗散。'
],'K⁺改动优先看 resting/undershoot；Na⁺改动优先看 peak。分清直接效应与后续膜状态。','使用 concentration ratio → E_K/E_Na → dominant conductance → waveform 的完整推理链。',[['N4','p.1、4'],['EX','MCQ 2、4、7、9、14、19、21、24；bonus 31–32；FRQ 4、9'],['B','PDF p.110–120、132–143']]);
T(4,7,'传导速度与起始区','Propagation and saltatory conduction','轴突更长会增加到达时间；更粗或髓鞘化才通常改变传导速度。',[
 '局部电流使相邻可兴奋膜达阈，再生新的 AP，因此 AP 幅度不会像被动 PSP 那样沿途指数衰减。正常起始区常在轴突初始段，那里 Na⁺通道密度较高。',
 '直径增大降低轴向电阻，有利于电流传播。髓鞘提高膜电阻并降低膜电容，让节间被动电流传得更远、更快；AP 在郎飞结重新产生。',
 '跳跃传导不是 Na⁺从第一个结一路跳到末端，也不是 AP 穿过髓鞘时幅度变大。正常向前传播与后方膜的不应状态有关；人工刺激轴突中部可以产生双向传播。',
 'v 不变时，到达时间 t = distance/v；单独增加轴突总长度不使局部传导速度更快。感觉神经元也可在近感受器的末梢区域起始 spike。'
],'区分 speed 与 latency；节点有再生，节间主要被动传播。','把 myelin 的 R_m↑、C_m↓与节点再生连起来；不要只写“跳所以快”。',[['N4','p.5'],['EX','MCQ 17、22；bonus 35'],['B','PDF p.144–150']]);
T(4,8,'毒素与麻醉的机制定位','Channel interventions','相同的瘫痪结果，可以来自不同的通道干预。',[
 'TTX 与 saxitoxin 阻断敏感的电压门控 Na⁺通道，削弱 Na⁺内流与 AP 传播。阻断信号不等于把靶组织直接“摧毁”。',
 'Batrachotoxin 使 Na⁺通道异常维持活性，持续去极化会破坏正常重复放电。它不是靠与 TTX 相同的孔道阻断方式起作用。',
 '局部麻醉剂如 lidocaine 抑制 Na⁺通道介导的传导。答题先辨认靶点，再预测电流和信号，不把治疗或毒理例子延伸为使用建议。'
],'区分 block opening/conduction 与 prevent normal inactivation；同一表型不能推出同一机制。','按 target → ion current → AP → transmission 四层解释，并标出与对照的区别。',[['N4','p.4–5'],['K4','Q13、20'],['EX','MCQ 6'],['B','PDF p.141–143']]);
T(4,9,'电压钳与膜片钳','Voltage clamp and patch clamp','要问电流，就固定电压；要看单通道，就缩小膜片。',[
 '电压钳控制膜电位并测量为维持该电位所需的电流；配合离子替换或通道阻断，可以分离 Na⁺与 K⁺电流的时间进程。Hodgkin 与 Huxley 使用乌贼巨轴突建立机制模型。',
 '膜片钳以玻璃微电极在小片膜上形成高阻封接，可以记录单个或少量通道的开闭电流，也有 whole-cell 等模式。',
 '普通记录 Vm 随时间变化可描述 spike 波形，但单凭波形不足以测量某一个通道的电流。实验问题需要把 manipulated variable 和 measured variable 分开。'
],'voltage clamp 不等于固定电流；patch clamp 不限于单通道模式。','写清控制 Vm、记录 I、对照条件和能支持的结论，不把相关变化说成唯一分子原因。',[['N4','p.3、6'],['K4','Q12、14'],['B','PDF p.134–140']],2);
T(4,10,'光遗传的输入与输出','Optogenetic control','先说明蛋白和光，再预测离子变化，而不是背“光会兴奋”。',[
 '经典 ChR2 是蓝光激活的非选择性阳离子通道，在常见静息条件下产生净内向电流并去极化；课堂 Na⁺内流是简化，不代表只通 Na⁺。',
 '经典 halorhodopsin 是黄光激活、向细胞内运输 Cl⁻的泵，通常产生超极化与抑制。它是主动泵，不是普通配体门控 Cl⁻通道。',
 '光反应取决于表达了什么 opsin、照明与细胞条件；没有表达的细胞是重要对照。光遗传可以提供细胞类型选择性，不能笼统说永远无法刺激单个细胞。',
 '课堂页上的当年奖项标记不参与考点依据；本指南仅复习可核实的分子机制。'
],'ChR2＋blue＋cation current；halorhodopsin＋yellow＋inward Cl⁻ pump。','解释表达、光刺激、预期 Vm 和阴性对照；用结果判断蛋白功能。',[['N4','p.2'],['N6','p.2'],['K4','Q18–19'],['B','PDF p.130–131']],2);
T(5,1,'电突触的结构与用途','Electrical synapses','连接的是细胞内液，传递的是离子电流。',[
 '电突触通过 gap junction 使两个细胞直接电耦联。每个 connexon 通常由 6 个 connexin 构成，两侧各一个 connexon 对接成通道。',
 '直接电流传递的延迟很短，常可双向传递；有整流性例外。它可传递阈下电位变化，不要求每次都在后细胞触发 AP。',
 '同步邻近神经元活动是重要功能。化学突触依赖递质释放、扩散和受体，通常有方向性与更明显延迟，但两者都能改变突触后电位。'
],'6 connexins → 1 connexon；2 connexons → paired channel；“传离子”与“同步”都是真实功能。','按 structure、signal、delay、direction 四个共同维度比较；“通常”比绝对措辞准确。',[['N5','p.1–2'],['K5A','Q3–6'],['EX','MCQ 11、30；FRQ 3'],['B','PDF p.155–160']]);
T(5,2,'Loewi 的实验逻辑','Chemical transmission evidence','第二颗心的变化是可转移化学物质存在的证据。',[
 '刺激第一颗蛙心的迷走神经，心率下降；把浴液转移到第二颗未被直接刺激的心，第二颗心也减慢。',
 '可转移浴液而非两心直接电连接，支持一种可扩散化学信号介导减慢。这一物质后来被认作 ACh。实验不说明所有突触都是化学突触。',
 '对照可用未刺激时的浴液、相同转移流程，以及受体阻断；区分现象、推断与分子鉴定是实验 FRQ 的得分关键。'
],'第一颗心受刺激、第二颗心收浴液；不要写成电流通过浴液直接刺激第二心。','先陈述两个观察，再说 transferable chemical mediator，最后给对照与推理边界。',[['N5','p.7–8'],['K5A','Q2'],['EX','MCQ 1、20'],['B','PDF p.154–156']],2);
T(5,3,'突触结构与 Gray 分类','Structure and Gray types','结构是定位提示，兴奋与抑制最终仍取决于受体和离子条件。',[
 '突触前 active zone 聚集释放装置和囊泡；突触后 density 富集受体与支架蛋白。突触间隙是递质扩散空间，不是 gap junction。',
 'Gray I 型常不对称、突触后致密带较厚、囊泡较圆，通常兴奋；II 型较对称、囊泡较扁，通常抑制。它们是经典形态相关，不能用一个截面取代功能测量。',
 'Axodendritic、axosomatic、axoaxonic 分别说明突触前轴突连接树突、胞体、另一轴突；名称说的是连接位置，不自动决定递质类型。'
],'Type I：asymmetric／usually excitatory；Type II：symmetric／usually inhibitory。','比较相同维度并写通常关系；标图区分 active zone、cleft 和 postsynaptic density。',[['N5','p.3–4'],['K5A','Q7–10、12'],['EX','FRQ 3'],['B','PDF p.160–163']]);
T(5,4,'Ca²⁺与预备好的释放装置','Fast vesicle release','快速来自“预先准备”，而不是 AP 到来后才制造囊泡。',[
 '许多囊泡在 AP 到来前已完成 docking 和 priming。v SNARE 位于囊泡膜，t SNARE 位于突触前靶膜；融合发生在突触前膜而非突触后膜。',
 'AP 去极化突触前末梢，打开电压门控 Ca²⁺通道，Ca²⁺内流形成释放位点附近微域。Ca²⁺传感器 synaptotagmin 等触发 SNARE 介导的融合与胞吐。',
 '递质扩散并结合突触后受体，改变通道电导或胞内信号。Ca²⁺通道与已备囊泡的空间接近，使释放能在毫秒尺度完成。',
 '“Ca²⁺直接结合 SNARE”是课堂简写；机制答题应区分 Ca²⁺传感器与 SNARE 融合机器。'
],'核对 v/t 的膜位置；全轴突都积累高 Ca²⁺不是快速释放的必要机制。','预先 docking/priming → local Ca²⁺ influx → sensor → fusion → receptor response；说明速度的结构基础。',[['N5','p.3、6'],['K5B','Q3'],['EX','MCQ 15、18；FRQ 7'],['B','PDF p.166–170']]);
T(5,5,'小分子与肽递质','Small molecules versus peptides','合成地点、运输方式与释放条件要成组比较。',[
 '许多小分子递质在末梢由酶合成，再由囊泡转运体装入小透明囊泡。合成酶本身仍需在胞体制造和运输，不要写成所有成分都在末梢制造。',
 '肽前体由胞体粗面内质网合成，经 Golgi 处理并装入致密芯颗粒，沿微管由 kinesin 等顺向运输到末梢。',
 '肽颗粒通常距离局部 Ca²⁺通道更远，需要较强或持续高频活动产生更广泛 Ca²⁺升高；低频较易释放靠近 active zone 的小囊泡。',
 '高频并不意味着小分子释放被关闭；同一末梢可以发生共释放。ACh 是小分子递质，但不归入儿茶酚胺或 monoamines。'
],'soma/rER/Golgi/kinesin 对应肽；terminal synthesis/vesicular transporter 对应许多小分子。','使用 synthesis → packaging → transport → Ca²⁺ requirement 四维表，并解释 sustained stimulation 为什么偏向肽。',[['N5','p.5–6'],['K5B','Q1–2、5–6'],['EX','MCQ 3'],['B','PDF p.164–168']]);
T(5,6,'清除递质与回收膜','Termination and recycling','清除化学信号，和把囊泡膜拿回来，是不同任务。',[
 '突触递质通过扩散、神经元／胶质细胞转运体摄取、特异酶降解等途径清除。清除有助终止受体激活和提高时间分辨率。',
 'AChE 将 ACh 水解为 acetate 与 choline；再摄取的主要是 choline，而不是把 intact ACh 作为经典回收底物。ChAT 则催化 ACh 合成，两者功能相反。',
 '胞吐后 endocytosis 回收囊泡膜，随后重新装填递质；它不等于用胞吞把所有游离小分子递质直接捞回。肽递质的补给与清除也不能简单照搬小分子。'
],'AChE≠ChAT；endocytosis 的对象是 membrane，不是所有递质。','每一步写明 substrate、location 和 process，再解释终止信号如何防止持续去极化。',[['N5','p.7'],['N6','p.4'],['K5B','Q4、10'],['EX','MCQ 8；FRQ 1'],['B','PDF p.170–174、198–200']]);
T(5,7,'受体决定响应','Ionotropic and metabotropic responses','同一个递质可以通过不同受体产生相反的效应。',[
 '离子型受体本身就是递质门控通道，通常响应快。代谢型受体通过 G 蛋白和效应器调节通道或酶，通常较慢且持续较久，可放大信号。',
 '骨骼肌 nAChR 是阳离子通道，常见静息条件下净内向电流产生 EPP；心脏 M2 型 muscarinic 受体可通过 G 蛋白提高 K⁺通透性，减慢心率。',
 'GABA_A 和 glycine 受体常为 Cl⁻通道；反应取决于 reversal potential 相对 Vm 与阈值的位置。打开 Cl⁻通道不保证在所有细胞都超极化。',
 '课堂 NE → GPCR → adenylyl cyclase → cAMP → kinase → K⁺通道调制是特定通路示例；不同受体亚型不全走同一条路线。'
],'递质名不能单独决定 excitation/inhibition；区分 receptor binding 与 ion driving force。','把 receptor subtype → effector/channel → conductance → Vm or excitability 写完整。',[['N5','p.8、12'],['N6','p.3'],['K5B','Q7–9'],['EX','MCQ 28–29；FRQ 10'],['B','PDF p.171–176、208–220']]);
T(5,8,'总和与起始区','Spatial and temporal summation','PSP 可以相加，是否产生 spike 取决于起始区的合成结果。',[
 '空间总和来自不同突触近同时的输入；时间总和来自同一输入在前一个 PSP 尚未消退时重复激活。两者可同时发生。',
 '单个 CNS 兴奋性输入可以产生 EPSP，通常不足以单独触发 AP。说“单个 AP 不能引发 CNS EPSP”是错误的，混淆了 EPSP 与 postsynaptic AP。',
 '幅度、时序、突触位置、膜被动性质和抑制输入共同决定初始段是否达阈。靠近起始区的抑制常具有较强控制作用，但不能脱离输入强度作无条件排序。'
],'不同地点＝spatial；短间隔同地点＝temporal；区别 PSP threshold crossing 与输入是否存在。','使用 graded EPSPs、overlap、axon initial segment 和 threshold，避免说多个 AP 振幅总和。',[['N5','p.9–10'],['K5A','Q15–18'],['K5B','Q12、15–17'],['EX','MCQ 27；bonus 35'],['B','PDF p.176–181']]);
T(5,9,'长度常数与分流抑制','Length constant and shunting','膜电压没有明显下降，也可能已经被抑制。',[
 '被动电压变化可用 ΔV(x)=ΔV(0)e^(−x/λ) 描述；距离为一个 λ 时约剩 36.8%。λ 越大，电位沿距离衰减越慢。',
 '一致使用每单位长度的电阻时，λ=√(r_m/r_i)。提高膜电阻或降低轴向电阻会增大 λ；更粗直径、髓鞘与细胞内电阻率分别影响这些量。几何定义不同的 R 不可直接混代。',
 '当 E_Cl 接近静息电位，打开 Cl⁻通道可能几乎不改变静息 Vm，却提高电导、降低输入电阻，使相同兴奋电流引起更小 ΔV，并降低局部 λ。',
 '因此 inhibition 指降低产生 AP 的可能性，不要求每次出现明显超极化。失髓鞘使电流更易漏出，可能减慢甚至阻断传播。'
],'分流核心链：g_m↑ → R_m↓ → smaller EPSP → reduced spread。','给公式和方向，再解释为什么 E_Cl≈V_rest 时没有大 IPSP 仍会抑制。',[['N5','p.10–12'],['K5A','Q11'],['K5B','Q13–14、18'],['EX','MCQ 5；FRQ 5'],['B','PDF p.179–183']]);
T(5,10,'NMJ 的安全系数','Neuromuscular junction safety factor','正常 NMJ 用足够大的终板电位，可靠地把一次运动神经 spike 转为肌肉 spike。',[
 '一个运动神经 AP 可释放许多 ACh 囊泡；较大的释放区、丰富释放位点、密集 nAChR 和突触后皱褶共同提供较大终板电位 EPP。',
 'EPP 通常超过产生肌肉 AP 所需的去极化，形成 safety factor。AChE 快速终止信号，支持下一次准确响应；它不是制造 EPP 的酶。',
 '单囊泡自发释放可产生微终板电位，体现量子性。课堂 200 囊泡、40 mV 是示意数量级；不同接头与条件会改变这些值。',
 '“Fail safe”指正常生理条件下的高可靠性，不保证在毒素、受体减少或异常条件下永不失败。'
],'不要把安全系数归因于 AP 振幅更大；用 transmitter release 与 receptor/folds 解释。','至少三个 adaptation→functional consequence 配对，最后说明大 EPP 与阈值余量的关系。',[['N5','p.5、10'],['K5A','Q13–14、18'],['K5B','Q11–12'],['EX','FRQ 6'],['B','PDF p.161–162、177–179']]);
T(6,1,'递质鉴定的三条证据','Criteria for a neurotransmitter','“看到了这个分子”只是起点，不等于证明它在这里传递信号。',[
 '经典囊泡递质的三类证据：突触前细胞合成并储存；刺激时释放；外源施加到靶细胞能模仿内源释放的反应。Ca²⁺依赖释放是重要机制检验。',
 '与同一受体有关的拮抗剂应能一致阻断外源物质与内源刺激反应。只证明 IHC 阳性，不能替代释放和功能证据。',
 '这里采用课堂经典递质判据；NO 等非典型信号的储存／释放方式不同，不能把所有化学信号强套囊泡模板。'
],'presence、release、mimicry 是不同证据，不要把三种染色法当作三条判据。','每条 criterion 对应一个可测实验；若只被要求一个 technique，再展开其靶标与读数。',[['N6','p.1–3'],['EX','FRQ 2'],['MS','FRQ 2'],['B','PDF p.189–194']]);
T(6,2,'IHC 与原位杂交','Protein versus mRNA localization','抗体找抗原，互补探针找核酸。',[
 'IHC 利用抗体与候选递质或合成酶抗原的特异结合，定位蛋白／分子。ChAT、TH、GAD 可用于提示相应递质表型，具体特异性仍需对照。',
 '原位杂交利用与目标 mRNA 互补的核酸探针；FISH 的 F 指 fluorescent，以荧光信号读出。放射性探针属于放射性 ISH，不应都叫 FISH。',
 '小分子递质不是由 mRNA 直接翻译。FISH 通常检测其合成酶或转运体的转录本；肽前体则可有相应编码转录本。',
 '阴性对照、已知阳性组织和探针／抗体验证很关键；定位提示合成能力，不独立证明刺激依赖释放。'
],'IHC target＝antigen/protein；FISH target＝mRNA；两者都不能单独证明 release。','写 probe complementarity 或 antibody specificity、标签和成像，再说能与不能得出的结论。',[['N6','p.1–2、4'],['K6','Q2'],['EX','FRQ 2'],['B','PDF p.189–192']]);
T(6,3,'释放与模拟反应实验','Release assays and mimicry','操作、读数、对照和推断要一一对应。',[
 '保持脑切片的氧、营养和适宜温度，比较刺激前后候选分子释放量。提高外 K⁺可使 E_K 较不负并去极化，但不是特异激活某一种细胞的充分条件。',
 'Ca²⁺去除或 Ca²⁺通道阻断可检验典型诱发囊泡释放的依赖性；需同时确认样本仍具活性，避免把细胞死亡当作机制证据。',
 '微离子电泳用电流控制带电物质的局部施加；pressure ejection 用压力。两种都可局部给药，但物理机制不同。记录突触后电位比较内源刺激与外源施加。',
 '相似效应加上相同的拮抗剂敏感性更支持共同受体；单一剂量引起任意电位变化不足以完成鉴定。'
],'高 K⁺提高释放与“只刺激某一个神经元”不是同一结论。','按 baseline → stimulation/application → measurement → control → inference 排列答案。',[['N6','p.2–3'],['EX','FRQ 2、7'],['B','PDF p.192–194']]);
T(6,4,'激动剂、拮抗剂与亚型','Agonists, antagonists and receptor subtypes','激动受体不等于一定让细胞兴奋。',[
 'Agonist 结合并激活受体，模仿相应内源配体效应；antagonist 结合而不产生同样激活，降低激动剂的作用。作用持续多久不构成二者的定义。',
 'nAChR 的经典激动剂 nicotine、拮抗剂 curare；muscarinic 受体的激动剂 muscarine、拮抗剂 atropine。骨骼肌终板用 nAChR，心脏减速主要用 muscarinic 受体。',
 'AMPA、NMDA、kainate 是 glutamate 受体家族中的离子型亚型，不是 GABA 受体。GABA_A 为离子型；GABA_B 为代谢型。',
 '放射性配体结合可以定位结合位点，不能仅凭结合就判定该配体是 agonist，也不能单凭位点存在证明生理信号方向。'
],'antagonist 不等于直接制造 IPSP；它也可能通过阻断抑制性受体增加兴奋。','先定义，再给 receptor-specific example，最后按被激活的受体解释细胞效应。',[['N6','p.3'],['N5','p.11'],['K6','Q9、13'],['EX','MCQ 10、23；FRQ 10'],['B','PDF p.194–197、208–213']]);
T(6,5,'ACh 系统：合成与清除','The cholinergic cycle','ChAT 做合成，AChE 做水解，回收的是 choline。',[
 'ChAT 催化 acetyl CoA + choline → ACh + CoA。高亲和力、Na⁺依赖的 choline 摄取是课堂强调的合成限速环节；不能把“Amount of ACh”当成底物限速因素。',
 'VAChT 把 ACh 装入囊泡，利用囊泡质子电化学梯度；它不是细胞膜上的 choline 摄取转运体。',
 '释放后 AChE 快速水解 ACh，choline 再摄取。抑制 ChAT 降低合成；抑制 AChE 延长受体暴露；阻断 VAChT 降低囊泡装填。',
 '新烟碱类主要作用于昆虫 nAChR，通常表现为激动作用；“neonicotinoid＝AChE inhibitor”的手写标注不正确。'
],'ChAT／AChE／CHT／VAChT 四者按反应、位置与底物区分。','在 synthesis、rate limitation、packaging、termination、reuptake 五栏写完整循环。',[['N6','p.4'],['K6','Q1、4、6'],['EX','MCQ 8；FRQ 1'],['B','PDF p.198–200']]);
T(6,6,'儿茶酚胺的顺序与酶','Catecholamine synthesis','Tyrosine 是路径起点，L DOPA 才是 dopamine 的直接前体。',[
 'Tyrosine 经 tyrosine hydroxylase（TH）成 L DOPA；经 aromatic amino acid decarboxylase（AADC／DDC）成 dopamine；经 dopamine β hydroxylase（DBH）成 norepinephrine；经 PNMT 成 epinephrine。',
 'TH 催化经典限速步骤，可受反馈调节。并非所有含 dopamine 的细胞都表达后两种酶，因此不能说每个 dopaminergic neuron 都一定产生 NE 和 E。',
 '单胺经特异性 Na⁺依赖转运体再摄取；MAO 参与细胞内代谢，儿茶酚胺代谢还可涉及 COMT。课堂侧重 MAO，不等于只有 MAO。',
 '干预分析：阻断 DBH，在简化路径下 NE 减少、其上游 dopamine 可积累；阻断 TH 则共同削弱下游儿茶酚胺合成。'
],'直接前体与远端前体必须分清；原卷 bonus 34 缺少 L DOPA，不直接计入单选评分。','顺序写全并给每箭头标酶，再用阻断位置解释上下游变化。',[['N6','p.5'],['K6','Q5、12'],['EX','bonus 34；FRQ 1、10'],['B','PDF p.200–202']]);
T(6,7,'Serotonin 的合成与清除','Serotonergic transmission','Tryptophan 供给与限速酶是两个层面。',[
 'Tryptophan 经 tryptophan hydroxylase（TPH）成 5 HTP，再经 AADC 成 serotonin（5 HT）。不要把 catecholamine 的 tyrosine hydroxylase（TH）误写到这里。',
 'TPH 催化限速反应；tryptophan 可用量影响合成，课堂因此强调 amount of tryptophan。答题可同时给出酶与底物供给，避免把两者当互斥答案。',
 'SERT 介导 Na⁺依赖摄取，MAO 参与代谢。若其他条件相同，阻断 SERT 可延长突触外 5 HT 的存在；阻断 TPH 则降低合成。',
 '“同为单胺”不能推出有相同直接前体、相同受体或相同即时效应。'
],'Tryptophan→5 HTP→5 HT；TH≠TPH；reuptake inhibition≠synthesis inhibition。','把合成、影响因素、再摄取与代谢分栏，再预测特定药物操作。',[['N6','p.6'],['K6','Q7、12'],['EX','FRQ 1'],['B','PDF p.202–203']]);
T(6,8,'Glu、GABA 与 glycine','Amino acid transmitters','GABA 来自 glutamate；递质作用仍由受体和离子条件限定。',[
 'Glutamate 是主要兴奋性递质；GABA 是脑内主要抑制性递质，glycine 在脊髓／脑干抑制中特别重要。这是成熟神经系统的常见情形。',
 'GAD（glutamic acid decarboxylase）把 glutamate 转为 GABA。GABA transaminase 参与 GABA 代谢；抑制 GAD 与抑制降解酶对 GABA 量的影响方向不同。',
 '典型 GABA_A／glycine 受体提高 Cl⁻电导；GABA_B 可通过 G 蛋白调节 K⁺或 Ca²⁺通道。GABAergic 神经元减少通常解除抑制，而非增强抑制。',
 'Glu/GABA 摄取涉及神经元和胶质细胞，连接递质清除与代谢补给。不能把 glycine、glutamate 和 GABA 的名字或酶互换。'
],'GAD 用于 GABA synthesis；AMPA/NMDA/kainate 对应 Glu；抑制GABA neuron 会 disinhibit。','用 enzyme → transmitter availability → receptor conductance → circuit excitability 的因果链。',[['N6','p.6'],['K6','Q3、8、10–12'],['EX','MCQ 28–29'],['B','PDF p.203–205、208–213']]);
T(6,9,'转运、降解与干预预测','Transport is not degradation','先问干预发生在哪一层，再预测突触间隙与囊泡内的变化。',[
 '细胞膜再摄取转运体负责从细胞外液回收；囊泡转运体负责把递质装进囊泡。前者常与 Na⁺梯度耦联，后者多依赖囊泡质子梯度。',
 'MAO、GABA transaminase 等是代谢酶，AChE 是典型突触间隙水解酶；阻断再摄取通常延长受体暴露，不能描述为“直接增加合成”。',
 '同一个药物若作用于不同位置，可改变释放量、受体可用性或清除速度。只根据“突触间隙递质更多”不能证明它一定直接激动受体。',
 '这些是课堂控制变量题的预测；真实系统存在反馈和适应，本指南不把简化预测扩展为临床疗效判断。'
],'plasma membrane transporter、vesicular transporter、enzyme、receptor 四类先分类。','写 intervention site → immediate molecular effect → transmitter availability → postsynaptic response，并说明固定条件。',[['N5','p.6–7'],['N6','p.4–6'],['K6','Q6–7'],['EX','FRQ 1'],['B','PDF p.198–205']],2);
T(6,10,'从分子到整合的跨章链','From synthesis to the next spike','将三个章节串成一条可逐步干预的通路。',[
 '递质合成与装填决定可释放资源；AP 抵达末梢决定何时打开 Ca²⁺通道；局部 Ca²⁺触发融合；递质与受体决定哪种电导或胞内信号改变。',
 '突触后 EPSP/IPSP 经被动传播与总和影响轴突初始段；在那里，电压门控 Na⁺通道是否达到再生阈值决定下一个 AP。',
 '中断前突触 AP、Ca²⁺进入、囊泡融合或受体结合都可能减少突触后反应。用绕过某一步的局部外源给药，可区分上游释放障碍与下游受体障碍。',
 '一段合格解释同时写清 electrical → chemical → electrical 的转换，并区分 presynaptic 与 postsynaptic。'
],'原卷跨章题常换干预位置而不换主链；不要只记结论。','用救援实验（bypass/rescue）建立步骤位置，不将一次失败反应归因于唯一环节。',[['N4','p.4–5'],['N5','p.6、8–11'],['N6','p.1–3'],['EX','FRQ 7–10'],['B','PDF p.166–183、189–197']],2);
const mcq=[],frq=[];
function Q(ch,n,t,prompt,choices,refs,level='应用'){const shift=(n+ch)%4,options=[],rationale=[];for(let i=0;i<4;i++){const pair=choices[(i-shift+4)%4];options.push(pair[0]);rationale.push(pair[1]);}mcq.push({id:`C${ch}-M${String(n).padStart(2,'0')}`,chapter:ch,topic:`c${ch}-t${t}`,prompt,options,answer:shift,rationale,sources:refs,priority:topics.find(x=>x.id===`c${ch}-t${t}`).priority,level,origin:refs.some(r=>r[0]==='EX')?'原卷改编':refs.some(r=>r[0].startsWith('K'))?'课堂改编':'原创迁移'});}
function F(ch,n,t,prompt,points,model,mistake,refs){frq.push({id:`C${ch}-F${String(n).padStart(2,'0')}`,chapter:ch,topic:`c${ch}-t${t}`,prompt,points:points.map(text=>({text,marks:1})),model,mistake,sources:refs,priority:topics.find(x=>x.id===`c${ch}-t${t}`).priority,origin:refs.some(r=>r[0]==='EX')?'原卷改编':'原创迁移'});}
Q(4,1,1,'At point B on the action-potential trace (the rising phase), which change directly drives the rapid increase in Vm?',[
 ['An increase in Na⁺ conductance with net Na⁺ influx','正确：阈值后的 Na⁺通道开放与内流驱动上升支。'],['Increased K⁺ efflux through delayed rectifier channels','K⁺外流主要推动复极，方向与上升支相反。'],['A sudden reversal of the Na⁺/K⁺ pump','泵不在每个 spike 中反向，也不是上升支的直接驱动。'],['Removal of every intracellular anion','细胞不需要排空阴离子才能形成 AP。']],[['N4','p.1、4'],['EX','FRQ 8']]);
mcq[mcq.length-1].figure='ap';
Q(4,2,1,'What does the term overshoot specifically describe?',[
 ['The portion of an action potential above 0 mV','正确：overshoot 按 Vm 高于 0 定义。'],['Every depolarization below threshold','阈下去极化不构成 overshoot。'],['The entire falling phase','下降支是复极，部分可低于 0。'],['The interval below the resting potential','低于静息的是 undershoot／afterhyperpolarization。']],[['N4','p.1'],['K4','Q6']],'概念');
Q(4,3,1,'Why can Vm briefly become more negative than its resting value after a spike?',[
 ['K⁺ conductance remains elevated while Na⁺ conductance is low','正确：较高 K⁺电导将 Vm 拉向较负的 E_K。'],['All K⁺ channels have already closed','若 K⁺电导已回落，不能据此解释后超极化。'],['The pump instantaneously removes all Na⁺ that entered','泵维持梯度，但不是这一快速波形的主要直接原因。'],['Na⁺ channels remain maximally open','持续 Na⁺内流不解释正常 undershoot。']],[['N4','p.4'],['EX','MCQ 2']]);
Q(4,4,2,'A depolarized membrane cannot immediately reopen many Na⁺ channels. They are best described as:',[
 ['Inactivated','正确：失活使通道暂不能被再次去极化激活。'],['Closed and fully available at rest','静息可用关闭态在适当去极化时可开放。'],['Constitutively open leak channels','漏通道不是这里描述的电压门控失活过程。'],['Permanently destroyed','正常复极可解除失活，并非结构被毁。']],[['N4','p.3'],['K4','Q15']],'概念');
Q(4,5,2,'Which event allows voltage-gated Na⁺ channels to recover from inactivation?',[
 ['Repolarization toward a negative membrane potential','正确：恢复需要膜复极和相应时间。'],['Maintaining the membrane at a strongly positive voltage','持续去极化通常维持失活。'],['Increasing stimulus amplitude without repolarization','强刺激不能跳过绝对不应期。'],['Hydrolysis of ACh in the synaptic cleft','ACh 清除不是 Na⁺通道解除失活的直接条件。']],[['N4','p.3–4'],['B','PDF p.138–140']]);
Q(4,6,2,'Which structural description is appropriate for a typical voltage-gated Na⁺ pore-forming α subunit?',[
 ['One polypeptide chain containing four homologous domains','正确：四个重复结构域位于同一成孔 α 链。'],['Four independent α chains, each identical to the entire Na⁺ channel','混淆了四重复结构域与典型 K⁺通道的四亚基构型。'],['Two connexons containing six connexins each','这是 gap junction 的相关结构，不是 Na⁺通道。'],['A vesicle containing four SNARE proteins','释放装置与电压门控 Na⁺通道结构不同。']],[['N4','p.3，结构简写校正'],['B','PDF p.136–137']],'概念');
Q(4,7,3,'The absolute refractory period is primarily caused by:',[
 ['Inactivation of voltage-gated Na⁺ channels','正确：Na⁺通道的暂时不可用性是核心。'],['Complete depletion of all extracellular Na⁺','单个 AP 不会耗尽细胞外 Na⁺。'],['Inactivation of every K⁺ channel','延迟 K⁺通道开放与复极相关，不是此核心原因。'],['Absence of neurotransmitter receptors','AP 的不应期不是由突触受体缺失定义。']],[['EX','bonus 33'],['K4','Q10']],'概念');
Q(4,8,3,'If an absolute refractory period is 2 ms, what is the ideal upper bound set by this period alone?',[
 ['500 spikes per second','正确：1/(2×10⁻³ s)=500 Hz；只是该因素设定的理想界限。'],['2 spikes per second','把 2 ms 当成了 0.5 s 一类的错误换算。'],['2000 spikes per second','应取时间的倒数，不能把 2 ms 乘以 1000 当作频率。'],['An unlimited firing rate','绝对不应期对频率有硬约束。']],[['N4','p.4'],['K4','Q9–10']],'计算');
Q(4,9,3,'A second spike requires a larger stimulus during the relative refractory period mainly because:',[
 ['Some Na⁺ channels are recovering and K⁺ conductance is still elevated','正确：可用 Na⁺通道与较高 K⁺电导共同提高触发难度。'],['All Na⁺ channels must remain irreversibly blocked','不可逆阻断不能解释稍后恢复。'],['The second action potential must have twice the amplitude','较强刺激不是靠制造双倍 spike 来克服不应性。'],['The synaptic cleft has become wider','突触几何不是轴突相对不应期的直接机制。']],[['N4','p.4'],['B','PDF p.129、142–143']]);
Q(4,10,4,'In one neuron under otherwise comparable conditions, a stronger sustained suprathreshold input usually increases:',[
 ['Firing frequency rather than individual spike amplitude','正确：输入强度常以频率／时间模式编码。'],['Each spike’s amplitude in direct proportion to stimulus strength','这与同条件下全或无原则不符。'],['The number of Na⁺ ions in a single action potential without any limit','不是课堂神经编码的合理描述。'],['Axon length during the recording','轴突不会因较强输入即刻增长来编码。']],[['N4','p.1–2'],['K4','Q3、8']]);
Q(4,11,4,'Which statement correctly limits the all-or-none principle?',[
 ['It describes spike initiation in a given neuron; different neuron types may have different waveforms','正确：全或无不等于跨细胞和物种完全同形。'],['All neurons in all species have identical spike duration','课堂 Kahoot 正是要排除这种绝对化。'],['Any depolarization, however small, produces a spike','必须达到再生阈值。'],['A graded EPSP cannot vary in amplitude','PSP 是可分级信号，不受同样的全或无描述。']],[['N4','p.1–2'],['K4','Q2、7'],['EX','FRQ 9']],'概念');
Q(4,12,4,'Which signal can normally undergo graded spatial summation before a postsynaptic spike is initiated?',[
 ['Excitatory postsynaptic potentials','正确：PSP 可在起始区整合。'],['The amplitudes of two propagated axonal spikes','AP 振幅不是以这种方式相加。'],['The equilibrium potentials of all ions as separate spikes','E_ion 是梯度决定的电位，不是输入 spike。'],['The molecular mass of sodium channels','质量不是突触电位的总和信号。']],[['N4','p.2'],['N5','p.9'],['EX','MCQ 27']]);
Q(4,13,5,'Using outward-positive current, gNa = 2 nS, Vm = −65 mV and ENa = +55 mV give:',[
 ['INa = −240 pA, an inward current','正确：2×(−65−55)=−240；负号对应净内向正离子电流。'],['INa = +240 pA, an outward current','数值绝对值对，但电流符号反了。'],['INa = −20 pA','错误地把电位相加或省略差值。'],['INa = 0 because Vm is negative','负 Vm 不是零电流条件。']],[['K4','Q11'],['B','PDF p.132–134']],'计算');
Q(4,14,5,'A Na⁺ channel is open but Vm equals ENa. What is the net Na⁺ current through it?',[
 ['Zero, because the electrochemical driving force is zero','正确：I=g(Vm−E_Na)=0；不是说分子停止运动。'],['Maximal inward current because the channel is open','开放不保证有净驱动力。'],['Maximal outward current because Vm is positive','必须比较 Vm 与 E_Na，而不是只看正负。'],['Impossible to determine even with I = g(Vm − ENa)','给出的相等条件足以确定净电流为零。']],[['K4','Q11'],['B','PDF p.132–134']]);
Q(4,15,5,'Resistors R1 = 0.001 Ω, R2 = 1 Ω and R3 = 10 Ω are compared. Which has the lowest conductance?',[
 ['R3','正确：g=1/R，最大电阻对应最小电导。'],['R1','R1 的电阻最小，电导反而最大。'],['R2','R2 位于中间，不是最小电导。'],['All three have the same conductance','电导与电阻互为倒数，三者不相同。']],[['EX','MCQ 26'],['N4','p.1']],'计算');
Q(4,16,6,'Lowering extracellular K⁺, with other conditions fixed, makes EK more negative. What is the expected first-order effect near rest?',[
 ['The resting membrane potential becomes more negative','正确：静息时 K⁺电导占较大权重，Vm 随 E_K 向负方向移动。'],['The AP peak must become more positive','峰值更直接受 Na⁺梯度影响，不能据此断言。'],['The K⁺ gradient disappears immediately','降低外 K⁺增强而非消除相应浓度差。'],['Na⁺ channels become ligand-gated','离子浓度变化不会改变通道类型。']],[['EX','MCQ 19'],['N4','p.1、4']]);
Q(4,17,6,'In the usual simplified AP model, increasing intracellular K⁺ primarily changes EK. The AP peak is expected to:',[
 ['Remain approximately unchanged if ENa and Na⁺ conductance are otherwise unchanged','正确：峰值主要由 Na⁺相关性质决定；不是声称整个波形不变。'],['Become much more negative in direct proportion to EK','将 K⁺对静息／undershoot 的作用机械推广到峰值。'],['Become exactly equal to EK','峰值时并非只允许 K⁺流动。'],['Disappear because no ion gradient can remain','单独增加内 K⁺不等于所有梯度消失。']],[['EX','MCQ 9，答案校准'],['B','PDF p.132–143']]);
Q(4,18,6,'An impermeant Na⁺ gradient remains unchanged while anion channels are inserted into a cell with [A⁻]out > [A⁻]in. Initially A⁻ enters. What happens to the inside?',[
 ['It becomes more negative relative to the outside','正确：净负电荷内流使内侧相对更负；对应原卷 21 的 B。'],['It becomes more positive because all inward flow is depolarizing','电荷符号不能忽略。'],['Na⁺ must enter through the new anion channels','选择性阴离子通道不因此允许 Na⁺进入。'],['A⁻ must move outward down its stated concentration gradient','题设外浓度更高，初始扩散方向应向内。']],[['EX','MCQ 21，答案校准'],['B','PDF p.110–117']]);
Q(4,19,7,'Which pair of changes generally increases axonal conduction velocity?',[
 ['Larger diameter and myelination','正确：较低轴向电阻与髓鞘的电缆性质有利于快速传导。'],['Longer total axon length and a smaller diameter','总长度不直接增加速度，直径小通常降低速度。'],['Loss of myelin and increased current leakage','电流更易漏出可减慢或阻断传导。'],['A larger synaptic cleft and fewer nodes','突触间隙不决定轴突局部传导速度。']],[['N4','p.5'],['EX','MCQ 17']]);
Q(4,20,7,'An axon doubles in length while its conduction velocity stays constant. The end-to-end conduction time:',[
 ['Doubles','正确：t=L/v，速度不变时长度加倍使时间加倍。'],['Halves','把长度与速度混淆。'],['Remains unchanged','原卷问 speed；这里问到达时间，两者不同。'],['Becomes zero because spikes are regenerated','再生防止幅度衰减，不消除传播时间。']],[['EX','MCQ 22，变量改编'],['N4','p.5']],'计算');
Q(4,21,7,'In saltatory conduction, action potentials are regenerated mainly at:',[
 ['Nodes of Ranvier with a high density of voltage-gated channels','正确：节间被动传播，结区再生。'],['Every point under the thickest myelin sheath','厚髓鞘区不是主要再生位置。'],['The synaptic cleft','突触间隙是化学传递空间，不是轴突结。'],['Mitochondria inside the axon','线粒体供能，不是膜 AP 的再生位置。']],[['N4','p.5'],['B','PDF p.146–148']],'概念');
Q(4,22,8,'Saxitoxin prevents normal AP conduction primarily by:',[
 ['Blocking sensitive voltage-gated Na⁺ channels','正确：削弱再生性 Na⁺内流。'],['Blocking ACh hydrolysis','这是不同的突触酶作用位点。'],['Keeping every K⁺ channel permanently open as its primary target','不是 saxitoxin 的经典作用机制。'],['Making the entire axon longer','毒素不靠增加长度阻断。']],[['EX','MCQ 6'],['N4','p.4']]);
Q(4,23,8,'Which comparison between TTX and batrachotoxin is most accurate?',[
 ['TTX blocks Na⁺ conduction; batrachotoxin disrupts normal gating and can cause persistent depolarization','正确：同样干扰正常放电，但分子机制不同。'],['Both primarily hydrolyze acetylcholine','两者不是 AChE。'],['Both must physically destroy skeletal muscle cells to stop signaling','信号失常不等于组织被摧毁。'],['Batrachotoxin works by closing every gap junction','不是课堂描述的 Na⁺通道靶点。']],[['N4','p.4'],['B','PDF p.141–143']]);
Q(4,24,8,'A local anesthetic inhibits voltage-gated Na⁺ channels in an axon. Which event is most directly reduced?',[
 ['Regenerative Na⁺ influx during spike propagation','正确：从通道靶点连到 AP 传导。'],['The affinity of all postsynaptic GABA receptors','并非该通道阻断的直接靶点。'],['Synthesis of every peptide in the soma','不能由 Na⁺通道阻断推出。'],['The number of connexins in a gap junction','属于另一类膜蛋白结构。']],[['N4','p.5'],['B','PDF p.142–145']]);
Q(4,25,9,'To compare the time courses of Na⁺ and K⁺ currents at a specified Vm, which approach is most suitable?',[
 ['Voltage clamp combined with appropriate ion/channel isolation','正确：控制电位后比较电流。'],['Measure only the final muscle contraction','下游结果不能直接分离膜离子电流。'],['Count Nissl bodies without electrical recording','细胞结构染色不测电流时程。'],['Apply ACh and assume all current is Na⁺ current','混合受体电流不等于隔离后的 Na⁺电流。']],[['N4','p.3'],['B','PDF p.134–139']]);
Q(4,26,9,'Which method can resolve the opening and closing current of a single ion channel in a small membrane patch?',[
 ['Patch-clamp recording','正确：高阻封接的小膜片可记录单通道事件。'],['Immunohistochemistry alone','可定位蛋白，不直接读通道电流。'],['An ordinary photograph of the whole brain','没有单通道电流读数。'],['A behavioral questionnaire','分析层次不相符。']],[['N4','p.6'],['K4','Q14']],'概念');
Q(4,27,9,'In a voltage-clamp experiment, which variable is controlled and which is recorded?',[
 ['Membrane voltage is controlled; compensating membrane current is recorded','正确：电压钳通过反馈保持命令电压。'],['Current is fixed; only cell color is recorded','把电流钳与其他读数混在一起。'],['Axon length is controlled; neurotransmitter mass is recorded','不是电压钳的定义。'],['Both Vm and current must remain zero','命令电压与记录电流都不必为零。']],[['N4','p.3'],['B','PDF p.134–139']]);
Q(4,28,10,'Blue light activates classic ChR2 expressed in a neuron near rest. What is the usual immediate effect?',[
 ['A net inward cation current and depolarization','正确：ChR2 是光门控阳离子通道。'],['ATP-driven export of all intracellular Na⁺','ChR2 不是这种 ATP 泵。'],['A selective block of all voltage-gated Na⁺ channels','与蓝光激活 ChR2 作用不同。'],['ACh hydrolysis in the cleft','不是 ChR2 的分子功能。']],[['N4','p.2'],['K4','Q18'],['B','PDF p.130–132']]);
Q(4,29,10,'Classic halorhodopsin is best described as:',[
 ['A light-driven inward Cl⁻ pump that usually inhibits firing','正确：经典黄光激活的氯离子泵。'],['A blue-light-gated Na⁺-only channel','混淆 ChR2，也将其选择性过度简化。'],['A Na⁺/K⁺ ATPase stimulated by nicotine','不是同类蛋白。'],['A vesicular transporter for dopamine','与光遗传泵无关。']],[['N4','p.2'],['K4','Q19'],['B','PDF p.130–132']]);
Q(4,30,10,'Which control most directly tests whether a light-evoked response depends on the introduced opsin?',[
 ['Give the same light to otherwise matched cells lacking that opsin','正确：保持照明等条件，改变 opsin 表达。'],['Change both opsin expression and every recording condition','多个变量同时改变，难以归因。'],['Compare only two different colors in different species','物种等差异造成混杂。'],['Assume every neuron responds identically to light','这没有检验 opsin 依赖性。']],[['N4','p.2'],['N6','p.2'],['B','PDF p.130–132']],'实验');
Q(5,1,1,'A typical complete gap-junction channel between two cells contains:',[
 ['Two connexons, each assembled from six connexins','正确：每侧一个六聚 connexon 对接。'],['One connexin shared by six vesicles','层级和数量都混淆。'],['Two synaptic clefts and no membrane protein','gap junction 需要通道蛋白。'],['Six SNAREs acting as neurotransmitter receptors','SNARE 属于融合机器，不是 connexin。']],[['N5','p.1'],['K5A','Q5']],'概念');
Q(5,2,1,'Which feature most directly explains the very small delay of an electrical synapse?',[
 ['Current passes directly through gap-junction channels','正确：无需经典释放、扩散、受体结合步骤。'],['Peptides are synthesized unusually fast','电突触不靠肽合成来传流。'],['AChE removes all electrical resistance','AChE 不是电阻消除装置。'],['The postsynaptic cell has no membrane','两细胞仍各有膜，由通道跨接。']],[['N5','p.1–2'],['EX','MCQ 11；FRQ 3']]);
Q(5,3,1,'Which experimental observation most specifically indicates synchronization by electrical coupling?',[
 ['Neighboring coupled cells show correlated subthreshold fluctuations and near-simultaneous spikes','正确：直接耦联可帮助群体同步。'],['Every presynaptic spike has twice its previous amplitude','电耦联不以 AP 振幅倍增定义。'],['A single cell produces an mRNA signal','分子表达不是群体电同步证据。'],['All receptors are degraded but peptide synthesis rises','不直接表明电耦联。']],[['N5','p.2'],['EX','MCQ 30，消歧改编']],'实验');
Q(5,4,2,'After stimulating the vagus nerve of heart 1, Loewi transfers its bath fluid to heart 2, which also slows. What is supported?',[
 ['A transferable chemical mediator contributes to slowing','正确：可转移浴液作用支持化学介质。'],['A direct gap junction must connect the two hearts','实验的浴液转移不要求细胞直接连接。'],['All neuronal synapses are exclusively chemical','实验不能排除其他位置有电突触。'],['Heart 2 received the same electrode stimulation','第二心未被直接电刺激，正是推理关键。']],[['N5','p.7–8'],['K5A','Q2'],['EX','MCQ 20']],'实验');
Q(5,5,2,'Which bath-transfer control best addresses whether stimulation is necessary for the transferred effect?',[
 ['Transfer comparable bath fluid collected before vagal stimulation','正确：保持转移流程但去掉关键刺激。'],['Remove every measurement electrode from both hearts','这样无法可靠比较心率变化。'],['Use a different species, temperature and solution simultaneously','引入多个混杂变量。'],['Measure only the mass of the second heart','与刺激依赖的心率效应不匹配。']],[['N5','p.7'],['B','PDF p.154–156']],'实验');
Q(5,6,2,'The classic vagal mediator later identified from this line of work was:',[
 ['Acetylcholine','正确：Vagusstoff 后来被识别为 ACh。'],['GABA','不是这一经典蛙心实验的介质。'],['Sodium itself as a neurotransmitter','离子电流与化学递质分子需区分。'],['Tyrosine hydroxylase','这是合成酶，不是迷走神经的经典介质。']],[['EX','MCQ 1'],['N5','p.8']],'概念');
Q(5,7,3,'A synapse with an asymmetric prominent postsynaptic density and round vesicles is classically associated with:',[
 ['Gray type I, usually excitatory','正确：经典形态对应关系。'],['Gray type II, always a gap junction','II 型通常对称，也不是 gap junction 分类。'],['A synapse lacking any postsynaptic membrane','存在突触后致密结构，故不符。'],['A vesicle-free electrical synapse solely because it is asymmetric','已看到囊泡及 PSD，不能这样判断。']],[['N5','p.4'],['K5A','Q10、12'],['EX','FRQ 3']],'概念');
Q(5,8,3,'The presynaptic membrane region specialized for vesicle docking and release is the:',[
 ['Active zone','正确：释放装置与准备释放囊泡在此组织。'],['Postsynaptic density','PSD 在突触后侧。'],['Node of Ranvier','这是轴突传导结构。'],['Nissl body','胞体粗面内质网相关结构，不是释放位点。']],[['N5','p.3'],['K5A','Q9']],'概念');
Q(5,9,3,'An axon terminal contacts another neuron’s soma. This connection is:',[
 ['Axosomatic','正确：axo 指前轴突，somatic 指后胞体。'],['Axodendritic','后靶不是树突。'],['Dendrodendritic','前侧不是树突。'],['Axoaxonic','后靶不是另一轴突。']],[['N5','p.3'],['K5A','Q7']],'概念');
Q(5,10,4,'Which feature does NOT explain rapid transmitter release at an active zone?',[
 ['Ca²⁺ must first build up uniformly throughout the entire axon','正确：局部微域而非全轴突积累有利于速度。'],['Vesicles are already docked and primed','这是快速释放的真实基础。'],['Ca²⁺ channels lie close to release-ready vesicles','空间接近缩短 Ca²⁺到传感器的距离。'],['A local Ca²⁺ microdomain triggers nearby fusion machinery','局部高浓度确实支持快释放。']],[['EX','MCQ 15'],['N5','p.6']]);
Q(5,11,4,'Which placement of SNAREs is appropriate for classical presynaptic exocytosis?',[
 ['v SNARE on the vesicle; t SNARE on the presynaptic target membrane','正确：两膜被拉近并在突触前侧融合。'],['v SNARE on the postsynaptic receptor and t SNARE in the nucleus','位置与融合对象均错误。'],['Both SNARE classes only in the synaptic cleft as soluble transmitters','它们不是以此方式传递信号的递质。'],['v SNARE on myelin; t SNARE on a connexin','与囊泡胞吐无关。']],[['EX','MCQ 18'],['N5','p.6']],'概念');
Q(5,12,4,'Extracellular Ca²⁺ is removed while the presynaptic action potential still arrives. Which process is most directly impaired?',[
 ['Ca²⁺-triggered evoked vesicle fusion','正确：前突触 AP 尚在，释放触发步骤受阻。'],['The existence of every postsynaptic receptor','短时移除外 Ca²⁺不等于所有受体消失。'],['mRNA complementarity in a FISH probe','与释放时的 Ca²⁺触发无直接关系。'],['Passive diffusion of an already applied transmitter across solution','给定已存在的分子扩散不是被特异阻断的步骤。']],[['N5','p.6'],['EX','FRQ 7'],['B','PDF p.168–170']]);
Q(5,13,5,'A response requires repeated sustained presynaptic activity rather than isolated spikes. Which transmitter arrangement is most compatible?',[
 ['Peptides in dense-core granules requiring broader Ca²⁺ accumulation','正确：符合原卷的持续刺激线索。'],['A guarantee that every single vesicle always triggers a postsynaptic AP','这反而强调单次输入可靠性。'],['More active zones alone, with no change in release requirements','增多 active zone 不直接解释必须持续刺激。'],['No intracellular transport from the soma','肽递质通常依赖胞体合成和运输。']],[['EX','MCQ 3'],['N5','p.6']]);
Q(5,14,5,'Which sequence best describes a typical peptide transmitter before release?',[
 ['rER synthesis → Golgi processing → dense-core granules → axonal transport','正确：肽前体在胞体制造并以颗粒运输。'],['Choline uptake → ChAT → direct diffusion through myelin','这是错误拼接的 ACh 路径。'],['Synthesis only inside the synaptic cleft','突触间隙不是典型肽合成场所。'],['Insertion of naked mRNA into connexons','不是肽分泌运输机制。']],[['N5','p.6'],['K5B','Q1']],'概念');
Q(5,15,5,'High-frequency stimulation releases peptide from a terminal that also contains small clear vesicles. Which conclusion is justified?',[
 ['Peptide release can accompany small-molecule release','正确：高频可产生共释放，不意味着小分子被关闭。'],['Small-molecule release must completely stop','不是高频肽释放的必然结果。'],['Peptides must have been newly synthesized in the cleft','合成地点不因此改变。'],['Ca²⁺ is no longer involved in any release','肽释放同样可依赖 Ca²⁺。']],[['N5','p.6'],['K5B','Q5–6']]);
Q(5,16,6,'Following exocytosis, endocytosis primarily recycles:',[
 ['Vesicle membrane for reuse','正确：膜回收与递质清除分开。'],['All free transmitter molecules directly from the cleft','游离小分子主要依靠转运、酶和扩散清除。'],['The axon’s entire cytoplasm','远超出囊泡膜回收含义。'],['The electric charge of Ca²⁺ ions into ATP','不是生理过程。']],[['K5B','Q4'],['N5','p.7']],'概念');
Q(5,17,6,'At the NMJ, acetylcholinesterase normally:',[
 ['Hydrolyzes ACh, helping terminate the signal','正确：酶降解降低持续受体激活。'],['Synthesizes ACh from choline and acetyl CoA','这是 ChAT 的任务。'],['Acts as the postsynaptic ACh receptor','酶与受体不同。'],['Moves intact ACh back across the neuronal membrane as its main action','AChE 催化水解，不是再摄取转运体。']],[['EX','MCQ 8'],['K5B','Q10'],['N6','p.4']],'概念');
Q(5,18,6,'Which released transmitter component is classically taken back up to support resynthesis in a cholinergic terminal?',[
 ['Choline after ACh hydrolysis','正确：Na⁺依赖 choline 摄取为再合成提供原料。'],['Intact ACh through the dopamine transporter','底物与转运体都错。'],['Acetylcholinesterase through every nAChR','受体不是酶的再摄取通道。'],['Connexin after extracellular proteolysis','不属于 ACh 循环。']],[['N5','p.7'],['N6','p.4'],['EX','FRQ 1']]);
Q(5,19,7,'ACh excites skeletal muscle but can slow the heart primarily because:',[
 ['Different receptor subtypes couple to different effectors','正确：nAChR 与心脏 muscarinic 通路不同。'],['ACh changes its chemical identity in every organ','递质不必换分子，受体和效应器即可不同。'],['The heart has no ion channels','心脏有多种离子通道。'],['Every agonist always produces an EPSP','激动抑制性通路也可降低兴奋性。']],[['N5','p.8'],['N6','p.3'],['K5B','Q8']]);
Q(5,20,7,'Compared with a typical ionotropic receptor response, a GPCR response often:',[
 ['Uses an intermediate G protein/effector and can last longer','正确：间接信号可较慢并持续。'],['Must always be an inward Na⁺ current through the receptor itself','GPCR 不是受体本体通道，且效应多样。'],['Never influences ion channels','G 蛋白可直接或间接调控通道。'],['Requires no ligand binding','仍通常由配体结合启动。']],[['N5','p.8、12'],['K6','Q9']],'概念');
Q(5,21,7,'Opening a Cl⁻ channel when ECl is close to the resting potential can:',[
 ['Reduce excitatory voltage responses with little change in resting Vm','正确：电导升高产生分流作用。'],['Only excite, because channel opening always depolarizes','开放的效应取决于反转电位和电导。'],['Never affect excitability unless a large hyperpolarization appears','抑制不要求明显超极化。'],['Convert all Cl⁻ into Na⁺','离子不会因此改变元素。']],[['N5','p.8、11'],['EX','FRQ 5'],['B','PDF p.181–183']]);
Q(5,22,8,'Two different synapses generate overlapping EPSPs at nearly the same time. This is:',[
 ['Spatial summation','正确：位置不同、时间重叠。'],['Temporal summation at one synapse only','这里明确不同突触，主要考空间总和。'],['An increase in the amplitude of the presynaptic AP','这是突触后 graded potential 的叠加。'],['Na⁺ channel inactivation','不是不应期概念。']],[['N5','p.9'],['K5A','Q16'],['K5B','Q15']],'概念');
Q(5,23,8,'A single CNS presynaptic spike produces a small EPSP that does not trigger a postsynaptic spike. What follows?',[
 ['An EPSP occurred; it was insufficient by itself to reach spike threshold','正确：EPSP 的存在与 AP 的产生应分开。'],['No synaptic transmission occurred','已测得 EPSP，不能说没有传递。'],['An EPSP is impossible unless an AP appears postsynaptically','把输入与输出混为一谈。'],['The all-or-none principle has been violated','全或无主要描述再生 spike，不禁止 graded EPSP。']],[['K5B','Q12，错误措辞校准'],['N5','p.9–10'],['EX','MCQ 27']]);
Q(5,24,8,'Whether a postsynaptic neuron fires normally depends most broadly on:',[
 ['The integrated pattern of excitatory and inhibitory synaptic potentials at its initiation region','正确：数量、时序、位置与膜性质共同参与。'],['Only the amplitude of its presynaptic partner’s AP','正常 spike 振幅不是输入强度总和的完整指标。'],['Only whether exactly one receptor was activated','忽略大量输入和电缆性质。'],['The color of the recording electrode','不构成神经整合机制。']],[['EX','MCQ 27；bonus 35'],['N5','p.9–11']]);
Q(5,25,9,'At a distance of one length constant from a passive voltage input, about what fraction remains?',[
 ['0.368','正确：e⁻¹≈0.368。'],['1.000','忽略了被动衰减。'],['0.500','长度常数不是半衰距离。'],['0.000','指数衰减在一个 λ 不会归零。']],[['N5','p.10'],['B','PDF p.179–180']],'计算');
mcq[mcq.length-1].figure='decay';
Q(5,26,9,'With a consistent cable model, which change increases the length constant?',[
 ['Increasing membrane resistance while axial resistance is fixed','正确：λ=√(r_m/r_i)。'],['Increasing leak conductance with everything else fixed','漏电导高意味着膜电阻低，λ 减小。'],['Increasing axial resistance while membrane resistance is fixed','分母变大，λ 减小。'],['Opening many shunting Cl⁻ channels','降低膜电阻，减少电位传播。']],[['K5B','Q13'],['N5','p.10–11'],['EX','FRQ 5']]);
Q(5,27,9,'Why does a larger λ often allow a distant EPSP to influence spike initiation more strongly?',[
 ['The depolarization decays less before reaching the initiation region','正确：远端输入到达时保留更多幅度。'],['All inhibitory inputs are selectively erased','λ 改变不只影响兴奋性传播。'],['AP amplitude grows exponentially with distance','AP 再生与被动指数衰减是不同过程。'],['The neuron must have fewer synapses','不能由 λ 推出突触数量。']],[['EX','MCQ 5'],['N5','p.10–11']]);
Q(5,28,10,'Which combination contributes to the normal NMJ safety factor?',[
 ['Many release sites, substantial ACh release and dense postsynaptic receptors/folds','正确：多项结构提供大于阈值需要的 EPP。'],['A tiny EPP far below threshold in every stimulus','与可靠触发肌肉 AP 相反。'],['Elimination of all AChE to guarantee indefinite excitation','持续受体暴露破坏时间控制，并不保证正常功能。'],['An AP amplitude that increases each time it crosses the cleft','AP 不以这种方式穿过化学间隙。']],[['N5','p.5'],['EX','FRQ 6']]);
Q(5,29,10,'A miniature endplate potential at rest is commonly associated with:',[
 ['Spontaneous release of transmitter from one vesicle','正确：量子释放的经典解释。'],['Mandatory simultaneous release of every vesicle in the terminal','不是 miniature 的来源。'],['A complete propagated AP with arbitrarily small amplitude','miniature EPP 是 graded potential，不是微型 AP。'],['A permanent gap junction connecting motor axon and muscle','NMJ 为经典化学突触。']],[['N5','p.10'],['K5B','Q11'],['B','PDF p.177–179']],'概念');
Q(5,30,10,'The phrase fail-safe NMJ is best interpreted as:',[
 ['A high probability of successful transmission under normal physiological conditions','正确：安全系数意味着生理高可靠性，不是无限保证。'],['An absolute guarantee despite receptor loss, toxins or any pathology','这是不成立的绝对化。'],['Proof that every CNS synapse behaves identically to an NMJ','CNS 单输入通常更弱且需整合。'],['Evidence that muscle APs have no threshold','肌肉 AP 同样需满足阈值条件。']],[['N5','p.5'],['MS','FRQ 6，绝对措辞校正']]);
Q(6,1,1,'Which set best represents the classical evidence for a candidate vesicular neurotransmitter?',[
 ['Presynaptic synthesis/storage, stimulation-dependent release and mimicry of the postsynaptic response','正确：分别覆盖存在、释放与功能。'],['Three positive antibody stains without any release measurement','重复定位证据不等于三类证据。'],['Presence in blood, high molecular mass and a blue color','不构成课堂鉴定标准。'],['Only that a drug can bind to it','结合并不证明生理传递功能。']],[['N6','p.1'],['EX','FRQ 2']],'概念');
Q(6,2,1,'A neuron contains an enzyme that synthesizes substance X. Which conclusion is premature?',[
 ['X has been fully established as the neurotransmitter at this synapse','正确：仍需释放及功能模拟等证据。'],['The cell may have the capacity to synthesize X','合成酶存在可以支持这一有限推断。'],['The enzyme can serve as a candidate phenotypic marker if specificity is validated','这是合理的定位用途。'],['Release experiments would add information','释放证据确实能补全鉴定。']],[['N6','p.1–2'],['B','PDF p.189–194']],'实验');
Q(6,3,1,'Both endogenous stimulation and locally applied X produce the same response, blocked by the same antagonist. This most strongly supports:',[
 ['A shared receptor-mediated action of X and the endogenous signal','正确：功能和药理一致性增强共同机制推断。'],['Proof that X is stored in every neuron in the brain','局部实验无法支持全脑储存。'],['Proof that no electrical synapse exists anywhere','没有检验所有电突触。'],['That the antagonist must itself be an excitatory transmitter','阻断效应不能这样推出。']],[['N6','p.3'],['EX','FRQ 2'],['B','PDF p.192–195']],'实验');
Q(6,4,2,'Immunohistochemistry primarily relies on:',[
 ['Specific binding of antibodies to antigens','正确：用抗原抗体结合定位。'],['Complementary base pairing between every neurotransmitter and DNA','小分子递质不是以碱基互补方式与 DNA 结合。'],['Conversion of current directly into fluorescent mRNA','不是 IHC 机制。'],['Random diffusion without any binding specificity','不能提供特异定位。']],[['K6','Q2'],['N6','p.2']],'概念');
Q(6,5,2,'To localize mRNA encoding ChAT in tissue, the most directly appropriate method is:',[
 ['In situ hybridization with a complementary labeled nucleic-acid probe','正确：互补探针识别目标转录本。'],['Recording an action potential without any molecular probe','无法直接定位该 mRNA。'],['Applying an antibody to acetylcholine and calling it FISH','抗体检测不是核酸原位杂交。'],['Measuring only heart rate','不能直接读出组织中 mRNA 位置。']],[['N6','p.1、4'],['EX','FRQ 2']],'实验');
Q(6,6,2,'What does a fluorescent in situ hybridization signal for GAD mRNA show most directly?',[
 ['The location of a transcript associated with GABA synthesis','正确：首先是转录本定位证据。'],['The exact number of GABA vesicles released during the last spike','mRNA 信号不能直接计释放囊泡。'],['That the cell contains no other transmitter','共递质不能由此排除。'],['A direct measurement of postsynaptic chloride current','电流不是 FISH 的直接读数。']],[['N6','p.1、6'],['B','PDF p.189–194']],'实验');
Q(6,7,3,'Why can an increase in extracellular K⁺ help depolarize cells in a release assay?',[
 ['It makes EK less negative and shifts K⁺-dominated Vm toward less negative values','正确：由 Nernst 浓度比连到去极化。'],['It makes EK more negative by definition','正离子外／内比提高使 E_K 升高。'],['It directly activates only one genetically specified neuron regardless of preparation','高 K⁺不是这种特异刺激。'],['It converts K⁺ into acetylcholine','没有这种转化。']],[['N6','p.2'],['N4','p.1'],['B','PDF p.190–192']]);
Q(6,8,3,'Which manipulation most directly tests the Ca²⁺ dependence of evoked transmitter release?',[
 ['Compare stimulated release with and without extracellular Ca²⁺ while controlling tissue viability','正确：操作释放机制相关变量并控制活性。'],['Change the antibody fluorophore but never stimulate','没有直接检验 Ca²⁺依赖的释放。'],['Measure mRNA once in fixed tissue','定位不替代动态释放实验。'],['Remove glucose and assume any loss of release proves Ca²⁺ dependence','组织失活造成严重混杂。']],[['N6','p.2'],['EX','FRQ 2、7']],'实验');
Q(6,9,3,'Microiontophoresis and pressure ejection both allow local application, but:',[
 ['The former uses electrical force on charged solutes; the latter uses pressure','正确：两种给药的驱动机制不同。'],['Both necessarily inject antibodies into the bloodstream','不是局部给药的定义。'],['Neither can be combined with a postsynaptic recording','可与记录结合比较反应。'],['Pressure ejection specifically measures membrane conductance without electrodes','压力给药不直接替代电生理测量。']],[['N6','p.2–3'],['B','PDF p.192–193']],'概念');
Q(6,10,4,'A molecule binds a transmitter receptor and activates its normal signaling pathway. It is a receptor:',[
 ['Agonist','正确：结合并激活相应受体。'],['Antagonist merely because its action lasts a long time','持续时间不是拮抗剂定义。'],['Degradation enzyme','酶催化与受体激活概念不同。'],['Vesicular transporter','转运体负责装载或移动底物。']],[['EX','MCQ 10、23；FRQ 10'],['N6','p.3']],'概念');
Q(6,11,4,'Which receptor–agonist–antagonist combination is classically matched?',[
 ['Nicotinic ACh receptor — nicotine — curare','正确：nAChR 的经典药理组合。'],['Muscarinic ACh receptor — nicotine — GAD','nicotine 不定义 muscarinic 亚型，GAD 是酶。'],['AMPA receptor — ACh — acetylcholinesterase','AMPA 为 glutamate 受体，AChE 是酶。'],['GABA_A receptor — tyrosine — ChAT','底物和酶不能这样替代受体配体。']],[['N6','p.3'],['K6','Q13'],['B','PDF p.194–197']],'概念');
Q(6,12,4,'AMPA, NMDA and kainate receptors are ionotropic receptor subtypes for:',[
 ['Glutamate','正确：课堂手写 GABA 标题处需更正。'],['Acetylcholine','ACh 常见 nicotinic 与 muscarinic 两大类。'],['GABA','GABA_A、GABA_B 与这些 Glu 亚型不同。'],['Norepinephrine','NE 的经典受体为 adrenergic 家族。']],[['N6','p.3，分类校正'],['B','PDF p.194–197、208–213']],'概念');
Q(6,13,5,'The classroom-emphasized rate-limiting factor for ACh synthesis is:',[
 ['High-affinity choline uptake into the terminal','正确：为 ChAT 提供 choline 的摄取步骤。'],['Acetylcholinesterase activity as the synthetic enzyme','AChE 催化降解而非合成。'],['The amount of ACh as its own required precursor','ACh 是产物，不是这里的合成底物。'],['Tyrosine hydroxylase acting on choline','TH 催化儿茶酚胺路径，不作用于 choline。']],[['K6','Q1'],['N6','p.4'],['MS','FRQ 1，限速项校正'],['B','PDF p.198–200']],'概念');
Q(6,14,5,'Selective loss of ChAT activity most directly reduces:',[
 ['Synthesis of ACh from choline and acetyl CoA','正确：ChAT 是该合成反应的酶。'],['Hydrolysis of ACh by AChE','这是另一种酶的任务。'],['Conversion of L DOPA to dopamine','该步是 AADC。'],['Opening of gap-junction channels','不是 ChAT 的直接作用。']],[['K6','Q4'],['N6','p.4']]);
Q(6,15,5,'Which statement corrects the handwritten neonicotinoid note?',[
 ['Neonicotinoids primarily act at nicotinic ACh receptors rather than being defined as AChE inhibitors','正确：需区分受体作用与抑制水解酶。'],['They are simply another name for acetylcholinesterase','化合物类别不是酶。'],['They are the enzyme that makes choline','不属于 ACh 合成酶。'],['They are classic muscarinic antagonists identical to atropine','受体靶点和类别不符。']],[['N6','p.4，药理简写校正'],['K5B','Q9，agonist 选项'],['R','whole-cell recording，2006']]);
Q(6,16,6,'Which is the immediate precursor of dopamine in the classical synthesis pathway?',[
 ['L DOPA','正确：L DOPA 经 AADC 形成 dopamine。'],['Tyrosine','是较上游前体，需先经 TH 形成 L DOPA。'],['Tryptophan','属于 serotonin 路径。'],['Choline','用于 ACh 合成。']],[['EX','bonus 34，补足正确选项'],['N6','p.5'],['B','PDF p.200–202']],'概念');
Q(6,17,6,'Tyrosine hydroxylase catalyzes which step?',[
 ['Tyrosine → L DOPA','正确：儿茶酚胺合成的经典限速步骤。'],['L DOPA → dopamine','此步由 AADC／DDC 催化。'],['Dopamine → norepinephrine','此步由 DBH 催化。'],['Norepinephrine → epinephrine','此步由 PNMT 催化。']],[['N6','p.5'],['EX','FRQ 1、10']],'概念');
Q(6,18,6,'In a simplified catecholamine pathway, selective inhibition of DBH is expected to:',[
 ['Reduce norepinephrine synthesis downstream of dopamine','正确：DBH 催化 dopamine→NE。'],['Directly block choline uptake','这是不同系统的转运过程。'],['Convert all serotonin into epinephrine','不存在这样的分支。'],['Increase NE synthesis by accelerating the blocked step','阻断该步不能直接加速其产物生成。']],[['N6','p.5'],['EX','FRQ 10'],['B','PDF p.200–202']]);
Q(6,19,7,'Which order correctly describes serotonin synthesis?',[
 ['Tryptophan → 5 HTP → 5 HT','正确：先羟化，再脱羧。'],['Tyrosine → L DOPA → 5 HT','把儿茶酚胺路径混入。'],['Choline → GABA → 5 HT','不属于已知课堂合成链。'],['Glutamate → glycine → serotonin','不是 serotonin 的经典路径。']],[['N6','p.6'],['EX','FRQ 1']],'概念');
Q(6,20,7,'Blocking serotonin reuptake, with release otherwise maintained, usually:',[
 ['Prolongs serotonin availability outside the presynaptic cell','正确：清除减慢，受体暴露可延长。'],['Directly blocks every serotonin-synthesis enzyme','再摄取抑制不等于合成酶抑制。'],['Immediately removes all serotonin from the cleft','与阻断回收方向相反。'],['Has the same molecular target as blocking ChAT','SERT 与 ChAT 属于不同底物和功能层级。']],[['K6','Q7'],['N6','p.6']]);
Q(6,21,7,'Which statement about the first serotonin synthesis step is accurate?',[
 ['TPH catalyzes the step, and tryptophan availability can influence synthesis','正确：限速酶与底物可用量是互补层面。'],['TH and TPH are interchangeable names for the same catecholamine enzyme','TH 与 TPH 的底物与路径不同。'],['AChE converts tryptophan into 5 HTP','AChE 是 ACh 水解酶。'],['The step occurs only after serotonin binds its receptor','合成不由这一顺序定义。']],[['N6','p.6'],['B','PDF p.202–203']]);
Q(6,22,8,'Loss of GABAergic neurons in a mature circuit would generally tend to:',[
 ['Reduce inhibition and increase circuit excitability','正确：去除抑制输入可解除抑制。'],['Increase inhibition because GABA is always excitatory','常见成熟回路中 GABA 是主要抑制信号。'],['Directly increase the number of GAD-expressing cells','细胞减少不直接增加该细胞数量。'],['Make all synapses electrical','递质细胞丢失不自动改变所有突触结构。']],[['K6','Q3、11'],['N6','p.6']]);
Q(6,23,8,'Which intervention most directly decreases GABA synthesis?',[
 ['Inhibition of glutamic acid decarboxylase','正确：GAD 催化 glutamate→GABA。'],['Inhibition of GABA transaminase','降低降解通常有保留 GABA 的作用。'],['Inhibition of tyrosine hydroxylase','主要影响儿茶酚胺合成。'],['Activation of choline acetyltransferase','主要涉及 ACh 合成。']],[['K6','Q12'],['N6','p.6']]);
Q(6,24,8,'In a mature cell with Vm above ECl, opening a glycine-gated Cl⁻ channel generally causes:',[
 ['Net Cl⁻ influx and a shift of Vm toward ECl','正确：题设给出了驱动力条件。'],['Guaranteed Na⁺ efflux through the same Cl⁻-selective channel','选择性不支持这个方向的 Na⁺通量。'],['A Vm shift away from ECl regardless of driving force','被动通道通常把 Vm 拉向反转电位。'],['Degradation of glycine by ChAT','ChAT 是 ACh 合成酶。']],[['K6','Q10，补充电位条件'],['N5','p.8'],['B','PDF p.181–183、211–213']]);
Q(6,25,9,'Which comparison between transporters is correct?',[
 ['Plasma-membrane reuptake and vesicular filling move transmitter across different membranes','正确：位置和常见能量耦联都不同。'],['Every vesicular transporter uses extracellular Na⁺ directly in exactly the same way as SERT','不能把细胞膜再摄取机制套到所有囊泡。'],['AChE is the vesicular ACh transporter','AChE 是水解酶，VAChT 是装填转运体。'],['Transport and degradation are the same chemical reaction','转移底物与化学分解不同。']],[['N6','p.4–6'],['K6','Q6–7'],['B','PDF p.198–205']]);
Q(6,26,9,'A drug increases extracellular transmitter lifetime without binding its receptor. Which mechanism could explain it?',[
 ['Inhibition of a transmitter reuptake transporter','正确：清除减慢也能增加递质暴露。'],['It must be a direct receptor agonist','题设不结合受体，仍可通过清除机制起作用。'],['It must synthesize more receptor mRNA instantly','并非所观察现象的必要解释。'],['It must increase axon diameter','与递质细胞外停留时间无直接必然关系。']],[['K6','Q7'],['N6','p.5–6']]);
Q(6,27,9,'Blocking a vesicular transmitter transporter while leaving synthesis intact most directly causes:',[
 ['Reduced transmitter loading into release-ready vesicles','正确：递质可能存在于细胞质，但囊泡装填受损。'],['Complete inhibition of all postsynaptic receptors','不是直接靶点。'],['Conversion of a chemical synapse into a gap junction','膜结构不会据此自动改型。'],['An obligatory increase in quantal transmitter content','与装填受阻方向相反。']],[['K6','Q6'],['N5','p.6'],['B','PDF p.164–168、198–205']]);
Q(6,28,10,'Presynaptic stimulation no longer evokes a response, but local application of the normal transmitter still does. The result is most consistent with:',[
 ['An upstream failure of excitation/release with a responsive postsynaptic receptor pathway','正确：外源给药绕过前突触步骤，但不能再细分唯一上游故障。'],['Proof that all postsynaptic receptors have been eliminated','若所有受体失效，通常不能解释外源正常反应。'],['Proof that the transmitter is not involved','外源同递质反应恰支持下游可用。'],['A uniquely identified defect in only one named SNARE','能定位上游范围，但不能凭此锁定唯一分子。']],[['N6','p.2–3'],['EX','FRQ 2、7']],'实验');
Q(6,29,10,'Which order best links the three chapters during classical chemical transmission?',[
 ['Presynaptic AP → Ca²⁺ influx → vesicle fusion → receptor response → postsynaptic integration','正确：电→化学→电，并区分前后位置。'],['Postsynaptic AP → presynaptic receptor destruction → peptide translation in the cleft','顺序与位置均错。'],['AChE synthesis → gap-junction closure → Ca²⁺ creation from Na⁺','不是经典化学突触主链。'],['FISH staining → irreversible transmitter binding → no clearance','检测技术不是正常信号传递步骤。']],[['N5','p.6、8–11'],['EX','FRQ 7–8']],'概念');
Q(6,30,10,'Which intervention-and-rescue pair best separates a presynaptic release defect from loss of postsynaptic responsiveness?',[
 ['Block evoked release, then apply transmitter directly while recording the postsynaptic cell','正确：绕过释放环节观察下游反应。'],['Count two unrelated enzymes in different species','缺少同一通路的旁路检验。'],['Change receptor, transmitter and extracellular ions together','多变量干预无法清楚定位。'],['Record only one unstimulated action-potential trace','没有检验释放或下游受体反应。']],[['N6','p.2–3'],['B','PDF p.192–197']],'实验');
F(4,1,1,'Describe Na⁺/K⁺ flux, relative conductance and Vm during rest, the rising phase and repolarization.',[
 '静息 Vm 为负，K⁺漏电导相对占优势；泵维持梯度。','阈值去极化使电压门控 Na⁺通道迅速开放，g_Na 上升。','Na⁺内流使 Vm 上升并可越过 0，趋向 E_Na。','Na⁺通道失活，延迟 K⁺通道开放使 g_K 占优势。','K⁺外流使 Vm 向 E_K 复极，残余高 g_K 可造成 undershoot。'
],'At rest, Vm is negative and potassium leak conductance is relatively large. The pump maintains the concentration gradients over time. Depolarization to threshold rapidly activates voltage-gated sodium channels. Sodium influx increases gNa and drives Vm toward ENa, producing the rising phase and overshoot. Sodium channels then inactivate while delayed potassium channels open. Potassium efflux and the resulting dominance of gK drive repolarization toward EK. Persistently elevated potassium conductance can produce an undershoot before resting conditions are restored.','不要把下降支的直接原因写成泵突然加速；不要漏掉 conductance 比较。',[['EX','FRQ 8'],['N4','p.1、3–4'],['B','PDF p.132–143']]);
F(4,2,2,'Explain the state cycle of a voltage-gated Na⁺ channel and distinguish inactivation from ordinary closure.',[
 '静息通道关闭但可被激活。','阈值去极化快速打开激活门，允许 Na⁺内流。','开放后通道失活，持续去极化不能立即重新激活。','复极和时间允许解除失活，回到关闭可用态。','以可否被再次去极化打开区分 closed/available 与 inactivated。'
],'A resting voltage-gated sodium channel is closed but available. When depolarization reaches threshold, activation rapidly opens the channel and permits sodium influx. The channel subsequently becomes inactivated even if the membrane remains depolarized. Inactivated channels are temporarily unavailable for immediate reopening. Repolarization allows recovery from inactivation, returning the channel to a closed but activatable state. Thus ordinary closure and inactivation differ in whether a new depolarization can promptly activate the channel.','只画 open/closed 两态会漏掉解释绝对不应期所需的状态。',[['N4','p.3–4'],['K4','Q15、17'],['B','PDF p.136–140']]);
F(4,3,3,'Compare absolute and relative refractory periods. Calculate the ideal firing limit if the absolute period is 1 ms.',[
 '绝对期足够多 Na⁺通道失活。','绝对期加大刺激仍不能立即引发第二个正常 AP。','相对期部分 Na⁺通道恢复，但 K⁺电导仍较高或膜超极化。','相对期需更强刺激，正常方向传播与不应性有关。','1/(0.001 s)=1000 Hz，说明只是给定不应期设定的理想上限。'
],'During the absolute refractory period, sodium-channel inactivation prevents a second normal action potential even with a stronger stimulus. During the relative period, some sodium channels have recovered, but elevated potassium conductance and afterhyperpolarization make excitation more difficult. A stronger input can therefore elicit another spike. Refractoriness also helps explain normal forward propagation because recently activated membrane is less available for re-excitation. A 1 ms absolute period gives an ideal limit of 1/0.001 s, or 1000 Hz. Actual sustained firing may be lower.','不要写所有神经元固定以 1000 Hz 放电；单位必须从 ms 转为 s。',[['N4','p.4'],['K4','Q9–10'],['EX','bonus 33']]);
F(4,4,4,'Explain all-or-none firing and intensity coding. State two mechanisms that stabilize extracellular K⁺ in the CNS.',[
 '同一神经元相近条件下，阈下无再生 AP，达阈有完整 AP。','Na⁺通道开放与去极化的正反馈解释再生性。','强输入通常增加频率／改变时间模式，不成比例放大单 spike。','星形胶质细胞摄取和空间缓冲稳定局部外 K⁺。','BBB 控制血液与脑细胞外液的交换，限制血 K⁺波动对脑内环境的直接影响。'
],'For a given neuron under comparable conditions, a subthreshold input does not initiate a regenerative action potential. Once threshold is reached, voltage-dependent sodium-channel opening produces positive feedback and a full spike. Increasing a suprathreshold stimulus does not normally enlarge each spike in proportion to input strength. Instead, stronger sustained input can increase firing frequency, spike number or alter spike timing. Graded PSPs must be distinguished from this axonal output. Astrocytic uptake and spatial buffering help prevent local extracellular potassium accumulation. The blood-brain barrier limits uncontrolled exchange with blood and helps stabilize the brain extracellular ionic environment.','跨物种波形完全相同不是该原则；多个 AP 振幅相加不是总和机制。',[['EX','FRQ 9'],['N4','p.1–2'],['K4','Q2–3、7–8']]);
F(4,5,5,'Use Iion = gion(Vm − Eion) to explain why maximal Na⁺ conductance need not coincide with maximal inward Na⁺ current.',[
 '写出公式并定义 g、Vm、E_ion。','说明外向正的膜电流符号约定。','Na⁺内流时 Vm<E_Na，内向电流为负。','去极化接近 E_Na 会降低驱动力，与 g_Na 的增加竞争。','指出 g=0 或 Vm=E_ion 均可导致零净电流。'
],'Iion equals gion multiplied by the driving force Vm minus Eion. With outward-positive membrane current, sodium current is inward and negative when Vm is below ENa. During the rising phase, sodium conductance increases, but depolarization also brings Vm closer to ENa and reduces the magnitude of the driving force. The peak inward current therefore depends on the product of conductance and driving force, rather than conductance alone. Current is zero if the relevant conductance is zero or if Vm equals the equilibrium potential, even when channels are open.','不要将电压峰值、最大电导和最大内流当同一个时刻。',[['K4','Q11'],['N4','p.1、4'],['B','PDF p.132–134']]);
F(4,6,6,'Using the Nernst equation, predict how lower extracellular K⁺ and lower extracellular Na⁺ affect the AP waveform when considered separately.',[
 '写 E_ion=(RT/zF)ln(out/in)，说明温度等条件不变。','降低外 K⁺使 E_K 更负。','K⁺电导占优势的静息／undershoot 向更负方向变化。','降低外 Na⁺使 E_Na 较不正，峰值通常降低。','区分两种单独操作和主导阶段，不声称全部波形等量平移。'
],'The Nernst equation is Eion = (RT/zF) ln([ion]out/[ion]in). With other conditions fixed, lowering extracellular potassium decreases the positive-ion concentration ratio and makes EK more negative. This tends to make the K-dominated resting potential and undershoot more negative. Separately lowering extracellular sodium makes ENa less positive and tends to reduce the action-potential peak. These predictions concern the ion whose conductance is important at each phase; they do not mean that every part of the waveform shifts equally or that changing EK alone determines the sodium-dominated peak.','原卷 FRQ 4 的图 2 未出现在提供页面中，故练习给出明确浓度操作，不臆测缺失图。',[['EX','FRQ 4；MCQ 2、9、19；bonus 31'],['N4','p.1、4'],['B','PDF p.110–120、132–143']]);
F(4,7,7,'Explain why larger diameter and myelination increase conduction velocity, and distinguish velocity from end-to-end travel time.',[
 '较大直径降低轴向电阻。','髓鞘提高膜电阻、减少电流漏失。','髓鞘降低膜电容，有利于节间快速被动传播。','结区电压门控通道再生 AP，形成跳跃传导。','使用 t=L/v，长度单独增加可增加时间而不改变速度。'
],'A larger axon diameter lowers axial resistance, allowing local current to spread more effectively. Myelin increases membrane resistance and reduces current leakage while lowering membrane capacitance. Current can therefore spread rapidly through the internode and depolarize the next node of Ranvier. Voltage-gated channels at nodes regenerate the action potential, producing saltatory conduction. These properties affect conduction velocity. In contrast, increasing total length at unchanged velocity increases the end-to-end travel time according to t = L/v; length alone does not make local propagation faster.','“AP 跳过所以快”缺少机制；不要把 total axon length 当作 speed 的决定因素。',[['N4','p.5'],['EX','MCQ 17、22'],['B','PDF p.144–148']]);
F(4,8,8,'Compare how TTX and batrachotoxin disrupt signaling despite acting differently on Na⁺ channels.',[
 'TTX 阻断敏感电压门控 Na⁺通道。','TTX 减弱再生 Na⁺内流与传播。','Batrachotoxin 干扰正常门控，促进持久活性／去极化。','持续去极化破坏正常重复放电，并非等同于正常持续编码。','指出同样信号失败不证明相同机制，也不等于组织被摧毁。'
],'TTX blocks sensitive voltage-gated sodium channels and prevents the regenerative sodium influx needed for normal spike initiation and propagation. Batrachotoxin instead disrupts normal sodium-channel gating and can maintain abnormal channel activation and depolarization. Persistent depolarization prevents the membrane from cycling normally through excitation and recovery, so normal repeated signaling can also fail. Similar downstream failure therefore does not imply identical molecular action. Neither explanation requires claiming that the target tissue has been physically destroyed.','不要把两个毒素都写成 Na⁺孔道阻断；prolonged open 不等于正常高频 spike。',[['N4','p.4–5'],['EX','MCQ 6'],['B','PDF p.141–143']]);
F(4,9,9,'Design an electrophysiological comparison of Na⁺ and K⁺ channel kinetics, and identify a method for resolving single-channel events.',[
 '电压钳施加一致的电压命令。','记录维持该电压所需膜电流及时间进程。','用适当阻断／离子条件分离 Na⁺与 K⁺电流。','预测 Na⁺快激活再失活，延迟 K⁺较慢激活。','膜片钳高阻封接可记录单通道开闭，说明测量尺度。'
],'Use voltage clamp to impose the same voltage step on the preparation and record the membrane current over time. Appropriate blockers or ion substitution can isolate sodium and potassium components under matched conditions. A transient rapidly activating sodium current should be distinguished from the more delayed potassium current. Replicate recordings and matched voltage commands reduce confounding. For single-channel events, a high-resistance patch-clamp seal around a small membrane patch can resolve discrete opening and closing currents. Whole-cell waveforms alone do not identify the current of one channel.','明确 controlled Vm 与 measured I；不能把仅看 spike 波形当成分离单通道电流。',[['N4','p.3、6'],['K4','Q12、14'],['B','PDF p.134–140']]);
F(4,10,10,'Compare classic ChR2 and halorhodopsin and describe a control for opsin-dependent optical stimulation.',[
 'ChR2 为蓝光激活的阳离子通道。','常见静息条件下净内向电流使 Vm 去极化。','Halorhodopsin 为黄光驱动的内向 Cl⁻泵，通常抑制。','区分被动通道与主动泵，不称 ChR2 只通 Na⁺。','用未表达 opsin 的匹配细胞接受相同光照作对照。'
],'Classic ChR2 is a blue-light-activated cation channel. Near the usual neuronal resting potential, it produces a net inward current and depolarization. Classic halorhodopsin is a yellow-light-driven inward chloride pump that generally hyperpolarizes cells and inhibits firing. The proteins therefore differ in transported charge, mechanism and typical effect. ChR2 should not be described as exclusively sodium-selective, and halorhodopsin should not be confused with a passive chloride channel. Matched cells lacking the introduced opsin should receive the same light and recording conditions to test opsin dependence.','不使用课堂页上未核验的奖项记号作为证据；光效应依赖实际表达的蛋白。',[['N4','p.2'],['K4','Q18–19'],['B','PDF p.130–132']]);
F(5,1,1,'Compare chemical and electrical synapses using structure, transmitted signal, delay and directionality.',[
 '电突触为配对 connexon 的 gap junction，直接传流。','化学突触有释放囊泡、间隙与突触后受体。','化学传递包含释放扩散和受体激活，电传递延迟极小。','经典化学突触通常单向；电突触常双向但有整流例外。','说明电耦联利于同步，且两种都可引起突触后电位变化。'
],'Electrical synapses couple cells through gap-junction channels formed by paired connexons, allowing direct current flow. Chemical synapses use presynaptic vesicle release, diffusion across a cleft and postsynaptic receptors. Electrical transmission has very little delay, whereas chemical transmission includes release and receptor-related delay. Classical chemical synapses are usually functionally unidirectional. Electrical coupling is often bidirectional, although rectifying junctions exist. Direct coupling can synchronize neighboring neurons. Both forms can influence postsynaptic voltage, so the presence of a PSP alone does not identify chemical transmission.','比较必须对齐维度；不要把 chemical cleft 写成 gap junction。',[['EX','FRQ 3'],['N5','p.1–2'],['K5A','Q3–6']]);
F(5,2,2,'Explain Loewi’s bath-transfer experiment, one suitable control and the limits of its conclusion.',[
 '刺激第一颗心迷走神经，观察心率下降。','转移浴液到未受直接刺激的第二颗心，也下降。','推断可扩散／可转移的化学介质参与。','对照使用未刺激浴液且保持转移与溶液条件匹配。','不推出所有突触均为化学；分子身份需进一步鉴定。'
],'Stimulating the vagus nerve of the first isolated heart slows its beating. Bath fluid from this preparation is then transferred to a second heart that has not received the electrode stimulus. Slowing of the second heart supports a transferable chemical mediator rather than requiring direct electrical contact between the hearts. A matched transfer of fluid collected before stimulation controls for the transfer procedure and solution. The observation does not establish that all synapses are chemical, and additional work is required to identify the mediator, later recognized as acetylcholine.','先观察后推断；不要把第二心描述为直接受到同一电极刺激。',[['N5','p.7–8'],['K5A','Q2'],['EX','MCQ 1、20']]);
F(5,3,3,'Distinguish Gray type I and type II synapses and explain why morphology alone is not a complete functional test.',[
 'I 型不对称且突触后致密带较明显。','I 型常圆囊泡、通常兴奋。','II 型较对称、常扁囊泡。','II 型通常抑制。','用受体、电导／反转电位或电生理验证功能，不将通常关系绝对化。'
],'Gray type I synapses classically have an asymmetric, prominent postsynaptic density and relatively round vesicles, and they are usually excitatory. Type II synapses are more symmetric, often with flattened vesicles, and are usually inhibitory. These are useful morphological associations, not a substitute for measuring function. The postsynaptic receptor and the relevant reversal potentials help determine whether activation increases or decreases spike probability. Functional recordings or receptor-specific tests should therefore accompany a strong claim about excitation or inhibition.','I／II 是形态关联分类；别把 II 型归为电突触。',[['EX','FRQ 3'],['N5','p.4'],['K5A','Q10、12']]);
F(5,4,4,'Outline classical chemical transmission and explain the structural basis for rapid release.',[
 'AP 抵达末梢并打开电压门控 Ca²⁺通道。','Ca²⁺在局部微域升高并由传感器检测。','预先 docking/priming 的囊泡经 SNARE 机器融合胞吐。','递质扩散，结合突触后受体并产生电导／信号变化。','Ca²⁺通道与备好囊泡紧邻减少延迟；不是等全轴突积累 Ca²⁺。'
],'An arriving action potential depolarizes the terminal and opens voltage-gated calcium channels. Calcium enters and forms a local high-concentration microdomain near release-ready vesicles. A calcium sensor such as synaptotagmin triggers SNARE-mediated fusion of already docked and primed vesicles with the presynaptic membrane. Released transmitter diffuses across the cleft and activates postsynaptic receptors, changing conductance or intracellular signaling. Rapid release is possible because the machinery is prepared in advance and calcium channels are close to vesicles; uniform calcium accumulation throughout the axon is unnecessary.','顺序不能把 docking 一律放在 AP 后；融合对象是突触前膜。',[['EX','FRQ 7；MCQ 15、18'],['N5','p.6'],['B','PDF p.168–170']]);
F(5,5,5,'Compare synthesis, packaging, transport and release requirements of typical small-molecule and peptide transmitters.',[
 '许多小分子在末梢由酶合成，并以转运体装小透明囊泡。','肽前体在胞体 rER 合成并由 Golgi 处理。','肽装致密芯颗粒，沿微管顺向运输至末梢。','局部低频 Ca²⁺信号较易触发近 active zone 的小囊泡。','肽释放通常需更强持续高频和较广 Ca²⁺升高，可与小分子共释放。'
],'Many small-molecule transmitters are synthesized enzymatically in terminals and loaded into small clear vesicles by transporters. Their enzymes are supplied from the soma. Peptide precursors are synthesized in somatic rough ER, processed through the Golgi and packaged in dense-core granules for anterograde axonal transport. Small vesicles near active-zone calcium channels can respond to local calcium signals from relatively low-frequency activity. Peptide granules often require the broader calcium elevation produced by stronger sustained activity. High-frequency peptide release can accompany small-molecule release rather than replacing it.','不要将“小分子在末梢合成”推广成合成酶也无需胞体；高频不等于只放肽。',[['N5','p.5–6'],['K5B','Q1–2、5–6'],['EX','MCQ 3']]);
F(5,6,6,'Describe three mechanisms of transmitter clearance and distinguish them from vesicle membrane recycling.',[
 '扩散离开突触间隙。','特异转运体将递质或相关底物摄取进神经元／胶质。','特定酶降解，例 AChE 水解 ACh 为 acetate 和 choline。','清除减少持续受体暴露，支持终止与时序分辨。','胞吞回收囊泡膜，随后重装填，不等于所有游离递质胞吞。'
],'Transmitter can leave the cleft by diffusion, be taken up by specific neuronal or glial transporters, or be broken down by appropriate enzymes. At cholinergic synapses, acetylcholinesterase hydrolyzes ACh to acetate and choline, and choline is recovered for resynthesis. These mechanisms limit receptor exposure and help terminate the signal accurately. Vesicle membrane recycling is different: endocytosis retrieves membrane after exocytosis so that vesicles can be reused and refilled. It should not be described as the universal uptake mechanism for free small-molecule transmitter.','清除信号、回收 choline、回收膜三个对象分别写。',[['N5','p.7'],['N6','p.4'],['K5B','Q4、10']]);
F(5,7,7,'Explain how ACh can excite skeletal muscle and inhibit cardiac activity, comparing receptor mechanisms.',[
 '骨骼肌使用 nicotinic ACh receptor。','nAChR 为阳离子通道，常见 Vm 下净内向电流产生 EPP。','心脏减速主要由 muscarinic M2 受体通路。','G 蛋白可提高 K⁺电导／改变起搏细胞信号使心率下降。','结论为受体亚型与效应器决定作用，非递质名决定唯一效应。'
],'At the skeletal neuromuscular junction, ACh activates nicotinic receptors, which are ligand-gated cation channels. At the usual resting potential their net inward current produces an endplate depolarization. In the heart, ACh acting through muscarinic M2 receptors engages G-protein signaling, including increased potassium conductance and altered pacemaker signaling, reducing cardiac rate. Thus the same transmitter can produce different effects because receptor subtypes and downstream effectors differ. An agonist of a receptor is not necessarily excitatory at the cellular or circuit level.','不能把心脏也一律写 nAChR；“agonist＝EPSP”错误。',[['N5','p.8'],['N6','p.3'],['K5B','Q8']]);
F(5,8,8,'Compare spatial and temporal summation and explain the importance of the spike-initiation region.',[
 '空间总和：不同位置的 PSP 时间重叠。','时间总和：重复输入在前次 PSP 未衰减前到来。','PSP 为分级信号，可结合兴奋与抑制输入。','位置、幅度、时序与被动膜性质影响起始区的净去极化。','初始段 Na⁺通道达到再生阈值才产生 AP；单一 CNS 输入可有 EPSP 但无 AP。'
],'Spatial summation combines overlapping PSPs generated at different synaptic locations. Temporal summation occurs when repeated inputs arrive before earlier PSPs have decayed. These graded signals, including inhibitory effects, are integrated according to their timing, amplitude, location and the passive membrane properties. The resulting voltage at the axon initial segment determines whether voltage-gated sodium channels reach regenerative threshold. A single CNS input may therefore generate a real EPSP without triggering a postsynaptic AP. Summation concerns PSPs, not the addition of propagated spike amplitudes.','同位置短间隔是 temporal；不要把“没有输出 spike”写为“没有 EPSP”。',[['N5','p.9–11'],['K5A','Q15–18'],['K5B','Q12、15–17'],['EX','MCQ 27']]);
F(5,9,9,'Explain shunting inhibition with ECl near rest. State three other physical influences on the length constant.',[
 'Cl⁻电导升高使输入／膜电阻降低，即使静息 Vm 变化小。','相同兴奋电流产生较小 ΔV=IR，降低到阈值可能性。','λ=√(r_m/r_i) 因膜电阻降低而减小，EPSP 传播衰减更快。','更大直径降低轴向电阻，髓鞘提高膜电阻，均可增加 λ。','更低细胞内电阻率可降低轴向电阻并增大 λ；一致说明变量定义。'
],'When chloride reversal is near rest, opening chloride channels can leave resting Vm nearly unchanged while increasing membrane conductance and lowering input resistance. The same excitatory current then produces a smaller voltage change, reducing spike probability. In a consistent cable model, lambda equals the square root of membrane resistance per unit length divided by axial resistance per unit length. Lower membrane resistance reduces lambda and shortens the spread of an EPSP. Larger diameter, myelination and lower intracellular resistivity can increase lambda through their effects on these resistances.','三因素用直径、髓鞘、细胞内电阻率；不要把 R_m 与 g_m 写成同方向变化。',[['EX','FRQ 5'],['N5','p.10–11'],['B','PDF p.179–183']]);
F(5,10,10,'State three adaptations that make a normal NMJ reliable and explain how they produce a safety factor.',[
 '多释放位点／较大接触区，有利于释放多囊泡。','较大 ACh 囊泡释放使单次输入产生较大 EPP。','密集 nAChR 和／或突触后皱褶提供较强受体响应。','EPP 通常超出触发肌肉 AP 所需去极化，给出阈值余量关系。','AChE 支持信号及时终止与重复响应，并限定为正常生理高可靠性。'
],'A normal NMJ has a large specialized contact with many active zones and can release many ACh-containing vesicles after one motor-neuron spike. Dense nicotinic receptors and postsynaptic junctional folds support a large endplate response. The resulting EPP normally exceeds the depolarization needed to trigger a muscle action potential, providing a safety margin rather than merely reaching threshold. Acetylcholinesterase helps terminate each chemical signal so subsequent inputs remain temporally distinct. This high reliability applies to normal physiological conditions and is not an absolute guarantee under receptor loss, toxins or other disruptions.','至少三个结构→功能配对；不要只抄 fail safe 或固定囊泡数。',[['EX','FRQ 6'],['MS','FRQ 6'],['N5','p.5、10']]);
F(6,1,1,'State three classical criteria for identifying a neurotransmitter and connect each to an appropriate type of evidence.',[
 '突触前神经元合成并储存候选物。','刺激时释放候选物，可检验 Ca²⁺依赖性。','外源局部施加模仿正常内源突触后反应。','将 IHC／ISH 定位或释放测量正确对应到相关判据。','同一拮抗剂对外源及内源反应的阻断增强功能一致性，不将定位单独视为完成鉴定。'
],'A classical vesicular transmitter is synthesized and stored in the presynaptic neuron, is released when that neuron is stimulated, and mimics the endogenous postsynaptic response when applied experimentally. Localization by immunohistochemistry or in situ hybridization can support synthesis or presence. A release assay before and after stimulation, with calcium controls, addresses release. Local application during postsynaptic recording addresses mimicry. Similar antagonist sensitivity of endogenous and applied responses strengthens the receptor-level connection. No single localization result establishes all three requirements.','三条判据不是三个方法名；外源反应需要与正常内源反应比较。',[['EX','FRQ 2'],['N6','p.1–3'],['MS','FRQ 2']]);
F(6,2,2,'Compare IHC and FISH for identifying a transmitter phenotype, including target, recognition mechanism, readout and limits.',[
 'IHC 用特异抗体结合递质相关抗原或合成酶。','FISH 用互补核酸探针识别相关 mRNA。','IHC 定位分子／蛋白；FISH 的荧光读出定位转录本。','给正确例子，如 ChAT／TH／GAD 抗原或酶 mRNA，并提及特异性对照。','二者主要证明定位／合成能力，不独立证明刺激释放；放射性 ISH 不笼统叫 FISH。'
],'IHC uses antibodies that specifically recognize a candidate molecule or a synthetic-enzyme antigen, such as ChAT, TH or GAD. A labeled antibody reveals its distribution. FISH instead uses a complementary nucleic-acid probe to detect an appropriate mRNA and visualizes a fluorescent signal. For a small-molecule transmitter, the target is often a transcript encoding a synthetic enzyme rather than an mRNA encoding the small molecule itself. Specificity controls are required. Both methods provide localization-related evidence but do not independently demonstrate evoked release or postsynaptic mimicry.','不要写“抗体与 mRNA 碱基互补”；FISH 的 F 有明确荧光含义。',[['N6','p.1–2、4'],['K6','Q2'],['EX','FRQ 2'],['B','PDF p.189–192']]);
F(6,3,3,'Design a test of stimulation-dependent release and postsynaptic mimicry for candidate X in a brain-slice preparation.',[
 '保持切片活性，测基线并有未刺激对照。','刺激突触前输入并比较 X 释放量。','去 Ca²⁺或 Ca²⁺通道干预检验释放依赖并控制活性。','局部施加 X 并记录其与内源刺激的突触后反应。','同一拮抗剂比较两种反应，说明每项支持的有限结论。'
],'Maintain an oxygenated, nourished slice and measure baseline X in a matched unstimulated condition. Stimulate the relevant presynaptic input and test whether X release increases. Repeat with extracellular calcium removed or calcium entry reduced while checking tissue viability. Then apply X locally using an appropriate delivery method and record the postsynaptic response, comparing it with the endogenous response. A receptor antagonist should be tested against both. The combined results address release and mimicry; localization evidence is still needed to establish presynaptic synthesis and storage.','把营养撤除导致死亡当作 Ca²⁺依赖证明会失去因果解释。',[['N6','p.2–3'],['EX','FRQ 2'],['B','PDF p.190–194']]);
F(6,4,4,'Define agonist and antagonist, give matched ACh-receptor examples, and explain why an agonist need not excite a cell.',[
 'Agonist 结合并激活受体。','Antagonist 阻止／降低激动剂引起的激活，不以持续时间定义。','正确配对 nicotine／curare 与 nAChR。','正确配对 muscarine／atropine 与 muscarinic receptor。','激动抑制性通路可降低放电，如心脏 muscarinic 通路；效应取决于受体和效应器。'
],'An agonist binds a receptor and activates its signaling, whereas an antagonist reduces receptor activation by an agonist without producing the same activation. Nicotine and curare are classic agonist and antagonist examples at nicotinic ACh receptors. Muscarine and atropine provide a corresponding example for muscarinic receptors. Agonism describes receptor activation, not a guaranteed EPSP. Activation of a receptor coupled to an inhibitory pathway, such as the cardiac muscarinic pathway, can reduce cellular activity. Duration alone does not distinguish an agonist from an antagonist.','拮抗剂可能解除抑制；“antagonist 就是产生 IPSP”不成立。',[['EX','FRQ 10；MCQ 10、23'],['N6','p.3'],['B','PDF p.194–197']]);
F(6,5,5,'Outline the cholinergic cycle: limiting supply, synthesis, packaging, degradation and recovery.',[
 'Na⁺依赖高亲和 choline 摄取是课堂强调的限速供给。','ChAT：acetyl CoA + choline → ACh + CoA。','VAChT 将 ACh 装囊泡，区别细胞膜 choline 转运。','AChE 水解 ACh 为 acetate 与 choline。','回收 choline 用于再合成，不称主要回收完整 ACh。'
],'High-affinity sodium-dependent uptake supplies choline and is the classroom-emphasized limiting step for ACh synthesis. Choline acetyltransferase combines choline with acetyl CoA to form ACh and CoA. The vesicular ACh transporter loads ACh into vesicles using the vesicular proton gradient. After release, acetylcholinesterase hydrolyzes ACh to acetate and choline. Choline is then taken back into the terminal for resynthesis. The plasma-membrane choline transporter, vesicular ACh transporter, ChAT and AChE therefore occupy different steps and must not be treated as interchangeable.','评分标准表格的 Amount of ACh 需校正；ChAT 与 AChE 不可互换。',[['EX','FRQ 1'],['N6','p.4'],['K6','Q1、4、6'],['B','PDF p.198–200']]);
F(6,6,6,'State the catecholamine synthesis sequence with enzymes, identify its rate-limiting step and predict a DBH block.',[
 'Tyrosine —TH→ L DOPA，限速步。','L DOPA —AADC/DDC→ dopamine。','Dopamine —DBH→ norepinephrine。','Norepinephrine —PNMT→ epinephrine。','阻断 DBH 降低 NE 及其下游合成；在简化模型中上游 dopamine 可积累。'
],'Tyrosine hydroxylase converts tyrosine to L DOPA in the classical rate-limiting step. AADC, also called DOPA decarboxylase, converts L DOPA to dopamine. Dopamine beta-hydroxylase converts dopamine to norepinephrine, and PNMT converts norepinephrine to epinephrine. Thus L DOPA, not tyrosine, is the immediate precursor of dopamine. A DBH block reduces production of norepinephrine and its downstream product while dopamine may accumulate in the simplified pathway. Cells require the appropriate enzymes; not every dopaminergic neuron necessarily completes the entire sequence.','图和文字都不能跳过 L DOPA；不要把 tyrosine hydroxylase 和 tryptophan hydroxylase 混写。',[['EX','FRQ 1、10；bonus 34'],['N6','p.5'],['B','PDF p.200–202']]);
F(6,7,7,'Compare serotonin and dopamine with respect to precursor pathway, limiting factors and termination.',[
 '5 HT 来自 tryptophan→5 HTP→5 HT，涉及 TPH 和 AADC。','DA 来自 tyrosine→L DOPA→DA，涉及 TH 和 AADC。','区分 TPH 与 TH；tryptophan 可用量影响 5 HT 合成，TH 是儿茶酚胺经典限速酶。','相应细胞膜 Na⁺依赖转运体可进行再摄取。','MAO 参与单胺代谢，catecholamines 还可涉及 COMT，不把清除等同于合成。'
],'Serotonin is synthesized from tryptophan through 5 HTP, using tryptophan hydroxylase and AADC. Dopamine is synthesized from tyrosine through L DOPA, using tyrosine hydroxylase and AADC. TPH and TH are different enzymes. Tryptophan availability can influence serotonin synthesis, whereas TH catalyzes the classical rate-limiting catecholamine step. Following release, appropriate sodium-dependent transporters recover the monoamines. MAO participates in monoamine metabolism; catecholamine metabolism can also involve COMT. Reuptake, degradation and synthesis describe different parts of each system.','课堂写底物量与教材写限速反应不必互相排斥；ACh 不是这一 monoamine 比较的一员。',[['EX','FRQ 1'],['N6','p.5–6'],['B','PDF p.200–203']]);
F(6,8,8,'Explain how inhibiting GAD differs from inhibiting GABA transaminase, and predict the usual circuit effect of losing GABAergic neurons.',[
 'GAD 催化 glutamate 脱羧生成 GABA。','抑制 GAD 通常减少 GABA 合成。','GABA transaminase 参与降解；抑制其作用可减少 GABA 代谢。','成熟回路中 GABA 常通过 GABA_A／GABA_B 通路降低放电可能性。','失去 GABAergic 细胞通常减弱抑制、增加兴奋性；说明是一般回路条件。'
],'GAD converts glutamate to GABA, so inhibiting GAD directly reduces GABA synthesis. GABA transaminase participates in GABA metabolism; inhibiting it reduces breakdown rather than synthesis. These manipulations therefore affect different sides of transmitter availability. In a typical mature circuit, GABAergic transmission through GABA_A or GABA_B pathways lowers spike probability. Loss of GABAergic neurons generally removes inhibition and increases circuit excitability. The effect should be interpreted with the receptor and ionic conditions in mind rather than assuming that a transmitter name fixes every response.','不要把抑制合成酶与抑制降解酶都写成“递质减少”。',[['N6','p.6'],['K6','Q3、11–12'],['B','PDF p.203–205、211–213']]);
F(6,9,9,'Compare inhibiting synthesis, vesicular loading, reuptake and receptor binding in one transmitter pathway.',[
 '合成酶抑制减少新递质供给，可能有已有储备的时间效应。','囊泡装填抑制减少每囊泡可释放递质，不直接等于细胞质无递质。','细胞膜再摄取抑制通常延长细胞外递质暴露。','受体拮抗减少同等递质水平下的相应受体激活。','区分作用位置，说明其他条件固定和不能仅凭表型锁定唯一机制。'
],'Inhibiting a synthetic enzyme reduces new transmitter supply, although existing stores may delay the effect. Blocking a vesicular transporter impairs loading and release content even if transmitter remains in the cytoplasm. Inhibiting plasma-membrane reuptake usually prolongs extracellular transmitter exposure when release is maintained. A receptor antagonist instead reduces the receptor response at a given transmitter concentration. These interventions act at different locations, and similar postsynaptic changes do not uniquely identify which step failed. Predictions should state that other relevant conditions are held fixed.','更多突触外递质不能单独证明 direct agonism；合成减少不必立刻清空所有囊泡。',[['N6','p.4–6'],['K6','Q4、6–7'],['EX','FRQ 1'],['B','PDF p.198–205']]);
F(6,10,10,'A drug abolishes the response to presynaptic stimulation. Design a bypass test and explain what it can and cannot locate.',[
 '在对照与药物条件下记录同一突触后细胞反应。','比较前突触刺激与局部直接施加正常递质。','若直接给药仍有效，支持受体／下游可用及上游激发或释放障碍。','若直接给药也失效，需考虑受体／下游、剂量和活性等，不能草率唯一定位。','加前突触 AP／Ca²⁺或释放量测量进一步定位，并陈述推断边界。'
],'Record the postsynaptic cell under matched control and drug conditions, comparing presynaptic stimulation with direct local application of the normal transmitter. If stimulation fails but direct application still works, the receptor pathway remains responsive and an upstream excitation or release defect is supported. This does not uniquely identify a particular calcium channel or SNARE. If both responses fail, postsynaptic effects, application conditions and cell viability must be examined. Recording presynaptic spikes, calcium entry or transmitter release can further separate upstream steps. The bypass test localizes a range of mechanisms rather than proving one molecular target.','rescue 说明被绕过步骤范围，不等于锁定唯一分子；保留匹配对照。',[['N6','p.2–3'],['EX','FRQ 2、7'],['B','PDF p.192–197']]);
const mocks=[];
for(let i=0;i<3;i++){
 const mc=mcq.filter(q=>(Number(q.id.slice(-2))-1)%3===i).map(q=>q.id);
 const fq=[4,5,6].flatMap((ch,j)=>frq.filter(q=>q.chapter===ch&&(Number(q.id.slice(-2))-1)%3===(i-j+3)%3).map(q=>q.id));
 mocks.push({id:`mock${i+1}`,title:`模拟卷 ${'ABC'[i]}`,mcq:mc,frq:fq,minutes:90});
}
const priorities=[
 {topic:'c5-t4',title:'Ca²⁺、active zone 与 SNARE',mcq:'常用 NOT 题或 v/t SNARE 位置互换；记住预先备好囊泡与局部微域。',frq:'按前突触 AP→Ca²⁺→传感器→融合→受体写，并解释快速的空间基础。',evidence:[['EX','MCQ 15、18；FRQ 7'],['K5B','Q3'],['N5','p.3、6']]},
 {topic:'c5-t9',title:'λ、被动衰减与分流抑制',mcq:'重点辨认 R 与 g 的反向关系、37% 和更大 λ 的意义。',frq:'E_Cl 接近静息时仍可抑制；必须写出电导、电阻、电压响应与传播的链。',evidence:[['EX','MCQ 5；FRQ 5'],['K5A','Q11'],['K5B','Q13–14、18'],['N5','p.10–12']]},
 {topic:'c4-t1',title:'AP 阶段、Na⁺/K⁺电导与 Nernst',mcq:'改变 E_K 看静息／undershoot，改变 E_Na 看 peak；不要只看 Vm 正负判电流。',frq:'按阶段列 flux、conductance、Vm；浓度变化用 Nernst 比值解释。',evidence:[['EX','MCQ 2、9、19；bonus 31；FRQ 4、8'],['K4','Q6、11、15–17'],['N4','p.1、3–4']]},
 {topic:'c6-t5',title:'ACh 合成、装填与清除',mcq:'ChAT、AChE、choline uptake 与 vesicular transporter 的靶点经常换位。',frq:'合成反应、choline 限速供给、AChE、水解后再摄取必须齐全。',evidence:[['EX','MCQ 8；FRQ 1'],['K6','Q1、4、6'],['K5B','Q10'],['N6','p.4']]},
 {topic:'c5-t1',title:'电／化学突触与 Gray I／II',mcq:'6 connexin＋2 connexon；结构名与方向、同步、受体需求分别判断。',frq:'对齐结构、信号、延迟、方向；Gray 分类使用通常兴奋／抑制。',evidence:[['EX','MCQ 11、30；FRQ 3'],['K5A','Q3–6、10、12'],['N5','p.1–4']]},
 {topic:'c5-t10',title:'NMJ 可靠性与突触总和',mcq:'单个 CNS AP 可以产生 EPSP；没有输出 AP 不等于没有传递。',frq:'写三个 adaptation→function 配对；安全系数不是绝对永不失败。',evidence:[['EX','MCQ 27；bonus 35；FRQ 6'],['K5A','Q13–18'],['K5B','Q11–12、15–17'],['N5','p.5、9–11']]},
 {topic:'c6-t1',title:'递质三判据与 IHC／FISH',mcq:'区分 antigen、mRNA、release 和 response；定位阳性不能替代全部证据。',frq:'三判据各接方法；只要求一个技术时也写靶标、过程、读数。',evidence:[['EX','FRQ 2'],['K6','Q2'],['N6','p.1–3']]},
 {topic:'c6-t6',title:'儿茶酚胺路径与药理干预',mcq:'直接前体 L DOPA；区分 agonist、reuptake blocker 和 enzyme inhibitor。',frq:'完整路径加每步酶；对比 monoamine 与 ACh 的清除和限速因素。',evidence:[['EX','MCQ 10、23；bonus 34；FRQ 1、10'],['K6','Q5、7、12–13'],['N6','p.3–6']]},
 {topic:'c4-t3',title:'全或无、不应期与编码',mcq:'绝对期来自 Na⁺失活；1 ms→1000 Hz 是理想上限，强刺激一般改变频率。',frq:'同时给阈值、正反馈和强度编码；不要把跨物种一致性加入定义。',evidence:[['EX','bonus 33；FRQ 9'],['K4','Q2–3、7–10、15–17'],['N4','p.1–4']]}
];
const examAudit=[
 [1,'C','C','ACh 是经典最早发现的递质。'],[2,'A','A','E_K 更负使相对静息的 undershoot 可更深；需说明比较量。'],[3,'A','A','持续较强活动较易触发肽颗粒释放。'],[4,'B','B','ATP 供给中断使泵无法持续维持梯度，梯度逐渐耗散。'],[5,'C','C','更大 λ 使 EPSP 到起始区前衰减较少；抑制输入也可受传播性质影响。'],[6,'A','A','Saxitoxin 阻断敏感电压门控 Na⁺通道。'],[7,'A','A','课堂 K⁺ out/in = 5/100 = 0.05；课件是 mM，不是 Kahoot 的 μM 简写。'],[8,'D','D','AChE 水解 ACh，终止信号。'],[9,'C','B（简化模型）','照片 C 与峰值主要由 Na⁺性质决定的简化模型不符；增加内 K⁺主要改变 E_K、静息和 undershoot。练习已明确条件。'],[10,'C','C','结合并模仿受体激活为 agonist。'],[11,'D','D','配对 connexon 构成电突触通道。'],[12,'C','C（按题设阳离子净内流）','Mg²⁺净内流可使膜内更正；题目为电荷方向判断，不代表它是通常 AP 上升支的载流离子。'],[13,'D','与第 12 题相同，应同解','原卷 12/13 题干与选项完全重复；照片答案不同，不作为两次独立高频证据或两道练习。'],[14,'B','B','阴离子 z<0，正 E_Z−对应较高的细胞内浓度。'],[15,'D','D','局部 active-zone 微域足够；全轴突 Ca²⁺积累不是快速释放机制。'],[16,'B','B','以 volt 衡量的电位与电流、电导不同。'],[17,'A','A','直径增大降低轴向电阻，有利于速度增加。'],[18,'D','D','v 在 vesicle，t 在突触前 target membrane。'],[19,'C','C','降低外 K⁺使 E_K 更负，静息 Vm 通常更负。'],[20,'D','D','Loewi 的浴液转移支持化学介质。'],[21,'D','B','题设 [A⁻]_out 更高，插入阴离子通道后初始负电荷内流，内侧更负；照片 D 与所给浓度方向冲突。'],[22,'B','B','长度单独变化不直接改变局部传导速度，但改变到达时间。'],[23,'B','B','刺激 dopamine receptor 的药物在该受体是 agonist。'],[24,'C','C','给定选项中 BBB 参与脑内 K⁺环境控制；完整回答还包括 astrocytes。'],[25,'B','B','细胞间信息传递位点为 synapse。'],[26,'C','C','10 Ω 电阻最大，g 最小。'],[27,'D','D','最终取决于多输入 PSP 整合。'],[28,'D','D（典型成熟细胞条件）','Glycine 门控 Cl⁻响应常为抑制；应保留离子条件。'],[29,'D','D','Glutamate 的离子型受体通常介导快速 EPSP。'],[30,'C','B 与 C 都有真实含义','电突触既传离子又可同步；照片 C 反映课堂主考功能。练习改成同步现象题以保证单解。'],[31,'C','C','E_Na 降低通常降低 AP 峰值。'],[32,'C','C（题干明确净 Cl⁻内流）','负电荷净内流使膜内更负；“打开 Cl⁻通道”则还须比较 Vm 与 E_Cl。'],[33,'A','A','Na⁺通道失活产生绝对不应性。'],[34,'C','原题缺正确选项','Tyrosine 为上游前体，直接前体应为 L DOPA；练习已补入正确选项。'],[35,'C','C（精确说 axon initial segment）','丘／初始段邻近整合与起始；精确起始区通常为高 Na⁺通道密度初始段。']
].map(([number,fileKey,calibrated,reason])=>({number,fileKey,calibrated,reason}));
const corrections=[
 {title:'合成限速：ACh 不是自己的前体',before:'MS FRQ 1 表格列 Amount of ACh。',after:'写高亲和 choline uptake／choline 供给；ChAT 催化合成。',sources:[['MS','FRQ 1'],['N6','p.4'],['K6','Q1'],['B','PDF p.198–200']]},
 {title:'ACh 不属于 monoamines',before:'第 5 章将 ACh 与 monoamines 并列在 amine 栏。',after:'ACh 单独列为 cholinergic 小分子递质；DA、NE、E、5 HT 等为单胺。',sources:[['N5','p.5'],['N6','p.4–6'],['B','PDF p.197–203']]},
 {title:'新烟碱类：受体作用与酶抑制分开',before:'N6 p.4 标成 AChE inhibitor。',after:'主要作用于昆虫 nAChRs；不能等同于 AChE 抑制剂。Kahoot 的 agonist 线索与原始电生理研究可交叉检查。',sources:[['N6','p.4'],['K5B','Q9'],['R','whole-cell recording，2006']]},
 {title:'Na⁺通道：四结构域不是四独立链',before:'N4 p.3 写 4 subunit／polypeptide chain。',after:'典型成孔 α 亚基为一条多肽上的四重复结构域；与 K⁺通道四亚基区分。',sources:[['N4','p.3'],['B','PDF p.136–137']]},
 {title:'光遗传：pump 与 channel',before:'Halorhodopsin 的开关图易被理解为被动通道。',after:'经典 halorhodopsin 是黄光驱动 Cl⁻内向泵；ChR2 是蓝光门控阳离子通道。未核验奖项标注不进入复习证据。',sources:[['N4','p.2'],['B','PDF p.130–132']]},
 {title:'Ca²⁺先被传感器检测',before:'N5 p.6 简写 Ca binds on SNAREs。',after:'synaptotagmin 等检测 Ca²⁺并触发 SNARE 机器融合；保持课堂主链但补清分工。',sources:[['N5','p.6'],['B','PDF p.168–170']]},
 {title:'胞吞回收膜，不是统一的递质回收',before:'N5 p.7 的 reuptake by endocytosis 易混对象。',after:'将囊泡膜 endocytosis 与小分子 transporter uptake、扩散、降解分开。AChE 的产物为 acetate＋choline。',sources:[['N5','p.7'],['K5B','Q4、10'],['B','PDF p.170–174、198–200']]},
 {title:'CNS 可有单输入 EPSP',before:'K5B Q12 写 CNS EPSP could not be evoked by single AP。',after:'单个前突触 AP 可以产生小 EPSP，但常不足以触发突触后 AP。',sources:[['K5B','Q12'],['N5','p.9–10'],['B','PDF p.176–179']]},
 {title:'AMPA／NMDA／kainate 属于 glutamate',before:'N6 p.3 的 GABA 标题覆盖了这些亚型。',after:'Glu 离子型亚型与 GABA_A／GABA_B 分开。',sources:[['N6','p.3'],['B','PDF p.194–197、208–213']]},
 {title:'FISH 与放射性 ISH 不混名',before:'笔记将 fluorescent／radioactive 标签并列。',after:'FISH 指荧光原位杂交；放射性探针可用于另一种 ISH 检测。mRNA 常指小分子合成酶的转录本。',sources:[['N6','p.1'],['MS','FRQ 2'],['B','PDF p.189–192']]},
 {title:'NMJ safety factor 的条件',before:'MS 使用 never fail／every ACh molecule quickly finds a receptor。',after:'使用正常生理高可靠性；充足释放与受体密度提高成功率，不是绝对保证。',sources:[['N5','p.5'],['MS','FRQ 6'],['B','PDF p.177–179']]},
 {title:'图缺失与分数说明',before:'原卷 FRQ 4 引用 Figure 1/2，但提供页面未显示对应图；FRQ 标题算式与“选 8”措辞易混。',after:'不猜图 2 的波形。模拟题明确给出变量；每卷 30×2＋8×5＝100，原卷 5 道 bonus 只列入答案审计。',sources:[['EX','PDF p.7–8；FRQ 4']]}
];
const quizlet=[
 {chapter:4,title:'Chapter 4 · The action potential',href:'https://quizlet.com/cn/947076493/chapter-4-the-action-potential-flash-cards/?i=281hhv&x=1jqt'},
 {chapter:5,title:'Chapter 5 · Synaptic transmission',href:'https://quizlet.com/cn/957814490/chapter-5-synaptic-transmission-flash-cards/?i=281hhv&x=1jqt'},
 {chapter:6,title:'Chapter 6 · Neurotransmitter systems brief',href:'https://quizlet.com/hk/1228722837/chapter-6-neurotransmitter-systems-brief-flash-cards/?i=281hhv&x=1jqt'}
];
return {version:1,sources,topics,mcq,frq,mocks,priorities,examAudit,corrections,quizlet};
});
