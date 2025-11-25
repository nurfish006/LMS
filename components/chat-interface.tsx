"use client"

import { useState, useEffect, useRef } from "react"
import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Send,
  Paperclip,
  Search,
  MoreVertical,
  Check,
  CheckCheck,
  ArrowLeft,
  Phone,
  Video,
  Smile,
  Mic,
  X,
  FileIcon,
  Download,
  ImageIcon,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { format, isToday, isYesterday } from "date-fns"
import { FileUpload } from "./file-upload"

interface Message {
  _id: string
  senderId: string
  senderName: string
  senderRole: string
  receiverId: string
  receiverName: string
  content: string
  attachment?: {
    url: string
    filename: string
    type: string
    size: number
  }
  read: boolean
  createdAt: string
}

interface Conversation {
  id: string
  name: string
  role: string
  lastMessage?: string
  lastMessageTime?: string
  unreadCount: number
  online?: boolean
}

export function ChatInterface() {
  const { user } = useAuth()
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [messages, setMessages] = useState<Message[]>([])
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null)
  const [newMessage, setNewMessage] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showAttachment, setShowAttachment] = useState(false)
  const [pendingAttachment, setPendingAttachment] = useState<{
    url: string
    tokenId: string
    filename: string
    size: number
    type: string
  } | null>(null)
  const [isMobileView, setIsMobileView] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Check for mobile view
  useEffect(() => {
    const checkMobile = () => setIsMobileView(window.innerWidth < 768)
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  // Fetch users and messages
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersRes, messagesRes] = await Promise.all([fetch("/api/users"), fetch("/api/messages")])

        if (usersRes.ok) {
          const data = await usersRes.json()
          setUsers(data.users.filter((u: any) => u._id !== user?.id))
        }

        if (messagesRes.ok) {
          const data = await messagesRes.json()
          processConversations(data.messages)
        }
      } catch (error) {
        console.error("[v0] Error fetching data:", error)
      } finally {
        setLoading(false)
      }
    }

    if (user) fetchData()
  }, [user])

  // Process messages into conversations
  const processConversations = (allMessages: Message[]) => {
    const convMap = new Map<string, Conversation>()

    allMessages.forEach((msg) => {
      const otherId = msg.senderId === user?.id ? msg.receiverId : msg.senderId
      const otherName = msg.senderId === user?.id ? msg.receiverName : msg.senderName
      const otherRole = msg.senderId === user?.id ? "user" : msg.senderRole

      if (!convMap.has(otherId)) {
        convMap.set(otherId, {
          id: otherId,
          name: otherName,
          role: otherRole,
          lastMessage: msg.content,
          lastMessageTime: msg.createdAt,
          unreadCount: 0,
          online: Math.random() > 0.5,
        })
      }

      const conv = convMap.get(otherId)!
      if (new Date(msg.createdAt) > new Date(conv.lastMessageTime || 0)) {
        conv.lastMessage = msg.content
        conv.lastMessageTime = msg.createdAt
      }
      if (msg.receiverId === user?.id && !msg.read) {
        conv.unreadCount++
      }
    })

    setConversations(
      Array.from(convMap.values()).sort(
        (a, b) => new Date(b.lastMessageTime || 0).getTime() - new Date(a.lastMessageTime || 0).getTime(),
      ),
    )
  }

  // Fetch messages for selected conversation
  const fetchConversationMessages = async (partnerId: string) => {
    try {
      const response = await fetch(`/api/messages?partnerId=${partnerId}`)
      if (response.ok) {
        const data = await response.json()
        setMessages(data.messages)
        // Mark as read
        await fetch("/api/messages/read", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ senderId: partnerId }),
        })
      }
    } catch (error) {
      console.error("[v0] Error fetching messages:", error)
    }
  }

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Poll for new messages
  useEffect(() => {
    if (!selectedConversation) return

    const interval = setInterval(() => {
      fetchConversationMessages(selectedConversation.id)
    }, 3000)

    return () => clearInterval(interval)
  }, [selectedConversation])

  const selectConversation = (conv: Conversation) => {
    setSelectedConversation(conv)
    fetchConversationMessages(conv.id)
  }

  const startNewConversation = (targetUser: any) => {
    const conv: Conversation = {
      id: targetUser._id,
      name: `${targetUser.firstName} ${targetUser.lastName}`,
      role: targetUser.role,
      unreadCount: 0,
      online: Math.random() > 0.5,
    }
    setSelectedConversation(conv)
    setMessages([])
    setSearchQuery("")
  }

  const sendMessage = async () => {
    if ((!newMessage.trim() && !pendingAttachment) || !selectedConversation) return

    try {
      const response = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          receiverId: selectedConversation.id,
          content: newMessage.trim() || (pendingAttachment ? `Sent a file: ${pendingAttachment.filename}` : ""),
          attachment: pendingAttachment
            ? {
                url: pendingAttachment.url,
                filename: pendingAttachment.filename,
                type: pendingAttachment.type,
                size: pendingAttachment.size,
              }
            : undefined,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setMessages((prev) => [...prev, data.message])
        setNewMessage("")
        setPendingAttachment(null)
        setShowAttachment(false)

        // Update conversations
        setConversations((prev) => {
          const updated = prev.map((c) =>
            c.id === selectedConversation.id
              ? { ...c, lastMessage: newMessage, lastMessageTime: new Date().toISOString() }
              : c,
          )
          return updated.sort(
            (a, b) => new Date(b.lastMessageTime || 0).getTime() - new Date(a.lastMessageTime || 0).getTime(),
          )
        })
      }
    } catch (error) {
      console.error("[v0] Error sending message:", error)
    }
  }

  const formatMessageTime = (dateStr: string) => {
    const date = new Date(dateStr)
    if (isToday(date)) return format(date, "h:mm a")
    if (isYesterday(date)) return "Yesterday"
    return format(date, "MMM d")
  }

  const formatDetailedTime = (dateStr: string) => {
    const date = new Date(dateStr)
    if (isToday(date)) return format(date, "h:mm a")
    if (isYesterday(date)) return `Yesterday at ${format(date, "h:mm a")}`
    return format(date, "MMM d, h:mm a")
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case "teacher":
        return "bg-blue-500"
      case "admin":
        return "bg-purple-500"
      case "head":
        return "bg-amber-500"
      default:
        return "bg-emerald-500"
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B"
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB"
    return (bytes / (1024 * 1024)).toFixed(1) + " MB"
  }

  const isImageFile = (type: string) => type?.startsWith("image/")

  const filteredUsers = users.filter(
    (u) =>
      `${u.firstName} ${u.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Render conversation list
  const renderConversationList = () => (
    <div className={cn("flex flex-col h-full bg-background border-r", isMobileView ? "w-full" : "w-80")}>
      {/* Header */}
      <div className="p-4 border-b bg-gradient-to-r from-primary/10 to-primary/5">
        <h2 className="text-xl font-bold text-foreground">Messages</h2>
        <p className="text-sm text-muted-foreground">Stay connected with your class</p>
      </div>

      {/* Search */}
      <div className="p-3 border-b">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-muted/50 border-0 focus-visible:ring-1"
          />
        </div>
      </div>

      {/* Conversations or Search Results */}
      <ScrollArea className="flex-1">
        {searchQuery ? (
          <div className="p-2">
            <p className="text-xs text-muted-foreground px-2 py-1">Search results</p>
            {filteredUsers.map((u) => (
              <button
                key={u._id}
                onClick={() => startNewConversation(u)}
                className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-muted/70 transition-colors"
              >
                <div className="relative">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className={getRoleColor(u.role)}>
                      {getInitials(`${u.firstName} ${u.lastName}`)}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <div className="flex-1 text-left">
                  <p className="font-medium">
                    {u.firstName} {u.lastName}
                  </p>
                  <p className="text-sm text-muted-foreground capitalize">{u.role}</p>
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className="p-2">
            {conversations.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No conversations yet</p>
                <p className="text-sm text-muted-foreground">Search for someone to start chatting</p>
              </div>
            ) : (
              conversations.map((conv) => (
                <button
                  key={conv.id}
                  onClick={() => selectConversation(conv)}
                  className={cn(
                    "w-full flex items-center gap-3 p-3 rounded-lg transition-colors",
                    selectedConversation?.id === conv.id ? "bg-primary/10" : "hover:bg-muted/70",
                  )}
                >
                  <div className="relative">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className={getRoleColor(conv.role)}>{getInitials(conv.name)}</AvatarFallback>
                    </Avatar>
                    {conv.online && (
                      <span className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 border-2 border-background rounded-full" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0 text-left">
                    <div className="flex items-center justify-between">
                      <p className="font-medium truncate">{conv.name}</p>
                      <span className="text-xs text-muted-foreground">
                        {conv.lastMessageTime && formatMessageTime(conv.lastMessageTime)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-muted-foreground truncate pr-2">
                        {conv.lastMessage || "Start a conversation"}
                      </p>
                      {conv.unreadCount > 0 && (
                        <span className="flex-shrink-0 h-5 min-w-5 px-1.5 bg-primary text-primary-foreground text-xs font-medium rounded-full flex items-center justify-center">
                          {conv.unreadCount}
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        )}
      </ScrollArea>
    </div>
  )

  // Render chat area
  const renderChatArea = () => {
    if (!selectedConversation) {
      return (
        <div className="flex-1 flex items-center justify-center bg-muted/20">
          <div className="text-center">
            <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
              <Send className="h-10 w-10 text-primary" />
            </div>
            <h3 className="text-xl font-semibold">Welcome to Messages</h3>
            <p className="text-muted-foreground mt-2">Select a conversation or search for someone to start chatting</p>
          </div>
        </div>
      )
    }

    return (
      <div className="flex-1 flex flex-col h-full bg-gradient-to-b from-muted/30 to-background">
        {/* Chat Header */}
        <div className="flex items-center gap-3 p-4 border-b bg-background/80 backdrop-blur-sm">
          {isMobileView && (
            <Button variant="ghost" size="icon" onClick={() => setSelectedConversation(null)}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
          )}
          <div className="relative">
            <Avatar className="h-10 w-10">
              <AvatarFallback className={getRoleColor(selectedConversation.role)}>
                {getInitials(selectedConversation.name)}
              </AvatarFallback>
            </Avatar>
            {selectedConversation.online && (
              <span className="absolute bottom-0 right-0 h-2.5 w-2.5 bg-green-500 border-2 border-background rounded-full" />
            )}
          </div>
          <div className="flex-1">
            <p className="font-semibold">{selectedConversation.name}</p>
            <p className="text-xs text-muted-foreground">{selectedConversation.online ? "Online" : "Offline"}</p>
          </div>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" className="text-muted-foreground">
              <Phone className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="text-muted-foreground">
              <Video className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="text-muted-foreground">
              <MoreVertical className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Messages */}
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4 max-w-3xl mx-auto">
            {messages.map((msg, index) => {
              const isOwn = msg.senderId === user?.id
              const showDate =
                index === 0 ||
                new Date(msg.createdAt).toDateString() !== new Date(messages[index - 1].createdAt).toDateString()

              return (
                <div key={msg._id}>
                  {showDate && (
                    <div className="flex justify-center my-4">
                      <span className="px-3 py-1 text-xs bg-muted rounded-full text-muted-foreground">
                        {isToday(new Date(msg.createdAt))
                          ? "Today"
                          : isYesterday(new Date(msg.createdAt))
                            ? "Yesterday"
                            : format(new Date(msg.createdAt), "MMMM d, yyyy")}
                      </span>
                    </div>
                  )}
                  <div className={cn("flex", isOwn ? "justify-end" : "justify-start")}>
                    <div className={cn("max-w-[75%] group", isOwn ? "items-end" : "items-start")}>
                      <div
                        className={cn(
                          "rounded-2xl px-4 py-2 shadow-sm",
                          isOwn
                            ? "bg-primary text-primary-foreground rounded-br-md"
                            : "bg-background border rounded-bl-md",
                        )}
                      >
                        {/* Attachment */}
                        {msg.attachment && (
                          <div className="mb-2">
                            {isImageFile(msg.attachment.type) ? (
                              <a href={msg.attachment.url} target="_blank" rel="noopener noreferrer" className="block">
                                <img
                                  src={msg.attachment.url || "/placeholder.svg"}
                                  alt={msg.attachment.filename}
                                  className="max-w-full rounded-lg max-h-60 object-cover"
                                />
                              </a>
                            ) : (
                              <a
                                href={msg.attachment.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={cn(
                                  "flex items-center gap-3 p-3 rounded-lg",
                                  isOwn ? "bg-primary-foreground/10" : "bg-muted",
                                )}
                              >
                                <div
                                  className={cn("p-2 rounded-lg", isOwn ? "bg-primary-foreground/20" : "bg-primary/10")}
                                >
                                  <FileIcon
                                    className={cn("h-6 w-6", isOwn ? "text-primary-foreground" : "text-primary")}
                                  />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p
                                    className={cn(
                                      "text-sm font-medium truncate",
                                      isOwn ? "text-primary-foreground" : "text-foreground",
                                    )}
                                  >
                                    {msg.attachment.filename}
                                  </p>
                                  <p
                                    className={cn(
                                      "text-xs",
                                      isOwn ? "text-primary-foreground/70" : "text-muted-foreground",
                                    )}
                                  >
                                    {formatFileSize(msg.attachment.size)}
                                  </p>
                                </div>
                                <Download
                                  className={cn(
                                    "h-5 w-5",
                                    isOwn ? "text-primary-foreground/70" : "text-muted-foreground",
                                  )}
                                />
                              </a>
                            )}
                          </div>
                        )}

                        {/* Message content */}
                        {msg.content && !msg.content.startsWith("Sent a file:") && (
                          <p className="text-sm whitespace-pre-wrap break-words">{msg.content}</p>
                        )}

                        {/* Time and status */}
                        <div className={cn("flex items-center gap-1 mt-1", isOwn ? "justify-end" : "justify-start")}>
                          <span
                            className={cn(
                              "text-[10px]",
                              isOwn ? "text-primary-foreground/70" : "text-muted-foreground",
                            )}
                          >
                            {format(new Date(msg.createdAt), "h:mm a")}
                          </span>
                          {isOwn &&
                            (msg.read ? (
                              <CheckCheck className="h-3 w-3 text-primary-foreground/70" />
                            ) : (
                              <Check className="h-3 w-3 text-primary-foreground/70" />
                            ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {/* Pending Attachment Preview */}
        {pendingAttachment && (
          <div className="px-4 pb-2">
            <div className="flex items-center gap-3 p-3 bg-muted rounded-lg max-w-md ml-auto">
              <div className="p-2 bg-primary/10 rounded-lg">
                {isImageFile(pendingAttachment.type) ? (
                  <ImageIcon className="h-5 w-5 text-primary" />
                ) : (
                  <FileIcon className="h-5 w-5 text-primary" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{pendingAttachment.filename}</p>
                <p className="text-xs text-muted-foreground">{formatFileSize(pendingAttachment.size)}</p>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setPendingAttachment(null)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Attachment Upload Panel */}
        {showAttachment && (
          <div className="px-4 pb-2">
            <div className="p-4 bg-muted rounded-lg max-w-md ml-auto">
              <div className="flex items-center justify-between mb-3">
                <p className="font-medium text-sm">Attach a file</p>
                <Button variant="ghost" size="icon" onClick={() => setShowAttachment(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <FileUpload
                uploadType="message"
                onUploadComplete={(data) => {
                  setPendingAttachment(data)
                  setShowAttachment(false)
                }}
              />
            </div>
          </div>
        )}

        {/* Message Input */}
        <div className="p-4 border-t bg-background">
          <div className="flex items-center gap-2 max-w-3xl mx-auto">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowAttachment(!showAttachment)}
              className="text-muted-foreground hover:text-foreground"
            >
              <Paperclip className="h-5 w-5" />
            </Button>
            <div className="flex-1 relative">
              <Input
                ref={inputRef}
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()}
                placeholder="Type a message..."
                className="pr-10 bg-muted/50 border-0 focus-visible:ring-1"
              />
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 text-muted-foreground"
              >
                <Smile className="h-5 w-5" />
              </Button>
            </div>
            {newMessage.trim() || pendingAttachment ? (
              <Button onClick={sendMessage} size="icon" className="rounded-full">
                <Send className="h-5 w-5" />
              </Button>
            ) : (
              <Button variant="ghost" size="icon" className="text-muted-foreground">
                <Mic className="h-5 w-5" />
              </Button>
            )}
          </div>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[600px]">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="flex h-[calc(100vh-12rem)] bg-background rounded-lg border overflow-hidden shadow-lg">
      {/* Conversation List - Hidden on mobile when chat is open */}
      {(!isMobileView || !selectedConversation) && renderConversationList()}

      {/* Chat Area - Hidden on mobile when no chat selected */}
      {(!isMobileView || selectedConversation) && renderChatArea()}
    </div>
  )
}
