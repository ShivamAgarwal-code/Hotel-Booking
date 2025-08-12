import { useDynamicTranslation } from "@/hooks/useDynamicTranslation"
import type React from "react"
import { Text, ActivityIndicator, View } from "react-native"

interface DynamicTranslateTextProps {
  text: string | undefined | null
  style?: any
  fallback?: React.ReactNode
  numberOfLines?: number
  loadingColor?: string
}

// Component for translating dynamic text content (API responses, user data)
const DynamicTranslateText: React.FC<DynamicTranslateTextProps> = ({
  text,
  style,
  fallback,
  numberOfLines,
  loadingColor = "#666",
}) => {
  const { text: translatedText, isLoading } = useDynamicTranslation(text)

 

  return (
    <Text style={style} numberOfLines={numberOfLines}>
      {translatedText}
    </Text>
  )
}

export default DynamicTranslateText
