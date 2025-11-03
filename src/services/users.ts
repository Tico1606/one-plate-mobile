import { API_CONFIG } from '@/constants/api'
import { post, put } from './api'

export interface CreateUserRequest {
  email: string
  name?: string
  photoUrl?: string
  description?: string
}

export interface UpdateUserProfileRequest {
  name?: string
  photoUrl?: string
  description?: string
}

export interface UserProfile {
  id: string
  name: string
  email: string
  photoUrl?: string
  description?: string
  role: string
  createdAt: string
  updatedAt: string
}

export const usersService = {
  // Criar usuário no backend após criação no Clerk
  createUser: async (data: CreateUserRequest): Promise<UserProfile> => {
    // console.log('🔄 [USERS-SERVICE] Criando usuário no backend:', data)
    return post<UserProfile>(API_CONFIG.ENDPOINTS.USERS.CREATE, data)
  },

  // Atualizar perfil do usuário logado
  updateProfile: async (data: UpdateUserProfileRequest): Promise<UserProfile> => {
    // console.log('🔄 [USERS-SERVICE] Atualizando perfil:', data)
    return put<UserProfile>(API_CONFIG.ENDPOINTS.USERS.UPDATE, data)
  },

  // Buscar perfil do usuário logado
  getProfile: async (): Promise<UserProfile> => {
    // console.log('📥 [USERS-SERVICE] Buscando perfil do usuário')
    const { get } = await import('./api')
    const response = await get<{ user: UserProfile }>(API_CONFIG.ENDPOINTS.USERS.PROFILE)
    return response.user
  },
}
