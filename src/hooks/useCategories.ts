import { useCallback, useEffect, useState } from 'react'
import { categoriesService } from '@/services/categories'
import type { Category } from '@/types/api'

export function useCategories() {
  const [data, setData] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const result = await categoriesService.getAll()
      setData(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao buscar categorias')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchCategories()
  }, [fetchCategories])

  return { data, loading, error, refetch: fetchCategories }
}
