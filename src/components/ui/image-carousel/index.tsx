import { Ionicons } from '@expo/vector-icons'
import { useRef, useState } from 'react'
import {
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'

interface ImageCarouselProps {
  images: string[]
  height?: number
  showIndicators?: boolean
  showNavigation?: boolean
  onImagePress?: (index: number) => void
}

const { width: screenWidth } = Dimensions.get('window')

export function ImageCarousel({
  images,
  height = 256,
  showIndicators = true,
  showNavigation = true,
  onImagePress,
}: ImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const flatListRef = useRef<FlatList>(null)

  const handleScroll = (event: any) => {
    const slideSize = event.nativeEvent.layoutMeasurement.width
    const index = event.nativeEvent.contentOffset.x / slideSize
    const roundIndex = Math.round(index)
    setCurrentIndex(roundIndex)
  }

  const goToSlide = (index: number) => {
    flatListRef.current?.scrollToIndex({ index, animated: true })
  }

  const goToPrevious = () => {
    if (currentIndex > 0) {
      goToSlide(currentIndex - 1)
    }
  }

  const goToNext = () => {
    if (currentIndex < images.length - 1) {
      goToSlide(currentIndex + 1)
    }
  }

  const renderImage = ({ item, index }: { item: string; index: number }) => (
    <TouchableOpacity
      onPress={() => onImagePress?.(index)}
      activeOpacity={0.9}
      style={[styles.imageContainer, { height }]}
    >
      <Image source={{ uri: item }} style={styles.image} resizeMode='cover' />
    </TouchableOpacity>
  )

  const renderIndicator = (index: number) => (
    <TouchableOpacity
      key={index}
      onPress={() => goToSlide(index)}
      style={[styles.indicator, currentIndex === index && styles.activeIndicator]}
    />
  )

  if (!images || images.length === 0) {
    return null
  }

  // Se há apenas uma imagem, não mostrar carrossel
  if (images.length === 1) {
    return (
      <TouchableOpacity
        onPress={() => onImagePress?.(0)}
        activeOpacity={0.9}
        style={[styles.singleImageContainer, { height }]}
      >
        <Image source={{ uri: images[0] }} style={styles.image} resizeMode='cover' />
      </TouchableOpacity>
    )
  }

  return (
    <View style={[styles.container, { height }]}>
      <FlatList
        ref={flatListRef}
        data={images}
        renderItem={renderImage}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        keyExtractor={(_, index) => index.toString()}
        getItemLayout={(_, index) => ({
          length: screenWidth,
          offset: screenWidth * index,
          index,
        })}
      />

      {/* Indicadores */}
      {showIndicators && images.length > 1 && (
        <View style={styles.indicatorsContainer}>
          {images.map((_, index) => renderIndicator(index))}
        </View>
      )}

      {/* Navegação */}
      {showNavigation && images.length > 1 && (
        <>
          {/* Botão anterior */}
          {currentIndex > 0 && (
            <TouchableOpacity
              style={[styles.navButton, styles.prevButton]}
              onPress={goToPrevious}
            >
              <Ionicons name='chevron-back' size={24} color='white' />
            </TouchableOpacity>
          )}

          {/* Botão próximo */}
          {currentIndex < images.length - 1 && (
            <TouchableOpacity
              style={[styles.navButton, styles.nextButton]}
              onPress={goToNext}
            >
              <Ionicons name='chevron-forward' size={24} color='white' />
            </TouchableOpacity>
          )}
        </>
      )}

      {/* Contador de imagens */}
      {images.length > 1 && (
        <View style={styles.imageCounter}>
          <View style={styles.counterBackground}>
            <Ionicons name='images' size={14} color='white' />
            <Text style={styles.counterText}>
              {currentIndex + 1} / {images.length}
            </Text>
          </View>
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    backgroundColor: '#f3f4f6',
  },
  singleImageContainer: {
    width: '100%',
    backgroundColor: '#f3f4f6',
  },
  imageContainer: {
    width: screenWidth,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  indicatorsContainer: {
    position: 'absolute',
    bottom: 12,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  activeIndicator: {
    backgroundColor: 'white',
    width: 20,
  },
  navButton: {
    position: 'absolute',
    top: '50%',
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    transform: [{ translateY: -20 }],
  },
  prevButton: {
    left: 12,
  },
  nextButton: {
    right: 12,
  },
  imageCounter: {
    position: 'absolute',
    top: 12,
    right: 12,
  },
  counterBackground: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  counterText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
})
