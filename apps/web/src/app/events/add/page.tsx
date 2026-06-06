"use client";

import { useRouter } from "next/navigation";
import EventForm from "@/presentation/events/components/EventForm";

const EventAddPage = () => {
	const router = useRouter();

	return (
		<div className="mx-auto flex min-h-dvh w-full max-w-[420px] flex-col bg-white">
			<header className="flex items-center justify-end px-5 pt-4 pb-3">
				<button
					type="button"
					aria-label="닫기"
					onClick={() => router.back()}
					className="grid size-8 place-items-center text-2xl text-neutral-800"
				>
					×
				</button>
			</header>

			<EventForm
				onSuccess={() => router.replace("/home")}
				bodyClassName="flex flex-1 flex-col gap-7 px-5 pt-2 pb-28"
				footerClassName="sticky bottom-0 border-neutral-100 border-t bg-white px-5 py-4"
			/>
		</div>
	);
};

export default EventAddPage;
