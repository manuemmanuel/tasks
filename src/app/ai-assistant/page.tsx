"use client"

import { useState, useRef, useEffect } from "react"
import { Send, Bot, ArrowLeft, User, Loader2, RefreshCw, ClipboardCopy, ClipboardList, FolderOpen, MessageSquare, Calendar, ArrowRight, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Toaster, toast } from "sonner"
import Sidebar from "@/components/Sidebar"
import { useRouter } from "next/navigation"
import ReactMarkdown from 'react-markdown'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { User as SupabaseUser } from '@supabase/supabase-js'

interface ChatSession {
  id: string;
  title: string;
  created_at: Date;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  id?: string;
  session_id?: string;
}

export default function AIAssistantPage() {
  const router = useRouter()
  const supabase = createClientComponentClient()
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const [currentUser, setCurrentUser] = useState<SupabaseUser | null>(null)

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session }, error } = await supabase.auth.getSession()
    }

    checkUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [router, supabase])

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setCurrentUser(user)
    }
    getUser()
  }, [])

  const sendMessage = async () => {
    if (!input.trim()) return
    
    const userMessage = input.trim()
    setInput("")
    const newUserMessage = { 
      role: 'user' as const, 
      content: userMessage,
      timestamp: new Date()
    }

    try {
      setMessages(prev => [...prev, newUserMessage])
      setIsLoading(true)

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage,
          context: messages.slice(-5).map(msg => ({
            role: msg.role,
            content: msg.content
          }))
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      if (!data || !data.message) {
        throw new Error('Invalid response from API')
      }

      const newAssistantMessage = { 
        role: 'assistant' as const, 
        content: data.message,
        timestamp: new Date()
      }

      setMessages(prev => [...prev, newAssistantMessage])
    } catch (error) {
      console.error('Error in sendMessage:', error instanceof Error ? error.message : 'Unknown error')
      toast.error(error instanceof Error ? error.message : "Failed to send message")
    } finally {
      setIsLoading(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success("Copied to clipboard")
  }

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col min-h-screen bg-[#030014] overflow-x-hidden">
        <div className="p-2 sm:p-4 md:p-8 md:pl-20">
          <Toaster richColors position="top-center" />

          <div className="mb-2 sm:mb-4 md:mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4">
            <div className="flex items-center gap-2 sm:gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => router.push('/')}
                className="text-violet-300 hover:text-violet-100 hover:bg-violet-500/20"
              >
                <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
              <div>
                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-violet-50 flex items-center gap-2">
                  <Bot className="h-5 w-5 sm:h-6 sm:w-6 md:h-8 md:w-8 text-violet-400" />
                  AI Assistant
                </h1>
                <p className="text-xs sm:text-sm md:text-base text-violet-200/90 mt-1 sm:mt-2">
                  {currentUser ? (
                    <span>Logged in as {currentUser.email}</span>
                  ) : (
                    'Chat with your AI assistant'
                  )}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                onClick={() => setMessages([])}
                className="text-violet-300 hover:text-violet-100 hover:bg-violet-500/20"
              >
                <span className="hidden sm:inline mr-2">Clear Chat</span>
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="flex-1 flex flex-col px-2 sm:px-4 md:px-8 md:pl-20 pb-2 sm:pb-4 md:pb-8">
          <div className="flex-1">
            <Card className="bg-violet-950/50 backdrop-blur-sm border-violet-500/20 shadow-xl h-full">
              <CardContent className="p-0">
                <div className="space-y-2 sm:space-y-4">
                  <ScrollArea 
                    className="h-[calc(100vh-200px)] sm:h-[calc(100vh-250px)] md:h-[600px] p-2 sm:p-4 md:p-6" 
                    ref={scrollAreaRef}
                  >
                    {messages.length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-full text-violet-200/80 p-4">
                        <Bot className="h-8 w-8 sm:h-12 sm:w-12 mb-2 sm:mb-4 text-violet-400" />
                        <p className="text-base sm:text-lg text-center">Start a conversation with your AI assistant</p>
                        <p className="text-xs sm:text-sm text-violet-300/60 mt-1 sm:mt-2 text-center">Ask anything and get instant responses</p>
                      </div>
                    ) : (
                      <div className="space-y-3 sm:space-y-6">
                        {messages.map((message, index) => (
                          <div
                            key={index}
                            className={`flex items-start gap-2 sm:gap-3 ${
                              message.role === 'assistant' ? 'flex-row' : 'flex-row-reverse'
                            }`}
                          >
                            <div className={`flex h-6 w-6 sm:h-8 sm:w-8 shrink-0 select-none items-center justify-center rounded-full border ${
                              message.role === 'assistant' 
                                ? 'bg-violet-500/20 border-violet-500/30 shadow-lg shadow-violet-500/10' 
                                : 'bg-blue-500/20 border-blue-500/30 shadow-lg shadow-blue-500/10'
                            }`}>
                              {message.role === 'assistant' ? (
                                <Bot className="h-3 w-3 sm:h-4 sm:w-4 text-violet-400" />
                              ) : (
                                <User className="h-3 w-3 sm:h-4 sm:w-4 text-blue-400" />
                              )}
                            </div>
                            <div className={`group relative max-w-[85%] sm:max-w-[80%] rounded-xl sm:rounded-2xl px-3 sm:px-4 py-2 sm:py-3 shadow-lg overflow-hidden text-white ${
                              message.role === 'assistant' 
                                ? 'bg-violet-500/10 border border-violet-500/20 ml-1 sm:ml-2' 
                                : 'bg-blue-500/10 border border-blue-500/20 mr-1 sm:mr-2'
                            }`}>
                              <div className="flex flex-col gap-1">
                                <div className="prose prose-invert max-w-none relative group text-sm sm:text-base [&>*]:text-white [&_p]:text-white [&_ul]:text-white [&_ol]:text-white [&_li]:text-white [&_code]:text-white [&_pre]:text-white [&_strong]:text-white [&_em]:text-white">
                                  <ReactMarkdown>
                                    {message.content}
                                  </ReactMarkdown>
                                  {message.role === 'assistant' && (
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => copyToClipboard(message.content)}
                                      className="absolute top-1 sm:top-2 right-1 sm:right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                      <ClipboardCopy className="h-3 w-3 sm:h-4 sm:w-4" />
                                    </Button>
                                  )}
                                </div>
                                <div className="flex items-center justify-end mt-0.5 sm:mt-1">
                                  <span className={`text-[10px] sm:text-xs ${
                                    message.role === 'assistant' 
                                      ? 'text-violet-200/70' 
                                      : 'text-blue-200/70'
                                  }`}>
                                    {message.timestamp.toLocaleTimeString([], { 
                                      hour: '2-digit', 
                                      minute: '2-digit' 
                                    })}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                        {isLoading && (
                          <div className="flex items-center gap-2 sm:gap-3">
                            <div className="flex h-6 w-6 sm:h-8 sm:w-8 shrink-0 items-center justify-center rounded-full border bg-violet-500/20 border-violet-500/30 shadow-lg shadow-violet-500/10">
                              <Bot className="h-3 w-3 sm:h-4 sm:w-4 text-violet-400" />
                            </div>
                            <div className="bg-violet-500/10 border border-violet-500/20 rounded-xl sm:rounded-2xl px-3 sm:px-4 py-2 sm:py-3 shadow-lg">
                              <div className="flex items-center gap-2 text-violet-200/80 text-sm sm:text-base">
                                <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 animate-spin" />
                                <span>Thinking...</span>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </ScrollArea>

                  <div className="p-2 sm:p-3 md:p-4 border-t border-violet-500/20">
                    <div className="flex gap-1 sm:gap-2 md:gap-4">
                      <Textarea
                        placeholder="Type your message..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault()
                            sendMessage()
                          }
                        }}
                        className="bg-violet-900/20 border-violet-500/20 h-[40px] sm:h-[50px] min-h-[40px] sm:min-h-[50px] py-1.5 sm:py-2 md:py-3 text-xs sm:text-sm md:text-base resize-none text-violet-50 placeholder:text-violet-300/50"
                      />
                      <Button
                        onClick={sendMessage}
                        disabled={isLoading || !input.trim()}
                        className="bg-violet-500 hover:bg-violet-600 px-2 sm:px-3 h-[40px] sm:h-[50px] rounded-xl transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-violet-500/20 disabled:opacity-50 disabled:hover:scale-100 disabled:hover:shadow-none"
                      >
                        <Send className="h-3 w-3 sm:h-4 sm:w-4" />
                      </Button>
                    </div>
                    <p className="text-[8px] sm:text-[10px] md:text-xs text-violet-200/70 mt-1 sm:mt-2">
                      Press Enter to send, Shift + Enter for new line
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
} 