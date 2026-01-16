# PRD - Map Feature (지도 피쳐)

## 1. Feature Overview (기능 개요)
**Feature Name:** Map with Bottom Sheet WebView
**Description:** 네이티브 지도 위에 바텀시트를 띄우고, 바텀시트 내부에 웹뷰를 표시하는 복합 UI 구조. 사용자가 바텀시트를 스크롤할 때 자연스러운 스크롤 경험을 제공합니다.

## 2. Goals (목표)
- 네이티브 지도의 부드러운 인터랙션 유지
- 바텀시트와 내부 웹뷰 간의 자연스러운 스크롤 전환
- 제스처 충돌 없이 직관적인 UX 제공

## 3. UI Structure (UI 구조)

```
┌─────────────────────────────┐
│                             │
│      Native Map             │
│      (react-native-maps)    │
│                             │
│                             │
├─────────────────────────────┤ ← 드래그 핸들
│  ┌───────────────────────┐  │
│  │                       │  │
│  │      WebView          │  │
│  │      (Bottom Sheet    │  │
│  │       Content)        │  │
│  │                       │  │
│  └───────────────────────┘  │
└─────────────────────────────┘
```

### 3.1. Layer Hierarchy (레이어 계층)
1. **Base Layer:** Native Map (전체 화면)
2. **Overlay Layer:** Bottom Sheet (하단에서 올라오는 시트)
3. **Content Layer:** WebView (바텀시트 내부)

### 3.2. Bottom Sheet Behavior (바텀시트 동작)
- **Snap Points 없음:** 자유롭게 드래그 가능한 연속적인 높이 조절
- **Min Height:** ~15% (최소 높이, 핸들 영역 노출)
- **Max Height:** ~90% (최대 높이)
- **드래그 해제 시:** 현재 위치 유지 (관성 스크롤 없음, 즉시 정지)

## 4. Interaction Design (인터랙션 설계)

### 4.1. Scroll Behavior (스크롤 동작)
**핵심 원칙:** 바텀시트가 최대 높이에 도달하기 전까지는 바텀시트 드래그, 최대 높이에서는 웹뷰 스크롤.

| 시나리오 | 바텀시트 상태 | 제스처 결과 |
|---------|-------------|------------|
| 위로 스와이프 | 최대 높이 미만 | 바텀시트 높이 증가 |
| 위로 스와이프 | 최대 높이 도달 | 웹뷰 내부 스크롤 |
| 아래로 스와이프 | 최대 높이 + 웹뷰 scrollTop > 0 | 웹뷰 내부 스크롤 |
| 아래로 스와이프 | 최대 높이 + 웹뷰 scrollTop = 0 | 바텀시트 높이 감소 |
| 아래로 스와이프 | 최대 높이 미만 | 바텀시트 높이 감소 |
| 지도 영역 터치 | any | 지도 인터랙션 (pan, zoom) |

### 4.2. Gesture Priority (제스처 우선순위)
1. **Handle Area (핸들 영역):** 항상 바텀시트 드래그
2. **WebView Area (웹뷰 영역):**
   - 최대 높이 상태: 웹뷰 스크롤 우선
   - 그 외: 바텀시트 드래그 우선
3. **Map Area (지도 영역):** 지도 제스처만 동작

### 4.3. Scroll Lock Mechanism (스크롤 잠금 메커니즘)
```
┌──────────────────────────────────────────────────────┐
│ 사용자가 바텀시트 위에서 위로 스와이프                    │
└──────────────────────────────────────────────────────┘
                         │
                         ▼
              ┌─────────────────────┐
              │ 바텀시트 최대 높이?   │
              └─────────────────────┘
                    │          │
                   YES         NO
                    │          │
                    ▼          ▼
          ┌─────────────┐  ┌─────────────────┐
          │ 웹뷰 스크롤   │  │ 바텀시트 높이 증가 │
          │ 활성화       │  │ (웹뷰 스크롤 잠금) │
          └─────────────┘  └─────────────────┘
```

## 5. Technical Implementation (기술 구현)

### 5.1. Tech Stack
| Component | Library | Version | Note |
|-----------|---------|---------|------|
| Native Map | `react-native-maps` | latest | |
| Bottom Sheet | Custom or `react-native-gesture-handler` | - | 스냅 없이 자유 드래그 |
| WebView | `react-native-webview` | latest | |
| Gesture Handler | `react-native-gesture-handler` | v2+ | 바텀시트 드래그 구현 |
| Reanimated | `react-native-reanimated` | v3+ | 부드러운 애니메이션 |

### 5.2. Key Implementation Points

#### 5.2.1. Bottom Sheet + WebView Scroll Coordination
```typescript
// 바텀시트 높이 상태에 따른 웹뷰 스크롤 제어
interface MapBottomSheetProps {
  minHeight: number | string;  // 최소 높이 (e.g., '15%' or 100)
  maxHeight: number | string;  // 최대 높이 (e.g., '90%' or 600)
  initialHeight?: number | string;  // 초기 높이
  webViewUrl: string;
}

// 웹뷰 스크롤 위치 감지를 위한 Bridge
interface WebViewScrollState {
  scrollTop: number;
  isAtTop: boolean;  // scrollTop === 0
}
```

#### 5.2.2. Nested Scroll Handling
`react-native-gesture-handler`의 `PanGestureHandler` 또는 커스텀 드래그 핸들러 사용:

```typescript
// 웹뷰가 최상단일 때만 바텀시트 드래그 허용
const handleWebViewScroll = (scrollTop: number) => {
  if (scrollTop === 0 && isAtMaxHeight) {
    enableBottomSheetGesture();
  } else if (isAtMaxHeight) {
    disableBottomSheetGesture();
  }
};
```

