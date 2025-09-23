import { HomeView } from './HomeView'
import { useHomePage } from './useHomePage'

export function HomePage() {
  const homePageData = useHomePage()

  return <HomeView {...homePageData} />
}

export { HomeView } from './HomeView'
export { useHomePage } from './useHomePage'
