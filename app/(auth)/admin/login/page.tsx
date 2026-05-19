"use client"

import { motion } from "framer-motion"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Camera, Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function AdminLoginPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    // Simulate login - in production, this would be real authentication
    await new Promise((resolve) => setTimeout(resolve, 1000))
    router.push("/admin")
  }

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-champagne/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Camera className="w-8 h-8 text-dusty-rose" />
          </div>
          <h1 className="font-serif text-3xl font-medium text-foreground">
            Luminara
          </h1>
          <p className="text-muted-foreground mt-2">
            Sign in to your admin panel
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-card rounded-2xl p-8 shadow-sm border border-border/50">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                Email Address
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                defaultValue="admin@luminara.com"
                className="h-12 bg-background border-border/50 focus:border-dusty-rose"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  defaultValue="password123"
                  className="h-12 bg-background border-border/50 focus:border-dusty-rose pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-border text-dusty-rose focus:ring-dusty-rose"
                />
                <span className="text-sm text-muted-foreground">Remember me</span>
              </label>
              <a
                href="#"
                className="text-sm text-dusty-rose hover:text-dusty-rose/80 transition-colors"
              >
                Forgot password?
              </a>
            </div>

            <Button
              type="submit"
              size="lg"
              className="w-full text-sm tracking-wider uppercase"
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>
        </div>

        {/* Demo Notice */}
        <p className="text-center text-sm text-muted-foreground mt-6">
          Demo credentials are pre-filled. Just click Sign In.
        </p>
      </motion.div>
    </div>
  )
}
