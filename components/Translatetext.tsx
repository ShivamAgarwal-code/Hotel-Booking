import { useInlineTranslation } from "@/hooks/useInlineTranslation"
import type React from "react"
import { Text, ActivityIndicator, View } from "react-native"

interface TranslateTextProps {
  children: string
  style?: any
  fallback?: React.ReactNode
  numberOfLines?: number
  loadingColor?: string
}

// Component wrapper for inline translations (static text)
const TranslateText: React.FC<TranslateTextProps> = ({
  children,
  style,
  fallback,
  numberOfLines,
  loadingColor = "#666",
}) => {
  const { text, isLoading } = useInlineTranslation(children)

  


  return (
    <Text style={style} numberOfLines={numberOfLines}>
      {text}
    </Text>
  )
}

export default TranslateText
