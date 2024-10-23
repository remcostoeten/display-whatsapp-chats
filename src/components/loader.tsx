export default function Loader() {
	return (
		<div className="loading">
			<svg width="64px" height="48px">
				<polyline
					points="0.157 23.954, 14 23.954, 21.843 48, 43 0, 50 24, 64 24"
					id="back"
				></polyline>
				<polyline
					points="0.157 23.954, 14 23.954, 21.843 48, 43 0, 50 24, 64 24"
					id="front"
				></polyline>
			</svg>
		</div>
	)
}

export function LoaderWithText({ text }: { text: string }) {
	return (
		<div
			className="flex flex-col h-screen
         items-center justify-center gap-2 animate-pulse"
		>
			<Loader />
			<p className="text-sm text-zinc-500">{text}</p>
		</div>
	)
}
