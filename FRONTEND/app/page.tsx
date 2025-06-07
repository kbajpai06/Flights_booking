"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Plane, Users, MapPin } from "lucide-react"
import { format } from "date-fns"
import Image from "next/image"
import { PreferencesSummary } from "@/components/preferences-summary"
import { AnalyticsSummary } from "@/components/analytics-summary"
import { useAuth } from "@/contexts/auth-context"

export default function HomePage() {
  const router = useRouter()
  const { user } = useAuth()
  const [origin, setOrigin] = useState("")
  const [destination, setDestination] = useState("")
  const [departureDate, setDepartureDate] = useState<Date>()
  const [returnDate, setReturnDate] = useState<Date>()
  const [passengers, setPassengers] = useState("1")
  const [tripType, setTripType] = useState("round-trip")

  const handleSearch = () => {
    if (origin && destination && departureDate) {
      const searchParams = new URLSearchParams({
        origin,
        destination,
        departureDate: departureDate.toISOString(),
        returnDate: returnDate?.toISOString() || "",
        passengers,
        tripType,
      })
      router.push(`/search?${searchParams.toString()}`)
    }
  }

  const popularDestinations = [
    { city: "New York", country: "USA", image: "/placeholder.svg?height=200&width=300" },
    { city: "London", country: "UK", image: "/placeholder.svg?height=200&width=300" },
    { city: "Tokyo", country: "Japan", image: "/placeholder.svg?height=200&width=300" },
    { city: "Paris", country: "France", image: "/placeholder.svg?height=200&width=300" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative container mx-auto px-4 py-20">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">Find Your Perfect Flight</h1>
            <p className="text-xl md:text-2xl opacity-90">Compare prices from hundreds of airlines and travel sites</p>
          </div>

          {/* Search Form */}
          <Card className="max-w-6xl mx-auto">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row gap-4 mb-6">
                <div className="flex gap-4">
                  <Button
                    variant={tripType === "round-trip" ? "default" : "outline"}
                    onClick={() => setTripType("round-trip")}
                    className="flex-1 lg:flex-none"
                  >
                    Round Trip
                  </Button>
                  <Button
                    variant={tripType === "one-way" ? "default" : "outline"}
                    onClick={() => setTripType("one-way")}
                    className="flex-1 lg:flex-none"
                  >
                    One Way
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                {/* Origin */}
                <div className="space-y-2">
                  <Label htmlFor="origin" className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    From
                  </Label>
                  <Input
                    id="origin"
                    placeholder="Origin city"
                    value={origin}
                    onChange={(e) => setOrigin(e.target.value)}
                    className="h-12"
                  />
                </div>

                {/* Destination */}
                <div className="space-y-2">
                  <Label htmlFor="destination" className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    To
                  </Label>
                  <Input
                    id="destination"
                    placeholder="Destination city"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    className="h-12"
                  />
                </div>

                {/* Departure Date */}
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <CalendarIcon className="w-4 h-4" />
                    Departure
                  </Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="h-12 w-full justify-start text-left font-normal">
                        {departureDate ? format(departureDate, "MMM dd, yyyy") : "Select date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar mode="single" selected={departureDate} onSelect={setDepartureDate} initialFocus />
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Return Date */}
                {tripType === "round-trip" && (
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <CalendarIcon className="w-4 h-4" />
                      Return
                    </Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="h-12 w-full justify-start text-left font-normal">
                          {returnDate ? format(returnDate, "MMM dd, yyyy") : "Select date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar mode="single" selected={returnDate} onSelect={setReturnDate} initialFocus />
                      </PopoverContent>
                    </Popover>
                  </div>
                )}

                {/* Passengers */}
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    Passengers
                  </Label>
                  <Select value={passengers} onValueChange={setPassengers}>
                    <SelectTrigger className="h-12">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                        <SelectItem key={num} value={num.toString()}>
                          {num} {num === 1 ? "Passenger" : "Passengers"}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button
                onClick={handleSearch}
                className="w-full mt-6 h-12 text-lg bg-orange-500 hover:bg-orange-600"
                disabled={!origin || !destination || !departureDate}
              >
                <Plane className="w-5 h-5 mr-2" />
                Search Flights
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Popular Destinations */}
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Popular Destinations</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {popularDestinations.map((destination, index) => (
            <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
              <div className="relative h-48">
                <Image
                  src={destination.image || "/placeholder.svg"}
                  alt={destination.city}
                  fill
                  className="object-cover"
                />
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold text-lg">{destination.city}</h3>
                <p className="text-gray-600">{destination.country}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Features */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Plane className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Best Prices</h3>
              <p className="text-gray-600">Compare prices from hundreds of airlines and travel sites</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Easy Booking</h3>
              <p className="text-gray-600">Simple and secure booking process in just a few clicks</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Worldwide</h3>
              <p className="text-gray-600">Flights to destinations all around the world</p>
            </div>
          </div>
        </div>
      </div>

      {/* User Dashboard */}
      {user && (
        <div className="container mx-auto px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <PreferencesSummary />
            <AnalyticsSummary />
          </div>
        </div>
      )}
    </div>
  )
}
