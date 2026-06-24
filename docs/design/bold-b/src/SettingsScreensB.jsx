// SettingsScreensB.jsx + connect-enter & settings (from CoupleAppB) — REFERENCE. Dark theme.

/* ===================== CONNECT — enter 6-digit code (from CoupleAppB) ===================== */
function ConnectEnterScreen({ go, accent }) {
  const [code, setCode] = React.useState(['', '', '', '', '', '']);
  const refs = React.useRef([]);
  const handle = (i, v) => {
    const ch = v.slice(-1).toUpperCase();
    const next = [...code]; next[i] = ch; setCode(next);
    if (ch && i < 5) refs.current[i + 1]?.focus();
  };
  const filled = code.every((c) => c.length > 0);
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '12px 24px 28px' }}>
      <button onClick={() => go('connectIntro')} style={{ alignSelf: 'flex-start', background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: 8, marginLeft: -8 }}><I.Chevron s={20} dir="left" /></button>
      <div style={{ marginTop: 8 }}>
        <div style={{ fontSize: 22, fontWeight: 600, letterSpacing: 'var(--ls-display)', color: 'var(--text-brand)' }}>상대방의 코드를 입력하세요.</div>
        <div className="wb-body-sm" style={{ color: 'var(--text-secondary)', marginTop: 6 }}>6자리 영문 + 숫자 코드입니다.</div>
      </div>
      <div style={{ marginTop: 36, display: 'flex', gap: 8, justifyContent: 'center' }}>
        {code.map((c, i) =>
          <input key={i} ref={(el) => refs.current[i] = el} value={c} onChange={(e) => handle(i, e.target.value)} maxLength={1}
            style={{ width: 44, height: 58, textAlign: 'center', fontSize: 24, fontWeight: 700, color: 'var(--text-brand)',
              border: c ? `2px solid ${accent}` : '2px solid rgba(255,255,255,0.18)', borderRadius: 'var(--radius-md)', background: '#1a1a1c',
              outline: 'none', boxShadow: c ? `0 0 0 4px ${accent}22` : '0 1px 2px rgba(0,0,0,0.06)', transition: 'all var(--dur-base) var(--ease-standard)' }} />)}
      </div>
      <div style={{ flex: 1 }} />
      <button onClick={() => filled && go('main', { fresh: true })} className="wb-btn wb-btn--primary wb-btn--lg" disabled={!filled} style={{ width: '100%', justifyContent: 'center', opacity: filled ? 1 : 0.5 }}>연결하기</button>
    </div>);
}

/* ===================== SETTINGS main (from CoupleAppB) =====================
   Header: chevron(뒤로 → main) + "설정" 18/600.
   Couple band (bg cream-200=#161618, centered): AvatarPair 56 + "지수 ♥ 민준" + "2025년 3월 9일부터 · D+412".
   Rows (wb-card list): 내 프로필 수정 / 상대방 프로필 / 알림 설정 / 연결 끊기(빨강 #B02818). chevron right. */
function SettingsScreen({ go, accent }) {
  const rows = [
    ['profileMe', '내 프로필 수정', '지수, 1996.08.14'],
    ['profilePartner', '상대방 프로필', '민준, 1995.11.02'],
    ['notifications', '알림 설정', '일정 1일 전 / 기념일 당일'],
    ['disconnect', '연결 끊기', ''],
  ];
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '12px 0 28px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '0 16px 8px' }}>
        <button onClick={() => go('main')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 8, color: 'var(--text-secondary)' }}><I.Chevron s={20} dir="left" /></button>
        <div style={{ fontSize: 18, fontWeight: 600, letterSpacing: 'var(--ls-display)' }}>설정</div>
      </div>
      <div style={{ padding: '16px 20px 24px', textAlign: 'center', background: 'var(--cream-200)' }}>
        <AvatarPair size={56} />
        <div style={{ marginTop: 10, fontSize: 16, fontWeight: 600, color: 'var(--text-brand)' }}>지수 <span style={{ color: accent }}>♥</span> 민준</div>
        <div className="wb-caption" style={{ marginTop: 2 }}>2025년 3월 9일부터 · D+412</div>
      </div>
      <div style={{ padding: '18px 20px 0', display: 'flex', flexDirection: 'column', gap: 6 }}>
        {rows.map(([route, t, d]) =>
          <div key={t} onClick={() => go(route)} className="wb-card" style={{ padding: '14px 16px', display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: route === 'disconnect' ? '#B02818' : 'var(--text-brand)' }}>{t}</div>
              {d && <div className="wb-caption" style={{ marginTop: 2 }}>{d}</div>}
            </div>
            <I.Chevron s={16} />
          </div>)}
      </div>
    </div>);
}

