import { useAuth, useUser } from '@clerk/clerk-expo'
import { useRouter } from 'expo-router'
import { Alert } from 'react-native'
import { Box } from '@/components/ui/box'
import { Button, ButtonText } from '@/components/ui/button'
import { Heading } from '@/components/ui/heading'
import { Text } from '@/components/ui/text'
import { VStack } from '@/components/ui/vstack'

export default function Home() {
  const { signOut } = useAuth()
  const { user } = useUser()
  const router = useRouter()

  const handleSignOut = async () => {
    try {
      await signOut()
      router.replace('/(public)/login' as any)
    } catch (error) {
      console.error('Erro ao fazer logout:', error)
      Alert.alert('Erro', 'Não foi possível fazer logout')
    }
  }

  return (
    <Box className='flex-1 bg-white px-6 py-12'>
      <VStack space='lg' className='flex-1'>
        <VStack space='sm' className='items-center mb-8'>
          <Heading size='2xl' className='text-center'>
            Bem-vindo ao One Plate!
          </Heading>
          <Text className='text-center text-gray-600'>
            Olá, {user?.firstName || 'Usuário'}! Você está logado com sucesso.
          </Text>
        </VStack>

        <VStack space='md' className='flex-1 justify-center'>
          <Text className='text-center text-gray-700 text-lg'>
            Sua conta foi criada e você está autenticado.
          </Text>

          <Text className='text-center text-gray-600'>
            Email: {user?.emailAddresses[0]?.emailAddress}
          </Text>

          <Button onPress={handleSignOut} variant='outline' className='mt-8'>
            <ButtonText>Sair da conta</ButtonText>
          </Button>
        </VStack>
      </VStack>
    </Box>
  )
}
