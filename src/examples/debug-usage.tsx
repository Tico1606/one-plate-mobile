// Exemplo de como usar os componentes de debug
import { useState } from 'react'
import { Button, Modal, Text, View } from 'react-native'
import { RecipeDataViewer, TestHooks } from '@/components/debug'

export function DebugUsageExample() {
  const [showTestHooks, setShowTestHooks] = useState(false)
  const [showRecipeViewer, setShowRecipeViewer] = useState(false)

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 20 }}>
        🔧 Exemplo de Uso dos Componentes de Debug
      </Text>

      <View style={{ gap: 10 }}>
        <Button title='🔍 Testar Hooks Básicos' onPress={() => setShowTestHooks(true)} />

        <Button
          title='📊 Visualizador de Dados de Receitas'
          onPress={() => setShowRecipeViewer(true)}
        />
      </View>

      {/* Modal para TestHooks */}
      <Modal visible={showTestHooks} animationType='slide' presentationStyle='pageSheet'>
        <View style={{ flex: 1 }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: 20,
              borderBottomWidth: 1,
              borderBottomColor: '#ddd',
            }}
          >
            <Text style={{ fontSize: 18, fontWeight: 'bold' }}>🔍 Debug Hooks</Text>
            <Button title='Fechar' onPress={() => setShowTestHooks(false)} />
          </View>
          <TestHooks />
        </View>
      </Modal>

      {/* Modal para RecipeDataViewer */}
      <Modal
        visible={showRecipeViewer}
        animationType='slide'
        presentationStyle='pageSheet'
      >
        <View style={{ flex: 1 }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: 20,
              borderBottomWidth: 1,
              borderBottomColor: '#ddd',
            }}
          >
            <Text style={{ fontSize: 18, fontWeight: 'bold' }}>
              📊 Visualizador de Dados
            </Text>
            <Button title='Fechar' onPress={() => setShowRecipeViewer(false)} />
          </View>
          <RecipeDataViewer />
        </View>
      </Modal>
    </View>
  )
}

// Exemplo de como integrar o debug na HomePage
export function HomePageWithDebug() {
  const [showDebug, setShowDebug] = useState(false)

  return (
    <View style={{ flex: 1 }}>
      {/* Sua HomePage normal aqui */}
      <Text>HomePage Content</Text>

      {/* Botão de debug flutuante */}
      <View
        style={{
          position: 'absolute',
          bottom: 20,
          right: 20,
          zIndex: 1000,
        }}
      >
        <Button title='🐛 Debug' onPress={() => setShowDebug(true)} />
      </View>

      {/* Modal de debug */}
      <Modal visible={showDebug} animationType='slide' presentationStyle='pageSheet'>
        <View style={{ flex: 1 }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: 20,
              borderBottomWidth: 1,
              borderBottomColor: '#ddd',
            }}
          >
            <Text style={{ fontSize: 18, fontWeight: 'bold' }}>🐛 Debug Mode</Text>
            <Button title='Fechar' onPress={() => setShowDebug(false)} />
          </View>

          <View style={{ flex: 1 }}>
            <TestHooks />
          </View>
        </View>
      </Modal>
    </View>
  )
}
