import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Brain, BarChart3, Users, Zap } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen w-full bg-[#fefcff] relative flex flex-col">
      {/* Dreamy Sky Pink Glow */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `
            radial-gradient(circle at 30% 70%, rgba(173, 216, 230, 0.35), transparent 60%),
            radial-gradient(circle at 70% 30%, rgba(255, 182, 193, 0.4), transparent 60%)`,
        }}
      />
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Header */}
        <header className="border-b bg-white/80 backdrop-blur-sm shadow-lg">
          <div className="container mx-auto px-4 py-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Brain className="h-10 w-10 text-blue-600" />
              <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">FormWise</h1>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/auth/login">
                <Button variant="ghost" size="lg">Sign In</Button>
              </Link>
              <Link href="/auth/sign-up">
                <Button size="lg" className="font-semibold bg-gradient-to-r from-blue-400 to-pink-300 text-white shadow-md">Get Started</Button>
              </Link>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="container mx-auto px-4 py-24 flex flex-col items-center text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-6xl font-extrabold text-gray-900 mb-6 leading-tight drop-shadow-lg">Build Smarter Surveys with AI</h2>
            <p className="text-2xl text-gray-700 mb-10 leading-relaxed">
              FormWise empowers you to create beautiful, intelligent surveys in minutes.<br />
              Leverage AI for question generation, real-time analytics, and actionable insights.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/auth/sign-up">
                <Button size="xl" className="px-10 py-4 text-lg font-bold bg-gradient-to-r from-blue-500 to-pink-400 shadow-lg hover:scale-105 transition-transform">
                  Start Free
                </Button>
              </Link>
              <Link href="/demo">
                <Button variant="outline" size="xl" className="px-10 py-4 text-lg font-bold border-2 border-blue-400 bg-white shadow-lg hover:scale-105 transition-transform">
                  View Demo
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="container mx-auto px-4 py-16">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="text-center shadow-md border-0 bg-white/90">
              <CardHeader>
                <Brain className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <CardTitle className="text-xl font-bold">AI Question Generation</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>Instantly generate smart, relevant questions using advanced AI.</CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center shadow-md border-0 bg-white/90">
              <CardHeader>
                <BarChart3 className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <CardTitle className="text-xl font-bold">Real-time Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>Track responses and analyze data with interactive dashboards.</CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center shadow-md border-0 bg-white/90">
              <CardHeader>
                <Users className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                <CardTitle className="text-xl font-bold">Easy Sharing</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>Share surveys via link and collect responses from anywhere.</CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center shadow-md border-0 bg-white/90">
              <CardHeader>
                <Zap className="h-12 w-12 text-orange-600 mx-auto mb-4" />
                <CardTitle className="text-xl font-bold">Lightning Fast</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>Build and deploy surveys in minutes, not hours.</CardDescription>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t bg-white/80 backdrop-blur-sm mt-16">
          <div className="container mx-auto px-4 py-8 text-center text-gray-600">
            <p>&copy; 2024 FormWise. Built with AI and love.</p>
          </div>
        </footer>
      </div>
    </div>
  )
}
