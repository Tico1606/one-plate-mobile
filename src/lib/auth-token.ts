import AsyncStorage from '@react-native-async-storage/async-storage'

const AUTH_TOKEN_KEY = 'auth_token'

export const authToken = {
  // Salvar token no AsyncStorage
  save: async (token: string) => {
    try {
      await AsyncStorage.setItem(AUTH_TOKEN_KEY, token)
    } catch (error) {
      console.error('Erro ao salvar token:', error)
    }
  },

  // Obter token do AsyncStorage
  get: async (): Promise<string | null> => {
    try {
      return await AsyncStorage.getItem(AUTH_TOKEN_KEY)
    } catch (error) {
      console.error('Erro ao obter token:', error)
      return null
    }
  },

  // Remover token do AsyncStorage
  remove: async () => {
    try {
      await AsyncStorage.removeItem(AUTH_TOKEN_KEY)
    } catch (error) {
      console.error('Erro ao remover token:', error)
    }
  },
}
