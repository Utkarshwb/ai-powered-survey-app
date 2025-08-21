"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Download, Loader2 } from "lucide-react"

interface BulkExportProps {
  surveys: any[]
  userId: string
}

export function BulkExport({ surveys, userId }: BulkExportProps) {
  const [selectedSurveys, setSelectedSurveys] = useState<string[]>([])
  const [exportFormat, setExportFormat] = useState("csv")
  const [isExporting, setIsExporting] = useState(false)

  const handleSurveyToggle = (surveyId: string, checked: boolean) => {
    if (checked) {
      setSelectedSurveys([...selectedSurveys, surveyId])
    } else {
      setSelectedSurveys(selectedSurveys.filter((id) => id !== surveyId))
    }
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedSurveys(surveys.map((s) => s.id))
    } else {
      setSelectedSurveys([])
    }
  }

  const handleBulkExport = async () => {
    if (selectedSurveys.length === 0) return

    setIsExporting(true)

    try {
      const response = await fetch("/api/export/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          surveyIds: selectedSurveys,
          format: exportFormat,
        }),
      })

      if (!response.ok) {
        throw new Error("Bulk export failed")
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `bulk_export_${new Date().toISOString().split("T")[0]}.zip`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error("Bulk export error:", error)
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Bulk Export</CardTitle>
        <CardDescription>Export data from multiple surveys at once</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <Label>Select Surveys</Label>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="select-all"
              checked={selectedSurveys.length === surveys.length}
              onCheckedChange={handleSelectAll}
            />
            <Label htmlFor="select-all" className="text-sm">
              Select All
            </Label>
          </div>
        </div>

        <div className="max-h-60 overflow-y-auto space-y-2">
          {surveys.map((survey) => (
            <div key={survey.id} className="flex items-center space-x-2">
              <Checkbox
                id={survey.id}
                checked={selectedSurveys.includes(survey.id)}
                onCheckedChange={(checked) => handleSurveyToggle(survey.id, checked as boolean)}
              />
              <Label htmlFor={survey.id} className="flex-1 cursor-pointer">
                {survey.title}
              </Label>
            </div>
          ))}
        </div>

        <div>
          <Label htmlFor="format">Export Format</Label>
          <Select value={exportFormat} onValueChange={setExportFormat}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="csv">CSV Files</SelectItem>
              <SelectItem value="json">JSON Files</SelectItem>
              <SelectItem value="combined">Combined Report</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button onClick={handleBulkExport} disabled={selectedSurveys.length === 0 || isExporting} className="w-full">
          {isExporting ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Exporting {selectedSurveys.length} surveys...
            </>
          ) : (
            <>
              <Download className="h-4 w-4 mr-2" />
              Export {selectedSurveys.length} Selected Surveys
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  )
}
