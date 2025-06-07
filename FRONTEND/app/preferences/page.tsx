"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { Plane, Bell, CreditCard, Utensils, MapPin, X, Plus, Heart, Ban } from "lucide-react"
import { usePreferences } from "@/contexts/preferences-context"
import { ProtectedRoute } from "@/components/protected-route"

const AIRLINES = [
  "American Airlines",
  "Delta Airlines",
  "United Airlines",
  "Southwest Airlines",
  "JetBlue Airways",
  "Alaska Airlines",
  "Spirit Airlines",
  "Frontier Airlines",
  "British Airways",
  "Lufthansa",
  "Air France",
  "Emirates",
  "Qatar Airways",
  "Singapore Airlines",
]

const SPECIAL_ASSISTANCE_OPTIONS = [
  "Wheelchair assistance",
  "Visual impairment assistance",
  "Hearing impairment assistance",
  "Cognitive/developmental assistance",
  "Mobility assistance",
  "Oxygen assistance",
  "Service animal",
  "Unaccompanied minor",
]

function PreferencesContent() {
  const { preferences, updatePreferences, resetPreferences } = usePreferences()
  const [success, setSuccess] = useState("")
  const [newAirline, setNewAirline] = useState("")

  const showSuccess = (message: string) => {
    setSuccess(message)
    setTimeout(() => setSuccess(""), 3000)
  }

  const addPreferredAirline = () => {
    if (newAirline && !preferences.airlines.preferred.includes(newAirline)) {
      updatePreferences({
        airlines: {
          ...preferences.airlines,
          preferred: [...preferences.airlines.preferred, newAirline],
        },
      })
      setNewAirline("")
      showSuccess("Preferred airline added!")
    }
  }

  const removePreferredAirline = (airline: string) => {
    updatePreferences({
      airlines: {
        ...preferences.airlines,
        preferred: preferences.airlines.preferred.filter((a) => a !== airline),
      },
    })
    showSuccess("Preferred airline removed!")
  }

  const addBlockedAirline = (airline: string) => {
    if (!preferences.airlines.blocked.includes(airline)) {
      updatePreferences({
        airlines: {
          ...preferences.airlines,
          blocked: [...preferences.airlines.blocked, airline],
          preferred: preferences.airlines.preferred.filter((a) => a !== airline),
        },
      })
      showSuccess("Airline blocked!")
    }
  }

  const removeBlockedAirline = (airline: string) => {
    updatePreferences({
      airlines: {
        ...preferences.airlines,
        blocked: preferences.airlines.blocked.filter((a) => a !== airline),
      },
    })
    showSuccess("Airline unblocked!")
  }

  const updateSeatingPreference = (field: string, value: any) => {
    updatePreferences({
      seating: {
        ...preferences.seating,
        [field]: value,
      },
    })
    showSuccess("Seating preference updated!")
  }

  const updateTravelPreference = (field: string, value: any) => {
    updatePreferences({
      travel: {
        ...preferences.travel,
        [field]: value,
      },
    })
    showSuccess("Travel preference updated!")
  }

  const updateNotificationPreference = (field: string, value: any) => {
    updatePreferences({
      notifications: {
        ...preferences.notifications,
        [field]: value,
      },
    })
    showSuccess("Notification preference updated!")
  }

  const updateBookingPreference = (field: string, value: any) => {
    updatePreferences({
      booking: {
        ...preferences.booking,
        [field]: value,
      },
    })
    showSuccess("Booking preference updated!")
  }

  const toggleSpecialAssistance = (assistance: string) => {
    const current = preferences.travel.specialAssistance
    const updated = current.includes(assistance) ? current.filter((a) => a !== assistance) : [...current, assistance]

    updateTravelPreference("specialAssistance", updated)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Travel Preferences</h1>
            <p className="text-gray-600">Customize your travel experience and save time on future bookings</p>
          </div>

          {success && (
            <Alert className="mb-6">
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}

          <Tabs defaultValue="airlines" className="space-y-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="airlines" className="flex items-center gap-2">
                <Plane className="w-4 h-4" />
                Airlines
              </TabsTrigger>
              <TabsTrigger value="seating" className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Seating
              </TabsTrigger>
              <TabsTrigger value="travel" className="flex items-center gap-2">
                <Utensils className="w-4 h-4" />
                Travel
              </TabsTrigger>
              <TabsTrigger value="notifications" className="flex items-center gap-2">
                <Bell className="w-4 h-4" />
                Notifications
              </TabsTrigger>
              <TabsTrigger value="booking" className="flex items-center gap-2">
                <CreditCard className="w-4 h-4" />
                Booking
              </TabsTrigger>
            </TabsList>

            <TabsContent value="airlines">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Heart className="w-5 h-5 text-red-500" />
                      Preferred Airlines
                    </CardTitle>
                    <p className="text-sm text-gray-600">
                      Airlines you prefer to fly with. These will be prioritized in search results.
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex gap-2">
                      <Select value={newAirline} onValueChange={setNewAirline}>
                        <SelectTrigger className="flex-1">
                          <SelectValue placeholder="Select an airline to add" />
                        </SelectTrigger>
                        <SelectContent>
                          {AIRLINES.filter(
                            (airline) =>
                              !preferences.airlines.preferred.includes(airline) &&
                              !preferences.airlines.blocked.includes(airline),
                          ).map((airline) => (
                            <SelectItem key={airline} value={airline}>
                              {airline}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Button onClick={addPreferredAirline} disabled={!newAirline}>
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {preferences.airlines.preferred.map((airline) => (
                        <Badge key={airline} variant="secondary" className="flex items-center gap-2">
                          {airline}
                          <button onClick={() => removePreferredAirline(airline)} className="hover:text-red-500">
                            <X className="w-3 h-3" />
                          </button>
                        </Badge>
                      ))}
                      {preferences.airlines.preferred.length === 0 && (
                        <p className="text-sm text-gray-500">No preferred airlines selected</p>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Ban className="w-5 h-5 text-red-500" />
                      Blocked Airlines
                    </CardTitle>
                    <p className="text-sm text-gray-600">
                      Airlines you prefer to avoid. These will be hidden from search results.
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {AIRLINES.filter(
                        (airline) =>
                          !preferences.airlines.preferred.includes(airline) &&
                          !preferences.airlines.blocked.includes(airline),
                      ).map((airline) => (
                        <Button
                          key={airline}
                          variant="outline"
                          size="sm"
                          onClick={() => addBlockedAirline(airline)}
                          className="justify-start"
                        >
                          <Ban className="w-3 h-3 mr-2" />
                          {airline}
                        </Button>
                      ))}
                    </div>

                    {preferences.airlines.blocked.length > 0 && (
                      <>
                        <Separator />
                        <div className="space-y-2">
                          <Label className="text-sm font-medium">Currently Blocked:</Label>
                          <div className="flex flex-wrap gap-2">
                            {preferences.airlines.blocked.map((airline) => (
                              <Badge key={airline} variant="destructive" className="flex items-center gap-2">
                                {airline}
                                <button onClick={() => removeBlockedAirline(airline)} className="hover:text-white">
                                  <X className="w-3 h-3" />
                                </button>
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="seating">
              <Card>
                <CardHeader>
                  <CardTitle>Seating Preferences</CardTitle>
                  <p className="text-sm text-gray-600">
                    Set your preferred seat type and location for automatic selection.
                  </p>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label>Preferred Seat Type</Label>
                      <Select
                        value={preferences.seating.preferredType}
                        onValueChange={(value) => updateSeatingPreference("preferredType", value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="window">Window</SelectItem>
                          <SelectItem value="aisle">Aisle</SelectItem>
                          <SelectItem value="middle">Middle</SelectItem>
                          <SelectItem value="any">No Preference</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Preferred Section</Label>
                      <Select
                        value={preferences.seating.preferredSection}
                        onValueChange={(value) => updateSeatingPreference("preferredSection", value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="front">Front of Plane</SelectItem>
                          <SelectItem value="middle">Middle of Plane</SelectItem>
                          <SelectItem value="back">Back of Plane</SelectItem>
                          <SelectItem value="any">No Preference</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="extraLegroom"
                      checked={preferences.seating.extraLegroom}
                      onCheckedChange={(checked) => updateSeatingPreference("extraLegroom", checked)}
                    />
                    <Label htmlFor="extraLegroom">Prefer extra legroom seats (may incur additional cost)</Label>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="travel">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Travel Class & Meals</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label>Preferred Travel Class</Label>
                        <Select
                          value={preferences.travel.class}
                          onValueChange={(value) => updateTravelPreference("class", value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="economy">Economy</SelectItem>
                            <SelectItem value="premium-economy">Premium Economy</SelectItem>
                            <SelectItem value="business">Business</SelectItem>
                            <SelectItem value="first">First Class</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>Meal Preference</Label>
                        <Select
                          value={preferences.travel.mealPreference}
                          onValueChange={(value) => updateTravelPreference("mealPreference", value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="standard">Standard</SelectItem>
                            <SelectItem value="vegetarian">Vegetarian</SelectItem>
                            <SelectItem value="vegan">Vegan</SelectItem>
                            <SelectItem value="kosher">Kosher</SelectItem>
                            <SelectItem value="halal">Halal</SelectItem>
                            <SelectItem value="gluten-free">Gluten-Free</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Special Assistance</CardTitle>
                    <p className="text-sm text-gray-600">Select any special assistance you may need during travel.</p>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {SPECIAL_ASSISTANCE_OPTIONS.map((assistance) => (
                        <div key={assistance} className="flex items-center space-x-2">
                          <Checkbox
                            id={assistance}
                            checked={preferences.travel.specialAssistance.includes(assistance)}
                            onCheckedChange={() => toggleSpecialAssistance(assistance)}
                          />
                          <Label htmlFor={assistance} className="text-sm">
                            {assistance}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="notifications">
              <Card>
                <CardHeader>
                  <CardTitle>Notification Preferences</CardTitle>
                  <p className="text-sm text-gray-600">Choose how and when you want to receive notifications.</p>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="font-medium">Price Alerts</Label>
                        <p className="text-sm text-gray-600">Get notified when flight prices drop</p>
                      </div>
                      <Checkbox
                        checked={preferences.notifications.priceAlerts}
                        onCheckedChange={(checked) => updateNotificationPreference("priceAlerts", checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="font-medium">Flight Updates</Label>
                        <p className="text-sm text-gray-600">Receive updates about your booked flights</p>
                      </div>
                      <Checkbox
                        checked={preferences.notifications.flightUpdates}
                        onCheckedChange={(checked) => updateNotificationPreference("flightUpdates", checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="font-medium">Promotions</Label>
                        <p className="text-sm text-gray-600">Receive promotional offers and deals</p>
                      </div>
                      <Checkbox
                        checked={preferences.notifications.promotions}
                        onCheckedChange={(checked) => updateNotificationPreference("promotions", checked)}
                      />
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <Label>Flight Reminder Time</Label>
                    <Select
                      value={preferences.notifications.reminderTime.toString()}
                      onValueChange={(value) => updateNotificationPreference("reminderTime", Number.parseInt(value))}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="2">2 hours before</SelectItem>
                        <SelectItem value="6">6 hours before</SelectItem>
                        <SelectItem value="12">12 hours before</SelectItem>
                        <SelectItem value="24">24 hours before</SelectItem>
                        <SelectItem value="48">48 hours before</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="booking">
              <Card>
                <CardHeader>
                  <CardTitle>Booking Preferences</CardTitle>
                  <p className="text-sm text-gray-600">Customize your booking experience for faster checkouts.</p>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="font-medium">Auto-fill Passenger Information</Label>
                        <p className="text-sm text-gray-600">Automatically fill your details for the first passenger</p>
                      </div>
                      <Checkbox
                        checked={preferences.booking.autoFillPassengerInfo}
                        onCheckedChange={(checked) => updateBookingPreference("autoFillPassengerInfo", checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="font-medium">Save Payment Methods</Label>
                        <p className="text-sm text-gray-600">Securely save payment methods for faster checkout</p>
                      </div>
                      <Checkbox
                        checked={preferences.booking.savePaymentMethods}
                        onCheckedChange={(checked) => updateBookingPreference("savePaymentMethods", checked)}
                      />
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <Label>Default Currency</Label>
                    <Select
                      value={preferences.booking.defaultCurrency}
                      onValueChange={(value) => updateBookingPreference("defaultCurrency", value)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="USD">USD - US Dollar</SelectItem>
                        <SelectItem value="EUR">EUR - Euro</SelectItem>
                        <SelectItem value="GBP">GBP - British Pound</SelectItem>
                        <SelectItem value="CAD">CAD - Canadian Dollar</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="flex gap-4 mt-8">
            <Button
              variant="destructive"
              onClick={() => {
                resetPreferences()
                showSuccess("All preferences reset to default!")
              }}
            >
              Reset All Preferences
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function PreferencesPage() {
  return (
    <ProtectedRoute>
      <PreferencesContent />
    </ProtectedRoute>
  )
}
