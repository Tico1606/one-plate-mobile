import { SignUpView } from './SignUpView'
import { useSignUpPage } from './useSignUpPage'

export function SignUpPage() {
  const signUpPageData = useSignUpPage()

  return <SignUpView {...signUpPageData} />
}

export { SignUpForm } from './SignUpForm'
export { SignUpView } from './SignUpView'
export { useSignUpPage } from './useSignUpPage'
export { VerifyCodeForm } from './VerifyCodeForm'
