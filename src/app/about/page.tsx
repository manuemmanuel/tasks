"use client"

import { Trophy, Users, Target, Heart, Sparkles, Lightbulb, Rocket, Globe } from "lucide-react"
import { motion } from "framer-motion"
import Sidebar from "@/components/Sidebar"

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
}

export default function AboutPage() {
  const teamMembers = [
    {
      name: "Sarah Johnson",
      role: "CEO & Co-Founder",
      bio: "Former productivity consultant with a passion for gamification and behavioral psychology.",
    },
    {
      name: "Michael Chen",
      role: "CTO & Co-Founder",
      bio: "Software engineer with 15+ years of experience building scalable applications.",
    },
    {
      name: "Emma Rodriguez",
      role: "Chief Product Officer",
      bio: "UX specialist focused on creating engaging and intuitive user experiences.",
    },
    {
      name: "David Kim",
      role: "Chief Marketing Officer",
      bio: "Marketing strategist with a background in SaaS and productivity tools.",
    },
  ]

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col min-h-screen bg-[#030014] overflow-x-hidden">
        <div className="p-4 sm:p-6 md:p-8 md:pl-20">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6 sm:mb-8 md:mb-12"
          >
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-violet-50 text-center sm:text-left">
              Our Story
            </h1>
            <p className="text-sm sm:text-base md:text-lg text-violet-200/90 mt-2 sm:mt-3 text-center sm:text-left">
              How TaskMaster is transforming the way people work
            </p>
          </motion.div>
        </div>

        <div className="flex-1 flex flex-col px-4 sm:px-6 md:px-8 md:pl-20 pb-4 sm:pb-6 md:pb-8">
          <motion.div 
            variants={container}
            initial="hidden"
            animate="show"
            className="grid gap-12 md:grid-cols-2 items-center"
          >
            <motion.div variants={item} className="space-y-6">
              <div className="rounded-lg border border-violet-500/20 bg-violet-950/50 backdrop-blur-sm p-6 transition-all duration-300 hover:border-violet-500/40">
                <h2 className="text-2xl sm:text-3xl font-bold text-violet-50">From Idea to Innovation</h2>
                <p className="mt-4 text-sm sm:text-base text-violet-200/90">
                  TaskMaster was born from a simple observation: traditional task management tools were efficient but boring.
                  Our founders, Sarah and Michael, believed that by adding elements of gamification to productivity, they
                  could create a tool that people would actually enjoy using.
                </p>
                <p className="mt-4 text-sm sm:text-base text-violet-200/90">
                  Founded in 2022, TaskMaster has grown from a small startup to a company serving thousands of users
                  worldwide. Our mission is to transform mundane tasks into engaging experiences that boost productivity and
                  bring joy to work.
                </p>
              </div>
            </motion.div>
            <motion.div variants={item} className="grid grid-cols-2 gap-4">
              <div className="rounded-lg border border-violet-500/20 bg-violet-950/50 backdrop-blur-sm p-4 transition-all duration-300 hover:border-violet-500/40">
                <Sparkles className="h-8 w-8 text-violet-400 mb-2" />
                <h3 className="text-lg font-semibold text-violet-50">Innovation</h3>
                <p className="text-sm text-violet-200/90 mt-1">Revolutionizing task management</p>
              </div>
              <div className="rounded-lg border border-violet-500/20 bg-violet-950/50 backdrop-blur-sm p-4 transition-all duration-300 hover:border-violet-500/40">
                <Lightbulb className="h-8 w-8 text-violet-400 mb-2" />
                <h3 className="text-lg font-semibold text-violet-50">Vision</h3>
                <p className="text-sm text-violet-200/90 mt-1">Making work enjoyable</p>
              </div>
              <div className="rounded-lg border border-violet-500/20 bg-violet-950/50 backdrop-blur-sm p-4 transition-all duration-300 hover:border-violet-500/40">
                <Rocket className="h-8 w-8 text-violet-400 mb-2" />
                <h3 className="text-lg font-semibold text-violet-50">Growth</h3>
                <p className="text-sm text-violet-200/90 mt-1">Expanding globally</p>
              </div>
              <div className="rounded-lg border border-violet-500/20 bg-violet-950/50 backdrop-blur-sm p-4 transition-all duration-300 hover:border-violet-500/40">
                <Globe className="h-8 w-8 text-violet-400 mb-2" />
                <h3 className="text-lg font-semibold text-violet-50">Impact</h3>
                <p className="text-sm text-violet-200/90 mt-1">Changing lives worldwide</p>
              </div>
            </motion.div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-16 sm:mt-24"
          >
            <h2 className="text-2xl sm:text-3xl font-bold text-violet-50 text-center">Our Mission & Values</h2>
            <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              <motion.div variants={item} whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
                <div className="flex flex-col items-center text-center rounded-lg border border-violet-500/20 bg-violet-950/50 backdrop-blur-sm p-6 transition-all duration-300 hover:border-violet-500/40">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-violet-500/10">
                    <Trophy className="h-8 w-8 text-violet-400" />
                  </div>
                  <h3 className="mt-4 text-lg sm:text-xl font-bold text-violet-50">Excellence</h3>
                  <p className="mt-2 text-sm sm:text-base text-violet-200/90">
                    We strive for excellence in everything we do, from code quality to customer support.
                  </p>
                </div>
              </motion.div>
              <motion.div variants={item} whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
                <div className="flex flex-col items-center text-center rounded-lg border border-violet-500/20 bg-violet-950/50 backdrop-blur-sm p-6 transition-all duration-300 hover:border-violet-500/40">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-violet-500/10">
                    <Users className="h-8 w-8 text-violet-400" />
                  </div>
                  <h3 className="mt-4 text-lg sm:text-xl font-bold text-violet-50">Collaboration</h3>
                  <p className="mt-2 text-sm sm:text-base text-violet-200/90">
                    We believe in the power of teamwork and foster a collaborative environment.
                  </p>
                </div>
              </motion.div>
              <motion.div variants={item} whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
                <div className="flex flex-col items-center text-center rounded-lg border border-violet-500/20 bg-violet-950/50 backdrop-blur-sm p-6 transition-all duration-300 hover:border-violet-500/40">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-violet-500/10">
                    <Target className="h-8 w-8 text-violet-400" />
                  </div>
                  <h3 className="mt-4 text-lg sm:text-xl font-bold text-violet-50">Innovation</h3>
                  <p className="mt-2 text-sm sm:text-base text-violet-200/90">
                    We continuously innovate to create better solutions for our users.
                  </p>
                </div>
              </motion.div>
              <motion.div variants={item} whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
                <div className="flex flex-col items-center text-center rounded-lg border border-violet-500/20 bg-violet-950/50 backdrop-blur-sm p-6 transition-all duration-300 hover:border-violet-500/40">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-violet-500/10">
                    <Heart className="h-8 w-8 text-violet-400" />
                  </div>
                  <h3 className="mt-4 text-lg sm:text-xl font-bold text-violet-50">User-Centric</h3>
                  <p className="mt-2 text-sm sm:text-base text-violet-200/90">
                    Our users are at the heart of everything we do. Their success is our success.
                  </p>
                </div>
              </motion.div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-16 sm:mt-24"
          >
            <h2 className="text-2xl sm:text-3xl font-bold text-violet-50 text-center">Our Leadership Team</h2>
            <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              {teamMembers.map((member, index) => (
                <motion.div 
                  key={index} 
                  variants={item} 
                  whileHover={{ scale: 1.02 }} 
                  transition={{ duration: 0.2 }}
                >
                  <div className="flex flex-col items-center text-center rounded-lg border border-violet-500/20 bg-violet-950/50 backdrop-blur-sm p-6 transition-all duration-300 hover:border-violet-500/40">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-violet-500/10 mb-4">
                      <span className="text-2xl font-bold text-violet-400">{member.name[0]}</span>
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-violet-50">{member.name}</h3>
                    <p className="text-violet-400">{member.role}</p>
                    <p className="mt-2 text-sm sm:text-base text-violet-200/90">{member.bio}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-16 sm:mt-24"
          >
            <div className="rounded-lg border border-violet-500/20 bg-violet-950/50 backdrop-blur-sm p-6 sm:p-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-violet-50 text-center">TaskMaster by the Numbers</h2>
              <div className="mt-8 grid gap-8 md:grid-cols-4">
                <div className="flex flex-col items-center text-center">
                  <span className="text-3xl sm:text-4xl font-bold text-violet-400">50,000+</span>
                  <span className="mt-2 text-sm sm:text-base text-violet-200/90">Active Users</span>
                </div>
                <div className="flex flex-col items-center text-center">
                  <span className="text-3xl sm:text-4xl font-bold text-violet-400">1M+</span>
                  <span className="mt-2 text-sm sm:text-base text-violet-200/90">Tasks Completed</span>
                </div>
                <div className="flex flex-col items-center text-center">
                  <span className="text-3xl sm:text-4xl font-bold text-violet-400">25+</span>
                  <span className="mt-2 text-sm sm:text-base text-violet-200/90">Team Members</span>
                </div>
                <div className="flex flex-col items-center text-center">
                  <span className="text-3xl sm:text-4xl font-bold text-violet-400">15+</span>
                  <span className="mt-2 text-sm sm:text-base text-violet-200/90">Countries</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}