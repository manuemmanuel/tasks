"use client"

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Crown, CheckCircle2, ArrowLeft, Trophy } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import Sidebar from '@/components/Sidebar'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'

interface Task {
  id: string
  description: string
  completed: boolean
}

interface Quest {
  id: string
  title: string
  description: string
  tasks: Task[]
  difficulty: 'Easy' | 'Medium' | 'Hard'
  xp: number
}

type PageProps = {
  params: {
    id: string
  }
  searchParams: { [key: string]: string | string[] | undefined }
}

export default function QuestDetailsPage({ params }: PageProps) {
  const router = useRouter()
  const { user, loading } = useAuth()
  const [quest, setQuest] = useState<Quest | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
      return
    }

    const loadQuestDetails = async () => {
      try {
        if (!user) return

        const { data, error } = await supabase
          .from('quests')
          .select('*')
          .eq('id', params.id)
          .eq('user_id', user.id)
          .single()

        if (error) throw error

        setQuest({
          ...data,
          tasks: data.selected_tasks
        })
      } catch (error) {
        console.error('Error loading quest details:', error)
        setError('Failed to load quest details')
      } finally {
        setIsLoading(false)
      }
    }

    loadQuestDetails()
  }, [params.id, user, loading])

  const toggleTask = async (taskId: string) => {
    if (!quest) return

    try {
      const updatedTasks = quest.tasks.map(task =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )

      const { error } = await supabase
        .from('quests')
        .update({ selected_tasks: updatedTasks })
        .eq('id', quest.id)

      if (error) throw error

      setQuest(prev => prev ? {
        ...prev,
        tasks: updatedTasks
      } : null)
    } catch (error) {
      console.error('Error updating task:', error)
    }
  }

  if (isLoading) {
    return (
      <div className="flex">
        <Sidebar />
        <div className="flex-1 min-h-screen bg-[#030014] flex items-center justify-center">
          <div className="text-violet-200">Loading...</div>
        </div>
      </div>
    )
  }

  if (error || !quest) {
    return (
      <div className="flex">
        <Sidebar />
        <div className="flex-1 min-h-screen bg-[#030014] flex items-center justify-center">
          <div className="text-red-400">{error || 'Quest not found'}</div>
        </div>
      </div>
    )
  }

  const completedTasks = quest.tasks.filter(task => task.completed).length
  const progress = (completedTasks / quest.tasks.length) * 100

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 min-h-screen bg-[#030014] text-white p-8 md:pl-20">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <Button
              variant="ghost"
              className="text-violet-300 hover:text-violet-200 mb-6"
              onClick={() => router.back()}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Quests
            </Button>

            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-3xl font-bold text-violet-100 flex items-center gap-2">
                  <Crown className="h-8 w-8 text-violet-400" />
                  {quest.title}
                </h1>
                <p className="text-violet-300/80 mt-2">{quest.description}</p>
              </div>
              <Badge 
                variant="secondary"
                className="bg-violet-500/20 text-violet-200 border-violet-500/30 text-lg"
              >
                {quest.xp} XP
              </Badge>
            </div>
          </motion.div>

          <Card className="bg-[#0E0529]/80 border-violet-500/30 p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-violet-100">Progress</h2>
              <span className="text-violet-200">
                {completedTasks} of {quest.tasks.length} tasks completed
              </span>
            </div>
            <div className="w-full h-2 bg-violet-950 rounded-full overflow-hidden">
              <div
                className="h-full bg-violet-500 transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </Card>

          <div className="space-y-4">
            {quest.tasks.map((task) => (
              <motion.button
                key={task.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={() => toggleTask(task.id)}
                className={cn(
                  "flex items-center gap-3 w-full p-4 rounded-lg transition-all duration-300",
                  "bg-violet-950/40 border border-violet-500/20",
                  "hover:bg-violet-500/10 hover:border-violet-500/30",
                  task.completed && "bg-violet-500/10 border-violet-500/30"
                )}
              >
                <CheckCircle2 
                  className={cn(
                    "h-5 w-5 shrink-0",
                    task.completed ? "text-violet-400 fill-violet-400" : "text-violet-400/50"
                  )}
                />
                <span className={cn(
                  "text-left text-violet-100",
                  task.completed && "line-through text-violet-300/70"
                )}>
                  {task.description}
                </span>
              </motion.button>
            ))}
          </div>

          {completedTasks === quest.tasks.length && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-8 p-6 bg-violet-500/20 border border-violet-500/30 rounded-lg text-center"
            >
              <Trophy className="h-12 w-12 text-violet-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-violet-100 mb-2">Quest Completed!</h3>
              <p className="text-violet-200">Congratulations! You've earned {quest.xp} XP</p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
} 