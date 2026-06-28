// CoupleData.jsx — shared data, helpers, icons (REFERENCE, do not import)

const CATEGORY_COLORS = {
  date:        { name: '데이트',     color: '#E66B8E', bg: '#FBE4EB' },   // pink
  personal:    { name: '개인',       color: '#3F8F5F', bg: '#DFEEE3' },   // green — author shown via avatar/name
  anniversary: { name: '기념일',     color: '#B02818', bg: '#F7DBD6' },   // red
  other:       { name: '기타',       color: '#8A847A', bg: '#EAE4D8' },   // gray
};

// Sample events — keyed by ISO date "YYYY-MM-DD"
function makeEvents(year, month) {
  // month is 0-indexed
  const k = (d) => `${year}-${String(month+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
  return {
    [k(3)]:  [{ id:'e1', title:'민준 회식', cat:'personal', start:'19:00', end:'22:00', author:'민준', place:'강남' }],
    [k(7)]:  [
      { id:'e2', title:'성수동 카페 데이트', cat:'date', start:'14:00', end:'17:00', author:'지수', place:'성수동' },
      { id:'e3', title:'지수 요가', cat:'personal', start:'09:00', end:'10:30', author:'지수', place:'홍대' },
    ],
    [k(9)]:  [{ id:'e4', title:'사귄지 14개월', cat:'anniversary', start:null, end:null, author:'시스템', place:null, allDay:true }],
    [k(12)]: [{ id:'e5', title:'민준 본가', cat:'personal', start:null, end:null, author:'민준', place:'부산', allDay:true }],
    [k(14)]: [
      { id:'e6', title:'영화 — 추천작', cat:'date', start:'20:00', end:'22:30', author:'민준', place:'CGV 용산' },
    ],
    [k(18)]: [{ id:'e7', title:'점심 약속', cat:'date', start:'12:30', end:'14:00', author:'지수', place:'한남동' }],
    [k(22)]: [
      { id:'e8', title:'지수 회의', cat:'personal', start:'10:00', end:'11:30', author:'지수', place:'사무실' },
      { id:'e9', title:'저녁 같이', cat:'date', start:'19:00', end:'21:00', author:'민준', place:'집' },
    ],
    [k(25)]: [{ id:'e10', title:'엄마 생신', cat:'anniversary', start:null, end:null, author:'시스템', place:null, allDay:true }],
    [k(28)]: [{ id:'e11', title:'주말 여행 (제주)', cat:'date', start:null, end:null, author:'지수', place:'제주', allDay:true }],
    [k(29)]: [{ id:'e12', title:'주말 여행 (제주)', cat:'date', start:null, end:null, author:'지수', place:'제주', allDay:true }],
  };
}

const KOR_DAYS = ['일','월','화','수','목','금','토'];
const KOR_MONTHS = ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'];

function ymd(d){ return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`; }
function daysBetween(a, b){ const ms = 24*3600*1000; return Math.floor((b - a) / ms); }

// Build a 6×7 month grid (leading/trailing days from neighbors)
function monthGrid(year, month) {
  const first = new Date(year, month, 1);
  const start = new Date(first);
  start.setDate(start.getDate() - first.getDay());
  return Array.from({length: 42}, (_, i) => {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    return d;
  });
}

/* ---------- Icons (Lucide-style outlines) ---------- */
const I = {
  Plus: (p={}) => (<svg width={p.s||22} height={p.s||22} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14"/></svg>),
  Chevron: (p={}) => (<svg width={p.s||18} height={p.s||18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{transform: p.dir==='left'?'rotate(180deg)': p.dir==='up'?'rotate(-90deg)': p.dir==='down'?'rotate(90deg)':''}}><path d="M9 6l6 6-6 6"/></svg>),
  Settings: (p={}) => (<svg width={p.s||22} height={p.s||22} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3h.1a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8v.1a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1Z"/></svg>),
  Apple: (p={}) => (<svg width={p.s||20} height={p.s||20} viewBox="0 0 24 24" fill="currentColor"><path d="M17.05 12.04c-.03-2.65 2.16-3.92 2.26-3.99-1.23-1.8-3.15-2.05-3.83-2.08-1.63-.17-3.18.96-4.01.96-.83 0-2.11-.94-3.47-.91-1.79.03-3.43 1.04-4.35 2.64-1.85 3.21-.47 7.96 1.34 10.56.88 1.27 1.93 2.7 3.31 2.65 1.33-.05 1.83-.86 3.43-.86 1.6 0 2.05.86 3.45.83 1.42-.03 2.32-1.3 3.19-2.58 1-1.48 1.41-2.92 1.43-2.99-.03-.01-2.74-1.05-2.77-4.18ZM14.42 4.4c.74-.89 1.23-2.13 1.1-3.36-1.06.04-2.34.7-3.1 1.59-.69.78-1.29 2.04-1.13 3.25 1.18.09 2.39-.6 3.13-1.48Z"/></svg>),
  Heart: (p={}) => (<svg width={p.s||16} height={p.s||16} viewBox="0 0 24 24" fill={p.fill||'currentColor'} stroke="currentColor" strokeWidth="1.8"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78Z"/></svg>),
  Clock: (p={}) => (<svg width={p.s||14} height={p.s||14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>),
  Pin: (p={}) => (<svg width={p.s||14} height={p.s||14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0Z"/><circle cx="12" cy="10" r="3"/></svg>),
  Copy: (p={}) => (<svg width={p.s||16} height={p.s||16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>),
  X: (p={}) => (<svg width={p.s||20} height={p.s||20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg>),
  List: (p={}) => (<svg width={p.s||18} height={p.s||18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/></svg>),
};
