'use client'

import { useState, useEffect, useRef } from 'react'
import { Clock, Play, Pause, RotateCcw, Settings, X } from 'lucide-react'
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Sidebar from '@/components/Sidebar'

interface Settings {
  workTime: number
  breakTime: number
  longBreakTime: number
  sessionsUntilLongBreak: number
}

export default function PomodoroPage() {
  const workerRef = useRef<Worker | null>(null)
  const [timeLeft, setTimeLeft] = useState<number>(25 * 60)
  const [isRunning, setIsRunning] = useState(false)
  const [isBreak, setIsBreak] = useState(false)
  const [sessionCount, setSessionCount] = useState(0)
  const [showSettings, setShowSettings] = useState(false)
  const [settings, setSettings] = useState<Settings>({
    workTime: 25,
    breakTime: 5,
    longBreakTime: 15,
    sessionsUntilLongBreak: 4
  })

  // Load saved state from localStorage after mount
  useEffect(() => {
    const savedTimeLeft = localStorage.getItem('pomodoroTimeLeft')
    const savedIsRunning = localStorage.getItem('pomodoroIsRunning')
    const savedIsBreak = localStorage.getItem('pomodoroIsBreak')
    const savedSessionCount = localStorage.getItem('pomodoroSessionCount')
    const savedSettings = localStorage.getItem('pomodoroSettings')

    if (savedTimeLeft) setTimeLeft(parseInt(savedTimeLeft))
    if (savedIsRunning) setIsRunning(savedIsRunning === 'true')
    if (savedIsBreak) setIsBreak(savedIsBreak === 'true')
    if (savedSessionCount) setSessionCount(parseInt(savedSessionCount))
    if (savedSettings) setSettings(JSON.parse(savedSettings))
  }, [])

  // Initialize Web Worker
  useEffect(() => {
    workerRef.current = new Worker(new URL('@/workers/timer.worker.ts', import.meta.url))
    
    workerRef.current.onmessage = (e) => {
      const { type, timeLeft } = e.data
      
      if (type === 'TICK') {
        setTimeLeft(timeLeft)
      } else if (type === 'COMPLETE') {
        // Play notification sound
        const audio = new Audio('/notification.mp3')
        audio.play()

        if (isBreak) {
          // Break is over, start work session
          setTimeLeft(settings.workTime * 60)
          setIsBreak(false)
          setSessionCount(prev => prev + 1)
        } else {
          // Work session is over, check if it's time for a long break
          if (sessionCount % settings.sessionsUntilLongBreak === 0) {
            setTimeLeft(settings.longBreakTime * 60)
            setSessionCount(0)
          } else {
            setTimeLeft(settings.breakTime * 60)
          }
          setIsBreak(true)
        }
        setIsRunning(false)
      }
    }

    return () => {
      workerRef.current?.terminate()
    }
  }, [])

  // Handle timer state changes
  useEffect(() => {
    if (workerRef.current) {
      if (isRunning) {
        workerRef.current.postMessage({ type: 'START', data: { timeLeft } })
      } else {
        workerRef.current.postMessage({ type: 'PAUSE' })
      }
    }
  }, [isRunning, timeLeft])

  // Save state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('pomodoroTimeLeft', timeLeft.toString())
    localStorage.setItem('pomodoroIsRunning', isRunning.toString())
    localStorage.setItem('pomodoroIsBreak', isBreak.toString())
    localStorage.setItem('pomodoroSessionCount', sessionCount.toString())
    localStorage.setItem('pomodoroSettings', JSON.stringify(settings))
  }, [timeLeft, isRunning, isBreak, sessionCount, settings])

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  const handleSaveSettings = () => {
    setTimeLeft(settings.workTime * 60)
    setIsBreak(false)
    setSessionCount(0)
    setShowSettings(false)
  }

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1">
        <div className="min-h-screen bg-[#030014] text-white p-8 md:pl-20">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold text-violet-100 flex items-center gap-2">
                  <Clock className="h-8 w-8 text-violet-400" />
                  Pomodoro Timer
                </h1>
                <p className="text-violet-300/80 mt-2">Stay focused and productive</p>
              </div>
              <Button
                onClick={() => setShowSettings(true)}
                className="bg-violet-600 hover:bg-violet-500 text-white"
              >
                <Settings className="h-5 w-5 mr-2" />
                Settings
              </Button>
            </div>

            {/* Timer */}
            <Card className="p-6 bg-[#0E0529]/80 border-violet-500/30 overflow-hidden hover:border-violet-500/50 transition-all duration-300 shadow-lg shadow-violet-500/10">
              <div className="flex flex-col items-center space-y-6">
                <div className="text-7xl font-bold text-violet-100 font-mono">
                  {formatTime(timeLeft)}
                </div>
                <div className="text-lg text-violet-200/90">
                  {isBreak ? 'Break Time' : 'Focus Time'}
                </div>
                <div className="flex items-center gap-4">
                  <Button
                    onClick={() => setIsRunning(!isRunning)}
                    className="bg-violet-600 hover:bg-violet-500 text-white"
                  >
                    {isRunning ? (
                      <>
                        <Pause className="h-5 w-5 mr-2" />
                        Pause
                      </>
                    ) : (
                      <>
                        <Play className="h-5 w-5 mr-2" />
                        Start
                      </>
                    )}
                  </Button>
                  <Button
                    onClick={() => {
                      setTimeLeft(settings.workTime * 60)
                      setIsBreak(false)
                      setIsRunning(false)
                      setSessionCount(0)
                    }}
                    variant="outline"
                    className="border-violet-500/50 text-violet-300 hover:bg-violet-500/10"
                  >
                    <RotateCcw className="h-5 w-5 mr-2" />
                    Reset
                  </Button>
                </div>
                <div className="text-sm text-violet-300/60">
                  Session {sessionCount + 1} of {settings.sessionsUntilLongBreak}
                </div>
              </div>
            </Card>

            {/* Settings Modal */}
            {showSettings && (
              <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
                <Card className="w-full max-w-md p-6 bg-[#0E0529]/80 border-violet-500/30 shadow-lg shadow-violet-500/10">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-violet-100">Timer Settings</h2>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setShowSettings(false)}
                      className="text-violet-300 hover:text-violet-200 hover:bg-violet-500/10"
                    >
                      <X className="h-5 w-5" />
                    </Button>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-violet-200 mb-2">
                        Work Time (minutes)
                      </label>
                      <Input
                        type="number"
                        value={settings.workTime}
                        onChange={(e) => setSettings(prev => ({ ...prev, workTime: parseInt(e.target.value) }))}
                        className="bg-violet-950/40 border-violet-500/30 text-violet-100"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-violet-200 mb-2">
                        Break Time (minutes)
                      </label>
                      <Input
                        type="number"
                        value={settings.breakTime}
                        onChange={(e) => setSettings(prev => ({ ...prev, breakTime: parseInt(e.target.value) }))}
                        className="bg-violet-950/40 border-violet-500/30 text-violet-100"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-violet-200 mb-2">
                        Long Break Time (minutes)
                      </label>
                      <Input
                        type="number"
                        value={settings.longBreakTime}
                        onChange={(e) => setSettings(prev => ({ ...prev, longBreakTime: parseInt(e.target.value) }))}
                        className="bg-violet-950/40 border-violet-500/30 text-violet-100"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-violet-200 mb-2">
                        Sessions Until Long Break
                      </label>
                      <Input
                        type="number"
                        value={settings.sessionsUntilLongBreak}
                        onChange={(e) => setSettings(prev => ({ ...prev, sessionsUntilLongBreak: parseInt(e.target.value) }))}
                        className="bg-violet-950/40 border-violet-500/30 text-violet-100"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-4 mt-6">
                    <Button
                      variant="outline"
                      onClick={() => setShowSettings(false)}
                      className="border-violet-500/50 text-violet-300 hover:bg-violet-500/10"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleSaveSettings}
                      className="bg-violet-600 hover:bg-violet-500 text-white"
                    >
                      Save Settings
                    </Button>
                  </div>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 