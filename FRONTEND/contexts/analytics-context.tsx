"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { useAuth } from "./auth-context"

export interface TravelData {
  bookings: Booking[]
  analytics: TravelAnalytics
  recommendations: Recommendation[]
}

export interface Booking {
  id: string
  flightNumber: string
  airline: string
  route: {
    origin: string
    destination: string
    originCode: string
    destinationCode: string
  }
  date: string
  price: number
  class: string
  status: "completed" | "upcoming" | "cancelled"
  passengers: number
  duration: string
  bookingDate: string
}

export interface TravelAnalytics {
  totalSpent: number
  totalFlights: number
  totalMiles: number
  averageFlightCost: number
  favoriteDestinations: DestinationStats[]
  preferredAirlines: AirlineStats[]
  monthlySpending: MonthlySpending[]
  travelFrequency: TravelFrequency
  seasonalPatterns: SeasonalPattern[]
  costSavings: CostSavings
}

export interface DestinationStats {
  city: string
  country: string
  code: string
  visits: number
  totalSpent: number
  averageCost: number
  lastVisit: string
}

export interface AirlineStats {
  name: string
  flights: number
  totalSpent: number
  averageCost: number
  onTimePerformance: number
}

export interface MonthlySpending {
  month: string
  year: number
  amount: number
  flights: number
}

export interface TravelFrequency {
  flightsPerYear: number
  averageTripLength: number
  busyMonths: string[]
  quietMonths: string[]
}

export interface SeasonalPattern {
  season: string
  flights: number
  averageCost: number
  popularDestinations: string[]
}

export interface CostSavings {
  totalSaved: number
  averageSavingsPerBooking: number
  bestDeal: {
    route: string
    savedAmount: number
    date: string
  }
}

export interface Recommendation {
  id: string
  type: "destination" | "deal" | "timing" | "airline"
  title: string
  description: string
  route?: {
    origin: string
    destination: string
  }
  price?: number
  savings?: number
  confidence: number
  validUntil?: string
  image?: string
}

const AnalyticsContext = createContext<
  | {
      travelData: TravelData | null
      isLoading: boolean
      refreshData: () => void
    }
  | undefined
>(undefined)

