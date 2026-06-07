# Web Data Layer Tests + CI Gate Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** `apps/web`의 data 레이어(parsers/repositories/datasources)에 단위 테스트를 추가하고, PR에서 typecheck/lint/test를 강제하는 GitHub Actions 게이트를 신설한다.

**Architecture:** Vitest(node env) 단위 테스트. parsers는 순수 함수로 직접 호출, repositories는 가짜 datasource를 생성자 주입해 오케스트레이션 검증, datasources는 `global fetch`를 `vi.stubGlobal`로 목킹. 공용 fetch 목 헬퍼 1개를 도입(DRY). CI는 워크스페이스 전체를 설치한 뒤 web만 필터해 검증.

**Tech Stack:** Vitest 4, TypeScript, pnpm(corepack), GitHub Actions, Next.js 16.

**작업 위치:** 현재 브랜치 `feat/web-data-tests-and-ci` (PR #5 `chore/web-domain-tests-and-pnpm-cleanup` 위에 분기됨). 모든 명령은 저장소 루트 `couple-calendar/`에서 실행한다고 가정한다. 테스트 실행 단축키:
```bash
pnpm --filter @couple-calendar/web-next test
```

---

## File Structure

신규/수정 파일과 책임:

- `apps/web/vitest.config.ts` — **수정**: coverage 대상에 data 추가, test 헬퍼/테스트 제외.
- `apps/web/src/test/mockFetch.ts` — **신규**: datasource 테스트용 `global fetch` 목 헬퍼(공용).
- `apps/web/src/data/parsers/*.test.ts` — **신규 6**: 각 parser 단위 테스트(소스와 colocate).
- `apps/web/src/data/repositories/AnniversaryRepositoryImpl.ts` — **수정**: 생성자 주입으로 통일(테스트 가능화).
- `apps/web/src/data/repositories/*.test.ts` — **신규 5**: 가짜 datasource 주입 단위 테스트.
- `apps/web/src/data/apis/*.test.ts` — **신규 5**: fetch 목 단위 테스트(Anniversary는 stub 검증).
- `apps/web/package.json` — **수정**: `typecheck` 스크립트 추가.
- `.github/workflows/web-ci.yml` — **신규**: PR/main push 시 web typecheck+lint+test.

---

## Task 1: Extend coverage config + add shared fetch mock helper

**Files:**
- Modify: `apps/web/vitest.config.ts`
- Create: `apps/web/src/test/mockFetch.ts`

- [ ] **Step 1: Replace `apps/web/vitest.config.ts` with extended coverage config**

```ts
import { resolve } from "node:path";
import { defineConfig } from "vitest/config";

export default defineConfig({
	test: {
		environment: "node",
		include: ["src/**/*.{test,spec}.{ts,tsx}"],
		unstubGlobals: true,
		coverage: {
			provider: "v8",
			include: [
				"src/domain/**/*.ts",
				"src/data/parsers/**/*.ts",
				"src/data/repositories/**/*.ts",
				"src/data/apis/**/*.ts",
			],
			exclude: [
				"src/**/*.{test,spec}.ts",
				"src/domain/repositories/**",
				"src/data/dto/**",
				"src/test/**",
			],
		},
	},
	resolve: {
		alias: {
			"@": resolve(__dirname, "./src"),
		},
	},
});
```

> `unstubGlobals: true`는 각 테스트 후 `vi.stubGlobal`을 자동 복원한다(afterEach 보일러플레이트 제거).

- [ ] **Step 2: Create `apps/web/src/test/mockFetch.ts`**

```ts
import { vi } from "vitest";

interface FetchMockInit {
	ok?: boolean;
	status?: number;
	statusText?: string;
}

/**
 * Replace global `fetch` with a vi.fn that resolves a minimal Response-like
 * object. `unstubGlobals: true` in vitest.config restores it after each test.
 *
 * Returns the mock so callers can assert on the request (url, method, body).
 */
export const stubFetchJson = (data: unknown, init: FetchMockInit = {}) => {
	const fetchMock = vi.fn(
		async () =>
			({
				ok: init.ok ?? true,
				status: init.status ?? 200,
				statusText: init.statusText ?? "OK",
				json: async () => data,
			}) as unknown as Response,
	);
	vi.stubGlobal("fetch", fetchMock);
	return fetchMock;
};

/** Stub fetch with a non-2xx response whose json() yields `body`. */
export const stubFetchError = (
	status: number,
	statusText: string,
	body: unknown = {},
) => stubFetchJson(body, { ok: false, status, statusText });
```

- [ ] **Step 3: Verify existing tests still pass with new config**

Run: `pnpm --filter @couple-calendar/web-next test`
Expected: PASS — `Test Files 18 passed`, `Tests 59 passed` (domain tests unaffected).

- [ ] **Step 4: Commit**

```bash
git add apps/web/vitest.config.ts apps/web/src/test/mockFetch.ts
git commit -m "test(web): extend coverage to data layer and add fetch mock helper"
```

---

## Task 2: Parser unit tests (6 files)

**Files:**
- Test: `apps/web/src/data/parsers/eventParser.test.ts`
- Test: `apps/web/src/data/parsers/anniversaryParser.test.ts`
- Test: `apps/web/src/data/parsers/coupleParser.test.ts`
- Test: `apps/web/src/data/parsers/userParser.test.ts`
- Test: `apps/web/src/data/parsers/notificationSettingsParser.test.ts`
- Test: `apps/web/src/data/parsers/inviteCodeParser.test.ts`

> 참고(소스 사실): `eventParser`는 `parseEvent`/`parseEvents` named export, 카테고리 검증 throw. `anniversaryParser`는 `AnniversaryParser`를 **default export**하며 **배열을 입력받아 배열 반환**, type 검증 throw. `inviteCodeParser`는 `raw.inviteCode → InviteCode.code`로 매핑. 나머지는 단순 필드 매핑.

- [ ] **Step 1: Write `eventParser.test.ts`**

```ts
import { describe, expect, it } from "vitest";
import type { EventResponse } from "@/data/dto/event-response";
import { parseEvent, parseEvents } from "./eventParser";

const dto = (overrides: Partial<EventResponse> = {}): EventResponse => ({
	id: "evt-1",
	coupleId: "couple-1",
	title: "데이트",
	startTime: "2026-06-06T10:00:00.000Z",
	endTime: "2026-06-06T12:00:00.000Z",
	category: "DATE",
	authorId: "user-1",
	description: "홍대",
	location: "홍대입구역",
	createdAt: "2026-06-01T00:00:00.000Z",
	updatedAt: "2026-06-01T00:00:00.000Z",
	...overrides,
});

describe("parseEvent", () => {
	it("DTO를 도메인 Event로 매핑한다", () => {
		const event = parseEvent(dto());
		expect(event).toMatchObject({
			id: "evt-1",
			coupleId: "couple-1",
			title: "데이트",
			startTime: "2026-06-06T10:00:00.000Z",
			endTime: "2026-06-06T12:00:00.000Z",
			category: "DATE",
			description: "홍대",
			location: "홍대입구역",
		});
	});

	it("description/location의 null을 보존한다", () => {
		const event = parseEvent(dto({ description: null, location: null }));
		expect(event.description).toBeNull();
		expect(event.location).toBeNull();
	});

	it.each(["DATE", "ANNIVERSARY", "INDIVIDUAL", "OTHER"] as const)(
		"허용 카테고리 %s를 통과시킨다",
		(category) => {
			expect(parseEvent(dto({ category })).category).toBe(category);
		},
	);

	it("허용되지 않은 카테고리면 에러를 던진다", () => {
		expect(() => parseEvent(dto({ category: "UNKNOWN" as never }))).toThrow(
			"Unknown event category from server: UNKNOWN",
		);
	});
});

describe("parseEvents", () => {
	it("배열을 순서대로 매핑한다", () => {
		const events = parseEvents([dto({ id: "a" }), dto({ id: "b" })]);
		expect(events.map((e) => e.id)).toEqual(["a", "b"]);
	});

	it("빈 배열이면 빈 배열을 반환한다", () => {
		expect(parseEvents([])).toEqual([]);
	});
});
```

- [ ] **Step 2: Write `anniversaryParser.test.ts`**

```ts
import { describe, expect, it } from "vitest";
import type { AnniversaryResponse } from "@/data/dto/anniversary-response";
import AnniversaryParser from "./anniversaryParser";

const dto = (overrides: Partial<AnniversaryResponse> = {}): AnniversaryResponse => ({
	id: "a-1",
	coupleId: "couple-1",
	title: "처음 만난 날",
	date: "2025-01-01",
	isRecurring: true,
	description: "설명",
	type: "CUSTOM",
	daysUntil: 30,
	...overrides,
});

describe("AnniversaryParser", () => {
	it("DTO 배열을 도메인 Anniversary 배열로 매핑한다", () => {
		const [anniversary] = AnniversaryParser([dto()]);
		expect(anniversary).toMatchObject({
			id: "a-1",
			coupleId: "couple-1",
			title: "처음 만난 날",
			date: "2025-01-01",
			isRecurring: true,
			description: "설명",
			type: "CUSTOM",
			daysUntil: 30,
		});
	});

	it("AUTO 타입과 null description을 처리한다", () => {
		const [anniversary] = AnniversaryParser([dto({ type: "AUTO", description: null })]);
		expect(anniversary.type).toBe("AUTO");
		expect(anniversary.description).toBeNull();
	});

	it("허용되지 않은 type이면 에러를 던진다", () => {
		expect(() => AnniversaryParser([dto({ type: "X" as never })])).toThrow(
			"Unknown anniversary type from server: X",
		);
	});

	it("빈 배열이면 빈 배열을 반환한다", () => {
		expect(AnniversaryParser([])).toEqual([]);
	});
});
```

- [ ] **Step 3: Write `coupleParser.test.ts`**

```ts
import { describe, expect, it } from "vitest";
import type { CoupleResponse } from "@/data/dto/couple-response";
import { parseCouple } from "./coupleParser";

const dto = (overrides: Partial<CoupleResponse> = {}): CoupleResponse => ({
	id: "couple-1",
	user1Id: "user-1",
	user2Id: "user-2",
	startDate: "2025-01-01",
	inviteCode: "ABC123",
	inviteCodeExpiresAt: "2025-01-08T00:00:00.000Z",
	daysFromStart: 365,
	isComplete: true,
	createdAt: "2025-01-01T00:00:00.000Z",
	updatedAt: "2025-01-01T00:00:00.000Z",
	...overrides,
});

describe("parseCouple", () => {
	it("DTO를 도메인 Couple로 매핑한다", () => {
		expect(parseCouple(dto())).toMatchObject({
			id: "couple-1",
			user1Id: "user-1",
			user2Id: "user-2",
			startDate: "2025-01-01",
			inviteCode: "ABC123",
			inviteCodeExpiresAt: "2025-01-08T00:00:00.000Z",
			daysFromStart: 365,
			isComplete: true,
		});
	});

	it("아직 연결 전인 커플의 nullable 필드를 보존한다", () => {
		const couple = parseCouple(
			dto({ user2Id: null, inviteCode: null, inviteCodeExpiresAt: null, isComplete: false }),
		);
		expect(couple.user2Id).toBeNull();
		expect(couple.inviteCode).toBeNull();
		expect(couple.inviteCodeExpiresAt).toBeNull();
		expect(couple.isComplete).toBe(false);
	});
});
```

- [ ] **Step 4: Write `userParser.test.ts`**

```ts
import { describe, expect, it } from "vitest";
import type { UserResponse } from "@/data/dto/user-response";
import { parseUser } from "./userParser";

const dto = (overrides: Partial<UserResponse> = {}): UserResponse => ({
	id: "user-1",
	email: "me@example.com",
	name: "홍길동",
	nickname: "길동",
	birthday: "1995-03-15",
	bio: "안녕",
	partnerNickname: "자기",
	coupleId: "couple-1",
	createdAt: "2025-01-01T00:00:00.000Z",
	updatedAt: "2025-01-01T00:00:00.000Z",
	...overrides,
});

describe("parseUser", () => {
	it("DTO를 도메인 User로 매핑한다", () => {
		expect(parseUser(dto())).toMatchObject({
			id: "user-1",
			email: "me@example.com",
			name: "홍길동",
			nickname: "길동",
			birthday: "1995-03-15",
			bio: "안녕",
			partnerNickname: "자기",
			coupleId: "couple-1",
		});
	});

	it("nullable 필드를 보존한다", () => {
		const user = parseUser(
			dto({ birthday: null, bio: null, partnerNickname: null, coupleId: null }),
		);
		expect(user.birthday).toBeNull();
		expect(user.bio).toBeNull();
		expect(user.partnerNickname).toBeNull();
		expect(user.coupleId).toBeNull();
	});
});
```

- [ ] **Step 5: Write `notificationSettingsParser.test.ts`**

```ts
import { describe, expect, it } from "vitest";
import type { NotificationSettingsResponse } from "@/data/dto/notification-settings-response";
import { parseNotificationSettings } from "./notificationSettingsParser";

describe("parseNotificationSettings", () => {
	it("DTO를 도메인 NotificationSettings로 매핑한다", () => {
		const dto: NotificationSettingsResponse = {
			eventEnabled: true,
			eventReminder: "1_DAY_BEFORE",
			anniversaryEnabled: false,
			anniversaryReminder: "SAME_DAY",
			partnerActivityEnabled: true,
		};
		expect(parseNotificationSettings(dto)).toMatchObject(dto);
	});
});
```

- [ ] **Step 6: Write `inviteCodeParser.test.ts`**

```ts
import { describe, expect, it } from "vitest";
import type { InviteCodeResponse } from "@/data/dto/couple-response";
import { parseInviteCode } from "./inviteCodeParser";

describe("parseInviteCode", () => {
	it("DTO의 inviteCode를 도메인 code로 매핑한다", () => {
		const dto: InviteCodeResponse = {
			inviteCode: "ABC123",
			expiresAt: "2026-06-13T00:00:00.000Z",
		};
		const inviteCode = parseInviteCode(dto);
		expect(inviteCode.code).toBe("ABC123");
		expect(inviteCode.expiresAt).toBe("2026-06-13T00:00:00.000Z");
	});
});
```

- [ ] **Step 7: Run parser tests**

Run: `pnpm --filter @couple-calendar/web-next test -- src/data/parsers`
Expected: PASS — 6 new test files green.

- [ ] **Step 8: Commit**

```bash
git add apps/web/src/data/parsers/*.test.ts
git commit -m "test(web): add data parser unit tests"
```

---

## Task 3: Make AnniversaryRepositoryImpl injectable

`AnniversaryRepositoryImpl`은 메서드마다 `new AnniversaryDataSource()`를 호출해 테스트에서 datasource를 대체할 수 없다. 다른 RepositoryImpl과 동일하게 생성자 주입으로 통일한다.

**Files:**
- Modify: `apps/web/src/data/repositories/AnniversaryRepositoryImpl.ts`

- [ ] **Step 1: Replace file contents with constructor-injected version**

```ts
import { AnniversaryDataSource } from "@/data/apis/AnniversaryDataSource";
import type Anniversary from "@/domain/entities/Anniversary";
import type { AnniversaryRepository } from "@/domain/repositories/AnniversaryRepository";

export class AnniversaryRepositoryImpl implements AnniversaryRepository {
	constructor(private readonly dataSource: AnniversaryDataSource = new AnniversaryDataSource()) {}

	async getAnniversaries(): Promise<Anniversary[]> {
		return this.dataSource.getAnniversaries();
	}

	async addAnniversary(anniversary: Anniversary): Promise<void> {
		return this.dataSource.addAnniversary(anniversary);
	}
}
```

> 주의: 반환 타입을 바꾸지 않는다. `getAnniversaries()`는 기존과 동일하게 datasource 결과(현재 mock `AnniversaryResponse[]`)를 그대로 반환한다 — 동작 보존이 목적이다.

- [ ] **Step 2: Typecheck and existing tests still pass**

Run: `pnpm --filter @couple-calendar/web-next test`
Expected: PASS (no behavior change). Typecheck happens in Task 6; quick sanity via test run here.

- [ ] **Step 3: Commit**

```bash
git add apps/web/src/data/repositories/AnniversaryRepositoryImpl.ts
git commit -m "refactor(web): inject datasource into AnniversaryRepositoryImpl"
```

---

## Task 4: Repository unit tests (5 files)

가짜 datasource(`vi.fn()` 메서드)를 생성자에 주입해 위임·파싱·검증 로직만 검증한다. fetch는 사용하지 않는다.

**Files:**
- Test: `apps/web/src/data/repositories/EventRepositoryImpl.test.ts`
- Test: `apps/web/src/data/repositories/CoupleRepositoryImpl.test.ts`
- Test: `apps/web/src/data/repositories/UserRepositoryImpl.test.ts`
- Test: `apps/web/src/data/repositories/NotificationSettingsRepositoryImpl.test.ts`
- Test: `apps/web/src/data/repositories/AnniversaryRepositoryImpl.test.ts`

- [ ] **Step 1: Write `EventRepositoryImpl.test.ts`** (가장 로직이 많음 — KST 월 경계 + 검증)

```ts
import { describe, expect, it, vi } from "vitest";
import type { EventDataSource } from "@/data/apis/EventDataSource";
import type { EventResponse } from "@/data/dto/event-response";
import type { CreateEventInput } from "@/domain/repositories/EventRepository";
import { EventRepositoryImpl } from "./EventRepositoryImpl";

const eventDto = (overrides: Partial<EventResponse> = {}): EventResponse => ({
	id: "evt-1",
	coupleId: "couple-1",
	title: "데이트",
	startTime: "2026-06-06T10:00:00.000Z",
	endTime: "2026-06-06T12:00:00.000Z",
	category: "DATE",
	authorId: "user-1",
	description: null,
	location: null,
	createdAt: "2026-06-01T00:00:00.000Z",
	updatedAt: "2026-06-01T00:00:00.000Z",
	...overrides,
});

const makeDataSource = (): EventDataSource =>
	({
		getEvents: vi.fn(async () => [eventDto()]),
		createEvent: vi.fn(async () => eventDto({ id: "created" })),
	}) as unknown as EventDataSource;

describe("EventRepositoryImpl.getMonthlyEvents", () => {
	it("KST(+09:00) 월 경계로 datasource를 호출한다 (6월 = 30일)", async () => {
		const dataSource = makeDataSource();
		const repo = new EventRepositoryImpl(dataSource);

		await repo.getMonthlyEvents(2026, 6);

		expect(dataSource.getEvents).toHaveBeenCalledWith(
			"2026-06-01T00:00:00+09:00",
			"2026-06-30T23:59:59+09:00",
		);
	});

	it("말일이 31일인 달(7월)의 경계를 계산한다", async () => {
		const dataSource = makeDataSource();
		const repo = new EventRepositoryImpl(dataSource);

		await repo.getMonthlyEvents(2026, 7);

		expect(dataSource.getEvents).toHaveBeenCalledWith(
			"2026-07-01T00:00:00+09:00",
			"2026-07-31T23:59:59+09:00",
		);
	});

	it("윤년 2월의 말일(29일)을 계산한다", async () => {
		const dataSource = makeDataSource();
		const repo = new EventRepositoryImpl(dataSource);

		await repo.getMonthlyEvents(2028, 2);

		expect(dataSource.getEvents).toHaveBeenCalledWith(
			"2028-02-01T00:00:00+09:00",
			"2028-02-29T23:59:59+09:00",
		);
	});

	it("datasource DTO를 도메인 Event로 파싱해 반환한다", async () => {
		const dataSource = makeDataSource();
		const repo = new EventRepositoryImpl(dataSource);

		const events = await repo.getMonthlyEvents(2026, 6);

		expect(events).toHaveLength(1);
		expect(events[0].id).toBe("evt-1");
	});

	it.each([0, 13, -1])("month가 1..12 범위 밖(%s)이면 에러를 던지고 호출하지 않는다", async (month) => {
		const dataSource = makeDataSource();
		const repo = new EventRepositoryImpl(dataSource);

		await expect(repo.getMonthlyEvents(2026, month)).rejects.toThrow(
			`month must be 1..12, got ${month}`,
		);
		expect(dataSource.getEvents).not.toHaveBeenCalled();
	});
});

describe("EventRepositoryImpl.createEvent", () => {
	it("입력을 datasource에 전달하고 파싱된 결과를 반환한다", async () => {
		const dataSource = makeDataSource();
		const repo = new EventRepositoryImpl(dataSource);
		const input: CreateEventInput = {
			title: "데이트",
			startTime: "2026-06-06T10:00:00.000Z",
			endTime: "2026-06-06T12:00:00.000Z",
			category: "DATE",
			description: null,
			location: null,
		};

		const created = await repo.createEvent(input);

		expect(dataSource.createEvent).toHaveBeenCalledWith(input);
		expect(created.id).toBe("created");
	});
});
```

- [ ] **Step 2: Write `CoupleRepositoryImpl.test.ts`**

```ts
import { describe, expect, it, vi } from "vitest";
import type { CoupleDataSource } from "@/data/apis/CoupleDataSource";
import type { CoupleResponse, InviteCodeResponse } from "@/data/dto/couple-response";
import { CoupleRepositoryImpl } from "./CoupleRepositoryImpl";

const coupleDto: CoupleResponse = {
	id: "couple-1",
	user1Id: "user-1",
	user2Id: "user-2",
	startDate: "2025-01-01",
	inviteCode: "ABC123",
	inviteCodeExpiresAt: "2025-01-08T00:00:00.000Z",
	daysFromStart: 365,
	isComplete: true,
	createdAt: "2025-01-01T00:00:00.000Z",
	updatedAt: "2025-01-01T00:00:00.000Z",
};

const inviteDto: InviteCodeResponse = {
	inviteCode: "ABC123",
	expiresAt: "2026-06-13T00:00:00.000Z",
};

const makeDataSource = (): CoupleDataSource =>
	({
		invite: vi.fn(async () => inviteDto),
		connect: vi.fn(async () => coupleDto),
		getMyCouple: vi.fn(async () => coupleDto),
		updateStartDate: vi.fn(async () => coupleDto),
		disconnect: vi.fn(async () => undefined),
	}) as unknown as CoupleDataSource;

describe("CoupleRepositoryImpl", () => {
	it("invite: startDate 전달 + InviteCode 파싱", async () => {
		const ds = makeDataSource();
		const result = await new CoupleRepositoryImpl(ds).invite("2025-01-01");
		expect(ds.invite).toHaveBeenCalledWith("2025-01-01");
		expect(result.code).toBe("ABC123");
		expect(result.expiresAt).toBe("2026-06-13T00:00:00.000Z");
	});

	it("connect: inviteCode 전달 + Couple 파싱", async () => {
		const ds = makeDataSource();
		const result = await new CoupleRepositoryImpl(ds).connect("ABC123");
		expect(ds.connect).toHaveBeenCalledWith("ABC123");
		expect(result.id).toBe("couple-1");
	});

	it("getMyCouple: Couple 파싱 결과 반환", async () => {
		const ds = makeDataSource();
		const result = await new CoupleRepositoryImpl(ds).getMyCouple();
		expect(ds.getMyCouple).toHaveBeenCalledTimes(1);
		expect(result.user1Id).toBe("user-1");
	});

	it("updateStartDate: startDate 전달 + Couple 파싱", async () => {
		const ds = makeDataSource();
		const result = await new CoupleRepositoryImpl(ds).updateStartDate("2025-02-02");
		expect(ds.updateStartDate).toHaveBeenCalledWith("2025-02-02");
		expect(result.id).toBe("couple-1");
	});

	it("disconnect: datasource에 위임", async () => {
		const ds = makeDataSource();
		await new CoupleRepositoryImpl(ds).disconnect();
		expect(ds.disconnect).toHaveBeenCalledTimes(1);
	});
});
```

- [ ] **Step 3: Write `UserRepositoryImpl.test.ts`**

```ts
import { describe, expect, it, vi } from "vitest";
import type { UserDataSource } from "@/data/apis/UserDataSource";
import type { UserResponse } from "@/data/dto/user-response";
import type { UpdateProfileInput } from "@/domain/repositories/UserRepository";
import { UserRepositoryImpl } from "./UserRepositoryImpl";

const userDto = (overrides: Partial<UserResponse> = {}): UserResponse => ({
	id: "user-1",
	email: "me@example.com",
	name: "홍길동",
	nickname: "길동",
	birthday: null,
	bio: null,
	partnerNickname: null,
	coupleId: "couple-1",
	createdAt: "2025-01-01T00:00:00.000Z",
	updatedAt: "2025-01-01T00:00:00.000Z",
	...overrides,
});

const makeDataSource = (): UserDataSource =>
	({
		getMe: vi.fn(async () => userDto()),
		getById: vi.fn(async () => userDto({ id: "user-2", name: "파트너" })),
		updateMe: vi.fn(async (input: UpdateProfileInput) => userDto({ ...input })),
	}) as unknown as UserDataSource;

describe("UserRepositoryImpl", () => {
	it("getMe: User 파싱 결과 반환", async () => {
		const ds = makeDataSource();
		const me = await new UserRepositoryImpl(ds).getMe();
		expect(ds.getMe).toHaveBeenCalledTimes(1);
		expect(me.id).toBe("user-1");
	});

	it("getById: id 전달 + User 파싱", async () => {
		const ds = makeDataSource();
		const partner = await new UserRepositoryImpl(ds).getById("user-2");
		expect(ds.getById).toHaveBeenCalledWith("user-2");
		expect(partner.name).toBe("파트너");
	});

	it("updateMe: 입력 전달 + User 파싱", async () => {
		const ds = makeDataSource();
		const input: UpdateProfileInput = { nickname: "새닉" };
		const updated = await new UserRepositoryImpl(ds).updateMe(input);
		expect(ds.updateMe).toHaveBeenCalledWith(input);
		expect(updated.nickname).toBe("새닉");
	});
});
```

- [ ] **Step 4: Write `NotificationSettingsRepositoryImpl.test.ts`**

```ts
import { describe, expect, it, vi } from "vitest";
import type { NotificationSettingsDataSource } from "@/data/apis/NotificationSettingsDataSource";
import type { NotificationSettingsResponse } from "@/data/dto/notification-settings-response";
import type { UpdateNotificationSettingsInput } from "@/domain/repositories/NotificationSettingsRepository";
import { NotificationSettingsRepositoryImpl } from "./NotificationSettingsRepositoryImpl";

const settingsDto = (overrides: Partial<NotificationSettingsResponse> = {}): NotificationSettingsResponse => ({
	eventEnabled: true,
	eventReminder: "1_DAY_BEFORE",
	anniversaryEnabled: true,
	anniversaryReminder: "SAME_DAY",
	partnerActivityEnabled: false,
	...overrides,
});

const makeDataSource = (): NotificationSettingsDataSource =>
	({
		getMine: vi.fn(async () => settingsDto()),
		update: vi.fn(async (input: UpdateNotificationSettingsInput) => settingsDto({ ...input })),
	}) as unknown as NotificationSettingsDataSource;

describe("NotificationSettingsRepositoryImpl", () => {
	it("getMine: 파싱 결과 반환", async () => {
		const ds = makeDataSource();
		const result = await new NotificationSettingsRepositoryImpl(ds).getMine();
		expect(ds.getMine).toHaveBeenCalledTimes(1);
		expect(result.eventEnabled).toBe(true);
	});

	it("update: 입력 전달 + 파싱", async () => {
		const ds = makeDataSource();
		const input: UpdateNotificationSettingsInput = { eventEnabled: false };
		const result = await new NotificationSettingsRepositoryImpl(ds).update(input);
		expect(ds.update).toHaveBeenCalledWith(input);
		expect(result.eventEnabled).toBe(false);
	});
});
```

- [ ] **Step 5: Write `AnniversaryRepositoryImpl.test.ts`**

```ts
import { describe, expect, it, vi } from "vitest";
import type { AnniversaryDataSource } from "@/data/apis/AnniversaryDataSource";
import type { AnniversaryResponse } from "@/data/dto/anniversary-response";
import type Anniversary from "@/domain/entities/Anniversary";
import { AnniversaryRepositoryImpl } from "./AnniversaryRepositoryImpl";

const dto: AnniversaryResponse = {
	id: "a-1",
	coupleId: "couple-1",
	title: "처음 만난 날",
	date: "2025-01-01",
	isRecurring: true,
	description: null,
	type: "AUTO",
	daysUntil: 10,
};

const makeDataSource = (): AnniversaryDataSource =>
	({
		getAnniversaries: vi.fn(async () => [dto]),
		addAnniversary: vi.fn(async () => undefined),
	}) as unknown as AnniversaryDataSource;

describe("AnniversaryRepositoryImpl", () => {
	it("getAnniversaries: datasource 결과를 반환한다", async () => {
		const ds = makeDataSource();
		const result = await new AnniversaryRepositoryImpl(ds).getAnniversaries();
		expect(ds.getAnniversaries).toHaveBeenCalledTimes(1);
		expect(result).toEqual([dto]);
	});

	it("addAnniversary: datasource에 위임한다", async () => {
		const ds = makeDataSource();
		const anniversary = { id: "a-1" } as Anniversary;
		await new AnniversaryRepositoryImpl(ds).addAnniversary(anniversary);
		expect(ds.addAnniversary).toHaveBeenCalledWith(anniversary);
	});
});
```

- [ ] **Step 6: Run repository tests**

Run: `pnpm --filter @couple-calendar/web-next test -- src/data/repositories`
Expected: PASS — 5 new test files green.

- [ ] **Step 7: Commit**

```bash
git add apps/web/src/data/repositories/*.test.ts
git commit -m "test(web): add data repository unit tests"
```

---

## Task 5: Datasource unit tests (5 files)

`global fetch`를 `stubFetchJson`/`stubFetchError`로 목킹해 요청 구성과 에러 처리를 검증한다. `AnniversaryDataSource`는 fetch를 쓰지 않는 stub이므로 mock 반환만 검증한다.

**Files:**
- Test: `apps/web/src/data/apis/EventDataSource.test.ts`
- Test: `apps/web/src/data/apis/CoupleDataSource.test.ts`
- Test: `apps/web/src/data/apis/UserDataSource.test.ts`
- Test: `apps/web/src/data/apis/NotificationSettingsDataSource.test.ts`
- Test: `apps/web/src/data/apis/AnniversaryDataSource.test.ts`

> fetch 목 객체는 `(url, init)` 인자를 기록한다. 호출 인자는 `fetchMock.mock.calls[0]`로 단언한다.

- [ ] **Step 1: Write `EventDataSource.test.ts`**

```ts
import { describe, expect, it } from "vitest";
import { stubFetchError, stubFetchJson } from "@/test/mockFetch";
import { EventDataSource } from "./EventDataSource";

describe("EventDataSource.getEvents", () => {
	it("쿼리스트링 포함 GET 요청을 보내고 JSON을 반환한다", async () => {
		const payload = [{ id: "evt-1" }];
		const fetchMock = stubFetchJson(payload);

		const result = await new EventDataSource().getEvents(
			"2026-06-01T00:00:00+09:00",
			"2026-06-30T23:59:59+09:00",
		);

		const [url, init] = fetchMock.mock.calls[0];
		expect(url).toBe(
			"/api/events?startDate=2026-06-01T00%3A00%3A00%2B09%3A00&endDate=2026-06-30T23%3A59%3A59%2B09%3A00",
		);
		expect(init?.method).toBe("GET");
		expect(result).toEqual(payload);
	});

	it("응답이 ok가 아니면 에러를 던진다", async () => {
		stubFetchError(500, "Internal Server Error");
		await expect(
			new EventDataSource().getEvents("a", "b"),
		).rejects.toThrow("Failed to fetch events: 500 Internal Server Error");
	});
});

describe("EventDataSource.createEvent", () => {
	it("POST로 body를 직렬화해 보내고 생성 결과를 반환한다", async () => {
		const created = { id: "created" };
		const fetchMock = stubFetchJson(created);
		const request = {
			title: "데이트",
			startTime: "2026-06-06T10:00:00.000Z",
			endTime: "2026-06-06T12:00:00.000Z",
			category: "DATE" as const,
			description: null,
			location: null,
		};

		const result = await new EventDataSource().createEvent(request);

		const [url, init] = fetchMock.mock.calls[0];
		expect(url).toBe("/api/events");
		expect(init?.method).toBe("POST");
		expect(JSON.parse(init?.body as string)).toEqual(request);
		expect(result).toEqual(created);
	});

	it("응답이 ok가 아니면 에러를 던진다", async () => {
		stubFetchError(400, "Bad Request");
		await expect(
			new EventDataSource().createEvent({
				title: "x",
				startTime: "a",
				endTime: "b",
				category: "DATE",
				description: null,
				location: null,
			}),
		).rejects.toThrow("Failed to create event: 400 Bad Request");
	});
});
```

- [ ] **Step 2: Write `CoupleDataSource.test.ts`** (connect 에러 body 파싱 포함)

```ts
import { describe, expect, it } from "vitest";
import { stubFetchError, stubFetchJson } from "@/test/mockFetch";
import { CoupleDataSource } from "./CoupleDataSource";

describe("CoupleDataSource.invite", () => {
	it("startDate를 body에 담아 POST한다", async () => {
		const fetchMock = stubFetchJson({ inviteCode: "ABC123", expiresAt: "x" });
		await new CoupleDataSource().invite("2025-01-01");
		const [url, init] = fetchMock.mock.calls[0];
		expect(url).toBe("/api/couples/invite");
		expect(init?.method).toBe("POST");
		expect(JSON.parse(init?.body as string)).toEqual({ startDate: "2025-01-01" });
	});

	it("실패 시 에러를 던진다", async () => {
		stubFetchError(500, "Server Error");
		await expect(new CoupleDataSource().invite("x")).rejects.toThrow(
			"Failed to create invite code: 500 Server Error",
		);
	});
});

describe("CoupleDataSource.connect", () => {
	it("inviteCode를 body에 담아 POST하고 결과를 반환한다", async () => {
		const couple = { id: "couple-1" };
		const fetchMock = stubFetchJson(couple);
		const result = await new CoupleDataSource().connect("ABC123");
		const [url, init] = fetchMock.mock.calls[0];
		expect(url).toBe("/api/couples/connect");
		expect(JSON.parse(init?.body as string)).toEqual({ inviteCode: "ABC123" });
		expect(result).toEqual(couple);
	});

	it("실패 응답의 body.message를 에러 메시지로 사용한다", async () => {
		stubFetchError(409, "Conflict", { message: "이미 연결된 커플입니다." });
		await expect(new CoupleDataSource().connect("ABC123")).rejects.toThrow(
			"이미 연결된 커플입니다.",
		);
	});

	it("실패 body에 message가 없으면 fallback 메시지를 던진다", async () => {
		stubFetchError(409, "Conflict", {});
		await expect(new CoupleDataSource().connect("ABC123")).rejects.toThrow(
			"Failed to connect couple: 409 Conflict",
		);
	});
});

describe("CoupleDataSource.getMyCouple", () => {
	it("GET /api/couples/me", async () => {
		const fetchMock = stubFetchJson({ id: "couple-1" });
		await new CoupleDataSource().getMyCouple();
		const [url, init] = fetchMock.mock.calls[0];
		expect(url).toBe("/api/couples/me");
		expect(init?.method).toBe("GET");
	});

	it("실패 시 에러를 던진다", async () => {
		stubFetchError(404, "Not Found");
		await expect(new CoupleDataSource().getMyCouple()).rejects.toThrow(
			"Failed to fetch couple: 404 Not Found",
		);
	});
});

describe("CoupleDataSource.updateStartDate", () => {
	it("PATCH /api/couples/me 에 startDate를 보낸다", async () => {
		const fetchMock = stubFetchJson({ id: "couple-1" });
		await new CoupleDataSource().updateStartDate("2025-02-02");
		const [url, init] = fetchMock.mock.calls[0];
		expect(url).toBe("/api/couples/me");
		expect(init?.method).toBe("PATCH");
		expect(JSON.parse(init?.body as string)).toEqual({ startDate: "2025-02-02" });
	});
});

describe("CoupleDataSource.disconnect", () => {
	it("DELETE /api/couples/me", async () => {
		const fetchMock = stubFetchJson({});
		await new CoupleDataSource().disconnect();
		const [url, init] = fetchMock.mock.calls[0];
		expect(url).toBe("/api/couples/me");
		expect(init?.method).toBe("DELETE");
	});

	it("실패 시 에러를 던진다", async () => {
		stubFetchError(500, "Server Error");
		await expect(new CoupleDataSource().disconnect()).rejects.toThrow(
			"Failed to disconnect couple: 500 Server Error",
		);
	});
});
```

- [ ] **Step 3: Write `UserDataSource.test.ts`**

```ts
import { describe, expect, it } from "vitest";
import { stubFetchError, stubFetchJson } from "@/test/mockFetch";
import { UserDataSource } from "./UserDataSource";

describe("UserDataSource", () => {
	it("getMe: GET /api/users/me", async () => {
		const fetchMock = stubFetchJson({ id: "user-1" });
		const result = await new UserDataSource().getMe();
		const [url, init] = fetchMock.mock.calls[0];
		expect(url).toBe("/api/users/me");
		expect(init?.method).toBe("GET");
		expect(result).toEqual({ id: "user-1" });
	});

	it("getMe: 실패 시 에러", async () => {
		stubFetchError(401, "Unauthorized");
		await expect(new UserDataSource().getMe()).rejects.toThrow(
			"Failed to fetch current user: 401 Unauthorized",
		);
	});

	it("getById: id를 경로에 넣어 GET", async () => {
		const fetchMock = stubFetchJson({ id: "user-2" });
		await new UserDataSource().getById("user-2");
		expect(fetchMock.mock.calls[0][0]).toBe("/api/users/user-2");
	});

	it("getById: 실패 시 id 포함 에러", async () => {
		stubFetchError(404, "Not Found");
		await expect(new UserDataSource().getById("user-2")).rejects.toThrow(
			"Failed to fetch user user-2: 404 Not Found",
		);
	});

	it("updateMe: PATCH body 직렬화", async () => {
		const fetchMock = stubFetchJson({ id: "user-1" });
		await new UserDataSource().updateMe({ nickname: "새닉" });
		const [url, init] = fetchMock.mock.calls[0];
		expect(url).toBe("/api/users/me");
		expect(init?.method).toBe("PATCH");
		expect(JSON.parse(init?.body as string)).toEqual({ nickname: "새닉" });
	});

	it("updateMe: 실패 시 에러", async () => {
		stubFetchError(400, "Bad Request");
		await expect(new UserDataSource().updateMe({})).rejects.toThrow(
			"Failed to update profile: 400 Bad Request",
		);
	});
});
```

- [ ] **Step 4: Write `NotificationSettingsDataSource.test.ts`**

```ts
import { describe, expect, it } from "vitest";
import { stubFetchError, stubFetchJson } from "@/test/mockFetch";
import { NotificationSettingsDataSource } from "./NotificationSettingsDataSource";

describe("NotificationSettingsDataSource", () => {
	it("getMine: GET /api/users/me/notifications", async () => {
		const fetchMock = stubFetchJson({ eventEnabled: true });
		await new NotificationSettingsDataSource().getMine();
		const [url, init] = fetchMock.mock.calls[0];
		expect(url).toBe("/api/users/me/notifications");
		expect(init?.method).toBe("GET");
	});

	it("getMine: 실패 시 에러", async () => {
		stubFetchError(500, "Server Error");
		await expect(new NotificationSettingsDataSource().getMine()).rejects.toThrow(
			"Failed to fetch notification settings: 500 Server Error",
		);
	});

	it("update: PATCH body 직렬화", async () => {
		const fetchMock = stubFetchJson({ eventEnabled: false });
		await new NotificationSettingsDataSource().update({ eventEnabled: false });
		const [url, init] = fetchMock.mock.calls[0];
		expect(url).toBe("/api/users/me/notifications");
		expect(init?.method).toBe("PATCH");
		expect(JSON.parse(init?.body as string)).toEqual({ eventEnabled: false });
	});

	it("update: 실패 시 에러", async () => {
		stubFetchError(400, "Bad Request");
		await expect(
			new NotificationSettingsDataSource().update({}),
		).rejects.toThrow("Failed to update notification settings: 400 Bad Request");
	});
});
```

- [ ] **Step 5: Write `AnniversaryDataSource.test.ts`** (fetch 미사용 stub)

```ts
import { describe, expect, it } from "vitest";
import type { AnniversaryResponse } from "@/data/dto/anniversary-response";
import { AnniversaryDataSource } from "./AnniversaryDataSource";

describe("AnniversaryDataSource", () => {
	it("getAnniversaries: mock 데이터를 반환한다", async () => {
		const result = await new AnniversaryDataSource().getAnniversaries();
		expect(Array.isArray(result)).toBe(true);
		expect(result.length).toBeGreaterThan(0);
	});

	it("addAnniversary: 예외 없이 resolve한다 (현재 no-op stub)", async () => {
		const anniversary = { id: "a-1" } as AnniversaryResponse;
		await expect(
			new AnniversaryDataSource().addAnniversary(anniversary),
		).resolves.toBeUndefined();
	});
});
```

- [ ] **Step 6: Run datasource tests**

Run: `pnpm --filter @couple-calendar/web-next test -- src/data/apis`
Expected: PASS — 5 new test files green.

- [ ] **Step 7: Run full suite + coverage**

Run: `pnpm --filter @couple-calendar/web-next test:coverage`
Expected: PASS. Coverage report lists `src/data/parsers`, `src/data/repositories`, `src/data/apis` alongside `src/domain`. data 파일 커버리지는 높게(대부분 100%) 나와야 한다.

- [ ] **Step 8: Commit**

```bash
git add apps/web/src/data/apis/*.test.ts
git commit -m "test(web): add datasource unit tests with mocked fetch"
```

---

## Task 6: Add typecheck script + CI workflow

**Files:**
- Modify: `apps/web/package.json`
- Create: `.github/workflows/web-ci.yml`

- [ ] **Step 1: Add `typecheck` script to `apps/web/package.json`**

`scripts` 블록의 `"format"` 줄 뒤에 추가(기존 test 스크립트들은 유지):

```json
		"typecheck": "tsc --noEmit",
```

수정 후 `scripts`는 다음과 같아야 한다:

```json
	"scripts": {
		"dev": "next dev -p 3000",
		"build": "next build",
		"start": "next start -p 3000",
		"lint": "biome lint .",
		"format": "biome format --write .",
		"typecheck": "tsc --noEmit",
		"test": "vitest run",
		"test:watch": "vitest",
		"test:coverage": "vitest run --coverage"
	},
```

- [ ] **Step 2: Verify typecheck script works locally**

Run: `pnpm --filter @couple-calendar/web-next typecheck`
Expected: PASS (no output, exit 0).

> 만약 `.next` 생성 타입 부재로 실패하면(드묾), CI Step에서 typecheck 앞에 `pnpm --filter @couple-calendar/web-next exec next build`를 넣어 타입을 생성한다. 로컬에서 이미 통과하므로 기본은 build 없이 진행한다.

- [ ] **Step 3: Create `.github/workflows/web-ci.yml`**

```yaml
name: Web CI

on:
  pull_request:
    types: [opened, synchronize, reopened]
  push:
    branches: [main]

jobs:
  web-checks:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Enable corepack (pnpm)
        run: corepack enable

      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: pnpm

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Typecheck (web)
        run: pnpm --filter @couple-calendar/web-next typecheck

      - name: Lint (web)
        run: pnpm --filter @couple-calendar/web-next lint

      - name: Test (web)
        run: pnpm --filter @couple-calendar/web-next test
```

> `cache: pnpm`은 corepack로 pnpm을 활성화한 뒤 동작한다(그래서 corepack enable이 setup-node보다 먼저). pnpm 버전은 루트 `package.json`의 `packageManager: pnpm@10.24.0`에서 결정된다.

- [ ] **Step 4: Commit**

```bash
git add apps/web/package.json .github/workflows/web-ci.yml
git commit -m "ci(web): gate PRs on typecheck, lint, and test"
```

---

## Task 7: Final verification, push, PR

- [ ] **Step 1: Run all three checks locally exactly as CI will**

```bash
pnpm --filter @couple-calendar/web-next typecheck
pnpm --filter @couple-calendar/web-next lint
pnpm --filter @couple-calendar/web-next test
```
Expected: 모두 통과. test는 domain(59) + data 신규(~45) 합계가 green.

- [ ] **Step 2: Confirm frozen-lockfile install works (CI 재현)**

Run: `pnpm install --frozen-lockfile`
Expected: 성공(락파일과 일치). 실패하면 `pnpm install`로 락파일 갱신 후 커밋.

- [ ] **Step 3: Push branch**

```bash
git push -u origin feat/web-data-tests-and-ci
```

- [ ] **Step 4: Create PR (woobottle 포크 내부, GITHUB_TOKEN 비우고 keyring woobottle 계정 사용)**

```bash
GITHUB_TOKEN= gh pr create -R woobottle/couple-calendar \
  --base main --head feat/web-data-tests-and-ci \
  --title "web data 레이어 테스트 + PR CI 게이트" \
  --body "spec: docs/superpowers/specs/2026-06-06-web-data-layer-tests-and-ci-gate-design.md

- data parsers/repositories/datasources 단위 테스트(~45개)
- AnniversaryRepositoryImpl 생성자 주입으로 통일
- vitest 커버리지 대상 data 확장
- .github/workflows/web-ci.yml: PR에서 typecheck+lint+test 강제
- apps/web typecheck 스크립트 추가

🤖 Generated with [Claude Code](https://claude.com/claude-code)"
```

> PR #5가 아직 main에 머지되지 않았다면 이 브랜치는 #5 커밋을 포함한다. #5를 먼저 머지하거나, base를 #5 브랜치로 두는 것도 가능. 기본은 main 대상으로 생성하고 #5 머지 후 자동 정리되게 둔다.

---

## Self-Review (작성자 체크 결과)

- **Spec coverage:** parsers(Task2)/repositories(Task4)/datasources(Task5)/coverage 설정(Task1)/CI(Task6)/typecheck 스크립트(Task6)/fetcher 제외(기록만) 모두 태스크 존재. ✅
- **Placeholder scan:** 모든 코드 스텝에 실제 코드 포함. "적절히 처리" 류 없음. ✅
- **Type consistency:** 헬퍼 `stubFetchJson`/`stubFetchError`(Task1) → datasource 테스트(Task5)에서 동일 시그니처 사용. RepositoryImpl 생성자 주입 시그니처(Task3) → repo 테스트(Task4)에서 일치. 패키지명 `@couple-calendar/web-next` 일관. ✅
- **알려진 가정:** (1) `pnpm test -- <path>` 필터 인자 전달이 동작(vitest positional filter). 동작하지 않으면 경로 없이 전체 실행으로 대체해도 무방. (2) CI typecheck가 `.next` 없이 통과(로컬 검증됨). 실패 시 Task6 Step2 노트의 build 선행으로 대응.
