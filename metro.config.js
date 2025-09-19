const { getDefaultConfig } = require('expo/metro-config')
const { withNativeWind } = require('nativewind/metro')

const config = getDefaultConfig(__dirname)

// Configurações para resolver problemas de dependências
config.resolver.resolverMainFields = ['react-native', 'browser', 'main']
config.resolver.platforms = ['ios', 'android', 'native', 'web']

// Resolver problemas com expo-auth-session e outras dependências
config.resolver.alias = {
  'expo-auth-session': require.resolve('expo-auth-session'),
}

module.exports = withNativeWind(config, { input: './src/styles/global.css' })
