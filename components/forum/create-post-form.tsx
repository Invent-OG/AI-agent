'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'
import { Loader2, Send, MessageSquare, X } from 'lucide-react'

const postSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  content: z.string().min(10, 'Content must be at least 10 characters'),
  category: z.enum(['general', 'technical', 'showcase']),
})

type PostFormData = z.infer<typeof postSchema>

interface CreatePostFormProps {
  currentUserId: string
  onClose: () => void
}

export function CreatePostForm({ currentUserId, onClose }: CreatePostFormProps) {
  const { toast } = useToast()
  const queryClient = useQueryClient()

  const form = useForm<PostFormData>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      category: 'general',
    },
  })

  const submitPost = useMutation({
    mutationFn: async (data: PostFormData) => {
      const response = await fetch('/api/forum/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          leadId: currentUserId,
        }),
      })
      if (!response.ok) throw new Error('Failed to create post')
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['forum-posts'] })
      form.reset()
      onClose()
      toast({
        title: 'Post created!',
        description: 'Your post has been published to the community.',
      })
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to create post. Please try again.',
        variant: 'destructive',
      })
    },
  })

  const onSubmit = (data: PostFormData) => {
    submitPost.mutate(data)
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
    >
      <Card className="w-full max-w-2xl border-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl shadow-2xl">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center text-xl">
              <MessageSquare className="w-5 h-5 mr-2 text-blue-600" />
              Create New Post
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select onValueChange={(value) => form.setValue('category', value as any)}>
                <SelectTrigger className="bg-gray-50 dark:bg-gray-800">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="general">General Discussion</SelectItem>
                  <SelectItem value="technical">Technical Help</SelectItem>
                  <SelectItem value="showcase">Success Stories</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                {...form.register('title')}
                placeholder="What's your question or topic?"
                className="bg-gray-50 dark:bg-gray-800"
              />
              {form.formState.errors.title && (
                <p className="text-sm text-red-500">{form.formState.errors.title.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Content</Label>
              <Textarea
                id="content"
                {...form.register('content')}
                placeholder="Describe your question, share your experience, or provide details..."
                rows={6}
                className="bg-gray-50 dark:bg-gray-800"
              />
              {form.formState.errors.content && (
                <p className="text-sm text-red-500">{form.formState.errors.content.message}</p>
              )}
            </div>

            <div className="flex items-center space-x-3 pt-4">
              <Button
                type="submit"
                disabled={submitPost.isPending}
                className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
              >
                {submitPost.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Publishing...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Publish Post
                  </>
                )}
              </Button>
              <Button type="button" variant="ghost" onClick={onClose}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  )
}