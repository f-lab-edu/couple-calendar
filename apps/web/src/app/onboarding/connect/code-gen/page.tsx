import { useRouter } from "next/navigation";
import { Button, Text } from "woosign-system";

const ChevronLeft = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    aria-hidden="true"
  >
    <path
      d="M15 6L9 12L15 18"
      stroke="#111827"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const CopyIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    aria-hidden="true"
  >
    <rect
      x="5"
      y="5"
      width="8"
      height="8"
      rx="1.5"
      stroke="#374151"
      strokeWidth="1.4"
    />
    <path
      d="M3 10.5V4C3 3.44772 3.44772 3 4 3H10.5"
      stroke="#374151"
      strokeWidth="1.4"
      strokeLinecap="round"
    />
  </svg>
);

const INVITE_CODE = "L9K27Q";

const formatCode = (code: string) => {
  return code.match(/.{1,2}/g)?.join(" ") ?? code;
};

const CodeGenPage = () => {
  const router = useRouter();
  const handleClickBackButton = () => {
    router.back();
  }

  return (
    <div className="flex flex-col min-h-[100dvh] px-5 pt-3 pb-6 bg-white">
      <button
        type="button"
        aria-label="뒤로 가기"
        className="-ml-2 mb-2 flex h-10 w-10 items-center justify-center"
        onClick={handleClickBackButton}
      >
        <ChevronLeft />
      </button>

      <div className="mb-6">
        <Text
          as="h1"
          variant="h1"
          weight="bold"
          style={{ fontSize: 24, lineHeight: "32px", color: "#111827" }}
        >
          상대방에게 이 코드를 알려주세요.
        </Text>
        <Text
          as="p"
          variant="muted"
          style={{ marginTop: 6, fontSize: 14, lineHeight: "20px", color: "#6b7280" }}
        >
          24시간 동안 유효해요.
        </Text>
      </div>

      <div
        className="rounded-2xl bg-white px-5 py-7 flex flex-col items-center"
        style={{
          border: "1px solid #ececec",
          boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
        }}
      >
        <Text
          as="span"
          variant="small"
          weight="semibold"
          style={{
            fontSize: 12,
            letterSpacing: "0.18em",
            color: "#e5447a",
          }}
        >
          INVITE CODE
        </Text>
        <Text
          as="p"
          weight="bold"
          style={{
            marginTop: 12,
            fontSize: 40,
            lineHeight: "48px",
            letterSpacing: "0.04em",
            color: "#0f3a2d",
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {formatCode(INVITE_CODE)}
        </Text>

        <button
          type="button"
          className="mt-5 inline-flex items-center gap-2 rounded-full px-4 py-2 transition-colors hover:bg-gray-50"
          style={{ border: "1px solid #d1d5db", backgroundColor: "#fff" }}
        >
          <CopyIcon />
          <Text
            as="span"
            variant="small"
            weight="medium"
            style={{ fontSize: 14, color: "#374151" }}
          >
            코드 복사
          </Text>
        </button>
      </div>

      <ul
        className="mt-5 rounded-xl px-4 py-3 space-y-1.5"
        style={{ backgroundColor: "#f3efe6" }}
      >
        <li className="flex gap-2">
          <span style={{ color: "#6b7280" }}>•</span>
          <Text
            as="span"
            variant="small"
            style={{ fontSize: 13, lineHeight: "20px", color: "#4b5563" }}
          >
            상대방이 코드를 입력하면 자동으로 연결됩니다.
          </Text>
        </li>
        <li className="flex gap-2">
          <span style={{ color: "#6b7280" }}>•</span>
          <Text
            as="span"
            variant="small"
            style={{ fontSize: 13, lineHeight: "20px", color: "#4b5563" }}
          >
            코드는 다른 사람에게 노출되지 않게 주의해주세요.
          </Text>
        </li>
      </ul>

      <div className="mt-auto pt-6">
        <Button className="w-full" size="lg" disabled>
          연결 대기 중...
        </Button>
      </div>
    </div>
  );
};

export default CodeGenPage;
