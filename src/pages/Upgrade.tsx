
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Crown, Check, Sparkles, Shield, Zap } from "lucide-react";

const Upgrade: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Account Upgrade</h1>
        <Badge variant="secondary" className="bg-ts-purple-100 text-ts-purple-700 border-ts-purple-200">
          <Crown className="w-4 h-4 mr-1" />
          Pro Account Active
        </Badge>
      </div>

      <Card className="bg-gradient-to-br from-ts-purple-50 to-ts-pink-50 border-ts-purple-200">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 bg-ts-purple-500 rounded-full flex items-center justify-center">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl text-ts-purple-800">You're All Set!</CardTitle>
          <CardDescription className="text-lg text-ts-purple-600">
            All accounts have Pro access until the end of the year
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-semibold text-ts-purple-800 flex items-center">
                <Shield className="w-5 h-5 mr-2" />
                Pro Features Included
              </h3>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Unlimited security scans</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Advanced threat detection</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Real-time monitoring</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Priority support</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Advanced analytics</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Custom security policies</span>
                </li>
              </ul>
            </div>
            
            <div className="space-y-4">
              <h3 className="font-semibold text-ts-purple-800 flex items-center">
                <Zap className="w-5 h-5 mr-2" />
                Coming Soon
              </h3>
              <div className="p-4 bg-white rounded-lg border border-ts-purple-200">
                <p className="text-sm text-muted-foreground mb-3">
                  We're working on exciting new features and payment options. Stay tuned for updates!
                </p>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• Flexible subscription plans</li>
                  <li>• Team collaboration features</li>
                  <li>• API access</li>
                  <li>• Custom integrations</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="text-center">
          <div className="w-full">
            <p className="text-sm text-muted-foreground mb-4">
              Your Pro access is active until December 31, 2024
            </p>
            <Button 
              disabled 
              className="bg-ts-purple-500 hover:bg-ts-purple-600 opacity-50 cursor-not-allowed"
            >
              Payment Options Coming Soon
            </Button>
          </div>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Questions About Upgrading?</CardTitle>
          <CardDescription>
            Get in touch with our team for more information about future pricing and features.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button variant="outline" className="flex-1">
              Contact Support
            </Button>
            <Button variant="outline" className="flex-1">
              View Roadmap
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Upgrade;
