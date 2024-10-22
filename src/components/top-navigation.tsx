'use client'

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { MessageSquare } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
// import AuthForm from './auth-form'

export function TopNavigation() {
    const [isSignInOpen, setIsSignInOpen] = useState(false)
    const [isSignUpOpen, setIsSignUpOpen] = useState(false)
    const pathname = usePathname()

    return (
        <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-14 max-w-screen-2xl items-center">
                <div className="mr-4 hidden md:flex">
                    <Link href="/" className="mr-6 flex items-center space-x-2">
                        <MessageSquare className="h-6 w-6" />
                        <span className="hidden font-bold sm:inline-block">
                            Chat App
                        </span>
                    </Link>
                    <nav className="flex items-center space-x-6 text-sm font-medium">
                        <Link
                            href="/dashboard"
                            className={pathname === "/dashboard" ? "text-foreground" : "text-foreground/60"}
                        >
                            Dashboard
                        </Link>
                        <Link
                            href="/chats"
                            className={pathname.startsWith("/chats") ? "text-foreground" : "text-foreground/60"}
                        >
                            Chats
                        </Link>
                    </nav>
                </div>
                <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
                    <div className="w-full flex-1 md:w-auto md:flex-none">
                        <Input
                            type="search"
                            placeholder="Search chats..."
                            className="h-9 md:w-[300px] lg:w-[400px]"
                        />
                    </div>
                    <nav className="flex items-center">
                        <Dialog open={isSignInOpen} onOpenChange={setIsSignInOpen}>
                            <DialogTrigger asChild>
                                <Button variant="ghost" className="mr-2">Sign In</Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Sign In</DialogTitle>
                                    <DialogDescription>
                                        Enter your credentials to access your account.
                                    </DialogDescription>
                                </DialogHeader>
                            </DialogContent>
                        </Dialog>
                        <Dialog open={isSignUpOpen} onOpenChange={setIsSignUpOpen}>
                            <DialogTrigger asChild>
                                <Button>Sign Up</Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Sign Up</DialogTitle>
                                    <DialogDescription>
                                        Create a new account to start chatting.
                                    </DialogDescription>
                                </DialogHeader>
                            </DialogContent>
                        </Dialog>
                    </nav>
                </div>
            </div>
        </header>
    )
}
