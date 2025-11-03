// Token será obtido via hook useAuth quando necessário
import AsyncStorage from '@react-native-async-storage/async-storage'
import axios, {
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosResponse,
} from 'axios'
import { API_CONFIG } from '@/constants/api'

// Instância base do axios
const api: AxiosInstance = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Interceptor para adicionar token automaticamente
api.interceptors.request.use(
  async (config) => {
    try {
      // Por enquanto, usar token do AsyncStorage até configurar Clerk corretamente
      const token = await AsyncStorage.getItem('auth_token')
      console.log('🔑 [API] Token encontrado:', token ? 'SIM' : 'NÃO')
      console.log(
        '🔑 [API] Token (primeiros 20 chars):',
        token ? `${token.substring(0, 20)}...` : 'null',
      )
      console.log('🔑 [API] URL da requisição:', config.url)
      console.log('🔑 [API] Método:', config.method?.toUpperCase())

      if (token) {
        config.headers.Authorization = `Bearer ${token}`
        console.log('🔑 [API] Authorization header adicionado')
      } else {
        console.log('⚠️ [API] Nenhum token encontrado!')
      }

      console.log('🔑 [API] Headers finais:', config.headers)
    } catch (error) {
      console.error('❌ [API] Erro ao obter token:', error)
    }
    return config
  },
  (error) => {
    console.error('❌ [API] Erro no interceptor de requisição:', error)
    return Promise.reject(error)
  },
)

// Interceptor para tratar respostas e erros
api.interceptors.response.use(
  (response: AxiosResponse) => {
    console.log('✅ [API] Resposta recebida:', {
      status: response.status,
      url: response.config.url,
      method: response.config.method?.toUpperCase(),
    })
    return response
  },
  async (error) => {
    console.log('❌ [API] Erro na resposta:', {
      status: error.response?.status,
      url: error.config?.url,
      method: error.config?.method?.toUpperCase(),
      data: error.response?.data,
    })

    const originalRequest = error.config

    // Se o erro for 401 (não autorizado) e não for uma tentativa de refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      console.log('🔄 [API] Tentando renovar token...')
      originalRequest._retry = true

      try {
        // Tentar renovar o token
        const refreshToken = await AsyncStorage.getItem('refresh_token')
        console.log('🔄 [API] Refresh token encontrado:', refreshToken ? 'SIM' : 'NÃO')

        if (refreshToken) {
          const response = await axios.post(
            `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.AUTH.REFRESH}`,
            {
              refreshToken,
            },
          )

          const { accessToken } = response.data
          console.log('🔄 [API] Novo access token recebido:', accessToken ? 'SIM' : 'NÃO')
          await AsyncStorage.setItem('auth_token', accessToken)

          // Repetir a requisição original com o novo token
          originalRequest.headers.Authorization = `Bearer ${accessToken}`
          console.log('🔄 [API] Repetindo requisição com novo token...')
          return api(originalRequest)
        }
      } catch (refreshError) {
        console.error('❌ [API] Erro ao renovar token:', refreshError)
        // Se falhar ao renovar, limpar tokens e redirecionar para login
        await AsyncStorage.multiRemove(['auth_token', 'refresh_token'])
        console.log('🧹 [API] Tokens removidos do storage')
      }
    }

    return Promise.reject(error)
  },
)

// Função para fazer requisições GET
export const get = async <T = any>(
  url: string,
  config?: AxiosRequestConfig,
): Promise<T> => {
  try {
    const response = await api.get<T>(url, config)
    return response.data
  } catch (error) {
    if (typeof error === 'object' && error !== null) {
      const err = error as { response?: any; message?: string }
      console.error('❌ Erro na API GET:', {
        url,
        error: err.response?.data || err.message,
        status: err.response?.status,
      })
    } else {
      console.error('❌ Erro na API GET:', {
        url,
        error,
      })
    }
    throw error
  }
}

// Função para fazer requisições POST
export const post = async <T = any>(
  url: string,
  data?: any,
  config?: AxiosRequestConfig,
): Promise<T> => {
  const response = await api.post<T>(url, data, config)
  return response.data
}

// Função para fazer requisições PUT
export const put = async <T = any>(
  url: string,
  data?: any,
  config?: AxiosRequestConfig,
): Promise<T> => {
  const response = await api.put<T>(url, data, config)
  return response.data
}

// Função para fazer requisições PATCH
export const patch = async <T = any>(
  url: string,
  data?: any,
  config?: AxiosRequestConfig,
): Promise<T> => {
  const response = await api.patch<T>(url, data, config)
  return response.data
}

// Função para fazer requisições DELETE
export const del = async <T = any>(
  url: string,
  config?: AxiosRequestConfig,
): Promise<T> => {
  const response = await api.delete<T>(url, config)
  return response.data
}

// Função para fazer upload de arquivos
export const upload = async <T = any>(
  url: string,
  formData: FormData,
  config?: AxiosRequestConfig,
): Promise<T> => {
  const response = await api.post<T>(url, formData, {
    ...config,
    headers: {
      'Content-Type': 'multipart/form-data',
      ...config?.headers,
    },
  })
  return response.data
}

export default api
