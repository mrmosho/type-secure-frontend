
import React from "react";
import AboutHero from "@/components/About/AboutHero";
import MissionSection from "@/components/About/MissionSection";
import TeamMember from "@/components/About/TeamMember";

const AboutUs: React.FC = () => {
  const teamMembers = [
    {
      name: "Dr. Hany Farid",
      role: "Chief Technology Officer",
      image: "/images/dr-hany.jpg",
      bio: "World-renowned expert in digital forensics and image analysis. Dr. Farid has pioneered techniques for detecting manipulated media and has consulted for law enforcement agencies worldwide. His research focuses on the intersection of computer science and digital forensics.",
      skills: ["Digital Forensics", "Image Analysis", "AI Research", "Computer Vision"]
    },
    {
      name: "Ahmed Hassan",
      role: "Lead ML Engineer",
      image: "/images/ahmed.jpg",
      bio: "Specialized in developing advanced machine learning models for data classification and pattern recognition. Ahmed has over 8 years of experience in building scalable AI systems and has published research in top-tier conferences on privacy-preserving machine learning.",
      skills: ["Machine Learning", "Data Science", "Python", "TensorFlow"]
    },
    {
      name: "Marwan El-Naggar",
      role: "Security Architect",
      image: "/images/marwan.jpg",
      bio: "Expert in cybersecurity architecture and threat modeling. Marwan designs secure systems that protect against advanced persistent threats and has experience implementing security frameworks for Fortune 500 companies.",
      skills: ["Cybersecurity", "Threat Modeling", "Cloud Security", "Compliance"]
    },
    {
      name: "Omar Mostafa",
      role: "Data Privacy Specialist",
      image: "/images/omar.jpg",
      bio: "Focuses on privacy regulations and compliance frameworks including GDPR, CCPA, and HIPAA. Omar helps organizations navigate complex privacy requirements while maintaining operational efficiency and data utility.",
      skills: ["Privacy Law", "GDPR", "Compliance", "Risk Assessment"]
    },
    {
      name: "Amr Salah",
      role: "Frontend Developer",
      image: "/images/amr.jpg",
      bio: "Creates intuitive and secure user interfaces for complex security applications. Amr specializes in building accessible, responsive web applications with a focus on user experience and security best practices.",
      skills: ["React", "TypeScript", "UI/UX", "Security"]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-ts-purple-50/30">
      <div className="container mx-auto px-4 py-16">
        <AboutHero />
        <MissionSection />
        
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Meet Our Team</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Our diverse team combines expertise in machine learning, cybersecurity, and privacy compliance 
            to deliver comprehensive data protection solutions.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {teamMembers.map((member, index) => (
            <TeamMember
              key={index}
              name={member.name}
              role={member.role}
              image={member.image}
              bio={member.bio}
              skills={member.skills}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
