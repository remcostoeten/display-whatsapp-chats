'use client'

import { Button } from 'ui'
import { Star } from 'lucide-react'
import { useEffect, useState } from 'react'
import {
	addFavorite,
	isFavorite,
	removeFavorite
} from './actions/favorite-action'
interface FavoriteButtonProps {
	messageId: number
}

export default function FavoriteButton({ messageId }: FavoriteButtonProps) {
	const [isFavorited, setIsFavorited] = useState(false)

	useEffect(() => {
		const checkFavorite = async () => {
			const favorited = await isFavorite(messageId)
			setIsFavorited(favorited)
		}
		checkFavorite()
	}, [messageId])

	const handleToggleFavorite = async () => {
		try {
			if (isFavorited) {
				await removeFavorite(messageId)
			} else {
				await addFavorite(messageId)
			}
			setIsFavorited(!isFavorited)
		} catch (error) {
			console.error('Error toggling favorite:', error)
		}
	}

	return (
		<Button
			variant="ghost"
			size="icon"
			onClick={handleToggleFavorite}
			className={
				isFavorited ? 'text-yellow-500' : 'text-muted-foreground'
			}
		>
			<Star className="h-4 w-4" />
		</Button>
	)
}
