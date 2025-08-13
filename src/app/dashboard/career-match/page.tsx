
'use client';

import { useEffect, useState } from 'react';
import { recommendCareerPaths, RecommendCareerPathsOutput } from '@/ai/flows/career-path-recommendation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Loader2, ArrowRight, TrendingUp, CircleDollarSign, Wand2, Lightbulb, UserCheck, Briefcase } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Switch } from '@/components/ui/switch';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useAuth } from '@/hooks/use-auth';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import Link from 'next/link';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

type UserProfile = {
  skills?: string;
  experience?: string;
  interests?: string;
}

export default function CareerMatchPage() {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [recommendations, setRecommendations] = useState<RecommendCareerPathsOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isProfileLoading, setIsProfileLoading] = useState(true);
  const [considerTechnologies, setConsiderTechnologies] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    async function fetchUserProfile() {
      if (user) {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setUserProfile(docSnap.data() as UserProfile);
        }
      }
      setIsProfileLoading(false);
    }
    fetchUserProfile();
  }, [user]);

  const handleSubmit = async () => {
    if (!userProfile?.skills || !userProfile?.experience || !userProfile?.interests) {
      toast({
        title: "Profile Incomplete",
        description: "Please complete your profile with skills, experience, and interests before finding career matches.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setRecommendations(null);

    try {
      const result = await recommendCareerPaths({
        ...userProfile,
        considerTechnologies
      });
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

  const hasRequiredInfo = userProfile?.skills && userProfile?.experience && userProfile?.interests;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>AI Career Match</CardTitle>
          <CardDescription>Discover your ideal career paths based on your profile. The more details in your profile, the better the recommendations.</CardDescription>
        </CardHeader>
        <CardContent>
          {isProfileLoading ? (
            <div className="flex items-center space-x-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Loading your profile...</span>
            </div>
          ) : !hasRequiredInfo ? (
             <Alert>
              <AlertTitle>Profile Incomplete</AlertTitle>
              <AlertDescription>
                Your profile is missing key information (skills, experience, or interests). 
                Please <Link href="/dashboard/profile" className="font-bold text-primary underline">update your profile</Link> to get career recommendations.
              </AlertDescription>
            </Alert>
          ) : (
            <div className='space-y-4'>
              <Card>
                <CardContent className='pt-6'>
                    <p><strong>Skills:</strong> {userProfile.skills}</p>
                    <p><strong>Experience:</strong> {userProfile.experience}</p>
                    <p><strong>Interests:</strong> {userProfile.interests}</p>
                </CardContent>
              </Card>
               <div className="flex items-center space-x-2">
                <Switch id="considerTechnologies" checked={considerTechnologies} onCheckedChange={setConsiderTechnologies} />
                <Label htmlFor="considerTechnologies">Consider specific technologies in roadmap</Label>
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button onClick={handleSubmit} disabled={isLoading || isProfileLoading || !hasRequiredInfo}>
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
            Find My Career Paths
          </Button>
        </CardFooter>
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
                    <Button className="w-full" variant="secondary">
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
