# Couple Calendar · Bold B — 다크 테마 풀앱 리디자인

> 출처: claude.ai/design 프로젝트 `couple-calenar` (id `bb2f65e0-…`)
> 파일: `Couple Calendar Bold B - Full App.html` + `bold/*.jsx` + `colors_and_type.css`
> 원본 JSX는 React UMD + 인라인 스타일. 우리 앱은 Next.js Clean Architecture라 **시각 디자인만 이식**하고 데이터 흐름(use case / TanStack Query / Server Actions)은 그대로 유지한다.

## 콘셉트
- **다크 테마, 앱 전체 적용.** 둥근 셀 + 커맨드 바.
- 라운드 폰트: **Baloo 2**(라틴) + **Jua**(한글), 숫자/요일 그로테스크는 **Archivo**.

## 다크 토큰 (.bappdark 오버라이드 — 이 값이 최종 적용값)
```
--bg-page:    #0d0d0e   (페이지 배경)
--bg-section: #161618   (섹션/푸터 배경)
--bg-card:    #1a1a1c   (카드/셀/인풋 배경)
--cream-200:  #161618   (설정 페이지 배경 등 "cream-200" 참조처)
--cream-100:  #0d0d0e
--cream-300:  #202023

--text-primary:   #f4f4f3
--text-secondary: #9a9a98
--text-tertiary:  #6f6f6c
--text-brand:     #f4f4f3   (제목)
--ink-900:        #202023   (다크 카드/Connect primary 카드 배경)

--action-primary:       #F26419  (오렌지 CTA/FAB/active)
--action-primary-hover: #d8530f
--error-red:            #B02818  (위험/연결끊기)

--border-default: rgba(255,255,255,0.12)
선/구분선: rgba(255,255,255,0.06~0.14)

--shadow-card:     0 0 0 0.5px rgba(255,255,255,0.06), 0 6px 16px rgba(0,0,0,0.45)
--shadow-floating: 0 10px 28px rgba(0,0,0,0.55), 0 2px 8px rgba(0,0,0,0.4)
--shadow-modal:    0 -8px 40px rgba(0,0,0,0.6)
font: "Baloo 2","Jua","Pretendard Variable",Pretendard,system-ui
```

## 컴포넌트 클래스(다크 재스킨)
```
.wb-card        bg #1a1a1c; border 1px rgba(255,255,255,0.08); shadow none
.wb-input       bg #1a1a1c; color #f4f4f3; border 1px rgba(255,255,255,0.14)
.wb-input:focus border #F26419; box-shadow 0 0 0 3px rgba(242,100,25,0.25)
.wb-btn--primary   bg #F26419; color #fff; radius pill
.wb-btn--secondary bg #1a1a1c; color #f4f4f3; border rgba(255,255,255,0.14)
.wb-pill        bg #1a1a1c; color #f4f4f3; border 1px rgba(255,255,255,0.12)
.wb-pill--active bg #F26419; color #fff
.wb-fab         56px 원형 bg #F26419
input[date|time] color-scheme: dark
```

## 카테고리 색상(다크 튜닝) — 기존 CATEGORY_STYLE 대체
| key | 라벨 | color | bg(tint) |
|-----|------|-------|----------|
| date(데이트) | 데이트 | `#F2719A` | rgba(242,113,154,0.16) |
| personal(개인) | 개인 | `#5FB87C` | rgba(95,184,124,0.16) |
| anniversary(기념일) | 기념일 | `#E8675A` | rgba(232,103,90,0.16) |
| other(기타) | 기타 | `#A6A199` | rgba(166,161,153,0.16) |

> 우리 백엔드 enum: ANNIVERSARY / DATE / INDIVIDUAL / OTHER (presentation/home/lib/calendar.ts CATEGORY_STYLE). personal↔INDIVIDUAL 매핑.

