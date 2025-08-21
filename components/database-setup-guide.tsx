"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { createClient } from "@/lib/supabase/client"
import { CheckCircle, AlertTriangle, Database, RefreshCw } from "lucide-react"

interface DatabaseSetupGuideProps {
  onSetupComplete?: () => void
}

export function DatabaseSetupGuide({ onSetupComplete }: DatabaseSetupGuideProps) {
  const [isChecking, setIsChecking] = useState(false)
  const [tablesExist, setTablesExist] = useState<Record<string, boolean>>({})
  const [lastChecked, setLastChecked] = useState<Date | null>(null)

  const requiredTables = [
    { name: "surveys", script: "001_create_surveys_table.sql", description: "Stores survey metadata" },
    { name: "questions", script: "002_create_questions_table.sql", description: "Stores survey questions" },
    { name: "responses", script: "003_create_responses_table.sql", description: "Stores user responses" },
    { name: "ai_suggestions", script: "004_create_ai_suggestions_table.sql", description: "Stores AI suggestions" },
  ]

  const checkDatabaseTables = async () => {
    setIsChecking(true)
    const supabase = createClient()
    const tableStatus: Record<string, boolean> = {}

    for (const table of requiredTables) {
      try {
        const { error } = await supabase.from(table.name).select("*").limit(1)
        tableStatus[table.name] = !error || !error.message.includes("does not exist")
      } catch (error) {
        tableStatus[table.name] = false
      }
    }

    setTablesExist(tableStatus)
    setLastChecked(new Date())
    setIsChecking(false)

    const allTablesExist = Object.values(tableStatus).every((exists) => exists)
    if (allTablesExist && onSetupComplete) {
      onSetupComplete()
    }
  }

  useEffect(() => {
    checkDatabaseTables()
  }, [])

  const allTablesReady = Object.values(tablesExist).every((exists) => exists)
  const someTablesExist = Object.values(tablesExist).some((exists) => exists)

  return (
    <Card className="border-amber-200 bg-amber-50">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Database className="h-5 w-5 text-amber-600" />
            <CardTitle className="text-amber-800">Database Setup Status</CardTitle>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={checkDatabaseTables}
            disabled={isChecking}
            className="text-amber-700 border-amber-300 bg-transparent"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isChecking ? "animate-spin" : ""}`} />
            {isChecking ? "Checking..." : "Check Status"}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {allTablesReady ? (
          <Alert className="border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              <p className="font-semibold">✅ Database Setup Complete!</p>
              <p className="text-sm">All required tables are ready. You can now create and save surveys.</p>
            </AlertDescription>
          </Alert>
        ) : (
          <Alert className="border-amber-200 bg-amber-100">
            <AlertTriangle className="h-4 w-4 text-amber-600" />
            <AlertDescription className="text-amber-800">
              <div className="space-y-4">
                <div>
                  <p className="font-semibold text-lg">⚠️ Database Setup Required</p>
                  <p className="text-sm">
                    {someTablesExist
                      ? "Some database tables are missing. Complete the setup to use all features."
                      : "The survey database tables need to be created before you can save surveys."}
                  </p>
                </div>

                <div className="space-y-3">
                  <p className="font-medium">📋 Table Status:</p>
                  <div className="grid gap-2">
                    {requiredTables.map((table) => (
                      <div key={table.name} className="flex items-center justify-between bg-white p-3 rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <code className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">{table.name}</code>
                            {tablesExist[table.name] ? (
                              <Badge variant="default" className="bg-green-100 text-green-800">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Ready
                              </Badge>
                            ) : (
                              <Badge variant="secondary" className="bg-amber-100 text-amber-800">
                                <AlertTriangle className="h-3 w-3 mr-1" />
                                Missing
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-gray-600 mt-1">{table.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-amber-100 p-4 rounded-lg">
                  <p className="font-medium mb-2">🔧 Setup Instructions:</p>
                  <ol className="list-decimal list-inside space-y-2 text-sm">
                    <li>
                      Look for the <strong>Scripts</strong> panel in the v0 interface
                    </li>
                    {requiredTables.map((table, index) => (
                      <li key={table.script}>
                        Click <strong>"Run Script"</strong> for:{" "}
                        <code className="bg-white px-2 py-1 rounded text-xs">scripts/{table.script}</code>
                        {tablesExist[table.name] && <span className="text-green-600 ml-2">✅ Done</span>}
                      </li>
                    ))}
                    <li>
                      <strong>Click "Check Status"</strong> above to verify the setup
                    </li>
                  </ol>
                </div>

                <div className="text-xs text-amber-700 bg-amber-100 p-2 rounded">
                  💡 <strong>Tip:</strong> Run the scripts in order (001, 002, 003, 004) to ensure proper database
                  setup.
                  {lastChecked && <span className="block mt-1">Last checked: {lastChecked.toLocaleTimeString()}</span>}
                </div>
              </div>
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  )
}
