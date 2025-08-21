"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Star } from "lucide-react"
import type { Question } from "@/lib/types"

interface QuestionRendererProps {
  question: Question
  value: any
  onChange: (value: any) => void
}

export function QuestionRenderer({ question, value, onChange }: QuestionRendererProps) {
  const [rating, setRating] = useState(value || 0)
  const [hoveredRating, setHoveredRating] = useState(0)

  if (!question) {
    return <div className="text-gray-500 italic">Question not available</div>
  }

  const handleRatingClick = (newRating: number) => {
    setRating(newRating)
    onChange(newRating)
  }

  switch (question.question_type) {
    case "text":
      return (
        <Textarea
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Enter your response..."
          rows={4}
          className="w-full"
        />
      )

    case "email":
      return (
        <Input
          type="email"
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Enter your email address..."
          className="w-full"
        />
      )

    case "number":
      return (
        <Input
          type="number"
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Enter a number..."
          className="w-full"
        />
      )

    case "yes_no":
      return (
        <RadioGroup value={value || ""} onValueChange={onChange}>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="yes" id="yes" />
            <Label htmlFor="yes">Yes</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="no" id="no" />
            <Label htmlFor="no">No</Label>
          </div>
        </RadioGroup>
      )

    case "multiple_choice":
      if (!question.options || question.options.length === 0) {
        return <div className="text-gray-500 italic">No options available for this question</div>
      }

      return (
        <RadioGroup value={value || ""} onValueChange={onChange}>
          {question.options.map((option, index) => (
            <div key={index} className="flex items-center space-x-2">
              <RadioGroupItem value={option} id={`option-${index}`} />
              <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                {option}
              </Label>
            </div>
          ))}
        </RadioGroup>
      )

    case "rating":
      return (
        <div className="space-y-4">
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => handleRatingClick(star)}
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
                className="p-1 transition-colors"
              >
                <Star
                  className={`h-8 w-8 ${
                    star <= (hoveredRating || rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                  }`}
                />
              </button>
            ))}
          </div>
          <div className="flex justify-between text-sm text-gray-500">
            <span>Poor</span>
            <span>Excellent</span>
          </div>
          {rating > 0 && <p className="text-sm text-gray-600">You rated: {rating} out of 5 stars</p>}
        </div>
      )

    default:
      return <div className="text-gray-500 italic">Unsupported question type: {question.question_type}</div>
  }
}
