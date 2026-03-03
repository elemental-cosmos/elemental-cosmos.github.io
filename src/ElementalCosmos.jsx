import { useState, useRef, useEffect, useMemo, useCallback } from "react";

const RING_META = [
  { id:"genesis", name:"Genesis Core", color:"#F4D35E", glow:"rgba(244,211,94,0.35)", tagline:"The Spark of Everything", rationale:"These four elements constitute over 96% of the human body by mass and form the molecular basis of all known life. Hydrogen — the first atom forged after the Big Bang — fuels every star. Carbon provides the structural backbone of organic chemistry. Nitrogen and Oxygen compose the air we breathe. Without these four, neither life nor the universe as we know it would exist. They sit at the core because everything else depends on them." },
  { id:"vital", name:"Vital Ring", color:"#4ECDC4", glow:"rgba(78,205,196,0.35)", tagline:"Blood, Bone & Breath", rationale:"The Vital Ring holds elements that sustain biological life — the minerals in our bones, the ions firing our neurons, the trace elements regulating our metabolism. Calcium builds our skeleton. Iron carries oxygen through our blood. Sodium and potassium orchestrate every nerve impulse and heartbeat. These elements don't just support life; they are the machinery through which life operates." },
  { id:"civilization", name:"Civilization Ring", color:"#F7946B", glow:"rgba(247,148,107,0.35)", tagline:"Tools, Wires & Machines", rationale:"Humanity's journey from caves to cities was built on these elements. Copper wired the telegraph, silicon powered the computer, titanium launched us into space. Gold served as currency for millennia; platinum scrubs car exhaust; silver fights infection. This ring represents humanity's ability to reshape raw earth into civilization — bridges, circuits, medicines, and machines." },
  { id:"frontier", name:"Frontier Ring", color:"#E85D75", glow:"rgba(232,93,117,0.35)", tagline:"Volatile, Toxic & Extreme", rationale:"The outermost ring holds elements that are dangerous, unstable, or profoundly reactive — yet each has transformed science or society. Lithium treats mental illness and powers electric cars. Chlorine sanitizes drinking water but was also the first chemical weapon. Radium killed factory women who painted watch dials, leading to landmark worker safety laws. These elements mark the frontier where chemistry becomes existential." },
];

const FAMILIES = {
  foundation:     { label: "Foundation",              color: "#F4D35E" },
  lifeEssential:  { label: "Life Essential",          color: "#7BE0D6" },
  bioElectrolyte: { label: "Biology & Electrolytes",  color: "#4ECDC4" },
  structural:     { label: "Conductive / Structural", color: "#F7946B" },
  technology:     { label: "Technology & Industry",   color: "#C4A0F7" },
  reactive:       { label: "Reactive & Volatile",     color: "#F472B6" },
  medical:        { label: "Medical & Pharmaceutical",color: "#34D399" },
  toxic:          { label: "Toxic Yet Transformative", color: "#E85D75" },
};

