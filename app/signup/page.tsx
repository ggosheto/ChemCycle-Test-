"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth"
import { auth } from "@/firebase"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { UserPlus, Mail, Lock, User, Eye, EyeOff, Leaf, Check } from "lucide-react"
import Link from "next/link"

export default function SignUpPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [agreedToTerms, setAgreedToTerms] = useState(false)

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    setError("")
  }

  const validatePassword = (password: string) => {
    const requirements = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password),
    }
    return requirements
  }

  const passwordRequirements = validatePassword(formData.password)
  const isPasswordValid = Object.values(passwordRequirements).every(Boolean)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.email ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      setError("Моля, попълнете всички полета")
      setIsLoading(false)
      return
    }
    if (!formData.email.includes("@")) {
      setError("Моля, въведете валиден имейл адрес")
      setIsLoading(false)
      return
    }
    if (!isPasswordValid) {
      setError("Паролата не отговаря на изискванията")
      setIsLoading(false)
      return
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Паролите не съвпадат")
      setIsLoading(false)
      return
    }
    if (!agreedToTerms) {
      setError("Моля, приемете Общите условия и Политиката за поверителност")
      setIsLoading(false)
      return
    }
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password)
      // Optionally store user info in localStorage
      localStorage.setItem("chemcycle_user", JSON.stringify({
        email: userCredential.user.email,
        uid: userCredential.user.uid,
        firstName: formData.firstName,
        lastName: formData.lastName,
        signupTime: new Date().toISOString(),
      }))
      setIsLoading(false)
      router.push("/")
    } catch (err: any) {
      setError(err.message || "Неуспешна регистрация")
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <Header />

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-full mb-6">
              <UserPlus className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Присъединете се към Chemcycle</h1>
            <p className="text-gray-600">Създайте своя акаунт и започнете да правите разлика</p>
          </div>

          {/* Signup Form */}
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold text-gray-800">Регистрация</CardTitle>
              <CardDescription>Създайте безплатен акаунт, за да започнете</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <Alert className="border-red-200 bg-red-50">
                    <AlertDescription className="text-red-600">{error}</AlertDescription>
                  </Alert>
                )}

                {/* Name Fields */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="flex items-center gap-2 text-gray-700 font-medium">
                      <User className="w-4 h-4 text-green-500" />
                      Име
                    </Label>
                    <Input
                      id="firstName"
                      type="text"
                      placeholder="Иван"
                      value={formData.firstName}
                      onChange={(e) => handleInputChange("firstName", e.target.value)}
                      className="border-gray-300 focus:border-green-500"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="flex items-center gap-2 text-gray-700 font-medium">
                      <User className="w-4 h-4 text-green-500" />
                      Фамилия
                    </Label>
                    <Input
                      id="lastName"
                      type="text"
                      placeholder="Димитров"
                      value={formData.lastName}
                      onChange={(e) => handleInputChange("lastName", e.target.value)}
                      className="border-gray-300 focus:border-green-500"
                      required
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="flex items-center gap-2 text-gray-700 font-medium">
                    <Mail className="w-4 h-4 text-blue-500" />
                    Имейл адрес
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="ivan.dimitrov@example.com"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className="border-gray-300 focus:border-green-500"
                    required
                  />
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <Label htmlFor="password" className="flex items-center gap-2 text-gray-700 font-medium">
                    <Lock className="w-4 h-4 text-purple-500" />
                    Парола
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Създайте силна парола"
                      value={formData.password}
                      onChange={(e) => handleInputChange("password", e.target.value)}
                      className="border-gray-300 focus:border-green-500 pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>

                  {/* Password Requirements */}
                  {formData.password && (
                    <div className="mt-2 space-y-1">
                      <div className="text-xs text-gray-600 mb-1">Изисквания за паролата:</div>
                      <div className="space-y-1">
                        <div
                          className={`flex items-center gap-2 text-xs ${passwordRequirements.length ? "text-green-600" : "text-gray-400"}`}
                        >
                          <Check
                            className={`w-3 h-3 ${passwordRequirements.length ? "text-green-600" : "text-gray-400"}`}
                          />
                          Най-малко 8 символа
                        </div>
                        <div
                          className={`flex items-center gap-2 text-xs ${passwordRequirements.uppercase ? "text-green-600" : "text-gray-400"}`}
                        >
                          <Check
                            className={`w-3 h-3 ${passwordRequirements.uppercase ? "text-green-600" : "text-gray-400"}`}
                          />
                          Една главна буква
                        </div>
                        <div
                          className={`flex items-center gap-2 text-xs ${passwordRequirements.lowercase ? "text-green-600" : "text-gray-400"}`}
                        >
                          <Check
                            className={`w-3 h-3 ${passwordRequirements.lowercase ? "text-green-600" : "text-gray-400"}`}
                          />
                          Една малка буква
                        </div>
                        <div
                          className={`flex items-center gap-2 text-xs ${passwordRequirements.number ? "text-green-600" : "text-gray-400"}`}
                        >
                          <Check
                            className={`w-3 h-3 ${passwordRequirements.number ? "text-green-600" : "text-gray-400"}`}
                          />
                          Едно число
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Confirm Password */}
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-gray-700 font-medium">
                    Потвърдете паролата
                  </Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Потвърдете паролата си"
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                      className="border-gray-300 focus:border-green-500 pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                    <p className="text-xs text-red-600">Паролите не съвпадат</p>
                  )}
                </div>

                {/* Terms Agreement */}
                <div className="flex items-start space-x-2">
                  <input
                    type="checkbox"
                    id="terms"
                    checked={agreedToTerms}
                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                    className="mt-1 rounded border-gray-300 text-green-600 focus:ring-green-500"
                  />
                  <label htmlFor="terms" className="text-sm text-gray-600 leading-relaxed">
                    Съгласен съм с{" "}
                    <Link href="/terms" className="text-green-600 hover:text-green-700 font-medium">
                      Общите условия
                    </Link>{" "}
                    и{" "}
                    <Link href="/privacy" className="text-green-600 hover:text-green-700 font-medium">
                      Политиката за поверителност
                    </Link>
                  </label>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={isLoading || !isPasswordValid || !agreedToTerms}
                  className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-lg py-3 disabled:opacity-50"
                >
                  {isLoading ? "Създаване на акаунт..." : "Регистрирай се"}
                </Button>
              </form>

              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Или се регистрирайте с</span>
                </div>
              </div>

              {/* Social Signup */}
              <div className="grid grid-cols-1 gap-3">
                <Button
                  variant="outline"
                  className="border-gray-300 hover:bg-gray-50 flex items-center justify-center gap-2"
                  type="button"
                  onClick={async () => {
                    setIsLoading(true)
                    setError("")
                    try {
                      const provider = new GoogleAuthProvider()
                      const result = await signInWithPopup(auth, provider)
                      localStorage.setItem("chemcycle_user", JSON.stringify({
                        email: result.user.email,
                        uid: result.user.uid,
                        signupTime: new Date().toISOString(),
                      }))
                      setIsLoading(false)
                      router.push("/")
                    } catch (err: any) {
                      setError(err.message || "Неуспешна регистрация с Google")
                      setIsLoading(false)
                    }
                  }}
                >
                  <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="currentColor"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Google
                </Button>
              </div>

              {/* Login Link */}
              <div className="text-center mt-6">
                <p className="text-gray-600">
                  Вече имате акаунт?{" "}
                  <Link href="/login" className="text-green-600 hover:text-green-700 font-medium">
                    Вход
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Demo Notice 
          <Card className="mt-6 bg-gradient-to-r from-green-100 to-blue-100 border-0">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Leaf className="w-5 h-5 text-green-600" />
                <div>
                  <p className="text-sm font-medium text-gray-800">Demo Mode</p>
                  <p className="text-xs text-gray-600">Account creation is simulated for demonstration</p>
                </div>
              </div>
            </CardContent>
          </Card>*/}
        </div>
      </div>

      <Footer />
    </div>
  )
}
