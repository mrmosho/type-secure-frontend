import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { Github, Linkedin, Mail, Users, LayoutDashboard, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

interface TeamMember {
  id: number;
  name: string;
  role: string;
  image: string;
  bio: string;
  isSupervisor?: boolean;
  links?: {
    github?: string;
    linkedin?: string;
    email?: string;
  };
}

const teamMembers: TeamMember[] = [
    {
      id: 1,
      name: 'Prof. Hany Ammar',
      role: 'Project Supervisor',
      image: '/team/dr hany.jpeg',
      bio: 'Leading the team with expertise in security and software engineering. Prof. Ammar brings years of academic and industry experience to guide the project vision.',
      isSupervisor: true,
      links: {
        email: 'hammar@mail.wvu.edu',
        linkedin: 'https://www.linkedin.com/in/hany-ammar-69b4a516'
      }
    },
    {
      id: 2,
      name: 'Omar Husam',
      role: 'Project Lead',
      image: '/team/omar.jpg',
      bio: 'Responsible for overall project coordination and technical architecture. Omar specializes in secure system design and cryptography implementation.',
      links: {
        github: 'https://github.com/mrmosho',
        linkedin: 'https://www.linkedin.com/in/omar-husam-592593197/',
        email: 'omarhusam1711@gmail.com'
      }
    },
    {
      id: 3,
      name: 'Amr Mohamed',
      role: 'Software Developer',
      image: '/team/amr.jpg',
      bio: 'Amr is passionate about creating intuitive security tools for non-technical users.',
      links: {
        github: '#',
        linkedin: '#',
        email: 'amr@example.com'
      }
    },
    {
      id: 4,
      name: 'Marwan Mohamed',
      role: 'System Design',
      image: '/team/marwan.png',
      bio: 'Marwan ensures that the system provides reliable protection against evolving security threats.',
      links: {
        github: '#',
        linkedin: '#',
        email: 'marwan@example.com'
      }
    },
    {
      id: 5,
      name: 'Ahmed Ali',
      role: 'Back Orchestrator',
      image: '/team/ahmed.jpg',
      bio: 'Ahmed specializes in database setup.',
      links: {
        github: '#',
        linkedin: '#',
        email: 'ahmed@example.com'
      }
    },
  ];

const AboutUs: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card/50">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/home">
                <Button variant="ghost" size="sm" className="gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Back to Home
                </Button>
              </Link>
              <div className="flex items-center gap-2">
                <Users className="h-6 w-6 text-primary" />
                <h1 className="text-3xl font-bold">Our Team</h1>
              </div>
            </div>
          </div>
          <p className="text-muted-foreground max-w-2xl mt-2">
            Meet the dedicated professionals behind TypeSecure — combining expertise in
            cybersecurity, software development, and user experience to create a comprehensive
            sensitive data protection solution.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Supervisor Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-center">Project Supervisor</h2>
          <div className="flex justify-center">
            {teamMembers
              .filter(member => member.isSupervisor)
              .map(member => (
                <HoverCard key={member.id}>
                  <HoverCardTrigger asChild>
                    <Card className="max-w-md group hover:shadow-lg transition-all duration-300 border-primary/20 bg-background">
                      <CardHeader className="text-center">
                        <div className="relative w-32 h-32 mx-auto mb-4">
                          <div className="absolute inset-0 rounded-full border-4 border-primary/20" />
                          <img 
                            src={member.image} 
                            alt={member.name}
                            className="rounded-full w-full h-full object-cover filter grayscale group-hover:grayscale-0 transition-all duration-500"
                            loading="lazy"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = '/team/placeholder.jpg';
                            }}
                          />
                        </div>
                        <Badge variant="outline" className="bg-primary/10 mb-2 mx-auto w-fit">
                          Supervisor
                        </Badge>
                        <CardTitle className="text-xl">{member.name}</CardTitle>
                        <CardDescription>{member.role}</CardDescription>
                      </CardHeader>
                      <CardContent className="text-center">
                        <p className="text-sm text-muted-foreground line-clamp-3">{member.bio}</p>
                      </CardContent>
                      <CardFooter className="flex justify-center space-x-4">
                        {member.links?.email && (
                          <a href={`mailto:${member.links.email}`} className="text-muted-foreground hover:text-primary" aria-label="Email">
                            <Mail className="h-5 w-5" />
                          </a>
                        )}
                        {member.links?.linkedin && (
                          <a href={member.links.linkedin} className="text-muted-foreground hover:text-primary" aria-label="LinkedIn">
                            <Linkedin className="h-5 w-5" />
                          </a>
                        )}
                      </CardFooter>
                    </Card>
                  </HoverCardTrigger>
                  <HoverCardContent className="w-80 bg-background border shadow-lg z-50">
                    <div className="space-y-2">
                      <h4 className="text-sm font-semibold">{member.name}</h4>
                      <p className="text-sm text-muted-foreground">{member.role}</p>
                      <p className="text-sm">{member.bio}</p>
                    </div>
                  </HoverCardContent>
                </HoverCard>
              ))}
          </div>
        </div>

        {/* Development Team Section */}
        <div>
          <h2 className="text-2xl font-bold mb-6 text-center">Development Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {teamMembers
              .filter(member => !member.isSupervisor)
              .map(member => (
                <HoverCard key={member.id}>
                  <HoverCardTrigger asChild>
                    <Card className="group hover:scale-105 hover:shadow-lg transition-all duration-300 bg-background relative z-10">
                      <CardHeader className="text-center">
                        <div className="relative w-24 h-24 mx-auto mb-4">
                          <div className="absolute inset-0 rounded-full border-2 border-muted" />
                          <img 
                            src={member.image} 
                            alt={member.name}
                            className="rounded-full w-full h-full object-cover filter grayscale group-hover:grayscale-0 transition-all duration-500"
                            loading="lazy"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = '/team/placeholder.jpg';
                            }}
                          />
                        </div>
                        <CardTitle className="text-lg">{member.name}</CardTitle>
                        <CardDescription className="text-sm">{member.role}</CardDescription>
                      </CardHeader>
                      <CardContent className="text-center h-20 overflow-hidden">
                        <p className="text-xs text-muted-foreground">
                          {member.bio.substring(0, 60)}...
                        </p>
                      </CardContent>
                      <CardFooter className="flex justify-center space-x-4">
                        {member.links?.github && (
                          <a href={member.links.github} className="text-muted-foreground hover:text-primary" aria-label="GitHub">
                            <Github className="h-4 w-4" />
                          </a>
                        )}
                        {member.links?.linkedin && (
                          <a href={member.links.linkedin} className="text-muted-foreground hover:text-primary" aria-label="LinkedIn">
                            <Linkedin className="h-4 w-4" />
                          </a>
                        )}
                        {member.links?.email && (
                          <a href={`mailto:${member.links.email}`} className="text-muted-foreground hover:text-primary" aria-label="Email">
                            <Mail className="h-4 w-4" />
                          </a>
                        )}
                      </CardFooter>
                    </Card>
                  </HoverCardTrigger>
                  <HoverCardContent className="w-80 bg-background border shadow-lg z-50">
                    <div className="space-y-2">
                      <h4 className="text-sm font-semibold">{member.name}</h4>
                      <p className="text-sm text-muted-foreground">{member.role}</p>
                      <p className="text-sm">{member.bio}</p>
                    </div>
                  </HoverCardContent>
                </HoverCard>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;