const RINGS = [
  [
    { sym:"H",z:1,name:"Hydrogen",family:"foundation",trait:"Highly reactive non-metal",hook:"Most abundant element in the universe — fuel of stars",mass:1.008,state:"Gas",econfig:"1s\u00B9",eneg:2.20,melt:-259,boil:-253,density:0.00009,discovered:1766,discoverer:"Henry Cavendish",group:"Nonmetal",funfact:"Your body contains roughly 7 octillion hydrogen atoms." },
    { sym:"O",z:8,name:"Oxygen",family:"lifeEssential",trait:"Gas at room temperature",hook:"Essential for human respiration and medical oxygen therapy",mass:15.999,state:"Gas",econfig:"[He] 2s\u00B2 2p\u2074",eneg:3.44,melt:-219,boil:-183,density:0.0014,discovered:1774,discoverer:"Joseph Priestley",group:"Nonmetal",funfact:"Liquid oxygen is pale blue and strongly magnetic." },
    { sym:"C",z:6,name:"Carbon",family:"lifeEssential",trait:"Non-metal",hook:"Forms the backbone of all organic molecules and life on Earth",mass:12.011,state:"Solid",econfig:"[He] 2s\u00B2 2p\u00B2",eneg:2.55,melt:3550,boil:4027,density:2.27,discovered:-3750,discoverer:"Ancient civilizations",group:"Nonmetal",funfact:"Diamond and graphite are both pure carbon \u2014 one the hardest, the other the softest." },
    { sym:"N",z:7,name:"Nitrogen",family:"lifeEssential",trait:"Gas at room temperature",hook:"Makes up ~78% of Earth's atmosphere; crucial in fertilizers",mass:14.007,state:"Gas",econfig:"[He] 2s\u00B2 2p\u00B3",eneg:3.04,melt:-210,boil:-196,density:0.0013,discovered:1772,discoverer:"Daniel Rutherford",group:"Nonmetal",funfact:"The Haber process converts atmospheric nitrogen into ammonia, feeding half the world." },
  ],
  [
    { sym:"Ca",z:20,name:"Calcium",family:"bioElectrolyte",trait:"Typical ion charge of +2",hook:"Essential for bone and tooth formation",mass:40.078,state:"Solid",econfig:"[Ar] 4s\u00B2",eneg:1.00,melt:842,boil:1484,density:1.55,discovered:1808,discoverer:"Humphry Davy",group:"Alkaline earth",funfact:"Your skeleton replaces itself roughly every 10 years." },
    { sym:"Na",z:11,name:"Sodium",family:"bioElectrolyte",trait:"Typical ion charge of +1",hook:"Found in table salt; key role in nerve impulses",mass:22.990,state:"Solid",econfig:"[Ne] 3s\u00B9",eneg:0.93,melt:98,boil:883,density:0.97,discovered:1807,discoverer:"Humphry Davy",group:"Alkali metal",funfact:"Sodium streetlamps produce that distinctive orange-yellow glow." },
    { sym:"K",z:19,name:"Potassium",family:"bioElectrolyte",trait:"High reactivity",hook:"Important electrolyte regulating heart and muscle function",mass:39.098,state:"Solid",econfig:"[Ar] 4s\u00B9",eneg:0.82,melt:63,boil:759,density:0.86,discovered:1807,discoverer:"Humphry Davy",group:"Alkali metal",funfact:"Bananas are mildly radioactive from potassium-40." },
    { sym:"Fe",z:26,name:"Iron",family:"bioElectrolyte",trait:"Good conductor of heat/electricity",hook:"Major component of steel; drove the Industrial Revolution",mass:55.845,state:"Solid",econfig:"[Ar] 3d\u2076 4s\u00B2",eneg:1.83,melt:1538,boil:2862,density:7.87,discovered:-5000,discoverer:"Ancient civilizations",group:"Transition metal",funfact:"Earth's iron core generates our planet's magnetic field." },
    { sym:"Mg",z:12,name:"Magnesium",family:"medical",trait:"Flammable light metal",hook:"Used in flares, pyrotechnics, and medical supplements",mass:24.305,state:"Solid",econfig:"[Ne] 3s\u00B2",eneg:1.31,melt:650,boil:1091,density:1.74,discovered:1755,discoverer:"Joseph Black",group:"Alkaline earth",funfact:"Magnesium fire cannot be extinguished with water." },
    { sym:"Mn",z:25,name:"Manganese",family:"bioElectrolyte",trait:"Transition metal",hook:"Essential trace mineral for metabolism and bone health",mass:54.938,state:"Solid",econfig:"[Ar] 3d\u2075 4s\u00B2",eneg:1.55,melt:1246,boil:2061,density:7.44,discovered:1774,discoverer:"Johan Gottlieb Gahn",group:"Transition metal",funfact:"Cave paintings used manganese pigment 17,000 years ago." },
    { sym:"Co",z:27,name:"Cobalt",family:"bioElectrolyte",trait:"Transition metal",hook:"Core of Vitamin B12; used in rechargeable batteries",mass:58.933,state:"Solid",econfig:"[Ar] 3d\u2077 4s\u00B2",eneg:1.88,melt:1495,boil:2927,density:8.90,discovered:1735,discoverer:"Georg Brandt",group:"Transition metal",funfact:"Cobalt gives glass and ceramics their deep blue color." },
    { sym:"Se",z:34,name:"Selenium",family:"bioElectrolyte",trait:"Non-metal / metalloid",hook:"Essential trace element for thyroid and immune function",mass:78.96,state:"Solid",econfig:"[Ar] 3d\u00B9\u2070 4s\u00B2 4p\u2074",eneg:2.55,melt:221,boil:685,density:4.81,discovered:1817,discoverer:"J\u00F6ns Jacob Berzelius",group:"Nonmetal",funfact:"Selenium powers the photocells in automatic doors." },
    { sym:"I",z:53,name:"Iodine",family:"bioElectrolyte",trait:"Crystalline solid halogen",hook:"Essential for thyroid hormones and regulating bodily functions",mass:126.904,state:"Solid",econfig:"[Kr] 4d\u00B9\u2070 5s\u00B2 5p\u2075",eneg:2.66,melt:114,boil:184,density:4.93,discovered:1811,discoverer:"Bernard Courtois",group:"Halogen",funfact:"Iodine sublimes \u2014 goes straight from solid to violet gas." },
    { sym:"P",z:15,name:"Phosphorus",family:"medical",trait:"Essential nutrient",hook:"Critical for DNA, ATP, and fertilizers for global food supply",mass:30.974,state:"Solid",econfig:"[Ne] 3s\u00B2 3p\u00B3",eneg:2.19,melt:44,boil:281,density:1.82,discovered:1669,discoverer:"Hennig Brand",group:"Nonmetal",funfact:"Discovered by an alchemist boiling urine seeking the Philosopher's Stone." },
    { sym:"S",z:16,name:"Sulfur",family:"medical",trait:"Non-metal",hook:"Key component of early gunpowder; used in pharmaceuticals",mass:32.06,state:"Solid",econfig:"[Ne] 3s\u00B2 3p\u2074",eneg:2.58,melt:115,boil:445,density:2.07,discovered:-2000,discoverer:"Ancient civilizations",group:"Nonmetal",funfact:"Sulfur itself is odorless \u2014 the rotten egg smell is hydrogen sulfide." },
    { sym:"Zn",z:30,name:"Zinc",family:"medical",trait:"Protects steel from rust",hook:"Essential trace element; used in wound healing and immunity",mass:65.38,state:"Solid",econfig:"[Ar] 3d\u00B9\u2070 4s\u00B2",eneg:1.65,melt:420,boil:907,density:7.13,discovered:1746,discoverer:"Andreas Marggraf",group:"Transition metal",funfact:"US pennies since 1982 are 97.5% zinc." },
  ],
  [
    { sym:"Cu",z:29,name:"Copper",family:"structural",trait:"Excellent conductor",hook:"Widely used in electrical wiring and modern infrastructure",mass:63.546,state:"Solid",econfig:"[Ar] 3d\u00B9\u2070 4s\u00B9",eneg:1.90,melt:1085,boil:2562,density:8.96,discovered:-9000,discoverer:"Ancient civilizations",group:"Transition metal",funfact:"The Statue of Liberty is clad in 80 tons of copper." },
    { sym:"Si",z:14,name:"Silicon",family:"technology",trait:"Metalloid",hook:"Foundation of computer chips and modern digital technology",mass:28.086,state:"Solid",econfig:"[Ne] 3s\u00B2 3p\u00B2",eneg:1.90,melt:1414,boil:3265,density:2.33,discovered:1824,discoverer:"J\u00F6ns Jacob Berzelius",group:"Metalloid",funfact:"Silicon Valley is named after this element." },
    { sym:"Ti",z:22,name:"Titanium",family:"structural",trait:"Highly corrosion resistant",hook:"Used in joint replacements due to strength and biocompatibility",mass:47.867,state:"Solid",econfig:"[Ar] 3d\u00B2 4s\u00B2",eneg:1.54,melt:1668,boil:3287,density:4.51,discovered:1791,discoverer:"William Gregor",group:"Transition metal",funfact:"As strong as steel but 45% lighter." },
    { sym:"Au",z:79,name:"Gold",family:"structural",trait:"Noble metal, excellent conductor",hook:"Symbol of wealth; essential in electronics and aerospace",mass:196.967,state:"Solid",econfig:"[Xe] 4f\u00B9\u2074 5d\u00B9\u2070 6s\u00B9",eneg:2.54,melt:1064,boil:2856,density:19.30,discovered:-6000,discoverer:"Ancient civilizations",group:"Transition metal",funfact:"All gold ever mined would fit in a 21-meter cube." },
    { sym:"W",z:74,name:"Tungsten",family:"structural",trait:"Highest melting point of metals",hook:"Used in light bulb filaments and cutting tools",mass:183.84,state:"Solid",econfig:"[Xe] 4f\u00B9\u2074 5d\u2074 6s\u00B2",eneg:2.36,melt:3422,boil:5555,density:19.25,discovered:1783,discoverer:"Juan Jos\u00E9 Elhuyar",group:"Transition metal",funfact:"Melting point of 3,422\u00B0C \u2014 used in rocket nozzles." },
    { sym:"Cr",z:24,name:"Chromium",family:"structural",trait:"Hard, lustrous transition metal",hook:"Key component of stainless steel and chrome plating",mass:51.996,state:"Solid",econfig:"[Ar] 3d\u2075 4s\u00B9",eneg:1.66,melt:1907,boil:2671,density:7.15,discovered:1797,discoverer:"Louis Nicolas Vauquelin",group:"Transition metal",funfact:"Named from Greek 'chroma' (color) \u2014 its compounds are vividly colored." },
    { sym:"Al",z:13,name:"Aluminum",family:"technology",trait:"Lightweight metal",hook:"Used in aerospace and modern transport",mass:26.982,state:"Solid",econfig:"[Ne] 3s\u00B2 3p\u00B9",eneg:1.61,melt:660,boil:2519,density:2.70,discovered:1825,discoverer:"Hans Christian Oersted",group:"Post-transition",funfact:"Once more valuable than gold before industrial extraction." },
    { sym:"Ag",z:47,name:"Silver",family:"medical",trait:"Highest electrical conductivity",hook:"Historically used as currency; antimicrobial in medicine",mass:107.868,state:"Solid",econfig:"[Kr] 4d\u00B9\u2070 5s\u00B9",eneg:1.93,melt:962,boil:2162,density:10.49,discovered:-5000,discoverer:"Ancient civilizations",group:"Transition metal",funfact:"Best electrical conductor of all elements." },
    { sym:"Pt",z:78,name:"Platinum",family:"medical",trait:"Noble metal",hook:"Used in catalytic converters and chemotherapy drugs",mass:195.084,state:"Solid",econfig:"[Xe] 4f\u00B9\u2074 5d\u2079 6s\u00B9",eneg:2.28,melt:1768,boil:3825,density:21.45,discovered:1735,discoverer:"Antonio de Ulloa",group:"Transition metal",funfact:"Cisplatin \u2014 a platinum drug \u2014 was discovered accidentally." },
    { sym:"Sn",z:50,name:"Tin",family:"toxic",trait:"Post-transition metal",hook:"Key component of Bronze \u2014 defined the Bronze Age",mass:118.710,state:"Solid",econfig:"[Kr] 4d\u00B9\u2070 5s\u00B2 5p\u00B2",eneg:1.96,melt:232,boil:2602,density:7.29,discovered:-3500,discoverer:"Ancient civilizations",group:"Post-transition",funfact:"Below 13\u00B0C, tin crumbles to powder \u2014 'tin pest'." },
    { sym:"Ni",z:28,name:"Nickel",family:"toxic",trait:"Transition metal",hook:"Used in stainless steel and rechargeable batteries",mass:58.693,state:"Solid",econfig:"[Ar] 3d\u2078 4s\u00B2",eneg:1.91,melt:1455,boil:2913,density:8.91,discovered:1751,discoverer:"Axel Fredrik Cronstedt",group:"Transition metal",funfact:"The US 'nickel' coin is actually 75% copper." },
    { sym:"B",z:5,name:"Boron",family:"foundation",trait:"Metalloid",hook:"Essential in nuclear shielding and semiconductor doping",mass:10.81,state:"Solid",econfig:"[He] 2s\u00B2 2p\u00B9",eneg:2.04,melt:2076,boil:3927,density:2.34,discovered:1808,discoverer:"Humphry Davy",group:"Metalloid",funfact:"Boron nitride is nearly as hard as diamond." },
    { sym:"He",z:2,name:"Helium",family:"foundation",trait:"Noble gas",hook:"Second most abundant element; used in cryogenics and MRI",mass:4.003,state:"Gas",econfig:"1s\u00B2",eneg:null,melt:-272,boil:-269,density:0.00018,discovered:1868,discoverer:"Pierre Janssen",group:"Noble gas",funfact:"First detected in the Sun's spectrum before being found on Earth." },
  ],
  [
    { sym:"Li",z:3,name:"Lithium",family:"reactive",trait:"Highly reactive alkali metal",hook:"Mood stabilizer for psychiatric disorders; powers batteries",mass:6.941,state:"Solid",econfig:"[He] 2s\u00B9",eneg:0.98,melt:181,boil:1342,density:0.534,discovered:1817,discoverer:"Johan Arfwedson",group:"Alkali metal",funfact:"So light it floats on water \u2014 then reacts violently with it." },
    { sym:"F",z:9,name:"Fluorine",family:"reactive",trait:"Highly reactive toxic gas",hook:"Used in imaging machines, anesthesia, and toothpaste",mass:18.998,state:"Gas",econfig:"[He] 2s\u00B2 2p\u2075",eneg:3.98,melt:-220,boil:-188,density:0.0017,discovered:1886,discoverer:"Henri Moissan",group:"Halogen",funfact:"The most electronegative element in existence." },
    { sym:"Cl",z:17,name:"Chlorine",family:"reactive",trait:"Highly reactive toxic gas",hook:"Used for sanitation of swimming pools and in household bleach",mass:35.45,state:"Gas",econfig:"[Ne] 3s\u00B2 3p\u2075",eneg:3.16,melt:-101,boil:-34,density:0.0032,discovered:1774,discoverer:"Carl Wilhelm Scheele",group:"Halogen",funfact:"First poison gas deployed as a weapon in WWI." },
    { sym:"Br",z:35,name:"Bromine",family:"reactive",trait:"Volatile liquid halogen",hook:"Used as fire retardant in furniture, electronics, and textiles",mass:79.904,state:"Liquid",econfig:"[Ar] 3d\u00B9\u2070 4s\u00B2 4p\u2075",eneg:2.96,melt:-7,boil:59,density:3.12,discovered:1826,discoverer:"Antoine J\u00E9r\u00F4me Balard",group:"Halogen",funfact:"One of only two elements liquid at room temperature." },
    { sym:"Rb",z:37,name:"Rubidium",family:"reactive",trait:"Ignites in air",hook:"Used in PET scans for medical imaging and scientific research",mass:85.468,state:"Solid",econfig:"[Kr] 5s\u00B9",eneg:0.82,melt:39,boil:688,density:1.53,discovered:1861,discoverer:"Robert Bunsen",group:"Alkali metal",funfact:"Its name means 'deep red' \u2014 discovered by flame spectroscopy." },
    { sym:"Ba",z:56,name:"Barium",family:"technology",trait:"Alkaline earth metal",hook:"Used in medical imaging (barium swallows) and drilling fluids",mass:137.327,state:"Solid",econfig:"[Xe] 6s\u00B2",eneg:0.89,melt:727,boil:1897,density:3.62,discovered:1808,discoverer:"Humphry Davy",group:"Alkaline earth",funfact:"Barium sulfate is opaque to X-rays." },
    { sym:"Pb",z:82,name:"Lead",family:"toxic",trait:"Unreactive, poor conductor",hook:"Used in radiation shielding aprons for X-rays",mass:207.2,state:"Solid",econfig:"[Xe] 4f\u00B9\u2074 5d\u00B9\u2070 6s\u00B2 6p\u00B2",eneg:2.33,melt:327,boil:1749,density:11.34,discovered:-7000,discoverer:"Ancient civilizations",group:"Post-transition",funfact:"'Plumbing' derives from 'plumbum' \u2014 Latin for lead." },
    { sym:"Hg",z:80,name:"Mercury",family:"toxic",trait:"Liquid metal at room temp",hook:"Historically used in thermometers and barometers",mass:200.592,state:"Liquid",econfig:"[Xe] 4f\u00B9\u2074 5d\u00B9\u2070 6s\u00B2",eneg:2.00,melt:-39,boil:357,density:13.53,discovered:-1500,discoverer:"Ancient civilizations",group:"Transition metal",funfact:"So dense that cannonballs float on it." },
    { sym:"Cs",z:55,name:"Caesium",family:"reactive",trait:"Liquid near room temp",hook:"Atomic clocks \u2014 its vibration frequency defines the second",mass:132.905,state:"Solid",econfig:"[Xe] 6s\u00B9",eneg:0.79,melt:28,boil:671,density:1.87,discovered:1860,discoverer:"Robert Bunsen",group:"Alkali metal",funfact:"Caesium clocks lose less than one second over 300 million years." },
    { sym:"Fr",z:87,name:"Francium",family:"reactive",trait:"Extremely radioactive/unstable",hook:"Used in research on atomic structure and quantum mechanics",mass:223,state:"Solid",econfig:"[Rn] 7s\u00B9",eneg:0.70,melt:27,boil:677,density:1.87,discovered:1939,discoverer:"Marguerite Perey",group:"Alkali metal",funfact:"Only about 30 grams exist on Earth at any given time." },
    { sym:"Ra",z:88,name:"Radium",family:"toxic",trait:"Highly radioactive",hook:"Deaths of the 'Radium Girls' led to workplace safety laws",mass:226,state:"Solid",econfig:"[Rn] 7s\u00B2",eneg:0.90,melt:696,boil:1500,density:5.50,discovered:1898,discoverer:"Marie & Pierre Curie",group:"Alkaline earth",funfact:"Glows faintly blue from its intense radioactivity." },
  ],
];

