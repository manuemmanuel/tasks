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
  session_id: string;
}

export default function AIAssistantPage() {
  const router = useRouter()
  const supabase = createClientComponentClient()
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const [sessions, setSessions] = useState<ChatSession[]>([])
  const [currentSessionId, setCurrentSessionId] = useState<string>("")
  const [isHistoryVisible, setIsHistoryVisible] = useState(true)
  const [currentUser, setCurrentUser] = useState<SupabaseUser | null>(null)

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session }, error } = await supabase.auth.getSession()
      // if (error || !session) {
      //   router.push('/login') // Redirect to login if no session
      // }
    }

    // Check initial session
    checkUser()

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      // if (event === 'SIGNED_OUT' || !session) {
      //   router.push('/login')
      // }
    })

    // Cleanup subscription
    return () => {
      subscription.unsubscribe()
    }
  }, [router, supabase])

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  // Load chat sessions when component mounts
  useEffect(() => {
    loadChatSessions()
  }, [])

  // Update createNewSession to be called when component mounts if no session exists
  useEffect(() => {
    const initializeChat = async () => {
      await loadChatSessions()
      // If no current session, create one
      if (!currentSessionId) {
        await createNewSession()
      }
    }
    initializeChat()
  }, [])

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setCurrentUser(user)
    }
    getUser()
  }, [])

  const loadChatSessions = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data, error } = await supabase
        .from('chat_sessions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error

      setSessions(data.map(session => ({
        ...session,
        created_at: new Date(session.created_at)
      })))
    } catch (error) {
      console.error('Error loading chat sessions:', error)
      toast.error("Failed to load chat sessions")
    }
  }

  const loadChatHistory = async (sessionId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data, error } = await supabase
        .from('chat_history')
        .select('*')
        .eq('user_id', user.id)
        .eq('session_id', sessionId)
        .order('timestamp', { ascending: true })

      if (error) throw error

      setMessages(data.map(msg => ({
        ...msg,
        timestamp: new Date(msg.timestamp)
      })))
      setCurrentSessionId(sessionId)
    } catch (error) {
      console.error('Error loading chat history:', error)
      toast.error("Failed to load chat history")
    }
  }

  const createNewSession = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const initialTitle = "New Chat"
      const { data, error } = await supabase
        .from('chat_sessions')
        .insert({
          user_id: user.id,
          title: initialTitle,
        })
        .select()
        .single()

      if (error) throw error

      const newSession = {
        ...data,
        created_at: new Date(data.created_at)
      }

      setSessions(prev => [newSession, ...prev])
      setCurrentSessionId(newSession.id)
      setMessages([])
    } catch (error) {
      console.error('Error creating new session:', error)
      toast.error("Failed to create new chat")
    }
  }

  const deleteSession = async (sessionId: string) => {
    try {
      const { error } = await supabase
        .from('chat_sessions')
        .delete()
        .eq('id', sessionId)

      if (error) throw error

      setSessions(prev => prev.filter(session => session.id !== sessionId))
      if (currentSessionId === sessionId) {
        setCurrentSessionId('')
        setMessages([])
      }
      toast.success("Chat deleted successfully")
    } catch (error) {
      console.error('Error deleting session:', error)
      toast.error("Failed to delete chat")
    }
  }

  const updateSessionTitle = async (sessionId: string, newTitle: string) => {
    try {
      const { error } = await supabase
        .from('chat_sessions')
        .update({ title: newTitle })
        .eq('id', sessionId)

      if (error) throw error

      setSessions(prev => prev.map(session =>
        session.id === sessionId ? { ...session, title: newTitle } : session
      ))
    } catch (error) {
      console.error('Error updating session title:', error)
      toast.error("Failed to update chat title")
    }
  }

  const generateTitleFromContext = async (sessionId: string) => {
    try {
      const { data, error } = await supabase
        .from('chat_history')
        .select('content')
        .eq('session_id', sessionId)
        .eq('role', 'user')
        .order('timestamp', { ascending: true })
        .limit(1)
        .single()

      if (error) throw error

      const firstMessage = data.content
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: "Generate a brief, descriptive title (max 40 chars) for a conversation that starts with: " + firstMessage,
          context: []
        })
      })

      if (!response.ok) throw new Error('Failed to generate title')

      const { message: title } = await response.json()
      await updateSessionTitle(sessionId, title)
    } catch (error) {
      console.error('Error generating title:', error)
      toast.error("Failed to generate chat title")
    }
  }

  const saveChatMessage = async (message: Message) => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        toast.error("Please sign in to save chat history")
        return
      }

      if (!currentSessionId) {
        toast.error("No active chat session")
        return
      }

      const { data, error } = await supabase
        .from('chat_history')
        .insert({
          user_id: user.id,
          session_id: currentSessionId,
          role: message.role,
          content: message.content,
          timestamp: message.timestamp.toISOString()
        })
        .select()
        .single()

      if (error) {
        console.error('Error saving message:', error)
        throw error
      }

      // Generate title after first user message in a session
      if (message.role === 'user') {
        const { count } = await supabase
          .from('chat_history')
          .select('*', { count: 'exact' })
          .eq('session_id', currentSessionId)

        if (count === 1) { // First message in the session
          await generateTitleFromContext(currentSessionId)
        }
      }

      return data
    } catch (error) {
      console.error('Error saving message:', error)
      toast.error("Failed to save message")
      throw error
    }
  }

  const sendMessage = async () => {
    if (!input.trim()) return
    if (!currentSessionId) {
      await createNewSession() // Ensure we have a session
    }
    
    const userMessage = input.trim()
    setInput("")
    const newUserMessage = { 
      role: 'user' as const, 
      content: userMessage,
      timestamp: new Date(),
      session_id: currentSessionId
    }

    try {
      // Save user message first
      const savedMessage = await saveChatMessage(newUserMessage)
      if (!savedMessage) {
        throw new Error('Failed to save message')
      }
      
      setMessages(prev => [...prev, newUserMessage])
      setIsLoading(true)

      // Get context from current session
      const { data: contextData, error: contextError } = await supabase
        .from('chat_history')
        .select('role, content')
        .eq('session_id', currentSessionId)
        .order('timestamp', { ascending: false })
        .limit(5)
      
      if (contextError) {
        throw new Error('Failed to fetch context: ' + contextError.message)
      }

      const contextMessages = contextData
        ? [...contextData].reverse().map(msg => ({
            role: msg.role as 'user' | 'assistant',
            content: msg.content
          }))
        : []

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage,
          context: contextMessages
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
        timestamp: new Date(),
        session_id: currentSessionId
      }

      // Save assistant message
      const savedAssistantMessage = await saveChatMessage(newAssistantMessage)
      if (!savedAssistantMessage) {
        throw new Error('Failed to save assistant message')
      }

      setMessages(prev => [...prev, newAssistantMessage])
    } catch (error) {
      console.error('Error in sendMessage:', error instanceof Error ? error.message : 'Unknown error')
      toast.error(error instanceof Error ? error.message : "Failed to send message")
    } finally {
      setIsLoading(false)
    }
  }

  const clearChat = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { error } = await supabase
        .from('chat_history')
        .delete()
        .eq('user_id', user.id)

      if (error) throw error

      setMessages([])
      toast.success("Chat history cleared")
    } catch (error) {
      console.error('Error clearing chat history:', error)
      toast.error("Failed to clear chat history")
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success("Copied to clipboard")
  }

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 flex flex-col min-h-screen bg-[#030014] overflow-x-hidden">
        <div className="p-4 md:p-8 md:pl-20">
          <Toaster richColors position="top-center" />

          <div className="mb-4 md:mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => router.push('/')}
                className="text-violet-300 hover:text-violet-100 hover:bg-violet-500/20"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-violet-50 flex items-center gap-2">
                  <Bot className="h-6 w-6 md:h-8 md:w-8 text-violet-400" />
                  AI Assistant
                </h1>
                <p className="text-sm md:text-base text-violet-200/90 mt-2">
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
                onClick={createNewSession}
                className="text-violet-300 hover:text-violet-100 hover:bg-violet-500/20"
              >
                <span className="hidden md:inline mr-2">New Chat</span>
                <Bot className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={clearChat}
                className="text-violet-300 hover:text-violet-100 hover:bg-violet-500/20"
                title="Clear chat"
              >
                <RefreshCw className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>

        <div className="flex-1 flex flex-col md:flex-row px-4 md:px-8 md:pl-20 pb-4 md:pb-8 gap-4">
          <div className="flex-1">
            <Card className="bg-violet-950/50 backdrop-blur-sm border-violet-500/20 shadow-xl h-full">
              <CardContent className="p-0">
                <div className="space-y-4">
                  <ScrollArea 
                    className="h-[calc(100vh-300px)] md:h-[600px] p-4 md:p-6" 
                    ref={scrollAreaRef}
                  >
                    {messages.length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-full text-violet-200/80">
                        <Bot className="h-12 w-12 mb-4 text-violet-400" />
                        <p className="text-lg">Start a conversation with your AI assistant</p>
                        <p className="text-sm text-violet-300/60 mt-2">Ask anything and get instant responses</p>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        {messages.map((message, index) => (
                          <div
                            key={index}
                            className={`flex items-start gap-3 ${
                              message.role === 'assistant' ? 'flex-row' : 'flex-row-reverse'
                            }`}
                          >
                            <div className={`flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-full border ${
                              message.role === 'assistant' 
                                ? 'bg-violet-500/20 border-violet-500/30 shadow-lg shadow-violet-500/10' 
                                : 'bg-blue-500/20 border-blue-500/30 shadow-lg shadow-blue-500/10'
                            }`}>
                              {message.role === 'assistant' ? (
                                <Bot className="h-4 w-4 text-violet-400" />
                              ) : (
                                <User className="h-4 w-4 text-blue-400" />
                              )}
                            </div>
                            <div className={`group relative max-w-[80%] rounded-2xl px-4 py-3 shadow-lg overflow-hidden text-white ${
                              message.role === 'assistant' 
                                ? 'bg-violet-500/10 border border-violet-500/20 ml-2' 
                                : 'bg-blue-500/10 border border-blue-500/20 mr-2'
                            }`}>
                              <div className="flex flex-col gap-1">
                                <div className="prose prose-invert max-w-none relative group [&>*]:text-white [&_p]:text-white [&_ul]:text-white [&_ol]:text-white [&_li]:text-white [&_code]:text-white [&_pre]:text-white [&_strong]:text-white [&_em]:text-white">
                                  <ReactMarkdown>
                                    {message.content}
                                  </ReactMarkdown>
                                  {message.role === 'assistant' && (
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => copyToClipboard(message.content)}
                                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                      <ClipboardCopy className="h-4 w-4" />
                                    </Button>
                                  )}
                                </div>
                                <div className="flex items-center justify-end mt-1">
                                  <span className={`text-xs ${
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
                          <div className="flex items-center gap-3">
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border bg-violet-500/20 border-violet-500/30 shadow-lg shadow-violet-500/10">
                              <Bot className="h-4 w-4 text-violet-400" />
                            </div>
                            <div className="bg-violet-500/10 border border-violet-500/20 rounded-2xl px-4 py-3 shadow-lg">
                              <div className="flex items-center gap-2 text-violet-200/80">
                                <Loader2 className="h-4 w-4 animate-spin" />
                                <span>Thinking...</span>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </ScrollArea>

                  <div className="p-3 md:p-4 border-t border-violet-500/20">
                    <div className="flex gap-2 md:gap-4">
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
                        className="bg-violet-900/20 border-violet-500/20 h-[50px] min-h-[50px] py-2 md:py-3 text-sm md:text-base resize-none text-violet-50 placeholder:text-violet-300/50"
                      />
                      <Button
                        onClick={sendMessage}
                        disabled={isLoading || !input.trim()}
                        className="bg-violet-500 hover:bg-violet-600 px-3 md:px-6 h-[50px]"
                      >
                        <Send className="h-4 w-4 md:mr-2" />
                        <span className="hidden md:inline">Send</span>
                      </Button>
                    </div>
                    <p className="text-[10px] md:text-xs text-violet-200/70 mt-2">
                      Press Enter to send, Shift + Enter for new line
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {isHistoryVisible ? (
            <div className="w-full md:w-80 mt-4 md:mt-0">
              <Card className="bg-violet-950/50 backdrop-blur-sm border-violet-500/20 shadow-xl h-full">
                <CardContent className="p-0">
                  <div className="space-y-4">
                    <div className="p-4 md:p-6 border-b border-violet-500/20 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Bot className="h-5 w-5 md:h-6 md:w-6 text-violet-400" />
                        <h2 className="text-lg md:text-xl font-bold text-violet-50">Chat History</h2>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setIsHistoryVisible(false)}
                        className="text-violet-300 hover:text-violet-100 hover:bg-violet-500/20"
                      >
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </div>

                    <ScrollArea className="h-[300px] md:h-[600px] p-4 md:p-6">
                      <div className="space-y-3">
                        {sessions.length === 0 ? (
                          <div className="flex flex-col items-center justify-center h-full text-violet-200/80">
                            <FolderOpen className="h-12 w-12 mb-4 text-violet-400" />
                            <p className="text-lg">No chat history yet</p>
                            <p className="text-sm text-violet-300/60 mt-2">Start a new conversation</p>
                          </div>
                        ) : (
                          sessions.map(session => (
                            <div key={session.id} className="flex items-center justify-between">
                              <button
                                onClick={() => loadChatHistory(session.id)}
                                className={`flex-1 text-left rounded-2xl px-4 py-3 transition-all duration-200 ${
                                  currentSessionId === session.id
                                    ? 'bg-violet-500/10 border-violet-500/20'
                                    : 'hover:bg-violet-500/5'
                                }`}
                              >
                                <div className="flex items-center gap-3">
                                  <MessageSquare className="h-4 w-4 text-violet-400" />
                                  <span className="text-sm text-violet-100">{session.title}</span>
                                </div>
                              </button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => deleteSession(session.id)}
                                className="text-violet-300 hover:text-violet-100 hover:bg-violet-500/20"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          ))
                        )}
                      </div>
                    </ScrollArea>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsHistoryVisible(true)}
              className="fixed bottom-4 right-4 md:static h-10 w-10 text-violet-300 hover:text-violet-100 hover:bg-violet-500/20 shadow-lg"
              title="Show history"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  )
} 