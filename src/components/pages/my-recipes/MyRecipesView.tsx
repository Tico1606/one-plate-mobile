import { Ionicons } from '@expo/vector-icons'
import {
  ActivityIndicator,
  Image,
  RefreshControl,
  ScrollView,
  TouchableOpacity,
} from 'react-native'
import { Header } from '@/components/global/Header'
import { SearchBar } from '@/components/global/SearchBar'
import { Box } from '@/components/ui/box'
import { Card } from '@/components/ui/card'
import { HStack } from '@/components/ui/hstack'
import { Text } from '@/components/ui/text'
import { useLocale } from '@/contexts'
import { VStack } from '@/components/ui/vstack'
import type { Recipe } from '@/types/api'

interface MyRecipesViewProps {
  // Dados
  recipes: Recipe[]
  loading: boolean
  error: string | null
  searchQuery: string
  title?: string
  searchPlaceholder?: string
  emptyStateNoResultsTitle?: string
  emptyStateNoResultsSubtitle?: string
  emptyStateNoDataTitle?: string
  emptyStateNoDataSubtitle?: string
  showAuthorName?: boolean

  // Handlers
  publishRecipe: (recipe: Recipe) => void
  deleteRecipe: (recipe: Recipe) => void
  editRecipe: (recipe: Recipe) => void
  goBack: () => void
  refreshRecipes: () => void
  setSearchQuery: (query: string) => void
}