const ALL_ELEMENTS = RINGS.flat();

function ElementNode({ el, x, y, size, ringIdx, onHover, onLeave, onClick, isHovered, isSelected, dimmed }) {
  const ring = RING_META[ringIdx];
  const fam = FAMILIES[el.family];
  const active = isHovered || isSelected;
  const scale = isHovered ? 1.3 : isSelected ? 1.15 : 1;
  const opacity = dimmed ? 0.08 : 1;
  return (
    <g transform={`translate(${x},${y}) scale(${scale})`} onMouseEnter={()=>onHover(el)} onMouseLeave={onLeave} onClick={()=>onClick(el)} style={{cursor:"pointer",transition:"transform 0.3s cubic-bezier(.4,0,.2,1),opacity 0.4s",opacity}}>
      {active&&<circle r={size+16} fill="none" stroke={ring.color} strokeWidth={0.4} opacity={0.3}><animate attributeName="r" from={size+12} to={size+20} dur="2s" repeatCount="indefinite"/></circle>}
      {active&&<circle r={size+8} fill={ring.glow} opacity={0.25}/>}
      <circle r={size} fill="rgba(6,6,20,0.94)" stroke={fam.color} strokeWidth={active?2.8:1.6}/>
      <text y={-size*0.1} textAnchor="middle" fill={fam.color} fontSize={size*0.62} fontFamily="'Cormorant Garamond',Georgia,serif" fontWeight="700" style={{pointerEvents:"none"}}>{el.sym}</text>
      <text y={size*0.48} textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize={size*0.24} fontFamily="'JetBrains Mono',monospace" style={{pointerEvents:"none"}}>{el.z}</text>
      {active&&<text y={size+15} textAnchor="middle" fill="rgba(255,255,255,0.55)" fontSize={9} fontFamily="'JetBrains Mono',monospace" style={{pointerEvents:"none"}}>{el.name}</text>}
    </g>
  );
}

