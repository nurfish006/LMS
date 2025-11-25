import Link from "next/link"
import { Button } from "@/components/ui/button"
import { BookOpen, Users, GraduationCap, Shield } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <nav className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-8 w-8 text-primary" />
            <span className="font-bold text-xl">Woldia University ELS</span>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Button variant="ghost" asChild>
              <Link href="/login">Login</Link>
            </Button>
            <Button asChild>
              <Link href="/register">Get Started</Link>
            </Button>
          </div>
        </nav>
      </header>

      <section className="container mx-auto px-4 py-24">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 text-balance">
            Welcome to Woldia University E-Learning System
          </h1>
          <p className="text-lg text-muted-foreground mb-8 text-pretty">
            A comprehensive online learning platform designed to enhance education through digital innovation. Access
            courses, submit assignments, and communicate with instructors anytime, anywhere.
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/register">Start Learning</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/about">Learn More</Link>
            </Button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-card rounded-lg p-6 border shadow-sm">
            <BookOpen className="h-12 w-12 text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-2">Course Materials</h3>
            <p className="text-muted-foreground">
              Access comprehensive course materials, lecture notes, and resources uploaded by your instructors.
            </p>
          </div>
          <div className="bg-card rounded-lg p-6 border shadow-sm">
            <Users className="h-12 w-12 text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-2">Interactive Learning</h3>
            <p className="text-muted-foreground">
              Engage with instructors and classmates through real-time messaging and collaborative forums.
            </p>
          </div>
          <div className="bg-card rounded-lg p-6 border shadow-sm">
            <Shield className="h-12 w-12 text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-2">Assignment Management</h3>
            <p className="text-muted-foreground">
              Submit assignments online, track deadlines, and receive feedback from instructors efficiently.
            </p>
          </div>
        </div>

        <div className="bg-primary text-primary-foreground rounded-2xl p-8 md:p-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl md:text-4xl font-bold">1000+</div>
              <div className="text-sm opacity-90">Active Students</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold">100+</div>
              <div className="text-sm opacity-90">Faculty Members</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold">50+</div>
              <div className="text-sm opacity-90">Courses Available</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold">24/7</div>
              <div className="text-sm opacity-90">Platform Access</div>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t py-8 mt-auto">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          &copy; 2023 Woldia University. All rights reserved.
        </div>
      </footer>
    </main>
  )
}
