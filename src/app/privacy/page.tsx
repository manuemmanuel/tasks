"use client"

import { Shield, Lock, FileCheck, Server, Users, Clock, Eye, Mail, Database } from "lucide-react"
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

export default function PrivacyPage() {
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
              Privacy Policy
            </h1>
            <p className="text-sm sm:text-base md:text-lg text-violet-200/90 mt-2 sm:mt-3 text-center sm:text-left">
              How we protect and handle your data
            </p>
          </motion.div>
        </div>

        <div className="flex-1 flex flex-col px-4 sm:px-6 md:px-8 md:pl-20 pb-4 sm:pb-6 md:pb-8">
          <motion.div 
            variants={container}
            initial="hidden"
            animate="show"
            className="grid gap-8 max-w-4xl mx-auto w-full"
          >
            <motion.div variants={item}>
              <div className="rounded-lg border border-violet-500/20 bg-violet-950/50 backdrop-blur-sm p-6 transition-all duration-300 hover:border-violet-500/40">
                <h2 className="text-xl sm:text-2xl font-bold text-violet-50 mb-4">Information We Collect</h2>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <Eye className="h-6 w-6 text-violet-400 mt-1" />
                    <div>
                      <h3 className="text-lg font-semibold text-violet-50">Personal Information</h3>
                      <p className="text-sm text-violet-200/90 mt-1">
                        We collect information that you provide directly to us, including your name, email address, and any
                        other information you choose to provide.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <Database className="h-6 w-6 text-violet-400 mt-1" />
                    <div>
                      <h3 className="text-lg font-semibold text-violet-50">Usage Data</h3>
                      <p className="text-sm text-violet-200/90 mt-1">
                        We automatically collect information about your device and how you use our service, including IP
                        address, browser type, and usage patterns.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div variants={item}>
              <div className="rounded-lg border border-violet-500/20 bg-violet-950/50 backdrop-blur-sm p-6 transition-all duration-300 hover:border-violet-500/40">
                <h2 className="text-xl sm:text-2xl font-bold text-violet-50 mb-4">How We Use Your Information</h2>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <Mail className="h-6 w-6 text-violet-400 mt-1" />
                    <div>
                      <h3 className="text-lg font-semibold text-violet-50">Service Delivery</h3>
                      <p className="text-sm text-violet-200/90 mt-1">
                        We use your information to provide, maintain, and improve our services, including processing your
                        tasks and sending you important updates.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <Users className="h-6 w-6 text-violet-400 mt-1" />
                    <div>
                      <h3 className="text-lg font-semibold text-violet-50">User Experience</h3>
                      <p className="text-sm text-violet-200/90 mt-1">
                        We analyze usage data to improve our service, personalize your experience, and develop new features.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div variants={item}>
              <div className="rounded-lg border border-violet-500/20 bg-violet-950/50 backdrop-blur-sm p-6 transition-all duration-300 hover:border-violet-500/40">
                <h2 className="text-xl sm:text-2xl font-bold text-violet-50 mb-4">Data Protection</h2>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <Lock className="h-6 w-6 text-violet-400 mt-1" />
                    <div>
                      <h3 className="text-lg font-semibold text-violet-50">Security Measures</h3>
                      <p className="text-sm text-violet-200/90 mt-1">
                        We implement appropriate security measures to protect your personal information from unauthorized
                        access, alteration, disclosure, or destruction.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <Server className="h-6 w-6 text-violet-400 mt-1" />
                    <div>
                      <h3 className="text-lg font-semibold text-violet-50">Data Storage</h3>
                      <p className="text-sm text-violet-200/90 mt-1">
                        Your data is stored in secure, encrypted databases with regular backups and access controls.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div variants={item}>
              <div className="rounded-lg border border-violet-500/20 bg-violet-950/50 backdrop-blur-sm p-6 transition-all duration-300 hover:border-violet-500/40">
                <h2 className="text-xl sm:text-2xl font-bold text-violet-50 mb-4">Your Rights</h2>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <FileCheck className="h-6 w-6 text-violet-400 mt-1" />
                    <div>
                      <h3 className="text-lg font-semibold text-violet-50">Access and Control</h3>
                      <p className="text-sm text-violet-200/90 mt-1">
                        You have the right to access, correct, or delete your personal information. You can also request a
                        copy of your data or opt-out of certain data processing activities.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <Clock className="h-6 w-6 text-violet-400 mt-1" />
                    <div>
                      <h3 className="text-lg font-semibold text-violet-50">Data Retention</h3>
                      <p className="text-sm text-violet-200/90 mt-1">
                        We retain your data only for as long as necessary to provide our services and comply with legal
                        obligations.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div variants={item}>
              <div className="rounded-lg border border-violet-500/20 bg-violet-950/50 backdrop-blur-sm p-6 transition-all duration-300 hover:border-violet-500/40">
                <h2 className="text-xl sm:text-2xl font-bold text-violet-50 mb-4">Contact Us</h2>
                <p className="text-sm text-violet-200/90">
                  If you have any questions about our privacy policy or how we handle your data, please contact our privacy
                  team at privacy@taskmaster.com.
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  )
} 