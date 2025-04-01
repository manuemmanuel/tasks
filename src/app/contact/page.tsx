"use client"

import { motion } from "framer-motion"
import { Mail, Phone, MapPin, Send } from "lucide-react"
import Sidebar from "@/components/Sidebar"
import { Button } from "@/components/ui/button"

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

export default function ContactPage() {
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
              Contact Us
            </h1>
            <p className="text-sm sm:text-base md:text-lg text-violet-200/90 mt-2">
              Get in touch with our team
            </p>
          </motion.div>
        </div>

        <div className="flex-1 flex flex-col px-4 sm:px-6 md:px-8 md:pl-20 pb-4 sm:pb-6 md:pb-8">
          <motion.div 
            variants={container}
            initial="hidden"
            animate="show"
            className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto w-full"
          >
            <motion.div variants={item}>
              <div className="rounded-lg border border-violet-500/20 bg-violet-950/50 backdrop-blur-sm p-6">
                <h2 className="text-xl font-bold text-violet-50 mb-6">Contact Information</h2>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <Mail className="h-6 w-6 text-violet-400 mt-1" />
                    <div>
                      <h3 className="text-lg font-semibold text-violet-50">Email</h3>
                      <p className="text-violet-200/90">support@questlife.com</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <Phone className="h-6 w-6 text-violet-400 mt-1" />
                    <div>
                      <h3 className="text-lg font-semibold text-violet-50">Phone</h3>
                      <p className="text-violet-200/90">+1 (555) 123-4567</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <MapPin className="h-6 w-6 text-violet-400 mt-1" />
                    <div>
                      <h3 className="text-lg font-semibold text-violet-50">Location</h3>
                      <p className="text-violet-200/90">123 Innovation Street<br />Tech City, TC 12345</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div variants={item}>
              <form className="rounded-lg border border-violet-500/20 bg-violet-950/50 backdrop-blur-sm p-6">
                <h2 className="text-xl font-bold text-violet-50 mb-6">Send us a message</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-violet-200 mb-1">Name</label>
                    <input
                      type="text"
                      className="w-full bg-violet-900/50 border border-violet-500/20 rounded-lg px-4 py-2 text-violet-50"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-violet-200 mb-1">Email</label>
                    <input
                      type="email"
                      className="w-full bg-violet-900/50 border border-violet-500/20 rounded-lg px-4 py-2 text-violet-50"
                      placeholder="Your email"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-violet-200 mb-1">Message</label>
                    <textarea
                      className="w-full bg-violet-900/50 border border-violet-500/20 rounded-lg px-4 py-2 text-violet-50 h-32"
                      placeholder="Your message"
                    />
                  </div>
                  <Button className="w-full bg-violet-600 hover:bg-violet-500">
                    <Send className="h-4 w-4 mr-2" />
                    Send Message
                  </Button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  )
} 