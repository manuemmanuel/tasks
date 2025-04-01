"use client"

import { Shield, Lock, FileCheck, Server, Users, Clock } from "lucide-react"
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

export default function SecurityPage() {
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
              Security & Compliance
            </h1>
            <p className="text-sm sm:text-base md:text-lg text-violet-200/90 mt-2 sm:mt-3 text-center sm:text-left">
              How we keep your data safe and secure
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
                <Shield className="h-8 w-8 sm:h-10 sm:w-10 text-violet-400" />
                <h3 className="mt-4 text-lg sm:text-xl font-bold text-violet-50">Data Encryption</h3>
                <p className="mt-2 text-sm sm:text-base text-violet-200/90">
                  All data is encrypted both in transit and at rest using industry-standard encryption protocols. Your
                  information is always protected.
                </p>
              </div>
            </motion.div>

            <motion.div variants={item} whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
              <div className="flex flex-col items-start rounded-lg border border-violet-500/20 bg-violet-950/50 backdrop-blur-sm p-6 transition-all duration-300 hover:border-violet-500/40">
                <Lock className="h-8 w-8 sm:h-10 sm:w-10 text-violet-400" />
                <h3 className="mt-4 text-lg sm:text-xl font-bold text-violet-50">Authentication</h3>
                <p className="mt-2 text-sm sm:text-base text-violet-200/90">
                  We offer multi-factor authentication to add an extra layer of security to your account. Protect your account
                  with more than just a password.
                </p>
              </div>
            </motion.div>

            <motion.div variants={item} whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
              <div className="flex flex-col items-start rounded-lg border border-violet-500/20 bg-violet-950/50 backdrop-blur-sm p-6 transition-all duration-300 hover:border-violet-500/40">
                <FileCheck className="h-8 w-8 sm:h-10 sm:w-10 text-violet-400" />
                <h3 className="mt-4 text-lg sm:text-xl font-bold text-violet-50">Compliance</h3>
                <p className="mt-2 text-sm sm:text-base text-violet-200/90">
                  TaskMaster is compliant with GDPR, CCPA, and other relevant data protection regulations. We take your
                  privacy seriously.
                </p>
              </div>
            </motion.div>

            <motion.div variants={item} whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
              <div className="flex flex-col items-start rounded-lg border border-violet-500/20 bg-violet-950/50 backdrop-blur-sm p-6 transition-all duration-300 hover:border-violet-500/40">
                <Server className="h-8 w-8 sm:h-10 sm:w-10 text-violet-400" />
                <h3 className="mt-4 text-lg sm:text-xl font-bold text-violet-50">Infrastructure Security</h3>
                <p className="mt-2 text-sm sm:text-base text-violet-200/90">
                  Our infrastructure is hosted in secure, SOC 2 compliant data centers with 24/7 monitoring and regular
                  security audits.
                </p>
              </div>
            </motion.div>

            <motion.div variants={item} whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
              <div className="flex flex-col items-start rounded-lg border border-violet-500/20 bg-violet-950/50 backdrop-blur-sm p-6 transition-all duration-300 hover:border-violet-500/40">
                <Users className="h-8 w-8 sm:h-10 sm:w-10 text-violet-400" />
                <h3 className="mt-4 text-lg sm:text-xl font-bold text-violet-50">Access Controls</h3>
                <p className="mt-2 text-sm sm:text-base text-violet-200/90">
                  Granular permission settings allow you to control who has access to what data. Protect sensitive information
                  with role-based access controls.
                </p>
              </div>
            </motion.div>

            <motion.div variants={item} whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
              <div className="flex flex-col items-start rounded-lg border border-violet-500/20 bg-violet-950/50 backdrop-blur-sm p-6 transition-all duration-300 hover:border-violet-500/40">
                <Clock className="h-8 w-8 sm:h-10 sm:w-10 text-violet-400" />
                <h3 className="mt-4 text-lg sm:text-xl font-bold text-violet-50">Regular Audits</h3>
                <p className="mt-2 text-sm sm:text-base text-violet-200/90">
                  We conduct regular security audits and penetration testing to identify and address potential vulnerabilities
                  before they become issues.
                </p>
              </div>
            </motion.div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-8 sm:mt-12"
          >
            <div className="rounded-lg border border-violet-500/20 bg-violet-950/50 backdrop-blur-sm p-6 sm:p-8">
              <h2 className="text-xl sm:text-2xl font-bold text-violet-50 text-center">Our Security Commitment</h2>
              <p className="mt-4 text-sm sm:text-base text-violet-200/90 text-center">
                At TaskMaster, security is not just a feature—it's a core value. We are committed to maintaining the highest
                standards of security to protect your data.
              </p>
              <div className="mt-8 grid gap-6 md:grid-cols-3">
                <div className="rounded-lg border border-violet-500/20 bg-violet-950/50 backdrop-blur-sm p-4">
                  <h3 className="text-base sm:text-lg font-semibold text-violet-50">Dedicated Security Team</h3>
                  <p className="mt-2 text-sm text-violet-200/90">
                    Our dedicated security team works around the clock to monitor and protect our systems.
                  </p>
                </div>
                <div className="rounded-lg border border-violet-500/20 bg-violet-950/50 backdrop-blur-sm p-4">
                  <h3 className="text-base sm:text-lg font-semibold text-violet-50">Incident Response</h3>
                  <p className="mt-2 text-sm text-violet-200/90">
                    We have a comprehensive incident response plan to quickly address any security concerns.
                  </p>
                </div>
                <div className="rounded-lg border border-violet-500/20 bg-violet-950/50 backdrop-blur-sm p-4">
                  <h3 className="text-base sm:text-lg font-semibold text-violet-50">Continuous Improvement</h3>
                  <p className="mt-2 text-sm text-violet-200/90">
                    We continuously update our security practices to stay ahead of emerging threats.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}