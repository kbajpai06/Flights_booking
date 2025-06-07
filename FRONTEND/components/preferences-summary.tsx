"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Settings, Heart, Ban, MapPin, Utensils } from "lucide-react"
import { usePreferences } from "@/contexts/preferences-context"
import { useRouter } from "next/navigation"

export function PreferencesSummary() {
  const { preferences } = usePreferences()
  const router = useRouter()

  const hasPreferences =
    preferences.airlines.preferred.length > 0 ||
    preferences.airlines.blocked.length > 0 ||
    preferences.seating.preferredType !== "any" ||
    preferences.travel.class !== "economy"

  if (!hasPreferences) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <Settings className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <h3 className="font-semibold mb-2">Set Your Travel Preferences</h3>
          <p className="text-sm text-gray-600 mb-4">
            Save time on future bookings by setting your preferred airlines, seating, and travel options.
          </p>
          <Button onClick={() => router.push("/preferences")}>Set Preferences</Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Your Preferences
          </CardTitle>
          <Button variant="outline" size="sm" onClick={() => router.push("/preferences")}>
            Edit
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {preferences.airlines.preferred.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Heart className="w-4 h-4 text-red-500" />
              <span className="text-sm font-medium">Preferred Airlines</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {preferences.airlines.preferred.slice(0, 3).map((airline) => (
                <Badge key={airline} variant="secondary" className="text-xs">
                  {airline}
                </Badge>
              ))}
              {preferences.airlines.preferred.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{preferences.airlines.preferred.length - 3} more
                </Badge>
              )}
            </div>
          </div>
        )}

        {preferences.airlines.blocked.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Ban className="w-4 h-4 text-red-500" />
              <span className="text-sm font-medium">Blocked Airlines</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {preferences.airlines.blocked.slice(0, 2).map((airline) => (
                <Badge key={airline} variant="destructive" className="text-xs">
                  {airline}
                </Badge>
              ))}
              {preferences.airlines.blocked.length > 2 && (
                <Badge variant="outline" className="text-xs">
                  +{preferences.airlines.blocked.length - 2} more
                </Badge>
              )}
            </div>
          </div>
        )}

        {preferences.seating.preferredType !== "any" && (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="w-4 h-4 text-blue-500" />
              <span className="text-sm font-medium">Seating</span>
            </div>
            <Badge variant="outline" className="text-xs capitalize">
              {preferences.seating.preferredType} seat
            </Badge>
          </div>
        )}

        {preferences.travel.class !== "economy" && (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Utensils className="w-4 h-4 text-purple-500" />
              <span className="text-sm font-medium">Travel Class</span>
            </div>
            <Badge variant="outline" className="text-xs capitalize">
              {preferences.travel.class.replace("-", " ")}
            </Badge>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
