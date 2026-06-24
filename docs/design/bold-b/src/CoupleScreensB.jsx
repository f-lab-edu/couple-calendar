// CoupleScreensB.jsx — login, onboarding, connect intro/code, MAIN calendar, AddEvent (REFERENCE)
// Dark theme. Inline styles read CSS vars overridden by .bappdark (see IMPLEMENTATION.md).

const COUPLE = {
  user1: { name: '지수', emoji: '🌷', tone: '#E66B8E' },
  user2: { name: '민준', emoji: '🌿', tone: '#F26419' },
  startDate: new Date(2025, 2, 9) // 2025-03-09
};

/* ===================== LOGIN ===================== */
function LoginScreen({ onNext }) {
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '60px 28px 36px', background: 'var(--bg-page)' }}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
        {/* Brand mark — two interlocking rings */}
        <div style={{ position: 'relative', width: 96, height: 64, marginBottom: 28 }}>
          <div style={{ position: 'absolute', left: 0, top: 8, width: 56, height: 56, borderRadius: '50%', border: '3px solid var(--ink-800)' }} />
          <div style={{ position: 'absolute', right: 0, top: 0, width: 56, height: 56, borderRadius: '50%', border: '3px solid var(--action-primary)' }} />
        </div>
        <div style={{ fontSize: 32, fontWeight: 600, letterSpacing: 'var(--ls-display)', color: 'var(--text-brand)', lineHeight: 1.15 }}>둘만의 캘린더,<br />오늘부터.</div>
        <div className="wb-body-md" style={{ color: 'var(--text-secondary)', marginTop: 14, maxWidth: 260 }}>하루를 함께 그려가는 가장 조용한 방법.</div>
      </div>
      <button onClick={onNext} className="wb-btn wb-btn--lg" style={{ width: '100%', justifyContent: 'center', gap: 10, padding: '16px', background: '#f4f4f3', color: '#0d0d0e', border: '1px solid #f4f4f3' }}>
        <I.Apple s={18} /> Apple로 계속하기
      </button>
      <div className="wb-caption" style={{ textAlign: 'center', marginTop: 14, color: 'var(--text-tertiary)' }}>계속하면 약관 및 개인정보 처리방침에 동의합니다.</div>
    </div>);
}

/* ===================== ONBOARDING (nickname + birthday) ===================== */
function OnboardingScreen({ onNext, accent }) {
  const [name, setName] = React.useState('지수');
  const [bday, setBday] = React.useState('1996-08-14');
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '24px 24px 28px' }}>
      <div style={{ display: 'flex', gap: 6, marginBottom: 28 }}>
        <div style={{ flex: 1, height: 4, borderRadius: 2, background: accent }} />
        <div style={{ flex: 1, height: 4, borderRadius: 2, background: 'var(--black-12)' }} />
      </div>
      <div style={{ fontSize: 26, fontWeight: 600, letterSpacing: 'var(--ls-display)', color: 'var(--text-brand)', lineHeight: 1.2 }}>프로필을 알려주세요.</div>
      <div className="wb-body-sm" style={{ color: 'var(--text-secondary)', marginTop: 8 }}>상대방에게 보여줄 정보예요.</div>
      <div style={{ marginTop: 32 }}>
        <Field label="닉네임"><input className="wb-input" value={name} onChange={(e) => setName(e.target.value)} /></Field>
        <div style={{ height: 18 }} />
        <Field label="생일"><input className="wb-input" type="date" value={bday} onChange={(e) => setBday(e.target.value)} /></Field>
      </div>
      <div style={{ flex: 1 }} />
      <button onClick={onNext} className="wb-btn wb-btn--primary wb-btn--lg" style={{ width: '100%', justifyContent: 'center' }}>다음</button>
    </div>);
}

function Field({ label, children, style }) {
  return (
    <div style={style}>
      <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: 0.6, textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: 8 }}>{label}</div>
      {children}
    </div>);
}

