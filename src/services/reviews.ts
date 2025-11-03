import { API_CONFIG } from '@/constants/api'
import type { Review } from '@/types/api'
import { del, get, post, put } from './api'

export interface CreateReviewRequest {
  recipeId: string
  rating: number
  comment?: string
}

export interface UpdateReviewRequest {
  rating?: number
  comment?: string
}

export interface CreateReviewResponse {
  review: Review
  message: string
}

export interface UpdateReviewResponse {
  review: Review
  message: string
}

export interface DeleteReviewResponse {
  message: string
}

export const reviewsService = {
  // Criar avaliação
  create: async (data: CreateReviewRequest): Promise<CreateReviewResponse> => {
    return post<CreateReviewResponse>(API_CONFIG.ENDPOINTS.REVIEWS.CREATE, data)
  },

  // Atualizar avaliação
  update: async (
    reviewId: string,
    data: UpdateReviewRequest,
  ): Promise<UpdateReviewResponse> => {
    const url = API_CONFIG.ENDPOINTS.REVIEWS.UPDATE.replace(':id', reviewId)
    return put<UpdateReviewResponse>(url, data)
  },

  // Deletar avaliação
  delete: async (reviewId: string): Promise<DeleteReviewResponse> => {
    const url = API_CONFIG.ENDPOINTS.REVIEWS.DELETE.replace(':id', reviewId)
    return del<DeleteReviewResponse>(url)
  },

  // Listar avaliações de uma receita
  list: async (recipeId: string): Promise<{ reviews: Review[] }> => {
    const url = API_CONFIG.ENDPOINTS.REVIEWS.LIST.replace(':recipeId', recipeId)
    return get<{ reviews: Review[] }>(url)
  },
}
