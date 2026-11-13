import type { Art, Pattern } from "@/lib/products";

/**
 * Takıları veriden çizen SVG illüstrasyon. Gerçek fotoğraf olmadığında kullanılır.
 * view: 0 = ön görünüm, 1 = yakın detay, 2 = örgü dokusu
 */

// Trigonometri sonuçları JS motorları arasında son basamakta farklılık gösterebilir
// (Node ile tarayıcı). Yuvarlamak sunucu/istemci SVG çıktısını birebir aynı tutar.
const fix = (n: number) => Math.round(n * 1e4) / 1e4;
const sin = (n: number) => fix(Math.sin(n));
const cos = (n: number) => fix(Math.cos(n));
const atan2 = (y: number, x: number) => fix(Math.atan2(y, x));

export function shade(hex: string, amount: number) {
  const n = parseInt(hex.slice(1), 16);
  const mix = (c: number) => Math.round(amount < 0 ? c * (1 + amount) : c + (255 - c) * amount);
  const r = mix((n >> 16) & 255);
  const g = mix((n >> 8) & 255);
  const b = mix(n & 255);
  return `#${((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1)}`;
}

type KnotProps = {
  pattern: Pattern;
  x: number;
  y: number;
  angle: number;
  len: number;
  width: number;
  index: number;
  cord: string;
  accent: string;
};

function Knot({ pattern, x, y, angle, len, width, index, cord, accent }: KnotProps) {
  const dark = shade(cord, -0.28);
  const light = shade(cord, 0.35);
  let body: React.ReactNode;

  if (pattern === "square") {
    const side = index % 2 === 0 ? -1 : 1;
    body = (
      <>
        <rect x={-len / 2} y={-width * 0.13} width={len} height={width * 0.26} rx={width * 0.1} fill={shade(accent, -0.08)} />
        <rect x={-len * 0.36} y={-width / 2} width={len * 0.72} height={width} rx={len * 0.3} fill={cord} stroke={dark} strokeWidth={1} />
        <ellipse cx={0} cy={-side * width * 0.3} rx={len * 0.42} ry={width * 0.17} fill={cord} stroke={dark} strokeWidth={1} />
        <ellipse cx={0} cy={side * width * 0.32} rx={len * 0.56} ry={width * 0.21} fill={cord} stroke={dark} strokeWidth={1} />
        <ellipse cx={-len * 0.08} cy={side * width * 0.36} rx={len * 0.24} ry={width * 0.07} fill={light} opacity={0.7} />
        <line x1={-len * 0.1} y1={-width * 0.42} x2={-len * 0.1} y2={width * 0.42} stroke={light} strokeWidth={1.4} opacity={0.6} strokeLinecap="round" />
      </>
    );
  } else if (pattern === "spiral") {
    body = (
      <>
        <ellipse cx={0} cy={0} rx={len * 0.62} ry={width * 0.5} transform="rotate(32)" fill={cord} stroke={dark} strokeWidth={1.2} />
        <ellipse cx={-len * 0.1} cy={-width * 0.08} rx={len * 0.34} ry={width * 0.14} transform="rotate(32)" fill={light} opacity={0.65} />
        <path d={`M ${-len * 0.55} ${width * 0.45} Q 0 ${width * 0.1} ${len * 0.55} ${-width * 0.45}`} fill="none" stroke={dark} strokeWidth={1.2} opacity={0.5} />
      </>
    );
  } else {
    const color = index % 3 === 2 ? accent : cord;
    body = (
      <>
        <path
          d={`M ${-len * 0.45} ${-width * 0.42} L ${len * 0.3} 0 L ${-len * 0.45} ${width * 0.42}`}
          fill="none"
          stroke={shade(color, -0.25)}
          strokeWidth={len * 0.62}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d={`M ${-len * 0.45} ${-width * 0.42} L ${len * 0.3} 0 L ${-len * 0.45} ${width * 0.42}`}
          fill="none"
          stroke={color}
          strokeWidth={len * 0.48}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d={`M ${-len * 0.5} ${-width * 0.38} L ${len * 0.15} -2`}
          fill="none"
          stroke={shade(color, 0.4)}
          strokeWidth={1.6}
          strokeLinecap="round"
          opacity={0.7}
        />
      </>
    );
  }

  return <g transform={`translate(${x} ${y}) rotate(${angle})`}>{body}</g>;
}

