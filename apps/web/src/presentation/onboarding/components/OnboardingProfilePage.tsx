import { useRef, useState } from "react";
import { Button, Input, Text } from "woosign-system";
import CalendarIcon from "@/shared/components/icon/CalendarIcon";

interface Props {
	onPressNextButton: () => void;
}

const OnboardingProfilePage = ({ onPressNextButton }: Props) => {
	const [nickname, setNickname] = useState("");
	const [birthday, setBirthday] = useState("");
	const birthdayRef = useRef<HTMLInputElement>(null);

	const openBirthdayPicker = () => {
		const input = birthdayRef.current;
		if (!input) return;
		if (typeof input.showPicker === "function") {
			input.showPicker();
		} else {
			input.focus();
		}
	};

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
					<Input placeholder="닉네임" value={nickname} onChangeText={setNickname} fullWidth />
				</div>

				<div className="flex flex-col gap-1.5">
					<Text as="label" variant="small" style={{ lineHeight: "20px" }}>
						생일
					</Text>
					<div className="relative">
						<input
							ref={birthdayRef}
							type="date"
							value={birthday}
							onChange={(e) => setBirthday(e.target.value)}
							className="w-full rounded-md border border-gray-200 bg-white px-3 py-2.5 pr-10 text-base text-gray-900 outline-none transition-colors focus:border-gray-400 [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:inset-0 [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:cursor-pointer"
						/>
						<button
							type="button"
							aria-label="달력 열기"
							onClick={openBirthdayPicker}
							className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2"
						>
							<CalendarIcon />
						</button>
					</div>
				</div>
			</div>

			<div className="mt-auto pt-8">
				<Button className="w-full" size="lg" onPress={onPressNextButton}>
					다음
				</Button>
			</div>
		</div>
	);
};

export default OnboardingProfilePage;