/* ===================== CONNECT — intro / generate code ===================== */
function ConnectIntroScreen({ go, accent }) {
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '24px 24px 28px' }}>
      <div style={{ display: 'flex', gap: 6, marginBottom: 28 }}>
        <div style={{ flex: 1, height: 4, borderRadius: 2, background: 'var(--black-12)' }} />
        <div style={{ flex: 1, height: 4, borderRadius: 2, background: accent }} />
      </div>
      <div style={{ fontSize: 26, fontWeight: 600, letterSpacing: 'var(--ls-display)', color: 'var(--text-brand)', lineHeight: 1.2 }}>둘을 이어볼까요?</div>
      <div className="wb-body-sm" style={{ color: 'var(--text-secondary)', marginTop: 8 }}>한 명이 코드를 만들고, 다른 한 명이 입력하면 끝이에요.</div>
      <div style={{ marginTop: 28, display: 'flex', flexDirection: 'column', gap: 12 }}>
        <ConnectCard title="새 코드 만들기" desc="6자리 코드를 만들어 상대방에게 알려주세요." tone="primary" onClick={() => go('connectCode')} accent={accent} />
        <ConnectCard title="코드 입력하기" desc="상대방이 만든 코드를 입력해 연결합니다." tone="secondary" onClick={() => go('connectEnter')} accent={accent} />
      </div>
      <div style={{ flex: 1 }} />
      <div className="wb-caption" style={{ textAlign: 'center', color: 'var(--text-tertiary)' }}>나중에 설정에서 연결해도 괜찮아요.</div>
    </div>);
}

function ConnectCard({ title, desc, tone, onClick }) {
  const isPrimary = tone === 'primary';
  return (
    <button onClick={onClick} style={{
      textAlign: 'left', cursor: 'pointer',
      background: isPrimary ? 'var(--ink-900)' : '#1a1a1c',
      color: isPrimary ? '#fff' : 'var(--text-primary)',
      border: isPrimary ? '1px solid var(--ink-900)' : '1px solid var(--border-default)',
      borderRadius: 'var(--radius-lg)', padding: '20px 22px', fontFamily: 'inherit'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontSize: 17, fontWeight: 600, letterSpacing: 'var(--ls-display)' }}>{title}</div>
        <I.Chevron s={18} />
      </div>
      <div style={{ marginTop: 6, fontSize: 13, color: isPrimary ? 'rgba(255,255,255,0.7)' : 'var(--text-secondary)', lineHeight: 1.5 }}>{desc}</div>
    </button>);
}

function ConnectCodeScreen({ go, accent }) {
  const code = 'L9 K2 7Q';
  const [copied, setCopied] = React.useState(false);
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '12px 24px 28px' }}>
      <button onClick={() => go('connectIntro')} style={{ alignSelf: 'flex-start', background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: 8, marginLeft: -8 }}><I.Chevron s={20} dir="left" /></button>
      <div style={{ marginTop: 8 }}>
        <div style={{ fontSize: 22, fontWeight: 600, letterSpacing: 'var(--ls-display)', color: 'var(--text-brand)' }}>상대방에게 이 코드를 알려주세요.</div>
        <div className="wb-body-sm" style={{ color: 'var(--text-secondary)', marginTop: 6 }}>24시간 동안 유효해요.</div>
      </div>
      <div style={{ marginTop: 36, background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', padding: '32px 24px', boxShadow: 'var(--shadow-card)', textAlign: 'center' }}>
        <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: 1.2, textTransform: 'uppercase', color: accent }}>INVITE CODE</div>
        <div style={{ marginTop: 14, fontFamily: 'var(--font-sans)', fontSize: 44, fontWeight: 700, letterSpacing: 6, color: 'var(--text-brand)' }}>{code}</div>
        <button onClick={() => {setCopied(true);setTimeout(() => setCopied(false), 1500);}} className="wb-btn wb-btn--secondary wb-btn--sm" style={{ marginTop: 18, gap: 6 }}><I.Copy s={14} /> {copied ? '복사됨' : '코드 복사'}</button>
      </div>
      <div style={{ marginTop: 16, padding: 14, background: 'var(--cream-200)', borderRadius: 'var(--radius-md)' }}>
        <div className="wb-caption" style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>• 상대방이 코드를 입력하면 자동으로 연결됩니다.<br />• 코드는 다른 사람에게 노출되지 않게 주의해주세요.</div>
      </div>
      <div style={{ flex: 1 }} />
      <button onClick={() => go('main', { fresh: true })} className="wb-btn wb-btn--primary wb-btn--lg" style={{ width: '100%', justifyContent: 'center' }}>연결 대기 중...</button>
    </div>);
}

/* ===================== MAIN — calendar =====================
   Header: round prev/next buttons (38px #1a1a1c) + big English month (40px bold-round).
   Body: MonthView (rounded dark cells) + selected-day detail list.
   Footer: command bar (pill: 홈/탐색/프로필) + orange FAB 54px.
   Bottom nav island + status bar + dynamic island live in CoupleAppB frame. */
