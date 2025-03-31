'use client'

import { useState, useEffect } from 'react'
import { RealtimeChannel } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Sidebar from '@/components/Sidebar'

interface User {
  id: string
  email: string | undefined
}

interface Message {
  id: string
  sender_id: string
  receiver_id: string
  content: string
  created_at: string
}

export default function MessagesPage() {
  const [users, setUsers] = useState<User[]>([])
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [channel, setChannel] = useState<RealtimeChannel | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const setupUsers = async () => {
      try {
        setLoading(true)
        
        // Get current user with better error handling
        const { data: { user: currentAuthUser }, error: authError } = await supabase.auth.getUser()
        
        if (authError) {
          console.error('Auth error:', authError)
          return
        }

        if (!currentAuthUser) {
          console.error('No authenticated user found')
          return
        }

        setCurrentUser({
          id: currentAuthUser.id,
          email: currentAuthUser.email
        })

        // Create or update profile for current user
        const { error: upsertError } = await supabase
          .from('profiles')
          .upsert({ 
            id: currentAuthUser.id, 
            email: currentAuthUser.email 
          }, { 
            onConflict: 'id'
          })

        if (upsertError) {
          console.error('Profile upsert error:', upsertError)
          return
        }

        // Fetch all profiles except current user
        const { data: profiles, error: profilesError } = await supabase
          .from('profiles')
          .select('id, email')
          .neq('id', currentAuthUser.id)

        if (profilesError) {
          console.error('Profiles fetch error:', profilesError)
          return
        }

        if (profiles) {
          setUsers(profiles)
        } else {
          console.log('No profiles found')
        }

      } catch (error) {
        // Improved error logging
        console.error('Error details:', {
          message: error instanceof Error ? error.message : 'Unknown error',
          name: error instanceof Error ? error.name : 'Unknown',
          stack: error instanceof Error ? error.stack : undefined,
          error
        })
      } finally {
        setLoading(false)
      }
    }

    setupUsers()

    if (!currentUser?.id || !selectedUser?.id) return

    // Clean up previous subscription
    if (channel) {
      channel.unsubscribe()
    }

    // Create new realtime channel subscription
    const newChannel = supabase.channel(`room:${currentUser.id}:${selectedUser.id}`, {
      config: {
        broadcast: { self: true }
      }
    })

    newChannel
      .on('broadcast', { event: 'message' }, ({ payload }) => {
        setMessages(prev => [...prev, payload as Message])
      })
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log('Connected to realtime channel')
        }
      })

    setChannel(newChannel)

    // Cleanup on unmount or when users change
    return () => {
      newChannel.unsubscribe()
    }
  }, [currentUser?.id, selectedUser?.id])

  // Fetch messages when selecting a user
  useEffect(() => {
    if (selectedUser && currentUser) {
      const fetchMessages = async () => {
        const { data, error } = await supabase
          .from('messages')
          .select('*')
          .or(`and(sender_id.eq.${currentUser.id},receiver_id.eq.${selectedUser.id}),and(sender_id.eq.${selectedUser.id},receiver_id.eq.${currentUser.id})`)
          .order('created_at', { ascending: true })
        
        if (data && !error) {
          setMessages(data)
        }
      }
      fetchMessages()
    }
  }, [selectedUser, currentUser])

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedUser || !newMessage.trim() || !currentUser || !channel) return

    const newMsg: Message = {
      id: crypto.randomUUID(),
      content: newMessage,
      sender_id: currentUser.id,
      receiver_id: selectedUser.id,
      created_at: new Date().toISOString()
    }

    // Send message to database
    const { error } = await supabase
      .from('messages')
      .insert(newMsg)

    if (!error) {
      // Broadcast message through realtime channel
      channel.send({
        type: 'broadcast',
        event: 'message',
        payload: newMsg
      })
      
      setNewMessage('')
    }
  }

  const clearChatHistory = async () => {
    if (!currentUser?.id || !selectedUser?.id) return
    
    const { error } = await supabase
      .from('messages')
      .delete()
      .or(`and(sender_id.eq.${currentUser.id},receiver_id.eq.${selectedUser.id}),and(sender_id.eq.${selectedUser.id},receiver_id.eq.${currentUser.id})`)

    if (!error) {
      setMessages([])
    }
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 flex md:ml-16 transition-all duration-300">
        <div className="flex flex-col md:flex-row w-full bg-[#030014]">
          {/* Users sidebar - Now responsive */}
          <div className="w-full md:w-64 md:min-w-64 border-b md:border-b-0 md:border-r border-violet-500/20 p-4">
            <h2 className="text-xl font-bold text-violet-100 mb-4">Users</h2>
            <div className="space-y-2 max-h-[200px] md:max-h-none overflow-y-auto">
              {error && (
                <div className="text-red-400 mb-4 p-2 bg-red-900/20 rounded">
                  {error}
                </div>
              )}
              {loading ? (
                <div className="text-violet-300">Loading users...</div>
              ) : users.length > 0 ? (
                users.map(user => (
                  <button
                    key={user.id}
                    onClick={() => setSelectedUser(user)}
                    className={`w-full p-3 text-left rounded-lg ${
                      selectedUser?.id === user.id 
                        ? 'bg-violet-600/50' 
                        : 'hover:bg-violet-500/20'
                    } text-violet-100`}
                  >
                    {user.email}
                  </button>
                ))
              ) : (
                <div className="text-violet-300">No users found</div>
              )}
            </div>
          </div>

          {/* Chat area - Now responsive */}
          <div className="flex-1 flex flex-col h-[calc(100vh-16rem)] md:h-screen">
            {selectedUser ? (
              <>
                <div className="p-4 border-b border-violet-500/20 flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-violet-100">
                    {selectedUser.email}
                  </h3>
                  <button
                    onClick={clearChatHistory}
                    className="px-3 py-1 text-sm bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg border border-red-500/20"
                  >
                    Clear Chat
                  </button>
                </div>
                
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.map(message => (
                    <div
                      key={message.id}
                      className={`max-w-[90%] md:max-w-[70%] p-3 rounded-lg ${
                        message.sender_id === currentUser?.id
                          ? 'ml-auto bg-violet-600 text-white'
                          : 'bg-violet-500/20 text-violet-100'
                      }`}
                    >
                      {message.content}
                    </div>
                  ))}
                </div>

                <form onSubmit={sendMessage} className="p-2 md:p-4 border-t border-violet-500/20">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      className="flex-1 bg-violet-950/50 border border-violet-500/30 rounded-lg px-3 md:px-4 py-2 text-violet-100 text-sm md:text-base"
                      placeholder="Type a message..."
                    />
                    <button
                      type="submit"
                      className="px-3 md:px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white rounded-lg text-sm md:text-base"
                    >
                      Send
                    </button>
                  </div>
                </form>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-violet-300 p-4 text-center">
                Select a user to start messaging
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
} 