import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useSearchParams } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import MainLayout from "./components/Layout/MainLayout";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { useEffect, useState } from 'react';
import { useToast } from "@/components/ui/use-toast";

import Home from "./pages/Home";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import ForgotPassword from "./pages/Auth/ForgotPassword";
import Dashboard from "./pages/Dashboard";
import MonitoringPanel from "./pages/MonitoringPanel";
import Settings from "./pages/Settings";
import Notifications from "./pages/Notifications";
import Pricing from "./pages/Pricing";
import TryUs from "./pages/TryUs";
import AboutUs from "./pages/AboutUs";
import Scans from "./pages/Scans";
import Upgrade from "./pages/Upgrade";
import NotFound from "./pages/NotFound";

// Protected route component that redirects to login if not authenticated
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-center">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-ts-purple-600 to-ts-pink-500 bg-clip-text text-transparent">
            type<span className="font-light">secure</span>
          </h1>
          <p className="mt-2 text-muted-foreground">Loading security interface...</p>
        </div>
      </div>
    );
  }

  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

const queryClient = new QueryClient();

const ConfirmEmail = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { supabase } = useAuth();
  const { toast } = useToast();
  const [isVerifying, setIsVerifying] = useState(true);

  useEffect(() => {
    const confirmEmail = async () => {
      const token = searchParams.get('token');
      const type = searchParams.get('type');
      
      if (token && type === 'signup') {
        try {
          const { error } = await supabase.auth.verifyOtp({
            token_hash: token,
            type: 'signup'
          });

          if (error) {
            toast({
              variant: "destructive",
              title: "Verification Failed",
              description: "Could not verify your email. Please try again or contact support."
            });
            console.error('Error confirming email:', error);
          } else {
            toast({
              title: "Email Verified",
              description: "Your email has been successfully verified. Please sign in.",
            });
            // Redirect to login after 2 seconds
            setTimeout(() => {
              navigate('/login');
            }, 2000);
          }
        } catch (error) {
          toast({
            variant: "destructive",
            title: "Verification Error",
            description: "An unexpected error occurred. Please try again later."
          });
        }
      } else {
        toast({
          variant: "destructive",
          title: "Invalid Link",
          description: "The verification link appears to be invalid or expired."
        });
      }
      setIsVerifying(false);
    };

    confirmEmail();
  }, [navigate, searchParams, supabase.auth, toast]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="max-w-md w-full p-6">
        <div className="text-center space-y-4">
          <div className="mb-8">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-ts-purple-600 to-ts-pink-500 bg-clip-text text-transparent">
              type<span className="font-light">secure</span>
            </h1>
          </div>
          
          {isVerifying ? (
            <>
              <h2 className="text-xl font-semibold">Verifying your email...</h2>
              <p className="text-muted-foreground">
                Please wait while we confirm your email address
              </p>
              <div className="flex justify-center mt-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            </>
          ) : (
            <>
              <h2 className="text-xl font-semibold">Email Verification Complete</h2>
              <p className="text-muted-foreground">
                Redirecting you to the login page...
              </p>
              <button
                onClick={() => navigate('/login')}
                className="mt-4 w-full py-2 px-4 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
              >
                Sign In Now
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ErrorBoundary>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/home" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/about" element={<AboutUs />} />
              <Route path="/try-us" element={<TryUs />} />
              
              {/* Protected Routes with MainLayout */}
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <MainLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<Dashboard />} />
              </Route>
              
              <Route 
                path="/scans" 
                element={
                  <ProtectedRoute>
                    <MainLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<Scans />} />
              </Route>
              
              <Route 
                path="/settings" 
                element={
                  <ProtectedRoute>
                    <MainLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<Settings />} />
              </Route>
              
              <Route 
                path="/notifications" 
                element={
                  <ProtectedRoute>
                    <MainLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<Notifications />} />
              </Route>
              
              <Route 
                path="/upgrade" 
                element={
                  <ProtectedRoute>
                    <MainLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<Upgrade />} />
              </Route>
              
              <Route 
                path="/monitoring" 
                element={
                  <ProtectedRoute>
                    <MainLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<MonitoringPanel />} />
              </Route>
              
              <Route path="/auth/confirm" element={<ConfirmEmail />} />
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </ErrorBoundary>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
