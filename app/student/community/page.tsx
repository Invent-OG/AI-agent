'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ForumPost } from '@/components/forum/forum-post'
import { CreatePostForm } from '@/components/forum/create-post-form'
import { 
  MessageSquare, 
  Search, 
  Filter, 
  Plus,
  Users,
  TrendingUp,
  BookOpen,
  Star,
  ArrowLeft
} from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function CommunityPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [showCreateForm, setShowCreateForm] = useState(false)

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/student/login')
      } else {
        setUser(user)
      }
    }

    getUser()
  }, [router])

  const { data: postsData, isLoading } = useQuery({
    queryKey: ['forum-posts', categoryFilter],
    queryFn: async () => {
      const response = await fetch(`/api/forum/posts?category=${categoryFilter}&limit=20`)
      if (!response.ok) throw new Error('Failed to fetch posts')
      return response.json()
    },
    enabled: !!user,
  })

  const posts = postsData?.posts || []
  const filteredPosts = posts.filter((post: any) =>
    post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.content.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-950 dark:via-blue-950/30 dark:to-indigo-950/30">
      {/* Header */}
      <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-800/50 sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/student/dashboard">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
                  <MessageSquare className="w-6 h-6 mr-2 text-blue-600" />
                  Community Forum
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Connect, learn, and share with fellow automation enthusiasts
                </p>
              </div>
            </div>
            <Button 
              onClick={() => setShowCreateForm(true)}
              className="bg-gradient-to-r from-blue-500 to-purple-500"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Post
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Community Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="border-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl shadow-lg">
            <CardContent className="p-6 text-center">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full w-fit mx-auto mb-4">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">500+</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Active Members</p>
            </CardContent>
          </Card>
          
          <Card className="border-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl shadow-lg">
            <CardContent className="p-6 text-center">
              <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-full w-fit mx-auto mb-4">
                <MessageSquare className="w-6 h-6 text-purple-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{posts.length}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Discussions</p>
            </CardContent>
          </Card>
          
          <Card className="border-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl shadow-lg">
            <CardContent className="p-6 text-center">
              <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-full w-fit mx-auto mb-4">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">95%</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Questions Answered</p>
            </CardContent>
          </Card>
          
          <Card className="border-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl shadow-lg">
            <CardContent className="p-6 text-center">
              <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-full w-fit mx-auto mb-4">
                <Star className="w-6 h-6 text-orange-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">4.9</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Community Rating</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card className="border-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl shadow-lg mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search discussions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-gray-50 dark:bg-gray-800"
                />
              </div>
              
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-full md:w-48 bg-gray-50 dark:bg-gray-800">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="general">General</SelectItem>
                  <SelectItem value="technical">Technical</SelectItem>
                  <SelectItem value="showcase">Showcase</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Posts List */}
        <div className="space-y-6">
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="border-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl shadow-lg">
                  <CardContent className="p-6">
                    <div className="animate-pulse space-y-4">
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                      <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredPosts.length > 0 ? (
            filteredPosts.map((post: any) => (
              <ForumPost key={post.id} post={post} currentUserId={user.id} />
            ))
          ) : (
            <Card className="border-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl shadow-lg">
              <CardContent className="text-center py-12">
                <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  No posts found
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Be the first to start a discussion in this category!
                </p>
                <Button 
                  onClick={() => setShowCreateForm(true)}
                  className="bg-gradient-to-r from-blue-500 to-purple-500"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create First Post
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Create Post Modal */}
      {showCreateForm && (
        <CreatePostForm
          currentUserId={user.id}
          onClose={() => setShowCreateForm(false)}
        />
      )}
    </div>
  )
}