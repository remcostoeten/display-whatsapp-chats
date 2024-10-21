import { lucia } from '@/core/server/auth/lucia'
import { db } from '@/core/server/db'
import { generateId } from 'lucia'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { Argon2id } from 'oslo/password'
import { authenticationSchema, isAdminEmail, users } from 'schema'

export async function login(prevState: any, formData: FormData) {
	const email = formData.get('email')
	const password = formData.get('password')
	const rememberMe = formData.get('rememberMe') === 'true'

	// validate input
	const result = authenticationSchema.safeParse({ email, password })
	if (!result.success) {
		return {
			error: 'Invalid email or password'
		}
	}

	const existingUser = await db.query.users.findFirst({
		where: (users, { eq }) => eq(users.email, email as string)
	})

	if (!existingUser) {
		return {
			error: 'Invalid email or password'
		}
	}

	const validPassword = await new Argon2id().verify(
		existingUser.hashedPassword,
		password as string
	)

	if (!validPassword) {
		return {
			error: 'Invalid email or password'
		}
	}

	const session = await lucia.createSession(existingUser.id, {})
	const sessionCookie = lucia.createSessionCookie(session.id)

	// Set session expiry if remember me is checked
	const cookieOptions = {
		...sessionCookie.attributes,
		maxAge: rememberMe ? 30 * 24 * 60 * 60 : undefined // 30 days if remember me
	}

	cookies().set(sessionCookie.name, sessionCookie.value, cookieOptions)

	redirect('/dashboard')
}

export async function signUp(prevState: any, formData: FormData) {
	const email = formData.get('email')
	const password = formData.get('password')
	const confirmPassword = formData.get('confirmPassword')

	// validate input
	const result = authenticationSchema.safeParse({ email, password })
	if (!result.success) {
		return {
			error: 'Invalid input'
		}
	}

	if (password !== confirmPassword) {
		return {
			error: 'Passwords do not match'
		}
	}

	// check if email already exists
	const existingUser = await db.query.users.findFirst({
		where: (users, { eq }) => eq(users.email, email as string)
	})

	if (existingUser) {
		return {
			error: 'Email already in use'
		}
	}

	// create user
	const userId = generateId(15)
	const hashedPassword = await new Argon2id().hash(password as string)

	const newUser = await db
		.insert(users)
		.values({
			id: userId,
			email: email as string,
			hashedPassword,
			isAdmin: isAdminEmail(email as string)
		})
		.returning()

	// create session
	const session = await lucia.createSession(userId, {})
	const sessionCookie = lucia.createSessionCookie(session.id)
	cookies().set(
		sessionCookie.name,
		sessionCookie.value,
		sessionCookie.attributes
	)

	redirect('/dashboard')
}
