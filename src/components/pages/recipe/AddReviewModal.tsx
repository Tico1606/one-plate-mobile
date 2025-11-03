import { zodResolver } from '@hookform/resolvers/zod'
import React, { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { Modal, TextInput, TouchableOpacity, View } from 'react-native'

import { StarRating } from '@/components/global'
import { Button, ButtonText } from '@/components/ui/button'
import { Text } from '@/components/ui/text'
import { VStack } from '@/components/ui/vstack'
import { type CreateReviewFormData, createReviewSchema } from '@/lib/validations/review'

interface AddReviewModalProps {
  visible: boolean
  isLoading: boolean
  onClose: () => void
  onSubmit: (data: CreateReviewFormData) => Promise<void>
  recipeName?: string
  editingReview?: any
}

export function AddReviewModal({
  visible,
  isLoading,
  onClose,
  onSubmit,
  recipeName,
  editingReview,
}: AddReviewModalProps) {
  const [selectedRating, setSelectedRating] = useState(0)

  const form = useForm<CreateReviewFormData>({
    resolver: zodResolver(createReviewSchema),
    defaultValues: {
      rating: editingReview?.rating || 0,
      comment: editingReview?.comment || '',
    },
  })

  // Atualizar valores do formulário quando editingReview mudar
  React.useEffect(() => {
    if (editingReview) {
      setSelectedRating(editingReview.rating)
      form.setValue('rating', editingReview.rating)
      form.setValue('comment', editingReview.comment || '')
    } else {
      setSelectedRating(0)
      form.setValue('rating', 0)
      form.setValue('comment', '')
    }
  }, [editingReview, form])

  const handleSubmit = async (data: CreateReviewFormData) => {
    try {
      await onSubmit(data)
      // O modal será fechado automaticamente pelo hook após sucesso
    } catch (error) {
      // Em caso de erro, o modal permanece aberto para nova tentativa
      console.error('Erro ao enviar avaliação:', error)
    }
  }

  const handleClose = () => {
    form.reset()
    setSelectedRating(0)
    onClose()
  }

  const handleRatingChange = (rating: number) => {
    setSelectedRating(rating)
    form.setValue('rating', rating)
    form.clearErrors('rating')
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType='slide'
      onRequestClose={handleClose}
    >
      <View className='flex-1 justify-end bg-black/50'>
        <View className='bg-white rounded-t-3xl px-6 py-8'>
          <VStack space='lg'>
            {/* Header */}
            <View>
              <Text className='text-2xl font-bold text-gray-900 text-center'>
                {editingReview ? 'Editar Avaliação' : 'Avaliar Receita'}
              </Text>
              {recipeName && (
                <Text className='text-gray-600 text-center mt-2'>{recipeName}</Text>
              )}
            </View>

            {/* Rating */}
            <View className='items-center py-4'>
              <Text className='text-gray-700 font-medium mb-4'>
                Como você avalia esta receita?
              </Text>
              <Controller
                control={form.control}
                name='rating'
                render={({ field: { value } }) => (
                  <StarRating
                    rating={value || selectedRating}
                    onRatingChange={handleRatingChange}
                    size={48}
                  />
                )}
              />
              {form.formState.errors.rating && (
                <Text className='text-red-500 text-sm mt-2'>
                  {form.formState.errors.rating.message}
                </Text>
              )}
              {selectedRating > 0 && (
                <Text className='text-gray-500 text-sm mt-2'>
                  {selectedRating === 1 && 'Muito ruim'}
                  {selectedRating === 2 && 'Ruim'}
                  {selectedRating === 3 && 'Regular'}
                  {selectedRating === 4 && 'Bom'}
                  {selectedRating === 5 && 'Excelente'}
                </Text>
              )}
            </View>

            {/* Comment */}
            <View>
              <Text className='text-gray-700 font-medium mb-2'>
                Comentário (opcional)
              </Text>
              <Controller
                control={form.control}
                name='comment'
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    placeholder='Compartilhe sua experiência com esta receita...'
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    multiline
                    numberOfLines={4}
                    maxLength={500}
                    className='bg-gray-100 rounded-lg px-4 py-3 text-gray-900 border border-gray-200 min-h-[100px] text-base'
                    textAlignVertical='top'
                  />
                )}
              />
              {form.formState.errors.comment && (
                <Text className='text-red-500 text-sm mt-1'>
                  {form.formState.errors.comment.message}
                </Text>
              )}
              <Text className='text-gray-400 text-xs mt-1 text-right'>
                {form.watch('comment')?.length || 0}/500
              </Text>
            </View>

            {/* Actions */}
            <View className='flex-row gap-3 mt-4'>
              <TouchableOpacity
                onPress={handleClose}
                disabled={isLoading}
                className='flex-1 bg-gray-200 rounded-lg py-4 items-center'
              >
                <Text className='text-gray-700 font-semibold'>Cancelar</Text>
              </TouchableOpacity>
              <View className='flex-1'>
                <Button
                  onPress={form.handleSubmit(handleSubmit)}
                  isDisabled={isLoading || selectedRating === 0}
                  className='flex-1 bg-purple-500 rounded-lg'
                >
                  <ButtonText className='text-white font-semibold'>
                    {isLoading
                      ? 'Salvando...'
                      : editingReview
                        ? 'Salvar Alterações'
                        : 'Enviar Avaliação'}
                  </ButtonText>
                </Button>
              </View>
            </View>
          </VStack>
        </View>
      </View>
    </Modal>
  )
}
