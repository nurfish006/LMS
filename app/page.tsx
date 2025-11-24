import Link from "next/link"
import { Button } from "@/components/ui/button"
import { BookOpen, Users, GraduationCap, Shield } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold text-foreground">Woldia University ELS</span>
          </div>
          <div className="flex gap-3">
            <Link href="/login">
              <Button variant="outline">Login</Button>
            </Link>
            <Link href="/register">
              <Button>Get Started</Button>
            </Link>
          </div>
        </nav>
      </header>

      <main className="container mx-auto px-4 py-16">
        {/* Hero Content */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-5xl font-bold text-foreground mb-6">Welcome to Woldia University E-Learning System</h1>
          <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
            A comprehensive online learning platform designed to enhance education through digital innovation. Access
            courses, submit assignments, and communicate with instructors anytime, anywhere.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/register">
              <Button size="lg" className="text-lg px-8">
                Start Learning
              </Button>
            </Link>
            <Link href="/about">
              <Button size="lg" variant="outline" className="text-lg px-8 bg-transparent">
                Learn More
              </Button>
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="bg-card border border-border rounded-lg p-8 text-center hover:shadow-lg transition-shadow">
            <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <BookOpen className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-bold mb-3">Course Materials</h3>
            <p className="text-muted-foreground leading-relaxed">
              Access comprehensive course materials, lecture notes, and resources uploaded by your instructors in one
              centralized location.
            </p>
          </div>

          <div className="bg-card border border-border rounded-lg p-8 text-center hover:shadow-lg transition-shadow">
            <div className="bg-accent/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="h-8 w-8 text-accent" />
            </div>
            <h3 className="text-xl font-bold mb-3">Interactive Learning</h3>
            <p className="text-muted-foreground leading-relaxed">
              Engage with instructors and classmates through real-time messaging and collaborative discussion forums.
            </p>
          </div>

          <div className="bg-card border border-border rounded-lg p-8 text-center hover:shadow-lg transition-shadow">
            <div className="bg-success/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="h-8 w-8 text-success" />
            </div>
            <h3 className="text-xl font-bold mb-3">Assignment Management</h3>
            <p className="text-muted-foreground leading-relaxed">
              Submit assignments online, track deadlines, and receive feedback from instructors efficiently.
            </p>
          </div>
        </div>

        {/* Stats Section */}
        <div className="mt-24 bg-primary text-primary-foreground rounded-2xl p-12">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">1000+</div>
              <div className="text-primary-foreground/80">Active Students</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">100+</div>
              <div className="text-primary-foreground/80">Faculty Members</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">50+</div>
              <div className="text-primary-foreground/80">Courses Available</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">24/7</div>
              <div className="text-primary-foreground/80">Platform Access</div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-24 py-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>&copy; 2023 Woldia University. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
