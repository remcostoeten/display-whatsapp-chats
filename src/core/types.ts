export interface Message {
	id: number
	role: 'user' | 'assistant'
	content: string
	timestamp: string
	attachment?: string
}

export type ActionResult = {
	error: string | null
	success: boolean
	message?: string
	data?: Record<string, any>
}

export type UserProfile = {
	userId?: string
	firstName?: string
	lastName?: string
	username?: string
	email?: string
	dateOfBirth?: string
	occupation?: string
	bio?: string
	github?: string
	linkedin?: string
	twitter?: string
}
