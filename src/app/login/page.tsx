"use client"

import { useState } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from "lucide-react"
import { Toaster, toast } from "sonner"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const supabase = createClientComponentClient()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        throw error
      }

      if (data.session) {
        router.push("/social")
        router.refresh()
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to login")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#030014] p-4">
      <Toaster richColors position="top-center" />
      
      <Card className="w-full max-w-md bg-violet-950/50 backdrop-blur-sm border-violet-500/20">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold tracking-tight text-violet-50">
            Welcome back
          </CardTitle>
          <p className="text-sm text-violet-200/90">
            Sign in to your account to continue
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-violet-900/20 border-violet-500/20 text-violet-50 placeholder:text-violet-300/50"
              />
            </div>
            <div className="space-y-2">
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-violet-900/20 border-violet-500/20 text-violet-50 placeholder:text-violet-300/50"
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-violet-500 hover:bg-violet-600"
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Sign In"
              )}
            </Button>
            <div className="text-center">
              <Button
                variant="link"
                className="text-violet-300 hover:text-violet-200"
                onClick={() => router.push("/register")}
              >
                Don't have an account? Sign up
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
} 