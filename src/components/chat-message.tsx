'use client'

import { motion } from 'framer-motion'
import { MessageSquare, Users, Zap } from 'lucide-react'
import Image from 'next/image'

export default function DashboardLanding() {
    const features = [
        { icon: MessageSquare, title: 'Chat Anytime', description: 'Start conversations and stay connected with ease.' },
        { icon: Users, title: 'Group Discussions', description: 'Create and manage group chats for team collaboration.' },
        { icon: Zap, title: 'Instant Messaging', description: 'Experience real-time messaging with lightning-fast delivery.' },
    ]

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-8">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-center mb-12"
            >
                <h1 className="text-5xl font-bold mb-4">Welcome to Your Dashboard</h1>
                <p className="text-xl text-gray-400">Select a chat or start a new conversation</p>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="relative w-64 h-64 mb-12"
            >
                <Image
                    src="/dashboard-illustration.svg"
                    alt="Dashboard Illustration"
                    layout="fill"
                    objectFit="contain"
                />
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl"
            >
                {features.map((feature, index) => (
                    <motion.div
                        key={feature.title}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                        className="bg-zinc-900 p-6 rounded-lg border border-zinc-800 hover:border-zinc-700 transition-colors"
                    >
                        <feature.icon className="w-12 h-12 mb-4 text-blue-500" />
                        <h2 className="text-xl font-semibold mb-2">{feature.title}</h2>
                        <p className="text-gray-400">{feature.description}</p>
                    </motion.div>
                ))}
            </motion.div>
        </div>
    )
}