function MainScreen({ go, accent, eventStyle, catColors, fresh }) {
  const today = React.useMemo(() => new Date(2026, 3, 25), []);
  const [cur, setCur] = React.useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [selected, setSelected] = React.useState(new Date(today));
  const [events, setEvents] = React.useState(() => makeEvents(today.getFullYear(), today.getMonth()));
  const [sheet, setSheet] = React.useState(null);
  const [filter] = React.useState('all');
  const EN_MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];

  const changeMonth = (dir) => {
    const next = new Date(cur); next.setMonth(next.getMonth() + (dir === 'next' ? 1 : -1));
    setCur(next); setEvents(makeEvents(next.getFullYear(), next.getMonth()));
  };
  const dayEvents = events[ymd(selected)] || [];
  const monthIconBtn = { width: 38, height: 38, borderRadius: '50%', background: '#1a1a1c', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
      {/* Big month header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 20px 4px' }}>
        <button onClick={() => changeMonth('prev')} style={monthIconBtn}><I.Chevron s={20} dir="left" /></button>
        <div onClick={() => go('settings')} className="bold-round" style={{ fontSize: 40, fontWeight: 700, letterSpacing: '-0.01em', color: 'var(--text-primary)', cursor: 'pointer' }}>{EN_MONTHS[cur.getMonth()]}</div>
        <button onClick={() => changeMonth('next')} style={monthIconBtn}><I.Chevron s={20} /></button>
      </div>
      {/* Calendar body */}
      <div className="dark-scroll" style={{ flex: 1, overflow: 'auto', padding: '6px 12px 8px' }}>
        <MonthView cur={cur} today={today} selected={selected} onSelect={setSelected} events={events} catColors={catColors} filter={filter} />
        {/* Selected-day detail list */}
        <div style={{ marginTop: 22, padding: '0 4px 96px' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 6 }}>
            <div style={{ fontSize: 17, fontWeight: 700, color: 'var(--text-primary)' }}>{selected.getDate()}일 <span style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>{KOR_DAYS[selected.getDay()]}요일</span></div>
            <div className="bold-grotesk" style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', color: 'var(--text-tertiary)' }}>{dayEvents.length} EVENTS</div>
          </div>
          {dayEvents.length === 0 ?
            <div style={{ padding: '20px 0', color: 'var(--text-tertiary)', fontSize: 13 }}>일정이 없어요. + 버튼으로 추가하세요.</div> :
            <div>{dayEvents.map((ev) => {
              const c = catColors[ev.cat] || catColors.other;
              const sub = (ev.allDay ? '종일' : `${ev.start}–${ev.end}`) + ' · ' + c.name;
              return (
                <div key={ev.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 2px', borderTop: '1px solid rgba(255,255,255,0.07)' }}>
                  <span style={{ width: 9, height: 9, borderRadius: '50%', background: c.color, flexShrink: 0 }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{ev.title}</div>
                    <div className="bold-grotesk" style={{ fontSize: 11.5, fontWeight: 500, color: 'var(--text-tertiary)', marginTop: 2 }}>{sub}</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
                    <span style={{ width: 26, height: 26, borderRadius: 8, border: '1.5px solid rgba(255,255,255,0.18)' }} />
                    <span style={{ width: 1, height: 18, background: 'rgba(255,255,255,0.12)' }} />
                    <I.Chevron s={16} dir="right" />
                  </div>
                </div>);
            })}</div>}
        </div>
      </div>
      {/* Global navigation / command bar */}
      <div style={{ padding: '8px 16px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, padding: 6, borderRadius: 999, background: '#1a1a1c', border: '1px solid rgba(255,255,255,0.08)' }}>
          <button style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '9px 16px', borderRadius: 999, border: 'none', cursor: 'pointer', background: '#f4f4f3', color: '#0d0d0e' }}>
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.5V21h14V9.5"/></svg>
            <span style={{ fontSize: 13.5, fontWeight: 700 }}>홈</span>
          </button>
          <button aria-label="탐색" style={{ width: 40, height: 40, borderRadius: '50%', border: 'none', cursor: 'pointer', background: 'transparent', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/></svg>
          </button>
          <button onClick={() => go('settings')} aria-label="프로필" style={{ width: 40, height: 40, borderRadius: '50%', border: 'none', cursor: 'pointer', background: 'transparent', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></svg>
          </button>
        </div>
        <button onClick={() => setSheet('add')} aria-label="추가" style={{ width: 54, height: 54, borderRadius: '50%', background: '#F26419', color: '#fff', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 8px 22px rgba(242,100,25,0.4)' }}><I.Plus s={24} /></button>
      </div>
      {sheet === 'add' && <AddEventSheet date={selected} onClose={() => setSheet(null)} onSave={() => setSheet(null)} catColors={catColors} accent={accent} />}
      {fresh && <ConnectedToast />}
    </div>);
}

function ConnectedToast() {
  const [show, setShow] = React.useState(true);
  React.useEffect(() => {const id = setTimeout(() => setShow(false), 2400);return () => clearTimeout(id);}, []);
  if (!show) return null;
  return (
    <div className="wb-toast" style={{ position: 'absolute', left: 16, right: 16, top: 100, animation: 'slideIn var(--dur-slow) var(--ease-standard)', zIndex: 50 }}>
      <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--success-tint)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--ink-800)', fontWeight: 700 }}>♥</div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 14, fontWeight: 600 }}>민준님과 연결되었어요</div>
        <div className="wb-caption">함께 캘린더를 채워가세요.</div>
      </div>
    </div>);
}

function AvatarPair({ size = 40 }) {
  const overlap = Math.round(size * 0.36);
  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <Avatar tone="#FBE4EB" emoji="🌷" size={size} />
      <div style={{ marginLeft: -overlap }}><Avatar tone="#DFEEE3" emoji="🌿" size={size} ring /></div>
    </div>);
}
function Avatar({ tone, emoji, size = 40, ring = false }) {
  return (<div style={{ width: size, height: size, borderRadius: '50%', background: tone, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: size * 0.5, border: ring ? '2px solid var(--bg-page)' : 'none', boxShadow: '0 0 0 0.5px rgba(0,0,0,0.08)' }}>{emoji}</div>);
}

/* ---------- Month View — Bold B rounded dark cells ---------- */
function MonthView({ cur, today, selected, onSelect, events, catColors, filter = 'all' }) {
  const days = monthGrid(cur.getFullYear(), cur.getMonth());
  const EN = ['SUN','MON','TUE','WED','THU','FRI','SAT'];
  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 6, padding: '2px 2px 8px' }}>
        {EN.map((d, i) => <div key={d} className="bold-grotesk" style={{ textAlign: 'center', fontSize: 9.5, fontWeight: 700, letterSpacing: '0.08em', color: i === 0 ? '#F26419' : 'var(--text-tertiary)' }}>{d}</div>)}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gridAutoRows: '1fr', gap: 6 }}>
        {days.map((d, i) => {
          const inMonth = d.getMonth() === cur.getMonth();
          const isToday = ymd(d) === ymd(today);
          const isSelected = ymd(d) === ymd(selected);
          const evs = (events[ymd(d)] || []).filter(ev => filter === 'all' || ev.cat === filter);
          return (
            <button key={i} onClick={() => onSelect(new Date(d))} className="dark-cell" style={{
              minHeight: 66, borderRadius: 14,
              border: isSelected ? '2px solid #f4f4f3' : '2px solid transparent',
              background: inMonth ? '#1a1a1c' : 'transparent',
              cursor: 'pointer', padding: '7px 7px 6px',
              display: 'flex', flexDirection: 'column', alignItems: 'stretch', gap: 3, textAlign: 'left', overflow: 'hidden'
            }}>
              <div className="bold-grotesk" style={{ fontSize: 14, fontWeight: 700, color: !inMonth ? 'var(--text-tertiary)' : isToday ? '#F26419' : 'var(--text-primary)' }}>{d.getDate()}</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 0 }}>
                {evs.slice(0, 2).map((ev, j) => {
                  const c = catColors[ev.cat] || catColors.other;
                  return (
                    <div key={j} style={{ display: 'flex', alignItems: 'center', gap: 3, minWidth: 0, opacity: inMonth ? 1 : 0.4 }}>
                      <span style={{ width: 5, height: 5, borderRadius: 1.5, background: c.color, flexShrink: 0 }} />
                      <span className="bold-grotesk" style={{ fontSize: 8.5, fontWeight: 600, color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{ev.title}</span>
                    </div>);
                })}
                {evs.length > 2 && <span className="bold-grotesk" style={{ fontSize: 8, fontWeight: 700, color: 'var(--text-tertiary)' }}>+{evs.length - 2}</span>}
              </div>
            </button>);
        })}
      </div>
    </div>);
}

/* ---------- EventRow (list/detail card; default variant = dark #1a1a1c) ---------- */
// See original for variants; default: bg #1a1a1c, 5px color rail, 44px icon disc (cat.bg/cat.color),
// uppercase category label, title 16/700, meta clock+pin. anniversary/date use Heart icon, else Clock.

/* ===================== ADD EVENT — FULL PAGE (events/add) =====================
   Header: X close | "새 일정" | 저장(오렌지 pill when canSave).
   Body(scroll): title big input (26/700, bottom border), 카테고리 pill, 날짜 버튼,
     시간 toggle + TimeBox(시작/종료), 장소(핀 prefix), 알림 pill row, 메모 textarea,
     작성자 안내 카드(cat.bg). Footer bar(#161618): "일정 저장" full button.
   AddEventSheet = bottom-sheet variant of the same form (no reminder row). */
