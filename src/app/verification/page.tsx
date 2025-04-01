"use client"

import Link from "next/link"
import { CheckCircle, Clock, Search, Filter, MoreVertical, Play, BarChart, Crown, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import Sidebar from "@/components/Sidebar"
import { motion } from "framer-motion"

export default function VerificationPage() {
  // Mock data for quizzes
  const quizzes = [
    {
      id: 1,
      title: "Biology 101 - Cell Structure",
      description: "Test your knowledge of cell structure and function",
      source: "Notes",
      questionCount: 15,
      createdDate: "2025-03-15",
      status: "not-started",
      tags: ["biology", "science", "cells"],
    },
    {
      id: 2,
      title: "World War II - Major Events",
      description: "Quiz on the causes and major events of WWII",
      source: "Notes",
      questionCount: 20,
      createdDate: "2025-03-10",
      status: "in-progress",
      progress: 40,
      tags: ["history", "war", "europe"],
    },
    {
      id: 3,
      title: "Computer Science - Algorithms",
      description: "Test your knowledge of sorting algorithms",
      source: "Task",
      questionCount: 10,
      createdDate: "2025-03-05",
      status: "completed",
      score: 85,
      tags: ["computer science", "algorithms", "programming"],
    },
    {
      id: 4,
      title: "Psychology - Cognitive Development",
      description: "Quiz on Piaget's theory of cognitive development",
      source: "Notes",
      questionCount: 12,
      createdDate: "2025-02-28",
      status: "completed",
      score: 92,
      tags: ["psychology", "development", "cognition"],
    },
  ]

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1">
        <div className="min-h-screen bg-gradient-to-b from-[#030014] to-[#0E0529] text-white p-8 md:pl-20">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex items-center justify-between mb-8"
            >
              <div>
                <h1 className="text-4xl font-bold text-violet-100 flex items-center gap-3">
                  <Sparkles className="h-10 w-10 text-violet-400 animate-pulse" />
                  My Quizzes
                </h1>
                <p className="text-violet-300/80 mt-2 text-lg">Manage and take your generated quizzes</p>
              </div>
            </motion.div>

            {/* Search and Filter */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="flex flex-col sm:flex-row gap-4 mb-8"
            >
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-5 w-5 text-violet-400" />
                <Input 
                  type="search" 
                  placeholder="Search quizzes..." 
                  className="pl-10 py-6 bg-violet-950/50 border-violet-500/20 text-violet-100 placeholder:text-violet-400/50 focus:ring-2 focus:ring-violet-500/50 transition-all duration-300"
                />
              </div>
              <Button 
                variant="outline" 
                className="flex gap-2 border-violet-500/20 text-violet-300 hover:bg-violet-500/10 hover:text-violet-200 py-6 px-6 transition-all duration-300"
              >
                <Filter className="h-5 w-5" /> Filter
              </Button>
            </motion.div>

            {/* Tabs */}
            <Tabs defaultValue="all" className="mb-8">
              <TabsList className="bg-violet-950/50 border border-violet-500/20 p-1">
                <TabsTrigger 
                  value="all"
                  className="data-[state=active]:bg-violet-500/20 data-[state=active]:text-violet-100 rounded-md px-6 py-2 transition-all duration-300"
                >
                  All Quizzes
                </TabsTrigger>
                <TabsTrigger 
                  value="not-started"
                  className="data-[state=active]:bg-violet-500/20 data-[state=active]:text-violet-100 rounded-md px-6 py-2 transition-all duration-300"
                >
                  Not Started
                </TabsTrigger>
                <TabsTrigger 
                  value="in-progress"
                  className="data-[state=active]:bg-violet-500/20 data-[state=active]:text-violet-100 rounded-md px-6 py-2 transition-all duration-300"
                >
                  In Progress
                </TabsTrigger>
                <TabsTrigger 
                  value="completed"
                  className="data-[state=active]:bg-violet-500/20 data-[state=active]:text-violet-100 rounded-md px-6 py-2 transition-all duration-300"
                >
                  Completed
                </TabsTrigger>
              </TabsList>

              <TabsContent value="all">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {quizzes.map((quiz, index) => (
                    <motion.div
                      key={quiz.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      <Card 
                        className="bg-[#0E0529]/80 border-violet-500/30 overflow-hidden hover:border-violet-500/50 transition-all duration-300 shadow-lg shadow-violet-500/10 hover:shadow-xl hover:shadow-violet-500/20 h-[420px] flex flex-col"
                      >
                        <CardHeader className="pb-3 flex-none">
                          <div className="flex justify-between items-start">
                            <CardTitle className="text-xl font-bold text-violet-100 line-clamp-2">{quiz.title}</CardTitle>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button 
                                  variant="ghost" 
                                  size="icon"
                                  className="text-violet-400 hover:text-violet-300 hover:bg-violet-500/10 transition-colors duration-300"
                                >
                                  <MoreVertical className="h-4 w-4" />
                                  <span className="sr-only">Actions</span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="bg-violet-950 border-violet-500/20">
                                <DropdownMenuItem className="text-violet-200 hover:text-violet-100 hover:bg-violet-500/10 transition-colors duration-300">
                                  <Link href={`/quizzes/${quiz.id}`} className="flex w-full">
                                    View Details
                                  </Link>
                                </DropdownMenuItem>
                                {quiz.status === "completed" && (
                                  <DropdownMenuItem className="text-violet-200 hover:text-violet-100 hover:bg-violet-500/10 transition-colors duration-300">
                                    <Link href={`/quizzes/${quiz.id}/results`} className="flex w-full">
                                      View Results
                                    </Link>
                                  </DropdownMenuItem>
                                )}
                                {quiz.status !== "completed" && (
                                  <DropdownMenuItem className="text-violet-200 hover:text-violet-100 hover:bg-violet-500/10 transition-colors duration-300">
                                    <Link href={`/quizzes/${quiz.id}/take`} className="flex w-full">
                                      Take Quiz
                                    </Link>
                                  </DropdownMenuItem>
                                )}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                          <CardDescription className="text-violet-200/90 line-clamp-2">{quiz.description}</CardDescription>
                        </CardHeader>
                        <CardContent className="flex-1 flex flex-col">
                          <div className="flex flex-wrap gap-2 mb-4">
                            <Badge className="bg-violet-500/20 text-violet-200 border-violet-500/30">
                              Source: {quiz.source}
                            </Badge>
                            <Badge className="bg-violet-500/20 text-violet-200 border-violet-500/30">
                              {quiz.questionCount} questions
                            </Badge>
                          </div>

                          {quiz.status === "not-started" && (
                            <div className="flex items-center text-sm text-violet-300/80 mb-4">
                              <Clock className="mr-1 h-4 w-4" />
                              <span>Not started</span>
                            </div>
                          )}

                          {quiz.status === "in-progress" && (
                            <div className="space-y-2 mb-4">
                              <div className="flex items-center justify-between text-sm text-violet-300/80">
                                <span>Progress</span>
                                <span>{quiz.progress}%</span>
                              </div>
                              <Progress value={quiz.progress} className="h-2 bg-violet-950/50" />
                            </div>
                          )}

                          {quiz.status === "completed" && (
                            <div className="flex items-center text-sm mb-4">
                              <CheckCircle className="mr-1 h-4 w-4 text-violet-400" />
                              <span className="font-medium text-violet-200">Score: {quiz.score}%</span>
                            </div>
                          )}

                          <div className="flex flex-wrap gap-2 mt-auto">
                            {quiz.tags.map((tag) => (
                              <Badge 
                                key={tag} 
                                variant="secondary"
                                className="bg-violet-500/10 text-violet-300 border-violet-500/20"
                              >
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </CardContent>
                        <CardFooter className="pt-3 border-t border-violet-500/20 flex-none">
                          {quiz.status === "not-started" && (
                            <Button className="w-full bg-violet-600 hover:bg-violet-500 transition-colors duration-300" asChild>
                              <Link href={`/quizzes/${quiz.id}/take`}>
                                <Play className="mr-2 h-4 w-4" /> Start Quiz
                              </Link>
                            </Button>
                          )}

                          {quiz.status === "in-progress" && (
                            <Button className="w-full bg-violet-600 hover:bg-violet-500 transition-colors duration-300" asChild>
                              <Link href={`/quizzes/${quiz.id}/take`}>
                                <Play className="mr-2 h-4 w-4" /> Continue Quiz
                              </Link>
                            </Button>
                          )}

                          {quiz.status === "completed" && (
                            <Button 
                              variant="outline" 
                              className="w-full border-violet-500/40 text-black bg-white hover:bg-violet-50 hover:text-black hover:border-violet-500/60 transition-colors duration-300" 
                              asChild
                            >
                              <Link href={`/quizzes/${quiz.id}/results`}>
                                <BarChart className="mr-2 h-4 w-4" /> View Results
                              </Link>
                            </Button>
                          )}
                        </CardFooter>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="not-started">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {quizzes
                    .filter((quiz) => quiz.status === "not-started")
                    .map((quiz, index) => (
                      <motion.div
                        key={quiz.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                      >
                        <Card 
                          className="bg-[#0E0529]/80 border-violet-500/30 overflow-hidden hover:border-violet-500/50 transition-all duration-300 shadow-lg shadow-violet-500/10 hover:shadow-xl hover:shadow-violet-500/20 h-[420px] flex flex-col"
                        >
                          <CardHeader className="pb-3 flex-none">
                            <div className="flex justify-between items-start">
                              <CardTitle className="text-xl font-bold text-violet-100 line-clamp-2">{quiz.title}</CardTitle>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button 
                                    variant="ghost" 
                                    size="icon"
                                    className="text-violet-400 hover:text-violet-300 hover:bg-violet-500/10 transition-colors duration-300"
                                  >
                                    <MoreVertical className="h-4 w-4" />
                                    <span className="sr-only">Actions</span>
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="bg-violet-950 border-violet-500/20">
                                  <DropdownMenuItem className="text-violet-200 hover:text-violet-100 hover:bg-violet-500/10 transition-colors duration-300">
                                    <Link href={`/quizzes/${quiz.id}`} className="flex w-full">
                                      View Details
                                    </Link>
                                  </DropdownMenuItem>
                                  <DropdownMenuItem className="text-violet-200 hover:text-violet-100 hover:bg-violet-500/10 transition-colors duration-300">
                                    <Link href={`/quizzes/${quiz.id}/take`} className="flex w-full">
                                      Take Quiz
                                    </Link>
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                            <CardDescription className="text-violet-200/90 line-clamp-2">{quiz.description}</CardDescription>
                          </CardHeader>
                          <CardContent className="flex-1 flex flex-col">
                            <div className="flex flex-wrap gap-2 mb-4">
                              <Badge className="bg-violet-500/20 text-violet-200 border-violet-500/30">
                                Source: {quiz.source}
                              </Badge>
                              <Badge className="bg-violet-500/20 text-violet-200 border-violet-500/30">
                                {quiz.questionCount} questions
                              </Badge>
                            </div>

                            <div className="flex items-center text-sm text-violet-300/80 mb-4">
                              <Clock className="mr-1 h-4 w-4" />
                              <span>Not started</span>
                            </div>

                            <div className="flex flex-wrap gap-2 mt-auto">
                              {quiz.tags.map((tag) => (
                                <Badge 
                                  key={tag} 
                                  variant="secondary"
                                  className="bg-violet-500/10 text-violet-300 border-violet-500/20"
                                >
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </CardContent>
                          <CardFooter className="pt-3 border-t border-violet-500/20 flex-none">
                            <Button className="w-full bg-violet-600 hover:bg-violet-500 transition-colors duration-300" asChild>
                              <Link href={`/quizzes/${quiz.id}/take`}>
                                <Play className="mr-2 h-4 w-4" /> Start Quiz
                              </Link>
                            </Button>
                          </CardFooter>
                        </Card>
                      </motion.div>
                    ))}
                </div>
              </TabsContent>
              <TabsContent value="in-progress">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {quizzes
                    .filter((quiz) => quiz.status === "in-progress")
                    .map((quiz, index) => (
                      <motion.div
                        key={quiz.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                      >
                        <Card 
                          className="bg-[#0E0529]/80 border-violet-500/30 overflow-hidden hover:border-violet-500/50 transition-all duration-300 shadow-lg shadow-violet-500/10 hover:shadow-xl hover:shadow-violet-500/20 h-[420px] flex flex-col"
                        >
                          <CardHeader className="pb-3 flex-none">
                            <div className="flex justify-between items-start">
                              <CardTitle className="text-xl font-bold text-violet-100 line-clamp-2">{quiz.title}</CardTitle>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button 
                                    variant="ghost" 
                                    size="icon"
                                    className="text-violet-400 hover:text-violet-300 hover:bg-violet-500/10 transition-colors duration-300"
                                  >
                                    <MoreVertical className="h-4 w-4" />
                                    <span className="sr-only">Actions</span>
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="bg-violet-950 border-violet-500/20">
                                  <DropdownMenuItem className="text-violet-200 hover:text-violet-100 hover:bg-violet-500/10 transition-colors duration-300">
                                    <Link href={`/quizzes/${quiz.id}`} className="flex w-full">
                                      View Details
                                    </Link>
                                  </DropdownMenuItem>
                                  <DropdownMenuItem className="text-violet-200 hover:text-violet-100 hover:bg-violet-500/10 transition-colors duration-300">
                                    <Link href={`/quizzes/${quiz.id}/take`} className="flex w-full">
                                      Continue Quiz
                                    </Link>
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                            <CardDescription className="text-violet-200/90 line-clamp-2">{quiz.description}</CardDescription>
                          </CardHeader>
                          <CardContent className="flex-1 flex flex-col">
                            <div className="flex flex-wrap gap-2 mb-4">
                              <Badge className="bg-violet-500/20 text-violet-200 border-violet-500/30">
                                Source: {quiz.source}
                              </Badge>
                              <Badge className="bg-violet-500/20 text-violet-200 border-violet-500/30">
                                {quiz.questionCount} questions
                              </Badge>
                            </div>

                            <div className="space-y-2 mb-4">
                              <div className="flex items-center justify-between text-sm text-violet-300/80">
                                <span>Progress</span>
                                <span>{quiz.progress}%</span>
                              </div>
                              <Progress value={quiz.progress} className="h-2 bg-violet-950/50" />
                            </div>

                            <div className="flex flex-wrap gap-2 mt-auto">
                              {quiz.tags.map((tag) => (
                                <Badge 
                                  key={tag} 
                                  variant="secondary"
                                  className="bg-violet-500/10 text-violet-300 border-violet-500/20"
                                >
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </CardContent>
                          <CardFooter className="pt-3 border-t border-violet-500/20 flex-none">
                            <Button className="w-full bg-violet-600 hover:bg-violet-500 transition-colors duration-300" asChild>
                              <Link href={`/quizzes/${quiz.id}/take`}>
                                <Play className="mr-2 h-4 w-4" /> Continue Quiz
                              </Link>
                            </Button>
                          </CardFooter>
                        </Card>
                      </motion.div>
                    ))}
                </div>
              </TabsContent>
              <TabsContent value="completed">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {quizzes
                    .filter((quiz) => quiz.status === "completed")
                    .map((quiz, index) => (
                      <motion.div
                        key={quiz.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                      >
                        <Card 
                          className="bg-[#0E0529]/80 border-violet-500/30 overflow-hidden hover:border-violet-500/50 transition-all duration-300 shadow-lg shadow-violet-500/10 hover:shadow-xl hover:shadow-violet-500/20 h-[420px] flex flex-col"
                        >
                          <CardHeader className="pb-3 flex-none">
                            <div className="flex justify-between items-start">
                              <CardTitle className="text-xl font-bold text-violet-100 line-clamp-2">{quiz.title}</CardTitle>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button 
                                    variant="ghost" 
                                    size="icon"
                                    className="text-violet-400 hover:text-violet-300 hover:bg-violet-500/10 transition-colors duration-300"
                                  >
                                    <MoreVertical className="h-4 w-4" />
                                    <span className="sr-only">Actions</span>
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="bg-violet-950 border-violet-500/20">
                                  <DropdownMenuItem className="text-violet-200 hover:text-violet-100 hover:bg-violet-500/10 transition-colors duration-300">
                                    <Link href={`/quizzes/${quiz.id}`} className="flex w-full">
                                      View Details
                                    </Link>
                                  </DropdownMenuItem>
                                  <DropdownMenuItem className="text-violet-200 hover:text-violet-100 hover:bg-violet-500/10 transition-colors duration-300">
                                    <Link href={`/quizzes/${quiz.id}/results`} className="flex w-full">
                                      View Results
                                    </Link>
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                            <CardDescription className="text-violet-200/90 line-clamp-2">{quiz.description}</CardDescription>
                          </CardHeader>
                          <CardContent className="flex-1 flex flex-col">
                            <div className="flex flex-wrap gap-2 mb-4">
                              <Badge className="bg-violet-500/20 text-violet-200 border-violet-500/30">
                                Source: {quiz.source}
                              </Badge>
                              <Badge className="bg-violet-500/20 text-violet-200 border-violet-500/30">
                                {quiz.questionCount} questions
                              </Badge>
                            </div>

                            <div className="flex items-center text-sm mb-4">
                              <CheckCircle className="mr-1 h-4 w-4 text-violet-400" />
                              <span className="font-medium text-violet-200">Score: {quiz.score}%</span>
                            </div>

                            <div className="flex flex-wrap gap-2 mt-auto">
                              {quiz.tags.map((tag) => (
                                <Badge 
                                  key={tag} 
                                  variant="secondary"
                                  className="bg-violet-500/10 text-violet-300 border-violet-500/20"
                                >
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </CardContent>
                          <CardFooter className="pt-3 border-t border-violet-500/20 flex-none">
                            <Button 
                              variant="outline" 
                              className="w-full border-violet-500/40 text-black bg-white hover:bg-violet-50 hover:text-black hover:border-violet-500/60 transition-colors duration-300" 
                              asChild
                            >
                              <Link href={`/quizzes/${quiz.id}/results`}>
                                <BarChart className="mr-2 h-4 w-4" /> View Results
                              </Link>
                            </Button>
                          </CardFooter>
                        </Card>
                      </motion.div>
                    ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}
