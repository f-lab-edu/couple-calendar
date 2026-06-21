interface Props {
	/** 현재 끌어내린 거리(px). */
	pull: number;
	/** 새로고침 진행 중. */
	refreshing: boolean;
	/** 임계 도달(놓으면 새로고침). */
	armed: boolean;
}

/**
 * 홈 상단 pull-to-refresh 스피너. 끌어내린 거리에 따라 내려오며, 임계 도달 시
 * 진하게, 새로고침 중에는 회전한다. 안전영역(노치) 아래에 위치한다.
 */
const PullToRefreshIndicator = ({ pull, refreshing, armed }: Props) => {
	const visible = pull > 0 || refreshing;
	const opacity = refreshing ? 1 : Math.min(1, pull / 48);
	const rotation = refreshing ? 0 : pull * 3;

	return (
		<div
			aria-hidden
			className="pointer-events-none fixed inset-x-0 top-0 z-30 flex justify-center"
			style={{
				transform: `translateY(calc(env(safe-area-inset-top) + ${Math.max(0, pull - 36)}px))`,
				opacity: visible ? 1 : 0,
				transition: pull === 0 ? "opacity 200ms ease, transform 200ms ease" : "none",
			}}
		>
			<div className="mt-2 grid size-9 place-items-center rounded-full bg-white shadow-md" style={{ opacity }}>
				<span
					className={`block size-5 rounded-full border-2 border-neutral-300 ${
						refreshing ? "animate-spin border-t-neutral-700" : armed ? "border-t-neutral-700" : "border-t-neutral-400"
					}`}
					style={{ transform: refreshing ? undefined : `rotate(${rotation}deg)` }}
				/>
			</div>
		</div>
	);
};

export default PullToRefreshIndicator;
