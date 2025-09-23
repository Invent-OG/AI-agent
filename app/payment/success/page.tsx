"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Loader2, XCircle, ArrowRight, Home } from "lucide-react";
import Link from "next/link";
import Confetti from "react-confetti";

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<'loading' | 'success' | 'failed'>('loading');
  const [orderDetails, setOrderDetails] = useState<any>(null);
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  const orderId = searchParams.get('orderId');
  const cfOrderId = searchParams.get('order_id');

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const verifyPayment = async () => {
      if (!orderId && !cfOrderId) {
        setStatus('failed');
        return;
      }

      try {
        // Wait a bit for webhook to process
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        const response = await fetch(`/api/payments/verify?orderId=${orderId || cfOrderId}`);
        const data = await response.json();

        if (data.success && data.payment?.status === 'success') {
          setStatus('success');
          setOrderDetails(data.payment);
        } else {
          setStatus('failed');
        }
      } catch (error) {
        console.error('Payment verification error:', error);
        setStatus('failed');
      }
    };

    verifyPayment();
  }, [orderId, cfOrderId]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-950 dark:via-blue-950/30 dark:to-indigo-950/30 flex items-center justify-center">
        <Card className="border-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl shadow-2xl max-w-md w-full mx-4">
          <CardContent className="p-8 text-center">
            <Loader2 className="w-16 h-16 animate-spin mx-auto mb-6 text-blue-600" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Verifying Payment...
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Please wait while we confirm your payment
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (status === 'failed') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-950 dark:via-blue-950/30 dark:to-indigo-950/30 flex items-center justify-center">
        <Card className="border-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl shadow-2xl max-w-md w-full mx-4">
          <CardContent className="p-8 text-center">
            <XCircle className="w-16 h-16 mx-auto mb-6 text-red-500" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Payment Failed
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              We couldn't process your payment. Please try again or contact support.
            </p>
            <div className="space-y-3">
              <Button 
                onClick={() => router.back()}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-500"
              >
                Try Again
              </Button>
              <Link href="/">
                <Button variant="outline" className="w-full">
                  <Home className="w-4 h-4 mr-2" />
                  Back to Home
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-950 dark:via-blue-950/30 dark:to-indigo-950/30 flex items-center justify-center">
      <Confetti
        width={windowSize.width}
        height={windowSize.height}
        recycle={false}
        numberOfPieces={200}
      />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl w-full mx-4"
      >
        <Card className="border-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl shadow-2xl">
          <CardContent className="p-8 sm:p-12 text-center">
            <CheckCircle className="w-20 h-20 mx-auto mb-6 text-green-500" />
            
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Payment Successful! 🎉
            </h1>
            
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
              Welcome to AutomateFlow! Your registration is confirmed and you now have access to all course materials.
            </p>

            {orderDetails && (
              <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-6 mb-8">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Order Details</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Order ID:</span>
                    <p className="font-mono">{orderDetails.cashfreeOrderId}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Amount:</span>
                    <p className="font-semibold">₹{parseFloat(orderDetails.amount).toLocaleString()}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Plan:</span>
                    <p className="font-semibold capitalize">{orderDetails.plan}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Date:</span>
                    <p>{new Date(orderDetails.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-4">
              <Link href="/student/dashboard">
                <Button 
                  size="lg" 
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                >
                  Access Your Dashboard
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              
              <Link href="/">
                <Button variant="outline" size="lg" className="w-full">
                  <Home className="w-4 h-4 mr-2" />
                  Back to Home
                </Button>
              </Link>
            </div>

            <div className="mt-8 text-sm text-gray-500 dark:text-gray-400">
              <p>A confirmation email has been sent to your registered email address.</p>
              <p>If you have any questions, please contact our support team.</p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}