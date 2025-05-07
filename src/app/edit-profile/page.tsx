"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Home, Gift, User, LogOut, Menu, ArrowLeft, Settings } from "lucide-react"
import Link from "next/link"
import { useEffect } from "react"
import { auth } from "@/app/firebase"
import { onAuthStateChanged } from "firebase/auth"

export default function EditProfile() {
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [user, setUser] = useState<{ displayName: string | null, email: string | null }>({ displayName: null, email: null })

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser({
          displayName: firebaseUser.displayName || "No Username",
          email: firebaseUser.email || "No Email"
        })
      }
    })
    return () => unsubscribe()
  }, [])

  const [profileData, setProfileData] = useState({
    fullName: "John Doe",
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567",
    address: "123 Main St",
    city: "Anytown",
    state: "CA",
    postalCode: "12345",
    bio: "I'm passionate about reducing food waste and helping my community.",
  })
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setProfileData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Here you would typically update the user profile in your backend
      console.log("Profile data:", profileData)

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Redirect to dashboard after successful update
      router.push("/dashboard")
    } catch (error) {
      console.error("Error updating profile:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Mobile sidebar toggle */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button variant="outline" size="icon" onClick={() => setSidebarOpen(!sidebarOpen)} className="bg-white">
          <Menu className="h-5 w-5" />
        </Button>
      </div>

      {/* Sidebar */}
      <div
        className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0
      `}
      >
        <div className="flex flex-col h-full">
          <div className="p-6 border-b">
            <h2 className="text-2xl font-bold text-green-600">FWRP</h2>
          </div>

          <div className="flex-1 py-6 px-4 space-y-6">
            <div className="flex flex-col items-center space-y-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src={avatarPreview || "/placeholder.svg?height=80&width=80"} alt="Profile" />
                <AvatarFallback>
                  <User className="h-10 w-10" />
                </AvatarFallback>
              </Avatar>
              <div className="text-center">
                <h3 className="font-medium">{user.displayName}</h3>
                <p className="text-sm text-gray-500">{user.email}</p>
              </div>
            </div>

            <nav className="mt-8 space-y-2">
              <Link href="/edit-profile" className="flex items-center p-3 bg-gray-100 text-green-600 rounded-md">
                <Settings className="h-5 w-5 mr-3" />
                Edit Profile
              </Link>
              <Link href="/dashboard" className="flex items-center p-3 text-gray-700 rounded-md hover:bg-gray-100">
                <Home className="h-5 w-5 mr-3" />
                Dashboard
              </Link>
              <Link href="/donate-food" className="flex items-center p-3 text-gray-700 rounded-md hover:bg-gray-100">
                <Gift className="h-5 w-5 mr-3" />
                Donate Food
              </Link>
            </nav>
          </div>

          <div className="p-4 border-t">
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link href="/login">
                <LogOut className="h-5 w-5 mr-3" />
                Sign out
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 lg:ml-64">
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center">
            <Link href="/dashboard" className="mr-4">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">Edit Profile</h1>
          </div>
        </header>
        <main className="max-w-3xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-6">Personal Information</h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="avatar">Profile Picture</Label>
                <div className="mt-1 flex items-center space-x-5">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={avatarPreview || "/placeholder.svg?height=80&width=80"} alt="Profile" />
                    <AvatarFallback>
                      <User className="h-10 w-10" />
                    </AvatarFallback>
                  </Avatar>
                  <label className="block">
                    <span className="sr-only">Choose profile picture</span>
                    <Input
                      id="avatar"
                      name="avatar"
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarChange}
                      className="block w-full text-sm text-gray-500
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-md file:border-0
                        file:text-sm file:font-semibold
                        file:bg-green-50 file:text-green-700
                        hover:file:bg-green-100"
                    />
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input id="fullName" name="fullName" value={profileData.fullName} onChange={handleChange} required />
                </div>

                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={profileData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" name="phone" value={profileData.phone} onChange={handleChange} required />
                </div>

                <div>
                  <Label htmlFor="address">Address</Label>
                  <Input id="address" name="address" value={profileData.address} onChange={handleChange} required />
                </div>

                <div>
                  <Label htmlFor="city">City</Label>
                  <Input id="city" name="city" value={profileData.city} onChange={handleChange} required />
                </div>

                <div>
                  <Label htmlFor="state">State/Province</Label>
                  <Input id="state" name="state" value={profileData.state} onChange={handleChange} required />
                </div>

                <div>
                  <Label htmlFor="postalCode">Postal Code</Label>
                  <Input
                    id="postalCode"
                    name="postalCode"
                    value={profileData.postalCode}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  name="bio"
                  value={profileData.bio}
                  onChange={handleChange}
                  placeholder="Tell us a bit about yourself"
                  rows={4}
                />
              </div>

              <div className="pt-4 flex justify-end space-x-4">
                <Button type="button" variant="outline" onClick={() => router.push("/dashboard")}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </form>
          </div>
        </main>
      </div>

      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}
    </div>
  )
}
