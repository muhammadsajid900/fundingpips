"use client"

import { useState } from "react"
import { User, Bell, Shield, HelpCircle, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useWatchlistStore } from "@/store/watchlist-store"

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false)
  const [profile, setProfile] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    notifications: {
      priceAlerts: true,
      marketNews: false,
      weeklyReport: true,
    },
  })

  const { watchlist, clearWatchlist } = useWatchlistStore()

  const handleSave = () => {
    setIsEditing(false)
    // Here you would typically save to an API
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Profile</h1>
          <p className="text-slate-600">Manage your account settings and preferences</p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
              <TabsTrigger value="help">Help</TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Personal Information
                  </CardTitle>
                  <CardDescription>Update your personal details and preferences</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        value={profile.name}
                        onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                        disabled={!isEditing}
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={profile.email}
                        onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                        disabled={!isEditing}
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-2">
                    {isEditing ? (
                      <>
                        <Button variant="outline" onClick={() => setIsEditing(false)}>
                          Cancel
                        </Button>
                        <Button onClick={handleSave}>Save Changes</Button>
                      </>
                    ) : (
                      <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Account Statistics</CardTitle>
                  <CardDescription>Your activity summary</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-slate-900">{watchlist.length}</div>
                      <div className="text-sm text-slate-600">Stocks in Watchlist</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-slate-900">0</div>
                      <div className="text-sm text-slate-600">Price Alerts</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-slate-900">30</div>
                      <div className="text-sm text-slate-600">Days Active</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notifications" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="w-5 h-5" />
                    Notification Preferences
                  </CardTitle>
                  <CardDescription>Choose what notifications you want to receive</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Price Alerts</div>
                      <div className="text-sm text-slate-600">
                        Get notified when your watchlist stocks hit target prices
                      </div>
                    </div>
                    <Switch
                      checked={profile.notifications.priceAlerts}
                      onCheckedChange={(checked) =>
                        setProfile({
                          ...profile,
                          notifications: { ...profile.notifications, priceAlerts: checked },
                        })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Market News</div>
                      <div className="text-sm text-slate-600">Receive important market news and updates</div>
                    </div>
                    <Switch
                      checked={profile.notifications.marketNews}
                      onCheckedChange={(checked) =>
                        setProfile({
                          ...profile,
                          notifications: { ...profile.notifications, marketNews: checked },
                        })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Weekly Report</div>
                      <div className="text-sm text-slate-600">Get a weekly summary of your portfolio performance</div>
                    </div>
                    <Switch
                      checked={profile.notifications.weeklyReport}
                      onCheckedChange={(checked) =>
                        setProfile({
                          ...profile,
                          notifications: { ...profile.notifications, weeklyReport: checked },
                        })
                      }
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="security" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    Security Settings
                  </CardTitle>
                  <CardDescription>Manage your account security and data</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button variant="outline" className="w-full justify-start">
                    Change Password
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    Enable Two-Factor Authentication
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    Download My Data
                  </Button>
                  <div className="pt-4 border-t">
                    <Button variant="destructive" className="w-full" onClick={clearWatchlist}>
                      Clear All Watchlist Data
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="help" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <HelpCircle className="w-5 h-5" />
                    Help & Support
                  </CardTitle>
                  <CardDescription>Get help and support for using FundingPips</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button variant="outline" className="w-full justify-start">
                    View Documentation
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    Contact Support
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    Report a Bug
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    Feature Requests
                  </Button>
                  <div className="pt-4 border-t">
                    <Button variant="outline" className="w-full text-red-600 hover:text-red-700">
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign Out
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </main>
  )
}
