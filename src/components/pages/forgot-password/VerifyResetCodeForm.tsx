import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import { TextInput } from 'react-native'

import { Button, ButtonText } from '@/components/ui/button'
import { Pressable } from '@/components/ui/pressable'
import { Text } from '@/components/ui/text'
import { VStack } from '@/components/ui/vstack'
import { type VerifyCodeFormData, verifyCodeSchema } from '@/lib/validations/auth'

interface VerifyResetCodeFormProps {
  userEmail: string
  isLoading: boolean
  onVerifyCode: (data: VerifyCodeFormData) => Promise<void>
  onResendCode: () => Promise<void>
}

export function VerifyResetCodeForm({
  userEmail,
  isLoading,
  onVerifyCode,
  onResendCode,
}: VerifyResetCodeFormProps) {
  const form = useForm<VerifyCodeFormData>({
    resolver: zodResolver(verifyCodeSchema),
    defaultValues: {
      code: '',
    },
  })

  return (
    <VStack space='md'>
      <Text className='text-gray-600 text-center mb-4'>
        Digite o código de 6 dígitos que enviamos para {userEmail}
      </Text>

      <VStack space='lg'>
        <Controller
          control={form.control}
          name='code'
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              placeholder='000000'
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              keyboardType='number-pad'
              maxLength={6}
              className='bg-white rounded-lg px-4 py-4 text-gray-900 border border-gray-200 text-center text-2xl tracking-widest'
            />
          )}
        />
        {form.formState.errors.code && (
          <Text className='text-red-500 text-sm'>
            {form.formState.errors.code.message}
          </Text>
        )}
      </VStack>

      <Button
        onPress={form.handleSubmit(onVerifyCode)}
        className='bg-purple-500 rounded-lg mt-4'
        isDisabled={isLoading}
      >
        <ButtonText className='text-white font-semibold'>
          {isLoading ? 'Verificando...' : 'Verificar código'}
        </ButtonText>
      </Button>

      <Pressable
        onPress={onResendCode}
        disabled={isLoading}
        className='items-center mt-4'
      >
        <Text className='text-purple-500 font-medium'>Reenviar código</Text>
      </Pressable>
    </VStack>
  )
}
