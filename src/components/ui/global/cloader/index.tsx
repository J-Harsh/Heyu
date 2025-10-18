import React, { useState, useEffect } from 'react'
import { LOADING_MESSAGES, LoadingContext } from '@/constants'

type Props = {
    context?: LoadingContext
}

const CLoader = ({ context = 'general' }: Props) => {
    const [currentMessageIndex, setCurrentMessageIndex] = useState(0)
    const [isVisible, setIsVisible] = useState(true)

    const messages = LOADING_MESSAGES[context]

    useEffect(() => {
        const interval = setInterval(() => {
            // Fade out
            setIsVisible(false)

            // Wait for fade out to complete, then change message and fade in
            setTimeout(() => {
                setCurrentMessageIndex((prev) => (prev + 1) % messages.length)
                setIsVisible(true)
            }, 300)
        }, 2000)

        return () => clearInterval(interval)
    }, [messages.length])

    return (
        <div className="h-[calc(100vh-4rem-1px)] flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
                {/* Simple spinning circle */}
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-muted border-t-primary"></div>

                {/* Animated message with fade transition */}
                <p
                    className={`text-sm text-muted-foreground text-center transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'
                        }`}
                >
                    {messages[currentMessageIndex]}
                </p>
            </div>
        </div>
    )
}

export default CLoader