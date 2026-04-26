'use client'
import { LoaderCircle, Lock, Mail, UserRound } from 'lucide-react'
import { ChangeEvent, FormEvent, useState } from 'react'
import Link from 'next/link'

function Signup() {
  const [user, setUser] = useState({ name: '', email: '', password: '' })
  const [errors, setErrors] = useState({ name: '', email: '', password: '' })
  const [loading, setLoading] = useState(false)

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target
    setUser({ ...user, [name]: value })
    setErrors({ ...errors, [name]: '' })
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    let newErrors = { name: '', email: '', password: '' }

    if (!user.name.trim()) newErrors.name = 'Please enter your name.'
    if (!user.email.trim()) newErrors.email = 'Please enter a valid email.'
    if (!user.password.trim()) newErrors.password = 'Password cannot be empty.'

    if (newErrors.name || newErrors.email || newErrors.password) {
        setErrors(newErrors)
        return
    }

    try {
        setLoading(true)

        const res = await fetch('http://localhost:3000/auth/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
        })

        const data = await res.json()

        if (!res.ok) {
        throw new Error(data.message || 'Signup failed')
        }

        // if backend returns token
        if (data.access_token) {
        localStorage.setItem('token', data.access_token)
        }

        alert('Signup successful!')

        // redirect to login
        window.location.href = '/auth/login'

    } catch (err: any) {
        alert(err.message)
    } finally {
        setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md rounded-lg bg-white p-6">
        {/* Logo */}
        <div className="mb-4 flex justify-center">
          <span className="text-3xl font-bold text-yellow-500">⚡</span>
        </div>

        <h2 className="mb-8 text-center text-2xl font-semibold text-gray-800">
          Sign up to DeVerse
        </h2>

        <form onSubmit={handleSubmit}>
          {/* Full Name */}
          <div className="mb-6">
            <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-gray-700">
              Full Name
            </label>
            <div className="relative flex items-center">
              <span className="absolute left-3 text-gray-500">
                <UserRound size={20} />
              </span>
              <input
                id="name"
                type="text"
                name="name"
                placeholder="Enter your full name"
                value={user.name}
                onChange={handleChange}
                className={`w-full rounded-lg border px-4 py-2.5 pl-10 focus:ring-2 focus:ring-blue-200 ${
                  errors.name ? 'border-red-500 ring-red-200' : 'border-gray-300'
                }`}
              />
            </div>
            {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
          </div>

          {/* Email */}
          <div className="mb-6">
            <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-gray-700">
              Email
            </label>
            <div className="relative flex items-center">
              <span className="absolute left-3 text-gray-500">
                <Mail size={20} />
              </span>
              <input
                id="email"
                type="email"
                name="email"
                placeholder="Enter your email"
                value={user.email}
                onChange={handleChange}
                className={`w-full rounded-lg border px-4 py-2.5 pl-10 focus:ring-2 focus:ring-blue-200 ${
                  errors.email ? 'border-red-500 ring-red-200' : 'border-gray-300'
                }`}
              />
            </div>
            {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
          </div>

          {/* Password */}
          <div className="mb-6">
            <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-gray-700">
              Password
            </label>
            <div className="relative flex items-center">
              <span className="absolute left-3 text-gray-500">
                <Lock size={20} />
              </span>
              <input
                id="password"
                type="password"
                name="password"
                placeholder="Enter your password"
                value={user.password}
                onChange={handleChange}
                className={`w-full rounded-lg border px-4 py-2.5 pl-10 focus:ring-2 focus:ring-blue-200 ${
                  errors.password ? 'border-red-500 ring-red-200' : 'border-gray-300'
                }`}
              />
            </div>
            {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="flex h-10 w-full items-center justify-center rounded-lg bg-neutral-800 cursor-pointer text-white hover:bg-neutral-700 disabled:bg-gray-300"
          >
            {loading ? <LoaderCircle className="animate-spin" size={20} /> : 'Create an account'}
          </button>
        </form>

        {/* Login Link */}
        <div className="mt-4 text-center">
          <span className="text-sm text-gray-600">Already have an account? </span>
          <Link
            href="/auth/login"
            className="text-sm font-medium text-blue-600 hover:underline"
          >
            Log in
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Signup