function DetailPanel({ el, onClose }) {
  if(!el) return null;
  const fam=FAMILIES[el.family];
  const ri=RINGS.findIndex(r=>r.some(e=>e.sym===el.sym));
  const ring=RING_META[ri];
  const disc=el.discovered<0?`~${Math.abs(el.discovered)} BCE`:el.discovered;
  const Stat=({label,val,unit})=>(
    <div style={{background:"rgba(255,255,255,0.025)",border:"1px solid rgba(255,255,255,0.06)",borderRadius:6,padding:"7px 10px"}}>
      <div style={{fontSize:7,color:"rgba(255,255,255,0.3)",letterSpacing:"0.14em",textTransform:"uppercase",fontFamily:"'JetBrains Mono',monospace"}}>{label}</div>
      <div style={{fontSize:14,fontWeight:700,color:"rgba(255,255,255,0.85)",marginTop:2,fontFamily:"'Cormorant Garamond',serif"}}>{val}{unit&&<span style={{fontSize:9,color:"rgba(255,255,255,0.35)",fontWeight:400,fontFamily:"'JetBrains Mono',monospace",marginLeft:3}}>{unit}</span>}</div>
    </div>
  );
  const Sec=({title,children})=>(<div style={{marginBottom:12}}><div style={{fontSize:7,color:"rgba(255,255,255,0.25)",letterSpacing:"0.16em",textTransform:"uppercase",marginBottom:4,fontFamily:"'JetBrains Mono',monospace"}}>{title}</div>{children}</div>);
  return (
    <div style={{position:"fixed",top:10,right:10,width:330,maxHeight:"calc(100vh - 20px)",overflowY:"auto",background:"rgba(8,8,22,0.97)",border:`1px solid ${ring.color}25`,borderRadius:14,zIndex:100,backdropFilter:"blur(20px)",boxShadow:`0 24px 80px rgba(0,0,0,0.6),inset 0 1px 0 rgba(255,255,255,0.04)`,animation:"panelIn 0.3s cubic-bezier(.4,0,.2,1)"}}>
      <div style={{padding:"20px 18px 14px",borderBottom:"1px solid rgba(255,255,255,0.05)"}}>
        <button onClick={onClose} style={{position:"absolute",top:14,right:14,background:"none",border:"none",color:"rgba(255,255,255,0.3)",fontSize:20,cursor:"pointer",lineHeight:1}}>×</button>
        <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:50,fontWeight:700,color:fam.color,lineHeight:1}}>{el.sym}</div>
        <div style={{fontSize:17,fontWeight:700,color:"rgba(255,255,255,0.9)",marginTop:1}}>{el.name}</div>
        <div style={{fontSize:9,color:"rgba(255,255,255,0.3)",letterSpacing:"0.08em",textTransform:"uppercase",marginTop:4,fontFamily:"'JetBrains Mono',monospace"}}>Z {el.z} · {el.group} · {el.state}</div>
        <div style={{display:"flex",gap:5,marginTop:10,flexWrap:"wrap"}}>
          <span style={{fontSize:8,fontWeight:700,padding:"2px 9px",borderRadius:10,background:ring.color,color:"#0a0a1e",letterSpacing:"0.05em",textTransform:"uppercase",fontFamily:"'JetBrains Mono',monospace"}}>{ring.name}</span>
          <span style={{fontSize:8,fontWeight:700,padding:"2px 9px",borderRadius:10,background:"rgba(255,255,255,0.08)",color:fam.color,letterSpacing:"0.05em",textTransform:"uppercase",fontFamily:"'JetBrains Mono',monospace"}}>{fam.label}</span>
        </div>
      </div>
      <div style={{padding:"14px 18px 18px"}}>
        <Sec title="Historical Significance"><div style={{fontSize:13,lineHeight:1.65,color:"rgba(255,255,255,0.8)"}}>{el.hook}</div></Sec>
        <Sec title="Fun Fact"><div style={{fontSize:12,lineHeight:1.6,color:"rgba(255,255,255,0.55)",fontStyle:"italic"}}>{el.funfact}</div></Sec>
        <Sec title="Chemical Trait"><div style={{fontSize:12,color:"rgba(255,255,255,0.45)",fontStyle:"italic"}}>{el.trait}</div></Sec>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6,marginTop:4}}>
          <Stat label="Atomic Mass" val={el.mass} unit="u"/>
          <Stat label="Electronegativity" val={el.eneg??"\u2014"}/>
          <Stat label="Melting Point" val={el.melt} unit="\u00B0C"/>
          <Stat label="Boiling Point" val={el.boil} unit="\u00B0C"/>
          <Stat label="Density" val={el.density} unit="g/cm\u00B3"/>
          <Stat label="Electron Config" val={el.econfig}/>
        </div>
        <div style={{marginTop:10,background:"rgba(255,255,255,0.025)",border:"1px solid rgba(255,255,255,0.06)",borderRadius:6,padding:"7px 10px"}}>
          <div style={{fontSize:7,color:"rgba(255,255,255,0.3)",letterSpacing:"0.14em",textTransform:"uppercase",fontFamily:"'JetBrains Mono',monospace"}}>Discovery</div>
          <div style={{fontSize:14,fontWeight:700,color:"rgba(255,255,255,0.8)",marginTop:2,fontFamily:"'Cormorant Garamond',serif"}}>{disc}</div>
          <div style={{fontSize:9,color:"rgba(255,255,255,0.35)",marginTop:1,fontFamily:"'JetBrains Mono',monospace"}}>{el.discoverer}</div>
        </div>
      </div>
    </div>
  );
}

