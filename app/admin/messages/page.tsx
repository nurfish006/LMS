"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useAuth } from "@/components/auth-provider"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send, RefreshCw, MessageSquare, Users } from "lucide-react"
import { toast } from "sonner"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

interface Message {
  _id: string
  senderId: string
  senderName: string
  senderRole: string
  content: string
  createdAt: string
}

export default function AdminMessagesPage() {
  const { user } = useAuth()
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [loading, setLoading] = useState(false)
  const [sending, setSending] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const fetchMessages = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/messages")

      if (response.ok) {
        const data = await response.json()
        setMessages(data)
        setTimeout(scrollToBottom, 100)
      }
    } catch (error) {
      console.error("Error fetching messages:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMessages()
    const interval = setInterval(fetchMessages, 10000)
    return () => clearInterval(interval)
  }, [])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim()) return

    try {
      setSending(true)
      const response = await fetch("/api/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: newMessage }),
      })

      if (response.ok) {
        setNewMessage("")
        fetchMessages()
        toast.success("Message sent")
      } else {
        toast.error("Failed to send message")
      }
    } catch (error) {
      console.error("Error sending message:", error)
      toast.error("Failed to send message")
    } finally {
      setSending(false)
    }
  }

  const getInitials = (name: string) => {
    if (!name) return "?"
    const parts = name.split(" ")
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase()
    }
    return name.substring(0, 2).toUpperCase()
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-gradient-to-br from-red-500 to-pink-600"
      case "teacher":
        return "bg-gradient-to-br from-blue-500 to-indigo-600"
      case "head":
        return "bg-gradient-to-br from-purple-500 to-violet-600"
      default:
        return "bg-gradient-to-br from-gray-500 to-gray-600"
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
    
    return messageDate.toLocaleDateString([], { month: 'short', day: 'numeric' })
  }

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col">
      {/* Header */}
      <div className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <Users className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Group Chat</h1>
                <p className="text-sm text-muted-foreground">University Discussion</p>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={fetchMessages} 
              disabled={loading}
              className="gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
              <span className="hidden sm:inline">Refresh</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-hidden bg-gradient-to-b from-muted/20 to-muted/5">
        <div className="container mx-auto h-full px-4 py-6">
          <div className="h-full overflow-y-auto pr-2 space-y-6" style={{ scrollbarGutter: "stable" }}>
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <div className="w-20 h-20 rounded-full bg-muted/50 flex items-center justify-center mb-4">
                  <MessageSquare className="w-10 h-10 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2">No messages yet</h3>
                <p className="text-muted-foreground max-w-sm">
                  Start the conversation by sending a message below
                </p>
              </div>
            ) : (
              messages.map((message, index) => {
                const isOwnMessage = message.senderId === user?.id
                const showAvatar = index === 0 || messages[index - 1].senderId !== message.senderId
                const isLastInGroup = index === messages.length - 1 || messages[index + 1]?.senderId !== message.senderId

                return (
                  <div key={message._id} className={`flex gap-3 ${isOwnMessage ? "flex-row-reverse" : "flex-row"} ${!showAvatar && "mt-1"}`}>
                    {/* Avatar */}
                    <div className={`flex-shrink-0 ${!showAvatar && "opacity-0 pointer-events-none"}`}>
                      {!isOwnMessage && (
                        <Avatar className={`w-10 h-10 ring-2 ring-background ${getRoleColor(message.senderRole)}`}>
                          <AvatarFallback className="text-white font-semibold text-sm">
                            {getInitials(message.senderName)}
                          </AvatarFallback>
                        </Avatar>
                      )}
                    </div>

                    {/* Message Content */}
                    <div className={`flex flex-col ${isOwnMessage ? "items-end" : "items-start"} max-w-[70%] sm:max-w-[60%]`}>
                      {/* Sender Info */}
                      {showAvatar && !isOwnMessage && (
                        <div className="flex items-center gap-2 mb-1 px-1">
                          <span className="text-sm font-semibold">
                            {message.senderName || "Unknown User"}
                          </span>
                          <Badge variant="secondary" className={`text-xs ${getRoleBadge(message.senderRole).color}`}>
                            {getRoleBadge(message.senderRole).label}
                          </Badge>
                        </div>
                      )}

                      {/* Message Bubble */}
                      <div
                        className={`group relative px-4 py-2.5 shadow-sm transition-all ${
                          isOwnMessage
                            ? `bg-gradient-to-br from-blue-500 to-blue-600 text-white ${
                                isLastInGroup ? "rounded-3xl rounded-br-md" : "rounded-3xl rounded-tr-md rounded-br-md"
                              }`
                            : `bg-card border border-border/50 ${
                                isLastInGroup ? "rounded-3xl rounded-bl-md" : "rounded-3xl rounded-tl-md rounded-bl-md"
                              }`
                        }`}
                      >
                        <p className="text-[15px] leading-relaxed whitespace-pre-wrap break-words">
                          {message.content}
                        </p>
                        
                        {/* Timestamp */}
                        <div className={`flex items-center justify-end gap-1 mt-1 ${
                          isOwnMessage ? "text-white/70" : "text-muted-foreground"
                        }`}>
                          <span className="text-[11px] font-medium">
                            {formatTime(message.createdAt)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>
      </div>

      {/* Input Area */}
      <div className="border-t bg-card/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <form onSubmit={handleSendMessage} className="flex gap-3 items-end">
            <div className="flex-1 relative">
              <Input
                placeholder="Type a message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="pr-4 py-6 text-[15px] rounded-full bg-muted/50 border-muted-foreground/20 focus-visible:ring-2 focus-visible:ring-blue-500"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault()
                    handleSendMessage(e)
                  }
                }}
                disabled={sending}
              />
            </div>
            <Button 
              type="submit" 
              disabled={sending || !newMessage.trim()}
              size="lg"
              className="rounded-full w-12 h-12 p-0 bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-lg disabled:opacity-50"
            >
              <Send className="h-5 w-5" />
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
