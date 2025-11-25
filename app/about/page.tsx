import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, GraduationCap, Users, BookOpen, Target } from "lucide-react"

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <nav className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <GraduationCap className="h-8 w-8 text-primary" />
            <span className="font-bold text-xl">Woldia University ELS</span>
          </Link>
          <Button variant="ghost" asChild>
            <Link href="/" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Link>
          </Button>
        </nav>
      </header>

      <section className="container mx-auto px-4 py-16 max-w-4xl">
        <h1 className="text-4xl font-bold mb-8 text-center">About Woldia University E-Learning System</h1>

        <div className="prose prose-lg dark:prose-invert mx-auto mb-12">
          <p className="text-muted-foreground text-lg">
            Woldia University E-learning System is an innovative educational platform designed to bridge the gap between
            traditional learning and modern technology. Our system provides a comprehensive digital environment where
            students and faculty can collaborate, share resources, and engage in the learning process efficiently.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="bg-card rounded-lg p-6 border">
            <Target className="h-10 w-10 text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-2">Our Mission</h3>
            <p className="text-muted-foreground">
              To enhance the quality of education by providing accessible, interactive, and user-friendly digital tools
              that support both teaching and learning processes at Woldia University.
            </p>
          </div>
          <div className="bg-card rounded-lg p-6 border">
            <Users className="h-10 w-10 text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-2">Who It's For</h3>
            <p className="text-muted-foreground">
              Designed for the entire university community, including students seeking flexible learning options,
              faculty members managing courses, and administrators overseeing the academic process.
            </p>
          </div>
        </div>

        <div className="bg-card rounded-lg p-8 border mb-12">
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
              <div key={i} className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-primary" />
                <span>{feature}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Ready to get started?</h2>
          <p className="text-muted-foreground mb-6">
            Join the Woldia University E-Learning community today and transform your educational experience.
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/register">Create Account</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/login">Login</Link>
            </Button>
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
