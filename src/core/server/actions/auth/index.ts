import { lucia } from '@/core/server/auth/lucia'
import { db } from '@/core/server/db'
import {
	authenticationSchema,
	isAdminEmail,
	users
} from '@/core/server/schema/auth'
import { generateId } from 'lucia'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { Argon2id } from 'oslo/password'

type AuthState = {
	error: string | null
	success: boolean
}

export async function login(
	prevState: AuthState,
	formData: FormData
): Promise<AuthState> {
	const email = formData.get('email')
	const password = formData.get('password')
	const rememberMe = formData.get('rememberMe') === 'true'

	// validate input
	const result = authenticationSchema.safeParse({ email, password })
	if (!result.success) {
		return {
			error: 'Invalid email or password',
			success: false
		}
	}

	const existingUser = await db.query.users.findFirst({
		where: (users, { eq }) => eq(users.email, email as string)
	})

	if (!existingUser) {
		return {
			error: 'Invalid email or password',
			success: false
		}
	}

	const validPassword = await new Argon2id().verify(
		existingUser.hashedPassword,
		password as string
	)

	if (!validPassword) {
		return {
			error: 'Invalid email or password',
			success: false
		}
	}

	const session = await lucia.createSession(existingUser.id, {})
	const sessionCookie = lucia.createSessionCookie(session.id)

	const cookieOptions = {
		...sessionCookie.attributes,
		maxAge: rememberMe ? 30 * 24 * 60 * 60 : undefined
	}

	;(await cookies()).set(
		sessionCookie.name,
		sessionCookie.value,
		cookieOptions
	)

	redirect('/dashboard')
}

export async function signUp(
	prevState: AuthState,
	formData: FormData
): Promise<AuthState> {
	const email = formData.get('email')
	const password = formData.get('password')
	const confirmPassword = formData.get('confirmPassword')

	if (password !== confirmPassword) {
		return {
			error: 'Passwords do not match',
			success: false
		}
	}

	// validate input
	const result = authenticationSchema.safeParse({ email, password })
	if (!result.success) {
		return {
			error: 'Invalid input',
			success: false
		}
	}

	// check if email already exists
	const existingUser = await db.query.users.findFirst({
		where: (users, { eq }) => eq(users.email, email as string)
	})

	if (existingUser) {
		return {
			error: 'Email already in use',
			success: false
		}
	}

	const userId = generateId(15)
	const hashedPassword = await new Argon2id().hash(password as string)

	await db.insert(users).values({
		id: userId,
		email: email as string,
		hashedPassword,
		isAdmin: isAdminEmail(email as string)
	})

	const session = await lucia.createSession(userId, {})
	const sessionCookie = lucia.createSessionCookie(session.id)
	;(await cookies()).set(
		sessionCookie.name,
		sessionCookie.value,
		sessionCookie.attributes
	)

	redirect('/dashboard')
}
