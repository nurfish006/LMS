import Link from "next/link"
import { Button } from "@/components/ui/button"
import { BookOpen, Users, GraduationCap, Shield } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-slate-950 dark:to-slate-900">
      {/* Hero Section */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-8 w-8 text-primary" />
            <span className="text-lg sm:text-xl font-bold text-foreground">Woldia University ELS</span>
          </div>
          <div className="flex gap-3 items-center">
            <ThemeToggle />
            <Link href="/login">
              <Button variant="outline">Login</Button>
            </Link>
            <Link href="/register">
              <Button>Get Started</Button>
            </Link>
          </div>
        </nav>
      </header>

      <main className="container mx-auto px-4 py-8 sm:py-16">
        {/* Hero Content */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4 sm:mb-6">
            Welcome to Woldia University E-Learning System
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground mb-6 sm:mb-8 leading-relaxed">
            A comprehensive online learning platform designed to enhance education through digital innovation. Access
            courses, submit assignments, and communicate with instructors anytime, anywhere.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button size="lg" className="text-base sm:text-lg px-6 sm:px-8 w-full sm:w-auto">
                Start Learning
              </Button>
            </Link>
            <Link href="/about">
              <Button
                size="lg"
                variant="outline"
                className="text-base sm:text-lg px-6 sm:px-8 w-full sm:w-auto bg-transparent"
              >
                Learn More
              </Button>
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 max-w-5xl mx-auto">
          <div className="bg-card border border-border rounded-lg p-6 sm:p-8 text-center hover:shadow-lg transition-shadow">
            <div className="bg-primary/10 w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <BookOpen className="h-7 w-7 sm:h-8 sm:w-8 text-primary" />
            </div>
            <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3">Course Materials</h3>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              Access comprehensive course materials, lecture notes, and resources uploaded by your instructors in one
              centralized location.
            </p>
          </div>

          <div className="bg-card border border-border rounded-lg p-6 sm:p-8 text-center hover:shadow-lg transition-shadow">
            <div className="bg-accent/10 w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="h-7 w-7 sm:h-8 sm:w-8 text-accent" />
            </div>
            <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3">Interactive Learning</h3>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              Engage with instructors and classmates through real-time messaging and collaborative discussion forums.
            </p>
          </div>

          <div className="bg-card border border-border rounded-lg p-6 sm:p-8 text-center hover:shadow-lg transition-shadow">
            <div className="bg-success/10 w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="h-7 w-7 sm:h-8 sm:w-8 text-success" />
            </div>
            <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3">Assignment Management</h3>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              Submit assignments online, track deadlines, and receive feedback from instructors efficiently.
            </p>
          </div>
        </div>

        {/* Stats Section */}
        <div className="mt-16 sm:mt-24 bg-primary text-primary-foreground rounded-2xl p-8 sm:p-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 text-center">
            <div>
              <div className="text-3xl sm:text-4xl font-bold mb-2">1000+</div>
              <div className="text-sm sm:text-base text-primary-foreground/80">Active Students</div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-bold mb-2">100+</div>
              <div className="text-sm sm:text-base text-primary-foreground/80">Faculty Members</div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-bold mb-2">50+</div>
              <div className="text-sm sm:text-base text-primary-foreground/80">Courses Available</div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-bold mb-2">24/7</div>
              <div className="text-sm sm:text-base text-primary-foreground/80">Platform Access</div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-16 sm:mt-24 py-8">
        <div className="container mx-auto px-4 text-center text-sm sm:text-base text-muted-foreground">
          <p>&copy; 2023 Woldia University. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
