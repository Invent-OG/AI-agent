"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import {
  MessageSquare,
  Users,
  TrendingUp,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  Pin,
  Flag,
  CheckCircle,
  XCircle,
  Clock,
  ThumbsUp,
  MessageCircle,
  Star,
  Shield,
  AlertTriangle,
  Send,
  Plus,
} from "lucide-react";
import { format } from "date-fns";

export function CommunityManagement() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedPosts, setSelectedPosts] = useState<string[]>([]);

  const { data: postsData, isLoading } = useQuery({
    queryKey: ["admin-forum-posts", categoryFilter, statusFilter],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (categoryFilter !== "all") params.append("category", categoryFilter);
      if (statusFilter !== "all") params.append("status", statusFilter);
      
      const response = await fetch(`/api/admin/community/posts?${params.toString()}`);
      if (!response.ok) throw new Error("Failed to fetch posts");
      return response.json();
    },
    refetchInterval: 30000,
  });

  const { data: communityStats } = useQuery({
    queryKey: ["community-stats"],
    queryFn: async () => {
      const response = await fetch("/api/admin/community/stats");
      if (!response.ok) throw new Error("Failed to fetch community stats");
      return response.json();
    },
  });

  const moderatePost = useMutation({
    mutationFn: async ({ postId, action }: { postId: string; action: string }) => {
      const response = await fetch(`/api/admin/community/posts/${postId}/moderate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      if (!response.ok) throw new Error("Failed to moderate post");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-forum-posts"] });
      toast({ title: "Post moderated successfully" });
    },
  });

  const sendAnnouncement = useMutation({
    mutationFn: async ({ title, message, category }: { title: string; message: string; category: string }) => {
      const response = await fetch("/api/admin/community/announcements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, message, category }),
      });
      if (!response.ok) throw new Error("Failed to send announcement");
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "Announcement sent successfully" });
    },
  });

  const posts = postsData?.posts || [];
  const stats = communityStats?.stats || {};

  const filteredPosts = posts.filter((post: any) => {
    const matchesSearch = 
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.authorName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const getCategoryBadge = (category: string) => {
    const categoryConfig = {
      general: { color: "bg-blue-100 text-blue-800", label: "General" },
      technical: { color: "bg-purple-100 text-purple-800", label: "Technical" },
      showcase: { color: "bg-green-100 text-green-800", label: "Showcase" },
    };
    const config = categoryConfig[category as keyof typeof categoryConfig] || categoryConfig.general;
    return <Badge className={config.color}>{config.label}</Badge>;
  };

  const getStatusIcon = (isResolved: boolean, upvotes: number) => {
    if (isResolved) return <CheckCircle className="w-4 h-4 text-green-500" />;
    if (upvotes > 10) return <Star className="w-4 h-4 text-yellow-500" />;
    return <Clock className="w-4 h-4 text-gray-500" />;
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Community Management</h1>
          <p className="text-gray-400">Moderate forum posts and manage community</p>
        </div>
        <div className="flex items-center gap-3">
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Send className="w-4 h-4 mr-2" />
                Send Announcement
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-gray-900 border-gray-800">
              <DialogHeader>
                <DialogTitle className="text-white">Send Community Announcement</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label className="text-gray-300">Title</Label>
                  <Input 
                    placeholder="Announcement title"
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                </div>
                <div>
                  <Label className="text-gray-300">Category</Label>
                  <Select>
                    <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general">General</SelectItem>
                      <SelectItem value="technical">Technical</SelectItem>
                      <SelectItem value="showcase">Showcase</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-gray-300">Message</Label>
                  <Textarea 
                    placeholder="Your announcement message..."
                    rows={4}
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                </div>
                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  <Send className="w-4 h-4 mr-2" />
                  Send Announcement
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Community Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Posts</p>
                <p className="text-2xl font-bold text-blue-400">{stats.totalPosts || 0}</p>
              </div>
              <MessageSquare className="w-8 h-8 text-blue-400 opacity-60" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Active Members</p>
                <p className="text-2xl font-bold text-green-400">{stats.activeMembers || 0}</p>
              </div>
              <Users className="w-8 h-8 text-green-400 opacity-60" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Resolved Posts</p>
                <p className="text-2xl font-bold text-purple-400">{stats.resolvedPosts || 0}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-purple-400 opacity-60" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Engagement Rate</p>
                <p className="text-2xl font-bold text-orange-400">{stats.engagementRate || 0}%</p>
              </div>
              <TrendingUp className="w-8 h-8 text-orange-400 opacity-60" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="bg-gray-900 border-gray-800">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search posts, authors, or content..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-gray-800 border-gray-700 text-white"
              />
            </div>
            
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full md:w-48 bg-gray-800 border-gray-700 text-white">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="general">General</SelectItem>
                <SelectItem value="technical">Technical</SelectItem>
                <SelectItem value="showcase">Showcase</SelectItem>
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48 bg-gray-800 border-gray-700 text-white">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Posts</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
                <SelectItem value="unresolved">Unresolved</SelectItem>
                <SelectItem value="flagged">Flagged</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Posts Management */}
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white flex items-center">
              <MessageSquare className="w-5 h-5 mr-2 text-blue-500" />
              Forum Posts ({filteredPosts.length})
            </CardTitle>
            <div className="flex items-center gap-2">
              {selectedPosts.length > 0 && (
                <Button size="sm" variant="outline" className="border-gray-700 text-gray-300">
                  <Shield className="w-4 h-4 mr-2" />
                  Bulk Moderate ({selectedPosts.length})
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="h-[400px] flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredPosts.map((post: any) => (
                <Card key={post.id} className="bg-gray-800 border-gray-700 hover:bg-gray-750 transition-colors">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-3">
                          <input
                            type="checkbox"
                            className="rounded"
                            checked={selectedPosts.includes(post.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedPosts([...selectedPosts, post.id]);
                              } else {
                                setSelectedPosts(selectedPosts.filter(id => id !== post.id));
                              }
                            }}
                          />
                          {getCategoryBadge(post.category)}
                          {post.isResolved && (
                            <Badge className="bg-green-100 text-green-800">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Resolved
                            </Badge>
                          )}
                          {post.isPinned && (
                            <Badge className="bg-yellow-100 text-yellow-800">
                              <Pin className="w-3 h-3 mr-1" />
                              Pinned
                            </Badge>
                          )}
                        </div>
                        
                        <h3 className="text-lg font-semibold text-white mb-2">
                          {post.title}
                        </h3>
                        
                        <p className="text-gray-300 mb-4 line-clamp-2">
                          {post.content}
                        </p>
                        
                        <div className="flex items-center space-x-6 text-sm text-gray-400">
                          <div className="flex items-center">
                            <Users className="w-4 h-4 mr-1" />
                            <span>{post.authorName}</span>
                          </div>
                          <div className="flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            <span>{format(new Date(post.createdAt), "MMM dd, yyyy")}</span>
                          </div>
                          <div className="flex items-center">
                            <ThumbsUp className="w-4 h-4 mr-1" />
                            <span>{post.upvotes}</span>
                          </div>
                          <div className="flex items-center">
                            <MessageCircle className="w-4 h-4 mr-1" />
                            <span>{post.replyCount} replies</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2 ml-4">
                        <Button size="sm" variant="ghost" className="text-gray-400 hover:text-white">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="ghost" className="text-gray-400 hover:text-white">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="text-yellow-400 hover:text-yellow-300"
                          onClick={() => moderatePost.mutate({ postId: post.id, action: "pin" })}
                        >
                          <Pin className="w-4 h-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="text-green-400 hover:text-green-300"
                          onClick={() => moderatePost.mutate({ postId: post.id, action: "resolve" })}
                        >
                          <CheckCircle className="w-4 h-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="text-red-400 hover:text-red-300"
                          onClick={() => moderatePost.mutate({ postId: post.id, action: "flag" })}
                        >
                          <Flag className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              {filteredPosts.length === 0 && (
                <div className="text-center py-12 text-gray-400">
                  <MessageSquare className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-semibold mb-2">No posts found</h3>
                  <p>Try adjusting your search or filters</p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}