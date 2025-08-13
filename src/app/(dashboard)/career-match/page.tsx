'use client';

import { useState } from 'react';
import { recommendCareerPaths, RecommendCareerPathsOutput } from '@/ai/flows/career-path-recommendation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, ArrowRight, TrendingUp, CircleDollarSign, Wand2, Lightbulb, UserCheck, Briefcase } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Switch } from '@/components/ui/switch';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

export default function CareerMatchPage() {
  const [formData, setFormData] = useState({
    skills: '',
    experience: '',
    interests: '',
    considerTechnologies: true,
  });
  const [recommendations, setRecommendations] = useState<RecommendCareerPathsOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };
  
  const handleSwitchChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, considerTechnologies: checked }));
  };

  const handleSubmit = async (e: React.Event<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData.skills || !formData.experience || !formData.interests) {
      toast({
        title: "Missing Information",
        description: "Please fill out all fields to get career recommendations.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setRecommendations(null);

    try {
      const result = await recommendCareerPaths(formData);
      setRecommendations(result);
    } catch (error) {
      console.error('Error getting recommendations:', error);
      toast({
        title: "Recommendation Failed",
        description: "There was an error getting career recommendations. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Career Match</CardTitle>
          <CardDescription>Tell us about yourself to discover your ideal career paths. The more details you provide, the better the recommendations.</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="skills">Your Skills</Label>
              <Textarea id="skills" placeholder="e.g., React, Python, Project Management, Public Speaking" onChange={handleInputChange} value={formData.skills} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="experience">Your Experience</Label>
              <Textarea id="experience" placeholder="e.g., 3 years as a Software Engineer at TechCorp, led a team of 5..." onChange={handleInputChange} value={formData.experience} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="interests">Your Interests & Passions</Label>
              <Textarea id="interests" placeholder="e.g., I enjoy building things, solving puzzles, working with data, helping people..." onChange={handleInputChange} value={formData.interests} />
            </div>
            <div className="flex items-center space-x-2">
                <Switch id="considerTechnologies" checked={formData.considerTechnologies} onCheckedChange={handleSwitchChange} />
                <Label htmlFor="considerTechnologies">Consider specific technologies in roadmap</Label>
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
              Find My Career Path
            </Button>
          </CardFooter>
        </form>
      </Card>
      
      {isLoading && (
        <div className="flex justify-center items-center py-10">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="ml-2">Finding your perfect career matches...</p>
        </div>
      )}

      {recommendations && (
        <div>
          <h2 className="text-2xl font-bold mb-4">Top Career Recommendations</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {recommendations.map((path, index) => (
              <Card key={index} className="flex flex-col">
                <CardHeader>
                  <CardTitle>{path.careerPath}</CardTitle>
                  <CardDescription>Demand: <span className="font-semibold text-primary">{path.demandRating}</span></CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 flex-grow">
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2 text-muted-foreground"><TrendingUp className="h-4 w-4"/> Job Growth</span>
                    <span className="font-bold">{path.jobGrowthPercentage}%</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                     <span className="flex items-center gap-2 text-muted-foreground"><CircleDollarSign className="h-4 w-4"/> Avg. Salary</span>
                    <span className="font-bold">${path.averageSalary.toLocaleString()}</span>
                  </div>
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="item-1">
                      <AccordionTrigger>View Learning Roadmap</AccordionTrigger>
                      <AccordionContent className="space-y-4 pt-2">
                          <div>
                            <h4 className="font-semibold flex items-center gap-2 text-sm"><UserCheck className="h-4 w-4" /> Missing Skills</h4>
                            <p className="text-sm text-muted-foreground mt-1">{path.missingSkills}</p>
                          </div>
                          <div>
                            <h4 className="font-semibold flex items-center gap-2 text-sm"><Lightbulb className="h-4 w-4" /> Suggested Projects</h4>
                             <p className="text-sm text-muted-foreground mt-1">{path.suggestedProjects}</p>
                          </div>
                          <div>
                            <h4 className="font-semibold flex items-center gap-2 text-sm"><Briefcase className="h-4 w-4" /> Networking</h4>
                            <p className="text-sm text-muted-foreground mt-1">{path.relevantNetworkingOpportunities}</p>
                          </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </CardContent>
                <CardFooter>
                    <Button className="w-full">
                        Explore Path <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
