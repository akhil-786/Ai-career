
'use client';

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useAuth } from "@/hooks/use-auth";
import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

type UserProfile = {
  name: string;
  email: string;
  skills: string;
  experience: string;
  interests: string;
}

export default function ProfilePage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [profile, setProfile] = useState<UserProfile>({
    name: '',
    email: '',
    skills: '',
    experience: '',
    interests: '',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    async function fetchProfile() {
      if (user) {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProfile(docSnap.data() as UserProfile);
        } else {
            // Pre-fill with user auth data if available
            setProfile(prev => ({...prev, name: user.displayName || '', email: user.email || ''}));
        }
      }
      setIsLoading(false);
    }
    fetchProfile();
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setProfile(prev => ({ ...prev, [id]: value }));
  };

  const handleSave = async () => {
    if (!user) {
        toast({ title: "Error", description: "You must be logged in to save.", variant: 'destructive'});
        return;
    }
    setIsSaving(true);
    try {
        const userRef = doc(db, "users", user.uid);
        await setDoc(userRef, profile, { merge: true });
        toast({ title: "Success", description: "Profile updated successfully." });
    } catch (error) {
        console.error("Error saving profile: ", error);
        toast({ title: "Error", description: "Failed to update profile.", variant: 'destructive'});
    } finally {
        setIsSaving(false);
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle>User Profile</CardTitle>
          <CardDescription>This information is used by the AI to provide personalized recommendations. Keep it up to date!</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" value={profile.name} onChange={handleInputChange} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={profile.email} onChange={handleInputChange} disabled />
          </div>
          <div className="space-y-2">
            <Label htmlFor="skills">Skills</Label>
            <Textarea id="skills" placeholder="e.g., React, Python, Project Management..." value={profile.skills} onChange={handleInputChange} />
            <p className="text-sm text-muted-foreground">Separate skills with a comma.</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="experience">Experience Summary</Label>
            <Textarea id="experience" placeholder="Summarize your professional experience here..." value={profile.experience} onChange={handleInputChange} rows={5} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="interests">Interests & Passions</Label>
            <Textarea id="interests" placeholder="What are you passionate about? e.g., building applications, data analysis, user experience..." value={profile.interests} onChange={handleInputChange} />
          </div>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Profile
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
