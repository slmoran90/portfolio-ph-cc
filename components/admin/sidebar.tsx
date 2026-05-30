"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  LayoutDashboard,
  FolderOpen,
  Image as ImageIcon,
  Layers,
  Star,
  Settings,
  LogOut,
  Menu,
  X,
} from "lucide-react"
import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/browser"
import type { SiteSettings } from "@/lib/data/site-settings.types"

const sidebarLinks = [
  { href: "/admin", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/admin/projects", icon: FolderOpen, label: "Projects" },
  { href: "/admin/gallery", icon: ImageIcon, label: "Gallery" },
  { href: "/admin/services", icon: Layers, label: "Services" },
  { href: "/admin/testimonials", icon: Star, label: "Testimonials" },
  { href: "/admin/settings", icon: Settings, label: "Settings" },
]

function getInitials(fullName: string | null): string {
  if (!fullName) return "C"
  const words = fullName.trim().split(/\s+/)
  const initials = words.slice(0, 2).map((w) => w[0].toUpperCase()).join("")
  return initials || "C"
}

export function AdminSidebar({ siteSettings }: { siteSettings: SiteSettings | null }) {
  const pathname = usePathname()
  const router = useRouter()
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [isDesktop, setIsDesktop] = useState(true)

  useEffect(() => {
    const checkDesktop = () => setIsDesktop(window.innerWidth >= 1024)
    checkDesktop()
    window.addEventListener("resize", checkDesktop)
    return () => window.removeEventListener("resize", checkDesktop)
  }, [])

  const isActive = (href: string) => {
    if (href === "/admin") return pathname === "/admin"
    return pathname.startsWith(href)
  }

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.refresh()
    router.push("/admin/login")
  }

  const fullName = siteSettings?.full_name || null
  const initials = getInitials(fullName)
  const profileImageUrl = siteSettings?.profile_image_url || null

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-background rounded-lg border border-border shadow-sm"
        aria-label="Toggle menu"
      >
        {isMobileOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-foreground/50 z-40"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <motion.aside
        initial={{ x: -280 }}
        animate={{ x: isDesktop ? 0 : (isMobileOpen ? 0 : -280) }}
        className={`fixed lg:static inset-y-0 left-0 z-40 w-64 bg-sidebar border-r border-sidebar-border flex flex-col transition-transform`}
      >
        {/* Profile Header */}
        <div className="p-6 border-b border-sidebar-border">
          <Link href="/admin" className="flex items-center gap-3">
            {profileImageUrl ? (
              <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 bg-secondary border border-border/50">
                <img
                  src={profileImageUrl}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="w-12 h-12 bg-champagne rounded-full flex items-center justify-center shrink-0">
                <span className="font-medium text-foreground text-lg">{initials}</span>
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="font-serif text-lg font-medium text-sidebar-foreground truncate">
                {fullName || "Carla Cáceres"}
              </p>
              <p className="text-xs text-foreground-muted">Admin Panel</p>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          {sidebarLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsMobileOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive(link.href)
                  ? "bg-sidebar-accent text-sidebar-foreground"
                  : "text-foreground-muted hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
              }`}
            >
              <link.icon className="w-5 h-5" />
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Logout Footer */}
        <div className="p-4 border-t border-sidebar-border">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-foreground-muted hover:bg-destructive/10 hover:text-destructive transition-all duration-200 w-full"
          >
            <LogOut className="w-5 h-5" />
            Cerrar sesión
          </button>
        </div>
      </motion.aside>
    </>
  )
}
