import { ProfileView } from './ProfileView'
import { useProfilePage } from './useProfilePage'

export function ProfilePage() {
  const profilePageData = useProfilePage()

  return <ProfileView {...profilePageData} />
}

export { ProfileView } from './ProfileView'
export { useProfilePage } from './useProfilePage'
