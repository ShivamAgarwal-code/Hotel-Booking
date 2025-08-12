"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import AsyncStorage from "@react-native-async-storage/async-storage"

// Language interface
interface SupportedLanguage {
  code: string
  name: string
  flag: string
}

// Default fallback languages (in case API fails)
const DEFAULT_SUPPORTED_LANGUAGES: SupportedLanguage[] = [
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "es", name: "Español", flag: "🇪🇸" },
  { code: "fr", name: "Français", flag: "🇫🇷" },
  { code: "de", name: "Deutsch", flag: "🇩🇪" },
  { code: "zh", name: "中文", flag: "🇨🇳" },
  { code: "ja", name: "日本語", flag: "🇯🇵" },
  { code: "ar", name: "العربية", flag: "🇸🇦" },
  { code: "pt", name: "Português", flag: "🇵🇹" },
  { code: "ru", name: "Русский", flag: "🇷🇺" },
  { code: "it", name: "Italiano", flag: "🇮🇹" },
]

// Google Translate API configuration
const GOOGLE_TRANSLATE_API_KEY = "AIzaSyCGX0MOwqUgNK5kHf1YkoyMLW9bf7oeCaQ"
const GOOGLE_TRANSLATE_URL = "https://translation.googleapis.com/language/translate/v2"
const GOOGLE_LANGUAGES_URL = "https://translation.googleapis.com/language/translate/v2/languages"

// Flag mapping for language codes (you can expand this as needed)
const LANGUAGE_FLAGS: Record<string, string> = {
  "en": "🇺🇸",
  "hy":"AR",
  "es": "🇪🇸", 
  "fr": "🇫🇷",
  "de": "🇩🇪",
  "zh": "🇨🇳",
  "zh-cn": "🇨🇳",
  "zh-tw": "🇹🇼",
  "ja": "🇯🇵",
  "ar": "🇸🇦",
  "pt": "🇵🇹",
  "ru": "🇷🇺",
  "it": "🇮🇹",
  "ko": "🇰🇷",
  "hi": "🇮🇳",
  "th": "🇹🇭",
  "vi": "🇻🇳",
  "tr": "🇹🇷",
  "pl": "🇵🇱",
  "nl": "🇳🇱",
  "sv": "🇸🇪",
  "da": "🇩🇰",
  "no": "🇳🇴",
  "fi": "🇫🇮",
  "he": "🇮🇱",
  "uk": "🇺🇦",
  "cs": "🇨🇿",
  "sk": "🇸🇰",
  "hu": "🇭🇺",
  "ro": "🇷🇴",
  "bg": "🇧🇬",
  "hr": "🇭🇷",
  "sr": "🇷🇸",
  "sl": "🇸🇮",
  "et": "🇪🇪",
  "lv": "🇱🇻",
  "lt": "🇱🇹",
  "mt": "🇲🇹",
  "ga": "🇮🇪",
  "cy": "🏴󠁧󠁢󠁷󠁬󠁳󠁿",
  "eu": "🏴󠁥󠁳󠁰󠁶󠁿",
  "ca": "🏴󠁥󠁳󠁣󠁴󠁿",
  "gl": "🏴󠁥󠁳󠁧󠁡󠁿",
  "is": "🇮🇸",
  "fa": "🇮🇷",
  "ur": "🇵🇰",
  "bn": "🇧🇩",
  "ta": "🇱🇰",
  "te": "🇮🇳",
  "ml": "🇮🇳",
  "kn": "🇮🇳",
  "gu": "🇮🇳",
  "pa": "🇮🇳",
  "ne": "🇳🇵",
  "si": "🇱🇰",
  "my": "🇲🇲",
  "km": "🇰🇭",
  "lo": "🇱🇦",
  "ka": "🇬🇪",
  "am": "🇪🇹",
  "sw": "🇰🇪",
  "zu": "🇿🇦",
  "af": "🇿🇦",
  "sq": "🇦🇱",
  "az": "🇦🇿",
  "be": "🇧🇾",
  "bs": "🇧🇦",
  "mk": "🇲🇰",
  "me": "🇲🇪",
  "ms": "🇲🇾",
  "id": "🇮🇩",
  "tl": "🇵🇭",
  "default": "🌐" // Default flag for unmapped languages
}

