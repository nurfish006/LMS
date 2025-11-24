import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, GraduationCap, Users, BookOpen, Target } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="container mx-auto px-4 py-6 border-b border-border">
        <nav className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <GraduationCap className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold text-foreground">Woldia University ELS</span>
          </Link>
          <Link href="/">
            <Button variant="ghost" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </nav>
      </header>

      <main className="container mx-auto px-4 py-16 max-w-4xl">
        <h1 className="text-4xl font-bold mb-8 text-center">About Woldia University E-Learning System</h1>

        <div className="prose prose-lg dark:prose-invert mx-auto mb-16 text-muted-foreground">
          <p className="leading-relaxed">
            Woldia University E-learning System is an innovative educational platform designed to bridge the gap between
            traditional learning and modern technology. Our system provides a comprehensive digital environment where
            students and faculty can collaborate, share resources, and engage in the learning process efficiently.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <div className="bg-card p-8 rounded-xl border border-border">
            <Target className="h-10 w-10 text-primary mb-4" />
            <h3 className="text-xl font-bold mb-3">Our Mission</h3>
            <p className="text-muted-foreground">
              To enhance the quality of education by providing accessible, interactive, and user-friendly digital tools
              that support both teaching and learning processes at Woldia University.
            </p>
          </div>
          <div className="bg-card p-8 rounded-xl border border-border">
            <Users className="h-10 w-10 text-primary mb-4" />
            <h3 className="text-xl font-bold mb-3">Who It's For</h3>
            <p className="text-muted-foreground">
              Designed for the entire university community, including students seeking flexible learning options,
              faculty members managing courses, and administrators overseeing the academic process.
            </p>
          </div>
        </div>

        <div className="space-y-12">
          <section>
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <BookOpen className="h-6 w-6 text-primary" />
              Key Features
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                "Comprehensive Course Management",
                "Digital Assignment Submission",
                "Real-time Communication Tools",
                "Resource & Material Distribution",
                "Automated Grading System",
                "University News & Announcements",
              ].map((feature, i) => (
                <div key={i} className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
                  <div className="h-2 w-2 rounded-full bg-primary" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="bg-primary/5 rounded-2xl p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Ready to get started?</h2>
            <p className="text-muted-foreground mb-6">
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
          </section>
        </div>
      </main>

      <footer className="border-t border-border mt-12 py-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>&copy; 2023 Woldia University. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
