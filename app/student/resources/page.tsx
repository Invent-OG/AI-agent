"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  FileText,
  Download,
  ArrowLeft,
  Search,
  Video,
  Link as LinkIcon,
  BookOpen,
  Code,
  Zap,
  Settings,
  ExternalLink,
  Star,
  Clock,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

const resources = [
  {
    id: 1,
    title: "Zapier Automation Templates",
    description: "50+ ready-to-use Zapier workflows for common business processes",
    type: "template",
    category: "zapier",
    downloadUrl: "#",
    rating: 4.9,
    downloads: 1250,
  },
  {
    id: 2,
    title: "n8n Workflow Collection",
    description: "Advanced n8n workflows with custom nodes and complex logic",
    type: "template",
    category: "n8n",
    downloadUrl: "#",
    rating: 4.8,
    downloads: 890,
  },
  {
    id: 3,
    title: "Make.com Scenario Library",
    description: "Enterprise-grade Make.com scenarios for various industries",
    type: "template",
    category: "make",
    downloadUrl: "#",
    rating: 4.7,
    downloads: 670,
  },
  {
    id: 4,
    title: "Automation Best Practices Guide",
    description: "Comprehensive guide on automation strategy and implementation",
    type: "guide",
    category: "general",
    downloadUrl: "#",
    rating: 5.0,
    downloads: 2100,
  },
  {
    id: 5,
    title: "API Integration Masterclass",
    description: "Video series on connecting APIs with automation tools",
    type: "video",
    category: "advanced",
    downloadUrl: "#",
    rating: 4.9,
    downloads: 1560,
  },
  {
    id: 6,
    title: "Business Process Automation Checklist",
    description: "Step-by-step checklist for identifying automation opportunities",
    type: "checklist",
    category: "strategy",
    downloadUrl: "#",
    rating: 4.6,
    downloads: 980,
  },
];

export default function StudentResourcesPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/student/login');
      } else {
        setUser(user);
      }
    };

    getUser();
  }, [router]);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent"></div>
      </div>
    );
  }

  const filteredResources = resources.filter((resource) => {
    const matchesSearch = resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || resource.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "template": return <Code className="w-5 h-5" />;
      case "guide": return <BookOpen className="w-5 h-5" />;
      case "video": return <Video className="w-5 h-5" />;
      case "checklist": return <FileText className="w-5 h-5" />;
      default: return <FileText className="w-5 h-5" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "template": return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
      case "guide": return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
      case "video": return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300";
      case "checklist": return "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300";
    }
  };

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
                  <FileText className="w-6 h-6 mr-2 text-orange-600" />
                  Learning Resources
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Templates, guides, and tools to accelerate your automation journey
                </p>
              </div>
            </div>
            <Badge variant="outline" className="border-orange-300 text-orange-600">
              {filteredResources.length} Resources
            </Badge>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Search and Filters */}
        <Card className="border-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl shadow-lg mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search resources..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-gray-50 dark:bg-gray-800"
                />
              </div>
              <div className="flex gap-2 flex-wrap">
                {["all", "zapier", "n8n", "make", "general", "advanced", "strategy"].map((category) => (
                  <Button
                    key={category}
                    size="sm"
                    variant={selectedCategory === category ? "default" : "outline"}
                    onClick={() => setSelectedCategory(category)}
                    className={selectedCategory === category ? "bg-blue-600 text-white" : ""}
                  >
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Resources Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResources.map((resource) => (
            <motion.div
              key={resource.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="border-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl shadow-lg hover:shadow-xl transition-all duration-300 group h-full">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${getTypeColor(resource.type)}`}>
                        {getTypeIcon(resource.type)}
                      </div>
                      <div>
                        <Badge className={getTypeColor(resource.type)}>
                          {resource.type}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center text-yellow-500">
                      <Star className="w-4 h-4 mr-1 fill-current" />
                      <span className="text-sm font-medium">{resource.rating}</span>
                    </div>
                  </div>
                  <CardTitle className="text-lg group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {resource.title}
                  </CardTitle>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    {resource.description}
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center">
                        <Download className="w-4 h-4 mr-1" />
                        <span>{resource.downloads} downloads</span>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {resource.category}
                      </Badge>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600">
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </Button>
                      <Button variant="outline" size="sm">
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {filteredResources.length === 0 && (
          <Card className="border-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl shadow-lg">
            <CardContent className="text-center py-12">
              <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                No resources found
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Try adjusting your search terms or category filters
              </p>
              <Button onClick={() => { setSearchTerm(""); setSelectedCategory("all"); }}>
                Clear Filters
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}