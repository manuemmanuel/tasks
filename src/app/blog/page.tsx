"use client"

import { Calendar, Clock, User, ArrowRight } from "lucide-react"
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

export default function BlogPage() {
  const blogPosts = [
    {
      title: "The Future of Task Management: AI and Automation",
      excerpt: "Explore how artificial intelligence is revolutionizing the way we manage tasks and boost productivity.",
      author: "Sarah Johnson",
      date: "March 15, 2024",
      readTime: "5 min read",
      category: "Technology",
    },
    {
      title: "Building Better Habits with Gamification",
      excerpt: "Learn how gamification techniques can help you build and maintain productive habits.",
      author: "Michael Chen",
      date: "March 10, 2024",
      readTime: "4 min read",
      category: "Productivity",
    },
    {
      title: "Remote Work: The New Normal",
      excerpt: "Discover how remote work is changing the way teams collaborate and manage tasks.",
      author: "Emma Rodriguez",
      date: "March 5, 2024",
      readTime: "6 min read",
      category: "Workplace",
    },
    {
      title: "The Psychology of Productivity",
      excerpt: "Understanding the mental models and psychological principles behind effective task management.",
      author: "David Kim",
      date: "March 1, 2024",
      readTime: "7 min read",
      category: "Psychology",
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
              Blog
            </h1>
            <p className="text-sm sm:text-base md:text-lg text-violet-200/90 mt-2 sm:mt-3 text-center sm:text-left">
              Insights, tips, and stories about productivity and task management
            </p>
          </motion.div>
        </div>

        <div className="flex-1 flex flex-col px-4 sm:px-6 md:px-8 md:pl-20 pb-4 sm:pb-6 md:pb-8">
          <motion.div 
            variants={container}
            initial="hidden"
            animate="show"
            className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto w-full"
          >
            {blogPosts.map((post, index) => (
              <motion.div 
                key={index} 
                variants={item} 
                whileHover={{ scale: 1.02 }} 
                transition={{ duration: 0.2 }}
              >
                <div className="flex flex-col rounded-lg border border-violet-500/20 bg-violet-950/50 backdrop-blur-sm p-6 transition-all duration-300 hover:border-violet-500/40">
                  <div className="flex items-center gap-4 mb-4">
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-violet-500/10 text-violet-400">
                      {post.category}
                    </span>
                    <div className="flex items-center gap-2 text-sm text-violet-200/70">
                      <Calendar className="h-4 w-4" />
                      {post.date}
                    </div>
                  </div>
                  <h2 className="text-xl font-bold text-violet-50 mb-2">{post.title}</h2>
                  <p className="text-sm text-violet-200/90 mb-4">{post.excerpt}</p>
                  <div className="flex items-center justify-between mt-auto">
                    <div className="flex items-center gap-2 text-sm text-violet-200/70">
                      <User className="h-4 w-4" />
                      {post.author}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-violet-400">
                      <Clock className="h-4 w-4" />
                      {post.readTime}
                    </div>
                  </div>
                  <button className="flex items-center gap-2 text-violet-400 hover:text-violet-300 mt-4 group">
                    Read more
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-12"
          >
            <div className="rounded-lg border border-violet-500/20 bg-violet-950/50 backdrop-blur-sm p-6 sm:p-8">
              <h2 className="text-xl sm:text-2xl font-bold text-violet-50 text-center">Stay Updated</h2>
              <p className="mt-4 text-sm sm:text-base text-violet-200/90 text-center">
                Subscribe to our newsletter to receive the latest insights and updates.
              </p>
              <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-center">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="px-4 py-2 rounded-lg bg-violet-950/50 border border-violet-500/20 text-violet-50 placeholder-violet-200/50 focus:outline-none focus:border-violet-500/40"
                />
                <button className="px-6 py-2 rounded-lg bg-violet-500 text-white hover:bg-violet-600 transition-colors">
                  Subscribe
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
} 