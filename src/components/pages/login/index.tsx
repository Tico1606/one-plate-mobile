import { LoginView } from './LoginView'
import { useLoginPage } from './useLoginPage'

export function LoginPage() {
  const loginPageData = useLoginPage()

  return <LoginView {...loginPageData} />
}

export { LoginForm } from './LoginForm'
export { LoginView } from './LoginView'
export { useLoginPage } from './useLoginPage'
export { VerifyCodeForm } from './VerifyCodeForm'
