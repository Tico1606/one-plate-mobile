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
      const token = await AsyncStorage.getItem('auth_token')
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
    } catch (error) {
      console.error('Erro ao obter token:', error)
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Interceptor para tratar respostas e erros
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response
  },
  async (error) => {
    const originalRequest = error.config

    // Se o erro for 401 (não autorizado) e não for uma tentativa de refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        // Tentar renovar o token
        const refreshToken = await AsyncStorage.getItem('refresh_token')
        if (refreshToken) {
          const response = await axios.post(
            `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.AUTH.REFRESH}`,
            {
              refreshToken,
            },
          )

          const { accessToken } = response.data
          await AsyncStorage.setItem('auth_token', accessToken)

          // Repetir a requisição original com o novo token
          originalRequest.headers.Authorization = `Bearer ${accessToken}`
          return api(originalRequest)
        }
      } catch (refreshError) {
        // Se falhar ao renovar, limpar tokens e redirecionar para login
        await AsyncStorage.multiRemove(['auth_token', 'refresh_token'])
        // Aqui você pode adicionar lógica para redirecionar para login
        console.error('Erro ao renovar token:', refreshError)
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
  const response = await api.get<T>(url, config)
  return response.data
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
