"use client"

import { useState, useEffect } from "react"
import { useLanguage } from "../contexts/LanguageContext"

// Hook for translating single dynamic text
export const useInlineTranslation = (text: string | undefined | null) => {
  const { currentLanguage, translateText, isTranslating } = useLanguage()
  const [translatedText, setTranslatedText] = useState(text || "")
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const translate = async () => {
      if (!text || currentLanguage === "en") {
        setTranslatedText(text || "")
        return
      }

      setIsLoading(true)
      try {
        const translated = await translateText(text, currentLanguage)
        setTranslatedText(translated)
      } catch (error) {
        console.error("Error translating text:", error)
        setTranslatedText(text) // Fallback to original text
      } finally {
        setIsLoading(false)
      }
    }

    translate()
  }, [text, currentLanguage, translateText])

  return {
    text: translatedText,
    isLoading: isLoading || isTranslating,
  }
}

// Hook for translating multiple dynamic texts
export const useInlineTranslations = (texts: string[]) => {
  const { currentLanguage, translateTexts, isTranslating } = useLanguage()
  const [translatedTexts, setTranslatedTexts] = useState<string[]>(texts)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const translate = async () => {
      if (currentLanguage === "en" || !texts.length) {
        setTranslatedTexts(texts)
        return
      }

      setIsLoading(true)
      try {
        const translated = await translateTexts(texts, currentLanguage)
        setTranslatedTexts(translated)
      } catch (error) {
        console.error("Error translating texts:", error)
        setTranslatedTexts(texts) // Fallback to original texts
      } finally {
        setIsLoading(false)
      }
    }

    translate()
  }, [texts, currentLanguage, translateTexts])

  return {
    texts: translatedTexts,
    isLoading: isLoading || isTranslating,
  }
}
