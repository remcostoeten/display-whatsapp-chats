'use client'

import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import { Upload } from 'lucide-react'

export function WelcomeScreen() {
    return (
        <div className="h-full flex flex-col items-center justify-center p-4 text-center">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <Upload className="w-16 h-16 mb-6 text-zinc-400" />
                <h1 className="text-3xl font-bold mb-2">Welcome to ChatMigrate</h1>
                <p className="text-zinc-400 mb-6 max-w-md mx-auto">
                    Import your WhatsApp chats to get started. You can view, search, and analyze your conversations here.
                </p>
                <Button size="lg">
                    Import WhatsApp Chat
                </Button>
            </motion.div>
        </div>
    )
}