function Bead({ x, y, r, color, id }: { x: number; y: number; r: number; color: string; id: string }) {
  return (
    <g>
      <circle cx={x} cy={y + r * 0.15} r={r} fill="#000" opacity={0.12} />
      <circle cx={x} cy={y} r={r} fill={`url(#${id}-bead)`} />
      <ellipse cx={x - r * 0.35} cy={y - r * 0.4} rx={r * 0.32} ry={r * 0.2} fill="#fff" opacity={0.75} transform={`rotate(-30 ${x - r * 0.35} ${y - r * 0.4})`} />
      <circle cx={x} cy={y} r={r} fill="none" stroke={shade(color, -0.35)} strokeWidth={0.8} opacity={0.6} />
    </g>
  );
}

function Shell({ x, y, s, color, angle = 0 }: { x: number; y: number; s: number; color: string; angle?: number }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${angle}) scale(${s})`}>
      <ellipse cx={0} cy={2} rx={11} ry={15} fill="#000" opacity={0.12} />
      <ellipse cx={0} cy={0} rx={11} ry={15} fill={color} stroke={shade(color, -0.3)} strokeWidth={1} />
      <path d="M 0 -11 Q -3 0 0 11" fill="none" stroke={shade(color, -0.45)} strokeWidth={2} strokeLinecap="round" />
      {[-7, -3, 1, 5].map((t) => (
        <line key={t} x1={-2.5} y1={t} x2={-5.5} y2={t + 1} stroke={shade(color, -0.35)} strokeWidth={1} />
      ))}
      <ellipse cx={4} cy={-6} rx={3} ry={5} fill="#fff" opacity={0.5} />
    </g>
  );
}

/** Elips üzerinde düğümler: bileklik ve halhal */
function Ring({ art, id, rx, ry, count, len, width, beadEvery }: { art: Art; id: string; rx: number; ry: number; count: number; len: number; width: number; beadEvery?: number }) {
  const cx = 200;
  const cy = 240;
  const items = Array.from({ length: count }, (_, i) => {
    const t = (i / count) * Math.PI * 2;
    const depth = sin(t); // 1 = önde, -1 = arkada
    const x = cx + rx * cos(t);
    const y = cy + ry * sin(t);
    const angle = (atan2(ry * cos(t), -rx * sin(t)) * 180) / Math.PI;
    const scale = 0.78 + 0.22 * (depth + 1) / 2;
    const isFrontBead = !beadEvery && Math.abs(t - Math.PI / 2) < 0.32;
    const isBead = beadEvery ? i % beadEvery === 0 : isFrontBead;
    return { i, t, depth, x, y, angle, scale, isBead };
  }).sort((a, b) => a.depth - b.depth);

  const tailT = Math.PI * 0.18;
  const tx = cx + rx * cos(tailT);
  const ty = cy + ry * sin(tailT);

  return (
    <g>
      {/* Düğümlerin altından geçen sürekli çekirdek ip */}
      <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill="none" stroke={shade(art.cord, -0.3)} strokeWidth={width * 0.42} />
      <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill="none" stroke={shade(art.cord, -0.1)} strokeWidth={width * 0.3} />
      {items.map(({ i, x, y, angle, scale, depth, isBead }) => {
        const tint = depth < 0 ? shade(art.cord, -0.18 * -depth) : art.cord;
        if (isBead) {
          return art.kind === "anklet" && art.bead === "#f3ece0" ? (
            <Shell key={i} x={x} y={y + 4} s={0.95 * scale} color={art.bead} angle={angle} />
          ) : (
            <Bead key={i} x={x} y={y} r={(art.kind === "anklet" ? 7 : 13) * scale} color={art.bead} id={id} />
          );
        }
        return (
          <Knot
            key={i}
            pattern={art.pattern}
            x={x}
            y={y}
            angle={angle}
            len={len * scale}
            width={width * scale}
            index={i}
            cord={tint}
            accent={art.accent}
          />
        );
      })}
      {/* Kayar düğüm uçları */}
      {[-8, 8].map((dx, k) => (
        <g key={dx}>
          <path
            d={`M ${tx + dx * 0.4} ${ty + 8} C ${tx + dx} ${ty + 40}, ${tx + dx * 2.2} ${ty + 70}, ${tx + dx * 1.6 + 6} ${ty + 96 + k * 14}`}
            fill="none"
            stroke={shade(art.cord, -0.1)}
            strokeWidth={4}
            strokeLinecap="round"
          />
          <Bead x={tx + dx * 1.6 + 6} y={ty + 104 + k * 14} r={7} color={art.bead} id={id} />
        </g>
      ))}
    </g>
  );
}

function Fringe({ x, y, width, length, art, seed }: { x: number; y: number; width: number; length: number; art: Art; seed: number }) {
  const strands = 13;
  return (
    <g>
      {Array.from({ length: strands }, (_, i) => {
        const f = i / (strands - 1) - 0.5;
        const wobble = sin(i * 2.3 + seed) * 6;
        const l = length * (0.82 + 0.18 * cos(f * Math.PI)) + sin(i * 1.7 + seed) * 6;
        const sx = x + f * width;
        const color = i % 4 === 1 ? art.accent : art.cord;
        return (
          <path
            key={i}
            d={`M ${sx} ${y} C ${sx + f * 10} ${y + l * 0.4}, ${sx + f * 22 + wobble} ${y + l * 0.7}, ${sx + f * 30 + wobble} ${y + l}`}
            fill="none"
            stroke={i % 2 ? shade(color, -0.08) : color}
            strokeWidth={3.2}
            strokeLinecap="round"
          />
        );
      })}
    </g>
  );
}

/** Dikey düğüm sütunu: kolye ucu ve küpeler */
function Column({ x, y, count, len, width, art }: { x: number; y: number; count: number; len: number; width: number; art: Art }) {
  return (
    <g>
      {Array.from({ length: count }, (_, i) => (
        <Knot key={i} pattern={art.pattern} x={x} y={y + i * len * 0.95} angle={90} len={len} width={width} index={i} cord={art.cord} accent={art.accent} />
      ))}
    </g>
  );
}

function Necklace({ art, id }: { art: Art; id: string }) {
  const cordPath = "M 40 -10 C 60 150, 140 225, 200 232 C 260 225, 340 150, 360 -10";
  return (
    <g>
      <path d={cordPath} fill="none" stroke={shade(art.cord, -0.3)} strokeWidth={8} strokeLinecap="round" />
      <path d={cordPath} fill="none" stroke={art.cord} strokeWidth={6} strokeLinecap="round" />
      <path d={cordPath} fill="none" stroke={shade(art.cord, 0.4)} strokeWidth={2} strokeDasharray="3 6" strokeLinecap="round" />
      <Column x={200} y={244} count={3} len={20} width={44} art={art} />
      {/* Taşı saran kafes */}
      <ellipse cx={200} cy={338} rx={46} ry={56} fill="none" stroke={shade(art.cord, -0.3)} strokeWidth={10} />
      <ellipse cx={200} cy={338} rx={46} ry={56} fill="none" stroke={art.cord} strokeWidth={7} />
      <ellipse cx={200} cy={338} rx={46} ry={56} fill="none" stroke={shade(art.cord, 0.4)} strokeWidth={2} strokeDasharray="4 7" />
      <ellipse cx={200} cy={340} rx={34} ry={44} fill={`url(#${id}-stone)`} />
      <ellipse cx={188} cy={322} rx={10} ry={16} fill="#fff" opacity={0.45} transform="rotate(-20 188 322)" />
      <path d="M 154 338 Q 200 360 246 338" fill="none" stroke={art.cord} strokeWidth={4} opacity={0.9} />
      <Column x={200} y={400} count={2} len={18} width={36} art={art} />
      <Fringe x={200} y={430} width={40} length={58} art={art} seed={1} />
    </g>
  );
}