function Sidebar({ activeRing, onRingClick, open, onToggle }) {
  return (
    <div style={{position:"fixed",left:0,top:0,bottom:0,width:open?320:44,background:"rgba(6,6,18,0.95)",borderRight:"1px solid rgba(255,255,255,0.06)",zIndex:80,transition:"width 0.4s cubic-bezier(.4,0,.2,1)",overflow:"hidden",backdropFilter:"blur(16px)",display:"flex",flexDirection:"column"}}>
      <button onClick={onToggle} style={{background:"none",border:"none",color:"rgba(255,255,255,0.5)",fontSize:18,cursor:"pointer",padding:"14px 12px",textAlign:"center",flexShrink:0,width:44,alignSelf:"flex-start",transition:"color 0.2s"}}>{open?"\u25C1":"\u25B7"}</button>
      {!open&&<div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:12,padding:"10px 0"}}>{RING_META.map((r,i)=>(<button key={r.id} onClick={()=>onRingClick(i)} title={r.name} style={{width:20,height:20,borderRadius:"50%",border:`2px solid ${r.color}`,background:activeRing===i?`${r.color}30`:"transparent",cursor:"pointer",transition:"all 0.2s",flexShrink:0}}/>))}</div>}
      {open&&<div style={{padding:"0 20px 20px",overflowY:"auto",flex:1}}>
        <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:18,fontWeight:700,color:"rgba(255,255,255,0.85)",marginBottom:4}}>Ring Guide</div>
        <div style={{fontSize:9,color:"rgba(255,255,255,0.25)",letterSpacing:"0.2em",textTransform:"uppercase",marginBottom:20,fontFamily:"'JetBrains Mono',monospace"}}>Click a ring to isolate it</div>
        {RING_META.map((ring,i)=>{
          const isA=activeRing===i;
          return (
            <div key={ring.id} onClick={()=>onRingClick(i)} style={{marginBottom:16,padding:"14px 16px",borderRadius:10,cursor:"pointer",background:isA?`${ring.color}10`:"rgba(255,255,255,0.015)",border:isA?`1px solid ${ring.color}35`:"1px solid rgba(255,255,255,0.04)",transition:"all 0.3s"}}>
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}>
                <div style={{width:12,height:12,borderRadius:"50%",background:ring.color,boxShadow:isA?`0 0 12px ${ring.glow}`:"none",flexShrink:0}}/>
                <div>
                  <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:15,fontWeight:700,color:isA?ring.color:"rgba(255,255,255,0.75)"}}>{ring.name}</div>
                  <div style={{fontSize:8,color:"rgba(255,255,255,0.3)",letterSpacing:"0.08em",fontFamily:"'JetBrains Mono',monospace"}}>{ring.tagline} · {RINGS[i].length} elements</div>
                </div>
              </div>
              <div style={{fontSize:11,lineHeight:1.65,color:isA?"rgba(255,255,255,0.6)":"rgba(255,255,255,0.3)",transition:"color 0.3s"}}>{ring.rationale}</div>
              <div style={{display:"flex",flexWrap:"wrap",gap:4,marginTop:8}}>{RINGS[i].map(el=>(<span key={el.sym} style={{fontSize:9,fontFamily:"'Cormorant Garamond',serif",fontWeight:700,color:isA?FAMILIES[el.family].color:"rgba(255,255,255,0.25)",background:"rgba(255,255,255,0.03)",borderRadius:3,padding:"1px 5px",transition:"color 0.3s"}}>{el.sym}</span>))}</div>
            </div>
          );
        })}
      </div>}
    </div>
  );
}

