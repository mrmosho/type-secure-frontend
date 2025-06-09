import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth'; // Updated import path

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading, user } = useAuth();

  console.log('ProtectedRoute state:', { isAuthenticated, isLoading, userId: user?.id });

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

  if (!isAuthenticated) {
    console.log('Not authenticated, redirecting to login');
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};