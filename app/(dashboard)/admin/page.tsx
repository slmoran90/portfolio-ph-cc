"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import { AdminHeader, StatCard, AdminCard } from "@/components/admin"
import { Button } from "@/components/ui/button"
import {
  FolderOpen,
  Image as ImageIcon,
  MessageSquare,
  Eye,
  Plus,
  ArrowRight,
} from "lucide-react"
import { projects } from "@/lib/projects-data"

const recentMessages = [
  {
    id: 1,
    name: "Sarah Johnson",
    email: "sarah@email.com",
    subject: "Baby Shower Inquiry",
    date: "2 hours ago",
    read: false,
  },
  {
    id: 2,
    name: "Michael Chen",
    email: "michael@email.com",
    subject: "Birthday Party Quote",
    date: "5 hours ago",
    read: false,
  },
  {
    id: 3,
    name: "Emily Davis",
    email: "emily@email.com",
    subject: "Baptism Availability",
    date: "1 day ago",
    read: true,
  },
]

export default function AdminDashboard() {
  return (
    <>
      <AdminHeader
        title="Dashboard"
        description="Welcome back, Sofia. Here's what's happening."
      />
      
      <main className="flex-1 p-6 overflow-auto">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Projects"
            value={projects.length}
            change="+2 this month"
            changeType="positive"
            icon={FolderOpen}
          />
          <StatCard
            title="Gallery Images"
            value="156"
            change="+24 this week"
            changeType="positive"
            icon={ImageIcon}
          />
          <StatCard
            title="New Messages"
            value="12"
            change="3 unread"
            changeType="neutral"
            icon={MessageSquare}
          />
          <StatCard
            title="Site Views"
            value="2,847"
            change="+18% from last month"
            changeType="positive"
            icon={Eye}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Projects */}
          <AdminCard
            title="Recent Projects"
            description="Your latest photography projects"
            action={
              <Button asChild variant="outline" size="sm">
                <Link href="/admin/projects">
                  View All
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            }
          >
            <div className="space-y-4">
              {projects.slice(0, 4).map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="flex items-center gap-4 p-3 rounded-xl hover:bg-secondary/50 transition-colors"
                >
                  <div className="relative w-14 h-14 rounded-lg overflow-hidden shrink-0">
                    <Image
                      src={project.coverImage}
                      alt={project.title}
                      fill
                      className="object-cover"
                      sizes="56px"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground truncate">
                      {project.title}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {project.date}
                    </p>
                  </div>
                  <Button asChild variant="ghost" size="sm">
                    <Link href={`/admin/projects/${project.id}`}>
                      Edit
                    </Link>
                  </Button>
                </motion.div>
              ))}
            </div>
          </AdminCard>

          {/* Recent Messages */}
          <AdminCard
            title="Recent Messages"
            description="Latest contact form submissions"
            action={
              <Button asChild variant="outline" size="sm">
                <Link href="/admin/messages">
                  View All
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            }
          >
            <div className="space-y-4">
              {recentMessages.map((message, index) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className={`flex items-start gap-4 p-3 rounded-xl transition-colors ${
                    !message.read ? "bg-champagne/20" : "hover:bg-secondary/50"
                  }`}
                >
                  <div className="w-10 h-10 bg-cream rounded-full flex items-center justify-center shrink-0">
                    <span className="text-sm font-medium text-foreground">
                      {message.name.split(" ").map((n) => n[0]).join("")}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-foreground truncate">
                        {message.name}
                      </p>
                      {!message.read && (
                        <span className="w-2 h-2 bg-dusty-rose rounded-full shrink-0" />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground truncate">
                      {message.subject}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {message.date}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </AdminCard>
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="mt-6 p-6 bg-cream rounded-2xl"
        >
          <h3 className="font-serif text-lg font-medium text-foreground mb-4">
            Quick Actions
          </h3>
          <div className="flex flex-wrap gap-3">
            <Button asChild>
              <Link href="/admin/projects/new">
                <Plus className="w-4 h-4 mr-2" />
                New Project
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/admin/gallery">
                <ImageIcon className="w-4 h-4 mr-2" />
                Upload Images
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/" target="_blank">
                <Eye className="w-4 h-4 mr-2" />
                View Site
              </Link>
            </Button>
          </div>
        </motion.div>
      </main>
    </>
  )
}
