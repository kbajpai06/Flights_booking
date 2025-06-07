"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts"
import {
  TrendingUp,
  TrendingDown,
  Plane,
  MapPin,
  DollarSign,
  Star,
  Clock,
  Target,
  Lightbulb,
  Award,
  Globe,
} from "lucide-react"
import { useAnalytics } from "@/contexts/analytics-context"
import { ProtectedRoute } from "@/components/protected-route"
import Image from "next/image"

const COLORS = ["#3b82f6", "#ef4444", "#10b981", "#f59e0b", "#8b5cf6", "#06b6d4"]

function AnalyticsContent() {
  const { travelData, isLoading } = useAnalytics()

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Plane className="w-12 h-12 animate-bounce mx-auto mb-4 text-blue-600" />
          <p className="text-lg">Analyzing your travel patterns...</p>
        </div>
      </div>
    )
  }

  if (!travelData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="p-8 text-center">
            <Globe className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <h3 className="text-xl font-semibold mb-2">No Travel Data Yet</h3>
            <p className="text-gray-600 mb-4">
              Start booking flights to see your travel analytics and get personalized recommendations.
            </p>
            <Button>Book Your First Flight</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const { analytics, recommendations, bookings } = travelData

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Travel Analytics</h1>
          <p className="text-gray-600">Insights into your travel patterns and personalized recommendations</p>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Spent</p>
                  <p className="text-2xl font-bold">${analytics.totalSpent.toLocaleString()}</p>
                </div>
                <DollarSign className="w-8 h-8 text-green-600" />
              </div>
              <div className="mt-2 flex items-center text-sm">
                <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                <span className="text-green-600">+12% from last year</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Flights</p>
                  <p className="text-2xl font-bold">{analytics.totalFlights}</p>
                </div>
                <Plane className="w-8 h-8 text-blue-600" />
              </div>
              <div className="mt-2 flex items-center text-sm">
                <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                <span className="text-green-600">+3 from last year</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Miles Traveled</p>
                  <p className="text-2xl font-bold">{analytics.totalMiles.toLocaleString()}</p>
                </div>
                <MapPin className="w-8 h-8 text-purple-600" />
              </div>
              <div className="mt-2 flex items-center text-sm">
                <Award className="w-4 h-4 text-purple-500 mr-1" />
                <span className="text-purple-600">Frequent Traveler</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Avg. Flight Cost</p>
                  <p className="text-2xl font-bold">${Math.round(analytics.averageFlightCost)}</p>
                </div>
                <Target className="w-8 h-8 text-orange-600" />
              </div>
              <div className="mt-2 flex items-center text-sm">
                <TrendingDown className="w-4 h-4 text-green-500 mr-1" />
                <span className="text-green-600">-8% from last year</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="patterns" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="patterns">Travel Patterns</TabsTrigger>
            <TabsTrigger value="spending">Spending Analysis</TabsTrigger>
            <TabsTrigger value="destinations">Destinations</TabsTrigger>
            <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
          </TabsList>

          <TabsContent value="patterns" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Monthly Travel Frequency */}
              <Card>
                <CardHeader>
                  <CardTitle>Monthly Travel Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={analytics.monthlySpending}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="flights" fill="#3b82f6" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Travel Frequency Insights */}
              <Card>
                <CardHeader>
                  <CardTitle>Travel Frequency Insights</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Flights per Year</span>
                    <span className="text-lg font-bold">{analytics.travelFrequency.flightsPerYear}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Avg. Trip Length</span>
                    <span className="text-lg font-bold">{analytics.travelFrequency.averageTripLength} days</span>
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm font-medium">Busiest Months</p>
                    <div className="flex flex-wrap gap-2">
                      {analytics.travelFrequency.busyMonths.map((month) => (
                        <Badge key={month} variant="default">
                          {month}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm font-medium">Quieter Months</p>
                    <div className="flex flex-wrap gap-2">
                      {analytics.travelFrequency.quietMonths.map((month) => (
                        <Badge key={month} variant="outline">
                          {month}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Seasonal Patterns */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Seasonal Travel Patterns</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {analytics.seasonalPatterns.map((pattern) => (
                      <div key={pattern.season} className="border rounded-lg p-4">
                        <h4 className="font-semibold mb-2">{pattern.season}</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>Flights:</span>
                            <span className="font-medium">{pattern.flights}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Avg. Cost:</span>
                            <span className="font-medium">${pattern.averageCost}</span>
                          </div>
                          <div>
                            <span className="block mb-1">Popular Destinations:</span>
                            <div className="flex flex-wrap gap-1">
                              {pattern.popularDestinations.map((dest) => (
                                <Badge key={dest} variant="secondary" className="text-xs">
                                  {dest}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="spending" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Monthly Spending Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Monthly Spending Trend</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={analytics.monthlySpending}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="amount" stroke="#3b82f6" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Airline Spending Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle>Spending by Airline</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={analytics.preferredAirlines}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="totalSpent"
                      >
                        {analytics.preferredAirlines.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Cost Savings */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-green-600" />
                    Cost Savings Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-green-600">${analytics.costSavings.totalSaved}</p>
                      <p className="text-sm text-gray-600">Total Saved</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-green-600">
                        ${analytics.costSavings.averageSavingsPerBooking}
                      </p>
                      <p className="text-sm text-gray-600">Avg. per Booking</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-bold">{analytics.costSavings.bestDeal.route}</p>
                      <p className="text-sm text-green-600">
                        Best Deal: ${analytics.costSavings.bestDeal.savedAmount} saved
                      </p>
                      <p className="text-xs text-gray-500">{analytics.costSavings.bestDeal.date}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="destinations" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Favorite Destinations */}
              <Card>
                <CardHeader>
                  <CardTitle>Favorite Destinations</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {analytics.favoriteDestinations.map((dest, index) => (
                    <div key={dest.code} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-sm font-bold text-blue-600">{index + 1}</span>
                        </div>
                        <div>
                          <p className="font-medium">
                            {dest.city}, {dest.country}
                          </p>
                          <p className="text-sm text-gray-600">{dest.visits} visits</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">${dest.totalSpent}</p>
                        <p className="text-sm text-gray-600">spent</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Airline Performance */}
              <Card>
                <CardHeader>
                  <CardTitle>Airline Performance</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {analytics.preferredAirlines.map((airline) => (
                    <div key={airline.name} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{airline.name}</span>
                        <span className="text-sm text-gray-600">{airline.flights} flights</span>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-sm">
                          <span>On-time Performance</span>
                          <span>{airline.onTimePerformance}%</span>
                        </div>
                        <Progress value={airline.onTimePerformance} className="h-2" />
                      </div>
                      <div className="flex items-center justify-between text-sm text-gray-600">
                        <span>Avg. Cost: ${airline.averageCost}</span>
                        <span>Total: ${airline.totalSpent}</span>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Recent Bookings */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Travel History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {bookings.slice(0, 5).map((booking) => (
                    <div key={booking.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                          <Plane className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="font-medium">
                            {booking.route.origin} → {booking.route.destination}
                          </p>
                          <p className="text-sm text-gray-600">
                            {booking.airline} • {booking.flightNumber}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">${booking.price}</p>
                        <p className="text-sm text-gray-600">{booking.date}</p>
                        <Badge variant={booking.status === "completed" ? "default" : "secondary"} className="text-xs">
                          {booking.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="recommendations" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {recommendations.map((rec) => (
                <Card key={rec.id} className="overflow-hidden">
                  <CardContent className="p-0">
                    {rec.image && (
                      <div className="relative h-48">
                        <Image src={rec.image || "/placeholder.svg"} alt={rec.title} fill className="object-cover" />
                        <div className="absolute top-4 right-4">
                          <Badge variant="secondary">{rec.confidence}% match</Badge>
                        </div>
                      </div>
                    )}
                    <div className="p-6">
                      <div className="flex items-center gap-2 mb-2">
                        {rec.type === "destination" && <MapPin className="w-4 h-4 text-blue-600" />}
                        {rec.type === "deal" && <DollarSign className="w-4 h-4 text-green-600" />}
                        {rec.type === "timing" && <Clock className="w-4 h-4 text-orange-600" />}
                        {rec.type === "airline" && <Star className="w-4 h-4 text-purple-600" />}
                        <Badge variant="outline" className="capitalize">
                          {rec.type}
                        </Badge>
                      </div>
                      <h3 className="font-semibold text-lg mb-2">{rec.title}</h3>
                      <p className="text-gray-600 mb-4">{rec.description}</p>

                      {rec.route && (
                        <div className="flex items-center justify-between mb-4">
                          <span className="text-sm text-gray-600">
                            {rec.route.origin} → {rec.route.destination}
                          </span>
                          {rec.price && (
                            <div className="text-right">
                              <span className="text-lg font-bold text-green-600">${rec.price}</span>
                              {rec.savings && <p className="text-sm text-green-600">Save ${rec.savings}</p>}
                            </div>
                          )}
                        </div>
                      )}

                      {rec.validUntil && <p className="text-sm text-orange-600 mb-4">Valid until {rec.validUntil}</p>}

                      <div className="flex gap-2">
                        <Button className="flex-1">{rec.type === "deal" ? "Book Now" : "Learn More"}</Button>
                        <Button variant="outline" size="icon">
                          <Lightbulb className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default function AnalyticsPage() {
  return (
    <ProtectedRoute>
      <AnalyticsContent />
    </ProtectedRoute>
  )
}
