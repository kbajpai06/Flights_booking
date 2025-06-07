"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Plane, User, CreditCard, TicketIcon as Seat } from "lucide-react"
import { format } from "date-fns"
import { useAuth } from "@/contexts/auth-context"
import { ProtectedRoute } from "@/components/protected-route"
import { usePreferences } from "@/contexts/preferences-context"

interface Passenger {
  firstName: string
  lastName: string
  age: string
  passportNumber: string
  seat: string
}

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
  aircraft: string
}

function BookingContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user } = useAuth()
  const { preferences } = usePreferences()
  const [passengers, setPassengers] = useState<Passenger[]>([])
  const [flight, setFlight] = useState<Flight | null>(null)
  const [currentStep, setCurrentStep] = useState(1)
  const [selectedSeats, setSelectedSeats] = useState<string[]>([])

  const flightId = searchParams.get("flightId")
  const passengerCount = Number.parseInt(searchParams.get("passengers") || "1")
  const departureDate = searchParams.get("departureDate")

  useEffect(() => {
    // Initialize passengers array with user data for first passenger if auto-fill is enabled
    const initialPassengers = Array.from({ length: passengerCount }, (_, index) => ({
      firstName: index === 0 && preferences.booking.autoFillPassengerInfo ? user?.firstName || "" : "",
      lastName: index === 0 && preferences.booking.autoFillPassengerInfo ? user?.lastName || "" : "",
      age: "",
      passportNumber: "",
      seat: "",
    }))
    setPassengers(initialPassengers)

    // Mock flight data (in real app, fetch from API)
    const mockFlight: Flight = {
      id: flightId || "1",
      airline: "American Airlines",
      flightNumber: "AA 1234",
      departure: { time: "08:00", airport: "JFK", city: "New York" },
      arrival: { time: "11:30", airport: "LAX", city: "Los Angeles" },
      duration: "5h 30m",
      price: 299,
      aircraft: "Boeing 737",
    }
    setFlight(mockFlight)
  }, [flightId, passengerCount, user, preferences.booking.autoFillPassengerInfo])

  const updatePassenger = (index: number, field: keyof Passenger, value: string) => {
    const updated = [...passengers]
    updated[index] = { ...updated[index], [field]: value }
    setPassengers(updated)
  }

  const generateSeatMap = () => {
    const rows = 30
    const seatsPerRow = 6
    const seats = []

    for (let row = 1; row <= rows; row++) {
      const rowSeats = []
      const letters = ["A", "B", "C", "D", "E", "F"]

      for (let i = 0; i < seatsPerRow; i++) {
        const seatNumber = `${row}${letters[i]}`
        const isOccupied = Math.random() < 0.3 // 30% chance of being occupied
        const isSelected = selectedSeats.includes(seatNumber)

        rowSeats.push({
          number: seatNumber,
          isOccupied,
          isSelected,
          isAisle: i === 2 || i === 3,
        })
      }
      seats.push(rowSeats)
    }

    return seats
  }

  const handleSeatSelect = (seatNumber: string) => {
    if (selectedSeats.length < passengerCount && !selectedSeats.includes(seatNumber)) {
      setSelectedSeats([...selectedSeats, seatNumber])
    } else if (selectedSeats.includes(seatNumber)) {
      setSelectedSeats(selectedSeats.filter((seat) => seat !== seatNumber))
    }
  }

  const handleBooking = () => {
    const bookingData = {
      flight,
      passengers,
      selectedSeats,
      totalPrice: flight ? flight.price * passengerCount : 0,
      bookingReference: `BK${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
    }

    localStorage.setItem("bookingData", JSON.stringify(bookingData))
    router.push("/confirmation")
  }

  const isStep1Valid = passengers.every((p) => p.firstName && p.lastName && p.age && p.passportNumber)

  const isStep2Valid = selectedSeats.length === passengerCount

  if (!flight) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-8">
            <div className={`flex items-center ${currentStep >= 1 ? "text-blue-600" : "text-gray-400"}`}>
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 1 ? "bg-blue-600 text-white" : "bg-gray-300"}`}
              >
                <User className="w-4 h-4" />
              </div>
              <span className="ml-2 font-medium">Passenger Info</span>
            </div>
            <div className={`w-16 h-px ${currentStep >= 2 ? "bg-blue-600" : "bg-gray-300"}`}></div>
            <div className={`flex items-center ${currentStep >= 2 ? "text-blue-600" : "text-gray-400"}`}>
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 2 ? "bg-blue-600 text-white" : "bg-gray-300"}`}
              >
                <Seat className="w-4 h-4" />
              </div>
              <span className="ml-2 font-medium">Seat Selection</span>
            </div>
            <div className={`w-16 h-px ${currentStep >= 3 ? "bg-blue-600" : "bg-gray-300"}`}></div>
            <div className={`flex items-center ${currentStep >= 3 ? "text-blue-600" : "text-gray-400"}`}>
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 3 ? "bg-blue-600 text-white" : "bg-gray-300"}`}
              >
                <CreditCard className="w-4 h-4" />
              </div>
              <span className="ml-2 font-medium">Payment</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {currentStep === 1 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Passenger Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {passengers.map((passenger, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <h4 className="font-semibold mb-4">Passenger {index + 1}</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor={`firstName-${index}`}>First Name</Label>
                          <Input
                            id={`firstName-${index}`}
                            value={passenger.firstName}
                            onChange={(e) => updatePassenger(index, "firstName", e.target.value)}
                            placeholder="Enter first name"
                          />
                        </div>
                        <div>
                          <Label htmlFor={`lastName-${index}`}>Last Name</Label>
                          <Input
                            id={`lastName-${index}`}
                            value={passenger.lastName}
                            onChange={(e) => updatePassenger(index, "lastName", e.target.value)}
                            placeholder="Enter last name"
                          />
                        </div>
                        <div>
                          <Label htmlFor={`age-${index}`}>Age</Label>
                          <Select value={passenger.age} onValueChange={(value) => updatePassenger(index, "age", value)}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select age" />
                            </SelectTrigger>
                            <SelectContent>
                              {Array.from({ length: 80 }, (_, i) => i + 1).map((age) => (
                                <SelectItem key={age} value={age.toString()}>
                                  {age} years old
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor={`passport-${index}`}>Passport Number</Label>
                          <Input
                            id={`passport-${index}`}
                            value={passenger.passportNumber}
                            onChange={(e) => updatePassenger(index, "passportNumber", e.target.value)}
                            placeholder="Enter passport number"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                  <Button onClick={() => setCurrentStep(2)} disabled={!isStep1Valid} className="w-full">
                    Continue to Seat Selection
                  </Button>
                </CardContent>
              </Card>
            )}

            {currentStep === 2 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Seat className="w-5 h-5" />
                    Seat Selection
                  </CardTitle>
                  <p className="text-sm text-gray-600">
                    Select {passengerCount} seat{passengerCount > 1 ? "s" : ""} for your flight
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="mb-6">
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-green-500 rounded"></div>
                        <span>Available</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-blue-500 rounded"></div>
                        <span>Selected</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-gray-400 rounded"></div>
                        <span>Occupied</span>
                      </div>
                    </div>
                  </div>

                  <div className="max-h-96 overflow-y-auto border rounded-lg p-4">
                    <div className="text-center mb-4 text-sm font-medium text-gray-600">Front of Aircraft</div>

                    {generateSeatMap()
                      .slice(0, 15)
                      .map((row, rowIndex) => (
                        <div key={rowIndex} className="flex items-center justify-center gap-1 mb-2">
                          <span className="w-6 text-xs text-gray-500">{rowIndex + 1}</span>
                          {row.map((seat, seatIndex) => (
                            <div key={seatIndex} className="flex">
                              <button
                                onClick={() => !seat.isOccupied && handleSeatSelect(seat.number)}
                                disabled={seat.isOccupied}
                                className={`w-6 h-6 text-xs rounded ${
                                  seat.isOccupied
                                    ? "bg-gray-400 cursor-not-allowed"
                                    : seat.isSelected
                                      ? "bg-blue-500 text-white"
                                      : "bg-green-500 hover:bg-green-600 text-white"
                                }`}
                              >
                                {seat.number.slice(-1)}
                              </button>
                              {seatIndex === 2 && <div className="w-4"></div>}
                            </div>
                          ))}
                        </div>
                      ))}
                  </div>

                  <div className="mt-6 flex gap-4">
                    <Button variant="outline" onClick={() => setCurrentStep(1)}>
                      Back
                    </Button>
                    <Button onClick={() => setCurrentStep(3)} disabled={!isStep2Valid} className="flex-1">
                      Continue to Payment
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {currentStep === 3 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="w-5 h-5" />
                    Payment Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="cardNumber">Card Number</Label>
                      <Input id="cardNumber" placeholder="1234 5678 9012 3456" />
                    </div>
                    <div>
                      <Label htmlFor="cardName">Cardholder Name</Label>
                      <Input id="cardName" placeholder="John Doe" />
                    </div>
                    <div>
                      <Label htmlFor="expiry">Expiry Date</Label>
                      <Input id="expiry" placeholder="MM/YY" />
                    </div>
                    <div>
                      <Label htmlFor="cvv">CVV</Label>
                      <Input id="cvv" placeholder="123" />
                    </div>
                  </div>

                  <div className="flex gap-4 mt-6">
                    <Button variant="outline" onClick={() => setCurrentStep(2)}>
                      Back
                    </Button>
                    <Button onClick={handleBooking} className="flex-1 bg-green-600 hover:bg-green-700">
                      Complete Booking
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Booking Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle>Booking Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                    <Plane className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="font-semibold">{flight.airline}</div>
                    <div className="text-sm text-gray-600">{flight.flightNumber}</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Route:</span>
                    <span>
                      {flight.departure.city} → {flight.arrival.city}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Date:</span>
                    <span>{departureDate && format(new Date(departureDate), "MMM dd, yyyy")}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Time:</span>
                    <span>
                      {flight.departure.time} - {flight.arrival.time}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Duration:</span>
                    <span>{flight.duration}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Passengers:</span>
                    <span>{passengerCount}</span>
                  </div>
                </div>

                {selectedSeats.length > 0 && (
                  <div>
                    <div className="text-sm font-medium mb-2">Selected Seats:</div>
                    <div className="flex flex-wrap gap-1">
                      {selectedSeats.map((seat) => (
                        <Badge key={seat} variant="secondary">
                          {seat}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <Separator />

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>
                      Flight ({passengerCount}x ${flight.price})
                    </span>
                    <span>${flight.price * passengerCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Taxes & Fees</span>
                    <span>$45</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <span>${flight.price * passengerCount + 45}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function BookingPage() {
  return (
    <ProtectedRoute>
      <BookingContent />
    </ProtectedRoute>
  )
}
