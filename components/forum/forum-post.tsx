'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { useToast } from '@/hooks/use-toast'
import { 
  MessageSquare, 
  ThumbsUp, 
  Reply, 
  Send, 
  CheckCircle,
  Clock,
  User
} from 'lucide-react'
import { format } from 'date-fns'

const replySchema = z.object({
  content: z.string().min(5, 'Reply must be at least 5 characters'),
})

type ReplyFormData = z.infer<typeof replySchema>

interface ForumPostProps {
  post: {
    id: string
    title: string
    content: string
    category: string
    isResolved: boolean
    upvotes: number
    createdAt: string
    authorName: string
    authorEmail: string
    replyCount: number
  }
  currentUserId?: string
}

export function ForumPost({ post, currentUserId }: ForumPostProps) {
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const [showReplyForm, setShowReplyForm] = useState(false)

  const form = useForm<ReplyFormData>({
    resolver: zodResolver(replySchema),
  })

  const { data: repliesData } = useQuery({
    queryKey: ['forum-replies', post.id],
    queryFn: async () => {
      const response = await fetch(`/api/forum/posts/${post.id}/replies`)
      if (!response.ok) throw new Error('Failed to fetch replies')
      return response.json()
    },
  })

  const submitReply = useMutation({
    mutationFn: async (data: ReplyFormData) => {
      const response = await fetch(`/api/forum/posts/${post.id}/replies`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          leadId: currentUserId,
        }),
      })
      if (!response.ok) throw new Error('Failed to submit reply')
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['forum-replies', post.id] })
      form.reset()
      setShowReplyForm(false)
      toast({
        title: 'Reply posted!',
        description: 'Your reply has been added to the discussion.',
      })
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to post reply. Please try again.',
        variant: 'destructive',
      })
    },
  })

  const onSubmitReply = (data: ReplyFormData) => {
    submitReply.mutate(data)
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'technical': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
      case 'showcase': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300'
    }
  }

  const replies = repliesData?.replies || []

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="border-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl shadow-lg hover:shadow-xl transition-all duration-300">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-3">
                <Badge className={getCategoryColor(post.category)}>
                  {post.category}
                </Badge>
                {post.isResolved && (
                  <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Resolved
                  </Badge>
                )}
              </div>
              <CardTitle className="text-xl text-gray-900 dark:text-white mb-2">
                {post.title}
              </CardTitle>
              <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center">
                  <User className="w-4 h-4 mr-1" />
                  <span>{post.authorName}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  <span>{format(new Date(post.createdAt), 'MMM dd, yyyy')}</span>
                </div>
                <div className="flex items-center">
                  <MessageSquare className="w-4 h-4 mr-1" />
                  <span>{post.replyCount} replies</span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm">
                <ThumbsUp className="w-4 h-4 mr-1" />
                {post.upvotes}
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="space-y-6">
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              {post.content}
            </p>

            {/* Replies Section */}
            {replies.length > 0 && (
              <div className="space-y-4 border-t border-gray-200 dark:border-gray-700 pt-6">
                <h4 className="font-semibold text-gray-900 dark:text-white flex items-center">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Replies ({replies.length})
                </h4>
                
                <div className="space-y-4">
                  {replies.map((reply: any) => (
                    <div key={reply.id} className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4">
                      <div className="flex items-start space-x-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white text-sm">
                            {reply.authorName?.split(' ').map((n: string) => n[0]).join('') || 'U'}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <span className="font-medium text-gray-900 dark:text-white text-sm">
                              {reply.authorName}
                            </span>
                            <span className="text-xs text-gray-500">
                              {format(new Date(reply.createdAt), 'MMM dd, HH:mm')}
                            </span>
                          </div>
                          <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                            {reply.content}
                          </p>
                          <div className="flex items-center space-x-2 mt-2">
                            <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                              <ThumbsUp className="w-3 h-3 mr-1" />
                              {reply.upvotes}
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Reply Form */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
              {!showReplyForm ? (
                <Button 
                  onClick={() => setShowReplyForm(true)}
                  variant="outline"
                  className="w-full"
                >
                  <Reply className="w-4 h-4 mr-2" />
                  Reply to this post
                </Button>
              ) : (
                <form onSubmit={form.handleSubmit(onSubmitReply)} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="reply-content">Your Reply</Label>
                    <Textarea
                      id="reply-content"
                      {...form.register('content')}
                      placeholder="Share your thoughts or help solve this question..."
                      rows={4}
                      className="bg-gray-50 dark:bg-gray-800"
                    />
                    {form.formState.errors.content && (
                      <p className="text-sm text-red-500">{form.formState.errors.content.message}</p>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Button
                      type="submit"
                      disabled={submitReply.isPending}
                      className="bg-gradient-to-r from-blue-500 to-purple-500"
                    >
                      {submitReply.isPending ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Posting...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4 mr-2" />
                          Post Reply
                        </>
                      )}
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => setShowReplyForm(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}