interface LanguageContextType {
  currentLanguage: string
  changeLanguage: (languageCode: string) => Promise<void>
  translateText: (text: string, targetLanguage?: string) => Promise<string>
  translateTexts: (texts: string[], targetLanguage?: string) => Promise<string[]>
  isTranslating: boolean
  isRTL: boolean
  getSupportedLanguages: () => SupportedLanguage[]
  getCurrentLanguageInfo: () => SupportedLanguage | undefined
  isLoadingLanguages: boolean
  refreshLanguages: () => Promise<void>
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

interface LanguageProviderProps {
  children: ReactNode
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState("en")
  const [supportedLanguages, setSupportedLanguages] = useState<SupportedLanguage[]>(DEFAULT_SUPPORTED_LANGUAGES)
  const [translationCache, setTranslationCache] = useState<Record<string, string>>({})
  const [isTranslating, setIsTranslating] = useState(false)
  const [isLoadingLanguages, setIsLoadingLanguages] = useState(false)

  const RTL_LANGUAGES = ["ar", "he", "fa", "ur"]

  // Function to get flag for language code
  const getLanguageFlag = (languageCode: string): string => {
    return LANGUAGE_FLAGS[languageCode.toLowerCase()] || LANGUAGE_FLAGS.default
  }

  // Function to fetch supported languages from Google Translate API
  const fetchSupportedLanguages = async (): Promise<SupportedLanguage[]> => {
    try {
      setIsLoadingLanguages(true)
      
      const response = await fetch(`${GOOGLE_LANGUAGES_URL}?target=en&key=${GOOGLE_TRANSLATE_API_KEY}`)
      
      if (!response.ok) {
        throw new Error(`Languages API error: ${response.status}`)
      }

      const data = await response.json()
      
      if (data.data && data.data.languages) {
        const formattedLanguages: SupportedLanguage[] = data.data.languages.map((lang: any) => ({
          code: lang.language,
          name: lang.name,
          flag: getLanguageFlag(lang.language)
        }))
        
        // Sort languages alphabetically by name
        formattedLanguages.sort((a, b) => a.name.localeCompare(b.name))
        
        return formattedLanguages
      } else {
        throw new Error("Invalid API response format")
      }
    } catch (error) {
      console.error("Error fetching supported languages:", error)
      // Return default languages if API fails
      return DEFAULT_SUPPORTED_LANGUAGES
    } finally {
      setIsLoadingLanguages(false)
    }
  }

  // Function to refresh languages (can be called manually)
  const refreshLanguages = async () => {
    try {
      const languages = await fetchSupportedLanguages()
      setSupportedLanguages(languages)
      
      // Cache the fetched languages
      await AsyncStorage.setItem("supportedLanguages", JSON.stringify(languages))
      await AsyncStorage.setItem("languagesFetchTime", Date.now().toString())
    } catch (error) {
      console.error("Error refreshing languages:", error)
    }
  }

  // Load saved data and fetch languages on mount
  useEffect(() => {
    const loadSavedData = async () => {
      try {
        const [savedLanguage, savedCache, savedSupportedLanguages, languagesFetchTime] = await Promise.all([
          AsyncStorage.getItem("selectedLanguage"),
          AsyncStorage.getItem("translationCache"),
          AsyncStorage.getItem("supportedLanguages"),
          AsyncStorage.getItem("languagesFetchTime"),
        ])

        // Load saved language
        if (savedLanguage) {
          setCurrentLanguage(savedLanguage)
        }

        // Load translation cache
        if (savedCache) {
          setTranslationCache(JSON.parse(savedCache))
        }

        // Load cached supported languages if they exist and are recent (less than 24 hours old)
        const now = Date.now()
        const fetchTime = languagesFetchTime ? parseInt(languagesFetchTime) : 0
        const isRecentCache = now - fetchTime < 24 * 60 * 60 * 1000 // 24 hours

        if (savedSupportedLanguages && isRecentCache) {
          setSupportedLanguages(JSON.parse(savedSupportedLanguages))
        } else {
          // Fetch fresh languages if cache is old or doesn't exist
          refreshLanguages()
        }
      } catch (error) {
        console.error("Error loading saved data:", error)
        // Fallback to fetching languages
        refreshLanguages()
      }
    }
    
    loadSavedData()
  }, [])

