"use client"

import { motion } from "framer-motion"
import { useState } from "react"
import { AdminHeader, AdminCard, EmptyState } from "@/components/admin"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Search,
  Mail,
  Trash2,
  Archive,
  MailOpen,
  Reply,
  Star,
  MessageSquare,
  ChevronRight,
} from "lucide-react"

interface Message {
  id: number
  name: string
  email: string
  phone: string
  eventType: string
  subject: string
  message: string
  date: string
  read: boolean
  starred: boolean
}

const initialMessages: Message[] = [
  {
    id: 1,
    name: "Sarah Johnson",
    email: "sarah@email.com",
    phone: "+1 555-0123",
    eventType: "Baby Shower",
    subject: "Baby Shower Photography Inquiry",
    message: "Hi Sofia! I'm planning a baby shower for my sister in May and would love to discuss your availability and packages. The event will be at a beautiful garden venue and we're expecting about 40 guests. Looking forward to hearing from you!",
    date: "2024-03-15 14:30",
    read: false,
    starred: false,
  },
  {
    id: 2,
    name: "Michael Chen",
    email: "michael@email.com",
    phone: "+1 555-0456",
    eventType: "Birthday",
    subject: "5th Birthday Party Quote Request",
    message: "Hello! My son is turning 5 next month and we're planning a superhero-themed party. Could you please send me your pricing for a 3-hour event? We'd also love to include some individual portraits if possible.",
    date: "2024-03-15 10:15",
    read: false,
    starred: true,
  },
  {
    id: 3,
    name: "Emily Davis",
    email: "emily@email.com",
    phone: "+1 555-0789",
    eventType: "Baptism",
    subject: "Baptism Ceremony Photography",
    message: "Dear Sofia, we're planning our daughter's baptism for April 20th at St. Mary's Cathedral. The ceremony will be followed by a small reception. Are you available on that date? What packages do you offer for religious ceremonies?",
    date: "2024-03-14 16:45",
    read: true,
    starred: false,
  },
  {
    id: 4,
    name: "Jessica Williams",
    email: "jessica@email.com",
    phone: "+1 555-0321",
    eventType: "Baby Shower",
    subject: "Bohemian Baby Shower",
    message: "Hi! I loved your portfolio, especially the bohemian-themed shoots. I'm hosting a baby shower next month with a similar aesthetic and would love to book you. Can we schedule a call to discuss the details?",
    date: "2024-03-13 09:20",
    read: true,
    starred: true,
  },
  {
    id: 5,
    name: "David Martinez",
    email: "david@email.com",
    phone: "+1 555-0654",
    eventType: "Birthday",
    subject: "Twin Birthday Party",
    message: "Hello Sofia! We're celebrating our twins' 3rd birthday and need a photographer who can capture all the chaos and fun. The party will be at our home with about 25 kids. Do you have any availability in June?",
    date: "2024-03-12 11:00",
    read: true,
    starred: false,
  },
]

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState(initialMessages)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null)
  const [filter, setFilter] = useState<"all" | "unread" | "starred">("all")

  const filteredMessages = messages.filter((message) => {
    const matchesSearch =
      message.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      message.subject.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter =
      filter === "all" ||
      (filter === "unread" && !message.read) ||
      (filter === "starred" && message.starred)
    return matchesSearch && matchesFilter
  })

  const unreadCount = messages.filter((m) => !m.read).length

  const markAsRead = (id: number) => {
    setMessages((prev) =>
      prev.map((m) => (m.id === id ? { ...m, read: true } : m))
    )
  }

  const toggleStar = (id: number) => {
    setMessages((prev) =>
      prev.map((m) => (m.id === id ? { ...m, starred: !m.starred } : m))
    )
  }

  const deleteMessage = (id: number) => {
    setMessages((prev) => prev.filter((m) => m.id !== id))
    if (selectedMessage?.id === id) setSelectedMessage(null)
  }

  const openMessage = (message: Message) => {
    setSelectedMessage(message)
    markAsRead(message.id)
  }

  return (
    <>
      <AdminHeader
        title="Messages"
        description={`${unreadCount} unread message${unreadCount !== 1 ? "s" : ""}`}
      />

      <main className="flex-1 p-6 overflow-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-180px)]">
          {/* Message List */}
          <div className="lg:col-span-1 flex flex-col">
            <AdminCard title="Inbox" description="Contact form submissions">
              {/* Search & Filters */}
              <div className="space-y-4 mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search messages..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-background border-border/50"
                  />
                </div>
                <div className="flex gap-2">
                  {(["all", "unread", "starred"] as const).map((f) => (
                    <button
                      key={f}
                      onClick={() => setFilter(f)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                        filter === f
                          ? "bg-foreground text-background"
                          : "bg-secondary text-muted-foreground hover:bg-secondary/80"
                      }`}
                    >
                      {f.charAt(0).toUpperCase() + f.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Messages List */}
              <div className="space-y-2 max-h-[500px] overflow-y-auto">
                {filteredMessages.length === 0 ? (
                  <EmptyState
                    icon={MessageSquare}
                    title="No messages"
                    description="No messages match your current filter."
                  />
                ) : (
                  filteredMessages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      onClick={() => openMessage(message)}
                      className={`p-4 rounded-xl cursor-pointer transition-colors ${
                        selectedMessage?.id === message.id
                          ? "bg-champagne/30"
                          : !message.read
                          ? "bg-cream hover:bg-champagne/20"
                          : "hover:bg-secondary/50"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-cream rounded-full flex items-center justify-center shrink-0">
                          <span className="text-sm font-medium text-foreground">
                            {message.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p
                              className={`font-medium truncate ${
                                !message.read
                                  ? "text-foreground"
                                  : "text-muted-foreground"
                              }`}
                            >
                              {message.name}
                            </p>
                            {message.starred && (
                              <Star className="w-3 h-3 fill-champagne text-champagne shrink-0" />
                            )}
                          </div>
                          <p className="text-sm text-foreground truncate">
                            {message.subject}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {new Date(message.date).toLocaleDateString()}
                          </p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </AdminCard>
          </div>

          {/* Message Detail */}
          <div className="lg:col-span-2">
            <AdminCard title="Message Details">
              {selectedMessage ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-6"
                >
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className="w-14 h-14 bg-cream rounded-full flex items-center justify-center">
                        <span className="text-lg font-medium text-foreground">
                          {selectedMessage.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-serif text-xl font-medium text-foreground">
                          {selectedMessage.name}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {selectedMessage.email}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {selectedMessage.phone}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleStar(selectedMessage.id)}
                      >
                        <Star
                          className={`w-4 h-4 ${
                            selectedMessage.starred
                              ? "fill-champagne text-champagne"
                              : ""
                          }`}
                        />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Archive className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteMessage(selectedMessage.id)}
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  </div>

                  {/* Meta */}
                  <div className="flex flex-wrap gap-4 p-4 bg-secondary/30 rounded-xl">
                    <div>
                      <p className="text-xs text-muted-foreground">Event Type</p>
                      <p className="font-medium text-foreground">
                        {selectedMessage.eventType}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Received</p>
                      <p className="font-medium text-foreground">
                        {new Date(selectedMessage.date).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {/* Subject */}
                  <div>
                    <h4 className="font-serif text-lg font-medium text-foreground mb-2">
                      {selectedMessage.subject}
                    </h4>
                    <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                      {selectedMessage.message}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 pt-4 border-t border-border/50">
                    <Button>
                      <Reply className="w-4 h-4 mr-2" />
                      Reply via Email
                    </Button>
                    <Button variant="outline">
                      <MailOpen className="w-4 h-4 mr-2" />
                      Mark as Unread
                    </Button>
                  </div>
                </motion.div>
              ) : (
                <EmptyState
                  icon={Mail}
                  title="Select a message"
                  description="Choose a message from the list to view its details."
                />
              )}
            </AdminCard>
          </div>
        </div>
      </main>
    </>
  )
}
