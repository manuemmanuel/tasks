"use client"

import { useState, useRef, useEffect } from "react"
import { Send, Image as ImageIcon, Trophy, Heart, MessageSquare, Share2, MoreVertical, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Toaster, toast } from "sonner"
import Sidebar from "@/components/Sidebar"
import { useRouter } from "next/navigation"
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { User as SupabaseUser } from '@supabase/supabase-js'
import Image from 'next/image'

interface Post {
  id: string;
  user_id: string;
  content: string;
  image_url?: string;
  type: string;
  created_at: Date;
  likes: number;
  comments: number;
  user: {
    email: string;
    avatar_url?: string;
  };
}

interface Achievement {
  id: string;
  user_id: string;
  title: string;
  description: string;
  icon: string;
  created_at: Date;
  user: {
    email: string;
    avatar_url?: string;
  };
}

export default function SocialPage() {
  const router = useRouter()
  const supabase = createClientComponentClient()
  const [posts, setPosts] = useState<Post[]>([])
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingUser, setIsLoadingUser] = useState(true)
  const [currentUser, setCurrentUser] = useState<SupabaseUser | null>(null)
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (currentUser) {
      setIsLoadingUser(false)
    }
  }, [currentUser])

  useEffect(() => {
    const getUser = async () => {
      const { data: { session }, error } = await supabase.auth.getSession()
      
      if (error) {
        console.error('Error getting session:', error)
        router.push('/login')
        return
      }

      if (!session) {
        console.log('No session found, redirecting to login')
        router.push('/login')
        return
      }

      setCurrentUser(session.user)

      // Fetch initial posts
      const { data: postsData, error: postsError } = await supabase
        .from('posts')
        .select('*, user:user_id(*)')
        .order('created_at', { ascending: false })
        .limit(20)

      if (postsError) {
        console.error('Error fetching posts:', postsError)
        return
      }

      setPosts(postsData || [])

      // Fetch initial achievements
      const { data: achievementsData, error: achievementsError } = await supabase
        .from('achievements')
        .select('*, user:user_id(*)')
        .order('created_at', { ascending: false })
        .limit(20)

      if (achievementsError) {
        console.error('Error fetching achievements:', achievementsError)
        return
      }

      setAchievements(achievementsData || [])

      // Subscribe to auth state changes
      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        if (!session) {
          console.log('Auth state changed: no session, redirecting to login')
          router.push('/login')
          return
        }
        setCurrentUser(session.user)
      })

      // Subscribe to new posts
      const postsSubscription = supabase
        .channel('posts')
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'posts' }, payload => {
          setPosts(prev => [payload.new as Post, ...prev])
        })
        .subscribe()

      // Subscribe to new achievements
      const achievementsSubscription = supabase
        .channel('achievements')
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'achievements' }, payload => {
          setAchievements(prev => [payload.new as Achievement, ...prev])
        })
        .subscribe()

      return () => {
        subscription.unsubscribe()
        postsSubscription.unsubscribe()
        achievementsSubscription.unsubscribe()
      }
    }

    getUser()
  }, [supabase, router])

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [posts, achievements])

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedImage(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const createPost = async () => {
    if (!input.trim() && !selectedImage) return

    try {
      setIsLoading(true)

      // Check if user is authenticated
      if (!currentUser?.id) {
        throw new Error('User not authenticated')
      }

      let imageUrl = null

      if (selectedImage) {
        const fileExt = selectedImage.name.split('.').pop()
        const fileName = `${Math.random()}.${fileExt}`
        const filePath = `${currentUser.id}/${fileName}`

        const { error: uploadError } = await supabase.storage
          .from('post-images')
          .upload(filePath, selectedImage)

        if (uploadError) {
          console.error('Error uploading image:', uploadError)
          throw new Error('Failed to upload image: ' + uploadError.message)
        }

        const { data: { publicUrl } } = supabase.storage
          .from('post-images')
          .getPublicUrl(filePath)
        imageUrl = publicUrl
      }

      // Add the required 'type' field
      const { data, error: insertError } = await supabase
        .from('posts')
        .insert({
          user_id: currentUser.id,
          content: input.trim(),
          image_url: imageUrl,
          type: imageUrl ? 'image' : 'text' // Set type based on whether there's an image
        })
        .select()
        .single()

      if (insertError) {
        console.error('Error inserting post:', insertError)
        throw new Error('Failed to create post: ' + insertError.message)
      }

      if (!data) {
        throw new Error('No data returned from post creation')
      }

      // Add the user data to the post
      const newPost = {
        ...data,
        user: {
          id: currentUser.id,
          email: currentUser.email
        }
      }

      // Update the posts state with the new post
      setPosts(prev => [newPost, ...prev])

      setInput("")
      setSelectedImage(null)
      setImagePreview(null)
      toast.success("Post created successfully!")
    } catch (error) {
      console.error('Error in createPost:', error)
      toast.error(error instanceof Error ? error.message : "Failed to create post")
    } finally {
      setIsLoading(false)
    }
  }

  const createAchievement = async () => {
    if (!input.trim()) return

    try {
      setIsLoading(true)
      const { error } = await supabase
        .from('achievements')
        .insert([
          {
            user_id: currentUser?.id,
            title: "New Achievement",
            description: input.trim(),
            icon: "🏆"
          }
        ])

      if (error) throw error

      setInput("")
      toast.success("Achievement shared!")
    } catch (error) {
      console.error('Error creating achievement:', error)
      toast.error("Failed to share achievement")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col min-h-screen bg-[#030014] overflow-x-hidden">
        <div className="p-2 sm:p-4 md:p-8 md:pl-20">
          <Toaster richColors position="top-center" />

          <div className="mb-2 sm:mb-4 md:mb-8">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-violet-50">
              Social Feed
            </h1>
            <p className="text-xs sm:text-sm md:text-base text-violet-200/90 mt-1 sm:mt-2">
              Share your thoughts, achievements, and moments with the community
            </p>
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
                    <div className="space-y-4">
                      {isLoadingUser ? (
                        <div className="flex items-center justify-center h-32">
                          <Loader2 className="h-8 w-8 animate-spin text-violet-400" />
                        </div>
                      ) : (
                        <>
                          {/* Create Post */}
                          <Card className="bg-violet-900/20 border-violet-500/20">
                            <CardContent className="p-4">
                              <div className="flex gap-2">
                                <div className="flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-full border bg-violet-500/20 border-violet-500/30">
                                  <span className="text-sm text-violet-400">
                                    {currentUser?.email?.[0].toUpperCase()}
                                  </span>
                                </div>
                                <div className="flex-1">
                                  <Textarea
                                    placeholder="What's on your mind?"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    className="bg-violet-900/20 border-violet-500/20 min-h-[80px] resize-none text-violet-50 placeholder:text-violet-300/50"
                                  />
                                  {imagePreview && (
                                    <div className="relative mt-2 h-48 w-full">
                                      <Image
                                        src={imagePreview}
                                        alt="Preview"
                                        fill
                                        className="object-cover rounded-lg"
                                      />
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className="absolute top-2 right-2 bg-violet-900/80 hover:bg-violet-800/80"
                                        onClick={() => {
                                          setSelectedImage(null)
                                          setImagePreview(null)
                                        }}
                                      >
                                        <span className="text-violet-200">×</span>
                                      </Button>
                                    </div>
                                  )}
                                </div>
                              </div>
                              <div className="flex items-center justify-between mt-4">
                                <div className="flex gap-2">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-violet-300 hover:text-violet-100 hover:bg-violet-500/20"
                                    onClick={() => document.getElementById('image-upload')?.click()}
                                  >
                                    <ImageIcon className="h-4 w-4 mr-2" />
                                    Image
                                  </Button>
                                  <input
                                    id="image-upload"
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleImageSelect}
                                  />
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-violet-300 hover:text-violet-100 hover:bg-violet-500/20"
                                    onClick={createAchievement}
                                    disabled={isLoading || !input.trim()}
                                  >
                                    <Trophy className="h-4 w-4 mr-2" />
                                    Achievement
                                  </Button>
                                </div>
                                <Button
                                  onClick={createPost}
                                  disabled={isLoading || (!input.trim() && !selectedImage)}
                                  className="bg-violet-500 hover:bg-violet-600"
                                >
                                  {isLoading ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                  ) : (
                                    <Send className="h-4 w-4" />
                                  )}
                                </Button>
                              </div>
                            </CardContent>
                          </Card>

                          {/* Posts and Achievements */}
                          {[...posts, ...achievements].sort((a, b) => 
                            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
                          ).map((item) => (
                            <Card key={item.id} className="bg-violet-900/20 border-violet-500/20">
                              <CardContent className="p-4">
                                <div className="flex items-start gap-3">
                                  <div className="flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-full border bg-violet-500/20 border-violet-500/30">
                                    <span className="text-sm text-violet-400">
                                      {item.user.email[0].toUpperCase()}
                                    </span>
                                  </div>
                                  <div className="flex-1">
                                    <div className="flex items-center justify-between">
                                      <span className="text-sm font-medium text-violet-200">
                                        {item.user.email}
                                      </span>
                                      <span className="text-xs text-violet-300/70">
                                        {new Date(item.created_at).toLocaleString()}
                                      </span>
                                    </div>
                                    {'image_url' in item && item.image_url && (
                                      <div className="relative mt-2 h-64 w-full">
                                        <Image
                                          src={item.image_url}
                                          alt="Post image"
                                          fill
                                          className="object-cover rounded-lg"
                                        />
                                      </div>
                                    )}
                                    <p className="mt-2 text-sm text-violet-100">
                                      {'content' in item ? item.content : item.description}
                                    </p>
                                    <div className="flex items-center gap-4 mt-4">
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        className="text-violet-300 hover:text-violet-100 hover:bg-violet-500/20"
                                      >
                                        <Heart className="h-4 w-4 mr-2" />
                                        {('likes' in item) ? item.likes : 0}
                                      </Button>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        className="text-violet-300 hover:text-violet-100 hover:bg-violet-500/20"
                                      >
                                        <MessageSquare className="h-4 w-4 mr-2" />
                                        {('comments' in item) ? item.comments : 0}
                                      </Button>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        className="text-violet-300 hover:text-violet-100 hover:bg-violet-500/20"
                                      >
                                        <Share2 className="h-4 w-4 mr-2" />
                                        Share
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </>
                      )}
                    </div>
                  </ScrollArea>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
} 