function Stars({ count = 200, elements }) {
  const [activeStar, setActiveStar] = useState(null);
  const stars = useMemo(() => {
    const facts = (el) => {
      const disc = el.discovered < 0 ? `~${Math.abs(el.discovered)} BCE` : el.discovered;
      const pool = [
        `State: ${el.state} at room temperature`,
        `Boiling point: ${el.boil}\u00B0C`,
        `Melting point: ${el.melt}\u00B0C`,
        `Density: ${el.density} g/cm\u00B3`,
        `Atomic mass: ${el.mass} u`,
        `Group: ${el.group}`,
        el.eneg !== null ? `Electronegativity: ${el.eneg}` : `Config: ${el.econfig}`,
        `Discovered: ${disc}`,
        `Discoverer: ${el.discoverer}`,
        el.funfact,
      ];
      return pool[Math.floor(Math.random() * pool.length)];
    };
    const s = [];
    for (let i = 0; i < count; i++) {
      const el = elements[Math.floor(Math.random() * elements.length)];
      s.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 3 + 1.5,
        opacity: Math.random() * 0.5 + 0.35,
        delay: Math.random() * 5,
        el,
        fact: facts(el),
      });
    }
    return s;
  }, [count, elements]);

  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none", zIndex: 2 }}>
      {stars.map((s) => (
        <div key={s.id} style={{ position: "absolute", left: `${s.x}%`, top: `${s.y}%`, pointerEvents: "auto" }}>
          <div
            onClick={(e) => { e.stopPropagation(); setActiveStar(activeStar === s.id ? null : s.id); }}
            style={{
              width: 16, height: 16, borderRadius: "50%", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              position: "relative",
            }}
          >
            <div style={{
              width: s.size, height: s.size, borderRadius: "50%",
              background: FAMILIES[s.el.family]?.color || "rgba(255,255,255,0.8)",
              opacity: s.opacity,
              boxShadow: `0 0 ${s.size + 3}px ${FAMILIES[s.el.family]?.color || "rgba(255,255,255,0.6)"}`,
              animation: `twinkle ${3 + s.delay}s ease-in-out ${s.delay}s infinite alternate`,
              transition: "transform 0.2s, opacity 0.2s",
              transform: activeStar === s.id ? "scale(3)" : "scale(1)",
            }} />
          </div>
          {activeStar === s.id && (
            <div style={{
              position: "absolute", top: -8, left: 12, whiteSpace: "nowrap", zIndex: 110,
              background: "rgba(6,6,20,0.95)", border: `1px solid ${FAMILIES[s.el.family]?.color || "#fff"}40`,
              borderRadius: 8, padding: "8px 12px", backdropFilter: "blur(12px)",
              boxShadow: `0 8px 24px rgba(0,0,0,0.5)`, pointerEvents: "auto",
              animation: "panelIn 0.2s ease-out",
            }} onClick={(e) => e.stopPropagation()}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 3 }}>
                <span style={{
                  fontFamily: "'Cormorant Garamond',serif", fontWeight: 700, fontSize: 16,
                  color: FAMILIES[s.el.family]?.color || "#fff",
                }}>{s.el.sym}</span>
                <span style={{ fontSize: 11, color: "rgba(255,255,255,0.75)", fontWeight: 500 }}>{s.el.name}</span>
                <span style={{ fontSize: 9, color: "rgba(255,255,255,0.25)", fontFamily: "'JetBrains Mono',monospace" }}>Z{s.el.z}</span>
              </div>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.55)", fontFamily: "'JetBrains Mono',monospace", maxWidth: 260, whiteSpace: "normal", lineHeight: 1.5 }}>{s.fact}</div>
            </div>
          )}
        </div>
      ))}
      {activeStar !== null && (
        <div onClick={() => setActiveStar(null)} style={{ position: "fixed", inset: 0, zIndex: -1, pointerEvents: "auto" }} />
      )}
    </div>
  );
}

