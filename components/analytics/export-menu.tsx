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
import { Download, FileText, Database, FileSpreadsheet, Loader2 } from "lucide-react"

interface ExportMenuProps {
  surveyId: string
  surveyTitle: string
}

export function ExportMenu({ surveyId, surveyTitle }: ExportMenuProps) {
  const [isExporting, setIsExporting] = useState<string | null>(null)

  const handleExport = async (format: string, type?: string) => {
    setIsExporting(format)

    try {
      let endpoint = ""
      const body: any = { surveyId }

      switch (format) {
        case "csv-responses":
          endpoint = "/api/export/csv"
          body.format = "responses"
          break
        case "csv-summary":
          endpoint = "/api/export/csv"
          body.format = "summary"
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
        <Button variant="outline" disabled={isExporting !== null}>
          {isExporting ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Exporting...
            </>
          ) : (
            <>
              <Download className="h-4 w-4 mr-2" />
              Export Data
            </>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Export Options</DropdownMenuLabel>
        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={() => handleExport("csv-responses")}>
          <FileSpreadsheet className="h-4 w-4 mr-2" />
          CSV - All Responses
        </DropdownMenuItem>

        <DropdownMenuItem onClick={() => handleExport("csv-summary")}>
          <FileSpreadsheet className="h-4 w-4 mr-2" />
          CSV - Summary Report
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={() => handleExport("json")}>
          <Database className="h-4 w-4 mr-2" />
          JSON - Complete Data
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={() => handleExport("pdf")}>
          <FileText className="h-4 w-4 mr-2" />
          HTML Report
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default ExportMenu
