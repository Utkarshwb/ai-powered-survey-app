"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Download, FileText, Database, FileSpreadsheet, Loader2, Copy, Check, Link, Share } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface ExportMenuProps {
  surveyId: string
  surveyTitle: string
}

export function ExportMenu({ surveyId, surveyTitle }: ExportMenuProps) {
  const [isExporting, setIsExporting] = useState<string | null>(null)
  const [copiedLink, setCopiedLink] = useState(false)
  const { toast } = useToast()

  const copyPublicLink = async () => {
    try {
      const publicUrl = `${window.location.origin}/survey/${surveyId}`
      await navigator.clipboard.writeText(publicUrl)
      setCopiedLink(true)
      
      toast({
        title: "Link copied!",
        description: "Survey link has been copied to your clipboard.",
      })
      
      setTimeout(() => setCopiedLink(false), 2000)
    } catch (error) {
      toast({
        title: "Failed to copy",
        description: "Could not copy link to clipboard.",
        variant: "destructive",
      })
    }
  }

  const handleExport = async (format: string, type?: string) => {
    setIsExporting(format)

    try {
      let endpoint = ""
      const body: any = { surveyId }

      switch (format) {
        case "csv":
          endpoint = "/api/export/csv"
          body.format = "questions"
          break
        case "json":
          endpoint = "/api/export/json"
          break
        case "pdf":
          endpoint = "/api/export/pdf"
          break
        default:
          return
      }

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })

      if (!response.ok) {
        throw new Error("Export failed")
      }

      // Get filename from response headers or create default
      const contentDisposition = response.headers.get("content-disposition")
      const filename = contentDisposition
        ? contentDisposition.split("filename=")[1]?.replace(/"/g, "")
        : `${surveyTitle.replace(/[^a-zA-Z0-9]/g, "_")}_export`

      // Create blob and download
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = filename
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error("Export error:", error)
      // You could add a toast notification here
    } finally {
      setIsExporting(null)
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" disabled={isExporting !== null} className="gap-2">
          {isExporting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="hidden sm:inline">Exporting...</span>
            </>
          ) : (
            <>
              <Share className="h-4 w-4" />
              <span className="hidden sm:inline">Share & Export</span>
            </>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Share Survey</DropdownMenuLabel>
        
        <DropdownMenuItem onClick={copyPublicLink}>
          {copiedLink ? (
            <>
              <Check className="h-4 w-4 mr-2 text-green-600" />
              Link Copied!
            </>
          ) : (
            <>
              <Copy className="h-4 w-4 mr-2" />
              Copy Survey Link
            </>
          )}
        </DropdownMenuItem>

        <DropdownMenuSeparator />
        <DropdownMenuLabel>Export Data</DropdownMenuLabel>

        <DropdownMenuItem onClick={() => handleExport("csv")}>
          <FileSpreadsheet className="h-4 w-4 mr-2" />
          Export CSV
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={() => handleExport("json")}>
          <Database className="h-4 w-4 mr-2" />
          Export JSON
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={() => handleExport("pdf")}>
          <FileText className="h-4 w-4 mr-2" />
          Export PDF
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default ExportMenu