  // Save translation cache to AsyncStorage when it changes
  useEffect(() => {
    const saveCache = async () => {
      try {
        await AsyncStorage.setItem("translationCache", JSON.stringify(translationCache))
      } catch (error) {
        console.error("Error saving translation cache:", error)
      }
    }
    if (Object.keys(translationCache).length > 0) {
      saveCache()
    }
  }, [translationCache])

  const changeLanguage = async (languageCode: string) => {
    try {
      // Validate if the language code exists in supported languages
      const isSupported = supportedLanguages.some(lang => lang.code === languageCode)
      if (!isSupported) {
        console.warn(`Language code ${languageCode} is not supported`)
        return
      }
      
      setCurrentLanguage(languageCode)
      await AsyncStorage.setItem("selectedLanguage", languageCode)
    } catch (error) {
      console.error("Error saving language:", error)
    }
  }

  // Google Translate API function for dynamic content
  const translateText = async (text: string, targetLanguage?: string): Promise<string> => {
    const target = targetLanguage || currentLanguage

    // If target language is English or text is empty, return as is
    if (target === "en" || !text) {
      return text
    }

    // Create cache key
    const cacheKey = `${text}_${target}`

    // Check if translation is already cached
    if (translationCache[cacheKey]) {
      return translationCache[cacheKey]
    }

    try {
      setIsTranslating(true)

      const response = await fetch(`${GOOGLE_TRANSLATE_URL}?key=${GOOGLE_TRANSLATE_API_KEY}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          q: text,
          target: target,
          source: "en",
          format: "text",
        }),
      })

      if (!response.ok) {
        throw new Error(`Translation API error: ${response.status}`)
      }

      const data = await response.json()
      const translatedText = data.data.translations[0].translatedText

      // Cache the translation
      setTranslationCache((prev) => ({
        ...prev,
        [cacheKey]: translatedText,
      }))

      return translatedText
    } catch (error) {
      console.error("Translation error:", error)
      // Return original text if translation fails
      return text
    } finally {
      setIsTranslating(false)
    }
  }

  // Batch translation function for multiple texts
  const translateTexts = async (texts: string[], targetLanguage?: string): Promise<string[]> => {
    const target = targetLanguage || currentLanguage

    if (target === "en" || !texts.length) {
      return texts
    }

    // Filter out already cached translations
    const uncachedTexts = texts.filter((text) => {
      const cacheKey = `${text}_${target}`
      return !translationCache[cacheKey]
    })

    if (uncachedTexts.length === 0) {
      // All texts are cached, return cached versions
      return texts.map((text) => {
        const cacheKey = `${text}_${target}`
        return translationCache[cacheKey] || text
      })
    }

    try {
      setIsTranslating(true)

      const response = await fetch(`${GOOGLE_TRANSLATE_URL}?key=${GOOGLE_TRANSLATE_API_KEY}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          q: uncachedTexts,
          target: target,
          source: "en",
          format: "text",
        }),
      })

      if (!response.ok) {
        throw new Error(`Translation API error: ${response.status}`)
      }

      const data = await response.json()
      const translations = data.data.translations

      // Cache the new translations
      const newCache = { ...translationCache }
      uncachedTexts.forEach((text, index) => {
        const cacheKey = `${text}_${target}`
        newCache[cacheKey] = translations[index].translatedText
      })
      setTranslationCache(newCache)

      // Return all translations (cached + new)
      return texts.map((text) => {
        const cacheKey = `${text}_${target}`
        return newCache[cacheKey] || text
      })
    } catch (error) {
      console.error("Batch translation error:", error)
      // Return original texts if translation fails
      return texts
    } finally {
      setIsTranslating(false)
    }
  }

  const isRTL = RTL_LANGUAGES.includes(currentLanguage)

  const getSupportedLanguages = () => supportedLanguages

  const getCurrentLanguageInfo = () => supportedLanguages.find((lang) => lang.code === currentLanguage)

  const value: LanguageContextType = {
    currentLanguage,
    changeLanguage,
    translateText,
    translateTexts,
    isTranslating,
    isRTL,
    getSupportedLanguages,
    getCurrentLanguageInfo,
    isLoadingLanguages,
    refreshLanguages,
  }

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}

// Export the supported languages for external use
export { type SupportedLanguage }