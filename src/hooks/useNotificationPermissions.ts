import { useCallback, useEffect, useState } from 'react'
import { notificationService } from '@/services/notificationsService'

export function useNotificationPermissions() {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null)
  const [isChecking, setIsChecking] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const checkPermissions = useCallback(async () => {
    try {
      setIsChecking(true)
      setError(null)

      const permission = await notificationService.requestPermissions()
      setHasPermission(permission)

      console.log('🔔 Permissões de notificação:', permission ? 'Concedidas' : 'Negadas')
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Erro ao verificar permissões'
      setError(errorMessage)
      setHasPermission(false)
      console.error('❌ Erro ao verificar permissões:', errorMessage)
    } finally {
      setIsChecking(false)
    }
  }, [])

  const requestPermission = async () => {
    try {
      setIsChecking(true)
      setError(null)

      const permission = await notificationService.requestPermissions()
      setHasPermission(permission)

      return permission
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Erro ao solicitar permissões'
      setError(errorMessage)
      setHasPermission(false)
      console.error('❌ Erro ao solicitar permissões:', errorMessage)
      return false
    } finally {
      setIsChecking(false)
    }
  }

  useEffect(() => {
    checkPermissions()
  }, [checkPermissions])

  return {
    hasPermission,
    isChecking,
    error,
    requestPermission,
    checkPermissions,
  }
}