#### 5.2.3. WebView-Native Communication
웹뷰 내부 스크롤 위치를 네이티브로 전달:

```javascript
// WebView 내부 JavaScript
window.addEventListener('scroll', () => {
  window.ReactNativeWebView.postMessage(JSON.stringify({
    type: 'SCROLL',
    scrollTop: document.documentElement.scrollTop
  }));
});
```

### 5.3. Component Interface

#### **widgets/Map/ui/MapWithBottomSheet**
```typescript
interface MapWithBottomSheetProps {
  // Map Props
  initialRegion: Region;
  markers?: MapMarker[];
  onMarkerPress?: (markerId: string) => void;
  
  // Bottom Sheet Props (No Snap Points - Free Drag)
  minHeight?: number | string;  // default: '15%'
  maxHeight?: number | string;  // default: '90%'
  initialHeight?: number | string;  // default: minHeight
  
  // WebView Props
  webViewUrl: string;
  onWebViewMessage?: (data: WebViewMessage) => void;
}

interface Region {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
}

interface MapMarker {
  id: string;
  coordinate: { latitude: number; longitude: number };
  title?: string;
}
```

#### **features/Map/model/useMapBottomSheet**
```typescript
interface UseMapBottomSheetReturn {
  // State
  currentHeight: number;  // 현재 바텀시트 높이 (px)
  heightPercent: number;  // 현재 높이 비율 (0-1)
  isAtMaxHeight: boolean;  // 최대 높이 도달 여부
  isAtMinHeight: boolean;  // 최소 높이 도달 여부
  webViewScrollTop: number;
  
  // Actions
  setHeight: (height: number) => void;
  animateToHeight: (height: number) => void;
  animateToMax: () => void;
  animateToMin: () => void;
  handleWebViewScroll: (scrollTop: number) => void;
}
```

## 6. Edge Cases & Error Handling (엣지 케이스)

### 6.1. Gesture Conflicts (제스처 충돌)
| 상황 | 해결 방안 |
|-----|---------|
| 빠른 스와이프로 바텀시트 + 웹뷰 동시 반응 | 제스처 시작 시 대상 결정 후 lock |
| 웹뷰 내부 가로 스크롤과 바텀시트 드래그 충돌 | 수직 제스처만 바텀시트에 전달 |
| 지도 줌 제스처가 바텀시트에 영향 | 지도 영역과 바텀시트 영역 분리 |

### 6.2. WebView Loading States
| 상태 | UI 처리 |
|-----|--------|
| Loading | 스켈레톤 또는 로딩 인디케이터 |
| Error | 재시도 버튼 + 에러 메시지 |
| Success | 콘텐츠 표시 |

### 6.3. Performance Considerations
- 바텀시트 드래그 중 지도 렌더링 최적화 (필요시 지도 인터랙션 비활성화)
- 웹뷰 스크롤 이벤트 throttling (16ms)
- 바텀시트 애니메이션: `react-native-reanimated` worklet 사용

## 7. Directory Structure (FSD)

```text
src/
├── widgets/
│   └── Map/
│       ├── ui/
│       │   ├── MapWithBottomSheet.tsx    # 메인 위젯
│       │   ├── MapView.tsx               # 네이티브 맵 래퍼
│       │   └── MapBottomSheet.tsx        # 바텀시트 + 웹뷰
│       ├── model/
│       │   └── useMapBottomSheet.ts      # 상태 관리 훅
│       └── index.ts
├── features/
│   └── Map/
│       ├── lib/
│       │   └── webViewBridge.ts          # 웹뷰 통신 유틸
│       └── index.ts
└── shared/
    └── ui/
        └── BottomSheetWebView/
            ├── BottomSheetWebView.tsx    # 재사용 가능한 바텀시트+웹뷰
            └── index.ts
```

## 8. Acceptance Criteria (인수 조건)

### 8.1. Functional Requirements
- [ ] 네이티브 지도가 전체 화면에 렌더링된다
- [ ] 바텀시트가 지도 위에 오버레이로 표시된다
- [ ] 바텀시트 내부에 웹뷰가 정상 로드된다
- [ ] 바텀시트가 min/max 범위 내에서 자유롭게 드래그된다

### 8.2. Scroll UX Requirements
- [ ] 바텀시트 핸들 드래그로 시트 높이 자유롭게 조절 가능
- [ ] 최대 높이 상태에서 웹뷰 내부 스크롤이 자연스럽게 동작
- [ ] 웹뷰가 최상단일 때 아래로 스와이프하면 바텀시트 높이 감소
- [ ] 드래그 중 부드러운 애니메이션 (스냅 없이 연속적)
- [ ] 제스처 전환 시 끊김이나 점프 현상 없음

### 8.3. Performance Requirements
- [ ] 바텀시트 드래그 애니메이션 60fps 유지
- [ ] 웹뷰 스크롤 시 지연 없음
- [ ] 지도 인터랙션 (pan, zoom) 정상 동작

## 9. Open Questions (미결정 사항)

1. **웹뷰 URL 결정:** 어떤 웹 콘텐츠를 바텀시트에 표시할 것인가?
2. **지도 마커 연동:** 마커 클릭 시 바텀시트 콘텐츠 변경 여부?
3. **오프라인 처리:** 네트워크 없을 때 지도/웹뷰 fallback UI?
4. **딥링크:** 특정 위치로 지도 이동 + 바텀시트 열기 지원 여부?