function Earring({ x, art, id, seed }: { x: number; art: Art; id: string; seed: number }) {
  return (
    <g>
      <path d={`M ${x} 108 L ${x} 88 C ${x} 60, ${x + 26} 58, ${x + 26} 80 C ${x + 26} 92, ${x + 14} 98, ${x + 14} 112`} fill="none" stroke="#c9a54a" strokeWidth={3} strokeLinecap="round" />
      <circle cx={x} cy={118} r={9} fill="none" stroke="#c9a54a" strokeWidth={3} />
      <Column x={x} y={140} count={4} len={20} width={40} art={art} />
      <Bead x={x} y={226} r={11} color={art.bead} id={id} />
      <Fringe x={x} y={240} width={34} length={150} art={art} seed={seed} />
    </g>
  );
}

function Piece({ art, id }: { art: Art; id: string }) {
  switch (art.kind) {
    case "bracelet":
      return <Ring art={art} id={id} rx={132} ry={78} count={30} len={24} width={36} />;
    case "anklet":
      return <Ring art={art} id={id} rx={150} ry={64} count={44} len={14} width={16} beadEvery={6} />;
    case "necklace":
      return <Necklace art={art} id={id} />;
    case "earrings":
      return (
        <>
          <Earring x={135} art={art} id={id} seed={0} />
          <Earring x={265} art={art} id={id} seed={2} />
        </>
      );
  }
}

