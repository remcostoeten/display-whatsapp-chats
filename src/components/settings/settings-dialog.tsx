import {
	Button,
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from 'ui'
import { useSettingsStore } from '@/core/store/settings-store'
import { Settings } from 'lucide-react'
export function SettingsDialog() {
	const { messagesPerPage, setMessagesPerPage } = useSettingsStore()

	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button variant="ghost" size="sm" className="w-9 px-0">
					<Settings className="h-5 w-5" />
					<span className="sr-only">Open settings</span>
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Settings</DialogTitle>
					<DialogDescription>
						Configure your chat application preferences. These
						settings will be saved automatically.
					</DialogDescription>
				</DialogHeader>
				<div className="grid gap-4 py-4">
					<div className="grid grid-cols-4 items-center gap-4">
						<label
							htmlFor="messages-per-page"
							className="text-sm font-medium col-span-2"
						>
							Messages per page
						</label>
						<Select
							value={messagesPerPage.toString()}
							onValueChange={value =>
								setMessagesPerPage(parseInt(value, 10))
							}
						>
							<SelectTrigger className="col-span-2">
								<SelectValue placeholder="Select amount" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="10">10 messages</SelectItem>
								<SelectItem value="20">20 messages</SelectItem>
								<SelectItem value="30">30 messages</SelectItem>
								<SelectItem value="50">50 messages</SelectItem>
								<SelectItem value="100">
									100 messages
								</SelectItem>
							</SelectContent>
						</Select>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	)
}
