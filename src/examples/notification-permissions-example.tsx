// Exemplo de como usar o hook useNotificationPermissions
import { Ionicons } from '@expo/vector-icons'
import { TouchableOpacity } from 'react-native'
import { Box } from '@/components/ui/box'
import { HStack } from '@/components/ui/hstack'
import { Text } from '@/components/ui/text'
import { VStack } from '@/components/ui/vstack'
import { useNotificationPermissions } from '@/hooks/useNotificationPermissions'

export function NotificationPermissionsExample() {
  const { hasPermission, isChecking, error, requestPermission, checkPermissions } =
    useNotificationPermissions()

  const getStatusIcon = () => {
    if (isChecking) return 'hourglass-outline'
    if (hasPermission === true) return 'checkmark-circle'
    if (hasPermission === false) return 'close-circle'
    return 'help-circle'
  }

  const getStatusColor = () => {
    if (isChecking) return '#F59E0B'
    if (hasPermission === true) return '#10B981'
    if (hasPermission === false) return '#EF4444'
    return '#6B7280'
  }

  const getStatusText = () => {
    if (isChecking) return 'Verificando permissões...'
    if (hasPermission === true) return 'Permissões concedidas'
    if (hasPermission === false) return 'Permissões negadas'
    return 'Status desconhecido'
  }

  return (
    <Box className='p-4 bg-white rounded-lg border border-gray-200'>
      <VStack className='space-y-4'>
        {/* Status das Permissões */}
        <HStack className='items-center space-x-3'>
          <Ionicons name={getStatusIcon()} size={24} color={getStatusColor()} />
          <VStack className='flex-1'>
            <Text className='font-medium text-gray-900'>{getStatusText()}</Text>
            {error && <Text className='text-sm text-red-500'>Erro: {error}</Text>}
          </VStack>
        </HStack>

        {/* Botões de Ação */}
        <HStack className='space-x-3'>
          <TouchableOpacity
            onPress={requestPermission}
            className='flex-1 bg-purple-500 px-4 py-2 rounded-lg'
            disabled={isChecking}
          >
            <Text className='text-white font-medium text-center'>
              {isChecking ? 'Verificando...' : 'Solicitar Permissões'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={checkPermissions}
            className='flex-1 bg-gray-500 px-4 py-2 rounded-lg'
            disabled={isChecking}
          >
            <Text className='text-white font-medium text-center'>
              Verificar Novamente
            </Text>
          </TouchableOpacity>
        </HStack>

        {/* Informações Adicionais */}
        <VStack className='space-y-2'>
          <Text className='text-sm text-gray-600'>
            <Text className='font-medium'>Status:</Text>{' '}
            {hasPermission === null
              ? 'Verificando'
              : hasPermission
                ? 'Concedido'
                : 'Negado'}
          </Text>
          <Text className='text-sm text-gray-600'>
            <Text className='font-medium'>Carregando:</Text> {isChecking ? 'Sim' : 'Não'}
          </Text>
          {error && (
            <Text className='text-sm text-red-500'>
              <Text className='font-medium'>Erro:</Text> {error}
            </Text>
          )}
        </VStack>
      </VStack>
    </Box>
  )
}

// Exemplo de uso em um componente simples
export function SimplePermissionCheck() {
  const { hasPermission } = useNotificationPermissions()

  return (
    <Box className='p-2'>
      <Text className='text-sm'>
        {hasPermission === null
          ? 'Verificando permissões...'
          : hasPermission
            ? '✅ Notificações permitidas'
            : '❌ Notificações negadas'}
      </Text>
    </Box>
  )
}
