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
    <div className="h-screen w-full bg-white dark:bg-black relative overflow-hidden">
      {/* Light Mode Background */}
      <div
        className="absolute inset-0 z-0 dark:hidden"
        style={{
          background: "#ffffff",
          backgroundImage: `
            linear-gradient(to right, rgba(0,0,0,0.06) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(0,0,0,0.06) 1px, transparent 1px),
            radial-gradient(circle, rgba(0,0,0,0.6) 1px, transparent 1px)
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

      <div className="relative z-10 flex flex-col h-full">
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
                <Button variant="ghost" size="sm" className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100/80 dark:hover:bg-gray-700/80 rounded-full border border-transparent hover:border-gray-300 dark:hover:border-gray-600">
                  Sign In
                </Button>
              </Link>
              <Link href="/auth/sign-up">
                <Button size="sm" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 border border-blue-500/30">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </header>

        {/* Main Content - Centered */}
        <div className="flex-1 flex flex-col justify-center items-center px-6 py-20">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h2 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">Build Smarter Surveys with AI</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 leading-relaxed max-w-2xl mx-auto">
              FormWise empowers you to create beautiful, intelligent surveys in minutes. 
              Leverage AI for question generation, real-time analytics, and actionable insights.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              <Link href="/auth/sign-up">
                <Button size="lg" className="px-12 py-4 text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 border border-blue-500/30">
                  Start Free
                </Button>
              </Link>
              <Link href="/demo">
                <Button variant="outline" size="lg" className="px-12 py-4 text-lg font-semibold border-2 border-gray-400 dark:border-gray-500 bg-white/90 dark:bg-gray-800/90 hover:bg-white dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg backdrop-blur-sm shadow-lg dark:shadow-gray-900/40">
                  View Demo
                </Button>
              </Link>
            </div>
          </div>

          {/* Features - Compact Grid */}
          <div className="w-full max-w-6xl">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="text-center border border-gray-300 dark:border-gray-600 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm hover:shadow-xl dark:hover:shadow-gray-900/40 transition-all duration-300">
                <CardHeader className="pb-3">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/40 rounded-xl flex items-center justify-center mx-auto mb-3 border border-blue-200 dark:border-blue-700">
                    <Brain className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">AI Questions</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm text-gray-700 dark:text-gray-300">Smart question generation using AI</CardDescription>
                </CardContent>
              </Card>

              <Card className="text-center border border-gray-300 dark:border-gray-600 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm hover:shadow-xl dark:hover:shadow-gray-900/40 transition-all duration-300">
                <CardHeader className="pb-3">
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900/40 rounded-xl flex items-center justify-center mx-auto mb-3 border border-green-200 dark:border-green-700">
                    <BarChart3 className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                  <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">Analytics</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm text-gray-700 dark:text-gray-300">Real-time data & insights</CardDescription>
                </CardContent>
              </Card>

              <Card className="text-center border border-gray-300 dark:border-gray-600 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm hover:shadow-xl dark:hover:shadow-gray-900/40 transition-all duration-300">
                <CardHeader className="pb-3">
                  <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/40 rounded-xl flex items-center justify-center mx-auto mb-3 border border-purple-200 dark:border-purple-700">
                    <Users className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">Easy Sharing</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm text-gray-700 dark:text-gray-300">Share surveys anywhere</CardDescription>
                </CardContent>
              </Card>

              <Card className="text-center border border-gray-300 dark:border-gray-600 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm hover:shadow-xl dark:hover:shadow-gray-900/40 transition-all duration-300">
                <CardHeader className="pb-3">
                  <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/40 rounded-xl flex items-center justify-center mx-auto mb-3 border border-yellow-200 dark:border-yellow-700">
                    <Zap className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                  </div>
                  <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">Lightning Fast</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm text-gray-700 dark:text-gray-300">Build surveys in minutes</CardDescription>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
