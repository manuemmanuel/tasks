"use client"

import { useState } from "react"
import { Upload, BookOpen, Loader2, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { motion } from "framer-motion"
import Sidebar from "@/components/Sidebar"
import { useToast } from "@/components/ui/use-toast"

export default function GenerateQuizPage() {
  const [topic, setTopic] = useState("")
  const [description, setDescription] = useState("")
  const [pdfFile, setPdfFile] = useState<File | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const { toast } = useToast()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && file.type === "application/pdf") {
      setPdfFile(file)
      toast({
        title: "PDF uploaded successfully",
        description: "Your PDF has been uploaded and is ready for quiz generation.",
      })
    } else {
      toast({
        title: "Invalid file type",
        description: "Please upload a PDF file.",
        variant: "destructive",
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsGenerating(true)

    try {
      const formData = new FormData()
      if (topic) formData.append("topic", topic)
      if (description) formData.append("description", description)
      if (pdfFile) formData.append("pdf", pdfFile)

      const response = await fetch("/api/generate-quiz", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Failed to generate quiz")
      }

      const data = await response.json()
      
      toast({
        title: "Quiz generated successfully",
        description: "Your quiz has been created and is ready to take.",
      })

      // Reset form
      setTopic("")
      setDescription("")
      setPdfFile(null)
    } catch (error) {
      toast({
        title: "Error generating quiz",
        description: "There was a problem generating your quiz. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1">
        <div className="min-h-screen bg-gradient-to-b from-[#030014] to-[#0E0529] text-white p-8 md:pl-20">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex items-center justify-between mb-8"
            >
              <div>
                <h1 className="text-4xl font-bold text-violet-100 flex items-center gap-3">
                  <Sparkles className="h-10 w-10 text-violet-400 animate-pulse" />
                  Generate Quiz
                </h1>
                <p className="text-violet-300/80 mt-2 text-lg">Create quizzes from topics or PDF documents</p>
              </div>
            </motion.div>

            {/* Main Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Card className="bg-[#0E0529]/80 border-violet-500/30">
                <CardHeader>
                  <CardTitle className="text-2xl text-violet-100">Create New Quiz</CardTitle>
                  <CardDescription className="text-violet-300/80">
                    Enter a topic or upload a PDF to generate a quiz using AI
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Topic Input */}
                    <div className="space-y-2">
                      <Label htmlFor="topic" className="text-violet-200">Topic</Label>
                      <Input
                        id="topic"
                        placeholder="Enter a topic (e.g., 'World War II', 'Cell Biology')"
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                        className="bg-violet-950/50 border-violet-500/20 text-violet-100 placeholder:text-violet-400/50 focus:ring-2 focus:ring-violet-500/50"
                      />
                    </div>

                    {/* Description Input */}
                    <div className="space-y-2">
                      <Label htmlFor="description" className="text-violet-200">Description (Optional)</Label>
                      <Textarea
                        id="description"
                        placeholder="Add more context about the topic..."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="bg-violet-950/50 border-violet-500/20 text-violet-100 placeholder:text-violet-400/50 focus:ring-2 focus:ring-violet-500/50 min-h-[100px]"
                      />
                    </div>

                    {/* PDF Upload */}
                    <div className="space-y-2">
                      <Label htmlFor="pdf" className="text-violet-200">Upload PDF (Optional)</Label>
                      <div className="flex items-center gap-4">
                        <Input
                          id="pdf"
                          type="file"
                          accept=".pdf"
                          onChange={handleFileChange}
                          className="bg-violet-950/50 border-violet-500/20 text-violet-100 file:bg-violet-600 file:text-white file:border-0 file:rounded-md file:px-4 file:py-2 file:mr-4 file:hover:bg-violet-500"
                        />
                        {pdfFile && (
                          <span className="text-violet-300/80 text-sm">
                            {pdfFile.name}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Submit Button */}
                    <Button
                      type="submit"
                      disabled={isGenerating || (!topic && !pdfFile)}
                      className="w-full bg-violet-600 hover:bg-violet-500 text-white py-6 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isGenerating ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Generating Quiz...
                        </>
                      ) : (
                        <>
                          <Sparkles className="mr-2 h-4 w-4" />
                          Generate Quiz
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
} 