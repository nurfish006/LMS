import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, GraduationCap, Users, BookOpen, Target } from "lucide-react"

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-8 w-8 text-primary" />
            <span className="font-bold text-xl">Woldia University ELS</span>
          </div>
          <Link href="/">
            <Button variant="outline" className="gap-2 bg-transparent">
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-center mb-8">About Woldia University E-Learning System</h1>

        <div className="max-w-3xl mx-auto text-center mb-16">
          <p className="text-lg text-muted-foreground">
            Woldia University E-learning System is an innovative educational platform designed to bridge the gap between
            traditional learning and modern technology. Our system provides a comprehensive digital environment where
            students and faculty can collaborate, share resources, and engage in the learning process efficiently.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <div className="p-8 rounded-lg border bg-card">
            <Target className="h-12 w-12 text-primary mb-4" />
            <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
            <p className="text-muted-foreground">
              To enhance the quality of education by providing accessible, interactive, and user-friendly digital tools
              that support both teaching and learning processes at Woldia University.
            </p>
          </div>

          <div className="p-8 rounded-lg border bg-card">
            <Users className="h-12 w-12 text-primary mb-4" />
            <h2 className="text-2xl font-semibold mb-4">Who It's For</h2>
            <p className="text-muted-foreground">
              Designed for the entire university community, including students seeking flexible learning options,
              faculty members managing courses, and administrators overseeing the academic process.
            </p>
          </div>
        </div>

        <div className="bg-muted/50 rounded-lg p-8 mb-16">
          <h2 className="text-2xl font-semibold text-center mb-8">Key Features</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              "Comprehensive Course Management",
              "Digital Assignment Submission",
              "Real-time Communication Tools",
              "Resource & Material Distribution",
              "Automated Grading System",
              "University News & Announcements",
            ].map((feature, i) => (
              <div key={i} className="flex items-center gap-3 p-4 bg-card rounded-lg">
                <BookOpen className="h-5 w-5 text-primary flex-shrink-0" />
                <span>{feature}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4">Ready to get started?</h2>
          <p className="text-muted-foreground mb-8">
            Join the Woldia University E-Learning community today and transform your educational experience.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/register">
              <Button size="lg">Create Account</Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline">
                Login
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <footer className="border-t py-8 bg-card mt-16">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          &copy; 2023 Woldia University. All rights reserved.
        </div>
      </footer>
    </main>
  )
}
