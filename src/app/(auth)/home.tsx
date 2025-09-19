import { HomePage } from '@/components'

export default function Home() {
  const handleSearchPress = () => {
    // TODO: Implementar navegação para tela de busca
    console.log('Search pressed')
  }

  const handleFilterPress = () => {
    // TODO: Implementar filtros
    console.log('Filter pressed')
  }

  const handleNotificationPress = () => {
    // TODO: Implementar notificações
    console.log('Notification pressed')
  }

  const handleCategoryPress = (category: any) => {
    // TODO: Implementar navegação para categoria
    console.log('Category pressed:', category)
  }

  const handleRecipePress = (recipe: any) => {
    // TODO: Implementar navegação para receita
    console.log('Recipe pressed:', recipe)
  }

  const handleViewAllRecipes = () => {
    // TODO: Implementar navegação para todas as receitas
    console.log('View all recipes pressed')
  }

  const handleRecipeLike = (recipe: any) => {
    // TODO: Implementar funcionalidade de curtir
    console.log('Recipe liked:', recipe)
  }

  return (
    <HomePage
      onSearchPress={handleSearchPress}
      onFilterPress={handleFilterPress}
      onNotificationPress={handleNotificationPress}
      onCategoryPress={handleCategoryPress}
      onRecipePress={handleRecipePress}
      onViewAllRecipes={handleViewAllRecipes}
      onRecipeLike={handleRecipeLike}
    />
  )
}
