"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Upload, FileImage, Scan, Loader2 } from "lucide-react"
import { extractReceiptDetails } from "@/lib/helpers"

interface ExtractedData {
  [key: string]: any
}

export default function ReceiptScanner() {
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isExtracting, setIsExtracting] = useState(false)
  const [extractedData, setExtractedData] = useState<ExtractedData | null>(null)

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && file.type.startsWith("image/")) {
      setSelectedImage(file)
      setExtractedData(null) // Clear previous results

      // Create preview URL
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleExtractDetails = async () => {
    if (!selectedImage) return

    setIsExtracting(true)
    try{
      const data = await extractReceiptDetails(selectedImage);
      setExtractedData(data);
    }catch(error){
      console.error("Error extracting receipt details:", error);
    }finally{
      setIsExtracting(false);
    }
  }

  const renderValue = (value: any): React.ReactNode => {
    if (Array.isArray(value)) {
      return (
        <div className="space-y-2">
          {value.map((item, index) => (
            <div key={index} className="bg-muted/50 p-2 rounded text-sm">
              {typeof item === "object" ? (
                <div className="space-y-1">
                  {Object.entries(item).map(([key, val]) => (
                    <div key={key} className="flex justify-between">
                      <span className="text-muted-foreground capitalize">{key.replace("_", " ")}:</span>
                      <span className="font-medium">{String(val)}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <span>{String(item)}</span>
              )}
            </div>
          ))}
        </div>
      )
    }

    if (typeof value === "object" && value !== null) {
      return (
        <div className="space-y-2 pl-4">
          {Object.entries(value).map(([key, val]) => (
            <div key={key} className="flex flex-col space-y-1">
              <span className="text-sm font-medium text-muted-foreground capitalize">{key.replace("_", " ")}:</span>
              <span className="text-sm">{renderValue(val)}</span>
            </div>
          ))}
        </div>
      )
    }

    return <span className="font-medium">{String(value)}</span>
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-foreground">Receipt Scanner</h1>
          <p className="text-muted-foreground">Upload a receipt image to extract details automatically</p>
        </div>

        {/* Upload Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Upload Receipt
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-center w-full">
                <label
                  htmlFor="receipt-upload"
                  className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-border rounded-lg cursor-pointer bg-muted/20 hover:bg-muted/40 transition-colors"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <FileImage className="w-8 h-8 mb-2 text-muted-foreground" />
                    <p className="mb-2 text-sm text-muted-foreground">
                      <span className="font-semibold">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-muted-foreground">PNG, JPG, JPEG (MAX. 10MB)</p>
                  </div>
                  <input
                    id="receipt-upload"
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                </label>
              </div>

              {selectedImage && (
                <div className="text-sm text-muted-foreground">
                  Selected: {selectedImage.name} ({(selectedImage.size / 1024 / 1024).toFixed(2)} MB)
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Image Preview and Extract Button */}
        {imagePreview && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileImage className="h-5 w-5" />
                Image Preview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-center">
                <img
                  src={imagePreview || "/placeholder.svg"}
                  alt="Receipt preview"
                  className="max-w-full max-h-96 object-contain rounded-lg border"
                />
              </div>

              <div className="flex justify-center">
                <Button onClick={handleExtractDetails} disabled={isExtracting} size="lg" className="min-w-48">
                  {isExtracting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Extracting Details...
                    </>
                  ) : (
                    <>
                      <Scan className="mr-2 h-4 w-4" />
                      Extract Details
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Results Section */}
        {extractedData && (
          <Card>
            <CardHeader>
              <CardTitle className="text-accent-foreground">Extracted Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(extractedData).map(([key, value]) => (
                  <div key={key} className="border-b border-border pb-3 last:border-b-0">
                    <div className="flex flex-col space-y-2">
                      <span className="text-sm font-semibold text-card-foreground uppercase tracking-wide">
                        {key.replace("_", " ")}
                      </span>
                      <div className="text-foreground">{renderValue(value)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
