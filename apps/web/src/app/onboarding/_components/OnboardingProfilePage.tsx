import { useState } from "react";
import { Button, Input, Text } from "woosign-system";

interface Props {
  onPressNextButton: () => void;
}

const OnboardingProfilePage = ({ onPressNextButton }: Props) => {
  const [nickname, setNickname] = useState("");
  const [birthday, setBirthday] = useState("");

  return (
    <div className="flex flex-col min-h-[calc(100dvh-4px)] px-5 pt-6 pb-6">
      <div className="mb-6">
        <Text as="h1" variant="h1" weight="bold" style={{ lineHeight: "40px" }}>
          프로필을 알려주세요.
        </Text>
        <Text as="p" variant="muted" style={{ lineHeight: "20px", marginTop: 4 }}>
          상대방에게 보여줄 정보예요.
        </Text>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <Text as="label" variant="small" style={{ lineHeight: "20px" }}>
            닉네임
          </Text>
          <Input
            placeholder="닉네임"
            value={nickname}
            onChangeText={setNickname}
            fullWidth
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Text as="label" variant="small" style={{ lineHeight: "20px" }}>
            생일
          </Text>
          <input
            type="date"
            value={birthday}
            onChange={(e) => setBirthday(e.target.value)}
            className="w-full rounded-md border border-gray-200 bg-white px-3 py-2.5 text-base text-gray-900 outline-none transition-colors focus:border-gray-400"
          />
        </div>
      </div>

      <div className="mt-auto pt-8">
        <Button
          className="w-full"
          size="lg"
          onPress={onPressNextButton}
        >
          다음
        </Button>
      </div>
    </div>
  );
};

export default OnboardingProfilePage;
