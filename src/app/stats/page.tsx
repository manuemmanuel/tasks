'use client'

import { useState, useEffect } from 'react'
import { Brain, Dumbbell, Zap, Heart, Shield, Footprints, Target, Sword, Crown, BookOpen, ChartBar, Activity } from 'lucide-react'
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Sidebar from '@/components/Sidebar'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import { cn } from "@/lib/utils"

interface UserStats {
  strength: number
  agility: number
  intelligence: number
  vitality: number
  defense: number
  speed: number
  accuracy: number
  willpower: number
  leadership: number
  wisdom: number
  level: number
  xp: number
}

const MAX_STAT = 100
const STAT_ICONS = {
  strength: Dumbbell,
  agility: Footprints,
  intelligence: Brain,
  vitality: Heart,
  defense: Shield,
  speed: Zap,
  accuracy: Target,
  willpower: Sword,
  leadership: Crown,
  wisdom: BookOpen
}

export default function StatsPage() {
  const { user, loading } = useAuth()
  const [stats, setStats] = useState<UserStats>({
    strength: 0,
    agility: 0,
    intelligence: 0,
    vitality: 0,
    defense: 0,
    speed: 0,
    accuracy: 0,
    willpower: 0,
    leadership: 0,
    wisdom: 0,
    level: 1,
    xp: 0
  })

  useEffect(() => {
    if (!loading && !user) {
      window.location.href = '/login'
      return
    }

    const loadStats = async () => {
      try {
        if (!user) return

        const { data, error } = await supabase
          .from('user_stats')
          .select('*')
          .eq('user_id', user.id)
          .single()

        if (error) {
          if (error.code === 'PGRST116') {
            // No stats found, create initial stats
            const initialStats = {
              user_id: user.id,
              strength: 10,
              agility: 10,
              intelligence: 10,
              vitality: 10,
              defense: 10,
              speed: 10,
              accuracy: 10,
              willpower: 10,
              leadership: 10,
              wisdom: 10
            }

            const { data: newStats, error: createError } = await supabase
              .from('user_stats')
              .insert(initialStats)
              .select()
              .single()

            if (createError) throw createError
            if (newStats) setStats({ ...newStats, level: 1, xp: 0 })
          } else {
            throw error
          }
        } else if (data) {
          setStats({ ...data, level: data.level || 1, xp: data.xp || 0 })
        }
      } catch (error) {
        console.error('Error loading stats:', error)
      }
    }

    loadStats()
  }, [user, loading])

  const getStatColor = (value: number) => {
    if (value >= 80) return 'text-emerald-300'
    if (value >= 60) return 'text-cyan-300'
    if (value >= 40) return 'text-violet-300'
    if (value >= 20) return 'text-amber-300'
    return 'text-rose-300'
  }

  const getStatDescription = (stat: keyof typeof STAT_ICONS, value: number) => {
    const descriptions: Record<string, string[]> = {
      strength: ['Novice', 'Amateur', 'Intermediate', 'Advanced', 'Master'],
      agility: ['Clumsy', 'Coordinated', 'Nimble', 'Acrobatic', 'Masterful'],
      intelligence: ['Learning', 'Student', 'Scholar', 'Sage', 'Genius'],
      vitality: ['Fragile', 'Hardy', 'Resilient', 'Vigorous', 'Indomitable'],
      defense: ['Vulnerable', 'Protected', 'Fortified', 'Reinforced', 'Impenetrable'],
      speed: ['Slow', 'Swift', 'Quick', 'Rapid', 'Lightning'],
      accuracy: ['Imprecise', 'Focused', 'Precise', 'Sharp', 'Perfect'],
      willpower: ['Uncertain', 'Determined', 'Resolute', 'Unwavering', 'Unbreakable'],
      leadership: ['Follower', 'Guide', 'Leader', 'Commander', 'Legendary'],
      wisdom: ['Beginner', 'Adept', 'Enlightened', 'Wise', 'Omniscient']
    }

    const index = Math.floor(value / 20)
    return descriptions[stat][Math.min(index, 4)]
  }

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1">
        <div className="min-h-screen bg-[#030014] text-white p-8 md:pl-20">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-violet-100 flex items-center gap-2">
                <Crown className="h-8 w-8 text-violet-400" />
                Character Stats
              </h1>
              <p className="text-violet-300/80 mt-2">Track your progress and growth</p>
            </div>

            {/* Level and XP Card */}
            <Card className="mb-8 p-6 bg-[#0E0529]/50 border-violet-500/20">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-xl font-semibold text-violet-100">Level {stats.level}</h2>
                  <p className="text-violet-300/80">Total XP: {stats.xp}</p>
                </div>
                <Badge className="bg-violet-500/20 text-violet-200 border-violet-500/30">
                  {Math.max(0, 100 * Math.pow(2, stats.level - 1) - stats.xp)} XP to next level
                </Badge>
              </div>
              <div className="w-full bg-violet-950/50 rounded-full h-2">
                <div 
                  className="bg-violet-500 h-2 rounded-full transition-all duration-300"
                  style={{ 
                    width: `${(stats.xp / (100 * Math.pow(2, stats.level - 1))) * 100}%`
                  }}
                />
              </div>
            </Card>

            {/* Stats Visualization Tabs */}
            <Tabs defaultValue="cards" className="mb-8">
              <TabsList className="grid w-full grid-cols-3 bg-violet-950/50">
                <TabsTrigger value="cards" className="data-[state=active]:bg-violet-500/20">
                  <ChartBar className="h-4 w-4 mr-2" />
                  Cards
                </TabsTrigger>
                <TabsTrigger value="chart" className="data-[state=active]:bg-violet-500/20">
                  <Activity className="h-4 w-4 mr-2" />
                  Chart
                </TabsTrigger>
                <TabsTrigger value="bars" className="data-[state=active]:bg-violet-500/20">
                  <ChartBar className="h-4 w-4 mr-2" />
                  Bars
                </TabsTrigger>
              </TabsList>

              {/* Cards View */}
              <TabsContent value="cards">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {(Object.keys(STAT_ICONS) as Array<keyof typeof STAT_ICONS>).map((stat) => {
                    const Icon = STAT_ICONS[stat]
                    const value = stats[stat]
                    const color = getStatColor(value)
                    const description = getStatDescription(stat, value)

                    return (
                      <Card 
                        key={stat}
                        className="bg-[#0E0529]/60 border-violet-500/20 overflow-hidden backdrop-blur-md backdrop-saturate-150 group"
                      >
                        <div className="p-6">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                              <div className={cn(
                                "p-2.5 rounded-xl bg-violet-950/50 border border-violet-500/20",
                                "shadow-lg backdrop-blur-sm backdrop-saturate-150",
                                "group-hover:border-violet-500/40 transition-colors",
                                "transform group-hover:scale-105 duration-200",
                                color
                              )}>
                                <Icon className="h-5 w-5" />
                              </div>
                              <div>
                                <h3 className="text-lg font-semibold text-violet-100 capitalize group-hover:text-violet-50 transition-colors">
                                  {stat}
                                </h3>
                                <p className="text-sm text-violet-300/80 group-hover:text-violet-200/90 transition-colors">
                                  {description}
                                </p>
                              </div>
                            </div>
                            <Badge 
                              className={cn(
                                "bg-violet-950/50 border-violet-500/30",
                                "backdrop-blur-sm backdrop-saturate-150",
                                "group-hover:border-violet-500/50 transition-colors",
                                color
                              )}
                            >
                              {value}/{MAX_STAT}
                            </Badge>
                          </div>

                          {/* Enhanced Progress Bar */}
                          <div className="relative h-3 bg-violet-100/5 rounded-full overflow-hidden backdrop-blur-sm">
                            {/* Background segments */}
                            <div className="absolute inset-0 flex">
                              {[0, 1, 2, 3, 4].map((segment) => (
                                <div
                                  key={segment}
                                  className="flex-1 border-r border-violet-100/5 last:border-0"
                                />
                              ))}
                            </div>

                            {/* White background bar with glass effect */}
                            <div
                              className="absolute inset-y-0 left-0 bg-white/10 backdrop-blur-sm transition-all duration-500"
                              style={{ width: '100%' }}
                            />

                            {/* Colored progress bar */}
                            <div
                            className={cn(
                                "absolute inset-y-0 left-0 transition-all duration-500",
                                color.replace('text-', 'bg-')
                              )}
                              style={{ 
                                width: `${value}%`,
                                boxShadow: `0 0 20px ${color.replace('text-', 'rgb').replace('rgb-emerald-300', '134, 239, 172').replace('rgb-cyan-300', '103, 232, 249').replace('rgb-violet-300', '196, 181, 253').replace('rgb-amber-300', '252, 211, 77').replace('rgb-rose-300', '253, 164, 175')}`
                              }}
                            >
                              {/* Animated gradient overlay */}
                              <div 
                                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"
                                style={{
                                  backgroundSize: '200% 100%',
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      </Card>
                    )
                  })}
                </div>
              </TabsContent>

              {/* Line Graph */}
              <TabsContent value="chart">
                <Card className="p-8 bg-[#0E0529]/60 border-violet-500/20 backdrop-blur-md backdrop-saturate-150">
                  <div className="w-full h-[400px] relative bg-gradient-to-b from-violet-900/10 to-violet-950/20 rounded-lg p-4">
                    {/* Background Pattern */}
                    <div className="absolute inset-0 bg-grid-white/[0.02] rounded-lg" />
                    
                    <svg className="w-full h-full relative z-10" viewBox="0 0 100 100" preserveAspectRatio="none">
                      {/* Background Grid */}
                      {[0, 20, 40, 60, 80, 100].map((level) => (
                        <line
                          key={`grid-${level}`}
                          x1="0"
                          y1={100 - level}
                          x2="100"
                          y2={100 - level}
                          className="stroke-violet-300/10"
                          strokeWidth="0.5"
                          strokeDasharray="4 2"
                          />
                        ))}

                      {/* Area under the line */}
                      <path
                        d={
                          `M 0 100 ` + 
                          (Object.keys(STAT_ICONS) as Array<keyof typeof STAT_ICONS>).map((stat, index) => {
                            const x = (index / (Object.keys(STAT_ICONS).length - 1)) * 100
                            const y = 100 - stats[stat]
                            return `${index === 0 ? 'L' : 'L'} ${x} ${y}`
                          }).join(' ') +
                          ` L 100 100 Z`
                        }
                        className="fill-violet-500/10"
                        filter="url(#areaGlow)"
                      >
                        <animate
                          attributeName="d"
                          dur="1.2s"
                          fill="freeze"
                          calcMode="spline"
                          keySplines="0.16 1 0.3 1"
                          values={
                            `M 0 100 ${(Object.keys(STAT_ICONS) as Array<keyof typeof STAT_ICONS>).map((_, index) => {
                              const x = (index / (Object.keys(STAT_ICONS).length - 1)) * 100
                              return `L ${x} 100`
                            }).join(' ')} L 100 100 Z;` +
                            `M 0 100 ${(Object.keys(STAT_ICONS) as Array<keyof typeof STAT_ICONS>).map((stat, index) => {
                              const x = (index / (Object.keys(STAT_ICONS).length - 1)) * 100
                              const y = 100 - stats[stat]
                              return `L ${x} ${y}`
                            }).join(' ')} L 100 100 Z`
                          }
                        />
                      </path>

                      {/* Main Line */}
                      <path
                        d={
                          (Object.keys(STAT_ICONS) as Array<keyof typeof STAT_ICONS>).map((stat, index) => {
                            const x = (index / (Object.keys(STAT_ICONS).length - 1)) * 100
                            const y = 100 - stats[stat]
                            return `${index === 0 ? 'M' : 'L'} ${x} ${y}`
                          }).join(' ')
                        }
                        className="stroke-violet-400"
                        strokeWidth="2"
                        fill="none"
                        filter="url(#lineGlow)"
                      >
                        <animate
                          attributeName="d"
                          dur="1.2s"
                          fill="freeze"
                          calcMode="spline"
                          keySplines="0.16 1 0.3 1"
                          values={
                            (Object.keys(STAT_ICONS) as Array<keyof typeof STAT_ICONS>).map((_, index) => {
                              const x = (index / (Object.keys(STAT_ICONS).length - 1)) * 100
                              return `${index === 0 ? 'M' : 'L'} ${x} 100`
                            }).join(' ') + ';' +
                            (Object.keys(STAT_ICONS) as Array<keyof typeof STAT_ICONS>).map((stat, index) => {
                              const x = (index / (Object.keys(STAT_ICONS).length - 1)) * 100
                              const y = 100 - stats[stat]
                              return `${index === 0 ? 'M' : 'L'} ${x} ${y}`
                            }).join(' ')
                          }
                        />
                      </path>

                      {/* Stat Points */}
                      {(Object.keys(STAT_ICONS) as Array<keyof typeof STAT_ICONS>).map((stat, index) => {
                        const x = (index / (Object.keys(STAT_ICONS).length - 1)) * 100
                        const value = stats[stat]
                        const y = 100 - value
                        const color = getStatColor(value).replace('text-', 'fill-')

                        return (
                          <g key={stat}>
                            {/* Larger outer circle */}
                            <circle
                              cx={x}
                              cy={y}
                              r="4"
                              className="fill-violet-950/80 stroke-violet-400/50"
                              strokeWidth="2"
                            >
                              <animate
                                attributeName="cy"
                                from="100"
                                to={y}
                                dur="1.2s"
                                fill="freeze"
                                calcMode="spline"
                                keySplines="0.16 1 0.3 1"
                              />
                            </circle>
                            {/* Inner colored circle */}
                            <circle
                              cx={x}
                              cy={y}
                              r="2"
                              className={`${color} mix-blend-screen`}
                              filter="url(#pointGlow)"
                            >
                              <animate
                                attributeName="cy"
                                from="100"
                                to={y}
                                dur="1.2s"
                                fill="freeze"
                                calcMode="spline"
                                keySplines="0.16 1 0.3 1"
                              />
                            </circle>
                          </g>
                        )
                      })}

                      {/* Enhanced Glow Filters */}
                      <defs>
                        <filter id="lineGlow" x="-20%" y="-20%" width="140%" height="140%">
                          <feGaussianBlur stdDeviation="2" result="blur"/>
                          <feColorMatrix
                            in="blur"
                            type="matrix"
                            values="1 0 0 0 0 
                                    0 1 0 0 0 
                                    0 0 1 0 0 
                                    0 0 0 15 -4"
                          />
                        </filter>
                        <filter id="pointGlow">
                          <feGaussianBlur stdDeviation="1.5" result="blur"/>
                          <feColorMatrix
                            in="blur"
                            type="matrix"
                            values="1 0 0 0 0 
                                    0 1 0 0 0 
                                    0 0 1 0 0 
                                    0 0 0 20 -4"
                          />
                        </filter>
                        <filter id="areaGlow">
                          <feGaussianBlur stdDeviation="4" result="blur"/>
                          <feColorMatrix
                            in="blur"
                            type="matrix"
                            values="1 0 0 0 0 
                                    0 1 0 0 0 
                                    0 0 1 0 0 
                                    0 0 0 10 -2"
                          />
                        </filter>
                      </defs>
                    </svg>

                    {/* Enhanced Stat Labels */}
                    <div className="absolute bottom-0 left-0 right-0 flex justify-between px-4">
                      {(Object.keys(STAT_ICONS) as Array<keyof typeof STAT_ICONS>).map((stat) => {
                        const Icon = STAT_ICONS[stat]
                        const value = stats[stat]
                        const color = getStatColor(value)
                        
                        return (
                          <div
                            key={stat}
                            className="flex flex-col items-center gap-2 group"
                          >
                            <div className={cn(
                              "bg-violet-950/40 border border-violet-500/30 p-2 rounded-lg",
                              "shadow-lg backdrop-blur-md backdrop-saturate-150",
                              "transform transition-all duration-200",
                              "group-hover:scale-110 group-hover:border-violet-500/50",
                              "hover:bg-violet-900/30"
                            )}>
                              <Icon className={cn("h-4 w-4", color)} />
                            </div>
                            <span className="text-xs font-medium text-violet-200/80 capitalize whitespace-nowrap group-hover:text-violet-100">
                              {stat}
                            </span>
                          </div>
                        )
                      })}
                    </div>

                    {/* Enhanced Y-axis Labels */}
                    <div className="absolute top-0 bottom-0 left-2 flex flex-col justify-between">
                      {[100, 80, 60, 40, 20, 0].map((value) => (
                        <span key={value} className="text-xs text-violet-200/70 -translate-y-2">
                          {value}
                        </span>
                      ))}
                    </div>
                  </div>
                </Card>
              </TabsContent>

              {/* Bar Chart */}
              <TabsContent value="bars">
                <Card className="p-8 bg-[#0E0529]/60 border-violet-500/20 backdrop-blur-md backdrop-saturate-150">
                  <div className="space-y-6 relative">
                    {/* Background Pattern */}
                    <div className="absolute inset-0 bg-grid-white/[0.02] rounded-lg" />

                    {(Object.keys(STAT_ICONS) as Array<keyof typeof STAT_ICONS>).map((stat) => {
                      const value = stats[stat]
                      const color = getStatColor(value)
                      const Icon = STAT_ICONS[stat]
                      const description = getStatDescription(stat, value)

                      return (
                        <div key={stat} className="relative group">
                          {/* Header */}
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-3">
                          <div className={cn(
                                "p-2.5 rounded-xl bg-violet-950/50 border border-violet-500/20",
                                "shadow-lg backdrop-blur-sm backdrop-saturate-150",
                                "group-hover:border-violet-500/40 transition-colors",
                                "transform group-hover:scale-105 duration-200"
                              )}>
                                <Icon className={cn("h-5 w-5", color)} />
                              </div>
                              <div>
                                <h3 className="text-sm font-semibold text-violet-100 capitalize group-hover:text-violet-50 transition-colors">
                                  {stat}
                                </h3>
                                <p className="text-xs text-violet-300/80 group-hover:text-violet-200/90 transition-colors">
                                  {description}
                                </p>
                              </div>
                            </div>
                            <Badge 
                              className={cn(
                                "bg-violet-950/50 border-violet-500/30",
                                "backdrop-blur-sm backdrop-saturate-150",
                                "group-hover:border-violet-500/50 transition-colors",
                            color
                              )}
                            >
                              {value}/{MAX_STAT}
                            </Badge>
                          </div>

                          {/* Bar Container */}
                          <div className="relative h-3 bg-violet-100/5 rounded-full overflow-hidden backdrop-blur-sm">
                            {/* Background segments */}
                            <div className="absolute inset-0 flex">
                              {[0, 1, 2, 3, 4].map((segment) => (
                                <div
                                  key={segment}
                                  className="flex-1 border-r border-violet-100/5 last:border-0"
                                />
                              ))}
                            </div>

                            {/* White background bar with glass effect */}
                            <div
                              className="absolute inset-y-0 left-0 bg-white/10 backdrop-blur-sm transition-all duration-500"
                              style={{ width: '100%' }}
                            />

                            {/* Colored progress bar */}
                              <div
                                className={cn(
                                "absolute inset-y-0 left-0 transition-all duration-500",
                                  color.replace('text-', 'bg-')
                                )}
                              style={{ 
                                width: `${value}%`,
                                boxShadow: `0 0 20px ${color.replace('text-', 'rgb').replace('rgb-emerald-300', '134, 239, 172').replace('rgb-cyan-300', '103, 232, 249').replace('rgb-violet-300', '196, 181, 253').replace('rgb-amber-300', '252, 211, 77').replace('rgb-rose-300', '253, 164, 175')}`
                              }}
                            >
                              {/* Animated gradient overlay */}
                              <div 
                                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"
                                style={{
                                  backgroundSize: '200% 100%',
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
} 