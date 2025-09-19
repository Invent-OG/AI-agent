"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Calendar,
  Clock,
  Users,
  Video,
  CheckCircle,
  ArrowLeft,
  MapPin,
  DollarSign,
  Star,
  Play,
  Download,
  Share2,
  Bell,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { format, addDays } from "date-fns";
import { useToast } from "@/hooks/use-toast";

export default function StudentWorkshopPage() {
  const router = useRouter();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.push("/student/login");
      } else {
        setUser(user);
      }
    };

    getUser();
  }, [router]);

  const { data: studentData } = useQuery({
    queryKey: ["student-data", user?.id],
    queryFn: async () => {
      const response = await fetch(`/api/student/data?leadId=${user?.id}`);
      if (!response.ok) throw new Error("Failed to fetch student data");
      return response.json();
    },
    enabled: !!user?.id,
  });

  const registerForWorkshop = useMutation({
    mutationFn: async (registrationData: any) => {
      const response = await fetch("/api/workshop/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(registrationData),
      });
      if (!response.ok) throw new Error("Failed to register");
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["student-data"] });
      toast({
        title: "Registration Successful!",
        description: "Redirecting to payment...",
      });
      if (data.paymentUrl) {
        window.location.href = data.paymentUrl;
      }
    },
    onError: () => {
      toast({
        title: "Registration Failed",
        description: "Please try again or contact support.",
        variant: "destructive",
      });
    },
  });

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent"></div>
      </div>
    );
  }

  const student = studentData?.data;
  const isRegistered =
    student?.workshopStatus === "registered" || student?.status === "paid";
  const workshopDate = addDays(new Date(), 7); // Workshop in 7 days

  const handleRegister = () => {
    if (user) {
      registerForWorkshop.mutate({
        name: user.user_metadata?.name || user.email?.split("@")[0],
        email: user.email,
        phone: student?.phone || "",
        company: student?.company || "",
      });
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
                  <Calendar className="w-6 h-6 mr-2 text-purple-600" />
                  Live Workshop
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Master business automation in 3 hours
                </p>
              </div>
            </div>
            {isRegistered && (
              <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                <CheckCircle className="w-4 h-4 mr-2" />
                Registered
              </Badge>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Workshop Status */}
        <Card className="border-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl shadow-lg mb-8">
          <CardContent className="p-8">
            {isRegistered ? (
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  You're Registered! 🎉
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Get ready for an amazing automation learning experience
                </p>
                <div className="flex justify-center gap-4">
                  <Button className="bg-gradient-to-r from-blue-500 to-purple-500">
                    <Video className="w-4 h-4 mr-2" />
                    Join Workshop
                  </Button>
                  <Button variant="outline">
                    <Download className="w-4 h-4 mr-2" />
                    Download Materials
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Calendar className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  Join Our Live Workshop
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Transform your business with automation in just 3 hours
                </p>
                <Button
                  onClick={handleRegister}
                  disabled={registerForWorkshop.isPending}
                  className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 px-8 py-3"
                >
                  {registerForWorkshop.isPending
                    ? "Processing..."
                    : "Register for ₹499"}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Workshop Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card className="border-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="w-5 h-5 mr-2 text-blue-600" />
                Workshop Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Date
                    </p>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {format(workshopDate, "MMMM dd, yyyy")}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Time
                    </p>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      10:00 AM - 1:00 PM
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Duration
                    </p>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      3 Hours
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Format
                    </p>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      Live Online
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                    What you'll learn:
                  </p>
                  <ul className="space-y-1 text-sm text-gray-700 dark:text-gray-300">
                    <li>• Zapier automation fundamentals</li>
                    <li>• Advanced n8n workflow creation</li>
                    <li>• Make.com scenario building</li>
                    <li>• Real-world automation examples</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="w-5 h-5 mr-2 text-green-600" />
                Workshop Stats
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">
                    Total Seats
                  </span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    100
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">
                    Registered
                  </span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    72
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">
                    Available
                  </span>
                  <span className="font-semibold text-blue-600">28</span>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Workshop Progress</span>
                    <span>72%</span>
                  </div>
                  {/* <Progress value={Number(72)} className="h-3" /> */}
                </div>

                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-center text-orange-600 dark:text-orange-400">
                    <AlertCircle className="w-4 h-4 mr-2" />
                    <span className="text-sm font-medium">
                      Only 28 seats remaining!
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Workshop Agenda */}
        <Card className="border-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="w-5 h-5 mr-2 text-purple-600" />
              Workshop Agenda
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  time: "10:00 AM",
                  title: "Workshop Introduction & Setup",
                  duration: "30 min",
                },
                {
                  time: "10:30 AM",
                  title: "Zapier Mastery Session",
                  duration: "45 min",
                },
                {
                  time: "11:15 AM",
                  title: "n8n Deep Dive Training",
                  duration: "45 min",
                },
                {
                  time: "12:00 PM",
                  title: "Make.com Scenarios",
                  duration: "45 min",
                },
                {
                  time: "12:45 PM",
                  title: "Q&A + Bonus Resources",
                  duration: "15 min",
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-1">
                      <Badge variant="outline" className="text-xs">
                        {item.time}
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        {item.duration}
                      </Badge>
                    </div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {item.title}
                    </h3>
                  </div>
                  <Play className="w-5 h-5 text-green-500" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
