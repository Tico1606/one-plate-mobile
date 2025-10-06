import React, { useCallback, useMemo } from 'react'
import { ScrollView, TouchableOpacity } from 'react-native'

import { Box } from '@/components/ui/box'
import { HStack } from '@/components/ui/hstack'
import { Text } from '@/components/ui/text'
import { VStack } from '@/components/ui/vstack'
import type { Category } from '@/types/api'

interface CategoryFilterProps {
  categories: Category[]
  selectedCategories: Category[]
  onCategoryPress: (category: Category) => void
  title?: string
}

// Componente otimizado com React.memo para evitar re-renderizações desnecessárias
// Só re-renderiza quando as props realmente mudarem
const CategoryFilterComponent = React.memo<CategoryFilterProps>(
  ({
    categories,
    selectedCategories,
    onCategoryPress,
    title = 'Navegar por Categoria',
  }) => {
    // useMemo para criar um Set de IDs selecionados para busca O(1) em vez de O(n)
    const selectedIds = useMemo(
      () => new Set(selectedCategories.map((cat) => cat.id)),
      [selectedCategories],
    )

    // useCallback para estabilizar o handler de cada categoria
    const handleCategoryPress = useCallback(
      (category: Category) => {
        onCategoryPress(category)
      },
      [onCategoryPress],
    )

    return (
      <VStack className='px-6 mb-4'>
        <Text className='text-xl font-bold text-gray-900 mb-4'>{title}</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <HStack className='space-x-4 pt-4 gap-6'>
            {/* Categorias */}
            {categories.map((category) => {
              // Usar Set.has() para verificação O(1) em vez de Array.some() O(n)
              const isSelected = selectedIds.has(category.id)

              return (
                <TouchableOpacity
                  key={category.id}
                  className='items-center min-w-[100px]'
                  activeOpacity={1.0}
                  onPress={() => handleCategoryPress(category)}
                >
                  <Box
                    className={`w-24 h-16 rounded-lg items-center justify-center mb-2 border-2 ${
                      isSelected
                        ? 'bg-purple-100 border-purple-500'
                        : 'bg-white-100 border-purple-400'
                    }`}
                  >
                    <Text
                      className={`text-sm font-semibold text-center px-2 ${
                        isSelected ? 'text-purple-700' : 'text-purple-500'
                      }`}
                    >
                      {category.name}
                    </Text>
                  </Box>
                </TouchableOpacity>
              )
            })}
          </HStack>
        </ScrollView>
      </VStack>
    )
  },
)

// Definir displayName para facilitar debugging
CategoryFilterComponent.displayName = 'CategoryFilter'

export { CategoryFilterComponent as CategoryFilter }
