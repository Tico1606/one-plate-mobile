import { ExploreView } from './ExploreView'
import { useExplorePage } from './useExplorePage'

export function ExplorePage() {
  const explorePageData = useExplorePage()

  return <ExploreView {...explorePageData} />
}

export { ExploreView } from './ExploreView'
export { useExplorePage } from './useExplorePage'
