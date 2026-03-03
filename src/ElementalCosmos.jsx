import { useState, useRef, useEffect } from "react";

const FAMILIES = {
  foundation: { label: "Foundation", color: "#F4E04D", glow: "rgba(244,224,77,0.4)" },
  lifeEssential: { label: "Life Essential", color: "#4ECDC4", glow: "rgba(78,205,196,0.4)" },
  bioElectrolyte: { label: "Biology & Electrolytes", color: "#45B7D1", glow: "rgba(69,183,209,0.4)" },
  structural: { label: "Conductive / Structural", color: "#F7946B", glow: "rgba(247,148,107,0.4)" },
  technology: { label: "Technology & Industry", color: "#A78BFA", glow: "rgba(167,139,250,0.4)" },
  reactive: { label: "Reactive & Volatile", color: "#F472B6", glow: "rgba(244,114,182,0.4)" },
  medical: { label: "Medical & Pharmaceutical", color: "#34D399", glow: "rgba(52,211,153,0.4)" },
  toxic: { label: "Toxic Yet Transformative", color: "#EF4444", glow: "rgba(239,68,68,0.4)" },
};

const ORBITS = [
  {
    name: "Genesis Core",
    description: "The primordial elements — building blocks of stars, atmospheres, and life itself",
    radius: 0,
    elements: [
      { sym: "H", name: "Hydrogen", z: 1, family: "foundation", trait: "Highly reactive non-metal", hook: "Most abundant element in the universe — fuel of stars" },
      { sym: "O", name: "Oxygen", z: 8, family: "lifeEssential", trait: "Gas at room temperature", hook: "Essential for human respiration and medical oxygen therapy" },
      { sym: "C", name: "Carbon", z: 6, family: "lifeEssential", trait: "Non-metal", hook: "Forms the backbone of all organic molecules and life on Earth" },
      { sym: "N", name: "Nitrogen", z: 7, family: "lifeEssential", trait: "Gas at room temperature", hook: "Makes up ~78% of Earth's atmosphere; crucial in fertilizers" },
    ],
  },
  {
    name: "Vital Ring",
    description: "Elements that flow through our blood, build our bones, and fire our neurons",
    radius: 1,
    elements: [
      { sym: "Ca", name: "Calcium", z: 20, family: "bioElectrolyte", trait: "Typical ion charge of +2", hook: "Essential for bone and tooth formation" },
      { sym: "Na", name: "Sodium", z: 11, family: "bioElectrolyte", trait: "Typical ion charge of +1", hook: "Found in table salt; key role in nerve impulses" },
      { sym: "K", name: "Potassium", z: 19, family: "bioElectrolyte", trait: "High reactivity", hook: "Important electrolyte regulating heart and muscle function" },
      { sym: "Fe", name: "Iron", z: 26, family: "bioElectrolyte", trait: "Good conductor of heat/electricity", hook: "Major component of steel; drove the Industrial Revolution" },
      { sym: "Mg", name: "Magnesium", z: 12, family: "medical", trait: "Flammable light metal", hook: "Used in flares, pyrotechnics, and medical supplements" },
      { sym: "Mn", name: "Manganese", z: 25, family: "bioElectrolyte", trait: "Transition metal", hook: "Essential trace mineral for metabolism and bone health" },
      { sym: "Co", name: "Cobalt", z: 27, family: "bioElectrolyte", trait: "Transition metal", hook: "Core of Vitamin B12; used in rechargeable batteries" },
      { sym: "Se", name: "Selenium", z: 34, family: "bioElectrolyte", trait: "Non-metal / metalloid", hook: "Essential trace element for thyroid and immune function" },
      { sym: "I", name: "Iodine", z: 53, family: "reactive", trait: "Crystalline solid halogen", hook: "Essential for thyroid hormones and regulating bodily functions" },
      { sym: "P", name: "Phosphorus", z: 15, family: "medical", trait: "Essential nutrient", hook: "Critical for DNA, ATP, and fertilizers for global food supply" },
      { sym: "S", name: "Sulfur", z: 16, family: "medical", trait: "Non-metal", hook: "Key component of early gunpowder; used in pharmaceuticals" },
      { sym: "Zn", name: "Zinc", z: 30, family: "medical", trait: "Protects steel from rust", hook: "Essential trace element; used in wound healing and immunity" },
    ],
  },
  {
    name: "Civilization Ring",
    description: "The elements we shaped into tools, wires, bridges, and machines — the skeleton of society",
    radius: 2,
    elements: [
      { sym: "Cu", name: "Copper", z: 29, family: "structural", trait: "Excellent conductor", hook: "Widely used in electrical wiring and modern infrastructure" },
      { sym: "Si", name: "Silicon", z: 14, family: "technology", trait: "Metalloid", hook: "Foundation of computer chips and modern digital technology" },
      { sym: "Ti", name: "Titanium", z: 22, family: "structural", trait: "Highly corrosion resistant", hook: "Used in joint replacements due to strength and biocompatibility" },
      { sym: "Au", name: "Gold", z: 79, family: "structural", trait: "Noble metal, excellent conductor", hook: "Symbol of wealth; essential in electronics and aerospace" },
      { sym: "W", name: "Tungsten", z: 74, family: "structural", trait: "Highest melting point of all metals", hook: "Used in light bulb filaments and cutting tools" },
      { sym: "Cr", name: "Chromium", z: 24, family: "structural", trait: "Hard, lustrous transition metal", hook: "Key component of stainless steel and chrome plating" },
      { sym: "Al", name: "Aluminum", z: 13, family: "technology", trait: "Lightweight metal", hook: "Used in aerospace and modern transport" },
      { sym: "Ag", name: "Silver", z: 47, family: "medical", trait: "Highest electrical conductivity", hook: "Historically used as currency; antimicrobial in medicine" },
      { sym: "Pt", name: "Platinum", z: 78, family: "medical", trait: "Noble metal", hook: "Used in catalytic converters and chemotherapy drugs" },
      { sym: "Sn", name: "Tin", z: 50, family: "toxic", trait: "Post-transition metal", hook: "Key component of Bronze — defined the Bronze Age" },
      { sym: "Ni", name: "Nickel", z: 28, family: "toxic", trait: "Transition metal", hook: "Used in stainless steel and rechargeable batteries" },
      { sym: "B", name: "Boron", z: 5, family: "foundation", trait: "Metalloid", hook: "Essential in nuclear shielding and semiconductor doping" },
      { sym: "He", name: "Helium", z: 2, family: "foundation", trait: "Noble gas", hook: "Second most abundant element; used in cryogenics and MRI" },
    ],
  },
  {
    name: "Frontier Ring",
    description: "Volatile, reactive, and often dangerous — these elements pushed science to its limits",
    radius: 3,
    elements: [
      { sym: "Li", name: "Lithium", z: 3, family: "reactive", trait: "Highly reactive alkali metal", hook: "Mood stabilizer for psychiatric disorders; powers batteries" },
      { sym: "F", name: "Fluorine", z: 9, family: "reactive", trait: "Highly reactive toxic gas", hook: "Used in imaging machines, anesthesia, and toothpaste" },
      { sym: "Cl", name: "Chlorine", z: 17, family: "reactive", trait: "Highly reactive toxic gas", hook: "Used for sanitation of swimming pools and in household bleach" },
      { sym: "Br", name: "Bromine", z: 35, family: "reactive", trait: "Volatile liquid halogen", hook: "Used as fire retardant in furniture, electronics, and textiles" },
      { sym: "Rb", name: "Rubidium", z: 37, family: "reactive", trait: "Ignites in air", hook: "Used in PET scans for medical imaging and scientific research" },
      { sym: "Ba", name: "Barium", z: 56, family: "technology", trait: "Alkaline earth metal", hook: "Used in medical imaging (barium swallows) and drilling fluids" },
      { sym: "Pb", name: "Lead", z: 82, family: "toxic", trait: "Unreactive, poor conductor", hook: "Used in radiation shielding aprons for X-rays" },
      { sym: "Hg", name: "Mercury", z: 80, family: "toxic", trait: "Liquid metal at room temp", hook: "Historically used in thermometers and barometers" },
    ],
  },
  {
    name: "Outer Void",
    description: "The most extreme elements — radioactive, unstable, and profoundly transformative to science and law",
    radius: 4,
    elements: [
      { sym: "Cs", name: "Caesium", z: 55, family: "reactive", trait: "Liquid near room temp", hook: "Atomic clocks — its vibration frequency defines the second" },
      { sym: "Fr", name: "Francium", z: 87, family: "reactive", trait: "Extremely radioactive/unstable", hook: "Used in research on atomic structure and quantum mechanics" },
      { sym: "Ra", name: "Radium", z: 88, family: "toxic", trait: "Highly radioactive", hook: "Deaths of 'Radium Girls' led to workplace safety laws" },
    ],
  },
];

