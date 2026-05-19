"use client"

import { motion } from "framer-motion"
import { useState } from "react"
import Image from "next/image"
import { AdminHeader, AdminCard } from "@/components/admin"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  User,
  Mail,
  Phone,
  MapPin,
  Instagram,
  Globe,
  Bell,
  Lock,
  Palette,
  Save,
  Upload,
} from "lucide-react"

export default function AdminSettingsPage() {
  const [isSaving, setIsSaving] = useState(false)
  const [activeTab, setActiveTab] = useState("profile")

  const handleSave = async () => {
    setIsSaving(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsSaving(false)
  }

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "contact", label: "Contact Info", icon: Mail },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "security", label: "Security", icon: Lock },
    { id: "appearance", label: "Appearance", icon: Palette },
  ]

  return (
    <>
      <AdminHeader
        title="Settings"
        description="Manage your account and preferences"
      />

      <main className="flex-1 p-6 overflow-auto">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar Tabs */}
          <div className="lg:col-span-1">
            <AdminCard title="Settings">
              <nav className="space-y-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                      activeTab === tab.id
                        ? "bg-champagne/30 text-foreground"
                        : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                    }`}
                  >
                    <tab.icon className="w-5 h-5" />
                    {tab.label}
                  </button>
                ))}
              </nav>
            </AdminCard>
          </div>

          {/* Content */}
          <div className="lg:col-span-3 space-y-6">
            {activeTab === "profile" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <AdminCard
                  title="Profile Information"
                  description="Update your personal details"
                >
                  {/* Avatar */}
                  <div className="flex items-center gap-6 mb-8">
                    <div className="relative w-24 h-24 rounded-full overflow-hidden">
                      <Image
                        src="/images/photographer-portrait.jpg"
                        alt="Profile"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <Button variant="outline" size="sm">
                        <Upload className="w-4 h-4 mr-2" />
                        Change Photo
                      </Button>
                      <p className="text-xs text-muted-foreground mt-2">
                        JPG or PNG. Max 2MB.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        defaultValue="Sofia"
                        className="h-12 bg-background border-border/50"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        defaultValue="Martinez"
                        className="h-12 bg-background border-border/50"
                      />
                    </div>
                  </div>

                  <div className="space-y-2 mt-6">
                    <Label htmlFor="bio">Bio</Label>
                    <textarea
                      id="bio"
                      rows={4}
                      defaultValue="Professional event photographer specializing in baby showers, birthdays, and baptisms. Capturing life's precious moments with elegance and artistry."
                      className="w-full px-4 py-3 rounded-lg border border-border/50 bg-background text-foreground focus:border-dusty-rose focus:outline-none focus:ring-1 focus:ring-dusty-rose resize-none"
                    />
                  </div>
                </AdminCard>
              </motion.div>
            )}

            {activeTab === "contact" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <AdminCard
                  title="Contact Information"
                  description="Update your public contact details"
                >
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="email" className="flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        Email Address
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        defaultValue="hello@luminara.com"
                        className="h-12 bg-background border-border/50"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone" className="flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        Phone Number
                      </Label>
                      <Input
                        id="phone"
                        type="tel"
                        defaultValue="+1 (555) 123-4567"
                        className="h-12 bg-background border-border/50"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="address" className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        Studio Address
                      </Label>
                      <Input
                        id="address"
                        defaultValue="123 Photography Lane, Suite 100"
                        className="h-12 bg-background border-border/50"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="instagram" className="flex items-center gap-2">
                        <Instagram className="w-4 h-4" />
                        Instagram
                      </Label>
                      <Input
                        id="instagram"
                        defaultValue="@luminara.photo"
                        className="h-12 bg-background border-border/50"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="website" className="flex items-center gap-2">
                        <Globe className="w-4 h-4" />
                        Website
                      </Label>
                      <Input
                        id="website"
                        type="url"
                        defaultValue="https://luminara.com"
                        className="h-12 bg-background border-border/50"
                      />
                    </div>
                  </div>
                </AdminCard>
              </motion.div>
            )}

            {activeTab === "notifications" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <AdminCard
                  title="Notification Preferences"
                  description="Choose what notifications you receive"
                >
                  <div className="space-y-6">
                    {[
                      {
                        title: "New Messages",
                        description: "Get notified when someone sends you a message",
                        defaultChecked: true,
                      },
                      {
                        title: "Booking Requests",
                        description: "Receive alerts for new booking inquiries",
                        defaultChecked: true,
                      },
                      {
                        title: "Weekly Summary",
                        description: "Get a weekly digest of your activity",
                        defaultChecked: false,
                      },
                      {
                        title: "Marketing Updates",
                        description: "Tips and updates about growing your business",
                        defaultChecked: false,
                      },
                    ].map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-4 rounded-xl bg-secondary/30"
                      >
                        <div>
                          <p className="font-medium text-foreground">{item.title}</p>
                          <p className="text-sm text-muted-foreground">
                            {item.description}
                          </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            defaultChecked={item.defaultChecked}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-muted rounded-full peer peer-checked:bg-dusty-rose peer-focus:ring-2 peer-focus:ring-dusty-rose/20 after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full" />
                        </label>
                      </div>
                    ))}
                  </div>
                </AdminCard>
              </motion.div>
            )}

            {activeTab === "security" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <AdminCard
                  title="Change Password"
                  description="Update your account password"
                >
                  <div className="space-y-6 max-w-md">
                    <div className="space-y-2">
                      <Label htmlFor="currentPassword">Current Password</Label>
                      <Input
                        id="currentPassword"
                        type="password"
                        className="h-12 bg-background border-border/50"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="newPassword">New Password</Label>
                      <Input
                        id="newPassword"
                        type="password"
                        className="h-12 bg-background border-border/50"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm New Password</Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        className="h-12 bg-background border-border/50"
                      />
                    </div>
                    <Button>Update Password</Button>
                  </div>
                </AdminCard>

                <AdminCard
                  title="Two-Factor Authentication"
                  description="Add an extra layer of security"
                >
                  <div className="flex items-center justify-between p-4 rounded-xl bg-secondary/30">
                    <div>
                      <p className="font-medium text-foreground">
                        Two-Factor Authentication
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Currently disabled
                      </p>
                    </div>
                    <Button variant="outline">Enable</Button>
                  </div>
                </AdminCard>
              </motion.div>
            )}

            {activeTab === "appearance" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <AdminCard
                  title="Appearance Settings"
                  description="Customize your dashboard appearance"
                >
                  <div className="space-y-6">
                    <div>
                      <p className="font-medium text-foreground mb-4">Theme</p>
                      <div className="grid grid-cols-3 gap-4">
                        {["Light", "Dark", "System"].map((theme) => (
                          <button
                            key={theme}
                            className={`p-4 rounded-xl border-2 text-center transition-all ${
                              theme === "Light"
                                ? "border-dusty-rose bg-champagne/20"
                                : "border-border/50 hover:border-border"
                            }`}
                          >
                            <div
                              className={`w-12 h-12 mx-auto rounded-lg mb-2 ${
                                theme === "Light"
                                  ? "bg-white border border-border"
                                  : theme === "Dark"
                                  ? "bg-foreground"
                                  : "bg-gradient-to-br from-white to-foreground"
                              }`}
                            />
                            <span className="text-sm font-medium">{theme}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <p className="font-medium text-foreground mb-4">
                        Accent Color
                      </p>
                      <div className="flex gap-3">
                        {[
                          "bg-dusty-rose",
                          "bg-champagne",
                          "bg-warm-gray",
                          "bg-blue-400",
                          "bg-green-400",
                        ].map((color, index) => (
                          <button
                            key={color}
                            className={`w-10 h-10 rounded-full ${color} ${
                              index === 0
                                ? "ring-2 ring-offset-2 ring-dusty-rose"
                                : ""
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </AdminCard>
              </motion.div>
            )}

            {/* Save Button */}
            <div className="flex justify-end">
              <Button onClick={handleSave} disabled={isSaving}>
                {isSaving ? (
                  "Saving..."
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
