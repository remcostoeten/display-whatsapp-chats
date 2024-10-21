'use client'

import useAuth from '@/core/hooks/use-auth'
import { AnimatePresence, motion } from 'framer-motion'
import { Eye, EyeOff } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import {
	Button,
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
	Checkbox,
	Input,
	Label
} from 'ui'

export default function LoginSignupForm() {
	const [isLogin, setIsLogin] = useState(true)
	const [showPassword, setShowPassword] = useState(false)
	const [showConfirmPassword, setShowConfirmPassword] = useState(false)
	const [rememberMe, setRememberMe] = useState(false)
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [confirmPassword, setConfirmPassword] = useState('')
	const [error, setError] = useState<string | null>(null)
	const { login, signUp, loading } = useAuth()

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		setError(null)

		try {
			if (isLogin) {
				await login(email, password)
			} else {
				if (password !== confirmPassword) {
					throw new Error("Passwords don't match")
				}
				await signUp(email, password)
			}
		} catch (err) {
			setError(err instanceof Error ? err.message : 'An error occurred')
		}
	}

	const toggleForm = () => {
		setIsLogin(!isLogin)
		setShowPassword(false)
		setShowConfirmPassword(false)
		setError(null)
	}

	const togglePasswordVisibility = () => {
		setShowPassword(!showPassword)
	}

	const toggleConfirmPasswordVisibility = () => {
		setShowConfirmPassword(!showConfirmPassword)
	}

	return (
		<div className="flex h-screen w-full items-center justify-center px-4 bg-black">
			<Card className="mx-auto max-w-sm overflow-hidden bg-gray-900 text-white">
				<AnimatePresence mode="wait">
					<motion.div
						key={isLogin ? 'login' : 'signup'}
						initial={{ y: 10, opacity: 0 }}
						animate={{ y: 0, opacity: 1 }}
						exit={{ y: -10, opacity: 0 }}
						transition={{ duration: 0.2 }}
					>
						<CardHeader>
							<CardTitle className="text-2xl text-white">
								{isLogin ? 'Login' : 'Sign Up'}
							</CardTitle>
							<CardDescription className="text-gray-400">
								{isLogin
									? 'Enter your email below to login to your account'
									: 'Create an account to get started'}
							</CardDescription>
						</CardHeader>
						<CardContent>
							<form
								onSubmit={handleSubmit}
								className="grid gap-4"
							>
								{error && (
									<div className="text-sm text-red-500">
										{error}
									</div>
								)}
								<div className="grid gap-2">
									<Label
										htmlFor="email"
										className="text-gray-300"
									>
										Email
									</Label>
									<Input
										id="email"
										type="email"
										value={email}
										onChange={e => setEmail(e.target.value)}
										placeholder="m@example.com"
										required
										className="bg-gray-800 text-white border-gray-700"
									/>
								</div>
								<div className="grid gap-2">
									<Label
										htmlFor="password"
										className="text-gray-300"
									>
										Password
									</Label>
									<div className="relative">
										<Input
											id="password"
											type={
												showPassword
													? 'text'
													: 'password'
											}
											value={password}
											onChange={e =>
												setPassword(e.target.value)
											}
											required
											className="bg-gray-800 text-white border-gray-700"
										/>
										<button
											type="button"
											onClick={togglePasswordVisibility}
											className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400"
										>
											{showPassword ? (
												<EyeOff className="h-4 w-4" />
											) : (
												<Eye className="h-4 w-4" />
											)}
										</button>
									</div>
								</div>
								{!isLogin && (
									<div className="grid gap-2">
										<Label
											htmlFor="confirmPassword"
											className="text-gray-300"
										>
											Confirm Password
										</Label>
										<div className="relative">
											<Input
												id="confirmPassword"
												type={
													showConfirmPassword
														? 'text'
														: 'password'
												}
												value={confirmPassword}
												onChange={e =>
													setConfirmPassword(
														e.target.value
													)
												}
												required
												className="bg-gray-800 text-white border-gray-700"
											/>
											<button
												type="button"
												onClick={
													toggleConfirmPasswordVisibility
												}
												className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400"
											>
												{showConfirmPassword ? (
													<EyeOff className="h-4 w-4" />
												) : (
													<Eye className="h-4 w-4" />
												)}
											</button>
										</div>
									</div>
								)}
								{isLogin && (
									<div className="flex items-center space-x-2">
										<Checkbox
											id="rememberMe"
											checked={rememberMe}
											onCheckedChange={checked =>
												setRememberMe(
													checked as boolean
												)
											}
											className="border-gray-600"
										/>
										<Label
											htmlFor="rememberMe"
											className="text-gray-300"
										>
											Remember me
										</Label>
									</div>
								)}
								<Button
									type="submit"
									className="w-full bg-white text-black hover:bg-gray-200"
									disabled={loading}
								>
									{loading
										? 'Loading...'
										: isLogin
											? 'Login'
											: 'Sign Up'}
								</Button>
							</form>
							<div className="mt-4 text-center text-sm text-gray-400">
								{isLogin
									? "Don't have an account? "
									: 'Already have an account? '}
								<Link
									href="#"
									onClick={toggleForm}
									className="text-white underline"
								>
									{isLogin ? 'Sign up' : 'Login'}
								</Link>
							</div>
						</CardContent>
					</motion.div>
				</AnimatePresence>
			</Card>
		</div>
	)
}
