'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

export type AuthUser = {
	id: string
	email: string
}

export default function useAuth() {
	const [user, setUser] = useState<AuthUser | null>(null)
	const [loading, setLoading] = useState(false)
	const router = useRouter()

	const signUp = async (email: string, password: string) => {
		setLoading(true)
		try {
			const response = await fetch('/api/auth/signup', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ email, password })
			})
			if (!response.ok) {
				const error = await response.text()
				throw new Error(error)
			}
			router.push('/dashboard')
		} catch (error) {
			if (error instanceof Error) {
				throw new Error(error.message)
			}
			throw new Error('An error occurred during sign up')
		} finally {
			setLoading(false)
		}
	}

	const login = async (email: string, password: string) => {
		setLoading(true)
		try {
			const response = await fetch('/api/auth/login', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ email, password })
			})
			if (!response.ok) {
				const error = await response.text()
				throw new Error(error)
			}
			router.push('/dashboard')
		} catch (error) {
			if (error instanceof Error) {
				throw new Error(error.message)
			}
			throw new Error('An error occurred during login')
		} finally {
			setLoading(false)
		}
	}

	const logout = async () => {
		setLoading(true)
		try {
			const response = await fetch('/api/auth/logout', { method: 'POST' })
			if (!response.ok) {
				const error = await response.text()
				throw new Error(error)
			}
			setUser(null)
			router.push('/authenticate')
		} catch (error) {
			if (error instanceof Error) {
				throw new Error(error.message)
			}
			throw new Error('An error occurred during logout')
		} finally {
			setLoading(false)
		}
	}

	return { user, loading, signUp, login, logout }
}
