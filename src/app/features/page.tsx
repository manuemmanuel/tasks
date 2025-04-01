"use client"

import { CheckCircle, Trophy, Users, BarChart, Zap, Shield } from "lucide-react"
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

export default function FeaturesPage() {
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
              Features
            </h1>
            <p className="text-sm sm:text-base md:text-lg text-violet-200/90 mt-2 sm:mt-3 text-center sm:text-left">
              Discover how TaskMaster transforms your productivity with gamified task management
            </p>
          </motion.div>
        </div>

        <div className="flex-1 flex flex-col px-4 sm:px-6 md:px-8 md:pl-20 pb-4 sm:pb-6 md:pb-8">
          <motion.div 
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-7xl mx-auto w-full"
          >
            <motion.div variants={item} whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
              <div className="flex flex-col items-start rounded-lg border border-violet-500/20 bg-violet-950/50 backdrop-blur-sm p-6 transition-all duration-300 hover:border-violet-500/40">
                <Trophy className="h-8 w-8 sm:h-10 sm:w-10 text-violet-400" />
                <h3 className="mt-4 text-lg sm:text-xl font-bold text-violet-50">Gamified Rewards</h3>
                <p className="mt-2 text-sm sm:text-base text-violet-200/90">
                  Earn points, badges, and rewards as you complete tasks. Level up your productivity profile and unlock
                  special achievements.
                </p>
                <ul className="mt-4 space-y-3">
                  <li className="flex items-center gap-3">
                    <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-violet-400" />
                    <span className="text-sm sm:text-base text-violet-200">Experience points (XP) for completed tasks</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-violet-400" />
                    <span className="text-sm sm:text-base text-violet-200">Customizable badges and achievements</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-violet-400" />
                    <span className="text-sm sm:text-base text-violet-200">Leaderboards to track progress</span>
                  </li>
                </ul>
              </div>
            </motion.div>

            <motion.div variants={item} whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
              <div className="flex flex-col items-start rounded-lg border border-violet-500/20 bg-violet-950/50 backdrop-blur-sm p-6 transition-all duration-300 hover:border-violet-500/40">
                <Users className="h-8 w-8 sm:h-10 sm:w-10 text-violet-400" />
                <h3 className="mt-4 text-lg sm:text-xl font-bold text-violet-50">Team Challenges</h3>
                <p className="mt-2 text-sm sm:text-base text-violet-200/90">
                  Compete with teammates to boost productivity. Create team challenges and work together to achieve common
                  goals.
                </p>
                <ul className="mt-4 space-y-3">
                  <li className="flex items-center gap-3">
                    <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-violet-400" />
                    <span className="text-sm sm:text-base text-violet-200">Create custom team challenges</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-violet-400" />
                    <span className="text-sm sm:text-base text-violet-200">Real-time progress tracking</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-violet-400" />
                    <span className="text-sm sm:text-base text-violet-200">Team rewards and recognition</span>
                  </li>
                </ul>
              </div>
            </motion.div>

            <motion.div variants={item} whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
              <div className="flex flex-col items-start rounded-lg border border-violet-500/20 bg-violet-950/50 backdrop-blur-sm p-6 transition-all duration-300 hover:border-violet-500/40">
                <BarChart className="h-8 w-8 sm:h-10 sm:w-10 text-violet-400" />
                <h3 className="mt-4 text-lg sm:text-xl font-bold text-violet-50">Progress Tracking</h3>
                <p className="mt-2 text-sm sm:text-base text-violet-200/90">
                  Visualize your productivity journey with detailed analytics. Track your performance and identify areas for
                  improvement.
                </p>
                <ul className="mt-4 space-y-3">
                  <li className="flex items-center gap-3">
                    <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-violet-400" />
                    <span className="text-sm sm:text-base text-violet-200">Detailed productivity analytics</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-violet-400" />
                    <span className="text-sm sm:text-base text-violet-200">Custom reports and insights</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-violet-400" />
                    <span className="text-sm sm:text-base text-violet-200">Goal tracking and milestone celebrations</span>
                  </li>
                </ul>
              </div>
            </motion.div>

            <motion.div variants={item} whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
              <div className="flex flex-col items-start rounded-lg border border-violet-500/20 bg-violet-950/50 backdrop-blur-sm p-6 transition-all duration-300 hover:border-violet-500/40">
                <Zap className="h-8 w-8 sm:h-10 sm:w-10 text-violet-400" />
                <h3 className="mt-4 text-lg sm:text-xl font-bold text-violet-50">Smart Task Management</h3>
                <p className="mt-2 text-sm sm:text-base text-violet-200/90">
                  Organize tasks with intelligent prioritization. Our AI helps you focus on what matters most.
                </p>
                <ul className="mt-4 space-y-3">
                  <li className="flex items-center gap-3">
                    <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-violet-400" />
                    <span className="text-sm sm:text-base text-violet-200">AI-powered task prioritization</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-violet-400" />
                    <span className="text-sm sm:text-base text-violet-200">Custom workflows and categories</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-violet-400" />
                    <span className="text-sm sm:text-base text-violet-200">Recurring tasks and reminders</span>
                  </li>
                </ul>
              </div>
            </motion.div>

            <motion.div variants={item} whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
              <div className="flex flex-col items-start rounded-lg border border-violet-500/20 bg-violet-950/50 backdrop-blur-sm p-6 transition-all duration-300 hover:border-violet-500/40">
                <Shield className="h-8 w-8 sm:h-10 sm:w-10 text-violet-400" />
                <h3 className="mt-4 text-lg sm:text-xl font-bold text-violet-50">Advanced Security</h3>
                <p className="mt-2 text-sm sm:text-base text-violet-200/90">
                  Keep your data safe with enterprise-grade security features. Your information is always protected.
                </p>
                <ul className="mt-4 space-y-3">
                  <li className="flex items-center gap-3">
                    <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-violet-400" />
                    <span className="text-sm sm:text-base text-violet-200">End-to-end encryption</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-violet-400" />
                    <span className="text-sm sm:text-base text-violet-200">Two-factor authentication</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-violet-400" />
                    <span className="text-sm sm:text-base text-violet-200">Regular security audits</span>
                  </li>
                </ul>
              </div>
            </motion.div>

            <motion.div variants={item} whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
              <div className="flex flex-col items-start rounded-lg border border-violet-500/20 bg-violet-950/50 backdrop-blur-sm p-6 transition-all duration-300 hover:border-violet-500/40">
                <Users className="h-8 w-8 sm:h-10 sm:w-10 text-violet-400" />
                <h3 className="mt-4 text-lg sm:text-xl font-bold text-violet-50">Seamless Integrations</h3>
                <p className="mt-2 text-sm sm:text-base text-violet-200/90">
                  Connect TaskMaster with your favorite tools and services. Streamline your workflow with powerful
                  integrations.
                </p>
                <ul className="mt-4 space-y-3">
                  <li className="flex items-center gap-3">
                    <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-violet-400" />
                    <span className="text-sm sm:text-base text-violet-200">Integration with calendar apps</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-violet-400" />
                    <span className="text-sm sm:text-base text-violet-200">Connect with project management tools</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-violet-400" />
                    <span className="text-sm sm:text-base text-violet-200">API access for custom integrations</span>
                  </li>
                </ul>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}