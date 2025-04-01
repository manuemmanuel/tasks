'use client'

import { useState } from 'react'
import { CheckSquare, Plus, Trash2 } from 'lucide-react'
import { Button } from './ui/button'
import { Input } from './ui/input'

interface ChecklistItem {
  id: string
  text: string
  completed: boolean
}

export default function ChecklistContent() {
  const [items, setItems] = useState<ChecklistItem[]>([])
  const [newItem, setNewItem] = useState('')

  const addItem = () => {
    if (!newItem.trim()) return
    setItems([...items, { id: Date.now().toString(), text: newItem, completed: false }])
    setNewItem('')
  }

  const toggleItem = (id: string) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, completed: !item.completed } : item
    ))
  }

  const deleteItem = (id: string) => {
    setItems(items.filter(item => item.id !== id))
  }

  return (
    <div className="container mx-auto p-6 max-w-2xl">
      <div className="flex gap-2 mb-6">
        <Input
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          placeholder="Add a new task..."
          onKeyDown={(e) => e.key === 'Enter' && addItem()}
        />
        <Button onClick={addItem}>
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      <div className="space-y-2">
        {items.map(item => (
          <div key={item.id} className="flex items-center gap-2 p-2 bg-violet-950/20 rounded-lg">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => toggleItem(item.id)}
              className={item.completed ? 'text-violet-400' : 'text-violet-300/50'}
            >
              <CheckSquare className="h-5 w-5" />
            </Button>
            <span className={`flex-1 ${item.completed ? 'line-through text-violet-300/50' : 'text-violet-200'}`}>
              {item.text}
            </span>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => deleteItem(item.id)}
              className="text-violet-300/50 hover:text-red-400"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  )
} 