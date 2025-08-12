"use client"

import type React from "react"
import { useState } from "react"
import { View, Text, TouchableOpacity, Modal, ScrollView, StyleSheet, Pressable, ActivityIndicator } from "react-native"
import { Feather } from "@expo/vector-icons"
import { useLanguage } from "@/contexts/LanguageContext"
import { useTheme } from "@/contexts/ThemeContext"

interface LanguageSelectorProps {
  style?: any
  showLabel?: boolean
  compact?: boolean
  onLanguageChange?: (languageCode: string) => void
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  style,
  showLabel = true,
  compact = false,
  onLanguageChange,
}) => {
  const [isVisible, setIsVisible] = useState(false)
  const [isChanging, setIsChanging] = useState(false)
  const { currentLanguage, changeLanguage, getSupportedLanguages, getCurrentLanguageInfo } = useLanguage()
  const { colors } = useTheme()

  const supportedLanguages = getSupportedLanguages()
  const currentLangInfo = getCurrentLanguageInfo()

  const handleLanguageSelect = async (languageCode: string) => {
    if (languageCode === currentLanguage) {
      setIsVisible(false)
      return
    }

    setIsChanging(true)
    try {
      await changeLanguage(languageCode)
      onLanguageChange?.(languageCode)
    } catch (error) {
      console.error("Error changing language:", error)
    } finally {
      setIsChanging(false)
      setIsVisible(false)
    }
  }

  if (compact) {
    return (
      <>
        <TouchableOpacity
          style={[styles.compactSelector, style]}
          onPress={() => setIsVisible(true)}
          disabled={isChanging}
        >
          {isChanging ? (
            <ActivityIndicator size="small" color={colors.text} />
          ) : (
            <>
              <Text style={[styles.flagText, { color: colors.text }]}>{currentLangInfo?.flag}</Text>
              <Text style={[styles.compactLanguageText, { color: colors.text }]}>
                {currentLangInfo?.code.toUpperCase()}
              </Text>
              <Feather name="chevron-down" size={16} color={colors.textSecondary} />
            </>
          )}
        </TouchableOpacity>

        <Modal visible={isVisible} transparent animationType="fade" onRequestClose={() => setIsVisible(false)}>
          <Pressable style={styles.modalOverlay} onPress={() => setIsVisible(false)}>
            <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
              <View style={[styles.modalHeader, { borderBottomColor: colors.border }]}>
                <Text style={[styles.modalTitle, { color: colors.text }]}>Select language</Text>
                <TouchableOpacity onPress={() => setIsVisible(false)}>
                  <Feather name="x" size={24} color={colors.text} />
                </TouchableOpacity>
              </View>
              <ScrollView style={styles.languageList}>
                {supportedLanguages.map((language) => (
                  <TouchableOpacity
                    key={language.code}
                    style={[
                      styles.languageItem,
                      { borderBottomColor: colors.border },
                      currentLanguage === language.code && { backgroundColor: colors.surface },
                    ]}
                    onPress={() => handleLanguageSelect(language.code)}
                  >
                    <Text style={styles.flagText}>{language.flag}</Text>
                    <Text style={[styles.languageName, { color: colors.text }]}>{language.name}</Text>
                    {currentLanguage === language.code && <Feather name="check" size={20} color={colors.success} />}
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </Pressable>
        </Modal>
      </>
    )
  }

  return (
    <>
      <View style={[styles.selectorContainer, style]}>
        <TouchableOpacity
          style={[
            styles.selector,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
            },
          ]}
          onPress={() => setIsVisible(true)}
          disabled={isChanging}
        >
          {isChanging ? (
            <ActivityIndicator size="small" color={colors.text} />
          ) : (
            <>
              <View style={styles.selectedLanguage}>
                <Text style={styles.flagText}>{currentLangInfo?.flag}</Text>
                <Text style={[styles.languageText, { color: colors.text }]}>
                  {currentLangInfo?.name || "Select language"}
                </Text>
              </View>
              <Feather name="chevron-down" size={16} color={colors.textSecondary} />
            </>
          )}
        </TouchableOpacity>
      </View>

      <Modal visible={isVisible} transparent animationType="slide" onRequestClose={() => setIsVisible(false)}>
        <Pressable style={styles.modalOverlay} onPress={() => setIsVisible(false)}>
          <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
            <View style={[styles.modalHeader, { borderBottomColor: colors.border }]}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>Select language</Text>
              <TouchableOpacity onPress={() => setIsVisible(false)}>
                <Feather name="x" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.languageList}>
              {supportedLanguages.map((language) => (
                <TouchableOpacity
                  key={language.code}
                  style={[
                    styles.languageItem,
                    { borderBottomColor: colors.border },
                    currentLanguage === language.code && { backgroundColor: colors.surface },
                  ]}
                  onPress={() => handleLanguageSelect(language.code)}
                >
                  <Text style={styles.flagText}>{language.flag}</Text>
                  <Text style={[styles.languageName, { color: colors.text }]}>{language.name}</Text>
                  {currentLanguage === language.code && <Feather name="check" size={20} color={colors.success} />}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </Pressable>
      </Modal>
    </>
  )
}

const styles = StyleSheet.create({
  selectorContainer: {
    width: 150,
  },
  label: {
    fontSize: 14,
    marginBottom: 8,
    fontWeight: "500",
  },
  selector: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderWidth: 1,
    borderRadius: 8,
    minHeight: 48,
  },
  selectedLanguage: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  languageText: {
    fontSize: 16,
    marginLeft: 8,
  },
  compactSelector: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    minWidth: 60,
  },
  compactLanguageText: {
    fontSize: 12,
    fontWeight: "600",
    marginLeft: 4,
    marginRight: 2,
  },
  flagText: {
    fontSize: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContent: {
    width: "100%",
    maxWidth: 400,
    maxHeight: "80%",
    borderRadius: 12,
    overflow: "hidden",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  languageList: {
    maxHeight: 400,
  },
  languageItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  languageName: {
    fontSize: 16,
    marginLeft: 12,
    flex: 1,
  },
})

export default LanguageSelector