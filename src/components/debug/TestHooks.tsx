import { Button, Text, View } from 'react-native'
import { useCategories, useRecentRecipes } from '@/hooks'

export function TestHooks() {
  const {
    data: categories,
    loading: categoriesLoading,
    error: categoriesError,
  } = useCategories()
  const {
    data: recentRecipes,
    loading: recentLoading,
    error: recentError,
  } = useRecentRecipes(5)

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 20 }}>
        🔍 Debug Hooks
      </Text>

      <View style={{ marginBottom: 20 }}>
        <Text style={{ fontWeight: 'bold' }}>Categorias:</Text>
        <Text>Loading: {categoriesLoading ? 'Sim' : 'Não'}</Text>
        <Text>Error: {categoriesError || 'Nenhum'}</Text>
        <Text>Data: {JSON.stringify(categories, null, 2)}</Text>
      </View>

      <View style={{ marginBottom: 20 }}>
        <Text style={{ fontWeight: 'bold' }}>Receitas Recentes:</Text>
        <Text>Loading: {recentLoading ? 'Sim' : 'Não'}</Text>
        <Text>Error: {recentError || 'Nenhum'}</Text>
        <Text>Data: {JSON.stringify(recentRecipes, null, 2)}</Text>
      </View>

      <Button
        title='Ver Logs no Console'
        onPress={() => {
          console.log('🔍 MANUAL DEBUG:', {
            categories: {
              data: categories,
              loading: categoriesLoading,
              error: categoriesError,
            },
            recentRecipes: {
              data: recentRecipes,
              loading: recentLoading,
              error: recentError,
            },
          })
        }}
      />
    </View>
  )
}
