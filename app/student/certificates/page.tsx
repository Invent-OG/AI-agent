"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Award,
  Download,
  Share2,
  ArrowLeft,
  Calendar,
  CheckCircle,
  Star,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { format } from "date-fns";

export default function StudentCertificatesPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

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

  const { data: certificatesData, isLoading } = useQuery({
    queryKey: ['student-certificates', user?.id],
    queryFn: async () => {
      const response = await fetch(`/api/student/certificates?userId=${user?.id}`);
      if (!response.ok) throw new Error('Failed to fetch certificates');
      return response.json();
    },
    enabled: !!user?.id,
  });

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent"></div>
      </div>
    );
  }

  const certificates = certificatesData?.certificates || [];

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
                  <Award className="w-6 h-6 mr-2 text-purple-600" />
                  My Certificates
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Your earned certificates and achievements
                </p>
              </div>
            </div>
            <Badge variant="outline" className="border-purple-300 text-purple-600">
              {certificates.length} Earned
            </Badge>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Certificates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {isLoading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <Card key={i} className="border-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl shadow-lg">
                <CardContent className="p-6">
                  <div className="animate-pulse space-y-4">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                    <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : certificates.length > 0 ? (
            certificates.map((certificate: any) => (
              <motion.div
                key={certificate.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Card className="border-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl shadow-lg hover:shadow-xl transition-all duration-300 group">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl shadow-lg">
                          <Award className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <CardTitle className="text-lg group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                            {certificate.courseName}
                          </CardTitle>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Certificate #{certificate.certificateNumber}
                          </p>
                        </div>
                      </div>
                      <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Verified
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <Label className="text-gray-500 dark:text-gray-400">Student Name</Label>
                          <p className="font-medium text-gray-900 dark:text-white">{certificate.studentName}</p>
                        </div>
                        <div>
                          <Label className="text-gray-500 dark:text-gray-400">Completion Date</Label>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {format(new Date(certificate.completionDate), 'MMM dd, yyyy')}
                          </p>
                        </div>
                      </div>
                      
                      <div>
                        <Label className="text-gray-500 dark:text-gray-400">Issued Date</Label>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {format(new Date(certificate.issuedAt), 'MMMM dd, yyyy')}
                        </p>
                      </div>
                      
                      <div className="flex gap-2 pt-2">
                        <Button className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                          <Download className="w-4 h-4 mr-2" />
                          Download PDF
                        </Button>
                        <Button variant="outline" className="flex-1">
                          <Share2 className="w-4 h-4 mr-2" />
                          Share
                        </Button>
                      </div>
                      
                      <Button variant="outline" className="w-full">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Share on LinkedIn
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          ) : (
            <Card className="border-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl shadow-lg col-span-full">
              <CardContent className="text-center py-12">
                <Award className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  No certificates yet
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Complete courses to earn certificates and showcase your achievements
                </p>
                <Link href="/student/courses">
                  <Button className="bg-gradient-to-r from-purple-500 to-pink-500">
                    <BookOpen className="w-4 h-4 mr-2" />
                    Browse Courses
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Achievement Stats */}
        {certificates.length > 0 && (
          <Card className="border-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl shadow-lg mt-8">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Star className="w-5 h-5 mr-2 text-yellow-600" />
                Achievement Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl">
                  <Award className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-purple-600">{certificates.length}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Certificates Earned</p>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl">
                  <Calendar className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-blue-600">
                    {certificates.length > 0 ? format(new Date(certificates[0].issuedAt), 'MMM yyyy') : '-'}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">First Achievement</p>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl">
                  <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-green-600">100%</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Completion Rate</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}