/* ===================== Shared chrome ===================== */
function SettingsHeader({ go, title, right }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 8px 12px 4px', borderBottom: '1px solid rgba(255,255,255,0.08)', background: '#1a1a1c' }}>
      <button onClick={() => go('settings')} aria-label="뒤로" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 10, color: 'var(--text-primary)', display: 'flex' }}><I.Chevron s={20} dir="left" /></button>
      <div style={{ flex: 1, fontSize: 16, fontWeight: 600, letterSpacing: 'var(--ls-display)', color: 'var(--text-brand)' }}>{title}</div>
      {right}
    </div>);
}
function SectionLabel({ children }) { return <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 0.6, textTransform: 'uppercase', color: 'var(--text-tertiary)', padding: '18px 20px 8px' }}>{children}</div>; }
function Row({ label, value, onClick, danger }) {
  return (
    <div onClick={onClick} style={{ background: '#1a1a1c', padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12, cursor: onClick ? 'pointer' : 'default', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
      <div style={{ flex: 1, minWidth: 0 }}><div style={{ fontSize: 14, fontWeight: 600, color: danger ? '#B02818' : 'var(--text-brand)' }}>{label}</div></div>
      {value && <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{value}</div>}
      {onClick && <I.Chevron s={14} />}
    </div>);
}
function Toggle({ on, onChange }) {
  return (
    <button onClick={() => onChange(!on)} aria-pressed={on} style={{ width: 44, height: 26, borderRadius: 13, padding: 2, border: 'none', cursor: 'pointer', background: on ? '#F26419' : 'rgba(255,255,255,0.18)', transition: 'background .15s ease', display: 'flex', alignItems: 'center' }}>
      <div style={{ width: 22, height: 22, borderRadius: '50%', background: '#fff', transform: on ? 'translateX(18px)' : 'translateX(0)', transition: 'transform .15s ease', boxShadow: '0 1px 2px rgba(0,0,0,0.2)' }} />
    </button>);
}
function ToggleRow({ label, hint, on, onChange }) {
  return (
    <div style={{ background: '#1a1a1c', padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-brand)' }}>{label}</div>
        {hint && <div className="wb-caption" style={{ marginTop: 2 }}>{hint}</div>}
      </div>
      <Toggle on={on} onChange={onChange} />
    </div>);
}
// PageRoot/PageScroll bg = cream-200 (#161618). FieldRow: 64px label + right-aligned input.

/* ===================== 1. PROFILE — ME (settings/profile) =====================
   Header right = 저장(오렌지 pill). Avatar 96px gradient(#FBE4EB→#FFD6E0) + camera badge(text-brand circle).
   "탭하여 사진 변경" caption. Section 기본 정보: FieldRow 이름/닉네임(hint)/생일(date).
   Section 소개: textarea on #1a1a1c. Footer: 취소(outline). */

/* ===================== 2. PROFILE — PARTNER (settings/partner) =====================
   Avatar 96 gradient(#DFEEE3→#C7E5D2) 🌿, name 민준 18/700, "1995년 11월 2일생 · 게자리".
   Section 내가 부르는 이름: FieldRow 별명(hint "나에게만 보입니다").
   Section 민준에 대해: Row 메모/기념일/사진. Section 활동: Row 마지막활동/등록 일정.
   Warning Card(rgba(176,40,24,0.04)): Heart icon + "민준의 본인 정보는 본인만 수정 가능". */

/* ===================== 3. NOTIFICATIONS (settings/notifications) =====================
   SectionLabel + ToggleRow groups:
   전체: 푸시 알림(master). 일정: 일정 알림 + 알림 시점 pill(10분/1시간/하루/일주일 전, dimmed when off).
   기념일: 당일 알림 / 마일스톤. 상대방 활동: 일정 추가 / 메모. 방해금지: 조용한 시간(hint 22:00–08:00). */

/* ===================== 5. DISCONNECT =====================
   Centered red broken-link icon(72px circle rgba(176,40,24,0.10)), title "민준과의 연결을 끊으시겠어요?",
   desc. Card listing what's lost (4 rows, red dots). Type-to-confirm input ("연결 끊기").
   Buttons: 연결 끊기(red #B02818, disabled until match) + 취소(outline). */
