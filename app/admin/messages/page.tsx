"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useAuth } from "@/components/auth-provider"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Send, RefreshCw } from "lucide-react"
import { toast } from "sonner"

interface Message {
  _id: string
  senderId: string
  senderName: string
  senderRole: string
  content: string
  createdAt: string
}

export default function AdminMessagesPage() {
  const { token, user } = useAuth()
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
      const response = await fetch("/api/messages", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

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
  }, [token])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim()) return

    try {
      setSending(true)
      const response = await fetch("/api/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
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

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-destructive text-destructive-foreground"
      case "teacher":
        return "bg-primary text-primary-foreground"
      case "head":
        return "bg-accent text-accent-foreground"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Communication Center</h1>
        <Button variant="outline" size="sm" onClick={fetchMessages} disabled={loading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Group Chat - Monitor & Communicate</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[500px] overflow-y-auto mb-4 space-y-4 p-4 bg-muted/30 rounded-lg">
            {messages.length === 0 ? (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                No messages yet. Start the conversation!
              </div>
            ) : (
              messages.map((message) => {
                const isOwnMessage = message.senderId === user?._id
                return (
                  <div key={message._id} className={`flex ${isOwnMessage ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[70%] ${isOwnMessage ? "items-end" : "items-start"} flex flex-col gap-1`}>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{message.senderName}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${getRoleBadgeColor(message.senderRole)}`}>
                          {message.senderRole}
                        </span>
                      </div>
                      <div
                        className={`p-3 rounded-lg ${
                          isOwnMessage ? "bg-primary text-primary-foreground" : "bg-card border"
                        }`}
                      >
                        <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
                        <p
                          className={`text-xs mt-1 ${
                            isOwnMessage ? "text-primary-foreground/70" : "text-muted-foreground"
                          }`}
                        >
                          {new Date(message.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                )
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSendMessage} className="flex gap-2">
            <Textarea
              placeholder="Type your message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="min-h-[60px]"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault()
                  handleSendMessage(e)
                }
              }}
            />
            <Button type="submit" disabled={sending || !newMessage.trim()} className="self-end">
              <Send className="h-4 w-4 mr-2" />
              Send
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
