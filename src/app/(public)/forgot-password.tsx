import { ForgotPasswordView, useForgotPassword } from '@/components/pages/forgot-password'

export default function ForgotPassword() {
  const {
    isLoading,
    currentStep,
    userEmail,
    onSendCode,
    onVerifyCode,
    onResetPassword,
    onResendCode,
    onNavigateBack,
  } = useForgotPassword()

  return (
    <ForgotPasswordView
      isLoading={isLoading}
      currentStep={currentStep}
      userEmail={userEmail}
      onSendCode={onSendCode}
      onVerifyCode={onVerifyCode}
      onResetPassword={onResetPassword}
      onResendCode={onResendCode}
      onNavigateBack={onNavigateBack}
    />
  )
}
