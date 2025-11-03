import { ShoppingListView } from '@/components/pages/shopping-list/ShoppingListView'
import { useShoppingListPage } from '@/components/pages/shopping-list/useShoppingListPage'

export default function ShoppingListScreen() {
  const shoppingListPage = useShoppingListPage()

  return <ShoppingListView {...shoppingListPage} />
}
