import { useState } from 'react'
import { Button, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import { useCategories, useRecipes } from '@/hooks'
import type { Recipe } from '@/types/api'

export function RecipeDataViewer() {
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null)
  const [showRawData, setShowRawData] = useState(false)

  const {
    data: recipes,
    loading: recipesLoading,
    error: recipesError,
    refetch: refetchRecipes,
  } = useRecipes({ limit: 20, page: 1 })

  const {
    data: categories,
    loading: categoriesLoading,
    error: categoriesError,
  } = useCategories()

  const formatRecipe = (recipe: Recipe) => {
    return {
      id: recipe.id,
      title: recipe.title,
      description: recipe.description,
      author: recipe.author,
      rating: recipe.rating,
      time: recipe.time,
      difficulty: recipe.difficulty,
      servings: recipe.servings,
      likes: recipe.likes,
      image: recipe.image,
      ingredients: recipe.ingredients?.length || 0,
      instructions: recipe.instructions?.length || 0,
      tags: recipe.tags?.length || 0,
      categoryId: recipe.categoryId,
      createdAt: recipe.createdAt,
      updatedAt: recipe.updatedAt,
    }
  }

  return (
    <ScrollView style={{ padding: 20, flex: 1 }}>
      <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 20 }}>
        📊 Visualizador de Dados do Backend
      </Text>

      {/* Controles */}
      <View style={{ marginBottom: 20, flexDirection: 'row', gap: 10 }}>
        <Button
          title={showRawData ? 'Ver Resumido' : 'Ver Raw Data'}
          onPress={() => setShowRawData(!showRawData)}
        />
        <Button title='Atualizar Dados' onPress={refetchRecipes} />
      </View>

      {/* Status das Requisições */}
      <View
        style={{
          marginBottom: 20,
          padding: 15,
          backgroundColor: '#f0f0f0',
          borderRadius: 8,
        }}
      >
        <Text style={{ fontWeight: 'bold', fontSize: 16, marginBottom: 10 }}>
          📡 Status das Requisições
        </Text>
        <Text>
          Receitas:{' '}
          {recipesLoading
            ? 'Carregando...'
            : recipesError
              ? `Erro: ${recipesError}`
              : 'Carregado'}
        </Text>
        <Text>
          Categorias:{' '}
          {categoriesLoading
            ? 'Carregando...'
            : categoriesError
              ? `Erro: ${categoriesError}`
              : 'Carregado'}
        </Text>
      </View>

      {/* Dados das Receitas */}
      {recipes && (
        <View style={{ marginBottom: 20 }}>
          <Text style={{ fontWeight: 'bold', fontSize: 16, marginBottom: 10 }}>
            🍽️ Receitas ({recipes.data?.length || 0} de {recipes.pagination?.total || 0})
          </Text>

          {recipes.pagination && (
            <Text style={{ marginBottom: 10, color: '#666' }}>
              Página {recipes.pagination.page} de {recipes.pagination.totalPages}
              (Limite: {recipes.pagination.limit})
            </Text>
          )}

          {recipes.data?.map((recipe, index) => (
            <TouchableOpacity
              key={recipe.id}
              style={{
                padding: 15,
                marginBottom: 10,
                backgroundColor: selectedRecipe?.id === recipe.id ? '#e3f2fd' : '#f9f9f9',
                borderRadius: 8,
                borderWidth: 1,
                borderColor: '#ddd',
              }}
              onPress={() =>
                setSelectedRecipe(selectedRecipe?.id === recipe.id ? null : recipe)
              }
            >
              <Text style={{ fontWeight: 'bold', fontSize: 14 }}>
                {index + 1}. {recipe.title}
              </Text>
              <Text style={{ color: '#666', fontSize: 12 }}>
                Por {recipe.author} • {recipe.rating}⭐ • {recipe.time} •{' '}
                {recipe.difficulty}
              </Text>
              {recipe.description && (
                <Text style={{ color: '#666', fontSize: 12, marginTop: 4 }}>
                  {recipe.description.substring(0, 100)}...
                </Text>
              )}
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Dados das Categorias */}
      {categories && (
        <View style={{ marginBottom: 20 }}>
          <Text style={{ fontWeight: 'bold', fontSize: 16, marginBottom: 10 }}>
            📂 Categorias ({categories.length})
          </Text>

          {categories.map((category, index) => (
            <View
              key={category.id}
              style={{
                padding: 15,
                marginBottom: 10,
                backgroundColor: '#f9f9f9',
                borderRadius: 8,
                borderWidth: 1,
                borderColor: '#ddd',
              }}
            >
              <Text style={{ fontWeight: 'bold', fontSize: 14 }}>
                {index + 1}. {category.name}
              </Text>
              <Text style={{ color: '#666', fontSize: 12 }}>
                {category.recipeCount} receitas • Cor: {category.color}
              </Text>
            </View>
          ))}
        </View>
      )}

      {/* Detalhes da Receita Selecionada */}
      {selectedRecipe && (
        <View
          style={{
            marginBottom: 20,
            padding: 15,
            backgroundColor: '#e8f5e8',
            borderRadius: 8,
          }}
        >
          <Text style={{ fontWeight: 'bold', fontSize: 16, marginBottom: 10 }}>
            🔍 Detalhes da Receita Selecionada
          </Text>

          {showRawData ? (
            <Text style={{ fontSize: 12, fontFamily: 'monospace' }}>
              {JSON.stringify(formatRecipe(selectedRecipe), null, 2)}
            </Text>
          ) : (
            <View>
              <Text>
                <Text style={{ fontWeight: 'bold' }}>ID:</Text> {selectedRecipe.id}
              </Text>
              <Text>
                <Text style={{ fontWeight: 'bold' }}>Título:</Text> {selectedRecipe.title}
              </Text>
              <Text>
                <Text style={{ fontWeight: 'bold' }}>Descrição:</Text>{' '}
                {selectedRecipe.description || 'N/A'}
              </Text>
              <Text>
                <Text style={{ fontWeight: 'bold' }}>Autor:</Text> {selectedRecipe.author}
              </Text>
              <Text>
                <Text style={{ fontWeight: 'bold' }}>Avaliação:</Text>{' '}
                {selectedRecipe.rating}⭐
              </Text>
              <Text>
                <Text style={{ fontWeight: 'bold' }}>Tempo:</Text> {selectedRecipe.time}
              </Text>
              <Text>
                <Text style={{ fontWeight: 'bold' }}>Dificuldade:</Text>{' '}
                {selectedRecipe.difficulty}
              </Text>
              <Text>
                <Text style={{ fontWeight: 'bold' }}>Porções:</Text>{' '}
                {selectedRecipe.servings}
              </Text>
              <Text>
                <Text style={{ fontWeight: 'bold' }}>Curtidas:</Text>{' '}
                {selectedRecipe.likes}
              </Text>
              <Text>
                <Text style={{ fontWeight: 'bold' }}>Ingredientes:</Text>{' '}
                {selectedRecipe.ingredients?.length || 0}
              </Text>
              <Text>
                <Text style={{ fontWeight: 'bold' }}>Instruções:</Text>{' '}
                {selectedRecipe.instructions?.length || 0}
              </Text>
              <Text>
                <Text style={{ fontWeight: 'bold' }}>Tags:</Text>{' '}
                {selectedRecipe.tags?.length || 0}
              </Text>
              <Text>
                <Text style={{ fontWeight: 'bold' }}>Categoria ID:</Text>{' '}
                {selectedRecipe.categoryId}
              </Text>
              <Text>
                <Text style={{ fontWeight: 'bold' }}>Criado em:</Text>{' '}
                {selectedRecipe.createdAt}
              </Text>
              <Text>
                <Text style={{ fontWeight: 'bold' }}>Atualizado em:</Text>{' '}
                {selectedRecipe.updatedAt}
              </Text>
            </View>
          )}
        </View>
      )}

      {/* Logs no Console */}
      <Button
        title='📝 Ver Logs Completos no Console'
        onPress={() => {
          console.log('🔍 RECIPE DATA VIEWER - Dados Completos:', {
            recipes: {
              data: recipes?.data,
              pagination: recipes?.pagination,
              loading: recipesLoading,
              error: recipesError,
            },
            categories: {
              data: categories,
              loading: categoriesLoading,
              error: categoriesError,
            },
            selectedRecipe: selectedRecipe ? formatRecipe(selectedRecipe) : null,
          })
        }}
      />
    </ScrollView>
  )
}
