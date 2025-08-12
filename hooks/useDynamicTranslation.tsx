"use client"

import { useState, useEffect } from "react"
import { useLanguage } from "../contexts/LanguageContext"

// Hook for translating dynamic content (like API responses)
export const useDynamicTranslation = (text: string | undefined | null) => {
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
        console.error("Error translating dynamic text:", error)
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

// Hook for translating arrays of dynamic content (like news items, user lists)
export const useDynamicTranslations = (items: any[], textFields: string[]) => {
  const { currentLanguage, translateTexts, isTranslating } = useLanguage()
  const [translatedItems, setTranslatedItems] = useState(items)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const translateItems = async () => {
      if (!items.length || currentLanguage === "en") {
        setTranslatedItems(items)
        return
      }

      setIsLoading(true)
      try {
        // Extract all texts that need translation
        const textsToTranslate: string[] = []
        const textMap: { itemIndex: number; field: string; originalText: string }[] = []

        items.forEach((item, itemIndex) => {
          textFields.forEach((field) => {
            const text = item[field]
            if (text && typeof text === "string") {
              textsToTranslate.push(text)
              textMap.push({ itemIndex, field, originalText: text })
            }
          })
        })

        if (textsToTranslate.length === 0) {
          setTranslatedItems(items)
          return
        }

        // Translate all texts in batch
        const translatedTexts = await translateTexts(textsToTranslate, currentLanguage)

        // Map translations back to items
        const newItems = [...items]
        textMap.forEach((mapping, index) => {
          const translatedText = translatedTexts[index] || mapping.originalText
          newItems[mapping.itemIndex] = {
            ...newItems[mapping.itemIndex],
            [mapping.field]: translatedText,
          }
        })

        setTranslatedItems(newItems)
      } catch (error) {
        console.error("Error translating dynamic items:", error)
        setTranslatedItems(items) // Fallback to original items
      } finally {
        setIsLoading(false)
      }
    }

    translateItems()
  }, [items, textFields, currentLanguage, translateTexts])

  return {
    items: translatedItems,
    isLoading: isLoading || isTranslating,
  }
}
