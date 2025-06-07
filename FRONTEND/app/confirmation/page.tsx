"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { CheckCircle, Plane, Download, Mail, Calendar, Clock, Users, MapPin } from "lucide-react"

interface BookingData {
  flight: {
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
    aircraft: string
  }
  passengers: Array<{
    firstName: string
    lastName: string
    age: string
    passportNumber: string
  }>
  selectedSeats: string[]
  totalPrice: number
  bookingReference: string
}

export default function ConfirmationPage() {
  const [bookingData, setBookingData] = useState<BookingData | null>(null)

  useEffect(() => {
    const data = localStorage.getItem("bookingData")
    if (data) {
      setBookingData(JSON.parse(data))
    }
  }, [])

  if (!bookingData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg">Loading booking confirmation...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-green-600 mb-2">Booking Confirmed!</h1>
          <p className="text-gray-600 text-lg">
            Your flight has been successfully booked. A confirmation email has been sent to your email address.
          </p>
        </div>

        <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Booking Reference */}
          <div className="lg:col-span-3">
            <Card className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
              <CardContent className="p-6">
                <div className="text-center">
                  <h2 className="text-2xl font-bold mb-2">Booking Reference</h2>
                  <div className="text-4xl font-mono font-bold tracking-wider">{bookingData.bookingReference}</div>
                  <p className="mt-2 opacity-90">Please save this reference number for your records</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Flight Details */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plane className="w-5 h-5" />
                  Flight Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                    <Plane className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="font-semibold text-lg">{bookingData.flight.airline}</div>
                    <div className="text-gray-600">
                      {bookingData.flight.flightNumber} • {bookingData.flight.aircraft}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-gray-400 mt-1" />
                      <div>
                        <div className="font-semibold">Departure</div>
                        <div className="text-2xl font-bold">{bookingData.flight.departure.time}</div>
                        <div className="text-gray-600">{bookingData.flight.departure.city}</div>
                        <div className="text-sm text-gray-500">{bookingData.flight.departure.airport}</div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-gray-400 mt-1" />
                      <div>
                        <div className="font-semibold">Arrival</div>
                        <div className="text-2xl font-bold">{bookingData.flight.arrival.time}</div>
                        <div className="text-gray-600">{bookingData.flight.arrival.city}</div>
                        <div className="text-sm text-gray-500">{bookingData.flight.arrival.airport}</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-6 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>Duration: {bookingData.flight.duration}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>Today</span>
                  </div>
                </div>

                <Separator />

                {/* Passenger Details */}
                <div>
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Passenger Details
                  </h3>
                  <div className="space-y-4">
                    {bookingData.passengers.map((passenger, index) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                          <div className="font-medium">
                            {passenger.firstName} {passenger.lastName}
                          </div>
                          <div className="text-sm text-gray-600">
                            Age: {passenger.age} • Passport: {passenger.passportNumber}
                          </div>
                        </div>
                        <Badge variant="secondary">Seat {bookingData.selectedSeats[index]}</Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Booking Summary */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Booking Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Passengers:</span>
                    <span>{bookingData.passengers.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Seats:</span>
                    <div className="text-right">
                      {bookingData.selectedSeats.map((seat, index) => (
                        <Badge key={index} variant="outline" className="ml-1">
                          {seat}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Flight Cost</span>
                    <span>${bookingData.totalPrice - 45}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Taxes & Fees</span>
                    <span>$45</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total Paid</span>
                    <span className="text-green-600">${bookingData.totalPrice}</span>
                  </div>
                </div>

                <div className="space-y-3 pt-4">
                  <Button className="w-full" variant="outline">
                    <Download className="w-4 h-4 mr-2" />
                    Download Ticket
                  </Button>
                  <Button className="w-full" variant="outline">
                    <Mail className="w-4 h-4 mr-2" />
                    Email Confirmation
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Important Information */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-lg">Important Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div>
                  <div className="font-medium">Check-in</div>
                  <div className="text-gray-600">Online check-in opens 24 hours before departure</div>
                </div>
                <div>
                  <div className="font-medium">Baggage</div>
                  <div className="text-gray-600">
                    1 carry-on bag included. Additional fees may apply for checked bags
                  </div>
                </div>
                <div>
                  <div className="font-medium">Arrival</div>
                  <div className="text-gray-600">Please arrive at the airport at least 2 hours before departure</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="max-w-4xl mx-auto mt-8 text-center">
          <div className="space-y-4">
            <p className="text-gray-600">Need to make changes to your booking? Contact our customer service team.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="outline" className="px-8">
                Contact Support
              </Button>
              <Button variant="outline" className="px-8">
                Manage Booking
              </Button>
              <Button className="px-8 bg-blue-600 hover:bg-blue-700">Book Another Flight</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
