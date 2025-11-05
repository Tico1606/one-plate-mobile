import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { translations, type SupportedLocale } from '@/constants/i18n'

type LocaleContextValue = {
  locale: SupportedLocale
  setLocale: (locale: SupportedLocale) => Promise<void>
  t: (key: string, fallback?: string) => string
}

const STORAGE_KEY = '@oneplate:locale'

const LocaleContext = createContext<LocaleContextValue | undefined>(undefined)

function getFromPath(obj: any, path: string): any {
  return path.split('.').reduce((acc: any, part: string) => (acc && acc[part] !== undefined ? acc[part] : undefined), obj)
}

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<SupportedLocale>('pt-BR')
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    ;(async () => {
      try {
        const saved = await AsyncStorage.getItem(STORAGE_KEY)
        if (saved === 'en' || saved === 'pt-BR') {
          setLocaleState(saved)
        }
      } catch {}
      setHydrated(true)
    })()
  }, [])

  const setLocale = useCallback(async (next: SupportedLocale) => {
    setLocaleState(next)
    try {
      await AsyncStorage.setItem(STORAGE_KEY, next)
    } catch {}
  }, [])

  const t = useCallback(
    (key: string, fallback?: string) => {
      const dict = translations[locale]
      const value = getFromPath(dict, key)
      if (typeof value === 'string') return value
      return fallback ?? key
    },
    [locale],
  )

  const value = useMemo<LocaleContextValue>(() => ({ locale, setLocale, t }), [locale, setLocale, t])

  if (!hydrated) {
    return null
  }

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
}

export function useLocale() {
  const ctx = useContext(LocaleContext)
  if (!ctx) throw new Error('useLocale must be used within LocaleProvider')
  return ctx
}