function Texture({ art }: { art: Art }) {
  const rows = 9;
  const cols = 6;
  return (
    <g>
      {Array.from({ length: rows * cols }, (_, k) => {
        const r = Math.floor(k / cols);
        const c = k % cols;
        return (
          <Knot
            key={k}
            pattern={art.pattern}
            x={30 + c * 68 + (r % 2) * 10}
            y={20 + r * 58}
            angle={90}
            len={56}
            width={72}
            index={r + c}
            cord={(r + c) % 5 === 0 ? art.accent : art.cord}
            accent={art.accent}
          />
        );
      })}
    </g>
  );
}

const focus: Record<Art["kind"], [number, number]> = {
  bracelet: [200, 300],
  anklet: [200, 300],
  necklace: [200, 340],
  earrings: [135, 200],
};

export function ProductArt({ art, id, view = 0, className }: { art: Art; id: string; view?: number; className?: string }) {
  const uid = `a-${id}`;
  const [fx, fy] = focus[art.kind];
  const zoom = view === 1 ? `translate(${200 - fx * 1.9} ${250 - fy * 1.9}) scale(1.9)` : undefined;

  return (
    <svg viewBox="0 0 400 500" className={className} role="img" aria-hidden="true" preserveAspectRatio="xMidYMid slice">
      <defs>
        <radialGradient id={`${uid}-bg`} cx="35%" cy="25%" r="90%">
          <stop offset="0%" stopColor={art.bg[0]} />
          <stop offset="100%" stopColor={art.bg[1]} />
        </radialGradient>
        <radialGradient id={`${uid}-bead`} cx="35%" cy="30%" r="75%">
          <stop offset="0%" stopColor={shade(art.bead, 0.55)} />
          <stop offset="55%" stopColor={art.bead} />
          <stop offset="100%" stopColor={shade(art.bead, -0.4)} />
        </radialGradient>
        <radialGradient id={`${uid}-stone`} cx="40%" cy="35%" r="70%">
          <stop offset="0%" stopColor={shade(art.bead, 0.6)} />
          <stop offset="45%" stopColor={art.bead} />
          <stop offset="100%" stopColor={shade(art.bead, -0.45)} />
        </radialGradient>
      </defs>

      <rect width="400" height="500" fill={`url(#${uid}-bg)`} />
      <path
        d="M 60 120 C 20 220, 80 380, 200 420 C 320 460, 400 330, 360 210 C 330 110, 240 60, 160 70 C 110 76, 80 90, 60 120 Z"
        fill="#fff"
        opacity={0.22}
      />
      <circle cx="330" cy="80" r="40" fill={art.bg[1]} opacity={0.5} />
      <circle cx="70" cy="440" r="26" fill={art.bg[0]} opacity={0.7} />

      {view === 2 ? (
        <Texture art={art} />
      ) : (
        <g transform={zoom}>
          <ellipse cx="200" cy={art.kind === "earrings" ? 440 : 470} rx="140" ry="12" fill="#000" opacity={0.08} />
          <Piece art={art} id={uid} />
        </g>
      )}
    </svg>
  );
}
