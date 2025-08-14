
'use client';

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { useAuth } from "@/hooks/use-auth";
import { db, auth } from "@/lib/firebase";
import { doc, getDoc, setDoc, deleteDoc } from "firebase/firestore";
import { sendPasswordResetEmail, deleteUser } from "firebase/auth";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useRouter } from "next/navigation";


type NotificationSettings = {
    weeklySummary: boolean;
    jobAlerts: boolean;
}

export default function SettingsPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  const [settings, setSettings] = useState<NotificationSettings>({
    weeklySummary: false,
    jobAlerts: false,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    async function fetchSettings() {
      if (user) {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists() && docSnap.data().notificationSettings) {
          setSettings(docSnap.data().notificationSettings);
        }
      }
      setIsLoading(false);
    }
    fetchSettings();
  }, [user]);

  const handleNotificationChange = async (key: keyof NotificationSettings, value: boolean) => {
     if (!user) return;
     
     setIsSaving(true);
     const newSettings = { ...settings, [key]: value };
     setSettings(newSettings);

     try {
        const userRef = doc(db, "users", user.uid);
        await setDoc(userRef, { notificationSettings: newSettings }, { merge: true });
        toast({ title: "Settings Saved", description: "Your notification preferences have been updated." });
     } catch (error) {
        toast({ title: "Error", description: "Failed to save settings.", variant: 'destructive'});
     } finally {
        setIsSaving(false);
     }
  };

  const handlePasswordReset = async () => {
    if (!user || !user.email) {
      toast({ title: "Error", description: "You must be logged in to reset your password.", variant: "destructive" });
      return;
    }
    try {
      await sendPasswordResetEmail(auth, user.email);
      toast({ title: "Password Reset Email Sent", description: "Check your inbox for a link to reset your password." });
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  }

  const handleDeleteAccount = async () => {
     if (!user) {
        toast({ title: "Error", description: "You must be logged in to delete your account.", variant: "destructive" });
        return;
     }
     try {
        // First, delete Firestore document
        await deleteDoc(doc(db, "users", user.uid));
        // Then, delete the user from auth
        await deleteUser(user);
        toast({ title: "Account Deleted", description: "Your account has been permanently deleted." });
        router.push('/signup');
     } catch (error: any) {
        toast({ title: "Error Deleting Account", description: error.message, variant: "destructive" });
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
          <CardTitle>Notifications</CardTitle>
          <CardDescription>Manage how you receive notifications.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <Label htmlFor="weekly-summary" className="text-base font-medium">Weekly Summary</Label>
              <p className="text-sm text-muted-foreground">Receive a weekly email with your progress and action items.</p>
            </div>
            <Switch 
              id="weekly-summary" 
              checked={settings.weeklySummary} 
              onCheckedChange={(checked) => handleNotificationChange('weeklySummary', checked)}
              disabled={isSaving}
            />
          </div>
           <div className="flex items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <Label htmlFor="job-alerts" className="text-base font-medium">Job Alerts</Label>
              <p className="text-sm text-muted-foreground">Get notified about new jobs that match your profile.</p>
            </div>
            <Switch 
              id="job-alerts" 
              checked={settings.jobAlerts}
              onCheckedChange={(checked) => handleNotificationChange('jobAlerts', checked)} 
              disabled={isSaving}
            />
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Account</CardTitle>
          <CardDescription>Manage your account settings.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <div className="flex items-center justify-between rounded-lg border p-4">
                 <div className="space-y-0.5">
                    <Label className="text-base font-medium">Change Password</Label>
                    <p className="text-sm text-muted-foreground">Send a password reset link to your email.</p>
                 </div>
                 <Button variant="outline" onClick={handlePasswordReset}>Send Reset Link</Button>
            </div>
             <div className="flex items-center justify-between rounded-lg border border-destructive/50 p-4">
                 <div className="space-y-0.5">
                    <Label className="text-base font-medium text-destructive">Delete Account</Label>
                    <p className="text-sm text-muted-foreground">Permanently delete your account and all associated data. This action cannot be undone.</p>
                 </div>
                 <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete Account
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete your
                        account and remove your data from our servers.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleDeleteAccount}>Continue</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
            </div>
        </CardContent>
      </Card>
    </div>
  )
}
