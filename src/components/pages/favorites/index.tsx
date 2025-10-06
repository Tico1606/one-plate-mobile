import { FavoritesView } from './FavoritesView'
import { useFavoritesPage } from './useFavoritesPage'

export function FavoritesPage() {
  const favoritesPageData = useFavoritesPage()

  return <FavoritesView {...favoritesPageData} />
}

export { FavoritesView } from './FavoritesView'
export { useFavoritesPage } from './useFavoritesPage'
