"use client"

import { motion } from "framer-motion"
import { FileText, Shield, Scale, Clock } from "lucide-react"
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

export default function TermsPage() {
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
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-violet-50">
              Terms of Service
            </h1>
            <p className="text-sm sm:text-base md:text-lg text-violet-200/90 mt-2">
              Last updated: March 15, 2024
            </p>
          </motion.div>
        </div>

        <div className="flex-1 flex flex-col px-4 sm:px-6 md:px-8 md:pl-20 pb-4 sm:pb-6 md:pb-8">
          <motion.div 
            variants={container}
            initial="hidden"
            animate="show"
            className="max-w-4xl mx-auto w-full space-y-8"
          >
            <motion.div variants={item}>
              <div className="rounded-lg border border-violet-500/20 bg-violet-950/50 backdrop-blur-sm p-6">
                <div className="flex items-center gap-4 mb-4">
                  <FileText className="h-6 w-6 text-violet-400" />
                  <h2 className="text-xl font-bold text-violet-50">1. Terms of Use</h2>
                </div>
                <div className="space-y-4 text-violet-200/90">
                  <p>
                    By accessing and using QuestLife, you accept and agree to be bound by the terms and provision of this agreement.
                  </p>
                  <p>
                    You agree to use the service for lawful purposes only and in a way that does not infringe the rights of, restrict, or inhibit anyone else's use and enjoyment of the service.
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div variants={item}>
              <div className="rounded-lg border border-violet-500/20 bg-violet-950/50 backdrop-blur-sm p-6">
                <div className="flex items-center gap-4 mb-4">
                  <Shield className="h-6 w-6 text-violet-400" />
                  <h2 className="text-xl font-bold text-violet-50">2. Privacy & Security</h2>
                </div>
                <div className="space-y-4 text-violet-200/90">
                  <p>
                    Your privacy is important to us. Please review our Privacy Policy to understand how we collect, use, and protect your personal information.
                  </p>
                  <p>
                    You are responsible for maintaining the confidentiality of your account and password and for restricting access to your computer.
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div variants={item}>
              <div className="rounded-lg border border-violet-500/20 bg-violet-950/50 backdrop-blur-sm p-6">
                <div className="flex items-center gap-4 mb-4">
                  <Scale className="h-6 w-6 text-violet-400" />
                  <h2 className="text-xl font-bold text-violet-50">3. User Responsibilities</h2>
                </div>
                <div className="space-y-4 text-violet-200/90">
                  <p>
                    Users must not misuse the service by knowingly introducing viruses, trojans, worms, or other material that could harm the service or other users.
                  </p>
                  <p>
                    You agree not to reproduce, duplicate, copy, sell, resell, or exploit any portion of the service without express written permission from us.
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div variants={item}>
              <div className="rounded-lg border border-violet-500/20 bg-violet-950/50 backdrop-blur-sm p-6">
                <div className="flex items-center gap-4 mb-4">
                  <Clock className="h-6 w-6 text-violet-400" />
                  <h2 className="text-xl font-bold text-violet-50">4. Service Modifications</h2>
                </div>
                <div className="space-y-4 text-violet-200/90">
                  <p>
                    We reserve the right to modify or discontinue the service with or without notice at any time.
                  </p>
                  <p>
                    We shall not be liable to you or any third party for any modification, suspension, or discontinuance of the service.
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  )
} 