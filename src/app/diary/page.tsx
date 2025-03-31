'use client'

import { useState } from 'react'
import { BookOpen, Plus, Calendar, Tag, Save, PenTool } from 'lucide-react'
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import Sidebar from '@/components/Sidebar'

interface DiaryEntry {
  id: string
  title: string
  content: string
  date: string
  tags: string[]
}

export default function DiaryPage() {
  const [currentEntry, setCurrentEntry] = useState<DiaryEntry>({
    id: '',
    title: '',
    content: '',
    date: new Date().toISOString().split('T')[0],
    tags: []
  })
  const [newTag, setNewTag] = useState('')

  const handleSave = () => {
    if (!currentEntry.title || !currentEntry.content) return

    const entry: DiaryEntry = {
      ...currentEntry,
      id: currentEntry.id || Date.now().toString(),
      date: new Date().toISOString().split('T')[0]
    }

    // Here you would typically save to your database
    console.log('Saving entry:', entry)

    // Reset the form
    setCurrentEntry({
      id: '',
      title: '',
      content: '',
      date: new Date().toISOString().split('T')[0],
      tags: []
    })
  }

  const addTag = () => {
    if (newTag && !currentEntry.tags.includes(newTag)) {
      setCurrentEntry(prev => ({
        ...prev,
        tags: [...prev.tags, newTag]
      }))
      setNewTag('')
    }
  }

  const removeTag = (tag: string) => {
    setCurrentEntry(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag)
    }))
  }

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1">
        <div className="min-h-screen bg-[#030014] text-white p-8 md:pl-20">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-12">
              <div>
                <h1 className="text-3xl font-bold text-violet-100 flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-violet-500/20">
                    <BookOpen className="h-8 w-8 text-violet-400" />
                  </div>
                  Personal Diary
                </h1>
                <p className="text-violet-300/80 mt-2 text-lg">Record your thoughts and experiences</p>
              </div>
              <Button
                onClick={() => {
                  setCurrentEntry({
                    id: '',
                    title: '',
                    content: '',
                    date: new Date().toISOString().split('T')[0],
                    tags: []
                  })
                }}
                className="bg-violet-600 hover:bg-violet-500 text-white px-6"
              >
                <Plus className="h-5 w-5 mr-2" />
                New Entry
              </Button>
            </div>

            {/* Editor */}
            <Card className="p-8 bg-[#0E0529]/50 border-violet-500/20">
              <div className="space-y-6">
                <div className="flex items-start justify-between gap-6">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-violet-200 mb-2">
                      Entry Title
                    </label>
                    <input
                      type="text"
                      placeholder="Give your entry a title..."
                      value={currentEntry.title}
                      onChange={(e) => setCurrentEntry(prev => ({ ...prev, title: e.target.value }))}
                      className="w-full bg-violet-950/50 border-violet-500/30 rounded-lg px-4 py-2.5 text-sm focus:border-violet-500/50 text-violet-100 placeholder-violet-500/50"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="block text-sm font-medium text-violet-200 mb-2">
                      Date
                    </label>
                    <div className="relative">
                      <input
                        type="date"
                        value={currentEntry.date}
                        onChange={(e) => setCurrentEntry(prev => ({ ...prev, date: e.target.value }))}
                        className="w-[200px] bg-violet-950/50 border-violet-500/30 rounded-lg px-4 py-2.5 text-sm focus:border-violet-500/50 text-violet-100"
                      />
                      <Calendar className="absolute right-3 top-[10px] h-4 w-4 text-violet-400 pointer-events-none" />
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <label className="block text-sm font-medium text-violet-200 mb-2">
                      &nbsp;
                    </label>
                    <Button
                      onClick={handleSave}
                      className="bg-violet-600 hover:bg-violet-500 text-white px-6"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      Save Entry
                    </Button>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex-1 relative">
                    <label className="block text-sm font-medium text-violet-200 mb-2">
                      Tags
                    </label>
                    <input
                      type="text"
                      placeholder="Add a tag..."
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      className="w-full bg-violet-950/50 border-violet-500/30 rounded-lg px-4 py-2.5 text-sm focus:border-violet-500/50 text-violet-100 placeholder-violet-500/50"
                    />
                    <Tag className="absolute right-3 top-[10px] h-4 w-4 text-violet-400 pointer-events-none" />
                  </div>
                  <div className="flex flex-col">
                    <label className="block text-sm font-medium text-violet-200 mb-2">
                      &nbsp;
                    </label>
                    <Button
                      onClick={addTag}
                      variant="outline"
                      className="border-violet-500/50 text-violet-300 px-6"
                    >
                      <Tag className="h-4 w-4 mr-2" />
                      Add Tag
                    </Button>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 pt-2">
                  {currentEntry.tags.map(tag => (
                    <span
                      key={tag}
                      className="px-3 py-1.5 bg-violet-500/20 text-violet-200 rounded-full text-sm flex items-center gap-2 hover:bg-violet-500/30 transition-colors"
                    >
                      {tag}
                      <button
                        onClick={() => removeTag(tag)}
                        className="hover:text-violet-400 transition-colors"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>

                <div className="relative">
                  <label className="block text-sm font-medium text-violet-200 mb-2">
                    Content
                  </label>
                  <Textarea
                    placeholder="Write your thoughts here..."
                    value={currentEntry.content}
                    onChange={(e) => setCurrentEntry(prev => ({ ...prev, content: e.target.value }))}
                    className="min-h-[500px] bg-violet-950/50 border-violet-500/30 focus:border-violet-500/50 text-violet-100 placeholder-violet-500/50 rounded-lg p-6 text-sm leading-relaxed"
                  />
                  <div className="absolute top-8 right-6 text-violet-500/50">
                    <PenTool className="h-5 w-5" />
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
} 