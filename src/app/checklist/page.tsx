'use client'

import { useState } from 'react'
import { CheckSquare, Plus, Trash2, Check } from 'lucide-react'
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Sidebar from '@/components/Sidebar'

interface ChecklistItem {
  id: string
  text: string
  completed: boolean
}

export default function ChecklistPage() {
  const [items, setItems] = useState<ChecklistItem[]>([])
  const [newItem, setNewItem] = useState('')

  const addItem = () => {
    if (!newItem.trim()) return

    setItems(prev => [...prev, {
      id: Date.now().toString(),
      text: newItem.trim(),
      completed: false
    }])
    setNewItem('')
  }

  const toggleItem = (id: string) => {
    setItems(prev => prev.map(item =>
      item.id === id ? { ...item, completed: !item.completed } : item
    ))
  }

  const removeItem = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id))
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addItem()
    }
  }

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1">
        <div className="min-h-screen bg-[#030014] text-white p-8 md:pl-20">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-violet-100 flex items-center gap-3">
                  <div className="p-2 md:p-3 rounded-xl bg-violet-500/20">
                    <CheckSquare className="h-6 w-6 md:h-8 md:w-8 text-violet-400" />
                  </div>
                  Checklist
                </h1>
                <p className="text-violet-300/80 mt-2 text-base md:text-lg">Keep track of your tasks</p>
              </div>
            </div>

            {/* Add Item */}
            <Card className="p-4 md:p-6 bg-[#0E0529]/50 border-violet-500/20 mb-6">
              <div className="flex gap-4">
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={newItem}
                    onChange={(e) => setNewItem(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Add a new item..."
                    className="w-full bg-violet-950/50 border-violet-500/30 rounded-lg px-4 py-2.5 text-sm focus:border-violet-500/50 text-violet-100 placeholder-violet-500/50"
                  />
                </div>
                <Button
                  onClick={addItem}
                  className="bg-violet-600 hover:bg-violet-500 text-white px-4 md:px-6"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Add
                </Button>
              </div>
            </Card>

            {/* Checklist Items */}
            <Card className="p-4 md:p-6 bg-[#0E0529]/50 border-violet-500/20">
              <div className="space-y-2">
                {items.length === 0 ? (
                  <div className="text-center text-violet-300/60 py-8">
                    No items in your checklist yet
                  </div>
                ) : (
                  items.map(item => (
                    <div
                      key={item.id}
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-violet-500/10 transition-colors group"
                    >
                      <button
                        onClick={() => toggleItem(item.id)}
                        className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${
                          item.completed
                            ? 'bg-violet-600 border-violet-600'
                            : 'border-violet-500/30 hover:border-violet-500/50'
                        }`}
                      >
                        {item.completed && <Check className="h-3 w-3 text-white" />}
                      </button>
                      <span className={`flex-1 text-sm ${
                        item.completed
                          ? 'text-violet-300/50 line-through'
                          : 'text-violet-100'
                      }`}>
                        {item.text}
                      </span>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="opacity-0 group-hover:opacity-100 text-violet-300/50 hover:text-red-400 transition-opacity"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
} 