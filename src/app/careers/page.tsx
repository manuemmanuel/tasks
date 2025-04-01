"use client"

import { motion } from "framer-motion"
import { Briefcase, Users, Heart, Coffee, ArrowRight } from "lucide-react"
import Sidebar from "@/components/Sidebar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

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

const jobs = [
  {
    title: "Senior Full Stack Developer",
    department: "Engineering",
    location: "Remote",
    type: "Full-time",
    description: "We're looking for an experienced full stack developer to help build the future of productivity."
  },
  {
    title: "Product Designer",
    department: "Design",
    location: "Remote",
    type: "Full-time",
    description: "Join our design team to create beautiful and intuitive user experiences."
  },
  {
    title: "Marketing Manager",
    department: "Marketing",
    location: "Hybrid",
    type: "Full-time",
    description: "Lead our marketing efforts and help spread the word about QuestLife."
  }
]

export default function CareersPage() {
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
              Join Our Team
            </h1>
            <p className="text-sm sm:text-base md:text-lg text-violet-200/90 mt-2">
              Help us transform productivity into an epic adventure
            </p>
          </motion.div>
        </div>

        <div className="flex-1 flex flex-col px-4 sm:px-6 md:px-8 md:pl-20 pb-4 sm:pb-6 md:pb-8">
          <motion.div variants={container} initial="hidden" animate="show">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              <motion.div variants={item} className="rounded-lg border border-violet-500/20 bg-violet-950/50 backdrop-blur-sm p-6">
                <Briefcase className="h-8 w-8 text-violet-400 mb-4" />
                <h3 className="text-lg font-bold text-violet-50">Flexible Work</h3>
                <p className="text-violet-200/90 mt-2">Work from anywhere in the world</p>
              </motion.div>
              <motion.div variants={item} className="rounded-lg border border-violet-500/20 bg-violet-950/50 backdrop-blur-sm p-6">
                <Users className="h-8 w-8 text-violet-400 mb-4" />
                <h3 className="text-lg font-bold text-violet-50">Great Team</h3>
                <p className="text-violet-200/90 mt-2">Work with talented individuals</p>
              </motion.div>
              <motion.div variants={item} className="rounded-lg border border-violet-500/20 bg-violet-950/50 backdrop-blur-sm p-6">
                <Heart className="h-8 w-8 text-violet-400 mb-4" />
                <h3 className="text-lg font-bold text-violet-50">Benefits</h3>
                <p className="text-violet-200/90 mt-2">Comprehensive healthcare & more</p>
              </motion.div>
              <motion.div variants={item} className="rounded-lg border border-violet-500/20 bg-violet-950/50 backdrop-blur-sm p-6">
                <Coffee className="h-8 w-8 text-violet-400 mb-4" />
                <h3 className="text-lg font-bold text-violet-50">Culture</h3>
                <p className="text-violet-200/90 mt-2">Fun and inclusive workplace</p>
              </motion.div>
            </div>

            <motion.div variants={item}>
              <h2 className="text-2xl font-bold text-violet-50 mb-6">Open Positions</h2>
              <div className="space-y-6">
                {jobs.map((job, index) => (
                  <motion.div
                    key={index}
                    variants={item}
                    className="rounded-lg border border-violet-500/20 bg-violet-950/50 backdrop-blur-sm p-6"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div>
                        <h3 className="text-xl font-bold text-violet-50">{job.title}</h3>
                        <div className="flex flex-wrap gap-2 mt-2">
                          <Badge variant="secondary" className="bg-violet-500/20 text-violet-200">
                            {job.department}
                          </Badge>
                          <Badge variant="secondary" className="bg-violet-500/20 text-violet-200">
                            {job.location}
                          </Badge>
                          <Badge variant="secondary" className="bg-violet-500/20 text-violet-200">
                            {job.type}
                          </Badge>
                        </div>
                        <p className="text-violet-200/90 mt-4">{job.description}</p>
                      </div>
                      <Button className="bg-violet-600 hover:bg-violet-500">
                        Apply Now
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  )
} 