export function MyRecipesView({
  recipes,
  loading,
  error,
  searchQuery,
  publishRecipe,
  deleteRecipe,
  editRecipe,
  goBack,
  refreshRecipes,
  setSearchQuery,
  title,
  searchPlaceholder,
  emptyStateNoResultsTitle,
  emptyStateNoResultsSubtitle,
  emptyStateNoDataTitle,
  emptyStateNoDataSubtitle,
  showAuthorName = false,
}: MyRecipesViewProps) {
  const { t } = useLocale()
  const headerTitle = title ?? t('profile.menu.my_recipes')
  const searchPlaceholderText = searchPlaceholder ?? t('my_recipes.search_placeholder')
  const noResultsTitle = emptyStateNoResultsTitle ?? t('my_recipes.empty_no_results_title')
  const noResultsSubtitle =
    emptyStateNoResultsSubtitle ?? t('my_recipes.empty_no_results_subtitle')
  const noDataTitle = emptyStateNoDataTitle ?? t('my_recipes.empty_no_data_title')
  const noDataSubtitle = emptyStateNoDataSubtitle ?? t('my_recipes.empty_no_data_subtitle')

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PUBLISHED':
        return '#10B981' // Verde
      case 'DRAFT':
        return '#F59E0B' // Amarelo
      default:
        return '#6B7280' // Cinza
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'PUBLISHED':
        return 'Publicada'
      case 'DRAFT':
        return 'Rascunho'
      default:
        return 'Desconhecido'
    }
  }

  if (loading && recipes.length === 0) {
    return (
      <Box className='flex-1 bg-zinc-100 justify-center items-center'>
        <ActivityIndicator size='large' color='#8B5CF6' />
      <Text className='mt-4 text-gray-600'>{t('common.loading')}</Text>
      </Box>
    )
  }

  return (
    <Box className='flex-1 bg-zinc-100'>
      {/* Header */}
      <Header isLoading={loading} onNotificationPress={() => {}} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={refreshRecipes}
            colors={['#8B5CF6']}
            tintColor='#8B5CF6'
          />
        }
      >
        {/* Header da página */}
        <VStack className=''>
          <HStack className='items-center justify-between px-6 mb-4'>
            <HStack className='items-center space-x-3 gap-2'>
              <TouchableOpacity onPress={goBack}>
                <Ionicons name='arrow-back' size={24} color='#374151' />
              </TouchableOpacity>
              <Text className='text-2xl font-bold text-gray-900'>{headerTitle}</Text>
            </HStack>
            <Text className='text-sm text-gray-600'>{recipes.length} receitas</Text>
          </HStack>

          {/* Search Bar */}
          <Box className='mb-4'>
            <SearchBar
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder={searchPlaceholderText}
              onSearchPress={() => {}}
            />
          </Box>

          {/* Erro */}
          {error && (
            <Box className='bg-red-50 border border-red-200 rounded-lg p-4 px-6 mb-4'>
              <HStack className='items-center space-x-2 gap-2'>
                <Ionicons name='alert-circle' size={20} color='#EF4444' />
                <Text className='text-red-700 flex-1'>{error}</Text>
                <TouchableOpacity onPress={refreshRecipes}>
                  <Text className='text-red-600 font-medium'>Tentar novamente</Text>
                </TouchableOpacity>
              </HStack>
            </Box>
          )}

          {/* Lista de receitas */}
          <VStack className='space-y-4 px-6 gap-4'>
            {recipes.length === 0 ? (
              <Box className='items-center py-12'>
                <Ionicons name='restaurant-outline' size={64} color='#9CA3AF' />
                <Text className='mt-4 text-gray-500 text-center text-lg'>
                  {searchQuery.trim()
                    ? noResultsTitle
                    : noDataTitle}
                </Text>
                <Text className='text-sm text-gray-400 text-center mt-2'>
                  {searchQuery.trim()
                    ? noResultsSubtitle
                    : noDataSubtitle}
                </Text>
              </Box>
            ) : (
              recipes.map((recipe) => (
                <Card key={recipe.id} className='overflow-hidden'>
                  <HStack className='space-x-4 gap-4'>
                    {/* Imagem da receita */}
                    <Image
                      source={{ uri: recipe.image }}
                      className='w-24 h-24 rounded-lg border border-gray-200'
                      resizeMode='cover'
                    />

                    {/* Informações da receita */}
                    <VStack className='flex-1 py-4 space-y-2 gap-2'>
                      {/* Título e status */}
                      <HStack className='justify-between items-start'>
                        <VStack className='flex-1 space-y-1 gap-1'>
                          <Text
                            className='font-semibold text-gray-900 text-xl'
                            numberOfLines={2}
                          >
                            {recipe.title}
                          </Text>
                          {showAuthorName && (
                            <Text className='text-sm text-gray-500' numberOfLines={1}>
                              {recipe.author?.name || t('common.unknown_author')}
                            </Text>
                          )}
                          <HStack className='items-center space-x-2 gap-2'>
                            <Box
                              className='px-2 py-1 rounded-full'
                              style={{
                                backgroundColor: `${getStatusColor(recipe.status)}20`,
                              }}
                            >
                              <Text
                                className='text-sm font-medium'
                                style={{ color: getStatusColor(recipe.status) }}
                              >
                                {getStatusLabel(recipe.status)}
                              </Text>
                            </Box>
                            <Text className='text-sm text-gray-500'>
                              {new Date(recipe.createdAt).toLocaleDateString()}
                            </Text>
                          </HStack>
                        </VStack>
                      </HStack>
                    </VStack>
                  </HStack>

                  {/* Botões de ação */}
                  <HStack className='p-2 space-x-2 gap-2'>
                    {recipe.status === 'DRAFT' && (
                      <TouchableOpacity
                        onPress={() => publishRecipe(recipe)}
                        className='flex-1 bg-purple-500 py-2 px-3 rounded-lg'
                        activeOpacity={0.7}
                      >
                        <HStack className='items-center justify-center space-x-1 gap-1'>
                          <Ionicons name='send' size={14} color='white' />
                          <Text className='text-white font-medium'>Publicar</Text>
                        </HStack>
                      </TouchableOpacity>
                    )}

                    <TouchableOpacity
                      onPress={() => editRecipe(recipe)}
                      className={`${recipe.status === 'PUBLISHED' ? 'flex-1' : 'flex-1'} border border-purple-500 py-2 px-3 rounded-lg`}
                      activeOpacity={0.7}
                    >
                      <HStack className='items-center justify-center space-x-1 gap-1'>
                        <Ionicons name='create' size={14} color='#8B5CF6' />
                        <Text className='text-purple-500 font-medium'>Editar</Text>
                      </HStack>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => deleteRecipe(recipe)}
                      className={`${recipe.status === 'PUBLISHED' ? 'flex-1' : ''} bg-red-500 py-2 px-3 rounded-lg`}
                      activeOpacity={0.7}
                    >
                      <HStack className='items-center justify-center space-x-1 gap-1'>
                        <Ionicons name='trash' size={14} color='white' />
                        <Text className='text-white font-medium'>Excluir</Text>
                      </HStack>
                    </TouchableOpacity>
                  </HStack>
                </Card>
              ))
            )}
          </VStack>
        </VStack>
      </ScrollView>
    </Box>
  )
}
