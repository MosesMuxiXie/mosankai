(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory();else root.Neuro46MidtermData=factory();})(typeof window==='object'?window:globalThis,function(){
 'use strict';
 const blueprint={base:100,bonus:10,mcq:{count:30,marks:2,chapters:{4:6,5:9,6:15}},frq:{count:6,marks:5},figures:{count:10,marks:1},terms:{count:5,marks:2},minutes:90};
 const extraMCQ=[];
 function Q(n,topic,prompt,options,answer,zh,en,sources){extraMCQ.push({id:'C6-M'+n,chapter:6,topic:'c6-t'+topic,prompt,options,answer,rationale:zh,rationaleEn:en,sources,priority:1,level:'应用 / Application',origin:'期中专项 / Midterm extension'});}
 Q(31,2,'A fluorescent complementary probe labels ChAT mRNA in a neuron. What does this observation establish most directly?',[
 'ChAT transcripts are present in that neuron.','ACh was released during the last action potential.','The postsynaptic receptor is nicotinic.','The probe directly bound free acetylcholine.'
 ],0,[
 '互补核酸探针检测转录本；此结果支持细胞表达 ChAT mRNA。','刺激依赖释放需要另外测量，不能由转录本定位直接推断。','合成酶转录本不说明接收细胞表达哪类受体。','ACh 是小分子，不是与核酸探针互补配对的序列。'
 ],['A complementary nucleic-acid probe detects the ChAT transcript.','Stimulus-dependent release requires a separate functional measurement.','A synthetic-enzyme transcript does not identify a postsynaptic receptor subtype.','ACh is a small molecule, not a complementary nucleic-acid sequence.'],[['N6','p.1 / FISH'],['B','PDF p.189–192']]);
 Q(32,2,'Two tissue sections are labeled with fluorescent reagents. Which feature distinguishes IHC from FISH?',[
 'Only FISH can produce a fluorescent signal.','IHC uses antibody–antigen recognition; FISH uses complementary nucleic-acid hybridization.','IHC measures release directly; FISH measures receptor activation directly.','Both methods must recognize the neurotransmitter molecule itself.'
 ],1,[
 '荧光是一种读出方式，两种技术都可采用。','关键是识别机制和靶标，而不是颜色或发光本身。','两者首先提供定位证据，不能单独完成释放或功能判定。','可检测合成酶蛋白或相应 mRNA；并非必须检测递质本身。'
 ],['Fluorescence is a readout available to both techniques.','The recognition mechanism and molecular target distinguish the methods.','Localization alone does not directly demonstrate release or receptor function.','Synthetic-enzyme protein or its mRNA may be the target instead of the transmitter itself.'],[['N6','p.1–2 / FISH and IHC'],['B','PDF p.189–192']]);
 Q(33,3,'Which description correctly identifies microiontophoresis in a candidate-transmitter mimicry test?',[
 'A pressure pulse alone ejects solution; this defines iontophoresis.','A fluorescent antibody identifies a protein in fixed tissue.','An electric current drives charged candidate molecules from a micropipette near the target cell.','A voltage clamp holds every neuron in a brain slice at the same voltage.'
 ],2,[
 '压力喷射是另一种局部给药方式，不能仅凭微吸管就叫微离子电泳。','这是 IHC 的识别逻辑，不是局部功能给药。','电流驱动带电候选物局部施加，再比较受体细胞响应。','电压钳不是给药技术，也不会自动控制整个切片中每个细胞。'
 ],['Pressure ejection is a distinct local-application method.','This describes immunohistochemical recognition, not functional delivery.','Current drives charged candidate molecules from a pipette for a local response test.','Voltage clamp neither delivers the candidate nor automatically clamps an entire slice.'],[['N6','p.2–3 / mimicry apparatus'],['B','PDF p.192–194']]);
 Q(34,1,'Candidate X is synthesized and stored in a neuron and is released during stimulation. Which additional result addresses the remaining classical transmitter criterion?',[
 'X has a short English name.','X can be stained after fixation.','X is absent from all glia.','Applying X to the target cell mimics the response produced by normal transmission.'
 ],3,[
 '名称不构成功能证据。','定位补充合成或储存证据，但不能代替模拟反应。','是否存在于胶质细胞不是这三条经典判据之一。','外源候选物应产生与内源传递相符的响应。'
 ],['A name provides no functional evidence.','Localization cannot replace a postsynaptic mimicry experiment.','Exclusive absence from glia is not one of the three classical criteria here.','Exogenous application should mimic the response to endogenous transmission.'],[['N6','p.1 / three criteria'],['EX','FRQ 2']]);
 Q(35,4,'An agonist activates a receptor that increases K⁺ conductance and lowers firing in the target cell. Which conclusion is correct?',[
 'It is still an agonist because it activates the receptor.','It must be an antagonist because firing decreases.','All agonists directly open Na⁺ channels.','A decrease in firing proves that the ligand cannot be a neurotransmitter.'
 ],0,[
 '激动剂按是否激活受体定义，不能按整个细胞是否兴奋来命名。','拮抗剂阻止相应激动作用；降低发放本身不是拮抗的定义。','激动剂可作用于不同受体，GPCR 也能间接改变离子通道。','递质可通过受体产生抑制或调节效应。'
 ],['Agonism means receptor activation, not necessarily cellular excitation.','Reduced firing alone does not define receptor antagonism.','Agonists act on diverse receptors, including GPCRs that regulate channels indirectly.','Transmitters can inhibit or modulate activity through the receptor involved.'],[['N6','p.3 / agonist and antagonist'],['N5','p.8、11–12']]);
 Q(36,5,'During sustained cholinergic activity, inhibiting high-affinity choline uptake most directly limits which supply step?',[
 'ACh binding to muscle nicotinic receptors','Delivery of choline into the presynaptic cytoplasm for ACh synthesis','Hydrolysis of ACh in the synaptic cleft','Translation of ACh from mRNA'
 ],1,[
 '受体结合在突触后侧，不能等同于前体摄取。','细胞膜摄取 choline 为 ChAT 提供原料；这是正常持续合成的重要供给限制。','AChE 催化水解，摄取 choline 的转运体不执行这个反应。','ACh 是小分子，不由核糖体直接翻译。'
 ],['Postsynaptic ligand binding is not presynaptic precursor uptake.','Choline uptake supplies substrate for ChAT and is an important limit on sustained synthesis.','AChE catalyzes hydrolysis; the uptake transporter does not.','ACh is a small molecule, not a directly translated protein.'],[['N6','p.4 / cholinergic cycle'],['B','PDF p.198–200']]);
 Q(37,5,'Which pair correctly links ACh termination with recovery of a useful precursor?',[
 'AChE converts ACh to dopamine; dopamine is taken up.','Intact ACh is routinely retrieved by vesicle membrane endocytosis.','AChE hydrolyzes ACh to acetate and choline; choline is taken up by a specific transporter.','ChAT hydrolyzes ACh to serotonin and acetate.'
 ],2,[
 'AChE 不把 ACh 转为 dopamine。','内吞回收囊泡膜；它不是这里的递质或 choline 再摄取机制。','清除递质和回收前体是不同步骤，分别由酶和细胞膜转运体承担。','ChAT 是合成酶；所列产物也不正确。'
 ],['AChE does not convert ACh into dopamine.','Endocytosis recycles vesicle membrane, not the choline uptake step described here.','ACh hydrolysis and precursor recovery use an enzyme and a transporter, respectively.','ChAT is the synthetic enzyme, and the proposed products are incorrect.'],[['N6','p.4 / AChE and uptake'],['RC','NT reuptake correction']]);
 Q(38,9,'A drug blocks VAChT while leaving the plasma-membrane choline transporter intact. What is the most direct affected process?',[
 'Cleavage of extracellular ACh by AChE','Choline entry from outside the cell','Recognition of ACh by a postsynaptic GPCR','Loading ACh from the cytoplasm into synaptic vesicles'
 ],3,[
 'AChE 水解发生在细胞外，VAChT 不催化该反应。','细胞膜 choline 摄取和囊泡 ACh 装填是不同膜上的步骤。','VAChT 是转运体，不是突触后受体。','囊泡膜上的 VAChT 把 ACh 装入囊泡；不要与细胞膜 CHT 混淆。'
 ],['AChE hydrolysis is extracellular and is not catalyzed by VAChT.','Plasma-membrane choline uptake and vesicular ACh loading are separate steps.','VAChT is a transporter, not a postsynaptic receptor.','VAChT loads ACh into vesicles; distinguish it from plasma-membrane CHT.'],[['N6','p.4 / ACh cycle'],['B','PDF p.198–200']]);
 Q(39,6,'Which sequence correctly identifies dopamine’s immediate precursor and the enzyme for that step?',[
 'L-DOPA → dopamine, catalyzed by aromatic amino acid decarboxylase','Tyrosine → dopamine, catalyzed directly by tyrosine hydroxylase','Tryptophan → dopamine, catalyzed by tryptophan hydroxylase','Norepinephrine → dopamine, catalyzed by PNMT'
 ],0,[
 'L-DOPA 紧邻 dopamine 上一步；AADC 也称 DOPA decarboxylase。','TH 把 tyrosine 转为 L-DOPA，中间不能省略。','Tryptophan 属于 serotonin 路径。','PNMT 催化 norepinephrine 到 epinephrine 的步骤。'
 ],['L-DOPA is the immediate precursor; AADC is also called DOPA decarboxylase.','TH produces L-DOPA from tyrosine, not dopamine in one direct step.','Tryptophan is upstream in the serotonin pathway.','PNMT converts norepinephrine to epinephrine.'],[['N6','p.5 / catecholamine pathway'],['B','PDF p.200–202']]);
 Q(40,7,'Which enzyme acts on tryptophan to form 5-hydroxytryptophan in serotonin synthesis?',[
 'Tyrosine hydroxylase (TH)','Tryptophan hydroxylase (TPH)','Acetylcholinesterase (AChE)','Glutamic acid decarboxylase (GAD)'
 ],1,[
 'TH 作用于儿茶酚胺路径中的 tyrosine，不能因都是羟化酶就互换。','TPH 催化 tryptophan→5-HTP；注意与 TH 的名称差别。','AChE 水解 ACh，不合成 5-HTP。','GAD 把 glutamate 转为 GABA。'
 ],['TH acts on tyrosine in catecholamine synthesis.','TPH catalyzes tryptophan to 5-HTP; distinguish it from TH.','AChE hydrolyzes ACh rather than synthesizing 5-HTP.','GAD converts glutamate to GABA.'],[['N6','p.6 / serotonin pathway'],['B','PDF p.202–203']]);
 Q(41,7,'A pathway is shown as tryptophan → 5-HTP → 5-HT. Which label names the final product rather than either precursor?',[
 'Phenylalanine','5-Hydroxytryptophan','Serotonin (5-hydroxytryptamine)','Tyrosine'
 ],2,[
 'Phenylalanine 位于另一条氨基酸到儿茶酚胺的路径上游。','5-HTP 是 serotonin 的直接前体，不是最终产物。','5-HT 即 serotonin，规范全称为 5-hydroxytryptamine。','Tyrosine 是儿茶酚胺的起始前体之一。'
 ],['Phenylalanine is upstream of the catecholamine pathway.','5-HTP is the immediate precursor, not the final product shown.','5-HT is serotonin, also named 5-hydroxytryptamine.','Tyrosine is a catecholamine precursor.'],[['N6','p.6 / structures and synthesis']]);
 Q(42,8,'A molecule loses its α-carboxyl group during a GAD-catalyzed reaction and becomes GABA. What was the substrate?',[
 'Glycine','Choline','Serotonin','Glutamate'
 ],3,[
 'Glycine 是另一种氨基酸递质，不是这个反应的底物。','Choline 用于 ACh 合成。','Serotonin 属于单胺，不属于这一步 GAD 反应。','GAD 为 glutamic acid decarboxylase，催化 glutamate 脱羧生成 GABA。'
 ],['Glycine is another amino-acid transmitter, not this reaction’s substrate.','Choline is used in ACh synthesis.','Serotonin is a monoamine outside this GAD reaction.','GAD converts glutamate to GABA by decarboxylation.'],[['N6','p.6 / glutamate and GABA structures'],['B','PDF p.203–205']]);
 Q(43,10,'External candidate transmitter still produces a normal postsynaptic response after a drug blocks the response to presynaptic stimulation. What is the safest inference?',[
 'At least part of the postsynaptic response machinery remains functional; an upstream step may be affected.','The drug must inhibit exactly one named synthetic enzyme.','All presynaptic functions are proven normal.','The postsynaptic receptor must be completely blocked.'
 ],0,[
 '旁路救援支持下游至少部分功能仍在，但不能唯一定位上游某个分子。','释放、传导、合成或其他上游环节都可能受影响，不能直接锁定某酶。','刺激路径失败恰好说明仍需检查前侧环节。','外源候选物仍能引起响应，与受体完全被阻断不符。'
 ],['A successful bypass supports functioning downstream machinery without uniquely locating one upstream molecule.','Several upstream processes could fail; the result does not uniquely identify an enzyme.','Presynaptic steps still require testing.','A normal exogenous response argues against complete blockade of its postsynaptic receptor.'],[['N6','p.2–3 / release and mimicry'],['EX','FRQ 7、10']]);
 Q(44,4,'Which group consists of ionotropic glutamate receptor families?',[
 'Nicotinic, muscarinic and adrenergic','AMPA, NMDA and kainate','GABA-A, GABA-B and glycine','ChAT, AChE and tyrosine hydroxylase'
 ],1,[
 '这些名称涉及 ACh 或肾上腺素能受体，且并不都是离子型。','AMPA、NMDA 和 kainate 是谷氨酸离子型受体家族。','GABA 和 glycine 受体不是谷氨酸受体，GABA-B 还是 GPCR。','这三个是酶，不是受体家族。'
 ],['These refer to cholinergic or adrenergic receptors and are not all ionotropic.','AMPA, NMDA and kainate are ionotropic glutamate receptor families.','These are not glutamate receptors; GABA-B is a GPCR.','These are enzymes rather than receptor families.'],[['N6','p.3 / receptor-family correction'],['B','PDF p.208–213']]);
 Q(45,1,'IHC detects a synthetic enzyme and FISH detects its mRNA in the same neuron. Which statement avoids overinterpreting these findings?',[
 'The two signals prove every receptor on the neuron has the same function.','The signals by themselves establish Ca²⁺-dependent release.','They support a transmitter phenotype, but release and postsynaptic mimicry still need functional tests.','The mRNA signal is direct imaging of free neurotransmitter molecules.'
 ],2,[
 '合成表型不能决定一个神经元上全部受体的功能。','Ca²⁺依赖释放需要刺激与释放测量，并设置相应对照。','定位两种相关分子加强合成表型证据，仍不能代替其他经典判据。','mRNA 和小分子递质不同；探针不直接成像游离递质。'
 ],['A synthetic phenotype does not determine every receptor’s function.','Ca²⁺-dependent release requires stimulation, release measurements and controls.','Convergent localization supports the phenotype while leaving the other functional criteria to test.','A transcript is not a free small-molecule neurotransmitter.'],[['N6','p.1–3 / identification criteria'],['B','PDF p.189–194']]);

 function makeMocks({mcq,frq,figures,terms}){
  const frqIds=[['C4-F01','C5-F04','C5-F08','C6-F01','C6-F05','C6-F06'],['C4-F03','C5-F06','C5-F09','C6-F02','C6-F07','C6-F08'],['C4-F07','C5-F01','C5-F07','C6-F03','C6-F04','C6-F09']];
  const c4Topics=[[0,1,2,3,4,5],[4,5,6,7,8,9],[0,1,2,6,7,9]],groups=['method','synapse','molecule','receptor','electrical','integration'];
  function selectFigures(p){const selected=[];let round=0;while(selected.length<10&&round<figures.length*2){for(const key of groups){const bank=figures.filter(q=>q.category===key);if(!bank.length)continue;const q=bank[(p*2+Math.floor(round/groups.length))%bank.length];if(!selected.includes(q.id))selected.push(q.id);if(selected.length===10)break;}round+=groups.length;}for(const q of figures)if(selected.length<10&&!selected.includes(q.id))selected.push(q.id);return selected;}
  return [0,1,2].map(i=>{
   const c4=mcq.filter(q=>q.chapter===4).filter((_,n)=>n%3===i).filter((_,n)=>c4Topics[i].includes(n));
   const c5=mcq.filter(q=>q.chapter===5).filter((_,n)=>n%3===i).filter((_,n)=>n!==9-i);
   const c6=mcq.filter(q=>q.chapter===6).filter((_,n)=>n%3===i);
   const termIds=[terms.filter(t=>t.chapter===4)[i]?.id,terms.filter(t=>t.chapter===5)[i]?.id,...terms.filter(t=>t.chapter===6).slice(i*3,i*3+3).map(t=>t.id)].filter(Boolean);
   return {id:'midterm2026-'+String.fromCharCode(97+i),title:'期中模拟卷 '+String.fromCharCode(65+i),format:'midterm2026',mcq:[...c4,...c5,...c6].map(q=>q.id),frq:frqIds[i].filter(id=>frq.some(q=>q.id===id)),figures:selectFigures(i),terms:termIds,requiredFrq:6,minutes:90};
  });
 }
 return {blueprint,extraMCQ,makeMocks};
});