## 화면 → 라우트 매핑
| # | 디자인 화면 | 라우트 / 파일 | 핵심 디자인 |
|---|------------|--------------|------------|
| 01 | LoginScreen | `app/login/page.tsx` | 가운데 두-링 브랜드 마크, "둘만의 캘린더,\n오늘부터." 32px, 흰 Apple 버튼 |
| 02 | OnboardingScreen | `app/onboarding` (profile step) | 2칸 진행바, 닉네임+생일 Field, 오렌지 "다음" |
| 03 | ConnectIntro | onboarding connect 진입 | 카드 2개(새 코드 만들기=ink-900 / 코드 입력=#1a1a1c) |
| 04 | ConnectCode | `onboarding/connect/code-gen` | INVITE CODE 라벨, 44px 코드, 복사 버튼, 안내 박스, "연결 대기 중..." |
| 05 | ConnectEnter | `onboarding/connect/code-input` | 6칸 코드 입력(채워지면 오렌지 테두리), "연결하기" |
| 05b | ConnectedToast | main 진입 시 | 상단 토스트 "민준님과 연결되었어요" |
| 06 | MainScreen | `app/home/page.tsx` | 큰 영문 월 헤더 + 좌우 원형버튼, 둥근 다크 셀 6×7(점+제목 2개+ +N), 선택일 상세 리스트, 하단 커맨드바(홈/탐색/프로필 pill + 오렌지 FAB) |
| 07 | AddEventPage / AddEventSheet | `app/events/add/page.tsx` (+ home sheet) | 제목 큰 인풋, 카테고리 pill, 날짜 버튼, 시간 토글+TimeBox, 장소(핀), 알림 pill, 메모, 작성자 안내, 하단 저장바 |
| 08 | SettingsScreen | `app/settings/page.tsx` | 커플 히어로(AvatarPair + 지수♥민준 + D+412), 설정 행 카드들, 연결끊기=빨강 |
| 09 | ProfileMeScreen | `app/settings/profile/page.tsx` | 96px 아바타+카메라 뱃지, 기본정보 FieldRow(우측정렬), 소개 textarea, 취소 |
| 10 | ProfilePartnerScreen | `app/settings/partner/page.tsx` | 아바타, 별명 FieldRow, 정보 Row들, 빨강 경고 카드(본인만 수정) |
| 11 | NotificationsScreen | `app/settings/notifications/page.tsx` | SectionLabel + ToggleRow들 + 알림시점 pill |
| 12 | DisconnectScreen | settings/disconnect (현재 다이얼로그) | 빨강 아이콘, 사라지는 항목 리스트, "연결 끊기" 타이핑 확인, 빨강 버튼 |

(추가) 기념일 관리 `app/settings/anniversaries` — 디자인엔 별도 없음. 동일 다크 토큰/패턴으로 맞춤.

## 공통 크롬 패턴
- **SettingsHeader**: 좌측 chevron(뒤로) + 타이틀 16px/600, bg `#1a1a1c`, 하단 보더 rgba(255,255,255,0.08). 우측 슬롯(저장 버튼 등).
- **SectionLabel**: 11px/700 대문자, color tertiary, padding 18/20/8.
- **Toggle**: 44×26, on=`#F26419`/off=rgba(255,255,255,0.18), 흰 노브 22px.
- **ToggleRow / Row / FieldRow**: bg `#1a1a1c`, borderTop rgba(255,255,255,0.06).
- **Field(label)**: 12px/600 대문자 라벨 + children.

## 주의 (데이터 유지)
- 디자인의 목 데이터(지수/민준, 샘플 일정, D+412, "412개" 등)는 **플레이스홀더**. 실제 값은 기존 훅/쿼리에서 가져온다.
- AddEvent 저장/카테고리/시간/알림은 기존 `EventForm`·`useCreateEvent` 계약 유지하고 스타일만 교체.
- 6칸 코드 입력은 기존 `CodeInput` 동작 유지.

## 폰트 적용
`@import url('https://fonts.googleapis.com/css2?family=Baloo+2:wght@500;600;700;800&family=Jua&family=Archivo:wght@400;500;600;700;800;900&display=swap')`
- 기본 sans: Baloo 2 + Jua + Pretendard 폴백
- `.bold-grotesk`(요일/날짜 숫자): Archivo
