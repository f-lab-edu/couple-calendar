# webview-host iOS 아이콘 + 스플래시 디자인

날짜: 2026-06-15
대상: `apps/webview-host` (iOS 전용)

## 컨셉
- 모티프: 하트(커플 정체성 ♥)
- 색: 포레스트 그린 `#1f3a2e` 바탕 + 크림 `#f6f5f0` 하트 (couple-calendar D-day 카드 색과 동일)
- 톤: 플랫·미니멀, 텍스트 없음
- 생성: ImageMagick(`magick`) 프로그램 렌더 (AI 이미지 생성 도구 부재 → 단순 도형은 벡터 렌더가 더 선명·결정적)

## 산출물
1. **앱 아이콘** — 1024 마스터(그린 바탕 + 크림 하트, 모서리 라운딩 없음) → `sips`로 AppIcon.appiconset 전 사이즈 생성(40/58/60/80/87/120/180/1024) + Contents.json 파일명 매핑.
2. **LaunchScreen** — 기본 storyboard의 "webviewhost / Powered by React Native" 라벨 제거. 포레스트 그린 풀블리드 배경 + 중앙 크림 하트 로고(투명 PNG를 `LaunchLogo.imageset` @1x/2x/3x로 추가).

## 검증
- `xcrun simctl`로 앱 재설치 후 홈 화면 아이콘 + 부팅 스플래시 스크린샷 확인.
