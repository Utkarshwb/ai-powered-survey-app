"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Brain, BarChart3, Users, Zap, Sun, Moon } from "lucide-react"
import Link from "next/link"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

export default function HomePage() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="min-h-screen w-full bg-white dark:bg-black relative">
      {/* Light Mode Background */}
      <div
        className="absolute inset-0 z-0 dark:hidden"
        style={{
          background: "white",
          backgroundImage: `
            linear-gradient(to right, rgba(71,85,105,0.3) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(71,85,105,0.3) 1px, transparent 1px),
            radial-gradient(circle, rgba(71,85,105,0.6) 1px, transparent 1px)
          `,
          backgroundSize: "20px 20px, 20px 20px, 20px 20px",
          backgroundPosition: "0 0, 0 0, 0 0",
        }}
      />
      
      {/* Dark Mode Background */}
      <div
        className="absolute inset-0 z-0 hidden dark:block"
        style={{
          background: "#000000",
          backgroundImage: `
            linear-gradient(to right, rgba(255,255,255,0.06) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255,255,255,0.06) 1px, transparent 1px),
            radial-gradient(circle, rgba(255,255,255,0.6) 1px, transparent 1px)
          `,
          backgroundSize: "20px 20px, 20px 20px, 20px 20px",
          backgroundPosition: "0 0, 0 0, 0 0",
        }}
      />

      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Dark Mode Toggle - Top Right */}
        <div className="fixed top-4 right-4 z-50">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="rounded-full bg-white/90 dark:bg-black/90 backdrop-blur-md border-gray-200 dark:border-gray-800 shadow-lg hover:bg-gray-50 dark:hover:bg-gray-900"
          >
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-gray-900 dark:text-gray-100" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-gray-900 dark:text-gray-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
        </div>
        
        {/* Header */}
        <header className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
          <div className="bg-white/90 dark:bg-black/90 backdrop-blur-md rounded-full border border-gray-200 dark:border-gray-800 shadow-lg px-6 py-2 flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-gray-900 dark:text-gray-100" />
              <span className="font-medium text-gray-900 dark:text-gray-100">FormWise</span>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/auth/login">
                <Button variant="ghost" size="sm" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 rounded-full">
                  Sign In
                </Button>
              </Link>
              <Link href="/auth/sign-up">
                <Button size="sm" className="bg-gray-900 dark:bg-gray-100 hover:bg-gray-800 dark:hover:bg-gray-200 text-white dark:text-gray-900 rounded-full">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="container mx-auto px-6 pt-32 pb-20 flex flex-col items-center text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-7xl font-bold text-gray-900 dark:text-white mb-8 leading-tight">Build Smarter Surveys with AI</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-12 leading-relaxed max-w-2xl mx-auto">
              FormWise empowers you to create beautiful, intelligent surveys in minutes. 
              Leverage AI for question generation, real-time analytics, and actionable insights.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/auth/sign-up">
                <Button size="lg" className="px-12 py-4 text-lg font-semibold bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100 rounded-lg shadow-md">
                  Start Free
                </Button>
              </Link>
              <Link href="/demo">
                <Button variant="outline" size="lg" className="px-12 py-4 text-lg font-semibold border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-transparent hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-900 dark:text-white rounded-lg">
                  View Demo
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="container mx-auto px-6 py-20">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Everything you need to succeed</h3>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">Powerful features designed to help you create, distribute, and analyze surveys like never before.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="text-center border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 hover:shadow-lg dark:hover:shadow-gray-900/20 transition-all duration-300">
              <CardHeader className="pb-4">
                <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Brain className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                </div>
                <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">AI Question Generation</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600 dark:text-gray-400">Instantly generate smart, relevant questions using advanced AI.</CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 hover:shadow-lg dark:hover:shadow-gray-900/20 transition-all duration-300">
              <CardHeader className="pb-4">
                <div className="w-16 h-16 bg-green-50 dark:bg-green-900/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <BarChart3 className="h-8 w-8 text-green-600 dark:text-green-400" />
                </div>
                <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">Real-time Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600 dark:text-gray-400">Track responses and analyze data with interactive dashboards.</CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 hover:shadow-lg dark:hover:shadow-gray-900/20 transition-all duration-300">
              <CardHeader className="pb-4">
                <div className="w-16 h-16 bg-purple-50 dark:bg-purple-900/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                </div>
                <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">Easy Sharing</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600 dark:text-gray-400">Share surveys via link and collect responses from anywhere.</CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 hover:shadow-lg dark:hover:shadow-gray-900/20 transition-all duration-300">
              <CardHeader className="pb-4">
                <div className="w-16 h-16 bg-yellow-50 dark:bg-yellow-900/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Zap className="h-8 w-8 text-yellow-600 dark:text-yellow-400" />
                </div>
                <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">Lightning Fast</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600 dark:text-gray-400">Build and deploy surveys in minutes, not hours.</CardDescription>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 mt-20">
          <div className="container mx-auto px-6 py-12 text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-md flex items-center justify-center">
                <Brain className="h-4 w-4 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900 dark:text-white">FormWise</span>
            </div>
            <p className="text-gray-600 dark:text-gray-400">&copy; {new Date().getFullYear()} FormWise. Built with AI and love.</p>
          </div>
        </footer>
      </div>
    </div>
  )
}
