
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Target, Eye, Lightbulb } from "lucide-react";

const MissionSection: React.FC = () => {
  const values = [
    {
      icon: <Target className="w-6 h-6" />,
      title: "Our Mission",
      description: "To make advanced data protection accessible to organizations of all sizes through innovative AI-powered solutions."
    },
    {
      icon: <Eye className="w-6 h-6" />,
      title: "Our Vision",
      description: "A world where sensitive data is automatically protected, reducing the risk of data breaches and privacy violations."
    },
    {
      icon: <Lightbulb className="w-6 h-6" />,
      title: "Our Values",
      description: "Innovation, security, transparency, and putting our customers' data protection needs at the center of everything we do."
    }
  ];

  return (
    <div className="grid md:grid-cols-3 gap-8 mb-16">
      {values.map((value, index) => (
        <Card key={index} className="text-center bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-ts-purple-100 rounded-lg text-ts-purple-600">
                {value.icon}
              </div>
            </div>
            <CardTitle className="text-xl">{value.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">{value.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default MissionSection;
