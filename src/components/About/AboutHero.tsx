
import React from "react";
import { Button } from "@/components/ui/button";
import { Shield, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const AboutHero: React.FC = () => {
  return (
    <div className="text-center mb-16">
      <div className="flex justify-center mb-6">
        <div className="p-4 bg-ts-purple-100 rounded-full">
          <Shield className="w-12 h-12 text-ts-purple-600" />
        </div>
      </div>
      <h1 className="text-4xl font-bold mb-6 bg-gradient-to-r from-ts-purple-600 to-ts-pink-500 bg-clip-text text-transparent">
        About TypeSecure
      </h1>
      <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
        We're a team of cybersecurity experts and machine learning engineers dedicated to 
        protecting your sensitive information through cutting-edge AI technology.
      </p>
      <div className="flex justify-center gap-4">
        <Button 
          asChild
          className="bg-ts-purple-500 hover:bg-ts-purple-600"
        >
          <Link to="/try-us">
            Try Our Technology
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
        <Button variant="outline" asChild>
          <Link to="/pricing">View Pricing</Link>
        </Button>
      </div>
    </div>
  );
};

export default AboutHero;
