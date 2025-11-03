import * as ImagePicker from 'expo-image-picker'
import { useState } from 'react'
import { Alert } from 'react-native'
import { uploadService } from '@/services'

interface UseImageUploadOptions {
  aspect?: [number, number]
  quality?: number
  maxFileSizeMB?: number
  allowedTypes?: string[]
}

interface UseImageUploadReturn {
  isUploading: boolean
  uploadRecipePhoto: (uri: string, fileName?: string) => Promise<string | null>
  uploadProfilePhoto: (uri: string, fileName?: string) => Promise<string | null>
  pickImageFromGallery: () => Promise<string | null>
  takePhotoWithCamera: () => Promise<string | null>
  showImagePicker: () => Promise<string | null>
  requestPermissions: () => Promise<boolean>
}

export function useImageUpload(
  options: UseImageUploadOptions = {},
): UseImageUploadReturn {
  const {
    aspect = [4, 3],
    quality = 0.8,
    // maxFileSizeMB = 5, // TODO: Implementar validação de tamanho
    // allowedTypes = ['jpg', 'jpeg', 'png', 'webp'], // TODO: Implementar validação de tipos
  } = options

  const [isUploading, setIsUploading] = useState(false)

  const requestPermissions = async (): Promise<boolean> => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
      if (status !== 'granted') {
        Alert.alert(
          'Permissão necessária',
          'Precisamos de permissão para acessar suas fotos para fazer upload das imagens.',
        )
        return false
      }
      return true
    } catch (error) {
      console.error('Erro ao solicitar permissões:', error)
      return false
    }
  }

  const requestCameraPermissions = async (): Promise<boolean> => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync()
      if (status !== 'granted') {
        Alert.alert(
          'Permissão necessária',
          'Precisamos de permissão para acessar sua câmera para tirar fotos.',
        )
        return false
      }
      return true
    } catch (error) {
      console.error('Erro ao solicitar permissões da câmera:', error)
      return false
    }
  }

  const uploadRecipePhoto = async (
    uri: string,
    fileName?: string,
  ): Promise<string | null> => {
    try {
      setIsUploading(true)

      // Validar tipo de arquivo
      if (!uploadService.isValidImageType(uri)) {
        Alert.alert(
          'Formato inválido',
          'Por favor, selecione uma imagem nos formatos JPG, PNG ou WEBP.',
        )
        return null
      }

      console.log('📤 Fazendo upload da foto de receita:', { uri, fileName })
      const uploadResult = await uploadService.uploadRecipePhoto(uri, fileName)

      if (uploadResult.success && uploadResult.data?.url) {
        console.log('✅ Foto de receita carregada com sucesso:', uploadResult.data.url)
        return uploadResult.data.url
      } else {
        throw new Error(uploadResult.message || 'Erro no upload')
      }
    } catch (error) {
      console.error('❌ Erro no upload da foto de receita:', error)
      Alert.alert(
        'Erro no upload',
        'Não foi possível fazer upload da imagem. Verifique sua conexão e tente novamente.',
      )
      return null
    } finally {
      setIsUploading(false)
    }
  }

  const uploadProfilePhoto = async (
    uri: string,
    fileName?: string,
  ): Promise<string | null> => {
    try {
      setIsUploading(true)

      // Validar tipo de arquivo
      if (!uploadService.isValidImageType(uri)) {
        Alert.alert(
          'Formato inválido',
          'Por favor, selecione uma imagem nos formatos JPG, PNG ou WEBP.',
        )
        return null
      }

      console.log('📤 Fazendo upload da foto de perfil:', { uri, fileName })
      const uploadResult = await uploadService.uploadProfilePhoto(uri, fileName)

      if (uploadResult.success && uploadResult.data?.url) {
        console.log('✅ Foto de perfil carregada com sucesso:', uploadResult.data.url)
        return uploadResult.data.url
      } else {
        throw new Error(uploadResult.message || 'Erro no upload')
      }
    } catch (error) {
      console.error('❌ Erro no upload da foto de perfil:', error)
      Alert.alert(
        'Erro no upload',
        'Não foi possível fazer upload da foto de perfil. Verifique sua conexão e tente novamente.',
      )
      return null
    } finally {
      setIsUploading(false)
    }
  }

  const pickImageFromGallery = async (): Promise<string | null> => {
    try {
      const hasPermission = await requestPermissions()
      if (!hasPermission) return null

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect,
        quality,
        base64: false,
      })

      if (!result.canceled && result.assets[0]) {
        return result.assets[0].uri
      }
      return null
    } catch (error) {
      console.error('Erro ao selecionar imagem:', error)
      Alert.alert('Erro', 'Não foi possível selecionar a imagem.')
      return null
    }
  }

  const takePhotoWithCamera = async (): Promise<string | null> => {
    try {
      const hasPermission = await requestCameraPermissions()
      if (!hasPermission) return null

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect,
        quality,
      })

      if (!result.canceled && result.assets[0]) {
        return result.assets[0].uri
      }
      return null
    } catch (error) {
      console.error('Erro ao tirar foto:', error)
      Alert.alert('Erro', 'Não foi possível tirar a foto.')
      return null
    }
  }

  const showImagePicker = async (): Promise<string | null> => {
    return new Promise((resolve) => {
      Alert.alert('Selecionar imagem', 'Como você gostaria de adicionar a imagem?', [
        {
          text: 'Galeria',
          onPress: async () => {
            const uri = await pickImageFromGallery()
            resolve(uri)
          },
        },
        {
          text: 'Câmera',
          onPress: async () => {
            const uri = await takePhotoWithCamera()
            resolve(uri)
          },
        },
        {
          text: 'Cancelar',
          style: 'cancel',
          onPress: () => resolve(null),
        },
      ])
    })
  }

  return {
    isUploading,
    uploadRecipePhoto,
    uploadProfilePhoto,
    pickImageFromGallery,
    takePhotoWithCamera,
    showImagePicker,
    requestPermissions,
  }
}
