"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plane, Clock, ArrowRight, Filter } from "lucide-react"
import { format } from "date-fns"
import { usePreferences } from "@/contexts/preferences-context"

interface Flight {
  id: string
  airline: string
  flightNumber: string
  departure: {
    time: string
    airport: string
    city: string
  }
  arrival: {
    time: string
    airport: string
    city: string
  }
  duration: string
  price: number
  stops: number
  aircraft: string
}

export default function SearchResults() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [flights, setFlights] = useState<Flight[]>([])
  const [sortBy, setSortBy] = useState("price")
  const [loading, setLoading] = useState(true)
  const { preferences } = usePreferences()

  const origin = searchParams.get("origin")
  const destination = searchParams.get("destination")
  const departureDate = searchParams.get("departureDate")
  const passengers = searchParams.get("passengers")

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const mockFlights: Flight[] = [
        {
          id: "1",
          airline: "American Airlines",
          flightNumber: "AA 1234",
          departure: { time: "08:00", airport: "JFK", city: origin || "New York" },
          arrival: { time: "11:30", airport: "LAX", city: destination || "Los Angeles" },
          duration: "5h 30m",
          price: 299,
          stops: 0,
          aircraft: "Boeing 737",
        },
        {
          id: "2",
          airline: "Delta Airlines",
          flightNumber: "DL 5678",
          departure: { time: "10:15", airport: "JFK", city: origin || "New York" },
          arrival: { time: "14:45", airport: "LAX", city: destination || "Los Angeles" },
          duration: "6h 30m",
          price: 259,
          stops: 1,
          aircraft: "Airbus A320",
        },
        {
          id: "3",
          airline: "United Airlines",
          flightNumber: "UA 9012",
          departure: { time: "14:20", airport: "JFK", city: origin || "New York" },
          arrival: { time: "17:50", airport: "LAX", city: destination || "Los Angeles" },
          duration: "5h 30m",
          price: 329,
          stops: 0,
          aircraft: "Boeing 777",
        },
        {
          id: "4",
          airline: "JetBlue Airways",
          flightNumber: "B6 3456",
          departure: { time: "16:45", airport: "JFK", city: origin || "New York" },
          arrival: { time: "20:15", airport: "LAX", city: destination || "Los Angeles" },
          duration: "5h 30m",
          price: 279,
          stops: 0,
          aircraft: "Airbus A321",
        },
        {
          id: "5",
          airline: "Southwest Airlines",
          flightNumber: "WN 7890",
          departure: { time: "19:30", airport: "JFK", city: origin || "New York" },
          arrival: { time: "00:15", airport: "LAX", city: destination || "Los Angeles" },
          duration: "6h 45m",
          price: 199,
          stops: 1,
          aircraft: "Boeing 737",
        },
      ]
      setFlights(mockFlights)
      setLoading(false)
    }, 1000)
  }, [origin, destination])

  const filteredAndSortedFlights = [...flights]
    .filter((flight) => {
      // Filter out blocked airlines
      if (preferences.airlines.blocked.includes(flight.airline)) {
        return false
      }
      return true
    })
    .sort((a, b) => {
      // Prioritize preferred airlines
      const aIsPreferred = preferences.airlines.preferred.includes(a.airline)
      const bIsPreferred = preferences.airlines.preferred.includes(b.airline)

      if (aIsPreferred && !bIsPreferred) return -1
      if (!aIsPreferred && bIsPreferred) return 1

      // Then sort by selected criteria
      switch (sortBy) {
        case "price":
          return a.price - b.price
        case "duration":
          return Number.parseInt(a.duration) - Number.parseInt(b.duration)
        case "departure":
          return a.departure.time.localeCompare(b.departure.time)
        default:
          return 0
      }
    })

  const handleBookFlight = (flightId: string) => {
    const selectedFlight = flights.find((f) => f.id === flightId)
    if (selectedFlight) {
      const bookingParams = new URLSearchParams(searchParams.toString())
      bookingParams.set("flightId", flightId)
      bookingParams.set("passengers", passengers || "1")
      router.push(`/booking?${bookingParams.toString()}`)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Plane className="w-12 h-12 animate-bounce mx-auto mb-4 text-blue-600" />
          <p className="text-lg">Searching for the best flights...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Search Summary */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="text-lg font-semibold">
                  {origin} → {destination}
                </div>
                <div className="text-gray-600">{departureDate && format(new Date(departureDate), "MMM dd, yyyy")}</div>
                <div className="text-gray-600">
                  {passengers} {passengers === "1" ? "passenger" : "passengers"}
                </div>
              </div>
              <Button variant="outline" onClick={() => router.push("/")}>
                Modify Search
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Filter className="w-5 h-5" />
                  <h3 className="font-semibold">Sort & Filter</h3>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Sort by</label>
                    <Select value={sortBy} onValueChange={setSortBy}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="price">Price (Low to High)</SelectItem>
                        <SelectItem value="duration">Duration</SelectItem>
                        <SelectItem value="departure">Departure Time</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Flight Results */}
          <div className="lg:col-span-3">
            <div className="mb-4">
              <p className="text-gray-600">{flights.length} flights found</p>
            </div>

            <div className="space-y-4">
              {filteredAndSortedFlights.map((flight) => (
                <Card key={flight.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                      {/* Flight Info */}
                      <div className="md:col-span-2">
                        <div className="flex items-center gap-4 mb-3">
                          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                            <Plane className="w-4 h-4 text-white" />
                          </div>
                          <div>
                            <div className="font-semibold">{flight.airline}</div>
                            <div className="text-sm text-gray-600">{flight.flightNumber}</div>
                          </div>
                        </div>

                        <div className="flex items-center gap-4">
                          <div className="text-center">
                            <div className="text-xl font-bold">{flight.departure.time}</div>
                            <div className="text-sm text-gray-600">{flight.departure.airport}</div>
                          </div>

                          <div className="flex-1 flex items-center gap-2">
                            <div className="flex-1 h-px bg-gray-300"></div>
                            <div className="text-xs text-gray-500 flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {flight.duration}
                            </div>
                            <div className="flex-1 h-px bg-gray-300"></div>
                          </div>

                          <div className="text-center">
                            <div className="text-xl font-bold">{flight.arrival.time}</div>
                            <div className="text-sm text-gray-600">{flight.arrival.airport}</div>
                          </div>
                        </div>

                        <div className="mt-3 flex gap-2">
                          {flight.stops === 0 ? (
                            <Badge variant="secondary">Non-stop</Badge>
                          ) : (
                            <Badge variant="outline">
                              {flight.stops} stop{flight.stops > 1 ? "s" : ""}
                            </Badge>
                          )}
                          <Badge variant="outline">{flight.aircraft}</Badge>
                        </div>
                      </div>

                      {/* Price and Book Button */}
                      <div className="md:col-span-2 flex md:flex-col items-center md:items-end gap-4">
                        <div className="text-center md:text-right">
                          <div className="text-2xl font-bold text-green-600">${flight.price}</div>
                          <div className="text-sm text-gray-600">per person</div>
                        </div>

                        <Button
                          onClick={() => handleBookFlight(flight.id)}
                          className="bg-orange-500 hover:bg-orange-600 w-full md:w-auto"
                        >
                          Book Now
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
