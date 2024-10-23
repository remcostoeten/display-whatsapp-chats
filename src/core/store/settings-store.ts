'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface SettingsState {
	messagesPerPage: number
	setMessagesPerPage: (count: number) => void
}

export const useSettingsStore = create<SettingsState>()(
	persist(
		set => ({
			messagesPerPage: 30,
			setMessagesPerPage: count => set({ messagesPerPage: count })
		}),
		{
			name: 'settings-storage'
		}
	)
)
