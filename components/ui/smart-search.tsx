"use client"

import { useState, useMemo } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { Search, Filter, X, Calendar, BarChart3 } from "lucide-react"

interface SmartSearchProps {
  onSearch: (query: string, filters: SearchFilters) => void
  totalCount: number
  className?: string
}

interface SearchFilters {
  status: 'all' | 'published' | 'draft'
  dateRange: '7days' | '30days' | '90days' | 'all'
  responseCount: 'all' | 'none' | 'low' | 'medium' | 'high'
  sortBy: 'newest' | 'oldest' | 'title' | 'responses'
}

const defaultFilters: SearchFilters = {
  status: 'all',
  dateRange: '30days',
  responseCount: 'all',
  sortBy: 'newest'
}

export function SmartSearch({ onSearch, totalCount, className }: SmartSearchProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState<SearchFilters>(defaultFilters)
  const [showFilters, setShowFilters] = useState(false)

  const activeFilterCount = useMemo(() => {
    return Object.entries(filters).filter(([key, value]) => {
      const defaultValue = defaultFilters[key as keyof SearchFilters]
      return value !== defaultValue
    }).length
  }, [filters])

  const handleSearchChange = (value: string) => {
    setSearchQuery(value)
    onSearch(value, filters)
  }

  const handleFilterChange = (key: keyof SearchFilters, value: string) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    onSearch(searchQuery, newFilters)
  }

  const clearFilters = () => {
    setFilters(defaultFilters)
    onSearch(searchQuery, defaultFilters)
  }

  const suggestions = [
    "customer feedback",
    "employee satisfaction",
    "published last week",
    "draft surveys",
    "high response rate"
  ]

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search surveys... (try 'customer feedback' or 'published last week')"
          value={searchQuery}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="pl-10 pr-20 h-12 text-base"
        />
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className="text-gray-500 hover:text-gray-700"
          >
            <Filter className="h-4 w-4 mr-1" />
            Filters
            {activeFilterCount > 0 && (
              <Badge variant="secondary" className="ml-1 h-5 w-5 rounded-full p-0 text-xs">
                {activeFilterCount}
              </Badge>
            )}
          </Button>
        </div>
      </div>

      {/* Quick Search Suggestions */}
      {searchQuery.length === 0 && (
        <div className="flex flex-wrap gap-2">
          <span className="text-sm text-gray-500">Try:</span>
          {suggestions.map((suggestion, index) => (
            <Button
              key={index}
              variant="outline"
              size="sm"
              className="text-xs h-7"
              onClick={() => handleSearchChange(suggestion)}
            >
              {suggestion}
            </Button>
          ))}
        </div>
      )}

      {/* Advanced Filters */}
      {showFilters && (
        <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 space-y-4 border">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-gray-900 dark:text-white">Filters</h3>
            {activeFilterCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-3 w-3 mr-1" />
                Clear all
              </Button>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Status Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Status
              </label>
              <Select 
                value={filters.status} 
                onValueChange={(value) => handleFilterChange('status', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Surveys</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="draft">Drafts</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Date Range Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                Created
              </label>
              <Select 
                value={filters.dateRange} 
                onValueChange={(value) => handleFilterChange('dateRange', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="7days">Last 7 Days</SelectItem>
                  <SelectItem value="30days">Last 30 Days</SelectItem>
                  <SelectItem value="90days">Last 90 Days</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Response Count Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1">
                <BarChart3 className="h-3 w-3" />
                Responses
              </label>
              <Select 
                value={filters.responseCount} 
                onValueChange={(value) => handleFilterChange('responseCount', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Any Amount</SelectItem>
                  <SelectItem value="none">No Responses</SelectItem>
                  <SelectItem value="low">1-10 Responses</SelectItem>
                  <SelectItem value="medium">11-50 Responses</SelectItem>
                  <SelectItem value="high">50+ Responses</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Sort By */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Sort By
              </label>
              <Select 
                value={filters.sortBy} 
                onValueChange={(value) => handleFilterChange('sortBy', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="oldest">Oldest First</SelectItem>
                  <SelectItem value="title">Title A-Z</SelectItem>
                  <SelectItem value="responses">Most Responses</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      )}

      {/* Results Summary */}
      <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
        <span>
          {totalCount} survey{totalCount !== 1 ? 's' : ''} 
          {searchQuery && ` matching "${searchQuery}"`}
        </span>
        {activeFilterCount > 0 && (
          <span className="flex items-center gap-1">
            <Filter className="h-3 w-3" />
            {activeFilterCount} filter{activeFilterCount !== 1 ? 's' : ''} applied
          </span>
        )}
      </div>
    </div>
  )
}