export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  const [travelData, setTravelData] = useState<TravelData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const generateMockData = (): TravelData => {
    const mockBookings: Booking[] = [
      {
        id: "BK123456789",
        flightNumber: "AA 1234",
        airline: "American Airlines",
        route: {
          origin: "New York",
          destination: "Los Angeles",
          originCode: "JFK",
          destinationCode: "LAX",
        },
        date: "2024-01-15",
        price: 299,
        class: "Economy",
        status: "completed",
        passengers: 1,
        duration: "5h 30m",
        bookingDate: "2023-12-20",
      },
      {
        id: "BK987654321",
        flightNumber: "DL 5678",
        airline: "Delta Airlines",
        route: {
          origin: "Los Angeles",
          destination: "Chicago",
          originCode: "LAX",
          destinationCode: "ORD",
        },
        date: "2024-01-22",
        price: 259,
        class: "Economy",
        status: "completed",
        passengers: 2,
        duration: "4h 15m",
        bookingDate: "2024-01-10",
      },
      {
        id: "BK456789123",
        flightNumber: "UA 9012",
        airline: "United Airlines",
        route: {
          origin: "Chicago",
          destination: "Miami",
          originCode: "ORD",
          destinationCode: "MIA",
        },
        date: "2024-02-10",
        price: 189,
        class: "Economy",
        status: "completed",
        passengers: 1,
        duration: "3h 45m",
        bookingDate: "2024-01-25",
      },
      {
        id: "BK789123456",
        flightNumber: "JB 3456",
        airline: "JetBlue Airways",
        route: {
          origin: "Miami",
          destination: "Boston",
          originCode: "MIA",
          destinationCode: "BOS",
        },
        date: "2024-03-05",
        price: 229,
        class: "Economy",
        status: "completed",
        passengers: 1,
        duration: "3h 20m",
        bookingDate: "2024-02-18",
      },
      {
        id: "BK321654987",
        flightNumber: "SW 7890",
        airline: "Southwest Airlines",
        route: {
          origin: "Boston",
          destination: "San Francisco",
          originCode: "BOS",
          destinationCode: "SFO",
        },
        date: "2024-04-12",
        price: 349,
        class: "Economy",
        status: "upcoming",
        passengers: 1,
        duration: "6h 10m",
        bookingDate: "2024-03-20",
      },
      {
        id: "BK654987321",
        flightNumber: "AA 2468",
        airline: "American Airlines",
        route: {
          origin: "San Francisco",
          destination: "Seattle",
          originCode: "SFO",
          destinationCode: "SEA",
        },
        date: "2024-05-20",
        price: 179,
        class: "Economy",
        status: "upcoming",
        passengers: 2,
        duration: "2h 30m",
        bookingDate: "2024-04-15",
      },
    ]

    const totalSpent = mockBookings.reduce((sum, booking) => sum + booking.price * booking.passengers, 0)
    const completedFlights = mockBookings.filter((b) => b.status === "completed")

    const analytics: TravelAnalytics = {
      totalSpent,
      totalFlights: mockBookings.length,
      totalMiles: 12450,
      averageFlightCost: totalSpent / mockBookings.length,
      favoriteDestinations: [
        {
          city: "Los Angeles",
          country: "USA",
          code: "LAX",
          visits: 2,
          totalSpent: 558,
          averageCost: 279,
          lastVisit: "2024-01-22",
        },
        {
          city: "Chicago",
          country: "USA",
          code: "ORD",
          visits: 1,
          totalSpent: 189,
          averageCost: 189,
          lastVisit: "2024-02-10",
        },
        {
          city: "Miami",
          country: "USA",
          code: "MIA",
          visits: 1,
          totalSpent: 229,
          averageCost: 229,
          lastVisit: "2024-03-05",
        },
      ],
      preferredAirlines: [
        {
          name: "American Airlines",
          flights: 2,
          totalSpent: 478,
          averageCost: 239,
          onTimePerformance: 85,
        },
        {
          name: "Delta Airlines",
          flights: 1,
          totalSpent: 259,
          averageCost: 259,
          onTimePerformance: 88,
        },
        {
          name: "United Airlines",
          flights: 1,
          totalSpent: 189,
          averageCost: 189,
          onTimePerformance: 82,
        },
      ],
      monthlySpending: [
        { month: "Jan", year: 2024, amount: 558, flights: 2 },
        { month: "Feb", year: 2024, amount: 189, flights: 1 },
        { month: "Mar", year: 2024, amount: 229, flights: 1 },
        { month: "Apr", year: 2024, amount: 349, flights: 1 },
        { month: "May", year: 2024, amount: 179, flights: 1 },
      ],
      travelFrequency: {
        flightsPerYear: 8,
        averageTripLength: 4.2,
        busyMonths: ["January", "April", "July"],
        quietMonths: ["February", "November", "December"],
      },
      seasonalPatterns: [
        {
          season: "Winter",
          flights: 3,
          averageCost: 249,
          popularDestinations: ["Los Angeles", "Miami"],
        },
        {
          season: "Spring",
          flights: 2,
          averageCost: 289,
          popularDestinations: ["Boston", "San Francisco"],
        },
        {
          season: "Summer",
          flights: 1,
          averageCost: 179,
          popularDestinations: ["Seattle"],
        },
      ],
      costSavings: {
        totalSaved: 450,
        averageSavingsPerBooking: 75,
        bestDeal: {
          route: "Boston → San Francisco",
          savedAmount: 120,
          date: "2024-04-12",
        },
      },
    }

    const recommendations: Recommendation[] = [
      {
        id: "rec1",
        type: "destination",
        title: "Explore Portland",
        description: "Based on your love for West Coast cities, Portland offers great food and culture.",
        route: { origin: "Seattle", destination: "Portland" },
        price: 89,
        confidence: 92,
        image: "/placeholder.svg?height=200&width=300",
      },
      {
        id: "rec2",
        type: "deal",
        title: "Flash Sale: NYC to London",
        description: "Limited time offer on your favorite route with 40% savings.",
        route: { origin: "New York", destination: "London" },
        price: 299,
        savings: 200,
        confidence: 88,
        validUntil: "2024-06-15",
      },
      {
        id: "rec3",
        type: "timing",
        title: "Best Time to Book Summer Travel",
        description:
          "Book your July flights now for optimal pricing. Prices typically rise 25% closer to travel dates.",
        confidence: 85,
      },
      {
        id: "rec4",
        type: "airline",
        title: "Try Alaska Airlines",
        description: "Similar routes to your preferred airlines with 15% better on-time performance.",
        confidence: 78,
      },
    ]

    return {
      bookings: mockBookings,
      analytics,
      recommendations,
    }
  }

  const refreshData = () => {
    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      if (user) {
        setTravelData(generateMockData())
      }
      setIsLoading(false)
    }, 1000)
  }

  useEffect(() => {
    refreshData()
  }, [user])

  return (
    <AnalyticsContext.Provider value={{ travelData, isLoading, refreshData }}>{children}</AnalyticsContext.Provider>
  )
}

export function useAnalytics() {
  const context = useContext(AnalyticsContext)
  if (context === undefined) {
    throw new Error("useAnalytics must be used within an AnalyticsProvider")
  }
  return context
}
