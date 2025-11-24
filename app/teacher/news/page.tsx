"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Newspaper } from "lucide-react"

interface NewsItem {
  _id: string
  title: string
  content: string
  createdAt: string
}

export default function TeacherNewsPage() {
  const [news, setNews] = useState<NewsItem[]>([])

  useEffect(() => {
    fetchNews()
  }, [])

  const fetchNews = async () => {
    try {
      const response = await fetch("/api/news")
      if (response.ok) {
        const data = await response.json()
        setNews(data.news)
      }
    } catch (error) {
      console.error("[v0] Fetch news error:", error)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">University News</h1>
        <p className="text-muted-foreground">Latest updates and announcements</p>
      </div>

      <div className="grid gap-4">
        {news.map((item) => (
          <Card key={item._id}>
            <CardHeader>
              <div className="flex items-start gap-3">
                <div className="bg-primary/10 p-2 rounded">
                  <Newspaper className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle>{item.title}</CardTitle>
                  <CardDescription>
                    {new Date(item.createdAt).toLocaleDateString()} at {new Date(item.createdAt).toLocaleTimeString()}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground leading-relaxed">{item.content}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
