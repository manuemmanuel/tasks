'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Shield, User, Mail, PenTool, Save, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import Sidebar from '@/components/Sidebar'
import { cn } from "@/lib/utils"

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
  created_at: string
  updated_at: string
}

export default function ProfilePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    bio: '',
    avatar_url: ''
  })

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser()
      
      if (authError) {
        console.error('Auth error:', authError)
        toast.error('Authentication error')
        router.push('/auth/login')
        return
      }

      if (!user) {
        console.log('No user found')
        router.push('/auth/login')
        return
      }

      console.log('Fetching profile for user:', user.id)

      const { data, error: profileError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single()

      if (profileError) {
        console.error('Profile fetch error:', profileError)
        throw profileError
      }

      if (data) {
        console.log('Profile found:', data)
        setProfile(data)
        setFormData({
          username: data.username,
          email: data.email,
          bio: data.bio || '',
          avatar_url: data.avatar_url || ''
        })
      } else {
        console.log('No profile found, creating new one')
        // Create new profile if it doesn't exist
        const { data: newProfile, error: createError } = await supabase
          .from('user_profiles')
          .insert([
            {
              user_id: user.id,
              username: user.user_metadata?.username || user.email?.split('@')[0] || 'User',
              email: user.email || '',
              bio: '',
              avatar_url: user.user_metadata?.avatar_url || null,
              level: 1,
              xp: 0,
              achievements: []
            }
          ])
          .select()
          .single()

        if (createError) {
          console.error('Profile creation error:', createError)
          throw createError
        }

        if (newProfile) {
          console.log('New profile created:', newProfile)
          setProfile(newProfile)
          setFormData({
            username: newProfile.username,
            email: newProfile.email,
            bio: newProfile.bio || '',
            avatar_url: newProfile.avatar_url || ''
          })
        }
      }
    } catch (error) {
      console.error('Error in fetchProfile:', error)
      toast.error('Failed to load profile. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!profile) return

    setSaving(true)
    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({
          username: formData.username,
          email: formData.email,
          bio: formData.bio,
          avatar_url: formData.avatar_url
        })
        .eq('id', profile.id)

      if (error) throw error

      toast.success('Profile updated successfully')
      fetchProfile() // Refresh profile data
    } catch (error) {
      console.error('Error updating profile:', error)
      toast.error('Failed to update profile')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-violet-400" />
      </div>
    )
  }

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1">
        <div className="min-h-screen bg-[#030014] text-white p-8 md:pl-20">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-violet-100 flex items-center gap-3">
                <div className="p-3 rounded-xl bg-violet-500/20">
                  <User className="h-8 w-8 text-violet-400" />
                </div>
                Profile
              </h1>
              <p className="text-violet-300/90 mt-2 text-lg">View and edit your profile</p>
            </div>

            {/* Profile Card */}
            <div className="bg-[#0E0529]/50 border border-violet-500/20 rounded-xl p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-violet-300/80">Username</label>
                  <div className="relative">
                    <PenTool className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-violet-400/60" />
                    <Input
                      type="text"
                      value={formData.username}
                      onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                      className="pl-10 bg-[#0E0529]/50 border-violet-500/20 text-violet-100 placeholder:text-violet-300/40"
                      placeholder="Enter your username"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-violet-300/80">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-violet-400/60" />
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="pl-10 bg-[#0E0529]/50 border-violet-500/20 text-violet-100 placeholder:text-violet-300/40"
                      placeholder="Enter your email"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-violet-300/80">Bio</label>
                  <Textarea
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    className="bg-[#0E0529]/50 border-violet-500/20 text-violet-100 placeholder:text-violet-300/40 min-h-[100px]"
                    placeholder="Tell us about yourself..."
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-violet-300/80">Avatar URL</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-violet-400/60" />
                    <Input
                      type="text"
                      value={formData.avatar_url}
                      onChange={(e) => setFormData({ ...formData, avatar_url: e.target.value })}
                      className="pl-10 bg-[#0E0529]/50 border-violet-500/20 text-violet-100 placeholder:text-violet-300/40"
                      placeholder="Enter avatar URL"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-4 pt-4">
                  <Button
                    type="submit"
                    disabled={saving}
                    className="bg-violet-500 hover:bg-violet-600 text-white"
                  >
                    {saving ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </div>

            {profile && (
              <div className="mt-8 bg-[#0E0529]/50 border border-violet-500/20 rounded-xl p-6">
                <h2 className="text-xl font-semibold text-violet-100 mb-4">Account Stats</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-[#0E0529]/30 border border-violet-500/20 rounded-lg p-4">
                    <div className="text-sm text-violet-300/60">Level</div>
                    <div className="text-2xl font-bold text-violet-100">{profile.level}</div>
                  </div>
                  <div className="bg-[#0E0529]/30 border border-violet-500/20 rounded-lg p-4">
                    <div className="text-sm text-violet-300/60">Experience</div>
                    <div className="text-2xl font-bold text-violet-100">{profile.xp} XP</div>
                  </div>
                  <div className="bg-[#0E0529]/30 border border-violet-500/20 rounded-lg p-4">
                    <div className="text-sm text-violet-300/60">Member Since</div>
                    <div className="text-2xl font-bold text-violet-100">
                      {new Date(profile.created_at).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="bg-[#0E0529]/30 border border-violet-500/20 rounded-lg p-4">
                    <div className="text-sm text-violet-300/60">Achievements</div>
                    <div className="text-2xl font-bold text-violet-100">{profile.achievements.length}</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 