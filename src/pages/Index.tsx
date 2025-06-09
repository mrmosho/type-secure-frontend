
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

const Index: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated) {
        navigate("/dashboard");
      } else {
        navigate("/home");
      }
    }
  }, [isAuthenticated, isLoading, navigate]);

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
};

export default Index;
