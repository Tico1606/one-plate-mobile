import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { TextInput } from 'react-native'
import { Button, ButtonText } from '@/components/ui/button'
import { Text } from '@/components/ui/text'
import { VStack } from '@/components/ui/vstack'
import { type VerifyCodeFormData, verifyCodeSchema } from '@/lib/validations/auth'

interface VerifyCodeFormProps {
  userEmail: string
  isLoading: boolean
  onVerifyCode: (data: VerifyCodeFormData) => Promise<void>
  onResendCode: () => Promise<void>
}

export function VerifyCodeForm({
  userEmail,
  isLoading,
  onVerifyCode,
  onResendCode,
}: VerifyCodeFormProps) {
  const codeForm = useForm<VerifyCodeFormData>({
    resolver: zodResolver(verifyCodeSchema),
    defaultValues: {
      code: '',
    },
  })

  // Reset code form when there's an error
  useEffect(() => {
    if (codeForm.formState.errors.code) {
      setTimeout(() => {
        codeForm.reset({ code: '' })
      }, 1000) // Reset after 1 second to show the error
    }
  }, [codeForm.formState.errors.code, codeForm.reset])

  return (
    <VStack space='md'>
      {/* Code Verification Header */}
      <VStack space='sm' className='items-center mb-8'>
        <Text className='text-xl font-extrabold text-gray-900'>Verificar Código</Text>
        <Text className='font-medium text-gray-600 text-center'>
          Enviamos um código de 6 dígitos para {userEmail}
        </Text>
      </VStack>

      <VStack space='lg'>
        <Controller
          control={codeForm.control}
          name='code'
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              placeholder='000000'
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              keyboardType='numeric'
              maxLength={6}
              textAlign='center'
              className='bg-white rounded-lg px-4 py-4 text-gray-900 border border-gray-200 text-xl tracking-widest font-semibold'
            />
          )}
        />
        {codeForm.formState.errors.code && (
          <Text className='text-red-500 text-sm'>
            {codeForm.formState.errors.code.message}
          </Text>
        )}
      </VStack>

      <VStack className='py-2' space='lg'>
        <Button
          onPress={codeForm.handleSubmit(onVerifyCode)}
          className='bg-purple-500 rounded-lg'
          isDisabled={isLoading}
        >
          <ButtonText className='text-white font-semibold'>
            {isLoading ? 'Verificando...' : 'Verificar código'}
          </ButtonText>
        </Button>

        <Button
          variant='outline'
          onPress={onResendCode}
          isDisabled={isLoading}
          className='border-gray-300 rounded-lg'
        >
          <ButtonText className='text-gray-700 font-medium'>Reenviar código</ButtonText>
        </Button>
      </VStack>
    </VStack>
  )
}