export default function ElementalCosmos() {
  const [hovered,setHovered]=useState(null);
  const [selected,setSelected]=useState(null);
  const [activeRing,setActiveRing]=useState(null);
  const [searchQuery,setSearchQuery]=useState("");
  const [searchFocused,setSearchFocused]=useState(false);
  const [sidebarOpen,setSidebarOpen]=useState(true);
  const [dims,setDims]=useState({w:800,h:800});
  const wrapRef=useRef(null);
  const searchRef=useRef(null);

  useEffect(()=>{
    const m=()=>{if(!wrapRef.current)return;const r=wrapRef.current.getBoundingClientRect();const sW=sidebarOpen?320:44;const a=r.width-sW-20;const s=Math.min(a,r.height-120);setDims({w:Math.max(s,400),h:Math.max(s,400)});};
    m();window.addEventListener("resize",m);return()=>window.removeEventListener("resize",m);
  },[sidebarOpen]);

  useEffect(()=>{
    const h=(e)=>{if(e.key==="Escape"){setSelected(null);setSearchQuery("");searchRef.current?.blur();}};
    document.addEventListener("keydown",h);return()=>document.removeEventListener("keydown",h);
  },[]);

  const cx=dims.w/2,cy=dims.h/2+10,maxR=Math.min(cx,cy-10)*0.84;
  const ringRadii=[0,maxR*0.28,maxR*0.54,maxR*0.82];
  const nodeSizes=[26,20,17,16];

  const positions=useMemo(()=>{
    const res=[];
    RINGS.forEach((ring,ri)=>{
      const r=ringRadii[ri];
      if(ri===0){
        const L=[{dx:0,dy:-34},{dx:34,dy:6},{dx:-34,dy:6},{dx:0,dy:38}];
        ring.forEach((el,i)=>res.push({el,x:cx+(L[i]?.dx||0),y:cy+(L[i]?.dy||0),size:nodeSizes[ri],ring:ri}));
      } else {
        ring.forEach((el,i)=>{const a=(2*Math.PI*i)/ring.length-Math.PI/2;res.push({el,x:cx+r*Math.cos(a),y:cy+r*Math.sin(a),size:nodeSizes[ri],ring:ri});});
      }
    });
    return res;
  },[cx,cy,maxR]);

  const searchResults=useMemo(()=>{
    if(!searchQuery.trim())return[];
    const q=searchQuery.toLowerCase();
    return ALL_ELEMENTS.filter(el=>el.sym.toLowerCase().includes(q)||el.name.toLowerCase().includes(q)||String(el.z).includes(q)).slice(0,6);
  },[searchQuery]);

  const isDimmed=(el,ri)=>{
    if(activeRing!==null&&ri!==activeRing)return true;
    if(searchQuery.trim()&&!searchResults.some(r=>r.sym===el.sym))return true;
    return false;
  };

  const handleRingClick=useCallback((i)=>setActiveRing(p=>p===i?null:i),[]);
  const handleSelect=useCallback((el)=>{setSelected(p=>p?.sym===el.sym?null:el);setSearchQuery("");},[]);
  const handleSearchSelect=useCallback((el)=>{setSelected(el);setSearchQuery("");searchRef.current?.blur();},[]);

  return (
    <div ref={wrapRef} style={{width:"100%",minHeight:"100vh",background:"radial-gradient(ellipse at 60% 50%,#0c0c22 0%,#060612 40%,#020208 100%)",fontFamily:"'JetBrains Mono',monospace",overflow:"auto",position:"relative",display:"flex",flexDirection:"column"}}>
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=JetBrains+Mono:wght@300;400;500;700&display=swap" rel="stylesheet"/>
      <style>{`@keyframes panelIn{from{opacity:0;transform:translateX(24px)}to{opacity:1;transform:translateX(0)}}@keyframes twinkle{0%{opacity:0.1;transform:scale(1)}100%{opacity:0.8;transform:scale(1.3)}}html,body{margin:0;padding:0;overflow:auto;scroll-behavior:smooth}::-webkit-scrollbar{width:6px}::-webkit-scrollbar-track{background:rgba(6,6,18,0.5)}::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.12);border-radius:3px}::-webkit-scrollbar-thumb:hover{background:rgba(255,255,255,0.2)}`}</style>

      <Sidebar activeRing={activeRing} onRingClick={handleRingClick} open={sidebarOpen} onToggle={()=>setSidebarOpen(p=>!p)}/>

      <div style={{marginLeft:sidebarOpen?320:44,transition:"margin-left 0.4s cubic-bezier(.4,0,.2,1)",flex:1,display:"flex",flexDirection:"column",position:"relative",zIndex:1}}>
        <div style={{textAlign:"center",padding:"14px 20px 0",flexShrink:0}}>
          <h1 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"clamp(22px,3.5vw,40px)",fontWeight:700,color:"rgba(255,255,255,0.92)",margin:0,letterSpacing:"0.14em",textTransform:"uppercase"}}>The Elemental Cosmos</h1>
          <p style={{fontSize:10,color:"rgba(255,255,255,0.25)",letterSpacing:"0.3em",textTransform:"uppercase",margin:"3px 0 0"}}>40 Elements · 4 Rings · Arranged by proximity to human life</p>
          <p style={{fontSize:12,color:"rgba(255,255,255,0.7)",margin:"8px 0 0",letterSpacing:"0.06em",fontFamily:"'Cormorant Garamond',serif",fontWeight:600}}>Jane-Rose Marwa &nbsp;·&nbsp; Armanique Newman &nbsp;·&nbsp; Rougy Rucogoza &nbsp;·&nbsp; Esere Ejumudo</p>
        </div>

        <div style={{display:"flex",justifyContent:"center",padding:"10px 20px 0",zIndex:50}}>
          <div style={{position:"relative",width:260}}>
            <span style={{position:"absolute",left:10,top:"50%",transform:"translateY(-50%)",color:"rgba(255,255,255,0.25)",fontSize:13,pointerEvents:"none"}}>⌕</span>
            <input ref={searchRef} type="text" value={searchQuery} placeholder="Search by name, symbol, or Z..." onChange={e=>setSearchQuery(e.target.value)} onFocus={()=>setSearchFocused(true)} onBlur={()=>setTimeout(()=>setSearchFocused(false),200)} style={{width:"100%",background:"rgba(255,255,255,0.04)",border:`1px solid ${searchFocused?"rgba(255,255,255,0.2)":"rgba(255,255,255,0.08)"}`,borderRadius:8,color:"rgba(255,255,255,0.85)",fontFamily:"'JetBrains Mono',monospace",fontSize:11,padding:"8px 14px 8px 30px",outline:"none",transition:"border-color 0.2s"}}/>
            {searchFocused&&searchResults.length>0&&(
              <div style={{position:"absolute",top:"100%",left:0,right:0,background:"rgba(8,8,22,0.98)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:"0 0 8px 8px",maxHeight:200,overflowY:"auto",zIndex:70}}>
                {searchResults.map(el=>{const ri=RINGS.findIndex(r=>r.some(e=>e.sym===el.sym));return(
                  <div key={el.sym} onClick={()=>handleSearchSelect(el)} style={{padding:"8px 14px",cursor:"pointer",display:"flex",alignItems:"center",gap:10,fontSize:11,transition:"background 0.15s"}} onMouseEnter={e=>e.currentTarget.style.background="rgba(255,255,255,0.05)"} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                    <span style={{fontFamily:"'Cormorant Garamond',serif",fontWeight:700,fontSize:18,color:RING_META[ri]?.color||"#fff",width:32}}>{el.sym}</span>
                    <span style={{color:"rgba(255,255,255,0.65)"}}>{el.name}</span>
                    <span style={{color:"rgba(255,255,255,0.25)",marginLeft:"auto"}}>Z {el.z}</span>
                  </div>
                );})}
              </div>
            )}
          </div>
        </div>

        <div style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",position:"relative",minHeight:dims.h+40}}>
          <svg width={dims.w} height={dims.h} viewBox={`0 0 ${dims.w} ${dims.h}`}>
            <defs><radialGradient id="cG"><stop offset="0%" stopColor="rgba(244,211,94,0.1)"/><stop offset="100%" stopColor="rgba(244,211,94,0)"/></radialGradient></defs>
            <circle cx={cx} cy={cy} r={maxR*0.15} fill="url(#cG)"/>

            {ringRadii.slice(1).map((r,i)=>{
              const ri=i+1;const ring=RING_META[ri];const isA=activeRing===ri;const anyA=activeRing!==null;const dim=anyA&&!isA;const op=isA?0.4:dim?0.03:0.12;
              return(<g key={ri}><circle cx={cx} cy={cy} r={r} fill="none" stroke={ring.color} strokeWidth={isA?14:6} opacity={isA?0.06:0.02}/><circle cx={cx} cy={cy} r={r} fill="none" stroke={ring.color} strokeWidth={isA?2.2:1} opacity={op} strokeDasharray={ri===3?"8,10":"none"} style={{cursor:"pointer",transition:"all 0.4s"}} onClick={()=>handleRingClick(ri)}/></g>);
            })}

            {RING_META.map((ring,ri)=>{
              const r=ringRadii[ri];const isA=activeRing===ri;const anyA=activeRing!==null;const dim=anyA&&!isA;
              if(ri===0) return <text key={ri} x={cx} y={cy-72} textAnchor="middle" fill={isA?ring.color:dim?"rgba(255,255,255,0.06)":"rgba(255,255,255,0.18)"} fontSize={10} fontFamily="'JetBrains Mono',monospace" letterSpacing="0.14em" fontWeight={isA?500:300} style={{cursor:"pointer",transition:"fill 0.4s",textTransform:"uppercase"}} onClick={()=>handleRingClick(ri)}>{ring.name}</text>;
              return <text key={ri} x={cx} y={cy-r-36} textAnchor="middle" fill={isA?ring.color:dim?"rgba(255,255,255,0.06)":"rgba(255,255,255,0.18)"} fontSize={9} fontFamily="'JetBrains Mono',monospace" letterSpacing="0.14em" fontWeight={isA?600:300} style={{cursor:"pointer",transition:"fill 0.4s",textTransform:"uppercase"}} onClick={()=>handleRingClick(ri)}>{ring.name}</text>;
            })}

            {positions.map(pos=>(<ElementNode key={pos.el.sym} el={pos.el} x={pos.x} y={pos.y} size={pos.size} ringIdx={pos.ring} onHover={setHovered} onLeave={()=>setHovered(null)} onClick={handleSelect} isHovered={hovered?.sym===pos.el.sym} isSelected={selected?.sym===pos.el.sym} dimmed={isDimmed(pos.el,pos.ring)}/>))}
          </svg>

          {hovered&&!selected&&(
            <div style={{position:"fixed",bottom:60,left:"50%",transform:"translateX(-50%)",background:"rgba(8,8,22,0.96)",border:`1px solid ${RING_META[RINGS.findIndex(r=>r.some(e=>e.sym===hovered.sym))]?.color||"#fff"}30`,borderRadius:10,padding:"12px 20px",maxWidth:420,textAlign:"center",backdropFilter:"blur(14px)",zIndex:30,pointerEvents:"auto"}}>
              <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:10,marginBottom:5}}>
                <span style={{fontFamily:"'Cormorant Garamond',serif",fontSize:30,fontWeight:700,color:FAMILIES[hovered.family].color}}>{hovered.sym}</span>
                <div>
                  <div style={{color:"rgba(255,255,255,0.9)",fontSize:14,fontWeight:600}}>{hovered.name}</div>
                  <div style={{color:"rgba(255,255,255,0.35)",fontSize:9,fontFamily:"'JetBrains Mono',monospace"}}>Z {hovered.z} · {hovered.mass} u · {hovered.state} · {hovered.group}</div>
                </div>
              </div>
              <div style={{color:"rgba(255,255,255,0.4)",fontSize:10,fontStyle:"italic",marginBottom:3}}>{hovered.trait}</div>
              <div style={{color:"rgba(255,255,255,0.6)",fontSize:11,lineHeight:1.55}}>{hovered.hook}</div>
              <div style={{color:"rgba(255,255,255,0.2)",fontSize:8,marginTop:5,letterSpacing:"0.08em"}}>CLICK TO EXPLORE</div>
            </div>
          )}

          <DetailPanel el={selected} onClose={()=>setSelected(null)}/>
        </div>

        <div style={{display:"flex",flexWrap:"wrap",justifyContent:"center",gap:"4px 10px",padding:"6px 20px 4px"}}>
          {RING_META.map((ring,i)=>(<button key={ring.id} onClick={()=>handleRingClick(i)} style={{display:"flex",alignItems:"center",gap:5,background:activeRing===i?`${ring.color}12`:"transparent",border:activeRing===i?`1px solid ${ring.color}30`:"1px solid transparent",borderRadius:4,padding:"3px 8px",cursor:"pointer",transition:"all 0.25s"}}><span style={{width:7,height:7,borderRadius:"50%",background:ring.color,boxShadow:activeRing===i?`0 0 10px ${ring.glow}`:"none",flexShrink:0}}/><span style={{fontSize:9,color:activeRing===i?ring.color:"rgba(255,255,255,0.3)",letterSpacing:"0.05em",whiteSpace:"nowrap"}}>{ring.name}</span><span style={{fontSize:8,color:"rgba(255,255,255,0.15)",fontFamily:"'JetBrains Mono',monospace"}}>{RINGS[i].length}</span></button>))}
        </div>
        <div style={{textAlign:"center",padding:"4px 20px 10px",fontSize:8,color:"rgba(255,255,255,0.12)",letterSpacing:"0.12em"}}>Hover to preview · Click to explore · Press Esc to close</div>
      </div>

      <Stars count={180} elements={ALL_ELEMENTS} />
    </div>
  );
}
