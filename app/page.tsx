import Link from "next/link"
import { Button } from "@/components/ui/button"
import { BookOpen, Users, GraduationCap, Shield } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-8 w-8 text-primary" />
            <span className="font-bold text-xl">Woldia University ELS</span>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Link href="/login">
              <Button variant="outline">Login</Button>
            </Link>
            <Link href="/register">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4">
        {/* Hero Content */}
        <section className="py-20 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">Welcome to Woldia University E-Learning System</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            A comprehensive online learning platform designed to enhance education through digital innovation. Access
            courses, submit assignments, and communicate with instructors anytime, anywhere.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/register">
              <Button size="lg" className="gap-2">
                <GraduationCap className="h-5 w-5" />
                Start Learning
              </Button>
            </Link>
            <Link href="/about">
              <Button size="lg" variant="outline">
                Learn More
              </Button>
            </Link>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-16 grid md:grid-cols-3 gap-8">
          <div className="p-6 rounded-lg border bg-card">
            <BookOpen className="h-12 w-12 text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-2">Course Materials</h3>
            <p className="text-muted-foreground">
              Access comprehensive course materials, lecture notes, and resources uploaded by your instructors in one
              centralized location.
            </p>
          </div>

          <div className="p-6 rounded-lg border bg-card">
            <Users className="h-12 w-12 text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-2">Interactive Learning</h3>
            <p className="text-muted-foreground">
              Engage with instructors and classmates through real-time messaging and collaborative discussion forums.
            </p>
          </div>

          <div className="p-6 rounded-lg border bg-card">
            <Shield className="h-12 w-12 text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-2">Assignment Management</h3>
            <p className="text-muted-foreground">
              Submit assignments online, track deadlines, and receive feedback from instructors efficiently.
            </p>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-muted/50 rounded-lg mb-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-primary">1000+</div>
              <div className="text-muted-foreground">Active Students</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary">100+</div>
              <div className="text-muted-foreground">Faculty Members</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary">50+</div>
              <div className="text-muted-foreground">Courses Available</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary">24/7</div>
              <div className="text-muted-foreground">Platform Access</div>
            </div>
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="border-t py-8 bg-card">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          &copy; 2023 Woldia University. All rights reserved.
        </div>
      </footer>
    </main>
  )
}
