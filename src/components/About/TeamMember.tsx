
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";

interface TeamMemberProps {
  name: string;
  role: string;
  image: string;
  bio: string;
  skills: string[];
}

const TeamMember: React.FC<TeamMemberProps> = ({ name, role, image, bio, skills }) => {
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Card className="group cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105 bg-card/50 backdrop-blur-sm">
          <CardContent className="p-6 text-center">
            <div className="relative mb-4">
              <img
                src={image}
                alt={name}
                className="w-24 h-24 rounded-full mx-auto object-cover border-2 border-ts-purple-200 group-hover:border-ts-purple-400 transition-colors duration-300"
              />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-foreground group-hover:text-ts-purple-600 transition-colors duration-300">
              {name}
            </h3>
            <p className="text-muted-foreground mb-3">{role}</p>
            <div className="flex flex-wrap gap-2 justify-center">
              {skills.map((skill) => (
                <Badge key={skill} variant="secondary" className="text-xs">
                  {skill}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </HoverCardTrigger>
      <HoverCardContent className="w-80 p-4">
        <div className="space-y-2">
          <h4 className="text-sm font-semibold">{name}</h4>
          <p className="text-sm text-muted-foreground">{bio}</p>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};

export default TeamMember;
