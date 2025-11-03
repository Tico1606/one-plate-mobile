// Teste de conectividade com o backend
import { API_CONFIG } from '@/constants/api'

export const testBackendHealth = async () => {
  try {
    console.log('🔗 [TEST] Testando conectividade com backend...')
    console.log('🌐 [TEST] Base URL:', API_CONFIG.BASE_URL)

    // Tentar acessar um endpoint simples primeiro
    const baseUrlWithoutApi = API_CONFIG.BASE_URL.replace('/api', '')
    console.log('🔗 [TEST] Testando:', `${baseUrlWithoutApi}/health`)

    const response = await fetch(`${baseUrlWithoutApi}/health`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    console.log('📡 [TEST] Status:', response.status)
    console.log('📡 [TEST] Status Text:', response.statusText)
    console.log('📡 [TEST] Headers:', Object.fromEntries(response.headers.entries()))

    if (response.ok) {
      const data = await response.text()
      console.log('✅ [TEST] Backend está funcionando!')
      console.log('📄 [TEST] Resposta:', data)
      return true
    } else {
      console.log('⚠️ [TEST] Backend respondeu com erro:', response.status)
      return false
    }
  } catch (error) {
    console.error('❌ [TEST] Erro ao conectar com backend:', error)
    return false
  }
}

export const testUploadEndpointExists = async () => {
  try {
    console.log('📤 [TEST] Testando se endpoint de upload existe...')

    const uploadUrl = `${API_CONFIG.BASE_URL}/uploads/recipe-photo`
    console.log('🌐 [TEST] URL do upload:', uploadUrl)

    // Tentar uma requisição OPTIONS para ver se o endpoint existe
    const response = await fetch(uploadUrl, {
      method: 'OPTIONS',
    })

    console.log('📡 [TEST] Status OPTIONS:', response.status)
    console.log(
      '📡 [TEST] Headers OPTIONS:',
      Object.fromEntries(response.headers.entries()),
    )

    if (response.status === 404) {
      console.log('❌ [TEST] Endpoint não encontrado!')
      console.log('💡 [TEST] Verifique se:')
      console.log('   - O backend está rodando')
      console.log('   - O IP está correto')
      console.log('   - Os endpoints de upload estão implementados')
      return false
    } else if (response.status === 405) {
      console.log('✅ [TEST] Endpoint existe (não aceita OPTIONS, normal)')
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

export const testAuthEndpoint = async () => {
  try {
    console.log('🔐 [TEST] Testando endpoint de autenticação...')

    const authUrl = `${API_CONFIG.BASE_URL}/auth/login`
    console.log('🌐 [TEST] URL de auth:', authUrl)

    // Tentar uma requisição OPTIONS
    const response = await fetch(authUrl, {
      method: 'OPTIONS',
    })

    console.log('📡 [TEST] Status auth OPTIONS:', response.status)

    if (response.status === 404) {
      console.log('❌ [TEST] Endpoint de auth não encontrado!')
      return false
    } else {
      console.log('✅ [TEST] Endpoint de auth existe')
      return true
    }
  } catch (error) {
    console.error('❌ [TEST] Erro ao testar auth:', error)
    return false
  }
}

export const runAllBackendTests = async () => {
  console.log('🚀 [TEST] Iniciando testes completos do backend...')
  console.log('=' * 50)

  const healthOk = await testBackendHealth()
  console.log('')

  if (healthOk) {
    const uploadOk = await testUploadEndpointExists()
    console.log('')

    const authOk = await testAuthEndpoint()
    console.log('')

    console.log('📊 [TEST] Resumo dos testes:')
    console.log(`  ✅ Health: ${healthOk ? 'OK' : 'FALHOU'}`)
    console.log(`  ${uploadOk ? '✅' : '❌'} Upload: ${uploadOk ? 'OK' : 'FALHOU'}`)
    console.log(`  ${authOk ? '✅' : '❌'} Auth: ${authOk ? 'OK' : 'FALHOU'}`)
  } else {
    console.log('❌ [TEST] Backend não está respondendo - verifique a conectividade')
  }

  console.log('🏁 [TEST] Testes concluídos')
}
