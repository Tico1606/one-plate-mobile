// Teste simples para verificar endpoints de upload
import { API_CONFIG } from '@/constants/api'

export const testUploadEndpoints = () => {
  console.log('🧪 [TEST] Testando configuração de upload...')

  const baseUrl = API_CONFIG.BASE_URL
  console.log('🌐 [TEST] Base URL:', baseUrl)

  const endpoints = {
    recipePhoto: `${baseUrl}/uploads/recipe-photo`,
    profilePhoto: `${baseUrl}/uploads/profile-photo`,
    deletePhoto: `${baseUrl}/uploads/photo`,
  }

  console.log('📡 [TEST] Endpoints configurados:')
  console.log('  - Recipe Photo:', endpoints.recipePhoto)
  console.log('  - Profile Photo:', endpoints.profilePhoto)
  console.log('  - Delete Photo:', endpoints.deletePhoto)

  // Testar se as URLs estão corretas
  const expectedPattern = /^http:\/\/192\.168\.\d+\.\d+:3333\/api\/uploads\//

  Object.entries(endpoints).forEach(([name, url]) => {
    const isValid = expectedPattern.test(url)
    console.log(`✅ [TEST] ${name}: ${isValid ? 'VÁLIDO' : 'INVÁLIDO'} - ${url}`)
  })
}

// Função para testar conectividade com o backend
export const testBackendConnection = async () => {
  try {
    console.log('🔗 [TEST] Testando conexão com backend...')

    const response = await fetch(`${API_CONFIG.BASE_URL.replace('/api', '')}/health`, {
      method: 'GET',
      timeout: 5000,
    })

    if (response.ok) {
      console.log('✅ [TEST] Backend está respondendo')
      return true
    } else {
      console.log('⚠️ [TEST] Backend respondeu com status:', response.status)
      return false
    }
  } catch (error) {
    console.error('❌ [TEST] Erro ao conectar com backend:', error)
    return false
  }
}

// Função para testar endpoint de upload (sem fazer upload real)
export const testUploadEndpoint = async () => {
  try {
    console.log('📤 [TEST] Testando endpoint de upload...')

    const url = `${API_CONFIG.BASE_URL}/uploads/recipe-photo`

    // Fazer uma requisição OPTIONS para verificar se o endpoint existe
    const response = await fetch(url, {
      method: 'OPTIONS',
    })

    console.log('📡 [TEST] Resposta do endpoint:', {
      status: response.status,
      statusText: response.statusText,
      headers: Object.fromEntries(response.headers.entries()),
    })

    if (response.status === 404) {
      console.log(
        '❌ [TEST] Endpoint não encontrado - verificar se o backend está rodando',
      )
      return false
    } else if (response.status === 405) {
      console.log('✅ [TEST] Endpoint existe mas não aceita OPTIONS (normal)')
      return true
    } else {
      console.log('✅ [TEST] Endpoint está respondendo')
      return true
    }
  } catch (error) {
    console.error('❌ [TEST] Erro ao testar endpoint:', error)
    return false
  }
}

// Executar todos os testes
export const runUploadTests = async () => {
  console.log('🚀 [TEST] Iniciando testes de upload...')

  testUploadEndpoints()

  const backendOk = await testBackendConnection()
  if (backendOk) {
    await testUploadEndpoint()
  }

  console.log('🏁 [TEST] Testes concluídos')
}
