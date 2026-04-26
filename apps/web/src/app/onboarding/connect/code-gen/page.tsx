import ChevronLeft from "@/shared/components/icon/ChevronLeft";
import CopyIcon from "@/shared/components/icon/CopyIcon";
import { useRouter } from "next/navigation";
import { Button, Card, Eyebrow, Text } from "woosign-system";

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

      <Card
        variant="default"
        fullWidth
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          borderRadius: 16,
          padding: "28px 20px",
        }}
      >
        <Eyebrow tone="brand">INVITE CODE</Eyebrow>
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

        <Button
          variant="outline"
          size="sm"
          leftIcon={<CopyIcon />}
          onPress={() => {
            /* TODO: copy */
          }}
          style={{ marginTop: 20, borderRadius: 999 }}
        >
          코드 복사
        </Button>
      </Card>

      <Card
        variant="warm"
        fullWidth
        style={{ marginTop: 20, borderRadius: 12, padding: "12px 16px" }}
      >
        <ul className="space-y-1.5">
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
      </Card>

      <div className="mt-auto pt-6">
        <Button className="w-full" size="lg" disabled>
          연결 대기 중...
        </Button>
      </div>
    </div>
  );
};

export default CodeGenPage;
