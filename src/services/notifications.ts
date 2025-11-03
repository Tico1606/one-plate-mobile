import type { Notification } from '@/types/api'
import { api } from './api'

export const notificationsService = {
  // Buscar todas as notificações do usuário
  async getAll(): Promise<Notification[]> {
    const response = await api.get('/notifications')
    return response.data
  },

  // Marcar uma notificação como lida
  async markAsRead(notificationId: string): Promise<void> {
    await api.patch(`/notifications/${notificationId}/read`)
  },

  // Marcar todas as notificações como lidas
  async markAllAsRead(): Promise<void> {
    await api.patch('/notifications/mark-all-read')
  },

  // Registrar dispositivo para push notifications
  async registerDevice(subscription: PushSubscription): Promise<void> {
    await api.post('/notifications/register-device', {
      subscription: subscription.toJSON(),
    })
  },

  // Desregistrar dispositivo
  async unregisterDevice(): Promise<void> {
    await api.delete('/notifications/register-device')
  },
}

