"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send, RefreshCw, MessageSquare, Users, Search, ArrowLeft } from "lucide-react"
import { toast } from "sonner"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"

interface Message {
  _id: string
  senderId: string
  senderName: string
  senderRole: string
  receiverId?: string
  content: string
  isGroupMessage: boolean
  createdAt: string
}

interface UserContact {
  _id: string
  email: string
  firstName: string
  lastName: string
  role: string
  department?: string
  lastMessage?: string
  lastMessageAt?: string
}

export default function StudentMessagesPage() {
  const { user } = useAuth()
  const [messages, setMessages] = useState<Message[]>([])
  const [users, setUsers] = useState<UserContact[]>([])
  const [selectedUser, setSelectedUser] = useState<UserContact | null>(null)
  const [newMessage, setNewMessage] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(false)
  const [sending, setSending] = useState(false)
  const [view, setView] = useState<"contacts" | "chat">("contacts")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  // Fetch all users for contacts list
  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/messages?type=users")
      if (response.ok) {
        const data = await response.json()
        setUsers(data.users || [])
      }
    } catch (error) {
      console.error("Error fetching users:", error)
    }
  }

  // Fetch messages for selected conversation
  const fetchMessages = async (userId?: string) => {
    try {
      setLoading(true)
      const url = userId ? `/api/messages?userId=${userId}` : "/api/messages"
      const response = await fetch(url)

      if (response.ok) {
        const data = await response.json()
        setMessages(Array.isArray(data) ? data : [])
        setTimeout(scrollToBottom, 100)
      }
    } catch (error) {
      console.error("Error fetching messages:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  useEffect(() => {
    if (selectedUser) {
      fetchMessages(selectedUser._id)
      const interval = setInterval(() => fetchMessages(selectedUser._id), 5000)
      return () => clearInterval(interval)
    }
  }, [selectedUser])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || !selectedUser) return

    try {
      setSending(true)
      const response = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: newMessage,
          receiverId: selectedUser._id,
          receiverName: `${selectedUser.firstName} ${selectedUser.lastName}`,
        }),
      })

      if (response.ok) {
        setNewMessage("")
        fetchMessages(selectedUser._id)
        toast.success("Message sent")
      } else {
        toast.error("Failed to send message")
      }
    } catch (error) {
      toast.error("Failed to send message")
    } finally {
      setSending(false)
    }
  }

  const handleSelectUser = (userContact: UserContact) => {
    setSelectedUser(userContact)
    setView("chat")
  }

  const handleBackToContacts = () => {
    setSelectedUser(null)
    setView("contacts")
    setMessages([])
  }

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName?.[0] || ""}${lastName?.[0] || ""}`.toUpperCase() || "?"
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-red-500"
      case "teacher":
        return "bg-blue-500"
      case "head":
        return "bg-purple-500"
      default:
        return "bg-gray-500"
    }
  }

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "admin":
        return { label: "Admin", color: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300" }
      case "teacher":
        return { label: "Teacher", color: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300" }
      case "head":
        return { label: "Head", color: "bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300" }
      default:
        return { label: "Student", color: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300" }
    }
  }

  const formatTime = (date: string) => {
    if (!date) return ""
    const messageDate = new Date(date)
    const now = new Date()
    const diff = now.getTime() - messageDate.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 1) return "Just now"
    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    if (days < 7) return `${days}d ago`

    return messageDate.toLocaleDateString([], { month: "short", day: "numeric" })
  }

  // Filter users by search query
  const filteredUsers = users.filter((u) => {
    const fullName = `${u.firstName} ${u.lastName}`.toLowerCase()
    const query = searchQuery.toLowerCase()
    return fullName.includes(query) || u.email.toLowerCase().includes(query) || u.role.toLowerCase().includes(query)
  })

  // Contacts List View
  if (view === "contacts") {
    return (
      <div className="h-[calc(100vh-12rem)] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Users className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="font-semibold">Messages</h1>
              <p className="text-sm text-muted-foreground">{users.length} contacts available</p>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={fetchUsers}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>

        {/* Search */}
        <div className="py-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search contacts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Contacts List */}
        <ScrollArea className="flex-1">
          <div className="space-y-1">
            {filteredUsers.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Users className="h-12 w-12 text-muted-foreground/50 mb-4" />
                <p className="text-muted-foreground">No contacts found</p>
              </div>
            ) : (
              filteredUsers.map((contact) => (
                <button
                  key={contact._id}
                  onClick={() => handleSelectUser(contact)}
                  className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors text-left"
                >
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className={getRoleColor(contact.role)}>
                      {getInitials(contact.firstName, contact.lastName)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium truncate">
                        {contact.firstName} {contact.lastName}
                      </span>
                      <Badge variant="secondary" className={`text-xs ${getRoleBadge(contact.role).color}`}>
                        {getRoleBadge(contact.role).label}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground truncate">{contact.lastMessage || contact.email}</p>
                  </div>
                  {contact.lastMessageAt && (
                    <span className="text-xs text-muted-foreground">{formatTime(contact.lastMessageAt)}</span>
                  )}
                </button>
              ))
            )}
          </div>
        </ScrollArea>
      </div>
    )
  }

  // Chat View
  return (
    <div className="h-[calc(100vh-12rem)] flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 pb-4 border-b">
        <Button variant="ghost" size="icon" onClick={handleBackToContacts}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <Avatar className="h-10 w-10">
          <AvatarFallback className={getRoleColor(selectedUser?.role || "student")}>
            {getInitials(selectedUser?.firstName || "", selectedUser?.lastName || "")}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h1 className="font-semibold">
              {selectedUser?.firstName} {selectedUser?.lastName}
            </h1>
            <Badge variant="secondary" className={getRoleBadge(selectedUser?.role || "student").color}>
              {getRoleBadge(selectedUser?.role || "student").label}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">{selectedUser?.email}</p>
        </div>
        <Button variant="outline" size="sm" onClick={() => fetchMessages(selectedUser?._id)} disabled={loading}>
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
        </Button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto py-4">
        <div className="space-y-4">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-12">
              <MessageSquare className="h-12 w-12 text-muted-foreground/50 mb-4" />
              <p className="text-muted-foreground">No messages yet</p>
              <p className="text-sm text-muted-foreground/70">Start the conversation with {selectedUser?.firstName}</p>
            </div>
          ) : (
            messages.map((message) => {
              const isOwnMessage = message.senderId === user?.id

              return (
                <div key={message._id} className={`flex gap-3 ${isOwnMessage ? "flex-row-reverse" : ""}`}>
                  <div className={`flex flex-col max-w-[70%] ${isOwnMessage ? "items-end" : ""}`}>
                    <div
                      className={`rounded-2xl px-4 py-2 ${
                        isOwnMessage ? "bg-primary text-primary-foreground" : "bg-muted"
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
                    </div>
                    <div className={`mt-1 ${isOwnMessage ? "text-right" : ""}`}>
                      <span className="text-xs text-muted-foreground">{formatTime(message.createdAt)}</span>
                    </div>
                  </div>
                </div>
              )
            })
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="pt-4 border-t">
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <Input
            placeholder={`Message ${selectedUser?.firstName}...`}
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="flex-1"
            disabled={sending}
          />
          <Button type="submit" disabled={sending || !newMessage.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  )
}