const ALL_ELEMENTS = ORBITS.flatMap((o) => o.elements);

function ElementNode({ el, x, y, size, onHover, onLeave, isActive, isHovered, dimmed }) {
  const fam = FAMILIES[el.family];
  const scale = isHovered ? 1.2 : isActive ? 1.05 : 1;
  const opacity = dimmed ? 0.2 : 1;

  return (
    <g
      transform={`translate(${x}, ${y}) scale(${scale})`}
      onMouseEnter={() => onHover(el)}
      onMouseLeave={onLeave}
      style={{ cursor: "pointer", transition: "transform 0.3s ease, opacity 0.3s ease", opacity }}
    >
      <circle r={size} fill="rgba(10,10,30,0.85)" stroke={fam.color} strokeWidth={isHovered ? 2.5 : 1.5} />
      {isHovered && <circle r={size + 6} fill="none" stroke={fam.color} strokeWidth={0.5} opacity={0.6} />}
      <text
        y={-size * 0.15}
        textAnchor="middle"
        fill={fam.color}
        fontSize={size * 0.7}
        fontFamily="'Cormorant Garamond', Georgia, serif"
        fontWeight="700"
      >
        {el.sym}
      </text>
      <text
        y={size * 0.55}
        textAnchor="middle"
        fill="rgba(255,255,255,0.5)"
        fontSize={size * 0.28}
        fontFamily="'IBM Plex Mono', monospace"
      >
        {el.z}
      </text>
    </g>
  );
}

