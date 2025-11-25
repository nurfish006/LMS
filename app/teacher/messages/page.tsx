"use client"

import { ChatInterface } from "@/components/chat-interface"

export default function TeacherMessagesPage() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold">Messages</h1>
        <p className="text-muted-foreground">Communicate with students and colleagues</p>
      </div>
      <ChatInterface />
    </div>
  )
}
