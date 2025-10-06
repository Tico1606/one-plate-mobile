import { EditRecipeView } from './EditRecipeView'
import { useEditRecipe } from './useEditRecipe'

export function EditRecipePage() {
  const editRecipeData = useEditRecipe()

  return <EditRecipeView {...editRecipeData} />
}

export { EditRecipeView } from './EditRecipeView'
export { useEditRecipe } from './useEditRecipe'
