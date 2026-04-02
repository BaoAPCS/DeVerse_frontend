'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import {
  Home,
  Bell,
  MessageCircle,
  Bookmark,
  Search,
  LoaderCircle,
} from 'lucide-react'

export default function FeedPage() {
  const router = useRouter()
  const fileRef = useRef<HTMLInputElement>(null)

  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)

  const [query, setQuery] = useState('')
  const [results, setResults] = useState<any[]>([])

  const [requests, setRequests] = useState<any[]>([])
  const [showNoti, setShowNoti] = useState(false)

  const [showMenu, setShowMenu] = useState(false)

  const token =
    typeof window !== 'undefined' ? localStorage.getItem('token') : null

  useEffect(() => {
    if (!token) {
      router.push('/auth/login')
      return
    }

    const fetchMe = async () => {
      const res = await fetch('http://localhost:3000/users/me', {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      setUser(data)
      setLoading(false)
    }

    fetchMe()
    fetchRequests()
  }, [])

  useEffect(() => {
    if (!query) {
      setResults([])
      return
    }

    const timeout = setTimeout(async () => {
      const res = await fetch(
        `http://localhost:3000/users/search?q=${query}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )

      const data = await res.json()
      setResults(Array.isArray(data) ? data : [])
    }, 300)

    return () => clearTimeout(timeout)
  }, [query])

  const fetchRequests = async () => {
    const res = await fetch('http://localhost:3000/users/requests', {
      headers: { Authorization: `Bearer ${token}` },
    })
    const data = await res.json()
    setRequests(Array.isArray(data) ? data : [])
  }

  const addFriend = async (id: string) => {
    await fetch(`http://localhost:3000/users/${id}/add-friend`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    })
    alert('Friend request sent')
  }

  const followUser = async (id: string) => {
    await fetch(`http://localhost:3000/users/${id}/follow`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    })
    alert('Followed')
  }

  const accept = async (id: string) => {
    await fetch(`http://localhost:3000/users/request/${id}/accept`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    })
    fetchRequests()
  }

  const reject = async (id: string) => {
    await fetch(`http://localhost:3000/users/request/${id}/reject`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    })
    fetchRequests()
  }

  const uploadAvatar = async (file: File) => {
    const formData = new FormData()
    formData.append('file', file)

    const res = await fetch(
      'http://localhost:3000/users/upload-avatar',
      {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      }
    )

    const data = await res.json()
    setUser(data)
  }

  const handleFileChange = (e: any) => {
    const file = e.target.files[0]
    if (file) uploadAvatar(file)
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <LoaderCircle className="animate-spin" size={30} />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">

      {/* HEADER */}
      <div className="flex items-center justify-between px-6 py-3 bg-white shadow">

        <h1 className="text-2xl font-bold text-green-600">DeVerse</h1>

        {/* SEARCH */}
        <div className="relative">
          <div className="flex items-center bg-gray-100 px-4 py-2 rounded-full w-80">
            <Search size={18} className="text-gray-500 mr-2" />
            <input
              placeholder="Search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="bg-transparent outline-none w-full text-sm"
            />
          </div>

          {results.length > 0 && (
            <div className="absolute mt-2 w-full bg-white shadow-lg rounded-xl p-2 z-20">
              {results.map((u) => (
                <div
                  key={u._id}
                  className="flex items-center justify-between p-2 hover:bg-gray-100 rounded"
                >
                  <div className="flex gap-2 items-center">
                    <img
                      src={u.avatar || '/avatar.png'}
                      className="h-8 w-8 rounded-full object-cover"
                    />
                    <div>
                      <p className="text-sm font-semibold">{u.name}</p>
                      <p className="text-xs text-gray-500">{u.email}</p>
                    </div>
                  </div>

                  <div className="flex gap-1">
                    <button
                      onClick={() => followUser(u._id)}
                      className="px-2 py-1 text-xs bg-blue-500 text-white rounded cursor-pointer"
                    >
                      Follow
                    </button>

                    <button
                      onClick={() => addFriend(u._id)}
                      className="px-2 py-1 text-xs bg-green-500 text-white rounded cursor-pointer"
                    >
                      Add
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* AVATAR */}
        <div className="relative">
          <img
            src={user?.avatar || '/avatar.png'}
            onClick={() => setShowMenu(!showMenu)}
            className="h-10 w-10 rounded-full object-cover cursor-pointer border"
          />

          {showMenu && (
            <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-xl p-2 z-20">
              <button
                onClick={() => fileRef.current?.click()}
                className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded cursor-pointer"
              >
                Upload Avatar
              </button>

              <button
                onClick={() => {
                  localStorage.removeItem('token')
                  router.push('/auth/login')
                }}
                className="w-full text-left px-3 py-2 text-red-500 hover:bg-gray-100 rounded cursor-pointer"
              >
                Logout
              </button>
            </div>
          )}

          <input type="file" ref={fileRef} hidden onChange={handleFileChange} />
        </div>
      </div>

      {/* MAIN */}
      <div className="grid grid-cols-12 gap-6 px-6 mt-6">

        {/* LEFT */}
        <div className="col-span-3">
          <div className="bg-white p-4 rounded-xl shadow space-y-2">

            <button className="flex items-center gap-3 w-full p-2 hover:bg-gray-100 rounded cursor-pointer">
              <Home size={20} />
              Home
            </button>

            <div className="relative">
              <button
                onClick={() => setShowNoti(!showNoti)}
                className="flex justify-between w-full p-2 hover:bg-gray-100 rounded cursor-pointer"
              >
                <div className="flex gap-3 items-center">
                  <Bell size={20} />
                  Notifications
                </div>

                {requests.length > 0 && (
                  <span className="text-xs bg-red-500 text-white px-2 rounded-full">
                    {requests.length}
                  </span>
                )}
              </button>

              {showNoti && (
                <div className="absolute left-full ml-2 top-0 w-72 bg-white shadow rounded p-3 z-20">
                  {requests.map((r) => (
                    <div
                      key={r._id}
                      className="flex items-center justify-between mb-2 p-2 border rounded"
                    >
                      <div className="flex gap-2 items-center">
                        <img
                          src={r.from?.avatar || '/avatar.png'}
                          className="h-8 w-8 rounded-full"
                        />
                        <div>
                          <p className="text-sm font-semibold">
                            {r.from?.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {r.from?.email}
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-1">
                        <button
                          onClick={() => accept(r._id)}
                          className="px-2 py-1 bg-green-500 text-white text-xs rounded cursor-pointer"
                        >
                          ✓
                        </button>
                        <button
                          onClick={() => reject(r._id)}
                          className="px-2 py-1 bg-red-500 text-white text-xs rounded cursor-pointer"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button className="flex items-center gap-3 w-full p-2 hover:bg-gray-100 rounded cursor-pointer">
              <MessageCircle size={20} />
              Messages
            </button>

            <button className="flex items-center gap-3 w-full p-2 hover:bg-gray-100 rounded cursor-pointer">
              <Bookmark size={20} />
              Bookmarks
            </button>

          </div>
        </div>

        {/* CENTER */}
        <div className="col-span-6">
          <div className="bg-white p-4 rounded-xl shadow">
            <input
              placeholder="What's happening?"
              className="w-full bg-gray-100 rounded-full px-4 py-2"
            />
          </div>
        </div>

        {/* RIGHT */}
        <div className="col-span-3 bg-white p-4 rounded-xl shadow">
          <p className="font-semibold">Who to follow</p>
        </div>

      </div>
    </div>
  )
}