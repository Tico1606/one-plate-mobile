import { Ionicons } from '@expo/vector-icons'
import { TouchableOpacity, View } from 'react-native'

interface StarRatingProps {
  rating: number
  onRatingChange?: (rating: number) => void
  size?: number
  disabled?: boolean
  color?: string
}

export function StarRating({
  rating,
  onRatingChange,
  size = 32,
  disabled = false,
  color = '#F59E0B',
}: StarRatingProps) {
  const handlePress = (starRating: number) => {
    if (!disabled && onRatingChange) {
      onRatingChange(starRating)
    }
  }

  return (
    <View className='flex-row items-center gap-2'>
      {[1, 2, 3, 4, 5].map((star) => (
        <TouchableOpacity
          key={star}
          onPress={() => handlePress(star)}
          disabled={disabled || !onRatingChange}
          activeOpacity={0.7}
        >
          <Ionicons
            name={star <= rating ? 'star' : 'star-outline'}
            size={size}
            color={color}
          />
        </TouchableOpacity>
      ))}
    </View>
  )
}
