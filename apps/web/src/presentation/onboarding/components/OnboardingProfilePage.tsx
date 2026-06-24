import { type CSSProperties, type ReactNode, useRef, useState } from "react";

interface Props {
	onPressNextButton: () => void;
}

const fieldLabelStyle: CSSProperties = {
	fontSize: 12,
	fontWeight: 600,
	letterSpacing: 0.6,
	textTransform: "uppercase",
	color: "var(--text-secondary)",
	marginBottom: 8,
};

const Field = ({ label, children }: { label: string; children: ReactNode }) => (
	<div>
		<div style={fieldLabelStyle}>{label}</div>
		{children}
	</div>
);

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
		<div
			className="flex flex-col"
			style={{
				minHeight: "calc(100dvh - 4px)",
				padding: "24px 24px calc(env(safe-area-inset-bottom) + 28px)",
			}}
		>
			<div
				style={{
					fontSize: 26,
					fontWeight: 600,
					letterSpacing: "var(--ls-display)",
					color: "var(--text-brand)",
					lineHeight: 1.2,
				}}
			>
				프로필을 알려주세요.
			</div>
			<div className="wb-body-sm" style={{ color: "var(--text-secondary)", marginTop: 8 }}>
				상대방에게 보여줄 정보예요.
			</div>

			<div style={{ marginTop: 32 }} className="flex flex-col">
				<Field label="닉네임">
					<input
						className="wb-input"
						placeholder="닉네임"
						value={nickname}
						onChange={(e) => setNickname(e.target.value)}
					/>
				</Field>
				<div style={{ height: 18 }} />
				<Field label="생일">
					<input
						ref={birthdayRef}
						type="date"
						className="wb-input"
						value={birthday}
						onChange={(e) => setBirthday(e.target.value)}
						onClick={openBirthdayPicker}
						style={{ colorScheme: "dark" }}
					/>
				</Field>
			</div>

			<div style={{ flex: 1 }} />

			<button
				type="button"
				onClick={onPressNextButton}
				className="wb-btn wb-btn--primary wb-btn--lg"
				style={{ width: "100%", justifyContent: "center" }}
			>
				다음
			</button>
		</div>
	);
};

export default OnboardingProfilePage;
