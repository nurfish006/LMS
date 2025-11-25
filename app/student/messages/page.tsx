"use client"

import { ChatInterface } from "@/components/chat-interface"

export default function StudentMessagesPage() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold">Messages</h1>
        <p className="text-muted-foreground">Chat with teachers and classmates</p>
      </div>
      <ChatInterface />
    </div>
  )
}
