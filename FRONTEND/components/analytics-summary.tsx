"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, Plane, MapPin, DollarSign, BarChart3 } from "lucide-react"
import { useAnalytics } from "@/contexts/analytics-context"
import { useRouter } from "next/navigation"

export function AnalyticsSummary() {
  const { travelData, isLoading } = useAnalytics()
  const router = useRouter()

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <BarChart3 className="w-8 h-8 animate-pulse mx-auto mb-2 text-gray-400" />
          <p className="text-sm text-gray-600">Loading analytics...</p>
        </CardContent>
      </Card>
    )
  }

  if (!travelData) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <BarChart3 className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <h3 className="font-semibold mb-2">Travel Analytics</h3>
          <p className="text-sm text-gray-600 mb-4">
            Book your first flight to start tracking your travel patterns and get personalized insights.
          </p>
          <Button onClick={() => router.push("/analytics")}>View Analytics</Button>
        </CardContent>
      </Card>
    )
  }

  const { analytics } = travelData

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Travel Insights
          </CardTitle>
          <Button variant="outline" size="sm" onClick={() => router.push("/analytics")}>
            View All
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <Plane className="w-6 h-6 mx-auto mb-1 text-blue-600" />
            <p className="text-lg font-bold">{analytics.totalFlights}</p>
            <p className="text-xs text-gray-600">Total Flights</p>
          </div>
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <DollarSign className="w-6 h-6 mx-auto mb-1 text-green-600" />
            <p className="text-lg font-bold">${analytics.totalSpent}</p>
            <p className="text-xs text-gray-600">Total Spent</p>
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-2">
            <MapPin className="w-4 h-4 text-purple-600" />
            <span className="text-sm font-medium">Top Destinations</span>
          </div>
          <div className="space-y-1">
            {analytics.favoriteDestinations.slice(0, 3).map((dest, index) => (
              <div key={dest.code} className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2">
                  <Badge variant="outline" className="w-6 h-6 p-0 text-xs">
                    {index + 1}
                  </Badge>
                  {dest.city}
                </span>
                <span className="text-gray-600">{dest.visits} visits</span>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-2 border-t">
          <div className="flex items-center gap-2 text-sm text-green-600">
            <TrendingUp className="w-4 h-4" />
            <span>Saved ${analytics.costSavings.totalSaved} this year</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
