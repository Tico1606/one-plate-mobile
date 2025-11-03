import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import { TextInput } from 'react-native'

import { Button, ButtonText } from '@/components/ui/button'
import { Text } from '@/components/ui/text'
import { VStack } from '@/components/ui/vstack'
import { type ForgotPasswordFormData, forgotPasswordSchema } from '@/lib/validations/auth'

interface ForgotPasswordFormProps {
  isLoading: boolean
  onSubmit: (data: ForgotPasswordFormData) => Promise<void>
}

export function ForgotPasswordForm({ isLoading, onSubmit }: ForgotPasswordFormProps) {
  const form = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  })

  return (
    <VStack space='md'>
      <VStack space='lg'>
        <Controller
          control={form.control}
          name='email'
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              placeholder='E-mail'
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              keyboardType='email-address'
              autoCapitalize='none'
              autoComplete='email'
              className='bg-white rounded-lg px-4 py-4 text-gray-900 border border-gray-200'
            />
          )}
        />
        {form.formState.errors.email && (
          <Text className='text-red-500 text-sm'>
            {form.formState.errors.email.message}
          </Text>
        )}
      </VStack>

      <Button
        onPress={form.handleSubmit(onSubmit)}
        className='bg-purple-500 rounded-lg mt-4'
        isDisabled={isLoading}
      >
        <ButtonText className='text-white font-semibold'>
          {isLoading ? 'Enviando...' : 'Enviar código'}
        </ButtonText>
      </Button>
    </VStack>
  )
}
