import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, Briefcase, FileText, Target, BookOpen } from "lucide-react";
import Link from "next/link";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts"

const jobTrendsData = [
    { name: "AI Engineer", jobs: 1200 },
    { name: "Data Scientist", jobs: 980 },
    { name: "UX Designer", jobs: 750 },
    { name: "DevOps Engineer", jobs: 1100 },
    { name: "Product Manager", jobs: 820 },
]

export default function Dashboard() {
  return (
    <>
        <h1 className="text-2xl font-semibold">Welcome back!</h1>
        <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Career Readiness
              </CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">78%</div>
              <Progress value={78} className="mt-2" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Skills Mastered
              </CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12 / 20</div>
              <p className="text-xs text-muted-foreground">
                +2 since last week
              </p>
            </CardContent>
          </Card>
           <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Matched Careers
              </CardTitle>
              <Briefcase className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3</div>
               <p className="text-xs text-muted-foreground">
                Based on your profile
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                ATS Score
              </CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">85</div>
               <p className="text-xs text-muted-foreground">
                From last resume scan
              </p>
            </CardContent>
          </Card>
        </div>
        <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
          <Card className="xl:col-span-2">
            <CardHeader>
              <CardTitle>Latest Job Trends</CardTitle>
              <CardDescription>
                Open positions in popular career paths this month.
              </CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={jobTrendsData}>
                        <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
                        <Bar dataKey="jobs" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>This Week's Action Plan</CardTitle>
              <CardDescription>
                Stay on track with these personalized suggestions.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
               <div className="flex items-center gap-4">
                  <div className="bg-muted p-2 rounded-full">
                    <Briefcase className="h-5 w-5 text-primary" />
                  </div>
                  <div className="grid gap-1">
                    <p className="text-sm font-medium leading-none">Practice Interview</p>
                    <p className="text-sm text-muted-foreground">For a 'Software Engineer' role.</p>
                  </div>
                  <Button asChild variant="outline" size="sm" className="ml-auto">
                    <Link href="/dashboard/mock-interview">Start</Link>
                  </Button>
               </div>
               <div className="flex items-center gap-4">
                  <div className="bg-muted p-2 rounded-full">
                    <FileText className="h-5 w-5 text-primary" />
                  </div>
                  <div className="grid gap-1">
                    <p className="text-sm font-medium leading-none">Update Resume</p>
                    <p className="text-sm text-muted-foreground">Add your latest project.</p>
                  </div>
                   <Button asChild variant="outline" size="sm" className="ml-auto">
                    <Link href="/dashboard/resume-analyzer">Update</Link>
                  </Button>
               </div>
               <div className="flex items-center gap-4">
                  <div className="bg-muted p-2 rounded-full">
                    <BookOpen className="h-5 w-5 text-primary" />
                  </div>
                  <div className="grid gap-1">
                    <p className="text-sm font-medium leading-none">Learn a new skill</p>
                    <p className="text-sm text-muted-foreground">'Advanced React Patterns'.</p>
                  </div>
                   <Button asChild variant="outline" size="sm" className="ml-auto">
                    <Link href="/dashboard/learning-roadmap">Learn</Link>
                  </Button>
               </div>
            </CardContent>
          </Card>
        </div>
    </>
  );
}
