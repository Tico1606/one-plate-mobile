import { MyRecipesView } from '@/components/pages/my-recipes'
import { useManageRecipesPage } from './useManageRecipesPage'

export function ManageRecipesPage() {
  const manageRecipesData = useManageRecipesPage()

  return <MyRecipesView {...manageRecipesData} />
}

export { useManageRecipesPage } from './useManageRecipesPage'
