import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Toggle } from "@/components/ui/toggle";
import { Check, Shield, Gift, Star, Clock, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

const Pricing: React.FC = () => {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");

  const handlePlanSelect = (planName: string) => {
    toast({
      title: "Coming Soon!",
      description: "Payment options are coming soon. For now, all accounts have Pro access for testing until the end of the year. Please sign up to get started!",
      duration: 5000,
    });
  };

  const plans = [
    {
      name: "Individual",
      popular: false,
      description: "Essential security for personal devices",
      monthlyPrice: 9.99,
      yearlyPrice: 99,
      features: [
        "Basic encryption",
        "Real-time scanning",
        "1 device support",
        "Email alerts",
      ],
      icon: <Shield className="h-10 w-10 text-ts-purple-500" />,
      ctaText: "Get Started",
    },
    {
      name: "Professional",
      popular: true,
      description: "Enhanced protection for professionals",
      monthlyPrice: 19.99,
      yearlyPrice: 199,
      features: [
        "Advanced encryption",
        "Real-time scanning",
        "3 device support",
        "Priority alerts",
        "Data recovery",
        "24/7 support",
      ],
      icon: <Star className="h-10 w-10 text-ts-pink-500" />,
      ctaText: "Upgrade Now",
    },
    {
      name: "Enterprise",
      popular: false,
      description: "Custom security solutions for teams",
      monthlyPrice: 29.99,
      yearlyPrice: 299,
      features: [
        "Military-grade encryption",
        "Real-time scanning",
        "Unlimited devices",
        "Custom alert rules",
        "Data recovery",
        "24/7 priority support",
        "Admin dashboard",
      ],
      icon: <Gift className="h-10 w-10 text-ts-purple-500" />,
      ctaText: "Contact Sales",
    },
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-8">
        <Link to="/">
          <Button variant="ghost" className="flex items-center gap-2">
            <ArrowLeft size={16} />
            Back to Home
          </Button>
        </Link>
      </div>
      
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold mb-4">Choose Your Security Plan</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Protect your sensitive data with our comprehensive security solutions. Choose the plan that fits your needs.
        </p>
        
        <div className="flex items-center justify-center mt-8 space-x-2">
          <span className={billingCycle === "monthly" ? "text-foreground" : "text-muted-foreground"}>
            Monthly
          </span>
          <Toggle 
            pressed={billingCycle === "yearly"} 
            onPressedChange={() => setBillingCycle(billingCycle === "monthly" ? "yearly" : "monthly")}
            className="data-[state=on]:bg-ts-purple-500"
          />
          <span className={billingCycle === "yearly" ? "text-foreground" : "text-muted-foreground"}>
            Yearly <span className="text-xs text-ts-pink-500 font-medium">Save 17%</span>
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((plan, index) => (
          <Card 
            key={index} 
            className={`flex flex-col h-full transition-all duration-300 hover:shadow-lg ${
              plan.popular ? 'border-ts-pink-500 shadow-md' : ''
            }`}
          >
            {plan.popular && (
              <div className="bg-ts-pink-500 text-white text-xs font-medium py-1 px-3 rounded-t-md text-center">
                Most Popular
              </div>
            )}
            <CardHeader>
              <div className="mb-4">{plan.icon}</div>
              <CardTitle>{plan.name}</CardTitle>
              <CardDescription>{plan.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <div className="mb-6">
                <p className="text-3xl font-bold">
                  ${billingCycle === "monthly" ? plan.monthlyPrice : plan.yearlyPrice}
                  <span className="text-sm font-normal text-muted-foreground">
                    /{billingCycle === "monthly" ? "month" : "year"}
                  </span>
                </p>
              </div>
              <ul className="space-y-2">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-ts-purple-500" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button 
                className={`w-full ${plan.name === "Enterprise" ? "bg-ts-purple-600" : ""}`}
                variant={plan.name === "Professional" ? "default" : "outline"}
                onClick={() => handlePlanSelect(plan.name)}
              >
                {plan.ctaText}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="mt-16 bg-muted rounded-lg p-6 max-w-3xl mx-auto">
        <div className="flex items-center gap-4 mb-4">
          <Clock className="h-6 w-6 text-ts-purple-500" />
          <h2 className="text-xl font-medium">Pay-As-You-Go Option</h2>
        </div>
        <p className="text-muted-foreground mb-4">
          Need flexibility? Our pay-as-you-go plan charges only for what you use. Perfect for occasional security needs.
        </p>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-background p-4 rounded-md">
          <div>
            <p className="font-medium">$0.02 per scan</p>
            <p className="text-sm text-muted-foreground">No minimum commitment</p>
          </div>
          <Button variant="outline" className="whitespace-nowrap">Learn More</Button>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
