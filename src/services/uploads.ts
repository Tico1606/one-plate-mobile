import { API_CONFIG } from '@/constants/api'
import { authToken } from '@/lib/auth-token'
import { del } from './api'

// Tipos para upload de imagens
export interface UploadResponse {
  success: boolean
  data: {
    url: string
    publicId: string
    originalName: string
    size: number
    format: string
  }
  message: string
}

export interface UploadError {
  success: false
  message: string
  error?: string
}

// Configurações dos endpoints de upload
const UPLOAD_ENDPOINTS = {
  RECIPE_PHOTO: '/uploads/recipe-photo',
  PROFILE_PHOTO: '/uploads/profile-photo',
  DELETE_PHOTO: '/uploads/photo',
} as const

// Serviço de upload de imagens
export const uploadService = {
  /**
   * Upload de foto de receita
   * @param imageUri - URI da imagem selecionada
   * @param originalName - Nome original do arquivo (opcional)
   */
  uploadRecipePhoto: async (
    imageUri: string,
    originalName?: string,
  ): Promise<UploadResponse> => {
    try {
      console.log('📤 [UPLOAD] Iniciando upload de foto de receita:', {
        imageUri,
        originalName,
      })

      // Criar FormData
      const formData = new FormData()

      // Adicionar a imagem ao FormData
      const imageFile = {
        uri: imageUri,
        type: 'image/jpeg', // Default, será ajustado se necessário
        name: originalName || `recipe-photo-${Date.now()}.jpg`,
      } as any

      formData.append('image', imageFile)

      // Fazer upload com token de autenticação
      const url = `${API_CONFIG.BASE_URL}${UPLOAD_ENDPOINTS.RECIPE_PHOTO}`
      const token = await authToken.get()

      console.log('🌐 [UPLOAD] URL completa:', url)
      console.log('🔑 [UPLOAD] Token disponível:', token ? 'SIM' : 'NÃO')

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          // Não definir Content-Type para multipart/form-data
          // O fetch define automaticamente com boundary
        },
        body: formData,
      })

      console.log('📡 [UPLOAD] Status da resposta:', response.status)
      console.log(
        '📡 [UPLOAD] Headers da resposta:',
        Object.fromEntries(response.headers.entries()),
      )

      let result: any
      try {
        result = await response.json()
        console.log('📡 [UPLOAD] Resposta do servidor:', result)
      } catch (parseError) {
        console.error('❌ [UPLOAD] Erro ao fazer parse da resposta:', parseError)
        const textResponse = await response.text()
        console.log('📡 [UPLOAD] Resposta como texto:', textResponse)
        throw new Error(`Erro no servidor (${response.status}): ${textResponse}`)
      }

      if (!response.ok) {
        console.error('❌ [UPLOAD] Erro no upload de foto de receita:', {
          status: response.status,
          statusText: response.statusText,
          result,
        })
        throw new Error(
          result.message || `Erro no servidor: ${response.status} ${response.statusText}`,
        )
      }

      console.log('✅ [UPLOAD] Upload de foto de receita concluído:', result)
      return result
    } catch (error) {
      console.error('❌ [UPLOAD] Erro no upload de foto de receita:', error)
      throw error
    }
  },

  /**
   * Upload de foto de perfil
   * @param imageUri - URI da imagem selecionada
   * @param originalName - Nome original do arquivo (opcional)
   */
  uploadProfilePhoto: async (
    imageUri: string,
    originalName?: string,
  ): Promise<UploadResponse> => {
    try {
      console.log('📤 [UPLOAD] Iniciando upload de foto de perfil:', {
        imageUri,
        originalName,
      })

      // Criar FormData
      const formData = new FormData()

      // Adicionar a imagem ao FormData
      const imageFile = {
        uri: imageUri,
        type: 'image/jpeg', // Default, será ajustado se necessário
        name: originalName || `profile-photo-${Date.now()}.jpg`,
      } as any

      formData.append('image', imageFile)

      // Fazer upload com token de autenticação
      const url = `${API_CONFIG.BASE_URL}${UPLOAD_ENDPOINTS.PROFILE_PHOTO}`
      const token = await authToken.get()

      console.log('🌐 [UPLOAD] URL completa:', url)
      console.log('🔑 [UPLOAD] Token disponível:', token ? 'SIM' : 'NÃO')

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          // Não definir Content-Type para multipart/form-data
          // O fetch define automaticamente com boundary
        },
        body: formData,
      })

      console.log('📡 [UPLOAD] Status da resposta:', response.status)
      console.log(
        '📡 [UPLOAD] Headers da resposta:',
        Object.fromEntries(response.headers.entries()),
      )

      let result: any
      try {
        result = await response.json()
        console.log('📡 [UPLOAD] Resposta do servidor:', result)
      } catch (parseError) {
        console.error('❌ [UPLOAD] Erro ao fazer parse da resposta:', parseError)
        const textResponse = await response.text()
        console.log('📡 [UPLOAD] Resposta como texto:', textResponse)
        throw new Error(`Erro no servidor (${response.status}): ${textResponse}`)
      }

      if (!response.ok) {
        console.error('❌ [UPLOAD] Erro no upload de foto de perfil:', {
          status: response.status,
          statusText: response.statusText,
          result,
        })
        throw new Error(
          result.message || `Erro no servidor: ${response.status} ${response.statusText}`,
        )
      }

      console.log('✅ [UPLOAD] Upload de foto de perfil concluído:', result)
      return result
    } catch (error) {
      console.error('❌ [UPLOAD] Erro no upload de foto de perfil:', error)
      throw error
    }
  },

  /**
   * Deletar imagem do Cloudinary
   * @param imageUrl - URL da imagem no Cloudinary
   */
  deletePhoto: async (
    imageUrl: string,
  ): Promise<{ success: boolean; message: string }> => {
    try {
      console.log('🗑️ [UPLOAD] Deletando imagem:', imageUrl)

      const response = await del<{ success: boolean; message: string }>(
        UPLOAD_ENDPOINTS.DELETE_PHOTO,
        { url: imageUrl },
      )

      console.log('✅ [UPLOAD] Imagem deletada com sucesso:', response)
      return response
    } catch (error) {
      console.error('❌ [UPLOAD] Erro ao deletar imagem:', error)
      throw error
    }
  },

  /**
   * Utilitário para detectar o tipo de arquivo baseado na URI
   */
  getImageType: (uri: string): string => {
    const extension = uri.split('.').pop()?.toLowerCase()
    switch (extension) {
      case 'jpg':
      case 'jpeg':
        return 'image/jpeg'
      case 'png':
        return 'image/png'
      case 'webp':
        return 'image/webp'
      default:
        return 'image/jpeg' // Default
    }
  },

  /**
   * Utilitário para validar se o arquivo é uma imagem válida
   */
  isValidImageType: (uri: string): boolean => {
    const validTypes = ['jpg', 'jpeg', 'png', 'webp']
    const extension = uri.split('.').pop()?.toLowerCase()
    return validTypes.includes(extension || '')
  },

  /**
   * Utilitário para validar o tamanho do arquivo (em bytes)
   */
  isValidFileSize: (sizeInBytes: number, maxSizeInMB: number = 5): boolean => {
    const maxSizeInBytes = maxSizeInMB * 1024 * 1024
    return sizeInBytes <= maxSizeInBytes
  },
}
