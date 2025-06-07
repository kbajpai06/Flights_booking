"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { useAuth } from "./auth-context"

export interface UserPreferences {
  airlines: {
    preferred: string[]
    blocked: string[]
  }
  seating: {
    preferredType: "window" | "aisle" | "middle" | "any"
    preferredSection: "front" | "middle" | "back" | "any"
    extraLegroom: boolean
  }
  travel: {
    class: "economy" | "premium-economy" | "business" | "first"
    mealPreference: "standard" | "vegetarian" | "vegan" | "kosher" | "halal" | "gluten-free"
    specialAssistance: string[]
  }
  notifications: {
    priceAlerts: boolean
    flightUpdates: boolean
    promotions: boolean
    reminderTime: number // hours before flight
  }
  booking: {
    autoFillPassengerInfo: boolean
    savePaymentMethods: boolean
    defaultCurrency: "USD" | "EUR" | "GBP" | "CAD"
  }
}

const defaultPreferences: UserPreferences = {
  airlines: {
    preferred: [],
    blocked: [],
  },
  seating: {
    preferredType: "any",
    preferredSection: "any",
    extraLegroom: false,
  },
  travel: {
    class: "economy",
    mealPreference: "standard",
    specialAssistance: [],
  },
  notifications: {
    priceAlerts: true,
    flightUpdates: true,
    promotions: false,
    reminderTime: 24,
  },
  booking: {
    autoFillPassengerInfo: true,
    savePaymentMethods: false,
    defaultCurrency: "USD",
  },
}

interface PreferencesContextType {
  preferences: UserPreferences
  updatePreferences: (newPreferences: Partial<UserPreferences>) => void
  resetPreferences: () => void
  isLoading: boolean
}

const PreferencesContext = createContext<PreferencesContextType | undefined>(undefined)

export function PreferencesProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  const [preferences, setPreferences] = useState<UserPreferences>(defaultPreferences)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (user) {
      // Load user preferences from localStorage
      const savedPreferences = localStorage.getItem(`preferences_${user.id}`)
      if (savedPreferences) {
        try {
          const parsed = JSON.parse(savedPreferences)
          setPreferences({ ...defaultPreferences, ...parsed })
        } catch (error) {
          console.error("Error parsing preferences:", error)
          setPreferences(defaultPreferences)
        }
      }
    } else {
      setPreferences(defaultPreferences)
    }
    setIsLoading(false)
  }, [user])

  const updatePreferences = (newPreferences: Partial<UserPreferences>) => {
    const updated = { ...preferences, ...newPreferences }
    setPreferences(updated)

    if (user) {
      localStorage.setItem(`preferences_${user.id}`, JSON.stringify(updated))
    }
  }

  const resetPreferences = () => {
    setPreferences(defaultPreferences)
    if (user) {
      localStorage.removeItem(`preferences_${user.id}`)
    }
  }

  return (
    <PreferencesContext.Provider value={{ preferences, updatePreferences, resetPreferences, isLoading }}>
      {children}
    </PreferencesContext.Provider>
  )
}

export function usePreferences() {
  const context = useContext(PreferencesContext)
  if (context === undefined) {
    throw new Error("usePreferences must be used within a PreferencesProvider")
  }
  return context
}
