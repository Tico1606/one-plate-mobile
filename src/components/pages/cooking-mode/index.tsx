import { CookingModeView } from './CookingModeView'
import { useCookingMode } from './useCookingMode'

export function CookingModePage() {
  const cookingModeData = useCookingMode()

  return <CookingModeView {...cookingModeData} />
}

export { CookingModeView } from './CookingModeView'
export { useCookingMode } from './useCookingMode'
