import { MyRecipesView } from './MyRecipesView'
import { useMyRecipesPage } from './useMyRecipesPage'

export function MyRecipesPage() {
  const myRecipesData = useMyRecipesPage()

  return <MyRecipesView {...myRecipesData} />
}

export { MyRecipesView } from './MyRecipesView'
export { useMyRecipesPage } from './useMyRecipesPage'
