
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Lock, Eye, Zap, CheckCircle } from 'lucide-react';

const Home: React.FC = () => {
  const features = [
    {
      icon: <Eye className="h-6 w-6" />,
      title: "Real-time Detection",
      description: "Instantly identify sensitive data patterns as you type"
    },
    {
      icon: <Lock className="h-6 w-6" />,
      title: "Advanced Encryption",
      description: "Military-grade encryption to protect your sensitive information"
    },
    {
      icon: <Zap className="h-6 w-6" />,
      title: "Lightning Fast",
      description: "Process documents and text in milliseconds"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-ts-purple-600 to-ts-pink-500 flex items-center justify-center">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-ts-purple-600 to-ts-pink-500 bg-clip-text text-transparent">
              type<span className="font-light">secure</span>
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <Link to="/login">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link to="/register">
              <Button className="bg-ts-purple-600 hover:bg-ts-purple-700">Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-16">
        <div className="text-center space-y-8 max-w-4xl mx-auto">
          <div className="space-y-4">
            <h1 className="text-5xl md:text-6xl font-bold leading-tight">
              Protect Your{' '}
              <span className="bg-gradient-to-r from-ts-purple-600 to-ts-pink-500 bg-clip-text text-transparent">
                Sensitive Data
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Advanced AI-powered detection and encryption system that automatically identifies and protects 
              sensitive information in your documents and communications.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register">
              <Button size="lg" className="bg-ts-purple-600 hover:bg-ts-purple-700 px-8">
                Start Free Trial
              </Button>
            </Link>
            <Link to="/try-us">
              <Button size="lg" variant="outline" className="px-8">
                Try Demo
              </Button>
            </Link>
          </div>

          {/* Trust Indicators */}
          <div className="flex items-center justify-center space-x-8 text-sm text-muted-foreground pt-8">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>Enterprise-grade security</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>GDPR compliant</span>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-24 space-y-16">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">Why Choose TypeSecure?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our advanced detection algorithms and encryption technology ensure your sensitive data stays protected.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-all duration-300 border-muted">
                <CardHeader>
                  <div className="w-12 h-12 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <div className="text-primary">{feature.icon}</div>
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-24 text-center">
          <Card className="max-w-2xl mx-auto bg-gradient-to-r from-ts-purple-50 to-ts-pink-50 border-ts-purple-200">
            <CardHeader>
              <CardTitle className="text-2xl">Ready to Secure Your Data?</CardTitle>
              <CardDescription className="text-base">
                Join thousands of users who trust TypeSecure to protect their sensitive information.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/register">
                  <Button size="lg" className="bg-ts-purple-600 hover:bg-ts-purple-700">
                    Create Free Account
                  </Button>
                </Link>
                <Link to="/about">
                  <Button size="lg" variant="outline">
                    Learn More
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t mt-24">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-ts-purple-600 to-ts-pink-500 flex items-center justify-center">
                <Shield className="h-4 w-4 text-white" />
              </div>
              <span className="font-bold bg-gradient-to-r from-ts-purple-600 to-ts-pink-500 bg-clip-text text-transparent">
                type<span className="font-light">secure</span>
              </span>
            </div>
            <div className="flex items-center space-x-6 text-sm text-muted-foreground">
              <Link to="/about" className="hover:text-foreground">About</Link>
              <Link to="/pricing" className="hover:text-foreground">Pricing</Link>
              <Link to="/try-us" className="hover:text-foreground">Demo</Link>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2024 TypeSecure. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
