
'use client';
import { useState } from 'react';
import { analyzeResume, AnalyzeResumeOutput } from '@/ai/flows/resume-analyzer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, UploadCloud, FileText, BrainCircuit, GraduationCap, Briefcase, Star } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';
import { doc, setDoc } from "firebase/firestore";
import { db } from '@/lib/firebase';
import { useRouter } from 'next/navigation';

function fileToDataUri(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      resolve(reader.result as string);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function ResumeAnalyzerPage() {
  const [file, setFile] = useState<File | null>(null);
  const [analysis, setAnalysis] = useState<AnalyzeResumeOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingAction, setLoadingAction] = useState<'update' | 'score' | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();
  const router = useRouter();


  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
      setAnalysis(null);
    }
  };

  const handleAnalyze = async (action: 'update' | 'score') => {
    if (!file) {
      toast({
        title: "No file selected",
        description: "Please select a resume file to analyze.",
        variant: "destructive",
      });
      return;
    }
     if (!user) {
      toast({
        title: "Not logged in",
        description: "You must be logged in to analyze a resume.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setLoadingAction(action);
    setAnalysis(null);

    try {
      const resumeDataUri = await fileToDataUri(file);
      const result = await analyzeResume({ 
        resumeDataUri, 
        calculateAtsScore: action === 'score' 
      });
      setAnalysis(result);
      
      const userRef = doc(db, "users", user.uid);

      if (action === 'update') {
        await setDoc(userRef, {
            skills: result.skills.join(', '),
            experience: result.experience,
        }, { merge: true });

        toast({
          title: "Analysis Complete",
          description: "Your resume has been analyzed and your profile has been updated.",
        });

        router.push('/dashboard/profile');
      } else if (action === 'score') {
         if (result.atsScore) {
           await setDoc(userRef, {
             atsScore: result.atsScore,
           }, { merge: true });
         }
         toast({
           title: "ATS Score Calculated",
           description: "Your resume's ATS score has been calculated.",
         });
      }

    } catch (error) {
      console.error('Error analyzing resume:', error);
      toast({
        title: "Analysis Failed",
        description: "There was an error analyzing your resume. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setLoadingAction(null);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Resume Analyzer</CardTitle>
          <CardDescription>Upload your resume (PDF/DOCX/TXT) to extract insights, update your profile, or get an ATS score.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid w-full max-w-lg items-center gap-2">
            <Label htmlFor="resume">Upload Resume</Label>
            <Input id="resume" type="file" accept=".pdf,.docx,.txt" onChange={handleFileChange} />
          </div>
        </CardContent>
        <CardFooter className="flex gap-4">
            <Button onClick={() => handleAnalyze('score')} disabled={isLoading || !file}>
              {loadingAction === 'score' ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Star className="mr-2 h-4 w-4" />}
              Analyze & Get ATS Score
            </Button>
            <Button onClick={() => handleAnalyze('update')} disabled={isLoading || !file} variant="secondary">
              {loadingAction === 'update' ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <UploadCloud className="mr-2 h-4 w-4" />}
              Analyze & Update Profile
            </Button>
        </CardFooter>
      </Card>

      {isLoading && (
        <div className="flex justify-center items-center py-10">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="ml-2">Analyzing your resume...</p>
        </div>
      )}

      {analysis && (
        <div className="grid gap-6">
          {analysis.atsScore !== undefined && analysis.atsSuggestions && (
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Star /> ATS Score & Suggestions
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <p className="text-6xl font-bold text-primary">{analysis.atsScore}</p>
                        <p className="text-muted-foreground">Out of 100</p>
                    </div>
                     <div>
                        <h3 className="font-semibold">Improvement Suggestions</h3>
                        <p className="text-muted-foreground mt-2 whitespace-pre-wrap">{analysis.atsSuggestions}</p>
                    </div>
                </CardContent>
            </Card>
          )}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><FileText /> Extracted Content</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold flex items-center gap-2"><BrainCircuit /> Skills</h3>
                <div className="flex flex-wrap gap-2 mt-2">
                  {analysis.skills.map((skill, index) => (
                    <span key={index} className="bg-primary/10 text-primary text-xs font-medium px-2.5 py-0.5 rounded-full">{skill}</span>
                  ))}
                </div>
              </div>
               <div>
                <h3 className="font-semibold flex items-center gap-2"><Briefcase /> Experience</h3>
                <p className="text-muted-foreground mt-2 whitespace-pre-wrap">{analysis.experience}</p>
              </div>
              <div>
                <h3 className="font-semibold flex items-center gap-2"><GraduationCap /> Education</h3>
                <p className="text-muted-foreground mt-2 whitespace-pre-wrap">{analysis.education}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
