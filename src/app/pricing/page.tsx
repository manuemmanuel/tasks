"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Check, Sparkles } from "lucide-react"
import { Toaster, toast } from "sonner"
import Sidebar from "@/components/Sidebar"
import { motion } from "framer-motion"

interface PricingFeature {
  name: string;
  included: boolean;
}

interface PricingTier {
  name: string;
  price: string;
  description: string;
  features: PricingFeature[];
  cta: string;
  popular?: boolean;
}

const pricingTiers: PricingTier[] = [
  {
    name: "Free",
    price: "$0",
    description: "Perfect for getting started with task management",
    features: [
      { name: "Basic task management", included: true },
      { name: "Up to 5 projects", included: true },
      { name: "Basic AI assistance", included: true },
      { name: "Community support", included: true },
      { name: "Basic analytics", included: false },
      { name: "Advanced AI features", included: false },
      { name: "Priority support", included: false },
      { name: "Custom integrations", included: false },
    ],
    cta: "Get Started",
  },
  {
    name: "Pro",
    price: "$9.99",
    description: "For professionals who need more power",
    popular: true,
    features: [
      { name: "Basic task management", included: true },
      { name: "Unlimited projects", included: true },
      { name: "Advanced AI assistance", included: true },
      { name: "Priority support", included: true },
      { name: "Advanced analytics", included: true },
      { name: "Advanced AI features", included: true },
      { name: "Priority support", included: true },
      { name: "Custom integrations", included: false },
    ],
    cta: "Start Pro Trial",
  },
  {
    name: "Enterprise",
    price: "Custom",
    description: "For large teams and organizations",
    features: [
      { name: "Basic task management", included: true },
      { name: "Unlimited projects", included: true },
      { name: "Advanced AI assistance", included: true },
      { name: "24/7 dedicated support", included: true },
      { name: "Advanced analytics", included: true },
      { name: "Advanced AI features", included: true },
      { name: "Priority support", included: true },
      { name: "Custom integrations", included: true },
    ],
    cta: "Contact Sales",
  },
]

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

export default function PricingPage() {
  const [selectedTier, setSelectedTier] = useState<string | null>(null)

  const handleSubscribe = (tier: string) => {
    toast.success(`Starting subscription process for ${tier} tier`)
    // Add your subscription logic here
  }

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col min-h-screen bg-[#030014] overflow-x-hidden">
        <div className="p-4 sm:p-6 md:p-8 md:pl-20">
          <Toaster richColors position="top-center" />

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6 sm:mb-8 md:mb-12"
          >
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-violet-50 text-center sm:text-left">
              Simple, transparent pricing
            </h1>
            <p className="text-sm sm:text-base md:text-lg text-violet-200/90 mt-2 sm:mt-3 text-center sm:text-left">
              Choose the perfect plan for your needs
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
            {pricingTiers.map((tier, index) => (
              <motion.div
                key={tier.name}
                variants={item}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <Card
                  className={`relative bg-violet-950/50 backdrop-blur-sm border-violet-500/20 transition-all duration-300 hover:border-violet-500/40 ${
                    tier.popular ? 'border-violet-500 shadow-lg shadow-violet-500/20' : ''
                  }`}
                >
                  {tier.popular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                      <span className="bg-violet-500 text-white text-xs font-semibold px-4 py-1.5 rounded-full flex items-center gap-1">
                        <Sparkles className="h-3 w-3" />
            Most Popular
                      </span>
          </div>
                  )}
                  <CardHeader className="space-y-3 sm:space-y-4">
                    <CardTitle className="text-xl sm:text-2xl text-violet-50">{tier.name}</CardTitle>
                    <div className="mt-2">
                      <span className="text-3xl sm:text-4xl font-bold text-violet-400">{tier.price}</span>
                      {tier.price !== "Custom" && <span className="text-violet-300/70 text-base sm:text-lg">/month</span>}
          </div>
                    <CardDescription className="text-sm sm:text-base text-violet-200/90">
                      {tier.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3 sm:space-y-4">
                      {tier.features.map((feature) => (
                        <li key={feature.name} className="flex items-center gap-3">
                          {feature.included ? (
                            <Check className="h-4 w-4 sm:h-5 sm:w-5 text-violet-400" />
                          ) : (
                            <span className="h-4 w-4 sm:h-5 sm:w-5 text-violet-300/30">×</span>
                          )}
                          <span className={`text-sm sm:text-base ${feature.included ? 'text-violet-200' : 'text-violet-300/50'}`}>
                            {feature.name}
                          </span>
            </li>
                      ))}
          </ul>
                  </CardContent>
                  <CardFooter>
                    <Button
                      className={`w-full text-sm sm:text-base transition-all duration-300 ${
                        tier.popular
                          ? 'bg-violet-500 hover:bg-violet-600'
                          : 'bg-violet-900/50 hover:bg-violet-900/70'
                      }`}
                      onClick={() => handleSubscribe(tier.name)}
                    >
                      {tier.cta}
          </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-8 sm:mt-12 text-center max-w-2xl mx-auto"
          >
            <p className="text-sm sm:text-base text-violet-200/70">
              All plans include a 14-day free trial. No credit card required.
            </p>
            <p className="text-sm sm:text-base text-violet-200/70 mt-3">
              Need a custom plan? <Button variant="link" className="text-violet-400 hover:text-violet-300 text-sm sm:text-base">Contact us</Button>
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  )
}