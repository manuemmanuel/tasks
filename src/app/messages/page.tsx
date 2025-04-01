'use client'

import { useState, useEffect } from 'react'
import { RealtimeChannel } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Sidebar from '@/components/Sidebar'
import Image from 'next/image'

interface UserProfile {
  id: string
  user_id: string
  username: string
  email: string
  bio: string | null
  avatar_url: string | null
  level: number
  xp: number
  achievements: string[]
}

interface Message {
  id: string
  sender_id: string
  receiver_id: string
  content: string
  created_at: string
}

export default function MessagesPage() {
  const [users, setUsers] = useState<UserProfile[]>([])
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null)
  const [channel, setChannel] = useState<RealtimeChannel | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const setupUsers = async () => {
      try {
        setLoading(true)
        
        // Get current user
        const { data: { user: authUser }, error: authError } = await supabase.auth.getUser()
        
        if (authError) throw authError
        if (!authUser) throw new Error('No authenticated user found')
        console.log('Current auth user:', authUser)

        // Get or create user profile
        let { data: profile, error: profileError } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('user_id', authUser.id)
          .single()

        console.log('Initial profile fetch:', profile, profileError) // Debug log

        if (!profile) {
          console.log('Creating new profile for:', authUser.id)
          // Create new profile if doesn't exist
          const { data: newProfile, error: createError } = await supabase
            .from('user_profiles')
            .insert([{
              user_id: authUser.id,
              username: authUser.email?.split('@')[0] || 'user',
              email: authUser.email || '',
              bio: 'Hey there! I\'m new here.',
              level: 1,
              xp: 0,
              achievements: []
            }])
            .select()
            .single()

          if (createError) {
            console.error('Profile creation error:', createError) // Debug log
            throw createError
          }
          profile = newProfile
          console.log('New profile created:', profile) // Debug log
        }

        setCurrentUser(profile)

        // Fetch all other user profiles
        const { data: profiles, error: profilesError } = await supabase
          .from('user_profiles')
          .select('*')
          .neq('user_id', authUser.id)
          .order('username')

        console.log('Other profiles fetch:', profiles, profilesError) // Debug log

        if (profilesError) throw profilesError

        if (profiles && profiles.length > 0) {
          // Filter out duplicate users based on user_id
          const uniqueUsers = profiles.filter((user, index, self) =>
            index === self.findIndex((u) => u.user_id === user.user_id)
          )
          setUsers(uniqueUsers)
        } else {
          console.log('No other users found')
        }

      } catch (error) {
        console.error('Error setting up users:', error)
        setError(error instanceof Error ? error.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    setupUsers()
  }, [])

  // Set up realtime messaging
  useEffect(() => {
    if (!currentUser?.user_id || !selectedUser?.user_id) return

    // Clean up previous subscription
    if (channel) channel.unsubscribe()

    // Create new realtime channel subscription
    const roomId = [currentUser.user_id, selectedUser.user_id].sort().join(':')
    const newChannel = supabase.channel(`room:${roomId}`, {
      config: { broadcast: { self: true } }
    })

    newChannel
      .on('broadcast', { event: 'message' }, ({ payload }) => {
        setMessages(prev => [...prev, payload as Message])
      })
      .subscribe()

    setChannel(newChannel)

    // Load existing messages
    const loadMessages = async () => {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .or(`sender_id.eq.${currentUser.user_id},receiver_id.eq.${currentUser.user_id}`)
        .order('created_at', { ascending: true })
      
      if (error) console.error('Error loading messages:', error)
      else {
        // Filter messages to only include conversations between current user and selected user
        const filteredMessages = data?.filter(msg => 
          (msg.sender_id === currentUser.user_id && msg.receiver_id === selectedUser.user_id) ||
          (msg.sender_id === selectedUser.user_id && msg.receiver_id === currentUser.user_id)
        ) || []
        setMessages(filteredMessages)
      }
    }

    loadMessages()

    return () => {
      newChannel.unsubscribe()
    }
  }, [currentUser?.user_id, selectedUser?.user_id])

  useEffect(() => {
    console.log('Current users state:', users)
  }, [users])

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      console.log('Current session:', session)
    }
    checkSession()
  }, [])

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedUser || !newMessage.trim() || !currentUser || !channel) return

    const newMsg: Message = {
      id: crypto.randomUUID(),
      content: newMessage,
      sender_id: currentUser.user_id,
      receiver_id: selectedUser.user_id,
      created_at: new Date().toISOString()
    }

    try {
      console.log('Attempting to send message:', newMsg)
      const { data, error } = await supabase
        .from('messages')
        .insert([newMsg])
        .select()
        .single()

      if (error) {
        console.error('Supabase error:', error)
        throw error
      }

      console.log('Message sent successfully:', data)

      channel.send({
        type: 'broadcast',
        event: 'message',
        payload: newMsg
      })
      
      setNewMessage('')
    } catch (error) {
      console.error('Error sending message:', error)
      setError(error instanceof Error ? error.message : 'Failed to send message')
    }
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 flex md:ml-16 transition-all duration-300">
        <div className="flex flex-col md:flex-row w-full bg-[#030014]">
          {/* Users sidebar */}
          <div className={`w-full md:w-72 md:min-w-72 border-b md:border-b-0 md:border-r border-violet-500/20 p-4 ${
            selectedUser ? 'hidden md:block' : 'block'
          }`}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-violet-100">Users</h2>
              {selectedUser && (
                <button 
                  onClick={() => setSelectedUser(null)}
                  className="md:hidden text-violet-300 hover:text-violet-100"
                >
                  Back
                </button>
              )}
            </div>
            <div className="space-y-2">
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
                    className={`w-full p-3 text-left rounded-lg flex items-center gap-3 transition-all ${
                      selectedUser?.id === user.id 
                        ? 'bg-violet-600/50' 
                        : 'hover:bg-violet-500/20'
                    }`}
                  >
                    <div className="relative w-10 h-10 rounded-full overflow-hidden bg-violet-500/20">
                      {user.avatar_url ? (
                        <Image
                          src={user.avatar_url}
                          alt={user.username}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-violet-300">
                          {user.username[0].toUpperCase()}
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="text-violet-100 font-medium">
                        {user.username}
                      </div>
                      <div className="text-violet-300 text-sm">
                        Level {user.level}
                      </div>
                    </div>
                  </button>
                ))
              ) : (
                <div className="text-violet-300">No users found</div>
              )}
            </div>
          </div>

          {/* Chat area */}
          <div className={`flex-1 flex flex-col h-[calc(100vh-4rem)] md:h-screen ${
            selectedUser ? 'block' : 'hidden md:block'
          }`}>
            {selectedUser ? (
              <>
                <div className="p-4 border-b border-violet-500/20">
                  <div className="flex items-center gap-3">
                    <div className="relative w-10 h-10 rounded-full overflow-hidden bg-violet-500/20">
                      {selectedUser.avatar_url ? (
                        <Image
                          src={selectedUser.avatar_url}
                          alt={selectedUser.username}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-violet-300">
                          {selectedUser.username[0].toUpperCase()}
                        </div>
                      )}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-violet-100">
                        {selectedUser.username}
                      </h3>
                      <p className="text-sm text-violet-300">
                        Level {selectedUser.level} • {selectedUser.achievements.length} achievements
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.map((message, index) => (
                    <div
                      key={message.id}
                      className={`flex ${
                        message.sender_id === currentUser?.user_id ? 'justify-end' : 'justify-start'
                      } animate-fade-in`}
                      style={{
                        animationDelay: `${index * 100}ms`,
                        animationFillMode: 'both'
                      }}
                    >
                      <div
                        className={`relative max-w-[80%] p-3 rounded-2xl ${
                          message.sender_id === currentUser?.user_id
                            ? 'bg-violet-600 text-white rounded-br-none'
                            : 'bg-violet-500/20 text-violet-100 rounded-bl-none'
                        } shadow-lg backdrop-blur-sm`}
                      >
                        <div className="text-sm">{message.content}</div>
                        <div className={`text-xs mt-1 opacity-70 ${
                          message.sender_id === currentUser?.user_id ? 'text-violet-100' : 'text-violet-300'
                        }`}>
                          {new Date(message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <style jsx global>{`
                  @keyframes fade-in {
                    from {
                      opacity: 0;
                      transform: translateY(10px);
                    }
                    to {
                      opacity: 1;
                      transform: translateY(0);
                    }
                  }
                  .animate-fade-in {
                    animation: fade-in 0.3s ease-out forwards;
                  }
                `}</style>

                <form onSubmit={sendMessage} className="p-4 border-t border-violet-500/20">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      className="flex-1 bg-violet-950/50 border border-violet-500/30 rounded-lg px-4 py-2 text-violet-100"
                      placeholder="Type a message..."
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white rounded-lg transition-colors"
                    >
                      Send
                    </button>
                  </div>
                </form>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-violet-300">
                Select a user to start messaging
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
} 