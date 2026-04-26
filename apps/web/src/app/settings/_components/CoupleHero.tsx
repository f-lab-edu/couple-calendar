import { Text } from "woosign-system";

interface Props {
  myName: string;
  partnerName: string;
  startedAt: string;
  dPlus: number;
}

export const CoupleHero = ({ myName, partnerName, startedAt, dPlus }: Props) => (
  <div
    className="flex flex-col items-center rounded-2xl px-5 py-6"
    style={{ backgroundColor: "#f3ece1" }}
  >
    <div className="mb-3 flex items-center gap-3">
      <span
        className="flex h-12 w-12 items-center justify-center rounded-full text-2xl"
        style={{ backgroundColor: "#fbd5dc" }}
        aria-hidden
      >
        🌷
      </span>
      <span
        className="flex h-12 w-12 items-center justify-center rounded-full text-2xl"
        style={{ backgroundColor: "#cfe3c7" }}
        aria-hidden
      >
        🌿
      </span>
    </div>
    <Text
      as="p"
      variant="p"
      weight="semibold"
      style={{ lineHeight: "24px", color: "#111827" }}
    >
      {myName} <span aria-hidden>❤️</span> {partnerName}
    </Text>
    <Text
      as="p"
      variant="small"
      style={{ lineHeight: "20px", color: "#6b7280", marginTop: 4 }}
    >
      {startedAt}부터 · D+{dPlus}
    </Text>
  </div>
);