export default function ElementalCosmos() {
  const [hovered, setHovered] = useState(null);
  const [selectedOrbit, setSelectedOrbit] = useState(null);
  const [activeFamily, setActiveFamily] = useState(null);
  const [dimensions, setDimensions] = useState({ w: 900, h: 900 });
  const containerRef = useRef(null);

  useEffect(() => {
    const measure = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const s = Math.min(rect.width, rect.height - 60);
        setDimensions({ w: Math.max(s, 500), h: Math.max(s, 500) });
      }
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  const cx = dimensions.w / 2;
  const cy = dimensions.h / 2;
  const maxR = Math.min(cx, cy) * 0.88;
  const orbitRadii = [0, maxR * 0.22, maxR * 0.44, maxR * 0.67, maxR * 0.88];
  const nodeSizes = [22, 18, 16, 15, 15];

  const getPositions = () => {
    const positions = [];
    ORBITS.forEach((orbit, oi) => {
      const r = orbitRadii[oi];
      const els = orbit.elements;
      if (oi === 0) {
        const coreLayout = [
          { dx: 0, dy: -28 },
          { dx: 28, dy: 8 },
          { dx: -28, dy: 8 },
          { dx: 0, dy: 30 },
        ];
        els.forEach((el, i) => {
          positions.push({
            el,
            x: cx + (coreLayout[i]?.dx || 0),
            y: cy + (coreLayout[i]?.dy || 0),
            size: nodeSizes[oi],
            orbit: oi,
          });
        });
      } else {
        els.forEach((el, i) => {
          const angle = (2 * Math.PI * i) / els.length - Math.PI / 2;
          positions.push({
            el,
            x: cx + r * Math.cos(angle),
            y: cy + r * Math.sin(angle),
            size: nodeSizes[oi],
            orbit: oi,
          });
        });
      }
    });
    return positions;
  };

  const positions = getPositions();

  const isDimmed = (el, orbitIdx) => {
    if (activeFamily && el.family !== activeFamily) return true;
    if (selectedOrbit !== null && orbitIdx !== selectedOrbit) return true;
    return false;
  };

  return (
    <div
      ref={containerRef}
      style={{
        width: "100%",
        height: "100vh",
        background: "radial-gradient(ellipse at center, #0a0a1e 0%, #050510 50%, #020208 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        fontFamily: "'IBM Plex Mono', monospace",
        overflow: "hidden",
        position: "relative",
      }}
    >
      <link
        href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=IBM+Plex+Mono:wght@300;400;500&display=swap"
        rel="stylesheet"
      />

      {/* Title */}
      <div style={{ textAlign: "center", paddingTop: 16, zIndex: 10, flexShrink: 0 }}>
        <h1
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "clamp(22px, 3vw, 36px)",
            fontWeight: 600,
            color: "rgba(255,255,255,0.9)",
            margin: 0,
            letterSpacing: "0.15em",
            textTransform: "uppercase",
          }}
        >
          The Elemental Cosmos
        </h1>
        <p
          style={{
            fontSize: "clamp(9px, 1.2vw, 12px)",
            color: "rgba(255,255,255,0.35)",
            margin: "4px 0 0",
            letterSpacing: "0.3em",
            textTransform: "uppercase",
          }}
        >
          Elements arranged by proximity to human life
        </p>
      </div>

      {/* Main SVG */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", width: "100%", position: "relative" }}>
        <svg width={dimensions.w} height={dimensions.h} viewBox={`0 0 ${dimensions.w} ${dimensions.h}`}>
          <defs>
            <radialGradient id="coreGlow">
              <stop offset="0%" stopColor="rgba(244,224,77,0.08)" />
              <stop offset="100%" stopColor="rgba(244,224,77,0)" />
            </radialGradient>
            {Object.entries(FAMILIES).map(([key, fam]) => (
              <radialGradient key={key} id={`glow-${key}`}>
                <stop offset="0%" stopColor={fam.glow} />
                <stop offset="100%" stopColor="transparent" />
              </radialGradient>
            ))}
          </defs>

          {/* Core glow */}
          <circle cx={cx} cy={cy} r={maxR * 0.12} fill="url(#coreGlow)" />

          {/* Orbit rings */}
          {orbitRadii.slice(1).map((r, i) => (
            <circle
              key={i}
              cx={cx}
              cy={cy}
              r={r}
              fill="none"
              stroke={selectedOrbit === i + 1 ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.04)"}
              strokeWidth={selectedOrbit === i + 1 ? 1.5 : 0.5}
              strokeDasharray={i === 3 ? "4,6" : "none"}
              style={{ cursor: "pointer", transition: "stroke 0.3s" }}
              onClick={() => setSelectedOrbit(selectedOrbit === i + 1 ? null : i + 1)}
            />
          ))}

          {/* Orbit labels */}
          {ORBITS.map((orbit, oi) => {
            if (oi === 0) return null;
            const r = orbitRadii[oi];
            return (
              <text
                key={oi}
                x={cx}
                y={cy - r - 6}
                textAnchor="middle"
                fill={selectedOrbit === oi ? "rgba(255,255,255,0.5)" : "rgba(255,255,255,0.15)"}
                fontSize={9}
                fontFamily="'IBM Plex Mono', monospace"
                letterSpacing="0.15em"
                style={{ cursor: "pointer", transition: "fill 0.3s", textTransform: "uppercase" }}
                onClick={() => setSelectedOrbit(selectedOrbit === oi ? null : oi)}
              >
                {orbit.name}
              </text>
            );
          })}

          {/* Core label */}
          <text
            x={cx}
            y={cy - orbitRadii[1] + 14}
            textAnchor="middle"
            fill={selectedOrbit === 0 ? "rgba(255,255,255,0.5)" : "rgba(255,255,255,0.15)"}
            fontSize={9}
            fontFamily="'IBM Plex Mono', monospace"
            letterSpacing="0.15em"
            style={{ cursor: "pointer", textTransform: "uppercase" }}
            onClick={() => setSelectedOrbit(selectedOrbit === 0 ? null : 0)}
          >
            Genesis Core
          </text>

          {/* Element nodes */}
          {positions.map((pos, i) => (
            <ElementNode
              key={pos.el.sym}
              el={pos.el}
              x={pos.x}
              y={pos.y}
              size={pos.size}
              onHover={setHovered}
              onLeave={() => setHovered(null)}
              isActive={activeFamily === pos.el.family}
              isHovered={hovered?.sym === pos.el.sym}
              dimmed={isDimmed(pos.el, pos.orbit)}
            />
          ))}
        </svg>

        {/* Hover tooltip */}
        {hovered && (
          <div
            style={{
              position: "absolute",
              bottom: 16,
              left: "50%",
              transform: "translateX(-50%)",
              background: "rgba(10,10,30,0.95)",
              border: `1px solid ${FAMILIES[hovered.family].color}40`,
              borderRadius: 8,
              padding: "12px 20px",
              maxWidth: 400,
              textAlign: "center",
              backdropFilter: "blur(12px)",
              zIndex: 20,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginBottom: 6 }}>
              <span
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: 28,
                  fontWeight: 700,
                  color: FAMILIES[hovered.family].color,
                }}
              >
                {hovered.sym}
              </span>
              <div>
                <div style={{ color: "rgba(255,255,255,0.9)", fontSize: 14, fontWeight: 500 }}>{hovered.name}</div>
                <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 10 }}>Z = {hovered.z} · {FAMILIES[hovered.family].label}</div>
              </div>
            </div>
            <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 10, marginBottom: 4, fontStyle: "italic" }}>{hovered.trait}</div>
            <div style={{ color: "rgba(255,255,255,0.65)", fontSize: 11, lineHeight: 1.5 }}>{hovered.hook}</div>
          </div>
        )}
      </div>

      {/* Family legend */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "6px 14px",
          padding: "10px 20px 16px",
          zIndex: 10,
        }}
      >
        {Object.entries(FAMILIES).map(([key, fam]) => (
          <button
            key={key}
            onClick={() => setActiveFamily(activeFamily === key ? null : key)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 5,
              background: activeFamily === key ? `${fam.color}15` : "transparent",
              border: activeFamily === key ? `1px solid ${fam.color}40` : "1px solid transparent",
              borderRadius: 4,
              padding: "3px 8px",
              cursor: "pointer",
              transition: "all 0.2s",
            }}
          >
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: fam.color,
                boxShadow: activeFamily === key ? `0 0 8px ${fam.glow}` : "none",
                flexShrink: 0,
              }}
            />
            <span
              style={{
                fontSize: 9,
                color: activeFamily === key ? fam.color : "rgba(255,255,255,0.4)",
                letterSpacing: "0.05em",
                whiteSpace: "nowrap",
              }}
            >
              {fam.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
